from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.response import api_success
from backend.app.schemas.parking import AllocateSlotRequest, RegisterVehicleRequest
from backend.app.services.parking_service import ParkingService

router = APIRouter()
service = ParkingService()

@router.get("/slots", summary="Get Basement Parking Floorplan")
async def get_slots(
    floor: Optional[str] = Query(None, description="Basement floor (B1, B2)"),
    status: Optional[str] = Query(None, description="Status (AVAILABLE, OCCUPIED, RESERVED)"),
):
    slots = await service.get_slots(floor, status)
    return api_success(slots)

@router.post("/slots/allocate", summary="Allocate Parking Slot (Pessimistic Lock)")
async def allocate_slot(payload: AllocateSlotRequest):
    result = await service.allocate_slot(payload)
    return api_success(result)

@router.post("/vehicles", status_code=status.HTTP_201_CREATED, summary="Register Vehicle")
async def register_vehicle(payload: RegisterVehicleRequest):
    vehicle = await service.register_vehicle(payload)
    return api_success(vehicle)
