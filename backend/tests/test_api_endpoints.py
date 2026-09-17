import pytest
from starlette.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert data["framework"] == "FastAPI"

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["docs_url"] == "/docs"

def test_openapi_json_available():
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    spec = response.json()
    assert spec["openapi"].startswith("3.")
    assert "ResidentHub" in spec["info"]["title"]

def test_validation_error_returns_rfc7807():
    # POST to /api/v1/residents with invalid body (missing required fields)
    response = client.post("/api/v1/residents", json={})
    assert response.status_code == 422
    assert response.headers["content-type"] == "application/problem+json"
    problem = response.json()
    assert problem["code"] == "VALIDATION_ERROR"
    assert problem["status"] == 422
    assert "errors" in problem
