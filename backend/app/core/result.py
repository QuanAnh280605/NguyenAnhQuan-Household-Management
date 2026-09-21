"""
ResidentHub — Result Pattern Implementation
Modeled after FlowX ADR-0007 (Result over Exceptions).

Core Guarantees:
1. Business outcomes are modeled as typed values, not runtime exceptions.
2. Domain services return Result[T, DomainError] (Success or Failure).
3. Presentation tier (APIRouter) maps Failure to RFC 7807 Problem Details at the HTTP boundary.
"""

from typing import Any, Callable, Generic, Optional, TypeVar, Union
from backend.app.core.errors import (
    AppError,
    AuthenticationError,
    ConcurrencyError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
)

T = TypeVar("T")
E = TypeVar("E", bound="DomainError")


class DomainError:
    """
    Domain Error encapsulating expected business failure outcomes.
    Decoupled completely from HTTP / Web framework concerns.
    """

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        details: Optional[Any] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details

    def to_exception(self) -> AppError:
        """Map pure domain error into RFC 7807 AppError exception at presentation boundary."""
        if self.status_code == 404:
            return NotFoundError(self.message, self.details)
        elif self.status_code == 409:
            if "CONCURRENCY" in self.code or "LOCKED" in self.code:
                return ConcurrencyError(self.message, self.details)
            return ConflictError(self.message, self.details)
        elif self.status_code in (400, 422):
            return ValidationError(self.message, self.details)
        elif self.status_code == 401:
            return AuthenticationError(self.message, self.details)
        elif self.status_code == 403:
            return ForbiddenError(self.message, self.details)
        return AppError(self.message, self.status_code, self.code, self.details)

    def __repr__(self) -> str:
        return f"<DomainError code={self.code} status={self.status_code} message='{self.message}'>"


# Specialized Domain Error subclasses
class ResourceNotFoundError(DomainError):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__("NOT_FOUND", message, 404, details)


class BusinessRuleViolationError(DomainError):
    def __init__(self, code: str, message: str, details: Optional[Any] = None):
        super().__init__(code, message, 400, details)


class ConflictDomainError(DomainError):
    def __init__(self, code: str, message: str, details: Optional[Any] = None):
        super().__init__(code, message, 409, details)


class ConcurrencyDomainError(DomainError):
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__("CONCURRENCY_CONFLICT", message, 409, details)


class AuthDomainError(DomainError):
    def __init__(self, message: str = "Authentication failed", details: Optional[Any] = None):
        super().__init__("UNAUTHORIZED", message, 401, details)


class Success(Generic[T]):
    __slots__ = ("_value",)

    def __init__(self, value: T):
        self._value = value

    @property
    def value(self) -> T:
        return self._value

    @property
    def is_success(self) -> bool:
        return True

    @property
    def is_failure(self) -> bool:
        return False

    @property
    def error(self) -> None:
        return None

    def unwrap(self) -> T:
        return self._value

    def unwrap_err(self) -> None:
        raise ValueError("Cannot unwrap_err on Success")

    def map(self, fn: Callable[[T], Any]) -> "Result":
        return Success(fn(self._value))

    def bind(self, fn: Callable[[T], "Result"]) -> "Result":
        return fn(self._value)

    def __repr__(self) -> str:
        return f"Success({self._value!r})"


class Failure(Generic[E]):
    __slots__ = ("_error",)

    def __init__(self, error: E):
        self._error = error

    @property
    def value(self) -> None:
        return None

    @property
    def is_success(self) -> bool:
        return False

    @property
    def is_failure(self) -> bool:
        return True

    @property
    def error(self) -> E:
        return self._error

    def unwrap(self) -> Any:
        """Unwrap on failure raises mapped exception for backward-compatible call-sites."""
        if hasattr(self._error, "to_exception"):
            raise self._error.to_exception()
        raise ValueError(f"Unwrap failed on Failure: {self._error}")

    def unwrap_err(self) -> E:
        return self._error

    def map(self, fn: Callable[[Any], Any]) -> "Failure[E]":
        return self

    def bind(self, fn: Callable[[Any], "Result"]) -> "Failure[E]":
        return self

    def __repr__(self) -> str:
        return f"Failure({self._error!r})"


Result = Union[Success[T], Failure[E]]


def handle_result(result: Result[T, DomainError], pagination=None):
    """
    Presentation boundary helper to unwrap Result and format standard API success response.
    If Result is Failure, raises domain exception to trigger RFC 7807 Problem Details JSON.
    """
    if result.is_failure:
        raise result.error.to_exception()

    from backend.app.core.response import api_success
    return api_success(result.value, pagination=pagination)
