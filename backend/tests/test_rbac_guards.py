import pytest
from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def get_token_for(username: str, password: str = "Admin@123") -> str:
    res = client.post("/api/v1/auth/login", json={"username": username, "password": password})
    assert res.status_code == 200, f"Login failed for {username}: {res.text}"
    return res.json()["data"]["accessToken"]


def test_missing_auth_header_returns_401():
    """Unauthenticated requests to protected endpoints receive 401 UNAUTHORIZED."""
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={"month": "10/2025"},
    )
    assert response.status_code == 401
    assert response.headers["content-type"] == "application/problem+json"
    problem = response.json()
    assert problem["code"] == "UNAUTHORIZED"
    assert "Missing Authorization header" in problem["detail"]


def test_malformed_auth_header_returns_401():
    """Malformed Authorization headers receive 401 UNAUTHORIZED."""
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={"month": "10/2025"},
        headers={"Authorization": "InvalidTokenWithoutBearer"},
    )
    assert response.status_code == 401
    problem = response.json()
    assert problem["code"] == "UNAUTHORIZED"
    assert "Malformed Authorization header" in problem["detail"]


def test_invalid_token_returns_401():
    """Tampered or invalid Bearer tokens receive 401 UNAUTHORIZED."""
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={"month": "10/2025"},
        headers={"Authorization": "Bearer totally_fake_token_value_xyz"},
    )
    assert response.status_code == 401
    problem = response.json()
    assert problem["code"] == "UNAUTHORIZED"


def test_insufficient_role_resident_on_batch_saga_returns_403():
    """RESIDENT attempting to trigger month-end billing saga receives 403 FORBIDDEN."""
    resident_token = get_token_for("resident1205")
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={"month": "10/2025"},
        headers={"Authorization": f"Bearer {resident_token}"},
    )
    assert response.status_code == 403
    assert response.headers["content-type"] == "application/problem+json"
    problem = response.json()
    assert problem["code"] == "FORBIDDEN"
    assert "lacks permission" in problem["detail"]


def test_insufficient_role_resident_on_apartment_transfer_returns_403():
    """RESIDENT attempting to transfer apartment ownership receives 403 FORBIDDEN."""
    resident_token = get_token_for("resident1205")
    response = client.post(
        "/api/v1/apartments/apt-101/transfer-ownership",
        json={
            "newOwnerCitizenId": "001099123456",
            "newOwnerName": "Le Van Cuong",
            "newOwnerPhone": "0987654321",
            "transferDate": "2026-03-22",
        },
        headers={"Authorization": f"Bearer {resident_token}"},
    )
    assert response.status_code == 403
    problem = response.json()
    assert problem["code"] == "FORBIDDEN"


def test_technician_can_access_parking_allocation():
    """TECHNICIAN has permission to allocate parking slots."""
    tech_token = get_token_for("tech1")
    # Will authenticate and reach the domain logic (returns 404 or domain result, not 401/403)
    response = client.post(
        "/api/v1/parking/slots/allocate",
        json={"slotId": "slot-b1-nonexistent", "vehicleId": "veh-1", "apartmentId": "apt-101"},
        headers={"Authorization": f"Bearer {tech_token}"},
    )
    assert response.status_code != 401
    assert response.status_code != 403


def test_manager_authorized_to_execute_batch_saga():
    """MANAGER role successfully executes month-end billing saga."""
    manager_token = get_token_for("manager1")
    response = client.post(
        "/api/v1/billing/invoices/batch-saga",
        json={"month": "10/2025", "dryRun": False},
        headers={"Authorization": f"Bearer {manager_token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["status"] == "COMPLETED"
