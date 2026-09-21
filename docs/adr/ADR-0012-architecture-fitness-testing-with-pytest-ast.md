# ADR-0012: Architecture Fitness Testing with Pytest and Python AST

## Context and Problem Statement

In modular monolithic architectures like ResidentHub, maintaining strict separation of concerns across layers is critical. As engineering teams move fast or onboard new contributors, architectural boundaries are prone to erosion:
1. **Controller-to-Database Leakage:** API controllers (`api/v1/`) may bypass Domain Services and directly invoke SQL queries or repositories (`repositories/`, `db/`), breaking encapsulation, skipping auditing hooks, and duplicating business logic.
2. **Framework Pollution in Domain Services:** Domain services (`services/`) may inadvertently import web framework components (`fastapi.Request`, `fastapi.HTTPException`, `fastapi.Depends`), crippling unit testing speed and coupling business rules to HTTP transport protocols.
3. **Circular Dependencies:** Low-level core utilities (`core/`) might import higher-level service classes, creating fragile cyclic import graphs.
4. **Architectural Drift:** Decisions like ADR-0010 (Result Pattern over Exceptions) and ADR-0011 (Saga Step Interface contracts) can be violated if not continuously enforced by automated CI checks.

Modeled after `votrongdao/FlowX` and ArchUnit principles, ResidentHub requires an automated mechanism to prevent architectural erosion at build and test time.

## Decision Drivers

* **Zero Architectural Erosion:** Architecture rules must be enforced automatically; violations must break the test suite immediately.
* **Zero External Tooling Bloat:** Avoid introducing cumbersome or slow third-party linter configurations.
* **Instant Execution Speed (< 0.3s):** Must run effortlessly alongside existing Pytest suites without impacting developer feedback loops.
* **Living Documentation:** The test file serves as an executable specification of the system's layering rules.

## Considered Options

* **Option 1: Manual Code Reviews & PR Checklists**
* **Option 2: Third-Party Linters (e.g., `import-linter`, `flake8-tidy-imports`)**
* **Option 3: Native Architectural Fitness Functions in Pytest via Python's standard `ast` module (FlowX Style)**

## Decision Outcome

Chosen option: **Option 3: Native Architectural Fitness Functions in Pytest via Python `ast`**, because Python's built-in Abstract Syntax Tree (`ast`) module provides complete static introspection of imports, classes, and statements with zero external dependencies and sub-second execution.

### Positive Consequences

* **Automated CI Enforcement:** If an engineer imports a repository into a controller, Pytest fails with a descriptive error message indicating the exact file and forbidden import.
* **Pure Domain Services:** Services are statically verified to be 100% web framework-agnostic.
* **ADR Safeguards:**
  - ADR-0010 is continuously safeguarded: service ASTs are scanned for `raise` statements containing domain errors.
  - ADR-0011 is continuously safeguarded: all `SagaStep` subclasses are verified to implement both `execute()` and `compensate()`.
* **Sub-Second Execution:** 7 fitness test suites execute in **0.26s**, adding negligible overhead to CI/CD.

### Negative Consequences

* None. The static analysis is self-contained in `backend/tests/test_architecture_fitness.py` using Python's standard library.

---

## Architectural Layer Boundary Rules Matrix

| Layer | Allowed Imports | Forbidden Imports | Enforcing Fitness Rule |
| :--- | :--- | :--- | :--- |
| **Presentation** (`api/v1/`) | `services/`, `schemas/`, `core/`, `fastapi` | `repositories/`, `db/` | `test_presentation_layer_isolation` |
| **Domain Services** (`services/`) | `repositories/`, `schemas/`, `core/` | `api/`, `fastapi`, `starlette` | `test_domain_services_framework_independence` |
| **Core Utilities** (`core/`) | Standard library, `config` | `services/`, `api/`, `repositories/` | `test_core_layer_dependency_inversion` |
| **Schemas / DTOs** (`schemas/`) | Standard library, `pydantic` | `services/`, `repositories/`, `api/` | `test_schema_dto_purity` |
| **Repositories** (`repositories/`) | `db/`, standard library | `api/`, `services/` | `test_repository_layer_boundaries` |
| **Result Pattern** (`services/`) | `Success`, `Failure`, `Result` | Raising `AppError`, `ValidationError`, etc. | `test_services_adhere_to_result_pattern` |
| **Saga Workflows** (`sagas/`) | `SagaStep`, `SagaContext`, `Result` | Incomplete step implementations | `test_all_saga_steps_implement_execute_and_compensate` |

---

## Validation

Verified via automated Pytest execution in `backend/tests/test_architecture_fitness.py`:
- `test_presentation_layer_isolation` PASSED
- `test_domain_services_framework_independence` PASSED
- `test_core_layer_dependency_inversion` PASSED
- `test_schema_dto_purity` PASSED
- `test_repository_layer_boundaries` PASSED
- `test_services_adhere_to_result_pattern` PASSED
- `test_all_saga_steps_implement_execute_and_compensate` PASSED

**Result:** 7 passed in 0.26s.

---

## Links

* [backend/tests/test_architecture_fitness.py](../../backend/tests/test_architecture_fitness.py)
* [ADR-0006: 3-Tier Layered Architecture](ADR-0006-3tier-architecture-with-pure-domain-services.md)
* [ADR-0010: Result Pattern over Exceptions](ADR-0010-result-pattern-over-exceptions.md)
* [ADR-0011: Saga Orchestration Engine](ADR-0011-saga-orchestration-engine-with-compensations.md)
* [07-FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](../07-FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md)
