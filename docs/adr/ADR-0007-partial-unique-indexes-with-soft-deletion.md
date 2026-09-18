# ADR-0007: Partial Unique Indexes with Soft-Deletion Support

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Database Administrator, Security Officer
- **Consulted:** Legal Advisor, Facility Manager
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Statutory housing regulations in Vietnam require long-term auditability of residential demographics, property ownership transfers, vehicle license plates, and household composition. Under the Vietnamese Law on Residence and accounting audit standards, historical data cannot be physically removed from the database (**Hard Delete**) when a resident moves out, sells their unit, or deactivates a vehicle registration.

However, traditional soft-deletion introduces a severe relational integrity flaw with standard unique constraints:
- If a resident with Citizen ID `001099001234` moves out and has `deleted_at = NOW()`, a standard `UNIQUE (citizen_id)` constraint prevents that citizen from ever registering in the building again in the future.
- If a tenant unregisters vehicle license plate `30A-999.88`, another resident purchasing that car cannot register it because the old deactivated record still occupies the unique index.

We must decide on a schema strategy that preserves complete historical audit trails while allowing natural re-registration of active identifiers.

## 2. Decision Drivers

- **Statutory Audit Trail:** 100% preservation of historical records; hard `DELETE` queries are strictly forbidden on core demographic and ledger entities.
- **Active Uniqueness Invariant:** Identifiers (CCCD, vehicle license plate, apartment room code, household code) must be strictly unique among **active** records.
- **Query Efficiency:** Soft-delete filters (`WHERE deleted_at IS NULL`) must be fast and utilize specialized database indexes.
- **Accidental Deletion Recovery:** Facility managers must be able to restore an erroneously archived resident record without complex database backups.

## 3. Considered Options

1. **Option 1: Hard Delete with Separate Archive Audit Tables (`residents_archive`)**
   - *Pros:* Core tables remain clean; standard unique indexes work without modification.
   - *Cons:* Dual-table maintenance; writing complex triggers to copy data to archive tables; joins across history become complicated.
2. **Option 2: Soft Delete with Composite Unique Index on `(citizen_id, deleted_at)`**
   - *Pros:* Supported by most relational databases.
   - *Cons:* PostgreSQL treats `NULL` values as distinct in standard unique constraints (two rows with `(id, NULL)` are allowed, breaking active uniqueness!). Setting a dummy date like `9999-12-31` is an anti-pattern.
3. **Option 3: Partial Unique Indexes (`CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`)**
   - *Pros:* Native PostgreSQL feature; enforces uniqueness **strictly on active rows** (`deleted_at IS NULL`); unlimited historical soft-deleted records with the same identifier can exist without conflict; high index efficiency (excludes deleted rows from the B-Tree index).
   - *Cons:* PostgreSQL-specific syntax; raw queries must include `WHERE deleted_at IS NULL` to hit the partial index.

## 4. Decision Outcome

**Chosen Option:** **Option 3 — Partial Unique Indexes (`WHERE deleted_at IS NULL`)**.

Implemented across all core entities in [database/schema.sql](../../database/schema.sql#L398-L415):

```sql
-- Partial Unique Indexes for Soft-Delete Support (Ensures active uniqueness only)
CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_buildings_code_active 
    ON buildings(code) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_apartments_room_active 
    ON apartments(building_id, room_number) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_owners_citizen_id_active 
    ON owners(citizen_id) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_households_code_active 
    ON households(household_code) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_residents_citizen_id_active 
    ON residents(citizen_id) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_parking_slots_code_active 
    ON parking_slots(building_id, slot_code) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_vehicles_license_plate_active 
    ON vehicles(license_plate) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_vehicles_rfid_active 
    ON vehicles(rfid_card_number) WHERE deleted_at IS NULL;

-- Soft-Delete Filter Indexes for fast active-set scans
CREATE INDEX IF NOT EXISTS idx_apartments_deleted_at ON apartments(deleted_at);
CREATE INDEX IF NOT EXISTS idx_residents_deleted_at ON residents(deleted_at);
CREATE INDEX IF NOT EXISTS idx_households_deleted_at ON households(deleted_at);
CREATE INDEX IF NOT EXISTS idx_invoices_deleted_at ON invoices(deleted_at);
```

### 4.1 Positive Consequences
- **Natural Re-registration:** If a resident moves out (`deleted_at = '2025-06-01'`) and returns a year later, the system creates their new profile without violating the unique constraint.
- **Smaller, Faster Indexes:** Because deleted rows are excluded from the partial index tree, the B-Tree index remains compact and cache-resident in memory.
- **Zero Loss of Historical Evidence:** Police background checks, historical billing disputes, and civil registration records remain permanently preserved in the primary tables.

### 4.2 Negative Consequences / Trade-offs
- All repository queries fetching active records must explicitly include `AND deleted_at IS NULL` (or use a database view / query scope).

---

## 5. Pros and Cons of the Options

| Schema Strategy | Option 1: Archive Tables | Option 2: Composite `(id, deleted_at)` | **Option 3: Partial Unique Index (Selected)** |
| :--- | :---: | :---: | :---: |
| **Active Uniqueness Guarantee** | ✅ Yes | ❌ Fails on NULL in PostgreSQL | ✅ 100% Strict on Active Rows |
| **Historical Preservation** | ⚠️ Split across tables | ✅ Single table | ✅ Single table |
| **Index Size & Efficiency** | ⚠️ Multiple indexes | ❌ Bloated with deleted rows | ✅ Compact (Active rows only) |
| **Developer Maintenance** | ❌ Complex triggers | ⚠️ Dummy date hacks | ✅ Standard SQL DDL |

---

## 6. Links & References

- [PostgreSQL Documentation: Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html)
- [ResidentHub Schema DDL: Partial Unique Indexes](../../database/schema.sql#L398)
- [Decree 13/2023/NĐ-CP on Personal Data Retention & Audit](https://vanban.chinhphu.vn)
