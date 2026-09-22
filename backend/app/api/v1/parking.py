from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from backend.app.api.deps import require_roles
from backend.app.core.result import handle_result
from backend.app.schemas.auth import UserResponse
from backend.app.schemas.parking import AllocateSlotRequest, RegisterVehicleRequest
from backend.app.services.parking_service import ParkingService

router = APIRouter()
service = ParkingService()

@router.get("/slots", summary="Get Basement Parking Floorplan")
async def get_slots(
    floor: Optional[str] = Query(None, description="Basement floor (B1, B2)"),
    status: Optional[str] = Query(None, description="Status (AVAILABLE, OCCUPIED, RESERVED)"),
):
    result = await service.get_slots(floor, status)
    return handle_result(result)

@router.post("/slots/allocate", summary="Allocate Parking Slot (Pessimistic Lock)")
async def allocate_slot(
    payload: AllocateSlotRequest,
    current_user: UserResponse = Depends(require_roles("ADMIN", "MANAGER", "TECHNICIAN")),
):
    result = await service.allocate_slot(payload)
    return handle_result(result)

@router.post("/vehicles", status_code=status.HTTP_201_CREATED, summary="Register Vehicle")
async def register_vehicle(
    payload: RegisterVehicleRequest,
    current_user: UserResponse = Depends(require_roles("ADMIN", "MANAGER")),
):
    result = await service.register_vehicle(payload)
    return handle_result(result)

