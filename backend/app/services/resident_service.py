import re
from typing import Any, Dict, List, Optional
from backend.app.core.result import (
    BusinessRuleViolationError,
    ConflictDomainError,
    DomainError,
    Failure,
    ResourceNotFoundError,
    Result,
    Success,
)
from backend.app.repositories.resident_repository import ResidentRepository
from backend.app.schemas.resident import ResidentCreate, StayDeclarationRequest

class ResidentService:
    def __init__(self, repo: Optional[ResidentRepository] = None):
        self.repo = repo or ResidentRepository()

    async def get_residents(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None
    ) -> Result[List[Dict[str, Any]], DomainError]:
        residents = await self.repo.find_all(search, status)
        return Success(residents)

    async def get_resident_by_id(self, resident_id: str) -> Result[Dict[str, Any], DomainError]:
        resident = await self.repo.find_by_id(resident_id)
        if not resident:
            return Failure(ResourceNotFoundError(f"Resident with id '{resident_id}' not found"))
        return Success(resident)

    async def register_member(self, data: ResidentCreate) -> Result[Dict[str, Any], DomainError]:
        if not re.match(r"^\d{12}$", data.citizenId):
            return Failure(
                BusinessRuleViolationError(
                    "INVALID_CCCD",
                    "Citizen ID (CCCD) must contain exactly 12 numeric digits",
                )
            )

        existing = await self.repo.find_by_citizen_id(data.citizenId)
        if existing:
            return Failure(
                ConflictDomainError(
                    "DUPLICATE_CCCD",
                    f"Citizen ID '{data.citizenId}' is already registered to resident '{existing.get('full_name')}'",
                )
            )

        household = await self.repo.find_household_by_id(data.householdId)
        if not household:
            return Failure(ResourceNotFoundError(f"Household with id '{data.householdId}' not found"))

        created = await self.repo.create_resident({
            "full_name": data.fullName,
            "citizen_id": data.citizenId,
            "date_of_birth": data.dateOfBirth,
            "gender": data.gender,
            "phone": data.phone,
            "email": data.email,
            "hometown": data.hometown,
            "resident_status": "PERMANENT",
        })

        await self.repo.add_member_to_household(
            household_id=data.householdId,
            resident_id=created["id"],
            relationship=data.relationshipToHead,
            is_head=data.isHead,
        )

        return await self.get_resident_by_id(created["id"])

    async def declare_stay(self, data: StayDeclarationRequest) -> Result[Dict[str, Any], DomainError]:
        res = await self.get_resident_by_id(data.residentId)
        if res.is_failure:
            return res

        if data.endDate and data.endDate < data.startDate:
            return Failure(
                BusinessRuleViolationError("INVALID_DATE_RANGE", "End date must be on or after start date")
            )

        record = await self.repo.create_stay_record({
            "resident_id": data.residentId,
            "apartment_id": data.apartmentId,
            "record_type": data.recordType,
            "start_date": data.startDate,
            "end_date": data.endDate,
            "reason": data.reason,
            "police_verified_code": data.policeVerifiedCode,
        })
        return Success(record)

