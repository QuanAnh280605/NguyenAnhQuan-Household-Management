# 05 — Architecture Dossier (arc42 + C4)

> **Platform:** ResidentHub (Apartment & Household Management System)  
> **Standard:** arc42 (IEEE 42010) + C4 Model  
> **Status:** Accepted · **Audience:** Architects, Tech Leads, Developers, Reviewers, DevOps  
> **Primary Visual Specification:** [ARCHITECTURE_C4.md](ARCHITECTURE_C4.md)  
> **Functional & Use Case Specification:** [USE_CASES.md](USE_CASES.md)

---

## 1. Introduction and Goals

**ResidentHub** is an urban residential and facility management platform built for modern high-rise apartment complexes. It digitizes property inventories, resident census registries, tiered utility metering, automated monthly billing, VietQR Napas 247 financial settlement, and maintenance SLA tracking.

### 1.1. Stakeholders

| Stakeholder | Role | Primary Operational Concerns |
| :--- | :--- | :--- |
| **Resident / Tenant** | End-User | Transparent utility breakdowns, instant VietQR bill payments, and fast SLA resolution for repair tickets. |
| **Building Manager** | Operations | Real-time occupancy KPIs, vehicle quota compliance, and smooth resident registration transitions. |
| **Accountant** | Financial Lead | Zero-error billing calculations, automated end-of-month batch issuance (25th), and instant bank reconciliation. |
| **Technician** | Field Staff | Fast ticket assignments, clear defect descriptions, and easy photographic proof upload on mobile. |
| **IT Administrator** | Security | Enforcing strict 4-tier Role-Based Access Control (RBAC), multi-apartment data isolation, and auditability. |

### 1.2. Measurable Quality Goals (arc42 §1.2)

| # | Quality Goal | Scenario | Measurable Target | Priority |
| :---: | :--- | :--- | :--- | :---: |
| **Q1** | **Financial Precision** | Generating monthly bills for 1,200+ units across 6 fee categories | **0 fractional VND discrepancies**; strict integer rounding; zero floating-point drift | **1** |
| **Q2** | **Billing Batch Performance** | Month-end batch calculation for 1,200 apartments with 4,800 line items | p99 execution time $\le$ **3.0 seconds** for entire building batch | **1** |
| **Q3** | **Data Isolation (Tenant)** | Resident querying unit, ledger, or ticket information | **100% enforcement** of row-level apartment isolation; cross-unit leaks = 0 | **1** |
| **Q4** | **Payment Idempotency** | Webhook IPN delivered multiple times due to gateway retry or network lag | **Zero duplicate balance updates**; identical transaction ID processed exactly once | **1** |
| **Q5** | **Parking Concurrency** | 5 simultaneous residents competing for the last available B1 slot | **0 double-bookings**; 1 success, 4 rejected with `409 Conflict` via atomic lock | **2** |
| **Q6** | **High Availability** | Database failover or container restart during active operational hours | System recovers in $\le$ **60 seconds**; zero data loss via synchronous replication | **2** |
| **Q7** | **UI Responsiveness** | Portal interaction across desktop and mobile devices | Core pages First Contentful Paint (FCP) $\le$ **800 ms**; p95 API latency $\le$ **150 ms** | **3** |

---

## 2. Architecture Constraints

| # | Constraint | Category | Engineering Implication |
| :---: | :--- | :--- | :--- |
| **C1** | **Next.js 16 App Router & React 19** | Technical | Server Components (RSC) for data fetching, Server Actions for transactional mutations, no redundant REST wrappers. |
| **C2** | **PostgreSQL 16 Relational Engine** | Technical | 18 normalized 3NF tables; strict foreign keys, unique composite indexes, and ACID transaction blocks (`BEGIN ... COMMIT`). |
| **C3** | **VietQR Napas 247 Payment Switch** | Integration | Asynchronous reconciliation via signed HMAC-SHA256 Webhooks; dynamic Napas QR image generation with 15-minute TTL. |
| **C4** | **Integer Currency Representation** | Financial | All monetary values (`amount`, `unit_price`, `total_amount`) stored as integers (VND); no `FLOAT` or `DOUBLE`. |
| **C5** | **Vietnamese Legal Residency Standard** | Domain | Strict validation of 12-digit Citizen Identity Cards (CCCD); max 1 household head (`is_head = true`) per apartment unit. |
| **C6** | **Mermaid Compatibility Standard** | Documentation | All architecture diagrams must use Standard Mermaid (`flowchart`, `sequenceDiagram`) for 100% renderability. |
| **C7** | **Documentation-First & CI Fitness Gates** | Governance | Architectural boundaries and layering rules are verified automatically by lint and fitness tests in CI. |

