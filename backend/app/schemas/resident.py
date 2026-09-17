from typing import Literal, Optional
from pydantic import BaseModel, Field

class ResidentCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=255)
    citizenId: str = Field(..., pattern=r"^\d{12}$", description="Must be exactly 12 numeric digits")
    dateOfBirth: str = Field(..., min_length=10)
    gender: Literal["MALE", "FEMALE", "OTHER"]
    phone: str = Field(..., min_length=8, max_length=20)
    email: Optional[str] = None
    hometown: Optional[str] = None
    apartmentId: str
    householdId: str
    relationshipToHead: str = Field(..., min_length=1)
    isHead: bool = False

class StayDeclarationRequest(BaseModel):
    residentId: str
    apartmentId: str
    recordType: Literal["TAM_TRU", "TAM_VANG", "NHAP_HO", "CHUYEN_DI"]
    startDate: str = Field(..., min_length=10)
    endDate: Optional[str] = None
    reason: str = Field(..., min_length=3, max_length=500)
    policeVerifiedCode: Optional[str] = None

class ResidentOut(BaseModel):
    id: str
    full_name: str
    citizen_id: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: str
    phone: Optional[str] = None
    email: Optional[str] = None
    hometown: Optional[str] = None
    resident_status: str
    household_id: Optional[str] = None
    household_code: Optional[str] = None
    room_number: Optional[str] = None
    relationship_to_head: Optional[str] = None
    is_head: Optional[bool] = False
