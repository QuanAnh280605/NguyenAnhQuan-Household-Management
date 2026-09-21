from fastapi import APIRouter, Header, status
from backend.app.core.errors import AuthenticationError
from backend.app.core.result import handle_result
from backend.app.schemas.auth import LoginRequest
from backend.app.services.auth_service import AuthService

router = APIRouter()
service = AuthService()

@router.post("/login", summary="User Login & Token Issuance")
async def login(payload: LoginRequest):
    result = await service.authenticate_user(payload)
    return handle_result(result)

@router.get("/me", summary="Get Current Authenticated User")
async def get_me(authorization: str = Header(..., description="Bearer token")):
    if not authorization.startswith("Bearer "):
        raise AuthenticationError("Authorization header must begin with 'Bearer '")
    token = authorization.split(" ")[1]
    result = await service.get_current_user(token)
    return handle_result(result)

