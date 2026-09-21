from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.result import handle_result
from backend.app.schemas.resident import ResidentCreate, StayDeclarationRequest
from backend.app.services.resident_service import ResidentService

router = APIRouter()
service = ResidentService()

@router.get("", summary="List & Search Residents")
async def list_residents(
    search: Optional[str] = Query(None, description="Search citizen name, CCCD or phone"),
    status: Optional[str] = Query(None, description="Residency status (PERMANENT, TEMPORARY...)"),
):
    result = await service.get_residents(search, status)
    return handle_result(result)

@router.post("", status_code=status.HTTP_201_CREATED, summary="Register Household Member")
async def register_member(payload: ResidentCreate):
    result = await service.register_member(payload)
    return handle_result(result)

@router.post("/stay-declaration", status_code=status.HTTP_201_CREATED, summary="Declare Stay / Absence")
async def declare_stay(payload: StayDeclarationRequest):
    result = await service.declare_stay(payload)
    return handle_result(result)
