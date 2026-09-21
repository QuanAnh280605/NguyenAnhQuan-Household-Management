"""
ResidentHub — Saga / Workflow Engine & Compensation Mechanics
Modeled after FlowX Multi-Step Workflow & Saga Pattern.

Key Architectural Guarantees:
1. Sequential Forward Execution: Steps execute in strict deterministic order (1 -> N).
2. Backward Compensation Guarantee: If Step k fails, the engine halts forward progress
   and executes compensating transactions on previously completed steps in reverse order (k-1 -> 1).
3. Result Pattern Integration: Native compatibility with Result[T, DomainError], Success, and Failure.
4. Durable Step Journaling: Complete audit trail recording execution states, durations, and diagnostics.
"""

from abc import ABC, abstractmethod
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
import uuid

from backend.app.core.result import DomainError, Failure, Result, Success


class SagaStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    COMPENSATING = "COMPENSATING"
    COMPENSATED = "COMPENSATED"
    COMPENSATION_FAILED = "COMPENSATION_FAILED"
    FAILED = "FAILED"


class StepStatus(str, Enum):
    PENDING = "PENDING"
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    COMPENSATING = "COMPENSATING"
    COMPENSATED = "COMPENSATED"
    COMPENSATION_FAILED = "COMPENSATION_FAILED"


class StepRecord:
    """Immutable audit entry for a saga step execution."""

    def __init__(
        self,
        step_name: str,
        status: StepStatus,
        started_at: str,
        completed_at: Optional[str] = None,
        error: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        self.step_name = step_name
        self.status = status
        self.started_at = started_at
        self.completed_at = completed_at
        self.error = error
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "stepName": self.step_name,
            "status": self.status.value,
            "startedAt": self.started_at,
            "completedAt": self.completed_at,
            "error": self.error,
            "metadata": self.metadata,
        }

    def __repr__(self) -> str:
        return f"<StepRecord {self.step_name}: {self.status.value} error={self.error}>"


class SagaContext:
    """
    Execution context shared across all steps within a saga lifecycle.
    Carries state, parameters, step journals, and diagnostic metadata.
    """

    def __init__(
        self,
        saga_id: Optional[str] = None,
        name: str = "AnonymousSaga",
        initial_data: Optional[Dict[str, Any]] = None,
    ):
        self.saga_id = saga_id or str(uuid.uuid4())
        self.name = name
        self.status = SagaStatus.PENDING
        self.data: Dict[str, Any] = initial_data or {}
        self.step_journal: List[StepRecord] = []
        self.created_at = datetime.now(timezone.utc).isoformat()
        self.completed_at: Optional[str] = None

    def get(self, key: str, default: Any = None) -> Any:
        return self.data.get(key, default)

    def set(self, key: str, value: Any) -> None:
        self.data[key] = value

    def add_journal(self, record: StepRecord) -> None:
        self.step_journal.append(record)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "sagaId": self.saga_id,
            "workflowName": self.name,
            "status": self.status.value,
            "createdAt": self.created_at,
            "completedAt": self.completed_at,
            "journal": [rec.to_dict() for rec in self.step_journal],
            "data": self.data,
        }


class SagaExecutionError(DomainError):
    """Domain error representing a saga failure and compensation outcome."""

    def __init__(
        self,
        saga_name: str,
        failed_step: str,
        underlying_error: Optional[DomainError],
        context: SagaContext,
    ):
        error_msg = (
            f"Saga '{saga_name}' failed at step '{failed_step}': "
            f"{underlying_error.message if underlying_error else 'Unknown error'}. "
            f"Compensation status: {context.status.value}"
        )
        super().__init__(
            code="SAGA_EXECUTION_FAILED",
            message=error_msg,
            status_code=400,
            details={
                "sagaId": context.saga_id,
                "workflowName": saga_name,
                "failedStep": failed_step,
                "sagaStatus": context.status.value,
                "underlyingErrorCode": underlying_error.code if underlying_error else None,
                "journal": [r.to_dict() for r in context.step_journal],
            },
        )
        self.failed_step = failed_step
        self.underlying_error = underlying_error
        self.context = context

    def to_exception(self):
        from backend.app.core.errors import AppError
        return AppError(
            message=self.message,
            status_code=400,
            error_code=self.code,
            details=self.details,
        )


