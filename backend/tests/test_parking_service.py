import pytest
from unittest.mock import AsyncMock
from backend.app.core.errors import ConcurrencyError, ConflictError, ValidationError
from backend.app.repositories.parking_repository import ParkingRepository
from backend.app.schemas.parking import AllocateSlotRequest, RegisterVehicleRequest
from backend.app.services.parking_service import ParkingService

@pytest.fixture
def mock_repo():
    return AsyncMock(spec=ParkingRepository)

@pytest.fixture
def parking_service(mock_repo):
    return ParkingService(repo=mock_repo)

@pytest.mark.asyncio
async def test_register_vehicle_car_quota_exceeded(parking_service, mock_repo):
    mock_repo.count_vehicles_by_apartment_and_type.return_value = 1

    payload = RegisterVehicleRequest(
        apartmentId="apt-uuid-1",
        residentId="res-uuid-1",
        licensePlate="30E-999.88",
        vehicleType="CAR",
    )
    with pytest.raises(ValidationError) as excinfo:
        await parking_service.register_vehicle(payload)
    assert "quota exceeded" in str(excinfo.value)

@pytest.mark.asyncio
async def test_register_vehicle_motorbike_quota_exceeded(parking_service, mock_repo):
    mock_repo.count_vehicles_by_apartment_and_type.return_value = 2

    payload = RegisterVehicleRequest(
        apartmentId="apt-uuid-1",
        residentId="res-uuid-1",
        licensePlate="29A-123.45",
        vehicleType="MOTORBIKE",
    )
    with pytest.raises(ValidationError) as excinfo:
        await parking_service.register_vehicle(payload)
    assert "quota exceeded" in str(excinfo.value)

@pytest.mark.asyncio
async def test_register_vehicle_duplicate_plate(parking_service, mock_repo):
    mock_repo.count_vehicles_by_apartment_and_type.return_value = 0
    mock_repo.find_vehicle_by_plate.return_value = {
        "id": "v-1",
        "license_plate": "30E-999.88",
        "status": "ACTIVE",
    }

    payload = RegisterVehicleRequest(
        apartmentId="apt-uuid-1",
        residentId="res-uuid-1",
        licensePlate="30e-999.88",
        vehicleType="CAR",
    )
    with pytest.raises(ConflictError) as excinfo:
        await parking_service.register_vehicle(payload)
    assert "already registered" in str(excinfo.value)

@pytest.mark.asyncio
async def test_allocate_slot_occupied_concurrency_error(parking_service, mock_repo):
    mock_repo.find_vehicle_by_id.return_value = {
        "id": "veh-1",
        "apartment_id": "apt-1",
        "vehicle_type": "CAR",
    }
    mock_repo.find_slot_by_id.return_value = {
        "id": "slot-1",
        "slot_code": "B1-A01",
        "status": "OCCUPIED",
        "allowed_type": "CAR",
    }

    payload = AllocateSlotRequest(
        slotId="slot-1",
        vehicleId="veh-1",
        apartmentId="apt-1",
    )
    with pytest.raises(ConcurrencyError):
        await parking_service.allocate_slot(payload)
