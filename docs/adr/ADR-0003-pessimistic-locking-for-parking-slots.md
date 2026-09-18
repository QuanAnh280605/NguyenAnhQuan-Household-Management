# ADR-0003: Pessimistic Locking for Basement Parking Allocation

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Lead Backend Engineer
- **Consulted:** Operations Facility Manager, QA / SDET Lead
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Underground parking slots in urban residential complexes (e.g. Basement B1 for cars and B2 for motorbikes) represent **scarce physical assets**. At any given moment, multiple residents or management staff may attempt to reserve or allocate the same newly released parking slot simultaneously.

In a high-concurrency event (e.g., month-end parking quota registration opening at 09:00 AM):
- If two transactions read the slot status as `AVAILABLE` concurrently and proceed to assign it, a **double-booking collision** occurs.
- A physical parking slot assigned to two different vehicles causes severe operational friction, customer complaints, and statutory liabilities.

We must decide on the concurrency control mechanism to guarantee that **zero double-bookings** can occur under high concurrency.

## 2. Decision Drivers

- **Zero Tolerance for Double-Booking:** 100% guarantee that a slot cannot be allocated to two vehicles under any race condition.
- **Low Failure Overhead:** Fast rejection (`409 Conflict` / `ConcurrencyError`) for competing transactions with minimal server overhead.
- **Infrastructure Simplicity:** Avoid introducing an external distributed lock coordinator (e.g., Redis Redlock) if database capabilities suffice.
- **ACID Integrity:** The allocation must bind the vehicle ID, update the slot status to `OCCUPIED`, and register the vehicle within the same atomic transaction.

## 3. Considered Options

1. **Option 1: Optimistic Concurrency Control (OCC) with Version Number**
   - *How it works:* Add a `version INT` column to `parking_slots`. Update via `UPDATE parking_slots SET status = 'OCCUPIED', version = version + 1 WHERE id = $1 AND version = $2`.
   - *Pros:* High throughput in read-heavy scenarios with zero database lock contention.
   - *Cons:* Under high write contention for a specific slot, multiple users perform validation, calculate quotas, only to fail at the final commit step, wasting CPU cycles and requiring complex client-side retry logic.
2. **Option 2: Distributed Locking via Redis (Redlock)**
   - *How it works:* Acquire a distributed mutex key `lock:slot:{slot_id}` in Redis with a TTL before database operations.
   - *Pros:* Offloads locking from PostgreSQL; scalable across distributed microservices.
   - *Cons:* Adds a hard operational dependency on Redis; potential split-brain or clock drift edge cases in distributed locks; extra network roundtrip.
3. **Option 3: Database Pessimistic Row Locking (`SELECT ... FOR UPDATE`)**
   - *How it works:* Within a PostgreSQL transaction block (`BEGIN ... COMMIT`), execute `SELECT * FROM parking_slots WHERE id = $1 FOR UPDATE`. The first transaction acquires an exclusive row lock; concurrent transactions block or fail immediately if using `NOWAIT`.
   - *Pros:* Native PostgreSQL engine guarantee; zero external dependencies; atomic lock acquisition and release on commit/rollback; 0% double-booking collision guarantee.
   - *Cons:* Holds a database row lock for the duration of the transaction (must keep transaction duration $\le 10$ ms).

## 4. Decision Outcome

**Chosen Option:** **Option 3 — Database Pessimistic Row Locking (`SELECT ... FOR UPDATE`)**.

Implemented in [ParkingService.allocate_slot](file:///d:/VSF/chung-cu-household-management/backend/app/services/parking_service.py#L44-L71) and [ParkingRepository.find_slot_with_lock](file:///d:/VSF/chung-cu-household-management/backend/app/repositories/parking_repository.py):

```python
async with pool.acquire() as conn:
    async with conn.transaction():
        # Acquire exclusive pessimistic lock on the slot row
        slot = await self.repo.find_slot_with_lock(conn, data.slotId)
        if not slot:
            raise NotFoundError(f"Parking slot with id '{data.slotId}' not found")

        if slot.get("status") != "AVAILABLE":
            raise ConcurrencyError(
                f"Parking slot '{slot.get('slot_code')}' is currently {slot.get('status', '').lower()} and cannot be allocated"
            )

        if slot.get("allowed_type") != vehicle.get("vehicle_type"):
            raise ValidationError(
                f"Slot is designated for {slot.get('allowed_type')}, incompatible with vehicle type {vehicle.get('vehicle_type')}"
            )

        # Atomic state transition
        await self.repo.allocate_slot(conn, data.slotId, data.vehicleId)
```

### 4.1 Positive Consequences
- **Mathematical Guarantee:** Zero possibility of race conditions or double-allocations.
- **Immediate Rejection:** Competing requests immediately receive an RFC 7807 `ConcurrencyError` explaining that the slot was claimed.
- **Zero Extra Infrastructure:** Utilizes PostgreSQL's native lock manager without Redis or coordination daemons.

### 4.2 Negative Consequences / Trade-offs
- Transactions must strictly avoid external network calls (HTTP/VietQR APIs) while holding the row lock to prevent pool exhaustion.
- The unit test suite must simulate concurrency using mock transaction blocks when running in offline/in-memory mode.

---

## 5. Pros and Cons of the Options

| Concurrency Property | Option 1: Optimistic (OCC) | Option 2: Redis Redlock | **Option 3: Pessimistic Lock (Selected)** |
| :--- | :---: | :---: | :---: |
| **Collision Guarantee** | ⚠️ Retry storms under high contention | ⚠️ Dependent on TTL & clock sync | ✅ 100% Strict Engine Lock |
| **External Dependencies**| ✅ None | ❌ Redis Cluster required | ✅ None (Native PostgreSQL) |
| **Transaction Duration** | ✅ Minimal | ⚠️ Multiple network hops | ⚠️ Must be short ($\le 10$ ms) |
| **Simplicity of Code** | ⚠️ High retry complexity | ⚠️ Moderate | ✅ Clean `BEGIN ... COMMIT` block |

---

## 6. Links & References

- [ParkingService Implementation](../../backend/app/services/parking_service.py)
- [Pytest Concurrency Test: `test_allocate_slot_occupied_concurrency_error`](../../backend/tests/test_parking_service.py)
- [PostgreSQL Documentation: Explicit Locking (FOR UPDATE)](https://www.postgresql.org/docs/current/explicit-locking.html)
- [FlowX Quality Goal Q2: Durable Correctness](https://github.com/votrongdao/FlowX)
