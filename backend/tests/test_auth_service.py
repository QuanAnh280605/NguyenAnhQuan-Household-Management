import pytest
from backend.app.schemas.auth import LoginRequest
from backend.app.services.auth_service import AuthService

@pytest.mark.asyncio
async def test_auth_login_success():
    service = AuthService()
    req = LoginRequest(username="admin", password="Admin@123")
    result = await service.authenticate_user(req)
    assert result.is_success
    res = result.value
    assert res.accessToken is not None
    assert res.tokenType == "bearer"
    assert res.user.username == "admin"
    assert res.user.role == "ADMIN"

@pytest.mark.asyncio
async def test_auth_login_invalid_password():
    service = AuthService()
    req = LoginRequest(username="admin", password="WrongPassword!")
    result = await service.authenticate_user(req)
    assert result.is_failure
    assert result.error.code == "UNAUTHORIZED"
    assert "Invalid username or password" in result.error.message

@pytest.mark.asyncio
async def test_auth_login_nonexistent_user():
    service = AuthService()
    req = LoginRequest(username="unknown_user", password="Admin@123")
    result = await service.authenticate_user(req)
    assert result.is_failure
    assert result.error.code == "UNAUTHORIZED"
    assert "Invalid username or password" in result.error.message

@pytest.mark.asyncio
async def test_auth_get_me_success():
    service = AuthService()
    login_req = LoginRequest(username="manager1", password="Admin@123")
    login_result = await service.authenticate_user(login_req)
    assert login_result.is_success
    login_res = login_result.value

    user_result = await service.get_current_user(login_res.accessToken)
    assert user_result.is_success
    user = user_result.value
    assert user.username == "manager1"
    assert user.role == "MANAGER"

