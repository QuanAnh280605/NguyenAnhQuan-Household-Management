import pytest
from backend.app.core.errors import AuthenticationError
from backend.app.schemas.auth import LoginRequest
from backend.app.services.auth_service import AuthService

@pytest.mark.asyncio
async def test_auth_login_success():
    service = AuthService()
    req = LoginRequest(username="admin", password="Admin@123")
    res = await service.authenticate_user(req)
    assert res.accessToken is not None
    assert res.tokenType == "bearer"
    assert res.user.username == "admin"
    assert res.user.role == "ADMIN"

@pytest.mark.asyncio
async def test_auth_login_invalid_password():
    service = AuthService()
    req = LoginRequest(username="admin", password="WrongPassword!")
    with pytest.raises(AuthenticationError):
        await service.authenticate_user(req)

@pytest.mark.asyncio
async def test_auth_login_nonexistent_user():
    service = AuthService()
    req = LoginRequest(username="unknown_user", password="Admin@123")
    with pytest.raises(AuthenticationError):
        await service.authenticate_user(req)

@pytest.mark.asyncio
async def test_auth_get_me_success():
    service = AuthService()
    login_req = LoginRequest(username="manager1", password="Admin@123")
    login_res = await service.authenticate_user(login_req)
    
    user = await service.get_current_user(login_res.accessToken)
    assert user.username == "manager1"
    assert user.role == "MANAGER"
