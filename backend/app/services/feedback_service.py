from typing import Any, Dict, List, Optional
from backend.app.core.errors import NotFoundError, ValidationError
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
    ) -> List[Dict[str, Any]]:
        return await self.repo.find_all(status, category, search)

    async def get_feedback_by_id(self, feedback_id: str) -> Dict[str, Any]:
        feedback = await self.repo.find_by_id(feedback_id)
        if not feedback:
            raise NotFoundError(f"Feedback with id '{feedback_id}' not found")
        return feedback

    async def create_feedback(self, payload: FeedbackCreate) -> Dict[str, Any]:
        cat = payload.category.upper()
        if cat not in VALID_CATEGORIES:
            raise ValidationError(f"Invalid category '{payload.category}'. Allowed: {list(VALID_CATEGORIES)}")

        prio = payload.priority.upper()
        if prio not in VALID_PRIORITIES:
            raise ValidationError(f"Invalid priority '{payload.priority}'. Allowed: {list(VALID_PRIORITIES)}")

        created = await self.repo.create({
            "resident_id": payload.residentId,
            "apartment_id": payload.apartmentId,
            "title": payload.title,
            "category": cat,
            "content": payload.content,
            "priority": prio,
        })
        return created

    async def update_status(self, feedback_id: str, payload: FeedbackStatusUpdate) -> Dict[str, Any]:
        new_status = payload.status.upper()
        if new_status not in VALID_STATUSES:
            raise ValidationError(f"Invalid status '{payload.status}'. Allowed: {list(VALID_STATUSES)}")

        updated = await self.repo.update_status(
            feedback_id=feedback_id,
            new_status=new_status,
            message=payload.message,
            user_id=payload.userId,
        )
        if not updated:
            raise NotFoundError(f"Feedback with id '{feedback_id}' not found")
        return updated
