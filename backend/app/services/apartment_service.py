from datetime import date
from typing import Any, Dict, List, Optional
from backend.app.core.errors import ConflictError, NotFoundError, ValidationError
from backend.app.repositories.apartment_repository import ApartmentRepository
from backend.app.schemas.apartment import ApartmentCreate, TransferOwnershipRequest

class ApartmentService:
    def __init__(self, repo: Optional[ApartmentRepository] = None):
        self.repo = repo or ApartmentRepository()

    async def get_apartments(
        self,
        building: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return await self.repo.find_all(building, status, search)

    async def get_apartment_by_id(self, apartment_id: str) -> Dict[str, Any]:
        apartment = await self.repo.find_by_id(apartment_id)
        if not apartment:
            raise NotFoundError(f"Apartment with id '{apartment_id}' not found")
        return apartment

    async def create_apartment(self, data: ApartmentCreate) -> Dict[str, Any]:
        if data.area <= 0:
            raise ValidationError("Net usable area must be greater than 0 m²")

        existing = await self.repo.find_by_room_number(data.buildingId, data.roomNumber)
        if existing:
            raise ConflictError(f"Apartment with room number '{data.roomNumber}' already exists in this building")

        status = "OWNER_OCCUPIED" if data.owner else "EMPTY"
        created = await self.repo.create({
            "building_id": data.buildingId,
            "room_number": data.roomNumber,
            "floor": data.floor,
            "area": data.area,
            "bedroom_count": data.bedroomCount,
            "bathroom_count": data.bathroomCount,
            "status": status,
        })

        if data.owner:
            owner = await self.repo.find_owner_by_citizen_id(data.owner.citizenId)
            if not owner:
                owner = await self.repo.create_owner({
                    "full_name": data.owner.fullName,
                    "citizen_id": data.owner.citizenId,
                    "phone": data.owner.phone,
                    "email": data.owner.email,
                    "address": data.owner.address,
                })
            today = date.today().isoformat()
            await self.repo.link_owner(created["id"], owner["id"], today)

        return await self.get_apartment_by_id(created["id"])

    async def transfer_ownership(self, apartment_id: str, data: TransferOwnershipRequest) -> Dict[str, Any]:
        await self.get_apartment_by_id(apartment_id)

        owner = await self.repo.find_owner_by_citizen_id(data.newOwner.citizenId)
        if not owner:
            owner = await self.repo.create_owner({
                "full_name": data.newOwner.fullName,
                "citizen_id": data.newOwner.citizenId,
                "phone": data.newOwner.phone,
                "email": data.newOwner.email,
                "address": data.newOwner.address,
            })

        await self.repo.archive_previous_owners(apartment_id, data.transferDate)
        await self.repo.link_owner(apartment_id, owner["id"], data.transferDate)

        return await self.get_apartment_by_id(apartment_id)
