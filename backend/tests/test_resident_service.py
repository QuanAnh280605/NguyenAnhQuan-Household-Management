import pytest
from pydantic import ValidationError as PydanticValidationError
from unittest.mock import AsyncMock
from backend.app.core.errors import ConflictError, NotFoundError, ValidationError
from backend.app.repositories.resident_repository import ResidentRepository
from backend.app.schemas.resident import ResidentCreate
from backend.app.services.resident_service import ResidentService

@pytest.fixture
def mock_repo():
    return AsyncMock(spec=ResidentRepository)

@pytest.fixture
def resident_service(mock_repo):
    return ResidentService(repo=mock_repo)

def test_register_member_invalid_cccd():
    # Pydantic schema validation strictly rejects non-12-digit CCCD
    with pytest.raises(PydanticValidationError) as excinfo:
        ResidentCreate(
            fullName="Nguyen Van A",
            citizenId="12345678901",  # 11 digits instead of 12
            dateOfBirth="1995-05-12",
            gender="MALE",
            phone="0912345678",
            apartmentId="apt-1",
            householdId="hh-1",
            relationshipToHead="CON",
        )
    assert "citizenId" in str(excinfo.value)

@pytest.mark.asyncio
async def test_register_member_duplicate_cccd(resident_service, mock_repo):
    mock_repo.find_by_citizen_id.return_value = {
        "id": "res-existing",
        "full_name": "Nguyen Van Existing",
        "citizen_id": "001099012345",
    }

    payload = ResidentCreate(
        fullName="Nguyen Van B",
        citizenId="001099012345",
        dateOfBirth="1995-05-12",
        gender="MALE",
        phone="0912345678",
        apartmentId="apt-1",
        householdId="hh-1",
        relationshipToHead="CON",
    )
    with pytest.raises(ConflictError) as excinfo:
        await resident_service.register_member(payload)
    assert "already registered" in str(excinfo.value)

@pytest.mark.asyncio
async def test_register_member_household_not_found(resident_service, mock_repo):
    mock_repo.find_by_citizen_id.return_value = None
    mock_repo.find_household_by_id.return_value = None

    payload = ResidentCreate(
        fullName="Nguyen Van C",
        citizenId="001099012345",
        dateOfBirth="1995-05-12",
        gender="MALE",
        phone="0912345678",
        apartmentId="apt-1",
        householdId="hh-not-found",
        relationshipToHead="CON",
    )
    with pytest.raises(NotFoundError):
        await resident_service.register_member(payload)
