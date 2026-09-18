# Architecture Decision Records (ADR Catalog)

> **Platform:** ResidentHub (Modern Apartment & Household Management Platform)  
> **Governance Standard:** MADR 3.0 (Markdown Architectural Decision Records) + FlowX Specification Paradigm  
> **Traceability Links:**  
> - 🏛️ [ARCHITECTURE_ARC42.md](../ARCHITECTURE_ARC42.md) (arc42 Section 9: Architectural Decisions)  
> - 🏛️ [ARCHITECTURE_C4.md](../ARCHITECTURE_C4.md) (C4 Visual Architecture & Runtime Views)  
> - 📋 [REQUIREMENTS_INVEST.md](../REQUIREMENTS_INVEST.md) (Agile Requirements & Gherkin Acceptance Criteria)  
> - 🗄️ [database/schema.sql](../../database/schema.sql) (18-Table 3NF Normalized PostgreSQL Schema)  

---

## 1. Purpose & Methodology

Architecture Decision Records (ADRs) capture significant technical and architectural choices made throughout the lifecycle of **ResidentHub**, documenting the problem context, considered alternatives, rationale, and resulting engineering trade-offs.

Every ADR follows the **MADR 3.0** format and adheres to the **Documentation-First** principle modeled after modern enterprise application platforms:

```
                  ┌────────────┐
                  │  Proposed  │
                  └─────┬──────┘
                        │
                  ┌─────▼──────┐
        ┌─────────┤  Accepted  ├─────────┐
        │         └─────┬──────┘         │
        │               │                │
  ┌─────▼──────┐        │          ┌─────▼──────┐
  │ Deprecated │        │          │ Superseded │
  └────────────┘        │          └────────────┘
                  ┌─────▼──────┐
                  │  Rejected  │
                  └────────────┘
```

- **Proposed:** Under active RFC review with engineering stakeholders.
- **Accepted:** Approved architectural baseline implemented in production codebase.
- **Superseded:** Replaced by a newer decision (with reference to successor ADR).
- **Deprecated:** No longer in effect due to domain or platform evolution.
- **Rejected:** Considered and decided against after formal evaluation.

---

## 2. ADR Master Index

| ID | Title | Status | Date | Primary Drivers | Key Decision |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **[ADR-0001](ADR-0001-record-architecture-decisions.md)** | Record Architecture Decisions | `ACCEPTED` | 2026-09-18 | Architecture Governance, Auditability | Adopt MADR 3.0 in Git repository |
| **[ADR-0002](ADR-0002-postgresql-3nf-relational-modeling.md)** | PostgreSQL 16 & 3NF Relational Modeling | `ACCEPTED` | 2026-09-18 | Data Integrity, Civil Demographics, ACID | 18 Normalized Tables with UUID v4 & Strict Cascading |
| **[ADR-0003](ADR-0003-pessimistic-locking-for-parking-slots.md)** | Pessimistic Locking for Basement Parking Allocation | `ACCEPTED` | 2026-09-18 | Zero Double-Booking, Concurrency | `SELECT ... FOR UPDATE` within DB Transaction Blocks |
| **[ADR-0004](ADR-0004-virtual-generated-columns-for-utility-meters.md)** | Virtual Generated Columns for Utility Meter Deltas | `ACCEPTED` | 2026-09-18 | Zero Human Error, Negative Index Guard | Native `GENERATED ALWAYS AS (current - prev) STORED` |
| **[ADR-0005](ADR-0005-vietqr-napas-pay-sessions-and-ipn-idempotency.md)** | Dynamic VietQR Napas 247 Sessions & Webhook Idempotency | `ACCEPTED` | 2026-09-18 | Instant Settlement, Zero Duplicate Balance | Dynamic QR Payload + Transaction Code Idempotency Guard |
| **[ADR-0006](ADR-0006-3tier-architecture-with-pure-domain-services.md)** | 3-Tier Layered Architecture with Pure Domain Services | `ACCEPTED` | 2026-09-18 | Separation of Concerns, Test Velocity (<0.4s) | Decouple EVN Tariff & Quotas from HTTP & SQL Layers |
| **[ADR-0007](ADR-0007-partial-unique-indexes-with-soft-deletion.md)** | Partial Unique Indexes with Soft-Deletion Support | `ACCEPTED` | 2026-09-18 | Civil Audit Compliance, Uniqueness Preservation | Partial Index `WHERE deleted_at IS NULL` on CCCD/Plates |
| **[ADR-0008](ADR-0008-monorepo-nextjs16-fastapi-with-fallback-store.md)** | Monorepo Next.js 16 + FastAPI with Resilient Fallback | `ACCEPTED` | 2026-09-18 | Developer Ergonomics, Zero-Friction Demo | Unified NPM/Pytest Scripts + In-Memory Fallback Store |

---

## 3. Contribution & Decision Flow

1. **Propose:** Create a new branch `docs/adr-XXXX` and draft `docs/adr/ADR-XXXX-title.md` using the standard template.
2. **Review:** Solicit peer review from the Solution Architect, Backend Lead, and Frontend Lead.
3. **Decide:** Update status to `ACCEPTED` upon consensus; merge via Pull Request.
4. **Enforce:** Add automated CI fitness tests or lint rules where applicable to safeguard the decision.
