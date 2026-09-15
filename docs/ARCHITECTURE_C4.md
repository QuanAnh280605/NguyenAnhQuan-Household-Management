# ResidentHub - System Architecture Document (C4 Model & Pragmatic Mermaid)

This document provides the formal architectural specification for the **ResidentHub** platform (Apartment & Household Management System) using the **C4 Model** ([Simon Brown](https://c4model.com/)).

---

## 📑 Architecture Document Navigation

- 🏛️ **C4 Level 1**: [System Context Diagram](#1-c4-system-context-diagram---level-1) (Black Box boundary & Stakeholders)
- 📦 **C4 Level 2**: [Container Diagram](#2-c4-container-diagram---level-2) (Applications, Databases, and Storage)
- 🧩 **C4 Level 3**: [Component Diagram](#3-c4-component-diagram---level-3) (Internal Next.js 16 modular services)
- ⚡ **C4 Dynamic**: [Runtime View & Failure Twins](#4-c4-dynamic-diagrams---runtime-view--failure-twins) (Happy Path vs. Failure Twin sequences)
- 🚀 **C4 Deployment**: [Production Deployment Topology](#5-c4-deployment-diagram---infrastructure-view) (Vercel Edge, AWS RDS Multi-AZ, S3)
- 🧪 **Fitness Functions**: [Integrity & Layering Gates](#6-architecture-fitness-functions--integrity-tests) (Automated CI assertions)
- 📘 **arc42 Full Specification**: For the complete 12-section IEEE 42010 architectural dossier, see **[ARCHITECTURE_ARC42.md](ARCHITECTURE_ARC42.md)**.
- 📋 **Use Case Specifications**: For UML catalogs, 4 End-to-End journeys, and fully-dressed specs, see **[USE_CASES.md](USE_CASES.md)**.

---

## 1. C4 System Context Diagram - Level 1

The System Context diagram illustrates the high-level boundary of **ResidentHub** within the urban residential ecosystem. Adhering strictly to C4 Level 1 principles, **ResidentHub is treated as a Black Box**, orchestrating internal stakeholders and external third-party services.

```mermaid
flowchart LR
    subgraph users["👥 Stakeholders & Actors"]
        resident(["👤 Resident / Household Head<br/><i>[Person]</i><br/>Views statements, pays bills via VietQR,<br/>submits repair requests"])
        manager(["👤 Building Management & Accounting<br/><i>[Person]</i><br/>Manages units, enters utility readings,<br/>issues monthly batch invoices"])
        tech(["👤 Building Technician<br/><i>[Person]</i><br/>Receives work tickets, inspects on-site,<br/>logs SLA completion photo proofs"])
        admin(["👤 System Administrator<br/><i>[Person]</i><br/>Governs security, user permissions,<br/>and building master parameters"])
    end

    subgraph enterprise["🏢 Building Management Ecosystem"]
        residentHub["ResidentHub Platform<br/><i>[Software System]</i><br/>Central digital platform operating apartment facilities,<br/>household census registries, and automated utility billing<br/>across an 18-table relational PostgreSQL schema."]
    end

    subgraph external["🌐 External Third-Party Systems"]
        vietqr["VietQR Payment Gateway<br/><i>[External System: Napas 247]</i><br/>Inter-bank switch generating dynamic QR codes<br/>and dispatching asynchronous IPN Webhooks"]
        notif["Notification Service<br/><i>[External System: SMTP / ZNS / SMS]</i><br/>Multi-channel notification dispatcher for monthly<br/>e-statements and urgent building announcements"]
        civil["Public Residency Portal<br/><i>[External System: Government API]</i><br/>Civil registry authority for validating legal permanent<br/>and temporary stay records (Planned)"]
    end

    resident -- "Views bills, pays fees, files tickets [HTTPS]" --> residentHub
    manager -- "Manages units, logs meters, bills [HTTPS]" --> residentHub
    tech -- "Receives work orders, updates SLA [HTTPS]" --> residentHub
    admin -- "Configures parameters, governs RBAC [HTTPS]" --> residentHub

    residentHub -- "Initiates payment sessions & verifies IPN [HTTPS/JSON]" --> vietqr
    residentHub -- "Dispatches e-statements & alerts [SMTP/REST API]" --> notif
    residentHub -. "Audits & syncs residency records [REST API]" .-> civil

    style residentHub fill:#1168bd,color:#fff,stroke:#0b4f9e,stroke-width:2px
    style vietqr fill:#666666,color:#fff,stroke:#444,stroke-width:1px
    style notif fill:#666666,color:#fff,stroke:#444,stroke-width:1px
    style civil fill:#888888,color:#fff,stroke:#555,stroke-dasharray: 4 4
    style resident fill:#08427b,color:#fff,stroke:#052e56
    style manager fill:#08427b,color:#fff,stroke:#052e56
    style tech fill:#08427b,color:#fff,stroke:#052e56
    style admin fill:#08427b,color:#fff,stroke:#052e56
    style enterprise fill:#f8fafc,stroke:#94a3b8,stroke-dasharray: 5 5
    style users fill:#f1f5f9,stroke:#cbd5e1
    style external fill:#f1f5f9,stroke:#cbd5e1
```

### Context Elements Catalog

| Identifier | C4 Type | Display Label | Description & Responsibilities |
| :--- | :--- | :--- | :--- |
| `resident` | `Person` | Resident / Household Head | Portal user: reviews monthly bills, scans VietQR to settle balances, declares temporary stay, and submits repair tickets. |
| `manager` | `Person` | Management & Accounting | Operational user: audits meters (25th-28th), issues batch invoices, manages parking slots, and reconciles cash/gateway payments. |
| `tech` | `Person` | Building Technician | Field staff: assigned maintenance tickets, conducts physical inspections, and uploads photo evidence for SLA resolution. |
| `admin` | `Person` | System Administrator | IT security officer: manages 4-tier RBAC (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`), configures fee tariffs, and audits access logs. |
| `residentHub` | `System` | ResidentHub Platform | Core software system delivering residential operations, census registry, and financial ledger. |
| `vietqr` | `System_Ext` | VietQR Payment Gateway | Financial switch generating dynamic Napas 247 QR codes and firing asynchronous IPN Webhook callbacks. |
| `notif` | `System_Ext` | Notification Gateway | Multi-channel network dispatching itemized e-statements and debt reminders via Email, SMS, and Zalo ZNS. |
| `civil` | `System_Ext` | Public Residency Portal | Governmental civil registry interface for residency verification (Planned integration). |

---

## 2. C4 Container Diagram - Level 2

The Container diagram decomposes **ResidentHub** into independently deployable units, client interfaces, background workers, and data persistence engines.

```mermaid
flowchart TB
    subgraph users["👥 Platform Users"]
        resident(["👤 Resident"])
        manager(["👤 Building Manager"])
        tech(["👤 Technician"])
        admin(["👤 Admin"])
    end

    subgraph platform["ResidentHub Platform Boundary [System]"]
        direction TB
        subgraph client_tier["Presentation Tier"]
            spa["Single-Page Web Application<br/><i>[Container: React 19, Tailwind CSS v4, TypeScript]</i><br/>Responsive web portal providing interactive KPI dashboards,<br/>unit directory, citizen declaration forms, and VietQR payment modals."]
        end

        subgraph app_tier["Application & Execution Tier"]
            api["Web & API Application Server<br/><i>[Container: Next.js 16 App Router, Node.js 20]</i><br/>Executes core domain logic, Server Actions, 4-tier RBAC enforcement,<br/>residency state machines, and automated utility billing engines."]
            worker["Cron Background Worker<br/><i>[Container: Node.js 20 Worker Process]</i><br/>Scheduled batch daemon auditing overdue accounts (OVERDUE),<br/>triggering recurring billing cutoffs (25th), and dispatching reminders."]
        end

        subgraph data_tier["Data Persistence Tier"]
            database[("Relational Database<br/><i>[Container: PostgreSQL 16 Engine]</i><br/>18 normalized 3NF tables maintaining referential integrity for units,<br/>residents, vehicles, meters, invoices, transactions, and SLA tickets.")]
            storage[("Object & File Storage<br/><i>[Container: Cloudflare R2 / AWS S3]</i><br/>Encrypted object storage preserving utility meter photos,<br/>maintenance incident attachments, and PDF invoice statements.")]
        end
    end

    subgraph external["🌐 External Integrations"]
        vietqr["VietQR Gateway<br/><i>[External System: Napas 247]</i>"]
        mail["Email / SMS Gateway<br/><i>[External System: SMTP / ZNS]</i>"]
    end

    resident & manager & tech & admin -- "Interacts via Web Browser [HTTPS]" --> spa
    spa -- "Invokes Server Actions & REST APIs [JSON/HTTPS]" --> api
    api -- "Executes parameterized SQL & ACID transactions [TCP 5432]" --> database
    worker -- "Scans overdue bills & batches billing [TCP 5432]" --> database
    api -- "Stores & signs evidence photos [S3 API]" --> storage
    spa -- "Fetches optimized assets directly [HTTPS/CDN]" --> storage

    api -- "Initiates dynamic QR & receives Webhook IPN [JSON/HTTPS]" --> vietqr
    api -- "Dispatches e-statements & alerts [SMTP/REST]" --> mail
    worker -- "Triggers scheduled bulk announcements [SMTP/REST]" --> mail

    style spa fill:#1168bd,color:#fff,stroke:#0b4f9e,stroke-width:2px
    style api fill:#1168bd,color:#fff,stroke:#0b4f9e,stroke-width:2px
    style worker fill:#2563eb,color:#fff,stroke:#1d4ed8,stroke-width:1px
    style database fill:#0284c7,color:#fff,stroke:#0369a1,stroke-width:2px
    style storage fill:#0284c7,color:#fff,stroke:#0369a1,stroke-width:2px
    style vietqr fill:#666,color:#fff,stroke:#444
    style mail fill:#666,color:#fff,stroke:#444
    style platform fill:#f8fafc,stroke:#64748b,stroke-width:2px,stroke-dasharray: 6 6
    style client_tier fill:#eff6ff,stroke:#bfdbfe
    style app_tier fill:#eff6ff,stroke:#bfdbfe
    style data_tier fill:#f0fdf4,stroke:#bbf7d0
    style users fill:#f1f5f9,stroke:#cbd5e1
    style external fill:#f1f5f9,stroke:#cbd5e1
```

### Container Inventory

| Container | Tech Stack & Environment | Primary Technical Responsibilities |
| :--- | :--- | :--- |
| **`spa`** | React 19, Tailwind CSS v4, TypeScript | Client-side reactive UI delivering master-detail tables, KPI charts, VietQR modal dialogs, and registration wizards. |
| **`api`** | Next.js 16 App Router, Node.js 20 | Unified Server Application handling Server Actions, REST endpoints, RBAC session verification, and transactional domain logic. |
| **`worker`** | Node.js 20 Worker Process | Scheduled cron worker scanning for overdue invoices, computing monthly penalties, and driving batch billing cycles. |
| **`database`** | PostgreSQL 16 (18 Tables in 3NF) | ACID relational engine enforcing referential integrity, unique constraints, and isolation across 18 business entities. |
| **`storage`** | Cloudflare R2 / AWS S3 | Encrypted object storage preserving utility meter photos, repair evidence, and generated PDF e-statements. |

---

## 3. C4 Component Diagram - Level 3

The Component diagram inspects the internal modular architecture of the **Web & API Application Server** container, detailing functional service components and the Data Access Layer.

```mermaid
flowchart TB
    subgraph callers["Callers & Integrations"]
        spa["Single-Page Web Application<br/><i>[Container: React 19]</i>"]
        vietqr["VietQR Gateway<br/><i>[External System]</i>"]
        mail["Messaging Gateway<br/><i>[External System]</i>"]
        db[("PostgreSQL Database<br/><i>[ContainerDb: 18 Tables]</i>")]
        storage[("Object Storage<br/><i>[ContainerDb: S3 / R2]</i>")]
    end

    subgraph api["Web & API Application Server Container [Next.js 16]"]
        direction TB
        auth["1. Auth & RBAC Security Component<br/><i>[Component: Middleware / JWT]</i><br/>Session decryption, token validation, 4-tier role enforcement<br/>(ADMIN, MANAGER, TECHNICIAN, RESIDENT), and apartment-level row isolation."]
        
        subgraph domain_services["Core Domain Services"]
            apt["2. Apartment Management Component<br/><i>[Component: TypeScript Service]</i><br/>Manages unit directory, architectural floor plans,<br/>net floor area (m²), handover state, and legal title holders."]
            res["3. Resident & Household Registry<br/><i>[Component: TypeScript Service]</i><br/>Validates 12-digit Citizen IDs (CCCD), family ties,<br/>head-of-household rules, and residency state transitions."]
            park["4. Vehicle & Parking Component<br/><i>[Component: TypeScript Service]</i><br/>Enforces unit parking quotas (1 car, 2 bikes), assigns RFID cards,<br/>and reserves B1/B2 parking slots using pessimistic row locks."]
            bill["5. Utility & Automated Billing Engine<br/><i>[Component: TypeScript Calculation Engine]</i><br/>Ingests meter reads, computes tiered utility tariffs,<br/>runs batch invoice generation, and reconciles payments."]
            ticket["6. Maintenance Ticket SLA Component<br/><i>[Component: TypeScript Workflow Service]</i><br/>Handles repair reports, technician dispatching,<br/>SLA deadline tracking, and resolution photo logging."]
            notif["7. Notification & Dispatcher Service<br/><i>[Component: TypeScript Service]</i><br/>Compiles templates for e-statements, payment receipts,<br/>and SLA alerts, dispatching them to external queues."]
        end

        repo["8. Data Access Layer (DAL)<br/><i>[Component: PostgreSQL Driver / Pool]</i><br/>Manages connection pooling, enforces explicit ACID transaction wrappers<br/>(BEGIN ... COMMIT / ROLLBACK), and executes parameterized SQL."]
    end

    spa -- "HTTPS Requests + Session Token" --> auth
    auth --> apt & res & park & bill & ticket

    res -- "Validates linked unit" --> apt
    park -- "Checks apartment vehicle quota" --> apt
    bill -- "Reads unit floor area (m²)" --> apt
    bill -- "Retrieves active parking registrations" --> park
    bill -- "Triggers billing notices" --> notif
    ticket -- "Triggers ticket status updates" --> notif

    apt & res & park & bill & ticket --> repo
    repo -- "Executes parameterized SQL & ACID blocks [TCP 5432]" --> db

    bill -- "Signs payment session & receives IPN" --> vietqr
    ticket -- "Uploads resolution photos" --> storage
    notif -- "Dispatches e-statements & SMS" --> mail

    style auth fill:#0b4f9e,color:#fff,stroke:#083b77,stroke-width:2px
    style apt fill:#1168bd,color:#fff,stroke:#0b4f9e
    style res fill:#1168bd,color:#fff,stroke:#0b4f9e
    style park fill:#1168bd,color:#fff,stroke:#0b4f9e
    style bill fill:#1168bd,color:#fff,stroke:#0b4f9e
    style ticket fill:#1168bd,color:#fff,stroke:#0b4f9e
    style notif fill:#1168bd,color:#fff,stroke:#0b4f9e
    style repo fill:#065f46,color:#fff,stroke:#044332,stroke-width:2px
    style api fill:#f8fafc,stroke:#334155,stroke-width:2px,stroke-dasharray: 5 5
    style domain_services fill:#eff6ff,stroke:#bfdbfe
    style callers fill:#f1f5f9,stroke:#cbd5e1
```

---

## 4. C4 Dynamic Diagrams - Runtime View & Failure Twins

### 4.1. Workflow 1: VietQR Billing Settlement

#### Happy Path (Successful Settlement)

```mermaid
sequenceDiagram
    autonumber
    participant R as Resident
    participant SPA as Single-Page App
    participant BE as Billing Engine
    participant DAL as Data Access (DAL)
    participant DB as PostgreSQL
    participant GW as VietQR Gateway (Napas 247)
    participant NS as Notification Service

    R->>SPA: Clicks "Thanh toán VietQR"
    SPA->>BE: POST /api/invoices/{id}/pay-session
    BE->>GW: Request dynamic QR (invoice_id, amount, checksum)
    GW-->>BE: Returns signed QR string + Napas reference
    BE-->>SPA: 200 OK (QR image payload + session_id)
    SPA->>R: Displays VietQR on screen
    R->>GW: Scans QR & transfers funds via Banking App
    GW->>BE: Webhook IPN (POST /api/webhooks/vietqr)
    BE->>BE: Verify cryptographic HMAC-SHA256 signature
    BE->>DAL: executePaymentSettlement(invoice_id, amount, tx_code)
    DAL->>DB: BEGIN TRANSACTION
    DAL->>DB: INSERT INTO payment_transactions (...)
    DAL->>DB: UPDATE invoices SET status = 'PAID', paid_amount = total_amount
    DAL->>DB: COMMIT
    BE-->>GW: 200 OK (status: acknowledged)
    BE->>NS: dispatchPaymentReceipt(invoice_id)
    NS-->>R: Email / SMS Confirmation Receipt
    SPA->>SPA: WebSocket / Polling updates UI to PAID
```

#### Failure Twin (Network Timeout, Duplicate IPN, & Expiration)

```mermaid
sequenceDiagram
    autonumber
    participant R as Resident
    participant SPA as Single-Page App
    participant BE as Billing Engine
    participant DAL as Data Access Layer
    participant DB as PostgreSQL
    participant GW as VietQR Gateway (Napas 247)

    alt Scenario A: Dynamic QR Session Expired (> 15 minutes)
        R->>SPA: Scans QR after 15-minute window
        R->>GW: Submits transfer
        GW-->>R: Transfer rejected (QR Session Expired)
        SPA->>BE: GET /api/invoices/{id}/payment-status
        BE-->>SPA: 200 OK (status: EXPIRED)
        SPA->>R: Renders QR expired alert and offers refresh button
    else Scenario B: Duplicate / Replayed Webhook IPN (Network Lag)
        GW->>BE: Webhook IPN (Duplicate delivery due to retry)
        BE->>BE: Verify signature OK
        BE->>DAL: checkExistingTransaction(gateway_transaction_code)
        DAL->>DB: SELECT id FROM payment_transactions WHERE transaction_code = ?
        DB-->>DAL: Found record (Transaction already committed)
        Note over BE,DAL: Idempotency Guard: Suppress duplicate balance update!
        BE-->>GW: 200 OK (status: already_processed)
    else Scenario C: Database Failure during Commit
        GW->>BE: Webhook IPN
        BE->>DAL: executePaymentSettlement(...)
        DAL->>DB: BEGIN TRANSACTION
        DAL->>DB: UPDATE invoices ... (Connection Timeout / Deadlock)
        DB--xDAL: ERROR: Deadlock detected
        DAL->>DB: ROLLBACK
        BE-->>GW: 500 Internal Error (Webhook triggers gateway retry backoff)
        Note over BE,GW: Gateway will retry in 1m, 5m, 15m. No partial balance saved.
    end
```

---

### 4.2. Workflow 2: Month-End Batch Invoice Generation

#### Happy Path (Full Batch Success)

```mermaid
sequenceDiagram
    autonumber
    participant M as Building Accountant
    participant SPA as Single-Page App
    participant BE as Billing Engine
    participant DAL as Data Access Layer
    participant DB as PostgreSQL
    participant NS as Notification Service

    M->>SPA: Requests batch invoice generation for billing month
    SPA->>BE: POST /api/billing/batch-generate (month: 2026-09)
    BE->>DAL: fetchAllEligibleApartmentsWithMeters(2026-09)
    DAL->>DB: SELECT units, active_vehicles, meter_readings
    DB-->>DAL: Returns 1200 apartment records
    BE->>BE: Compute itemized fees for 1200 units (Area, Power, Water, Parking)
    BE->>DAL: insertBatchInvoices(1200 invoices, 4800 items)
    DAL->>DB: BEGIN TRANSACTION
    DAL->>DB: INSERT INTO invoices and invoice_items
    DAL->>DB: COMMIT
    BE->>NS: queueBatchNotification(2026-09)
    NS-->>M: Dispatches success alert: 1200 invoices issued
    BE-->>SPA: 200 OK (created: 1200, failed: 0)
```

#### Failure Twin (Missing Readings & Partial Rollback)

```mermaid
sequenceDiagram
    autonumber
    participant M as Building Accountant
    participant SPA as Single-Page App
    participant BE as Billing Engine
    participant DAL as Data Access Layer
    participant DB as PostgreSQL

    M->>SPA: Requests batch invoice generation for billing month
    SPA->>BE: POST /api/billing/batch-generate
    BE->>DAL: auditMetersAndDataIntegrity()
    DAL->>DB: SELECT missing_meters, negative_readings
    DB-->>DAL: Returns 12 units with unrecorded meters or negative usage
    
    alt Validation Guard Refuses Incomplete Batch
        BE-->>SPA: 422 Unprocessable Entity (Missing meter readings for units A-1204, B-0502)
        SPA->>M: Displays warning: 12 apartments missing meter readings
        Note over BE,DB: Zero invoices inserted. Platform maintains 100% financial integrity.
    else Batch Isolated Execution (Partial Commit with Dead-Letter)
        Note over BE: System generates invoices for 1188 valid units in chunks of 100
        Note over BE: 12 failed units are logged into dead-letter log for accountant audit
    end
```

---

## 5. C4 Deployment Diagram - Infrastructure View

The Deployment diagram maps ResidentHub containers to cloud infrastructure nodes, VPC security boundaries, and high-availability database tiers.

```mermaid
flowchart TB
    subgraph client_env["📱 End-User Client Device"]
        browser["Web Browser<br/><i>[Chrome, Firefox, Safari, Edge]</i><br/>Executes React 19 Single-Page App"]
    end

    subgraph cloud["☁️ Production Cloud Infrastructure"]
        subgraph edge_tier["Edge Security & Perimeter Tier (Cloudflare Anycast)"]
            waf["Cloudflare WAF & CDN<br/><i>[Reverse Proxy]</i><br/>DDoS Layer 7 defense, SSL/TLS 1.3 termination,<br/>and static asset caching"]
        end

        subgraph app_cluster["Application Server Cluster (Docker / Container Apps)"]
            direction TB
            api_pod["ResidentHub App Server Instance<br/><i>[Docker Container: Next.js 16 App Router]</i><br/>Stateless Server Action & API workers (Autoscaling: 2 - 10 pods)"]
            worker_pod["ResidentHub Cron Worker<br/><i>[Docker Container: Node.js 20]</i><br/>Singleton batch worker for billing cutoffs and reminder queues"]
        end

        subgraph db_cluster["Database Tier (AWS RDS Multi-AZ / Supabase Managed)"]
            direction LR
            db_primary[("PostgreSQL 16 - Primary Instance<br/><i>[Engine: db.r6g.xlarge]</i><br/>Handles read-write ACID transactions across 18 tables")]
            db_standby[("PostgreSQL 16 - Standby Replica<br/><i>[Multi-AZ Standby]</i><br/>Synchronous replication for zero-data-loss failover")]
        end

        subgraph storage_cluster["Object Storage Tier (Cloudflare R2 / AWS S3)"]
            s3[("Encrypted Media Bucket<br/><i>[S3 / R2 Bucket]</i><br/>Preserves meter captures, incident proofs, and PDF statements")]
        end
    end

    browser -- "HTTPS / TLS 1.3 (TCP 443)" --> waf
    waf -- "Internal HTTPS Proxy" --> api_pod
    api_pod -- "SQL Queries & Connection Pool (TCP 5432)" --> db_primary
    worker_pod -- "Batch queries (TCP 5432)" --> db_primary
    db_primary -. "Synchronous WAL Streaming" .-> db_standby
    api_pod -- "Uploads media via signed S3 API" --> s3
    browser -- "Downloads CDN public media directly" --> s3

    style browser fill:#08427b,color:#fff,stroke:#052e56
    style waf fill:#d97706,color:#fff,stroke:#b45309,stroke-width:2px
    style api_pod fill:#1168bd,color:#fff,stroke:#0b4f9e,stroke-width:2px
    style worker_pod fill:#2563eb,color:#fff,stroke:#1d4ed8
    style db_primary fill:#0284c7,color:#fff,stroke:#0369a1,stroke-width:2px
    style db_standby fill:#0284c7,color:#fff,stroke:#0369a1,stroke-dasharray: 4 4
    style s3 fill:#0284c7,color:#fff,stroke:#0369a1,stroke-width:2px
    style edge_tier fill:#fffbeb,stroke:#fde68a
    style app_cluster fill:#eff6ff,stroke:#bfdbfe
    style db_cluster fill:#f0fdf4,stroke:#bbf7d0
    style storage_cluster fill:#f0fdf4,stroke:#bbf7d0
    style cloud fill:#f8fafc,stroke:#64748b,stroke-width:2px,stroke-dasharray: 5 5
```

### Infrastructure Inventory

| Node | Environment | Deployed Artifact | Technical Specifications |
| :--- | :--- | :--- | :--- |
| **`waf`** | Cloudflare Edge | Reverse Proxy / WAF | Global DDoS mitigation, HTTP/3, TLS 1.3 termination, and automatic rate-limiting at 100 req/min/IP. |
| **`api_pod`** | Container Apps / ECS | Docker Image (`residenthub:latest`) | Horizontal Pod Autoscaler (HPA) scaling between 2 to 10 replicas on CPU > 70% or RPS spikes. |
| **`worker_pod`** | Container Daemon | Docker Image (`residenthub:latest`) | Singleton worker with distributed lease lock ensuring only 1 worker processes the 25th month-end billing. |
| **`db_primary`** | AWS RDS PostgreSQL 16 | Relational Storage | 18 tables in 3NF, automated daily snapshots, 30-day Point-in-Time Recovery (PITR), and connection pooling via PgBouncer. |
| **`db_standby`** | AWS RDS Multi-AZ | Hot Standby Replica | Zero-downtime automatic failover within 60 seconds of hardware or zone failure. |
| **`s3`** | Cloudflare R2 / S3 | Object Bucket | AES-256 server-side encrypted unstructured media storage with zero egress fee distribution via Cloudflare CDN. |

---

## 6. Architecture Fitness Functions & Integrity Tests

| Fitness Test | Enforced Rule | Failure Condition | Implementation |
| :--- | :--- | :--- | :--- |
| `LayersPointInward` | Layering | Client components importing DB directly; API routes referencing private UI components | ESLint `import/order` & project boundary lint rules |
| `NoCircularDependencies` | Modularity | Service modules forming circular dependency cycles | `madge --circular src/` check in CI pipeline |
| `EveryActionGuardsRBAC` | Security | Any Server Action or API mutation lacking a call to `enforceRole(...)` | Static AST analyzer test in Vitest |
| `FinancialCalculationsAreInteger` | Precision | Currency arithmetic producing floating-point fractional numbers | Unit test suite asserting integer VND rounding on all bills |
| `NoOrphanDatabaseEntities` | Integrity | Foreign keys configured without `ON DELETE RESTRICT/CASCADE` constraints | Database migration linter on `schema.sql` |
