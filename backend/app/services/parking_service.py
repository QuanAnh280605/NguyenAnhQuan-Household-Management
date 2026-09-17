from typing import Any, Dict, List, Optional
from backend.app.core.errors import ConcurrencyError, ConflictError, NotFoundError, ValidationError
from backend.app.db.session import get_db_pool
from backend.app.repositories.parking_repository import ParkingRepository
from backend.app.schemas.parking import AllocateSlotRequest, RegisterVehicleRequest

class ParkingService:
    def __init__(self, repo: Optional[ParkingRepository] = None):
        self.repo = repo or ParkingRepository()

    async def get_slots(
        self,
        floor: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        return await self.repo.find_all_slots(floor, status)

    async def register_vehicle(self, data: RegisterVehicleRequest) -> Dict[str, Any]:
        # 1. Enforce Quotas (US-VEH-01)
        if data.vehicleType == "CAR":
            active_cars = await self.repo.count_vehicles_by_apartment_and_type(data.apartmentId, "CAR")
            if active_cars >= 1:
                raise ValidationError("Vehicle quota exceeded: An apartment is permitted a maximum of 1 registered car")
        elif data.vehicleType == "MOTORBIKE":
            active_bikes = await self.repo.count_vehicles_by_apartment_and_type(data.apartmentId, "MOTORBIKE")
            if active_bikes >= 2:
                raise ValidationError("Vehicle quota exceeded: An apartment is permitted a maximum of 2 registered motorbikes")

        # 2. Prevent duplicate active plates
        normalized_plate = data.licensePlate.strip().upper()
        existing = await self.repo.find_vehicle_by_plate(normalized_plate)
        if existing and existing.get("status") == "ACTIVE":
            raise ConflictError(f"License plate '{normalized_plate}' is already registered and active in the system")

        return await self.repo.create_vehicle({
            "apartment_id": data.apartmentId,
            "resident_id": data.residentId,
            "license_plate": normalized_plate,
            "vehicle_type": data.vehicleType,
            "brand_model": data.brandModel,
            "color": data.color,
        })

    async def allocate_slot(self, data: AllocateSlotRequest) -> Dict[str, Any]:
        vehicle = await self.repo.find_vehicle_by_id(data.vehicleId)
        if not vehicle:
            raise NotFoundError(f"Vehicle with id '{data.vehicleId}' not found")

        if vehicle.get("apartment_id") != data.apartmentId:
            raise ValidationError("Vehicle does not belong to the declared apartment unit")

        pool = await get_db_pool()
        if pool:
            async with pool.acquire() as conn:
                async with conn.transaction():
                    slot = await self.repo.find_slot_with_lock(conn, data.slotId)
                    if not slot:
                        raise NotFoundError(f"Parking slot with id '{data.slotId}' not found")

                    if slot.get("status") != "AVAILABLE":
                        raise ConcurrencyError(
                            f"Parking slot '{slot.get('slot_code')}' is currently {slot.get('status', '').lower()} and cannot be allocated"
                        )

                    if slot.get("allowed_type") != vehicle.get("vehicle_type"):
                        raise ValidationError(
                            f"Slot is designated for {slot.get('allowed_type')}, incompatible with vehicle type {vehicle.get('vehicle_type')}"
                        )

                    await self.repo.allocate_slot(conn, data.slotId, data.vehicleId)
        else:
            # Mock / in-memory fallback for test environment
            slot = await self.repo.find_slot_by_id(data.slotId)
            if not slot:
                raise NotFoundError(f"Parking slot with id '{data.slotId}' not found")
            if slot.get("status") != "AVAILABLE":
                raise ConcurrencyError(f"Parking slot '{slot.get('slot_code')}' is currently {slot.get('status', '').lower()} and cannot be allocated")
            if slot.get("allowed_type") != vehicle.get("vehicle_type"):
                raise ValidationError(f"Slot is designated for {slot.get('allowed_type')}, incompatible with vehicle type {vehicle.get('vehicle_type')}")

        return {
            "message": "Successfully allocated parking slot",
            "slotId": data.slotId,
            "vehicleId": data.vehicleId,
        }
