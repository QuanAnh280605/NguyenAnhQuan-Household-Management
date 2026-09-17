from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class LoginRequest(BaseModel):
    username: str = Field(..., description="User login handle")
    password: str = Field(..., min_length=6, description="User secret password")

class UserResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    username: str
    role: str
    fullName: str = Field(..., alias="full_name")
    email: Optional[str] = None
    phone: Optional[str] = None
    residentId: Optional[str] = Field(None, alias="resident_id")
    isActive: bool = Field(True, alias="is_active")

class LoginResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    accessToken: str = Field(..., alias="access_token")
    tokenType: str = Field("bearer", alias="token_type")
    user: UserResponse
