from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.result import handle_result
from backend.app.schemas.feedback import FeedbackCreate, FeedbackStatusUpdate
from backend.app.services.feedback_service import FeedbackService

router = APIRouter()
service = FeedbackService()

@router.get("", summary="List & Filter Feedbacks & Tickets")
async def list_feedbacks(
    status: Optional[str] = Query(None, description="Status filter (OPEN, IN_PROGRESS, RESOLVED, CLOSED)"),
    category: Optional[str] = Query(None, description="Category filter (REPAIR, NOISE, CLEANING, SECURITY)"),
    search: Optional[str] = Query(None, description="Search by title or room number"),
):
    result = await service.get_feedbacks(status, category, search)
    return handle_result(result)

@router.post("", status_code=status.HTTP_201_CREATED, summary="Submit Incident Report")
async def create_feedback(payload: FeedbackCreate):
    result = await service.create_feedback(payload)
    return handle_result(result)

@router.get("/{feedback_id}", summary="Get Feedback Details & Progress History")
async def get_feedback(feedback_id: str):
    result = await service.get_feedback_by_id(feedback_id)
    return handle_result(result)

@router.patch("/{feedback_id}/status", summary="Update Incident SLA Progress / Status")
async def update_feedback_status(feedback_id: str, payload: FeedbackStatusUpdate):
    result = await service.update_status(feedback_id, payload)
    return handle_result(result)

