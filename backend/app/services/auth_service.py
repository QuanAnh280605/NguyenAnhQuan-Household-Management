import base64
import json
import time
from typing import Any, Dict, Optional
from backend.app.core.config import settings
from backend.app.core.errors import AuthenticationError, NotFoundError
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.auth import LoginRequest, LoginResponse, UserResponse

class AuthService:
    def __init__(self, repo: Optional[UserRepository] = None):
        self.repo = repo or UserRepository()

    async def authenticate_user(self, payload: LoginRequest) -> LoginResponse:
        user = await self.repo.find_by_username(payload.username)
        if not user:
            raise AuthenticationError("Invalid username or password")

        # In production/demo, check password
        # Supports demo password 'Admin@123' or exact match
        valid = (payload.password == "Admin@123" or payload.password == user.get("password_hash"))
        if not valid:
            raise AuthenticationError("Invalid username or password")

        if not user.get("is_active", True):
            raise AuthenticationError("User account is deactivated")

        # Generate a stateless token containing basic claims
        token_payload = {
            "sub": user["id"],
            "username": user["username"],
            "role": user["role"],
            "exp": int(time.time()) + settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }
        token_str = base64.urlsafe_b64encode(json.dumps(token_payload).encode()).decode()

        user_resp = UserResponse(
            id=str(user["id"]),
            username=user["username"],
            role=user["role"],
            full_name=user["full_name"],
            email=user.get("email"),
            phone=user.get("phone"),
            resident_id=str(user["resident_id"]) if user.get("resident_id") else None,
            is_active=user.get("is_active", True),
        )

        return LoginResponse(
            access_token=token_str,
            token_type="bearer",
            user=user_resp,
        )

    async def get_current_user(self, token: str) -> UserResponse:
        try:
            raw = base64.urlsafe_b64decode(token.encode()).decode()
            claims = json.loads(raw)
            if claims.get("exp", 0) < time.time():
                raise AuthenticationError("Session token has expired")
            user_id = claims["sub"]
        except Exception:
            raise AuthenticationError("Malformed or invalid authentication token")

        user = await self.repo.find_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")

        return UserResponse(
            id=str(user["id"]),
            username=user["username"],
            role=user["role"],
            full_name=user["full_name"],
            email=user.get("email"),
            phone=user.get("phone"),
            resident_id=str(user["resident_id"]) if user.get("resident_id") else None,
            is_active=user.get("is_active", True),
        )
