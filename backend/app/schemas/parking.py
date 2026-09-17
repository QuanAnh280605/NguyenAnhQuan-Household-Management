from typing import Literal, Optional
from pydantic import BaseModel, Field

class AllocateSlotRequest(BaseModel):
    slotId: str
    vehicleId: str
    apartmentId: str

class RegisterVehicleRequest(BaseModel):
    apartmentId: str
    residentId: str
    licensePlate: str = Field(..., min_length=3, max_length=30)
    vehicleType: Literal["CAR", "MOTORBIKE", "ELECTRIC_BIKE", "BICYCLE", "OTHER"]
    brandModel: Optional[str] = None
    color: Optional[str] = None

class SlotOut(BaseModel):
    id: str
    building_id: str
    slot_code: str
    floor: str
    allowed_type: str
    status: str
    vehicle_id: Optional[str] = None
    license_plate: Optional[str] = None

class VehicleOut(BaseModel):
    id: str
    apartment_id: str
    resident_id: str
    parking_slot_id: Optional[str] = None
    license_plate: str
    vehicle_type: str
    brand_model: Optional[str] = None
    color: Optional[str] = None
    rfid_card_number: Optional[str] = None
    status: str
