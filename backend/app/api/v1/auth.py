from fastapi import APIRouter, Header, status
from backend.app.core.errors import AuthenticationError
from backend.app.core.response import api_success
from backend.app.schemas.auth import LoginRequest
from backend.app.services.auth_service import AuthService

router = APIRouter()
service = AuthService()

@router.post("/login", summary="User Login & Token Issuance")
async def login(payload: LoginRequest):
    result = await service.authenticate_user(payload)
    return api_success(result.model_dump())

@router.get("/me", summary="Get Current Authenticated User")
async def get_me(authorization: str = Header(..., description="Bearer token")):
    if not authorization.startswith("Bearer "):
        raise AuthenticationError("Authorization header must begin with 'Bearer '")
    token = authorization.split(" ")[1]
    user = await service.get_current_user(token)
    return api_success(user.model_dump())
