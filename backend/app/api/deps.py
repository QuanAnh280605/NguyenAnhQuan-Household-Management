from typing import Callable, Optional
from fastapi import Depends, Header
from backend.app.core.errors import AuthenticationError, ForbiddenError
from backend.app.schemas.auth import UserResponse
from backend.app.services.auth_service import AuthService

_auth_service = AuthService()

async def get_current_user(
    authorization: Optional[str] = Header(None, description="Bearer authorization token")
) -> UserResponse:
    """Extract and validate the Bearer token from the Authorization header."""
    if not authorization:
        raise AuthenticationError("Missing Authorization header. Please supply 'Bearer <token>'")

    parts = authorization.strip().split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise AuthenticationError("Malformed Authorization header. Format must be 'Bearer <token>'")

    token = parts[1].strip()
    result = await _auth_service.get_current_user(token)
    if result.is_failure:
        raise AuthenticationError(result.error.message)

    return result.value

def require_roles(*allowed_roles: str) -> Callable:
    """
    Dependency factory checking that the authenticated user possesses one of the allowed roles.
    Raises:
        AuthenticationError (401) if not authenticated.
        ForbiddenError (403) if authenticated user's role is not allowed.
    """
    normalized_roles = {r.upper() for r in allowed_roles}

    async def role_checker(
        current_user: UserResponse = Depends(get_current_user)
    ) -> UserResponse:
        if current_user.role.upper() not in normalized_roles:
            raise ForbiddenError(
                f"Access denied: role '{current_user.role}' lacks permission. Required roles: {sorted(list(normalized_roles))}"
            )
        return current_user

    return role_checker
