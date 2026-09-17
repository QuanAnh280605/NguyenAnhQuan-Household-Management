from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class FeedbackCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    residentId: str = Field(..., alias="resident_id", description="Resident creator ID")
    apartmentId: str = Field(..., alias="apartment_id", description="Apartment location ID")
    title: str = Field(..., min_length=5, max_length=255, description="Brief summary of issue")
    category: str = Field("OTHER", description="NOISE, REPAIR, CLEANING, SECURITY, OTHER")
    content: str = Field(..., min_length=10, description="Detailed defect description")
    priority: str = Field("MEDIUM", description="LOW, MEDIUM, HIGH, URGENT")

class FeedbackStatusUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: str = Field(..., description="New status: OPEN, IN_PROGRESS, RESOLVED, CLOSED")
    message: str = Field(..., min_length=5, description="Progress update reason or resolution details")
    userId: Optional[str] = Field(None, alias="user_id", description="Staff actor ID updating progress")

class FeedbackUpdateLogResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    feedbackId: str = Field(..., alias="feedback_id")
    updatedByUserId: str = Field(..., alias="updated_by_user_id")
    message: str
    previousStatus: Optional[str] = Field(None, alias="previous_status")
    newStatus: Optional[str] = Field(None, alias="new_status")
    createdAt: datetime = Field(..., alias="created_at")

class FeedbackResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    residentId: str = Field(..., alias="resident_id")
    apartmentId: str = Field(..., alias="apartment_id")
    assignedTo: Optional[str] = Field(None, alias="assigned_to")
    title: str
    category: str
    content: str
    priority: str
    status: str
    createdAt: datetime = Field(..., alias="created_at")
    resolvedAt: Optional[datetime] = Field(None, alias="resolved_at")
    residentName: Optional[str] = Field(None, alias="resident_name")
    roomNumber: Optional[str] = Field(None, alias="room_number")
    assignedStaffName: Optional[str] = Field(None, alias="assigned_staff_name")
    updates: Optional[List[FeedbackUpdateLogResponse]] = None
