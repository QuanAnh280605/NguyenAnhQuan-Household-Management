from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from backend.app.api.deps import require_roles
from backend.app.core.result import handle_result
from backend.app.schemas.apartment import ApartmentCreate, TransferOwnershipRequest
from backend.app.schemas.auth import UserResponse
from backend.app.services.apartment_service import ApartmentService

router = APIRouter()
service = ApartmentService()

@router.get("", summary="List & Filter Apartments")
async def list_apartments(
    building: Optional[str] = Query(None, description="Tower code (e.g., Tower A)"),
    status: Optional[str] = Query(None, description="Status (EMPTY, RENTED, OWNER_OCCUPIED)"),
    search: Optional[str] = Query(None, description="Search room or owner name"),
):
    result = await service.get_apartments(building, status, search)
    return handle_result(result)

@router.post("", status_code=status.HTTP_201_CREATED, summary="Onboard New Apartment")
async def create_apartment(
    payload: ApartmentCreate,
    current_user: UserResponse = Depends(require_roles("ADMIN", "MANAGER")),
):
    result = await service.create_apartment(payload)
    return handle_result(result)

@router.get("/{apartment_id}", summary="Get Apartment Dossier")
async def get_apartment(apartment_id: str):
    result = await service.get_apartment_by_id(apartment_id)
    return handle_result(result)

@router.post("/{apartment_id}/transfer-ownership", summary="Transfer Ownership Deed")
async def transfer_ownership(
    apartment_id: str,
    payload: TransferOwnershipRequest,
    current_user: UserResponse = Depends(require_roles("ADMIN", "MANAGER")),
):
    result = await service.transfer_ownership(apartment_id, payload)
    return handle_result(result)


