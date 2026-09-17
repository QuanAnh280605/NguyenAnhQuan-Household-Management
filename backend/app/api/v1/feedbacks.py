from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.response import api_success
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
    feedbacks = await service.get_feedbacks(status, category, search)
    return api_success(feedbacks)

@router.post("", status_code=status.HTTP_201_CREATED, summary="Submit Incident Report")
async def create_feedback(payload: FeedbackCreate):
    created = await service.create_feedback(payload)
    return api_success(created)

@router.get("/{feedback_id}", summary="Get Feedback Details & Progress History")
async def get_feedback(feedback_id: str):
    feedback = await service.get_feedback_by_id(feedback_id)
    return api_success(feedback)

@router.patch("/{feedback_id}/status", summary="Update Incident SLA Progress / Status")
async def update_feedback_status(feedback_id: str, payload: FeedbackStatusUpdate):
    updated = await service.update_status(feedback_id, payload)
    return api_success(updated)
