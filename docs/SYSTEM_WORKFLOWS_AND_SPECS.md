# ResidentHub - Core Workflows & Specifications

This document captures the essential missing design artifacts: **Business Lifecycles (State Machines)**, **RBAC Permission Matrix**, and **Post-DBML Implementation Steps**.

> 📚 **Comprehensive Architectural Specifications**:
>
> - [C4 Model Architecture Document](ARCHITECTURE_C4.md) (Level 1 to Level 4 visual diagrams)

---

## 1. Core Lifecycles & State Machines

### 1.1. Residence Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PERMANENT : Register permanent stay
    [*] --> TEMPORARY : Register temporary stay
    PERMANENT --> ABSENT : Declare temporary absence
    ABSENT --> PERMANENT : Return / Expiration
    TEMPORARY --> PERMANENT : Convert to permanent
    PERMANENT --> MOVED_OUT : Ownership transfer / Departure
    TEMPORARY --> MOVED_OUT : Lease expiration / Departure
    MOVED_OUT --> [*]
```

- **Rules**: Max 1 household head (`is_head = true`) per unit. Head departure mandates assigning a successor first. Move-out revokes parking slots, deactivates user accounts, and requires zero outstanding balance.

### 1.2. Billing & Payment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> UNPAID : Invoice issued
    UNPAID --> PARTIAL : Partial payment
    UNPAID --> PAID : Full payment settled
    PARTIAL --> PAID : Settle remaining
    UNPAID --> OVERDUE : Past due date
    PARTIAL --> OVERDUE : Past due date
    OVERDUE --> PAID : Settle debt
    PAID --> [*]
```

- **Cycle**: Record utility meters (25th–28th) $\rightarrow$ Calculate (Area $\times$ Tariff + Utilities + Parking) $\rightarrow$ Batch generate invoices $\rightarrow$ Settle via Gateway/Cash $\rightarrow$ Auto-flag `OVERDUE` after deadline.

### 1.3. Service Ticket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> OPEN : Resident reports issue
    OPEN --> ASSIGNED : Dispatch technician
    OPEN --> REJECTED : Invalid / Duplicate
    ASSIGNED --> IN_PROGRESS : On-site inspection
    IN_PROGRESS --> RESOLVED : Fixed (with photo proof)
    RESOLVED --> CLOSED : Resident approves / 48h timeout
    RESOLVED --> REOPENED : Resident unsatisfied
    REOPENED --> IN_PROGRESS : Rework
    CLOSED --> [*]
```

### 1.4. Vehicle & Parking Allocation

- **Quota**: Max 1 car, 2 motorbikes per unit.
- **Workflow**: Check unit quota $\rightarrow$ Check available slot (B1/B2) $\rightarrow$ Verify logbook & ID $\rightarrow$ Activate RFID card $\rightarrow$ Link to monthly recurring billing.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Module | Action | ADMIN | MANAGER | TECHNICIAN | RESIDENT | Scope & Constraints |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Units** | View / Edit specs | CRUD | CRUD | Read | Read | Residents only view their own unit |
| **Residents** | Manage profiles & Stay status | CRUD | CRUD | - | Read / Submit | Residents only view co-occupants |
| **Vehicles** | Register & Slot allocation | CRUD | CRUD | - | Register | Unit vehicle quotas enforced |
| **Meters** | Record & Update readings | CRUD | Record | Record | - | Current reading $\ge$ Previous reading |
| **Billing** | Fee config & Issue invoices | CRUD | Issue / Collect | - | View & Pay | Residents only access their own bills |
| **Tickets** | Submit, Dispatch, Resolve | Manage | Dispatch | Update | Create / Close | Technicians update assigned tickets |
| **Users** | Account & Role governance | CRUD | - | - | - | System security administration |

---

## 3. Post-DBML Implementation Steps ("Next Steps")

1. **DB Migration & Constraints**:
   - Apply schema to PostgreSQL via Prisma/Drizzle.
   - Enforce unique composite constraints: `(building_id, room_number)`, `citizen_id`, `license_plate`, and `(apartment_id, billing_month)`.
2. **Relational Data Seeding**:
   - Seed in dependency order: Building & Slots $\rightarrow$ Fee Tariffs $\rightarrow$ Units $\rightarrow$ Households & Residents $\rightarrow$ Vehicles $\rightarrow$ Meter Readings & Invoices.
3. **Phased Development**:
   - **Phase 1 (Core)**: Auth, RBAC, Units, Residents & Households.
   - **Phase 2 (Operations)**: Residence tracking & Vehicle/Parking allocation.
   - **Phase 3 (Finance)**: Meter recording, Automated billing engine, Payment processing.
   - **Phase 4 (Services)**: Ticket management, Resident portal, Analytics dashboard.
4. **Key Verification Checks**:
   - **Tenant Isolation**: Strict row-level / query guards preventing cross-unit data access.
   - **Financial Accuracy**: Integer rounding on VND currency to eliminate floating-point precision errors.
   - **Concurrency Locks**: Atomic lock on parking slot allocation to prevent double-booking.
