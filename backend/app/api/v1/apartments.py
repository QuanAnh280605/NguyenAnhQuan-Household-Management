from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.response import api_success
from backend.app.schemas.apartment import ApartmentCreate, TransferOwnershipRequest
from backend.app.services.apartment_service import ApartmentService

router = APIRouter()
service = ApartmentService()

@router.get("", summary="List & Filter Apartments")
async def list_apartments(
    building: Optional[str] = Query(None, description="Tower code (e.g., Tower A)"),
    status: Optional[str] = Query(None, description="Status (EMPTY, RENTED, OWNER_OCCUPIED)"),
    search: Optional[str] = Query(None, description="Search room or owner name"),
):
    apartments = await service.get_apartments(building, status, search)
    return api_success(apartments)

@router.post("", status_code=status.HTTP_201_CREATED, summary="Onboard New Apartment")
async def create_apartment(payload: ApartmentCreate):
    created = await service.create_apartment(payload)
    return api_success(created)

@router.get("/{apartment_id}", summary="Get Apartment Dossier")
async def get_apartment(apartment_id: str):
    apartment = await service.get_apartment_by_id(apartment_id)
    return api_success(apartment)

@router.post("/{apartment_id}/transfer-ownership", summary="Transfer Ownership Deed")
async def transfer_ownership(apartment_id: str, payload: TransferOwnershipRequest):
    updated = await service.transfer_ownership(apartment_id, payload)
    return api_success(updated)
