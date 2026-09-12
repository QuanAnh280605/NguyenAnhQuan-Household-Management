<div align="center">

# ResidentHub
**Modern Apartment & Household Management Platform**

*Single Source of Truth for Building Operations, Household Demographics, and Automated Billing.*

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2019%20%7C%20TypeScript%20%7C%20Tailwind-blue)](README.md)
[![Database](https://img.shields.io/badge/Schema-14%20Tables%20(3NF)-success)](database/schema.dbml)
[![Architecture](https://img.shields.io/badge/Specs-RBAC%20%2B%20State%20Machines-orange)](docs/SYSTEM_WORKFLOWS_AND_SPECS.md)
[![Traceability](https://img.shields.io/badge/Traceability-UI%20to%20DB%20Aligned-brightgreen)](docs/UI_DATABASE_MAPPING.md)
[![UI Prototype](https://img.shields.io/badge/Prototype-Stitch%20Interactive-purple)](https://stitch.withgoogle.com/projects/16326783556633031011?pli=1)

</div>

```mermaid
flowchart LR
    A["🏢 Units & Owners<br/><small>Properties & Area</small>"]
    B["👨‍👩‍👧‍👦 Households & Residents<br/><small>Civil Registry & Stay Status</small>"]
    C["🚗 Vehicles & Parking<br/><small>B1/B2 Slots & RFID Badges</small>"]
    D["🧾 Automated Billing<br/><small>Meters, Invoices & Debt</small>"]
    E["🛠️ Tickets & Maintenance<br/><small>SLA & Work Orders</small>"]

    A --> B --> C --> D --> E
    classDef main fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a
    class A,B,C,D,E main
```

<div align="center"><b>Streamlining multi-tenant apartment management into an integrated, auditable operational flow.</b></div>

---

## 📊 Metric Box — System at a Glance

| Dimension | Specification | Notes |
| :--- | :--- | :--- |
| **Functional Scope** | **7 Core Modules** | Buildings, Households, Residents, Stay Tracking, Vehicles, Invoices, Feedbacks |
| **Database Architecture** | **14 Relational Tables (3NF)** | Fully normalized PostgreSQL schema with composite unique keys & cascading rules |
| **Data Definition** | **DBML + SQL DDL** | [`database/schema.dbml`](database/schema.dbml) and [`schema.sql`](schema.sql) |
| **Access Governance (RBAC)**| **4 Distinct Roles** | `ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT` with row-level isolation |
| **Application Stack** | **Next.js (React 19) + TypeScript** | Modern App Router, Server Components & Tailwind CSS |
| **Traceability** | **100% UI to Database Alignment** | Every UI field is explicitly mapped to database columns in [`docs/UI_DATABASE_MAPPING.md`](docs/UI_DATABASE_MAPPING.md) |
| **UI/UX Prototype** | **[Interactive Stitch Prototype](https://stitch.withgoogle.com/projects/16326783556633031011?pli=1)** | High-fidelity interactive design system |

---

## 🏗️ Architecture: 3 System Views

### View 1: Top-Down Business Deconstruction

Decomposed from the high-level management objective, the platform encapsulates 7 operational subsystems:

![System Mindmap](./image.png)

```
                            ┌─ 1. Buildings & Apartments (Properties & Floor plans)
                            ├─ 2. Households & Family Rosters (So ho khau)
                            ├─ 3. Residents & Demographics (CCCD, Legal identity)
ResidentHub Operations ─────┼─ 4. Residence Tracking (Temporary stay, Absence, Move-out)
        Platform            ├─ 5. Vehicles & Parking Allocation (Basement B1/B2, RFID)
                            ├─ 6. Automated Billing & Invoicing (Meters, Tariffs, Overdue)
                            └─ 7. Maintenance & Resident Feedback (Tickets, SLA triage)
```

---

### View 2: Monthly Billing & Settlement Sequence

Automating the entire recurring financial lifecycle: from cut-off meter readings to batch invoicing and payment gateway reconciliation.

```mermaid
sequenceDiagram
    autonumber
    actor MGR as Accountant / Management
    participant SYS as ResidentHub Engine
    actor RES as Resident / Household Head
    participant GATEWAY as Payment Gateway (Bank / VietQR)

    Note over MGR,SYS: Cut-off Window: 25th - 28th of every month
    MGR->>SYS: Record Utility Meters (Current reading >= Previous reading)
    SYS-->>SYS: Calculate Consumption = (Current - Previous) * Tariff
    SYS-->>SYS: Compute Fixed Charges (Area m² * Management Rate + Registered Vehicles)
    MGR->>SYS: Trigger "Batch Generate Invoices"
    SYS-->>SYS: Create INVOICES (Status: UNPAID) + itemized INVOICE_ITEMS
    SYS->>RES: Dispatch push notification / email statement with Due Date

    alt Online Settlement
        RES->>SYS: Authorize payment via VietQR / Bank
        SYS->>GATEWAY: Initiate payment order
        GATEWAY-->>SYS: Webhook IPN confirms success
        SYS-->>SYS: Record PAYMENT_TRANSACTIONS & update paid_amount
    else Cash Settlement
        RES->>MGR: Pay cash at building reception
        MGR->>SYS: Record manual cash receipt
    end

    SYS-->>SYS: Update Status: PAID (if balance = 0) or PARTIAL
    Note over SYS: Past Due Date: Auto-transition remaining balances to OVERDUE
```

---

### View 3: Civil Residency & Invoice State Machines

#### A. Residency Movement Lifecycle
```mermaid
stateDiagram-v2
    [*] --> PERMANENT : Register permanent stay
    [*] --> TEMPORARY : Register temporary stay
    PERMANENT --> ABSENT : Declare temporary absence
    ABSENT --> PERMANENT : Return / Expiration
    TEMPORARY --> PERMANENT : Convert status
    PERMANENT --> MOVED_OUT : Relocation / Ownership transfer
    TEMPORARY --> MOVED_OUT : Lease expiration
    MOVED_OUT --> [*]
```

#### B. Invoice Financial Lifecycle
```mermaid
stateDiagram-v2
    [*] --> UNPAID : Invoice generated
    UNPAID --> PARTIAL : Partial payment recorded
    UNPAID --> PAID : Full settlement
    PARTIAL --> PAID : Remaining balance settled
    UNPAID --> OVERDUE : Past due date without full payment
    PARTIAL --> OVERDUE : Past due date with remaining balance
    OVERDUE --> PAID : Outstanding balance settled
    PAID --> [*]
```

---

## 🎯 UI to Database Traceability Matrix

ResidentHub guarantees architectural cohesion between the user interface and the underlying database schema. Detailed field-by-field mapping is available in [docs/UI_DATABASE_MAPPING.md](docs/UI_DATABASE_MAPPING.md).

| Application Screen | Route | Target Database Tables | Key Entities & Columns |
| :--- | :--- | :--- | :--- |
| **Apartments Management** | `/can-ho`, `/can-ho/[roomNumber]` | `apartments`, `buildings`, `owners`, `apartment_owners` | `room_number`, `floor`, `area`, `status`, `full_name`, `citizen_id` |
| **Resident Directory** | `/cu-dan` | `residents`, `households`, `household_members` | `full_name`, `citizen_id`, `resident_status`, `household_code`, `is_head` |
| **Stay Tracking & History**| `/cu-tru`, `/lich-su-cu-tru` | `residence_records` | `record_type`, `start_date`, `end_date`, `police_verified_code`, `status` |
| **Vehicles & Parking** | (Integrated in Unit view) | `vehicles`, `parking_slots` | `license_plate`, `vehicle_type`, `rfid_card_number`, `slot_code`, `floor` |
| **Billing & Payments** | `/hoa-don` | `invoices`, `invoice_items`, `meter_readings`, `payment_transactions` | `invoice_code`, `billing_month`, `total_amount`, `paid_amount`, `status` |
| **Service Tickets** | `/phan-anh` | `feedbacks`, `feedback_updates` | `title`, `category`, `priority`, `status`, `assigned_to` |
| **Identity & Users** | `/nguoi-dung` | `users` | `username`, `role` (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`), `is_active` |

---

## 🗄️ Database Architecture & Normalized ERD

The database schema is modeled in 3NF across 14 relational tables. Inspect the interactive schema definitions:
- **DBML Schema:** [`database/schema.dbml`](database/schema.dbml)
- **PostgreSQL DDL:** [`schema.sql`](schema.sql)

```mermaid
erDiagram
    %% 1. TÒA NHÀ & CĂN HỘ
    BUILDINGS ||--o{ APARTMENTS : "has"
    BUILDINGS ||--o{ PARKING_SLOTS : "contains"
    APARTMENTS ||--o{ APARTMENT_OWNERS : "has"
    OWNERS ||--o{ APARTMENT_OWNERS : "owns"

    %% 2. HỘ DÂN & CƯ DÂN
    APARTMENTS ||--o{ HOUSEHOLDS : "houses"
    HOUSEHOLDS ||--o{ HOUSEHOLD_MEMBERS : "contains"
    RESIDENTS ||--o{ HOUSEHOLD_MEMBERS : "belongs_to"
    HOUSEHOLDS }o--|| RESIDENTS : "headed_by"

    %% 3. BIẾN ĐỘNG CƯ TRÚ
    RESIDENTS ||--o{ RESIDENCE_RECORDS : "registers"
    APARTMENTS ||--o{ RESIDENCE_RECORDS : "recorded_at"

    %% 4. PHƯƠNG TIỆN & BÃI ĐỖ
    RESIDENTS ||--o{ VEHICLES : "owns"
    APARTMENTS ||--o{ VEHICLES : "registers_for"
    PARKING_SLOTS ||--o| VEHICLES : "allocates"

    %% 5. PHÍ & HÓA ĐƠN
    APARTMENTS ||--o{ METER_READINGS : "consumes"
    APARTMENTS ||--o{ INVOICES : "billed_to"
    HOUSEHOLDS ||--o{ INVOICES : "paid_by"
    INVOICES ||--o{ INVOICE_ITEMS : "has"
    FEE_TYPES ||--o{ INVOICE_ITEMS : "categorized_by"
    INVOICES ||--o{ PAYMENT_TRANSACTIONS : "settled_via"

    %% 6. PHẢN ÁNH & DỊCH VỤ
    RESIDENTS ||--o{ FEEDBACKS : "submits"
    APARTMENTS ||--o{ FEEDBACKS : "originates_from"
    FEEDBACKS ||--o{ FEEDBACK_UPDATES : "tracks"

    %% 7. HỆ THỐNG & TÀI KHOẢN
    USERS ||--o| RESIDENTS : "profile_of"
    USERS ||--o{ FEEDBACKS : "handled_by"
    USERS ||--o{ FEEDBACK_UPDATES : "updated_by"
```

---

## 📚 Documentation Index

| Document | Topic | What it answers |
| :--- | :--- | :--- |
| [SYSTEM_WORKFLOWS_AND_SPECS.md](docs/SYSTEM_WORKFLOWS_AND_SPECS.md) | Business Logic & RBAC | State machine rules, RBAC permission matrix, and post-DBML roadmap |
| [UI_DATABASE_MAPPING.md](docs/UI_DATABASE_MAPPING.md) | UI to Database Traceability | Granular field-by-field mapping between application screens and SQL columns |
| [schema.dbml](database/schema.dbml) | Database Markup Language | Visual, importable DBML schema for dbdocs.io and dbdiagram.io |
| [schema.sql](schema.sql) | PostgreSQL DDL | Complete table definitions, indexes, composite constraints & triggers |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database (PostgreSQL)

Create the PostgreSQL database and import the schema from [schema.sql](schema.sql):

```bash
# Create database
createdb -U postgres resident_hub

# Import schema
psql -U postgres -d resident_hub -f schema.sql
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.
