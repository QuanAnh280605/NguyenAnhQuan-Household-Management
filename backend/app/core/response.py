from datetime import datetime, timezone
from typing import Any, Dict, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int

class ApiSuccessEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: T
    pagination: Optional[PaginationMeta] = None
    timestamp: str

def api_success(data: Any, pagination: Optional[PaginationMeta] = None) -> Dict[str, Any]:
    envelope = {
        "success": True,
        "data": data,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if pagination:
        envelope["pagination"] = pagination.model_dump()
    return envelope
