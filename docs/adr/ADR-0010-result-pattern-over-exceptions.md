# ADR-0010: Result Pattern over Exceptions for Domain Operations

## Context and Problem Statement

In early iterations of ResidentHub, business rule violations (e.g., parking quota exceeded, duplicate citizen CCCD, slot occupied during allocation, or already paid invoices) were signaled by raising custom Python exceptions (`AppError`, `ValidationError`, `ConflictError`, `ConcurrencyError`) from the Domain Services layer (`backend/app/services/`).

While exceptions are standard in web frameworks for aborting requests, relying on exception-driven control flow for ordinary business scenarios presents several architectural drawbacks:
1. **Implicit Contracts:** Method signatures (`def register_vehicle(...) -> Dict[str, Any]`) hide possible failure modes, forcing callers to guess which exceptions might be raised.
2. **Performance & Overhead:** In Python, creating exception objects, capturing tracebacks, and unwinding call stacks incur non-trivial runtime overhead.
3. **Muddled Telemetry & Observability:** Sentry, APM, and log monitoring systems frequently alert on raised exceptions, creating alarm fatigue when expected domain rejections (e.g. resident typing an invalid license plate) are flagged as unhandled bugs.
4. **Architectural Parity with FlowX:** Modeled after `votrongdao/FlowX` (specifically FlowX ADR-0007: *Result over Exceptions*), an application should treat business outcomes as first-class typed domain values, reserving runtime exceptions strictly for catastrophic, unrecoverable technical failures (DB connection lost, disk full, syntax bugs).

## Decision Drivers

* **Type Safety & Explicit Contracts:** The return type must explicitly declare both the success payload and the domain error enum/type.
* **Separation of Concerns:** Pure domain services should not know or care about HTTP status codes, FastAPI request lifecycles, or RFC 7807 response formatting.
* **Zero Runtime Overhead for Business Branches:** Quota rejections and concurrency locks must be lightweight value returns, not stack unwinding operations.
* **Ergonomic Presentation Mapping:** The presentation controller layer must be able to cleanly bridge a domain `Result` into standard RFC 7807 problem details in a single concise call (`handle_result(result)`).

## Considered Options

* **Option 1: Traditional Exception-Driven Flow (`raise AppError(...)`)**
* **Option 2: External Python Libraries (e.g., `returns`, `result`)**
* **Option 3: Native Lightweight `Result[T, DomainError]` with `Success` & `Failure` types**

## Decision Outcome

Chosen option: **Option 3: Native Lightweight `Result[T, DomainError]` with `Success` & `Failure` types**, because it delivers complete type safety and ergonomic methods (`map`, `bind`, `unwrap`, `unwrap_err`) with zero external dependency bloat.

### Positive Consequences

* **Explicit Method Signatures:** Methods now declare `Result[Dict[str, Any], DomainError]`. Developers and IDEs immediately see that an operation can fail with domain-specific errors.
* **Pure Domain Layer:** Domain services in `backend/app/services/` now strictly return values (`Success(data)` or `Failure(DomainError(...))`), eliminating `raise` statements for expected business paths.
* **Presentation Ingress Bridge:** Controller route handlers in `backend/app/api/v1/` use `handle_result(result)`, which unwraps `Success` into standard envelope `{success: true, data: ...}` or converts `Failure` into RFC 7807 Problem Details via `domain_error.to_exception()`.
* **Testing Velocity & Clarity:** Unit tests can directly assert `result.is_failure` and `result.error.code == "QUOTA_EXCEEDED"` without needing verbose `with pytest.raises(...)` context managers.
* **Backward Compatibility:** `Failure.unwrap()` maps the domain error to an `AppError` exception if called directly, preventing breakage in legacy call sites.

### Negative Consequences

* Developers must remember to return `Success(...)` or `Failure(...)` rather than raising exceptions inside the `services/` layer.

## Pros and Cons of the Options

### Option 1: Traditional Exception-Driven Flow
* Good: Standard Python idiom, familiar to beginners.
* Bad: Blurs the distinction between expected business outcomes and unexpected infrastructure crashes; creates log noise; hides failure states from type checkers.

### Option 2: External Libraries (`returns`)
* Good: Feature-rich functional programming primitives.
* Bad: Introduces heavy third-party dependencies, steep learning curve, and complex type hierarchies.

### Option 3: Native Lightweight `Result[T, DomainError]` (Selected)
* Good: Zero dependencies; lightweight slots; full control over RFC 7807 exception mapping; aligns 100% with FlowX ADR-0007.
* Bad: Requires maintaining the lightweight `result.py` module (~150 lines).

## Validation

* Verified via **30/30 automated pytest tests passing in 0.43s** in `backend/tests/`:
  - `tests/test_result_pattern.py`: Unit tests for `Success`, `Failure`, `map`, `bind`, and exception mappings.
  - `tests/test_parking_service.py`: Verifies `QUOTA_EXCEEDED`, `DUPLICATE_LICENSE_PLATE`, and `CONCURRENCY_CONFLICT`.
  - `tests/test_resident_service.py`: Verifies `INVALID_CCCD`, `DUPLICATE_CCCD`, and `NOT_FOUND`.
  - `tests/test_billing_service.py`: Verifies `INVOICE_ALREADY_PAID` and `ZERO_BALANCE`.
  - `tests/test_auth_service.py`: Verifies `UNAUTHORIZED` domain errors.
  - `tests/test_feedback_service.py`: Verifies `INVALID_CATEGORY` and `INVALID_STATUS`.

## Links

* [backend/app/core/result.py](../../backend/app/core/result.py)
* [votrongdao/FlowX ADR-0007 (Result over Exceptions)](https://github.com/votrongdao/FlowX)
* [07-FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](../07-FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md)
