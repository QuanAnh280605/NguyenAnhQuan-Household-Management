# ResidentHub - System Architecture Document (C4 Model & Pragmatic Mermaid)

This document provides the formal architectural specification for the **ResidentHub** platform (Apartment & Household Management System) using the **C4 Model** ([Simon Brown](https://c4model.com/)).

---

## 📑 Architecture Document Navigation

- 🏛️ **C4 Level 1**: [System Context Diagram](#1-c4-system-context-diagram---level-1) (Black Box boundary & Stakeholders)
- 📦 **C4 Level 2**: [Container Diagram](#2-c4-container-diagram---level-2) (Applications, Databases, and Storage)
- 🧩 **C4 Level 3**: [Component Diagrams](#3-c4-component-diagram---level-3)
  - [3.1. Presentation Tier Component Architecture](#31-presentation-tier--single-page-web-application-container-react-19--nextjs) (React 19 / Next.js Client)
  - [3.2. Application Tier Modular Services Architecture](#32-application-tier--web--api-application-server-container-nextjs-16) (Next.js 16 & Domain Services)
- ⚡ **C4 Dynamic**: [Runtime View & Failure Twins](#4-c4-dynamic-diagrams---runtime-view--failure-twins)
  - [4.1. Workflow 1: VietQR Billing Settlement [US-BIL-03, US-BIL-04]](#41-workflow-1-vietqr-billing-settlement-us-bil-03-us-bil-04)
  - [4.2. Workflow 2: Month-End Batch Invoice Generation [US-BIL-02]](#42-workflow-2-month-end-batch-invoice-generation-us-bil-02)
  - [4.3. Workflow 3: Maintenance Incident Ticket Lifecycle [US-TKT-01..04]](#43-workflow-3-maintenance-incident-ticket-lifecycle-us-tkt-01us-tkt-04)
- 🚀 **C4 Deployment**: [Production Deployment Topology](#5-c4-deployment-diagram---infrastructure-view) (Cloudflare Edge, AWS RDS Multi-AZ, S3)
- 🧪 **Fitness Functions**: [Integrity & Layering Gates](#6-architecture-fitness-functions--integrity-tests) (Automated CI assertions)
- 🔗 **Quad-Traceability Matrix**: [Requirements, UI, Architecture & DB Alignment](#7-full-quad-traceability-matrix)
- 📋 **Agile Requirements**: For User Stories and Gherkin Acceptance Criteria, see **[REQUIREMENTS_INVEST.md](REQUIREMENTS_INVEST.md)**.
- 🖥️ **UI/UX & IA Specifications**: For Information Architecture and Screen Hierarchy, see **[UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md)**.
- 📘 **arc42 Full Specification**: For the complete 12-section IEEE 42010 dossier, see **[ARCHITECTURE_ARC42.md](ARCHITECTURE_ARC42.md)**.
- 📋 **Use Case Specifications**: For UML catalogs and E2E journeys, see **[USE_CASES.md](USE_CASES.md)**.

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
        subgraph client_tier["Presentation & Ingress Gateway Tier"]
            spa["Single-Page Web Application & Proxy<br/><i>[Container: Next.js 16 App Router, React 19, TypeScript]</i><br/>Responsive web portal providing interactive KPI dashboards,<br/>citizen declaration forms, VietQR modals, and reverse proxy rewrite<br/>(/api/v1/:path* ➔ FastAPI:8000 with Resilient Fallback Store)."]
        end

        subgraph app_tier["Application & Execution Tier"]
            api["Backend API Application Server<br/><i>[Container: FastAPI, Python 3.11, AsyncPG]</i><br/>High-performance async backend executing 3-Tier Layering,<br/>pure domain services, EVN billing calculations, and concurrency locks.<br/><i>(Documented in ADR-0006 & ADR-0008)</i>"]
            worker["Scheduled Background Worker<br/><i>[Container: Python Async Daemon / Cron Process]</i><br/>Auditing overdue accounts (OVERDUE),<br/>triggering recurring billing cutoffs (25th), and dispatching reminders."]
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
    spa -- "Reverse-proxies /api/v1 or calls directly [JSON/HTTPS]" --> api
    api -- "Executes parameterized SQL & ACID transactions [AsyncPG / TCP 5432]" --> database
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
| **`spa`** | Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript | Client-side reactive UI delivering master-detail tables, KPI charts, VietQR modals, and seamless reverse proxy to FastAPI with Resilient Fallback Store ([ADR-0008](adr/ADR-0008-monorepo-nextjs16-fastapi-with-fallback-store.md)). Tested via Vitest ([ADR-0009](adr/ADR-0009-frontend-testing-with-vitest-and-testing-library.md)). |
| **`api`** | FastAPI, Python 3.11, AsyncPG | High-performance asynchronous backend executing 3-Tier Layering: APIRouters, Pure Domain Services, and AsyncPG Repositories ([ADR-0006](adr/ADR-0006-3tier-architecture-with-pure-domain-services.md)). Tested via Pytest (26 suites). |
| **`worker`** | Python Async Worker / Cron Process | Scheduled cron worker scanning for overdue invoices, computing monthly penalties, and driving batch billing cycles. |
| **`database`** | PostgreSQL 16 (18 Tables in 3NF) | ACID relational engine enforcing referential integrity, unique constraints, and isolation across 18 business entities ([ADR-0002](adr/ADR-0002-postgresql-3nf-relational-modeling.md)). |
| **`storage`** | Cloudflare R2 / AWS S3 | Encrypted object storage preserving utility meter photos, repair evidence, and generated PDF e-statements. |

---

## 3. C4 Component Diagram - Level 3

Adhering to Simon Brown's C4 model, Level 3 decomposes the platform's primary deployable containers into their internal structural components, responsibilities, and interface boundaries:
- **3.1. Presentation Tier**: Internal component architecture of the **Single-Page Web Application Container** (React 19 / Next.js Client), aligned directly with [UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md).
- **3.2. Application Tier**: Modular service architecture of the **Web & API Application Server Container** (Next.js 16 App Router & Services), mapped 1-to-1 with Epics in [REQUIREMENTS_INVEST.md](REQUIREMENTS_INVEST.md).

---

### 3.1. Presentation Tier — Single-Page Web Application Container (React 19 / Next.js)

```mermaid
flowchart TB
    subgraph Browser["Client Browser Runtime"]
        subgraph UIContainer["Single-Page Web Application Container [React 19 / Next.js]"]
            direction TB
            
            subgraph Shell["1. Shell & Navigation Layout"]
                appShell["AppShell Component<br/><i>[React Layout / Responsive Frame]</i>"]
                sidebar["Global Sidebar & Role Guard<br/><i>[Navigation / 4-Tier RBAC Filter]</i>"]
                breadcrumbs["Contextual Breadcrumbs<br/><i>[Dynamic Path Tracking]</i>"]
                cmdBar["Command Palette (Ctrl+K)<br/><i>[Omni Search Modal]</i>"]
            end

            subgraph PageModules["2. Domain Page Controllers"]
                dashView["DashboardOverviewView<br/><i>[/page.tsx]</i>"]
                aptView["ApartmentDirectoryView<br/><i>[/can-ho, /can-ho/[id]]</i>"]
                resView["ResidentHouseholdView<br/><i>[/cu-dan]</i>"]
                stayView["StayDeclarationView<br/><i>[/cu-tru, /lich-su-cu-tru]</i>"]
                parkView["ParkingFloorplanView<br/><i>[/phuong-tien-va-bai-do]</i>"]
                billView["BillingInvoicingView<br/><i>[/phi-chung-cu]</i>"]
                ticketView["TicketKanbanView<br/><i>[/phan-anh-va-yeu-cau]</i>"]
                adminView["AdminSecurityConsole<br/><i>[/nguoi-dung, /cai-dat]</i>"]
            end

            subgraph ActionModals["3. Interactive Drawers & Modals"]
                vietQrModal["VietQrPaymentModal<br/><i>[Napas 247 Dynamic QR + 15m Countdown]</i>"]
                slotDrawer["SlotAllocationDrawer<br/><i>[Basement Grid + Lock Guard]</i>"]
                resModal["ResidentRegisterModal<br/><i>[CCCD 12-digit Form + Validation]</i>"]
                ticketDrawer["TicketSubmitDrawer<br/><i>[Multi-photo Upload Proof]</i>"]
            end

            subgraph UIAtoms["4. Reusable UI Atoms & Core Patterns"]
                dataTable["AppDataTable<br/><i>[Sticky Header, Pagination, Batch Checkbox]</i>"]
                filterBar["OmniFilterBar<br/><i>[Faceted Dropdowns & Debounce 300ms]</i>"]
                badge["StatusBadge & Chips<br/><i>[Semantic Tokens: Emerald, Amber, Rose]</i>"]
                kpiCard["MetricKpiCard<br/><i>[Shimmer Skeleton + Metric Display]</i>"]
            end

            subgraph ClientIngress["5. Client State & Service Adapters"]
                serverActions["Server Action Invokers<br/><i>[Next.js Server Actions Protocol]</i>"]
                restClient["REST Client Adapter<br/><i>[Fetch API + RFC 7807 Error Parser]</i>"]
                stateCache["Optimistic State Manager<br/><i>[React 19 useOptimistic / Cache]</i>"]
            end
        end
    end

    subgraph Backend["Application Server Container [Next.js 16]"]
        authMiddleware["Auth & RBAC Middleware"]
        apiEndpoints["REST Route Handlers (/api/v1/*)"]
        actionEndpoints["Server Action Handlers"]
    end

    sidebar & breadcrumbs & cmdBar --> appShell
    appShell --> PageModules
    PageModules --> UIAtoms
    PageModules --> ActionModals
    ActionModals --> UIAtoms

    PageModules & ActionModals --> ClientIngress
    serverActions --> actionEndpoints
    restClient --> apiEndpoints
    apiEndpoints & actionEndpoints --> authMiddleware

    style UIContainer fill:#f8fafc,stroke:#0284c7,stroke-width:2px
    style Shell fill:#eff6ff,stroke:#bfdbfe
    style PageModules fill:#eff6ff,stroke:#bfdbfe
    style ActionModals fill:#f0fdf4,stroke:#bbf7d0
    style UIAtoms fill:#fdf4ff,stroke:#f5d0fe
    style ClientIngress fill:#fffbeb,stroke:#fde68a
    style Backend fill:#f1f5f9,stroke:#64748b,stroke-dasharray: 4 4
```

---

### 3.2. Application Tier — Backend Application Server Container (FastAPI / Python 3.11)

The Application Tier inspects the internal modular architecture of the **FastAPI Application Server** container, detailing functional domain services and repositories aligned 1-to-1 with the 6 business Epics from [REQUIREMENTS_INVEST.md](REQUIREMENTS_INVEST.md) and [ADR-0006](adr/ADR-0006-3tier-architecture-with-pure-domain-services.md):

```mermaid
flowchart TB
    subgraph callers["Callers & Integrations"]
        spa["Single-Page Web Application<br/><i>[Container: Next.js 16 / React 19]</i>"]
        vietqr["VietQR Gateway<br/><i>[External System: Napas 247]</i>"]
        mail["Messaging Gateway<br/><i>[External System: SMTP / ZNS]</i>"]
        db[("PostgreSQL Database<br/><i>[ContainerDb: 18 Tables in 3NF]</i>")]
        storage[("Object Storage<br/><i>[ContainerDb: S3 / Cloudflare R2]</i>")]
    end

    subgraph api["Backend Application Server Container [FastAPI / Python 3.11]"]
        direction TB
        auth["1. Auth & RBAC Security Guard<br/><i>[Component: FastAPI Dependency / JWT Bearer]</i><br/>Enforces 4-tier RBAC (ADMIN, MANAGER, TECHNICIAN, RESIDENT),<br/>token decoding, and apartment-level row isolation (EPIC-06)."]
        
        subgraph domain_services["Core Pure Domain Services (Epics Alignment)"]
            apt["2. Apartment Management Service<br/><i>[Component: Python Service - apartment_service.py]</i><br/><b>EPIC-01 (US-APT-01..03):</b> Unit directory, floor plans,<br/>floor area (m²), and legal ownership succession."]
            res["3. Resident & Household Service<br/><i>[Component: Python Service - resident_service.py]</i><br/><b>EPIC-02 (US-RES-01..04):</b> CCCD 12-digit validation,<br/>single head-of-household invariant, and stay declarations."]
            park["4. Vehicle & Parking Service<br/><i>[Component: Python Service - parking_service.py]</i><br/><b>EPIC-03 (US-VEH-01..04):</b> Quota limits (1 car, 2 bikes),<br/>RFID card provisioning, and pessimistic lock slot allocation."]
            bill["5. Utility & Billing Calculation Engine<br/><i>[Component: Python Engine - billing_service.py]</i><br/><b>EPIC-04 (US-BIL-01..05):</b> Tiered tariffs, anomaly detection,<br/>batch invoicing on the 25th, and VietQR dynamic sessions."]
            ticket["6. Maintenance SLA Workflow Service<br/><i>[Component: Python Service - feedback_service.py]</i><br/><b>EPIC-05 (US-TKT-01..04):</b> Defect intake, technician dispatch,<br/>SLA watchdog countdown, and resolution photo proofs."]
            notif["7. Notification & Dispatcher Service<br/><i>[Component: Async Python Service]</i><br/>Compiles templates for e-statements, payment receipts,<br/>and urgent SLA breach alerts, pushing to external queues."]
        end

        repo["8. Data Access Repositories (DAL)<br/><i>[Component: AsyncPG Connection Pool - repositories/*.py]</i><br/>Manages connection pooling, explicit ACID transactions<br/>(BEGIN ... COMMIT / ROLLBACK), and parameterized SQL."]
    end

    spa -- "HTTPS JSON API Calls (Direct or Proxied)" --> auth
    auth --> apt & res & park & bill & ticket

    res -- "Validates linked unit" --> apt
    park -- "Checks apartment vehicle quota" --> apt
    bill -- "Reads unit floor area (m²)" --> apt
    bill -- "Retrieves active parking registrations" --> park
    bill -- "Triggers billing notices" --> notif
    ticket -- "Triggers ticket status updates" --> notif

    apt & res & park & bill & ticket --> repo
    repo -- "Executes parameterized SQL & ACID blocks [AsyncPG / TCP 5432]" --> db

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

### 4.1. Workflow 1: VietQR Billing Settlement [US-BIL-03, US-BIL-04]

#### Happy Path (Successful Settlement)
*Triggered from UI Modal: `VietQrPaymentModal` on `/phi-chung-cu`*

```mermaid
sequenceDiagram
    autonumber
    participant R as Resident
    participant SPA as Single-Page App (VietQrPaymentModal)
    participant BE as Billing Engine (US-BIL-03)
    participant DAL as Data Access (DAL)
    participant DB as PostgreSQL
    participant GW as VietQR Gateway (Napas 247)
    participant NS as Notification Service

    R->>SPA: Clicks "Thanh toán VietQR"
    SPA->>BE: POST /api/invoices/{id}/pay-session
    BE->>GW: Request dynamic QR (invoice_id, amount, checksum)
    GW-->>BE: Returns signed QR string + Napas reference
    BE-->>SPA: 200 OK (QR image payload + session_id)
    SPA->>R: Displays VietQR with 15-minute countdown
    R->>GW: Scans QR & transfers funds via Banking App
    GW->>BE: Webhook IPN (POST /api/webhooks/vietqr) [US-BIL-04]
    BE->>BE: Verify cryptographic HMAC-SHA256 signature
    BE->>DAL: executePaymentSettlement(invoice_id, amount, tx_code)
    DAL->>DB: BEGIN TRANSACTION
    DAL->>DB: INSERT INTO payment_transactions (...)
    DAL->>DB: UPDATE invoices SET status = 'PAID', paid_amount = total_amount
    DAL->>DB: COMMIT
    BE-->>GW: 200 OK (status: acknowledged)
    BE->>NS: dispatchPaymentReceipt(invoice_id)
    NS-->>R: Email / SMS Confirmation Receipt
    SPA->>SPA: Polling receives status PAID -> Triggers Success Fireworks
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

### 4.2. Workflow 2: Month-End Batch Invoice Generation [US-BIL-02]

#### Happy Path (Full Batch Success)
*Triggered from UI Action: `MonthlyBillingAction` on `/phi-chung-cu`*

```mermaid
sequenceDiagram
    autonumber
    participant M as Building Accountant
    participant SPA as Single-Page App
    participant BE as Billing Engine (US-BIL-02)
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

### 4.3. Workflow 3: Maintenance Incident Ticket Lifecycle [US-TKT-01..US-TKT-04]

*Triggers and orchestrates the defect lifecycle between Resident, Manager, and Field Technician:*

```mermaid
sequenceDiagram
    autonumber
    participant RES as Resident (ACT-RES)
    participant UI as TicketKanbanView & Drawer
    participant TKT as Maintenance Service (US-TKT-01..03)
    participant S3 as Encrypted Media S3
    participant DB as PostgreSQL (feedbacks, feedback_updates)
    participant CRON as SLA Watchdog Daemon (US-TKT-04)
    participant MGR as Building Manager (ACT-MGR)

    Note over RES,UI: 1. Incident Submission [US-TKT-01]
    RES->>UI: Fills defect report & attaches 2 photos
    UI->>S3: Uploads images via Pre-signed URL
    S3-->>UI: S3 Object keys returned
    UI->>TKT: POST /api/tickets (priority: HIGH, sla_target: +4h)
    TKT->>DB: INSERT INTO feedbacks (status: PENDING)
    TKT-->>UI: 201 Created (Ticket #TKT-1082)

    Note over MGR,TKT: 2. Dispatch & Tech Assignment [US-TKT-02]
    MGR->>UI: Selects Ticket #TKT-1082 & assigns Electrician
    UI->>TKT: PATCH /api/tickets/1082/dispatch (assigned_to: Tech_ID)
    TKT->>DB: UPDATE feedbacks SET status = 'PROCESSING', assigned_to = Tech_ID
    TKT->>DB: INSERT INTO feedback_updates (event: DISPATCHED)

    alt SLA Breach Detection [US-TKT-04]
        CRON->>DB: Scans pending tickets where NOW() > target_sla
        DB-->>CRON: Found Ticket #TKT-1082 SLA breached
        CRON->>MGR: Sends Emergency Escalation Push Notification
        CRON->>DB: UPDATE feedbacks SET sla_status = 'BREACHED'
    end

    Note over TKT,DB: 3. Inspection & Resolution Proof [US-TKT-03]
    TKT->>S3: Uploads resolution completion photo proof
    TKT->>DB: UPDATE feedbacks SET status = 'RESOLVED', resolved_at = NOW()
    TKT-->>RES: Push notification: Ticket resolved, please rate satisfaction
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

---

## 7. Full Quad-Traceability Matrix

This matrix establishes 100% bidirectional traceability between **Agile Requirements (INVEST)**, **User Interface Architecture (IA & Screens)**, **C4 Model Components (Front & Back)**, and the **3NF Relational Database Schema**:

| INVEST User Story | UI Screen / Modal Component | C4 Frontend Component | C4 Backend Domain Service | PostgreSQL Relational Tables (3NF) |
| :--- | :--- | :--- | :--- | :--- |
| **`US-APT-01`** (Tra cứu căn hộ) | `/can-ho` (Apartments View) | `ApartmentDirectoryView` | `ApartmentService` | `apartments`, `buildings` |
| **`US-APT-02`** (Thêm căn hộ mới) | `ApartmentCreateModal` | `ActionModals.resModal` | `ApartmentService` | `apartments`, `owners`, `apartment_owners` |
| **`US-APT-03`** (Bàn giao căn hộ) | `/can-ho/[id]` (Dossier View) | `ApartmentDirectoryView` | `ApartmentService` | `apartment_owners`, `apartments` |
| **`US-RES-01`** (Đăng ký nhân khẩu) | `ResidentRegisterModal` | `ActionModals.resModal` | `ResidentService` | `residents`, `household_members` |
| **`US-RES-02`** (Chuyển đổi chủ hộ) | `HouseholdHeadTransferModal`| `ResidentHouseholdView` | `ResidentService` | `households`, `household_members` |
| **`US-RES-03`** (Khai báo tạm trú) | `/cu-tru` (Stay Declaration Form)| `StayDeclarationView` | `ResidentService` | `residence_records` |
| **`US-RES-04`** (Phê duyệt cư trú) | `/lich-su-cu-tru` (Audit History)| `StayDeclarationView` | `ResidentService` | `residence_records` |
| **`US-VEH-01`** (Đăng ký xe & Quota)| `VehicleRegisterModal` | `ParkingFloorplanView` | `ParkingService` | `vehicles`, `apartments` |
| **`US-VEH-02`** (Cấp nốt đỗ bi quan)| `SlotAllocationDrawer` | `ActionModals.slotDrawer`| `ParkingService` | `parking_slots`, `vehicles` |
| **`US-VEH-03`** (Kích hoạt RFID) | `RfidActivationCard` | `ParkingFloorplanView` | `ParkingService` | `vehicles` |
| **`US-VEH-04`** (Hủy đăng ký xe) | `VehicleRevokeDialog` | `ParkingFloorplanView` | `ParkingService` | `vehicles`, `parking_slots` |
| **`US-BIL-01`** (Ghi chỉ số điện nước)| `MeterReadingBatchModal` | `BillingInvoicingView` | `BillingEngine` | `meter_readings`, `apartments` |
| **`US-BIL-02`** (Phát hành hóa đơn) | `MonthlyBillingAction` | `BillingInvoicingView` | `BillingEngine` | `invoices`, `invoice_items`, `fee_types` |
| **`US-BIL-03`** (Mã VietQR động) | `VietQrPaymentModal` | `ActionModals.vietQrModal`| `BillingEngine` | `invoices`, `payment_transactions` |
| **`US-BIL-04`** (Webhook IPN gạch nợ)| `/api/webhooks/vietqr` | `ClientIngress.restClient`| `BillingEngine` | `payment_transactions`, `invoices` |
| **`US-BIL-05`** (Quét nợ quá hạn) | Cron Background Worker | `WorkerProcess` | `BillingEngine` | `invoices` |
| **`US-TKT-01`** (Gửi phản ánh sự cố)| `TicketSubmitDrawer` | `ActionModals.ticketDrawer`| `MaintenanceSlaService` | `feedbacks`, `feedback_updates` |
| **`US-TKT-02`** (Điều phối kỹ thuật) | `TicketDispatchModal` | `TicketKanbanView` | `MaintenanceSlaService` | `feedback_updates`, `feedbacks` |
| **`US-TKT-03`** (Nghiệm thu ảnh chụp)| `TicketResolveDrawer` | `TicketKanbanView` | `MaintenanceSlaService` | `feedbacks`, `feedback_updates` |
| **`US-TKT-04`** (Leo thang vi phạm SLA)| Cron SLA Watchdog | `WorkerProcess` | `MaintenanceSlaService` | `feedbacks` |
| **`US-ADM-01`** (Quản lý RBAC 4 cấp)| `/nguoi-dung` (User Management) | `AdminSecurityConsole` | `SecurityAuthService` | `users` |
| **`US-ADM-02`** (Cấu hình biểu phí) | `/cai-dat` (Fee Tariffs) | `AdminSecurityConsole` | `BillingEngine` | `fee_types` |
| **`US-ADM-03`** (Nhật ký kiểm toán) | `/cai-dat` (Audit Trail) | `AdminSecurityConsole` | `SecurityAuthService` | `audit_logs` |
