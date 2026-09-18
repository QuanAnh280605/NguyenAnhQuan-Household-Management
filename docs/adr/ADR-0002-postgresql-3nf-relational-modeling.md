# ADR-0002: PostgreSQL 16 & 3NF Relational Modeling

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Lead Backend Engineer, Database Administrator
- **Consulted:** Legal & Compliance Officer, Financial Accountant
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Residential community and high-rise property management platforms operate under strict statutory and financial requirements:
1. **Civil Demographics & Statutory Census:** Handling official 12-digit Citizen Identity Cards (CCCD), family kinship relations (*Head of Household, Spouse, Child, Tenant*), and legal ownership deeds pursuant to the Vietnamese Law on Housing and Law on Residence.
2. **Double-Entry Financial Ledger:** Recording monthly apartment billing, meter consumption, itemized fees, and bank transactions where balance discrepancies or lost updates are legally unacceptable.
3. **Complex Relational Traversal:** An apartment has multiple historical owners, currently houses one registered household, contains registered vehicles linked to individual residents, and receives itemized monthly invoices.

We must decide whether to model this data domain using a NoSQL/Document Store (e.g., MongoDB), a Key-Value/Graph database, or a fully normalized Relational Database (RDBMS) modeled in Third Normal Form (3NF).

## 2. Decision Drivers

- **ACID Transaction Guarantees:** Strict consistency for financial invoice clearing and resident registration transfers.
- **Relational Integrity:** Foreign keys with explicit cascading (`ON DELETE CASCADE`, `ON DELETE RESTRICT`, `ON DELETE SET NULL`) to prevent orphaned demographic or financial records.
- **Data Deduplication:** A resident moving between apartments or changing household heads must not require updating redundant copies of citizen data across scattered documents.
- **Statutory Auditability:** Ensuring personal identification data (CCCD) complies with Vietnamese Personal Data Protection Decree 13/2023/NĐ-CP through structured schema governance.

## 3. Considered Options

1. **Option 1: Document Store (MongoDB)**
   - *Pros:* Schema flexibility, fast JSON ingestion, nesting resident records inside apartment documents.
   - *Cons:* No cross-document referential integrity enforcement; data duplication across apartments; risk of ghost resident records when updating kinship; lack of native SQL join optimizations.
2. **Option 2: Relational Database (PostgreSQL 16) with Third Normal Form (3NF)**
   - *Pros:* Complete ACID compliance; strong foreign key constraints; rich indexing (partial indexes, GiST/GIN); native UUID v4 support; generated columns; declarative partitioning for high-scale time-series (meter readings); JSONB support when semi-structured attributes are needed.
   - *Cons:* Upfront schema design required; requires migration discipline when schema evolves.
3. **Option 3: Hybrid Polyglot Persistence (PostgreSQL for Billing + MongoDB for Profiles)**
   - *Pros:* Segregates financial ledger from polymorphic resident profile documents.
   - *Cons:* Unnecessary operational complexity; distributed transaction overhead (no unified ACID commit); increased infrastructure hosting costs.

## 4. Decision Outcome

**Chosen Option:** **Option 2 — PostgreSQL 16 with Third Normal Form (3NF) across 18 Relational Tables**.

The platform defines 18 normalized tables in [database/schema.sql](../../database/schema.sql) and [database/schema.dbml](../../database/schema.dbml), organized into 7 distinct operational clusters:
1. `buildings`, `apartments`, `owners`, `apartment_owners`
2. `residents`, `households`, `household_members`
3. `residence_records` (civil stay declaration)
4. `parking_slots`, `vehicles`
5. `fee_types`, `meter_readings`, `invoices`, `invoice_items`, `payment_transactions`
6. `users`
7. `feedbacks`, `feedback_updates`

All primary keys use **UUID v4** (`DEFAULT gen_random_uuid()`) to prevent predictable sequential enumeration attacks while facilitating offline ID generation and distributed seeding.

### 4.1 Positive Consequences
- **Zero Orphaned Data:** Deleting an apartment or household triggers statutory cascading constraints without leaving orphaned residents or vehicles.
- **Audit-Ready Ledgers:** Exact integer financial math in VND (`NUMERIC(12, 2)`) prevents floating-point rounding errors.
- **Unified Querying:** Complex analytical reports (e.g., occupancy rate per tower, monthly fee collection percentage) are executed via single optimized SQL queries with sub-millisecond execution times.

### 4.2 Negative Consequences / Trade-offs
- Schema changes require versioned database migration scripts rather than dynamic ad-hoc schema modifications.
- Repositories must perform relational joins (`JOIN buildings b ON a.building_id = b.id`) rather than reading self-contained monolithic documents.

---

## 5. Pros and Cons of the Options

| Dimension | Option 1: MongoDB | **Option 2: PostgreSQL 3NF (Selected)** | Option 3: Polyglot |
| :--- | :---: | :---: | :---: |
| **Referential Integrity** | ❌ Manual code validation | ✅ Engine-enforced Foreign Keys | ⚠️ Partial / Complex |
| **ACID Guarantees** | ⚠️ Multi-document overhead | ✅ Native ACID Transactions | ❌ Dual-write anomalies |
| **Data Redundancy** | ❌ High (denormalized) | ✅ Zero (3NF Normalized) | ⚠️ Moderate |
| **Operational Simplicity** | ⚠️ Moderate | ✅ Single Database Engine | ❌ 2 Separate Datastores |

---

## 6. Links & References

- [Database Specification & ERD Documentation](../DATABASE_SPECIFICATION_AND_DIAGRAMS.md)
- [PostgreSQL Schema DDL](../../database/schema.sql)
- [DBML Schema Definition](../../database/schema.dbml)
- [Decree 13/2023/NĐ-CP on Personal Data Protection (Vietnam)](https://vanban.chinhphu.vn)
