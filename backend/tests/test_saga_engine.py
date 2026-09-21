import pytest
from starlette.testclient import TestClient

from backend.app.core.saga import (
    Saga,
    SagaContext,
    SagaStatus,
    SagaStep,
    StepStatus,
)
from backend.app.core.result import Failure, Success, BusinessRuleViolationError
from backend.app.main import app
from backend.app.services.billing_service import BillingService
from backend.app.services.sagas.billing_batch_saga import (
    AuditAndLockMetersStep,
    DispatchNotificationsStep,
    GenerateBatchInvoicesStep,
    IssueVietQrSessionsStep,
    MonthEndBillingSaga,
    create_month_end_billing_saga,
)

client = TestClient(app)


@pytest.mark.asyncio
async def test_saga_happy_path():
    """Verify end-to-end forward execution of MonthEndBillingSaga."""
    saga = create_month_end_billing_saga()
    result = await saga.run({"month": "10/2025"})

    assert result.is_success
    ctx = result.value
    assert ctx.status == SagaStatus.COMPLETED
    assert ctx.get("meters_locked") is True
    assert ctx.get("total_invoices_generated") == 3
    assert len(ctx.get("vietqr_sessions")) == 3
    assert ctx.get("notifications_dispatched") is True

    # Journal verification
    completed_steps = [
        r.step_name for r in ctx.step_journal if r.status == StepStatus.COMPLETED
    ]
    assert completed_steps == [
        "AuditAndLockMetersStep",
        "GenerateBatchInvoicesStep",
        "IssueVietQrSessionsStep",
        "DispatchNotificationsStep",
    ]


@pytest.mark.asyncio
async def test_saga_failure_step3_and_reverse_compensation():
    """
    Verify failure twin at Step 3 (VietQR gateway failure):
    1. Forward halts at Step 3.
    2. Step 2 and Step 1 are compensated in strict reverse order (2 -> 1).
    3. Saga finishes in COMPENSATED state.
    """
    saga = create_month_end_billing_saga()
    result = await saga.run({
        "month": "10/2025",
        "simulate_failure_step": "IssueVietQrSessionsStep",
    })

    assert result.is_failure
    error = result.error
    assert error.code == "SAGA_EXECUTION_FAILED"
    assert error.failed_step == "IssueVietQrSessionsStep"
    assert error.context.status == SagaStatus.COMPENSATED

    ctx = error.context
    # Step 2 compensated: invoices voided
    assert ctx.get("invoices_voided") is True
    assert ctx.get("total_invoices_generated") == 0

    # Step 1 compensated: meters unlocked
    assert ctx.get("meters_locked") is False
    assert ctx.get("meters_audit_reverted") is True

    # Step 4 was never executed
    assert ctx.get("notifications_dispatched") is None

    # Verify reverse compensation order in journal
    compensation_records = [
        r.step_name for r in ctx.step_journal if r.status == StepStatus.COMPENSATING
    ]
    assert compensation_records == ["GenerateBatchInvoicesStep", "AuditAndLockMetersStep"]


@pytest.mark.asyncio
async def test_saga_failure_step1_immediate_exit():
    """Verify failure at Step 1 aborts immediately with 0 compensations needed."""
    saga = create_month_end_billing_saga()
    result = await saga.run({
        "month": "10/2025",
        "simulate_failure_step": "AuditAndLockMetersStep",
    })

    assert result.is_failure
    assert result.error.failed_step == "AuditAndLockMetersStep"
    ctx = result.error.context
    assert ctx.status == SagaStatus.COMPENSATED
    assert ctx.get("meters_locked") is None

    # No steps to compensate
    comp_records = [r for r in ctx.step_journal if r.status == StepStatus.COMPENSATING]
    assert len(comp_records) == 0


@pytest.mark.asyncio
async def test_billing_service_saga_wrapper():
    """Verify BillingService saga execution method."""
    service = BillingService()
    result = await service.run_month_end_billing_saga(month="11/2025")

    assert result.is_success
    data = result.value
    assert data["status"] == "COMPLETED"
    assert data["month"] == "11/2025"
    assert data["totalInvoicesGenerated"] == 3
    assert data["totalAmountVnd"] > 0
    assert len(data["journal"]) > 0


def test_api_batch_saga_endpoint_success():
    """Test HTTP POST /api/v1/billing/invoices/batch-saga happy path."""
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={"month": "10/2025", "dryRun": False},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["status"] == "COMPLETED"
    assert body["data"]["totalInvoicesGenerated"] == 3


def test_api_batch_saga_endpoint_simulated_failure():
    """Test HTTP POST /api/v1/billing/invoices/batch-saga with simulated failure twin."""
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={
            "month": "10/2025",
            "simulateFailureStep": "IssueVietQrSessionsStep",
            "dryRun": False,
        },
    )
    assert response.status_code == 400
    body = response.json()
    assert body["code"] == "SAGA_EXECUTION_FAILED"
    assert body["errors"]["failedStep"] == "IssueVietQrSessionsStep"
    assert body["errors"]["sagaStatus"] == "COMPENSATED"
