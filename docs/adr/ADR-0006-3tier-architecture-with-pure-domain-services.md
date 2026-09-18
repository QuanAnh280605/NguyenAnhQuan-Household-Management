# ADR-0006: 3-Tier Layered Architecture with Pure Domain Services

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Lead Backend Engineer
- **Consulted:** QA Lead, Frontend Lead
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Residential management platforms balance two distinct engineering pressures:
1. **Volatile Transport & Protocol Layers:** Changes to HTTP endpoints, query parameters, auth headers, or external webhook formats.
2. **Complex, High-Stakes Business Rules:** Vietnamese EVN 6-tier progressive electricity formulas, tiered clean water tariffs, strict vehicle quota ceilings (maximum 1 car, 2 motorbikes per unit), and maintenance ticket SLA urgency workflows.

In naive architectures (e.g., active record or "fat controllers"):
- Business formulas are embedded inside API route handlers or raw SQL queries.
- Writing unit tests requires booting an entire HTTP server and mocking database network sockets, resulting in slow, flaky test suites.
- Replacing or refactoring the database layer breaks API contracts and business logic.

We must define a clear structural boundary separating presentation, domain rules, and data access.

## 2. Decision Drivers

- **Separation of Concerns:** Business logic must know nothing about HTTP requests, cookies, or status codes.
- **Ultra-Fast Test Velocity:** Pure domain calculations must be verifiable in sub-second test suites without requiring a live PostgreSQL instance.
- **Interchangeable Data Access:** The ability to run in mock/in-memory mode for offline frontend development without altering business services.
- **Consistency with Enterprise Platforms:** Matching the clean architectural separation seen in frameworks like FlowX.

## 3. Considered Options

1. **Option 1: Traditional Django/FastAPI Active Record (Fat Models / Fat Controllers)**
   - *Pros:* Quick to prototype for simple CRUD applications.
   - *Cons:* Tight coupling; business rules mixed with HTTP responses; slow tests requiring database transactions for every assertion.
2. **Option 2: Strict 3-Tier Layered Architecture (Controllers $\rightarrow$ Domain Services $\rightarrow$ Repositories)**
   - *Pros:* Clear dependency inversion; controllers only handle serialization and HTTP transport; services contain 100% of domain algorithms; repositories isolate raw AsyncPG queries; enables instant unit testing with zero DB boot overhead.
   - *Cons:* Requires writing intermediate service and repository classes for straightforward CRUD operations.
3. **Option 3: Full Hexagonal / Clean Onion Architecture (Ports & Adapters)**
   - *Pros:* Maximum theoretical decoupling.
   - *Cons:* Excessive boilerplate and abstraction layers (interfaces, mappers, DTOs at every boundary) disproportionate to the system's operational complexity.

## 4. Decision Outcome

**Chosen Option:** **Option 2 — Strict 3-Tier Layered Architecture with Pure Domain Services**.

The backend codebase in [backend/app/](file:///d:/VSF/chung-cu-household-management/backend/app/) enforces three unidirectional layers:

```
[ HTTP Ingress / FastAPI Routers ]
               │  (app/api/v1/*.py)
               ▼
[ Pure Domain Services ]  <────── Unit Tests (0.39s execution)
               │  (app/services/*.py)
               ▼
[ AsyncPG SQL Repositories ]
                  (app/repositories/*.py)
```

### 4.1 Layer Responsibilities

1. **Presentation Layer (`app/api/v1/`):**
   - Ingress validation via Pydantic schemas (`app/schemas/`).
   - Delegates business calls to domain services.
   - Wraps responses in standard envelopes via `api_success()` or RFC 7807 `app_error_handler`.
   - **Rule:** Zero calculations or SQL queries permitted in this layer.

2. **Domain Service Layer (`app/services/`):**
   - Implements domain rules: EVN 6-tier electricity calculation, 4-tier water rates, parking quotas, VietQR payload generation.
   - Pure functions and business state machines.
   - **Rule:** Never imports `fastapi.Request`, `fastapi.Response`, or database connection pools directly. Receives repositories via constructor dependency injection.

3. **Data Access Layer (`app/repositories/`):**
   - Encapsulates AsyncPG parameterized SQL queries.
   - Implements in-memory fallbacks when running in mock or test environments.
   - **Rule:** Never evaluates business policies or billing eligibility.

### 4.2 Positive Consequences
- **26 Automated Tests in 0.39s:** Domain rules are verified almost instantaneously because tests instantiate pure Python services directly.
- **High Maintainability:** Updating the EVN electricity tariff rates requires modifying only [billing_service.py](file:///d:/VSF/chung-cu-household-management/backend/app/services/billing_service.py) without touching database schemas or API routes.

### 4.3 Negative Consequences / Trade-offs
- Slight file count overhead (adding a feature requires touching `schema.py`, `service.py`, `repository.py`, and `router.py`).

---

## 5. Pros and Cons of the Options

| Architecture Characteristic | Option 1: Fat Controller | **Option 2: 3-Tier Layering (Selected)** | Option 3: Hexagonal / Onion |
| :--- | :---: | :---: | :---: |
| **Separation of Concerns** | ❌ None | ✅ High | ✅ Very High |
| **Unit Test Velocity** | ❌ Slow (requires DB) | ✅ Extremely Fast (< 0.4s) | ✅ Fast |
| **Boilerplate Overhead** | ✅ Minimal | ⚠️ Moderate | ❌ Very Heavy |
| **Refactoring Safety** | ❌ High risk | ✅ Isolated layers | ✅ High |

---

## 6. Links & References

- [3-Tier Architecture Documentation](../FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md)
- [Detailed UML Class & Sequence Diagrams](../DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md)
- [Billing Service Domain Implementation](../../backend/app/services/billing_service.py)
- [Backend Automated Test Suite](../../backend/tests/)
