from datetime import datetime, timezone
from typing import Any, Dict, Optional
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Any] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details
        self.type_url = f"https://residenthub.internal/errors/{error_code.lower().replace('_', '-')}"

class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(message, 404, "NOT_FOUND", details)

class ValidationError(AppError):
    def __init__(self, message: str = "Invalid request parameters", details: Optional[Any] = None):
        super().__init__(message, 422, "VALIDATION_ERROR", details)

class ConflictError(AppError):
    def __init__(self, message: str = "Resource conflict detected", details: Optional[Any] = None):
        super().__init__(message, 409, "CONFLICT", details)

class ConcurrencyError(AppError):
    def __init__(self, message: str = "Resource is currently locked or modified concurrently", details: Optional[Any] = None):
        super().__init__(message, 409, "CONCURRENCY_LOCK_ACQUIRED", details)

class AuthenticationError(AppError):
    def __init__(self, message: str = "Authentication failed or token invalid", details: Optional[Any] = None):
        super().__init__(message, 401, "UNAUTHORIZED", details)

class ForbiddenError(AppError):
    def __init__(self, message: str = "Access denied", details: Optional[Any] = None):
        super().__init__(message, 403, "FORBIDDEN", details)


def format_rfc7807_problem(
    type_url: str,
    title: str,
    status: int,
    detail: str,
    instance: str,
    code: str,
    errors: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    problem = {
        "type": type_url,
        "title": title,
        "status": status,
        "detail": detail,
        "instance": instance,
        "code": code,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if errors:
        problem["errors"] = errors
    return problem

async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    content = format_rfc7807_problem(
        type_url=exc.type_url,
        title=exc.__class__.__name__,
        status=exc.status_code,
        detail=exc.message,
        instance=request.url.path,
        code=exc.error_code,
        errors=exc.details if isinstance(exc.details, dict) else None,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=content,
        media_type="application/problem+json"
    )

async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    field_errors: Dict[str, list] = {}
    for err in exc.errors():
        loc = ".".join(str(item) for item in err["loc"] if item != "body")
        field = loc or "request"
        if field not in field_errors:
            field_errors[field] = []
        field_errors[field].append(err["msg"])

    content = format_rfc7807_problem(
        type_url="https://residenthub.internal/errors/validation-error",
        title="Unprocessable Entity",
        status=422,
        detail="One or more validation constraints were violated",
        instance=request.url.path,
        code="VALIDATION_ERROR",
        errors=field_errors,
    )
    return JSONResponse(
        status_code=422,
        content=content,
        media_type="application/problem+json"
    )

async def generic_error_handler(request: Request, exc: Exception) -> JSONResponse:
    content = format_rfc7807_problem(
        type_url="https://residenthub.internal/errors/internal-error",
        title="Internal Server Error",
        status=500,
        detail=str(exc),
        instance=request.url.path,
        code="INTERNAL_SERVER_ERROR",
    )
    return JSONResponse(
        status_code=500,
        content=content,
        media_type="application/problem+json"
    )
