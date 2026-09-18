# ADR-0004: Virtual Generated Columns for Utility Meter Deltas

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Database Engineer, Financial Lead
- **Consulted:** Building Accountant, Facility Technician
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Every month between the 25th and 28th, building management staff records physical utility meter readings (water in $m^3$ and electricity in $kWh$) for each apartment.

The monthly billable consumption is calculated as:
$$\text{consumption} = \text{current\_reading} - \text{previous\_reading}$$

In traditional spreadsheet or legacy application implementations:
- Calculation logic is duplicated across multiple layers (frontend validation, API controller, reporting SQL views).
- Inconsistencies arise when one layer calculates $current - previous$ while another reads an uncomputed column or performs floating-point math.
- Clerical errors (e.g. entering a current reading lower than the previous reading due to a typo) lead to negative consumption values and erroneous customer billing disputes.

We must determine where and how meter consumption deltas are computed and guaranteed immutable.

## 2. Decision Drivers

- **Single Source of Truth:** Guarantee that consumption is computed in exactly one place with zero formula drift.
- **Data Layer Enforcement:** Prevent application bugs or direct SQL scripts from inserting inconsistent consumption numbers.
- **Query Performance:** Avoid re-computing subtraction on millions of historical meter reading rows during analytical queries or batch billing runs.
- **Strict Non-Negative Invariant:** Invariant check that $current\_reading \ge previous\_reading$.

## 3. Considered Options

1. **Option 1: Client-Side / Controller Calculation**
   - *How it works:* The Next.js frontend or FastAPI controller calculates `consumption = current - prev` and sends it as a column in the `INSERT INTO meter_readings` query.
   - *Pros:* Simple to implement in application code.
   - *Cons:* High risk of tampering, race conditions, or formula divergence across multiple API clients; allows buggy code to store inconsistent data.
2. **Option 2: PostgreSQL PL/pgSQL Trigger (`BEFORE INSERT OR UPDATE`)**
   - *How it works:* A database trigger executes on every insert/update to set `NEW.consumption = NEW.current_reading - NEW.previous_reading`.
   - *Pros:* Enforced at the database level.
   - *Cons:* Hidden business logic inside database triggers; harder to inspect via schema DDL; maintenance overhead during database migrations.
3. **Option 3: PostgreSQL Native Generated Stored Column (`GENERATED ALWAYS AS ... STORED`)**
   - *How it works:* Declare the column directly in table DDL:
     `consumption NUMERIC(10, 2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED`.
   - *Pros:* Engine-level guarantee; read/write impossible to corrupt from outside; zero trigger overhead; pre-computed and stored on disk for immediate indexable reads.
   - *Cons:* Requires PostgreSQL 12+ (ResidentHub uses PostgreSQL 16).

## 4. Decision Outcome

**Chosen Option:** **Option 3 — PostgreSQL Native Generated Stored Column (`GENERATED ALWAYS AS ... STORED`)**.

Implemented in [database/schema.sql](../../database/schema.sql#L285):

```sql
CREATE TABLE IF NOT EXISTS meter_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    meter_type meter_type NOT NULL,
    billing_period VARCHAR(20) NOT NULL, -- '10-2025'
    previous_reading NUMERIC(10, 2) NOT NULL,
    current_reading NUMERIC(10, 2) NOT NULL,
    consumption NUMERIC(10, 2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_apt_meter_period UNIQUE (apartment_id, meter_type, billing_period),
    CONSTRAINT chk_meter_positive_delta CHECK (current_reading >= previous_reading)
);
```

### 4.1 Positive Consequences
- **Mathematically Impossible to Corrupt:** Any attempt to manually pass a `consumption` value in an `INSERT` statement is rejected by PostgreSQL (`ERROR: cannot insert into column "consumption"`).
- **Sub-Millisecond Batch Queries:** Because the column is `STORED` on disk, monthly billing batch queries do not spend CPU cycles recalculating deltas.
- **Full Transparency:** The formula is explicitly visible in the DDL specification and ERD diagrams without hidden stored procedures.

### 4.2 Negative Consequences / Trade-offs
- The column cannot be overridden for complex meter rollover scenarios (e.g., analog meter passing 99,999 and resetting to 00,000) without explicit meter replacement logging in a dedicated lifecycle table.

---

## 5. Pros and Cons of the Options

| Characteristic | Option 1: Client/API Code | Option 2: DB Trigger | **Option 3: Generated Column (Selected)** |
| :--- | :---: | :---: | :---: |
| **Engine Enforced** | ❌ No | ✅ Yes | ✅ Yes (Native) |
| **Tamper Proof** | ❌ Vulnerable | ✅ Yes | ✅ Impossible to bypass |
| **Query Performance** | ⚠️ Recomputed in ad-hoc queries | ✅ Stored | ✅ Pre-computed & Indexable |
| **Schema Transparency** | ⚠️ Opaque in SQL | ❌ Hidden in trigger | ✅ Explicit in table DDL |

---

## 6. Links & References

- [PostgreSQL Documentation: Generated Columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html)
- [ResidentHub Schema DDL: meter_readings](../../database/schema.sql#L278-L289)
- [Billing Service Tiered Calculation](../../backend/app/services/billing_service.py)