class SagaStep(ABC):
    """
    Abstract base class for all discrete units of work within a Saga.
    Must define both forward action (execute) and backward rollback (compensate).
    """

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def execute(self, ctx: SagaContext) -> Result[Any, DomainError]:
        """Forward action: performs idempotent business logic and updates ctx."""
        raise NotImplementedError

    @abstractmethod
    async def compensate(self, ctx: SagaContext) -> Result[Any, DomainError]:
        """Compensating action: reverts effects made by this step in execute()."""
        raise NotImplementedError


class Saga:
    """
    Orchestration Workflow Engine that executes SagaStep definitions sequentially.
    Handles automatic reverse compensation on failure and maintains durable journaling.
    """

    def __init__(self, name: str, steps: Optional[List[SagaStep]] = None):
        self.name = name
        self.steps: List[SagaStep] = steps or []

    def add_step(self, step: SagaStep) -> "Saga":
        self.steps.append(step)
        return self

    async def run(
        self, initial_data: Optional[Dict[str, Any]] = None
    ) -> Result[SagaContext, SagaExecutionError]:
        ctx = SagaContext(name=self.name, initial_data=initial_data)
        ctx.status = SagaStatus.RUNNING

        executed_steps: List[SagaStep] = []

        for step in self.steps:
            started_at = datetime.now(timezone.utc).isoformat()
            ctx.add_journal(
                StepRecord(
                    step_name=step.name,
                    status=StepStatus.STARTED,
                    started_at=started_at,
                )
            )

            try:
                exec_result = await step.execute(ctx)
            except Exception as exc:
                exec_result = Failure(
                    DomainError(
                        code="UNEXPECTED_STEP_EXCEPTION",
                        message=f"Step '{step.name}' raised unhandled exception: {str(exc)}",
                        status_code=500,
                    )
                )

            if exec_result.is_failure:
                completed_at = datetime.now(timezone.utc).isoformat()
                ctx.add_journal(
                    StepRecord(
                        step_name=step.name,
                        status=StepStatus.FAILED,
                        started_at=started_at,
                        completed_at=completed_at,
                        error=exec_result.error.message,
                        metadata={"errorCode": exec_result.error.code},
                    )
                )

                # Initiate backward compensation on completed steps in reverse order
                await self._compensate_executed_steps(executed_steps, ctx)
                ctx.completed_at = datetime.now(timezone.utc).isoformat()

                return Failure(
                    SagaExecutionError(
                        saga_name=self.name,
                        failed_step=step.name,
                        underlying_error=exec_result.error,
                        context=ctx,
                    )
                )

            # Step succeeded forward
            completed_at = datetime.now(timezone.utc).isoformat()
            ctx.add_journal(
                StepRecord(
                    step_name=step.name,
                    status=StepStatus.COMPLETED,
                    started_at=started_at,
                    completed_at=completed_at,
                    metadata={"result": str(exec_result.value)[:200] if exec_result.value else None},
                )
            )
            executed_steps.append(step)

        # All steps succeeded
        ctx.status = SagaStatus.COMPLETED
        ctx.completed_at = datetime.now(timezone.utc).isoformat()
        return Success(ctx)

    async def _compensate_executed_steps(
        self, executed_steps: List[SagaStep], ctx: SagaContext
    ) -> None:
        """Executes compensation routines in strict reverse order (LIFO)."""
        ctx.status = SagaStatus.COMPENSATING
        all_compensations_succeeded = True

        for step in reversed(executed_steps):
            comp_started = datetime.now(timezone.utc).isoformat()
            ctx.add_journal(
                StepRecord(
                    step_name=step.name,
                    status=StepStatus.COMPENSATING,
                    started_at=comp_started,
                )
            )

            try:
                comp_result = await step.compensate(ctx)
            except Exception as exc:
                comp_result = Failure(
                    DomainError(
                        code="COMPENSATION_EXCEPTION",
                        message=f"Compensation for '{step.name}' failed: {str(exc)}",
                        status_code=500,
                    )
                )

            comp_ended = datetime.now(timezone.utc).isoformat()
            if comp_result.is_failure:
                all_compensations_succeeded = False
                ctx.add_journal(
                    StepRecord(
                        step_name=step.name,
                        status=StepStatus.COMPENSATION_FAILED,
                        started_at=comp_started,
                        completed_at=comp_ended,
                        error=comp_result.error.message,
                    )
                )
            else:
                ctx.add_journal(
                    StepRecord(
                        step_name=step.name,
                        status=StepStatus.COMPENSATED,
                        started_at=comp_started,
                        completed_at=comp_ended,
                    )
                )

        if all_compensations_succeeded:
            ctx.status = SagaStatus.COMPENSATED
        else:
            ctx.status = SagaStatus.COMPENSATION_FAILED
