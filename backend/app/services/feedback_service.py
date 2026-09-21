from typing import Any, Dict, List, Optional
from backend.app.core.result import (
    BusinessRuleViolationError,
    DomainError,
    Failure,
    ResourceNotFoundError,
    Result,
    Success,
)
from backend.app.repositories.feedback_repository import FeedbackRepository
from backend.app.schemas.feedback import FeedbackCreate, FeedbackStatusUpdate

VALID_STATUSES = {"OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"}
VALID_CATEGORIES = {"NOISE", "REPAIR", "CLEANING", "SECURITY", "OTHER"}
VALID_PRIORITIES = {"LOW", "MEDIUM", "HIGH", "URGENT"}

class FeedbackService:
    def __init__(self, repo: Optional[FeedbackRepository] = None):
        self.repo = repo or FeedbackRepository()

    async def get_feedbacks(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> Result[List[Dict[str, Any]], DomainError]:
        feedbacks = await self.repo.find_all(status, category, search)
        return Success(feedbacks)

    async def get_feedback_by_id(self, feedback_id: str) -> Result[Dict[str, Any], DomainError]:
        feedback = await self.repo.find_by_id(feedback_id)
        if not feedback:
            return Failure(ResourceNotFoundError(f"Feedback with id '{feedback_id}' not found"))
        return Success(feedback)

    async def create_feedback(self, payload: FeedbackCreate) -> Result[Dict[str, Any], DomainError]:
        cat = payload.category.upper()
        if cat not in VALID_CATEGORIES:
            return Failure(
                BusinessRuleViolationError(
                    "INVALID_CATEGORY",
                    f"Invalid category '{payload.category}'. Allowed: {list(VALID_CATEGORIES)}",
                )
            )

        prio = payload.priority.upper()
        if prio not in VALID_PRIORITIES:
            return Failure(
                BusinessRuleViolationError(
                    "INVALID_PRIORITY",
                    f"Invalid priority '{payload.priority}'. Allowed: {list(VALID_PRIORITIES)}",
                )
            )

        created = await self.repo.create({
            "resident_id": payload.residentId,
            "apartment_id": payload.apartmentId,
            "title": payload.title,
            "category": cat,
            "content": payload.content,
            "priority": prio,
        })
        return Success(created)

    async def update_status(self, feedback_id: str, payload: FeedbackStatusUpdate) -> Result[Dict[str, Any], DomainError]:
        new_status = payload.status.upper()
        if new_status not in VALID_STATUSES:
            return Failure(
                BusinessRuleViolationError(
                    "INVALID_STATUS",
                    f"Invalid status '{payload.status}'. Allowed: {list(VALID_STATUSES)}",
                )
            )

        updated = await self.repo.update_status(
            feedback_id=feedback_id,
            new_status=new_status,
            message=payload.message,
            user_id=payload.userId,
        )
        if not updated:
            return Failure(ResourceNotFoundError(f"Feedback with id '{feedback_id}' not found"))
        return Success(updated)

