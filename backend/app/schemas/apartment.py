from typing import Optional
from pydantic import BaseModel, Field, field_validator

class OwnerCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=255)
    citizenId: str = Field(..., pattern=r"^\d{12}$", description="12-digit Citizen ID (CCCD)")
    phone: str = Field(..., min_length=8, max_length=20)
    email: Optional[str] = None
    address: Optional[str] = None

class ApartmentCreate(BaseModel):
    buildingId: str
    roomNumber: str = Field(..., min_length=1, max_length=50)
    floor: int = Field(..., ge=1)
    area: float = Field(..., gt=0)
    bedroomCount: int = Field(default=1, ge=1)
    bathroomCount: int = Field(default=1, ge=1)
    owner: Optional[OwnerCreate] = None

class TransferOwnershipRequest(BaseModel):
    newOwner: OwnerCreate
    transferDate: str = Field(..., min_length=10)

class ApartmentOut(BaseModel):
    id: str
    building_id: str
    room_number: str
    floor: int
    area: float
    bedroom_count: int
    bathroom_count: int
    status: str
    building_code: Optional[str] = None
    building_name: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    owner_cccd: Optional[str] = None
