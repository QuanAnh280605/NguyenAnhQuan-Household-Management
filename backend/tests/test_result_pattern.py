import pytest
from backend.app.core.errors import AppError, NotFoundError, ValidationError, ConflictError, ConcurrencyError, AuthenticationError
from backend.app.core.result import (
    AuthDomainError,
    BusinessRuleViolationError,
    ConcurrencyDomainError,
    ConflictDomainError,
    DomainError,
    Failure,
    ResourceNotFoundError,
    Success,
    handle_result,
)

def test_success_properties_and_methods():
    s = Success(42)
    assert s.is_success is True
    assert s.is_failure is False
    assert s.value == 42
    assert s.error is None
    assert s.unwrap() == 42

    with pytest.raises(ValueError, match="Cannot unwrap_err on Success"):
        s.unwrap_err()

    mapped = s.map(lambda x: x * 2)
    assert mapped.is_success
    assert mapped.value == 84

    bound = s.bind(lambda x: Success(f"val-{x}"))
    assert bound.is_success
    assert bound.value == "val-42"

def test_failure_properties_and_methods():
    err = BusinessRuleViolationError("INVALID_STATE", "Entity is in invalid state")
    f = Failure(err)
    assert f.is_success is False
    assert f.is_failure is True
    assert f.value is None
    assert f.error == err
    assert f.unwrap_err() == err

    # Unwrap on failure converts to exception
    with pytest.raises(ValidationError) as excinfo:
        f.unwrap()
    assert "Entity is in invalid state" in str(excinfo.value)

    # map on failure is no-op
    mapped = f.map(lambda x: x * 2)
    assert mapped.is_failure
    assert mapped.error == err

    # bind on failure is no-op
    bound = f.bind(lambda x: Success(100))
    assert bound.is_failure
    assert bound.error == err

def test_domain_error_exception_mappings():
    # 404
    e404 = ResourceNotFoundError("Unit 1205 not found").to_exception()
    assert isinstance(e404, NotFoundError)
    assert e404.status_code == 404

    # 400 / 422
    e400 = BusinessRuleViolationError("BAD_INPUT", "Invalid room").to_exception()
    assert isinstance(e400, ValidationError)
    assert e400.status_code == 422

    # 409 conflict
    e409 = ConflictDomainError("DUPLICATE", "Already exists").to_exception()
    assert isinstance(e409, ConflictError)
    assert e409.status_code == 409

    # 409 concurrency lock
    e_lock = ConcurrencyDomainError("Slot locked").to_exception()
    assert isinstance(e_lock, ConcurrencyError)
    assert e_lock.status_code == 409

    # 401 auth
    e401 = AuthDomainError("Token expired").to_exception()
    assert isinstance(e401, AuthenticationError)
    assert e401.status_code == 401

def test_handle_result_presentation_bridge():
    # Success
    res = handle_result(Success({"id": "item-1", "name": "Item"}))
    assert res["success"] is True
    assert res["data"]["id"] == "item-1"

    # Failure
    with pytest.raises(NotFoundError):
        handle_result(Failure(ResourceNotFoundError("Item not found")))