---

## 3. Context and Scope

### 3.1. Business Context (C4 Level 1)

For the visual System Context diagram and catalog, refer to **[ARCHITECTURE_C4.md §1](ARCHITECTURE_C4.md#1-c4-system-context-diagram---level-1)**.

### 3.2. External Interfaces Matrix

| Interface | Direction | Protocol | Security Mechanism | Failure Handling Strategy |
| :--- | :---: | :---: | :--- | :--- |
| **Web Client Portal** | Ingress | HTTPS / TLS 1.3 | HttpOnly JWT Session Cookies + CSRF Protection | Rate limiting at Cloudflare Edge (100 req/min/IP) |
| **VietQR Payment Gateway** | Egress / Ingress | HTTPS / JSON | HMAC-SHA256 Request Signing & IPN Verification | Dynamic QR expires after 15m; exponential backoff for IPN retries |
| **Notification Gateway** | Egress | SMTP / REST API | API Token Authorization (TLS Encrypted) | Background retry queue; failure logs saved without blocking billing |
| **Civil Police Registry** | Egress (Planned) | REST API | Mutual TLS (mTLS) + Government OAuth2 Token | Circuit Breaker (Fail-open to manual paper review) |
| **Object Storage (S3/R2)** | Both | HTTPS / S3 API | Pre-signed URLs with 5-minute expiration | Direct client download via CDN; upload retry on network drops |

---

## 4. Solution Strategy

| Quality Goal | Architectural Strategy | Enforcing Component |
| :--- | :--- | :--- |
| **Q1 Financial Precision** | Integer arithmetic, decimal-free VND calculations, composite `(apartment_id, billing_month)` uniqueness. | `UtilityBillingEngine`, [schema.sql](../database/schema.sql) |
| **Q2 Batch Speed** | Chunked multi-row SQL inserts, index-accelerated meter retrieval, in-memory tariff strategy execution. | `DataAccessLayer`, PostgreSQL B-Tree Indexes |
| **Q3 Tenant Isolation** | Server-side middleware resolving user role and filtering database queries by authenticated `apartment_id`. | `AuthMiddleware`, Next.js Server Actions |
| **Q4 Idempotency** | Unique transaction codes in `payment_transactions`, checked before updating invoice status. | `PaymentReconciliationService` |
| **Q5 Concurrency Safe** | Pessimistic row locking (`SELECT * FROM parking_slots WHERE id = ? FOR UPDATE`) during slot reservation. | `ParkingService`, PostgreSQL Lock Manager |

---

## 5. Building Block View

### 5.1. C4 Level 2 — Containers

Detailed visual specification and catalog in **[ARCHITECTURE_C4.md §2](ARCHITECTURE_C4.md#2-c4-container-diagram---level-2)**.

### 5.2. C4 Level 3 — Components & 3-Tier Layering

- **C4 Component Specification**: Modular breakdown of Frontend SPA and Next.js 16 application server in **[ARCHITECTURE_C4.md §3](ARCHITECTURE_C4.md#3-c4-component-diagram---level-3)**.
- **Physical 3-Tier Folder Architecture**: Strict layer boundaries, repository patterns, and code skeletons in **[FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md)**.
- **Detailed UML Class & Sequence Models**: Class diagrams and method-level runtime call flows across Presentation, Business Logic, and Data Access tiers in **[DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md](DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md)**.

### 5.3. Target Code Structure

```
d:/VSF/chung-cu-household-management/
├── src/
│   ├── app/                          # Next.js 16 App Router pages & API routes
│   │   ├── (auth)/                   # Login, logout, session management
│   │   ├── (dashboard)/              # Administrative & Resident responsive portals
│   │   │   ├── apartments/           # Unit directory and handover screens
│   │   │   ├── residents/            # Census registry & CCCD declaration
│   │   │   ├── vehicles/             # Parking slot allocation & RFID cards
│   │   │   ├── meters/               # Monthly utility meter logging
│   │   │   ├── billing/              # Invoice generator & payment reconciliation
│   │   │   └── tickets/              # Maintenance SLA tracking & photo evidence
│   │   └── api/
│   │       └── webhooks/vietqr/      # Idempotent Napas 247 IPN receiver
│   ├── components/                   # Reusable React 19 UI components (Tailwind v4)
│   ├── lib/
│   │   ├── auth/                     # JWT decryption, RBAC session guards
│   │   ├── services/                 # Pure domain services (Billing, Parking, SLA)
│   │   ├── db/                       # PostgreSQL connection pooling & DAL queries
│   │   └── tariffs/                  # Calculation strategies (Electricity, Water, Quota)
│   └── types/                        # Strongly-typed TypeScript interfaces
├── database/
│   ├── schema.dbml                   # Visual database definition
│   └── schema.sql                    # Production DDL with ENUMs and indexes
├── docs/                             # Technical documentation repository
└── tests/                            # Fitness functions, unit & integration tests
```

---

## 6. Runtime View

Following the  **Failure Twin convention**, every critical workflow has both a Happy Path and a Failure Twin documented in detail:

- ⚡ **VietQR Settlement**: [ARCHITECTURE_C4.md §4.1](ARCHITECTURE_C4.md#41-workflow-1-vietqr-billing-settlement)
  - *Happy Path*: Scans QR $\rightarrow$ IPN callback verified $\rightarrow$ Invoice updated to `PAID` $\rightarrow$ Receipt sent.
  - *Failure Twin*: Expired QR session $\rightarrow$ Network timeout $\rightarrow$ Replayed/Duplicate Webhook IPN $\rightarrow$ DB rollback.
- ⚡ **Batch Billing Generation**: [ARCHITECTURE_C4.md §4.2](ARCHITECTURE_C4.md#42-workflow-2-month-end-batch-invoice-generation)
  - *Happy Path*: Audits 1,200 units $\rightarrow$ Ingests meters $\rightarrow$ Computes 4,800 items $\rightarrow$ Atomic commit.
  - *Failure Twin*: Missing meter reading or negative consumption $\rightarrow$ Validation guard catches error $\rightarrow$ Dead-letter log isolation.
- ⚡ **Service Ticket SLA Lifecycle**: [SYSTEM_WORKFLOWS_AND_SPECS.md §1.3](SYSTEM_WORKFLOWS_AND_SPECS.md#13-service-ticket--sla-state-machine-happy-path-vs-sla-breach)
  - *Happy Path*: Open $\rightarrow$ Assigned $\rightarrow$ In Progress $\rightarrow$ Resolved $\rightarrow$ Closed.
  - *SLA Breach Twin*: Stalled > 24h $\rightarrow$ Auto-escalation to Operations Head $\rightarrow$ Reopened defect handling.

---

## 7. Deployment View

Production infrastructure topology, security perimeters, and database replication are detailed in **[ARCHITECTURE_C4.md §5](ARCHITECTURE_C4.md#5-c4-deployment-diagram---infrastructure-view)**.

---

## 8. Crosscutting Concepts

### 8.1. Financial Accuracy & Precision

- **Zero Floating-Point Drift**: All amounts (`invoices.total_amount`, `fee_types.unit_price`, `payment_transactions.amount`) are stored as 64-bit integers in VND.
- **Progressive Tariff Calculation**: Electricity tiers (6 tiers per Decision 2941/QĐ-BCT) and water tiers are computed in pure TypeScript functions with unit test coverage asserting exact integer outputs.

### 8.2. Error Handling Standard (RFC 7807)

All API responses for validation errors, authorization denials, or business rejections strictly conform to the **RFC 7807 Problem Details** standard:

```json
{
  "type": "https://residenthub.internal/errors/missing-meter-readings",
  "title": "Unrecorded Utility Meters Detected",
  "status": 422,
  "detail": "12 apartments lack meter readings for billing cycle 2026-09.",
  "instance": "/api/billing/batch-generate",
  "invalid_units": ["A-1204", "B-0502"]
}
```

### 8.3. Idempotency & Replay Protection

Payment webhooks require an idempotency verification check before any database balance modification:

```sql
SELECT id FROM payment_transactions WHERE transaction_code = $1;
```

If a record exists, the server responds with `200 OK: ALREADY_PROCESSED` without re-executing ledger updates.

---

## 9. Architecture Decisions (ADR Index)

> All architectural choices are formally documented and version-controlled under **[docs/adr/](adr/README.md)** using the MADR 3.0 standard.

| ADR | Decision Summary | Status | Documented Rationale & Specification |
| :---: | :--- | :---: | :--- |
| **[ADR-0001](adr/ADR-0001-record-architecture-decisions.md)** | **Record Architecture Decisions (MADR 3.0)** | `ACCEPTED` | Adopts Markdown Architectural Decision Records in Git for institutional memory and auditability. |
| **[ADR-0002](adr/ADR-0002-postgresql-3nf-relational-modeling.md)** | **PostgreSQL 16 & 3NF Normalized Relational Schema** | `ACCEPTED` | Ensures strict referential integrity for co-owners, civil demographics, and financial invoice ledgers. |
| **[ADR-0003](adr/ADR-0003-pessimistic-locking-for-parking-slots.md)** | **Pessimistic Locking (`SELECT ... FOR UPDATE`)** | `ACCEPTED` | Guarantees zero double-booking on scarce B1/B2 parking slots under concurrent reservation events. |
| **[ADR-0004](adr/ADR-0004-virtual-generated-columns-for-utility-meters.md)** | **Virtual Generated Columns for Utility Meter Deltas** | `ACCEPTED` | Engine-enforced `GENERATED ALWAYS AS (current - prev) STORED` eliminating negative index errors. |
| **[ADR-0005](adr/ADR-0005-vietqr-napas-pay-sessions-and-ipn-idempotency.md)** | **Dynamic VietQR Napas 247 Sessions & IPN Idempotency** | `ACCEPTED` | Zero-surcharge inter-bank digital payment with idempotent webhook replay protection. |
| **[ADR-0006](adr/ADR-0006-3tier-architecture-with-pure-domain-services.md)** | **3-Tier Layered Architecture with Pure Domain Services** | `ACCEPTED` | Decouples EVN tariffs and vehicle quotas from HTTP controllers; achieves 0.39s automated test execution. |
| **[ADR-0007](adr/ADR-0007-partial-unique-indexes-with-soft-deletion.md)** | **Partial Unique Indexes with Soft-Deletion Support** | `ACCEPTED` | Enforces active uniqueness (`WHERE deleted_at IS NULL`) while preserving 100% statutory civil audit trails. |
| **[ADR-0008](adr/ADR-0008-monorepo-nextjs16-fastapi-with-fallback-store.md)** | **Monorepo Next.js 16 + FastAPI with Fallback Store** | `ACCEPTED` | Unified developer ergonomics, proxy rewrite, and resilient offline demo capabilities. |
| **[ADR-0009](adr/ADR-0009-frontend-testing-with-vitest-and-testing-library.md)** | **Frontend Testing with Vitest & React Testing Library** | `ACCEPTED` | User-centric component assertions, lightning execution (< 1.5s), and complete test pyramid parity. |

---

## 10. Quality Requirements (Stimulus → Response → Measure)

| # | Stimulus Source | Stimulus Event | Environment | Expected Response | Target Measure |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **QR1** | Resident | Clicks "Thanh toán VietQR" | Mobile browser on 4G | Returns dynamic QR image | p99 $\le$ **400 ms** |
| **QR2** | Gateway | Dispatches Webhook IPN | Peak traffic | Validates HMAC & updates DB | p99 $\le$ **200 ms**; 0 duplicates |
| **QR3** | Accountant | Runs batch billing for 1,200 units | Server under load | Issues all invoices atomically | Total time $\le$ **3.0 s** |
| **QR4** | Resident | Attempts to query another unit's bill | Normal session | Rejects unauthorized access | **100% blocked** with 403 Forbidden |
| **QR5** | Chaos | Database Primary crashes | Production | Hot Standby promoted | Automatic failover $\le$ **60 s** |

---

## 11. Risks and Technical Debt

| # | Risk | Impact | Likelihood | Mitigation Strategy | Owner |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **R1** | **Billing calculation timeout under large complex** | High | Low | Batch in chunks of 100 with transactional saves; pre-aggregate meter indexes. | Backend Lead |
| **R2** | **Webhook IPN delayed or missed by bank switch** | High | Medium | Nightly reconciliation cron comparing VietQR statement against `payment_transactions`. | Accountant / Dev |
| **R3** | **Parking slot race conditions** | Medium | Medium | Enforced `SELECT ... FOR UPDATE` row-level locks on `parking_slots`. | Data Architect |
| **R4** | **Government Civil Portal API latency** | Low | High | Asynchronous sync queue; fallback to manual manager document review. | Integration Team |

---

## 12. Architecture Fitness Functions

| Fitness Test | Target Rule | Failure Trigger | Implementation |
| :--- | :--- | :--- | :--- |
| `LayersPointInward` | Layering | Client component directly imports database or private server utilities | ESLint boundary enforcement |
| `NoCircularDependencies` | Modularity | Circular imports detected between domain services | `madge --circular src/` in CI |
| `EveryActionGuardsRBAC` | Security | Server Action lacks `enforceRole(...)` check | AST parser test in Vitest |
| `FinancialCalculationsAreInteger` | Precision | Billing formula returns floating-point decimals | Unit test suite checking `Number.isInteger(amount)` |
| `NoOrphanDatabaseEntities` | Integrity | Tables lack foreign key constraints or indexes on relations | Schema linter on `schema.sql` |
