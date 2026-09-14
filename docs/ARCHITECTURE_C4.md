# ResidentHub - System Architecture Document (C4 Model & Mermaid Diagrams)

This document provides a comprehensive architectural specification for the **ResidentHub** platform (Apartment & Household Management System) using the **Mermaid C4 Diagram** syntax, strictly following the [Simon Brown C4 Model](https://c4model.com/), [Mermaid C4 Syntax](https://mermaid.ai/open-source/syntax/c4.html), and [C4-PlantUML Standards](https://github.com/plantuml-stdlib/C4-PlantUML/blob/master/README.md).

The architecture is organized across **4 core hierarchical levels** and **2 supplementary diagrams**:
1. [C4 System Context Diagram (`C4Context`) - Level 1](#1-c4-system-context-diagram-c4context---level-1)
2. [C4 Container Diagram (`C4Container`) - Level 2](#2-c4-container-diagram-c4container---level-2)
3. [C4 Component Diagram (`C4Component`) - Level 3](#3-c4-component-diagram-c4component---level-3)
4. [C4 Code & Data Architecture - Level 4](#4-c4-code--data-architecture---level-4)
5. [C4 Dynamic Diagram (`C4Dynamic`) - Supplementary Operational Workflow](#5-c4-dynamic-diagram-c4dynamic---supplementary-operational-workflow)
6. [C4 Deployment Diagram (`C4Deployment`) - Supplementary Infrastructure View](#6-c4-deployment-diagram-c4deployment---supplementary-infrastructure-view)

---

## 1. C4 System Context Diagram (`C4Context`) - Level 1

The System Context diagram illustrates the high-level boundary of **ResidentHub** within the building management ecosystem. Adhering strictly to C4 Level 1 principles, **ResidentHub is treated as a Black Box**, orchestrating internal stakeholders (`Person`) and third-party ecosystems (`System_Ext`).

```mermaid
C4Context
    title System Context diagram for ResidentHub - Apartment & Household Management

    Person(resident, "Resident / Household Head", "Apartment resident: Views statements, pays utility bills via VietQR, and submits maintenance requests.")
    Person(manager, "Building Management & Accounting", "Operations staff: Manages unit directory, reviews residency registrations, logs meter readings, and issues invoices.")
    Person(tech, "Building Technician", "Maintenance staff: Receives repair tickets, inspects technical issues on-site, and logs SLA resolution proofs.")
    Person(admin, "System Administrator", "Internal IT Admin: Governs user accounts, configures building parameters, and enforces RBAC policies.")

    Enterprise_Boundary(b0, "Building Management Ecosystem") {
        System(residentHub, "ResidentHub Platform", "Central digital platform operating apartment facilities, household registries, and automated utility billing across an 18-table relational PostgreSQL schema.")
    }

    System_Ext(vietqr, "VietQR Payment Gateway", "Financial gateway generating dynamic Napas 247 QR codes and dispatching IPN Webhook payment notifications.")
    System_Ext(notif, "Notification Service (Email/SMS)", "Multi-channel messaging service dispatching monthly e-statements, Zalo ZNS notifications, and urgent alerts.")
    System_Ext(civil, "Public Residency Portal", "Civil registration authority system for synchronizing and auditing legal permanent and temporary stay records (Planned Integration).")

    Rel(resident, residentHub, "Views statements, pays utility bills, files complaints", "HTTPS")
    Rel(manager, residentHub, "Operates units, records meters, issues invoices", "HTTPS")
    Rel(tech, residentHub, "Receives work orders, updates resolution SLA", "HTTPS")
    Rel(admin, residentHub, "Configures parameters, governs user permissions", "HTTPS")

    Rel(residentHub, vietqr, "Initiates payment requests & receives settlement Webhooks", "JSON / HTTPS")
    Rel(residentHub, notif, "Dispatches e-statements and operational announcements", "SMTP / REST API")
    Rel(residentHub, civil, "Synchronizes & verifies legal residency records", "REST API")

    UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
```

### Context Elements Catalog
| Identifier | C4 Type | Display Label | Description & Responsibilities |
| :--- | :--- | :--- | :--- |
| `resident` | `Person` | Resident / Household Head | Self-service portal user: reviews bills, completes VietQR payments, and files service requests. |
| `manager` | `Person` | Building Management & Accounting | Operational user: inputs utility indices, generates monthly batch invoices, and reviews stay declarations. |
| `tech` | `Person` | Building Technician | Field staff: claims service tickets, uploads completion photo evidence, and meets operational SLAs. |
| `admin` | `Person` | System Administrator | Internal IT operator: system configuration, security governance, and 4-tier RBAC management (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`). |
| `residentHub` | `System` | ResidentHub Platform | Single Source of Truth for building operations, resident census, and financial ledger. |
| `vietqr` | `System_Ext` | VietQR Gateway | Inter-bank switch providing Napas 247 dynamic QR codes and IPN transaction callbacks. |
| `notif` | `System_Ext` | Notification Service | External delivery network for e-statements and debt reminders via Email / SMS / Zalo ZNS. |
| `civil` | `System_Ext` | Public Residency Portal | Governmental civil registry interface for residency audit and compliance checking. |

---

## 2. C4 Container Diagram (`C4Container`) - Level 2

The Container diagram zooms into **ResidentHub**, decomposing the platform into independently executable software applications (`Container`), data storage units (`ContainerDb`), and their communication protocols.

```mermaid
C4Container
    title Container diagram for ResidentHub Platform

    Person(resident, "Resident", "Apartment resident accessing services")
    Person(manager, "Building Manager", "Operations & accounting staff")
    Person(tech, "Technician", "Maintenance & repair staff")
    Person(admin, "System Admin", "Internal IT security administrator")

    Container_Boundary(c1, "ResidentHub Platform Boundary") {
        Container(spa, "Single-Page Web Application", "React 19, Tailwind CSS v4, TypeScript", "Responsive client portal providing KPI dashboards, unit directory, interactive registration forms, and VietQR payment modals.")
        Container(api, "Web & API Application Server", "Next.js 16 App Router, Node.js 20, TypeScript", "Executes core business logic, RBAC enforcement, finite state machines, automated billing calculations, and Server Actions.")
        Container(worker, "Cron Background Worker", "Node.js Worker Process", "Scheduled batch process scanning for overdue invoices (OVERDUE) and orchestrating recurring billing cutoffs on the 25th.")
        ContainerDb(database, "Relational Database", "PostgreSQL 16 Engine", "Stores 18 normalized 3NF relational tables: Buildings, Apartments, Owners, Co-owners, Residents, Households, Members, Stay Records, Vehicles, Parking Slots, Tariffs, Meters, Invoices, Invoice Items, Transactions, Users, Feedbacks, and SLA Updates.")
        ContainerDb(storage, "Object & File Storage", "Cloudflare R2 / AWS S3", "Secure cloud storage holding utility meter snapshots, maintenance incident evidence, and digital payment receipts.")
    }

    System_Ext(vietqr, "VietQR Payment Gateway", "Financial gateway generating dynamic Napas 247 QR codes and sending IPN Webhooks.")
    System_Ext(mail, "Email / SMS Delivery Network", "Automated distribution service for monthly statements and payment reminder notices.")
    System_Ext(civil, "Public Residency Portal", "Civil police registry for legal residency verification (Planned Integration).")

    Rel(resident, spa, "Interacts with portal via web browser", "HTTPS")
    Rel(manager, spa, "Executes building administration tasks", "HTTPS")
    Rel(tech, spa, "Receives and updates maintenance tickets", "HTTPS")
    Rel(admin, spa, "Configures system settings and RBAC", "HTTPS")

    Rel(spa, api, "Dispatches API requests & Server Actions", "JSON / HTTPS")
    Rel(api, database, "Reads and writes transactional data", "SQL / TCP 5432")
    Rel(worker, database, "Scans overdue balances and updates statuses", "SQL / TCP 5432")
    Rel(api, storage, "Uploads incident proofs and receipts", "HTTPS / S3 API")
    Rel(spa, storage, "Fetches uploaded assets directly via CDN", "HTTPS / CDN")

    Rel(api, vietqr, "Initializes payment transactions & receives Webhook IPN", "JSON / HTTPS")
    Rel(api, mail, "Dispatches operational notifications & e-invoices", "SMTP / REST")
    Rel(api, civil, "Synchronizes official residency records", "REST API")
```

### Container Inventory
| Container | Tech Stack & Environment | Primary Technical Responsibilities |
| :--- | :--- | :--- |
| **`spa`** | React 19, Tailwind CSS v4, TypeScript | Client-side presentation tier rendering reactive administrative tables, charting metrics, payment QR dialogs, and citizen declaration forms. |
| **`api`** | Next.js 16 App Router, Node.js 20 | Internal API Gateway, React Server Components (RSC), Server Actions, RBAC authorization, and automated Billing Engine execution. |
| **`worker`** | Node.js Worker Process | Headless cron runner executing scheduled batch tasks: month-end meter audits, penalty fees, and overdue state transitions. |
| **`database`** | PostgreSQL 16 (18 Tables in 3NF) | Primary ACID relational database maintaining referential integrity across 18 business entities with strict foreign keys and composite unique constraints. |
| **`storage`** | Cloudflare R2 / AWS S3 | Encrypted object storage preserving binary media: meter capture images, maintenance attachments, and PDF e-statements. |

---

## 3. C4 Component Diagram (`C4Component`) - Level 3

The Component diagram inspects the internals of the **Web & API Application Server** container, detailing functional modules (`Component`), the notification engine, and the Data Access Layer (`repo`).

```mermaid
C4Component
    title Component diagram for ResidentHub - Web & API Application Server

    Container(spa, "Single-Page Web App", "React 19", "Client Web Interface")
    ContainerDb(db, "PostgreSQL Database", "PostgreSQL 16", "Stores 18 normalized 3NF relational tables")
    ContainerDb(storage, "Object Storage", "S3 / R2", "Multimedia asset repository")
    System_Ext(vietqr, "VietQR Gateway", "Napas 247", "Inter-bank payment switch")
    System_Ext(mail, "Email / SMS Network", "SMTP / ZNS", "External messaging infrastructure")

    Container_Boundary(api, "Web & API Application Server Container") {
        Component(auth, "1. Auth & RBAC Security Component", "TypeScript Middleware / JWT", "Authenticates identity tokens, enforces 4 system roles (ADMIN, MANAGER, TECHNICIAN, RESIDENT), and ensures apartment data isolation.")
        Component(apt, "2. Apartment Management Component", "TypeScript Service", "Manages physical floor plans, net floor areas (m²), handover statuses, and legal ownership contracts.")
        Component(res, "3. Resident & Household Registry", "TypeScript Service", "Validates 12-digit Citizen IDs (CCCD), household books, co-inhabitant links, and executes residency state machines.")
        Component(park, "4. Vehicle & Parking Component", "TypeScript Service", "Enforces unit parking quotas (1 car, 2 bikes), assigns RFID tags, and reserves B1/B2 parking slots using pessimistic row locks.")
        Component(bill, "5. Utility & Automated Billing Engine", "TypeScript Calculation Engine", "Ingests meter reads, computes tiered utility tariffs and area fees, runs batch invoice generation, and reconciles payments.")
        Component(ticket, "6. Maintenance Ticket SLA Component", "TypeScript Workflow Service", "Handles resident repair reports, technician dispatching, SLA deadline tracking, and on-site photo audit logging.")
        Component(notif, "7. Notification & Dispatcher Service", "TypeScript Service", "Orchestrates template generation for e-statements, payment reminders, and SLA progress updates dispatched to email/SMS.")
        Component(repo, "8. Data Access Layer", "TypeScript / PostgreSQL Driver", "Manages database connection pooling, enforces ACID transaction blocks, and runs parameterized SQL queries across all 18 tables.")

        Rel(auth, apt, "Authorizes request")
        Rel(auth, res, "Authorizes request")
        Rel(auth, park, "Authorizes request")
        Rel(auth, bill, "Authorizes request")
        Rel(auth, ticket, "Authorizes request")

        Rel(res, apt, "Validates linked apartment unit")
        Rel(park, apt, "Verifies apartment parking quota")
        Rel(bill, apt, "Retrieves apartment area (m²)")
        Rel(bill, park, "Retrieves active registered vehicle count")
        Rel(bill, notif, "Triggers invoice statement dispatch")
        Rel(ticket, notif, "Triggers ticket status update alerts")

        Rel(apt, repo, "Persists unit & ownership entities")
        Rel(res, repo, "Persists citizen & household records")
        Rel(park, repo, "Persists vehicles & slot allocations")
        Rel(bill, repo, "Persists invoices, items & transactions")
        Rel(ticket, repo, "Persists tickets & resolution logs")
    }

    Rel(spa, auth, "Submits HTTP Requests + Session JWT", "JSON / HTTPS")
    Rel(ticket, storage, "Uploads incident evidence photos", "S3 API")
    Rel(bill, vietqr, "Generates dynamic QR & receives Webhook IPN", "JSON / HTTPS")
    Rel(notif, mail, "Dispatches e-statements & alert notices", "SMTP / REST API")
    Rel(repo, db, "Executes SQL Queries & ACID Transactions", "TCP 5432")
```

### Component Catalog
| Identifier | Component Name | Technical Description & Responsibilities |
| :--- | :--- | :--- |
| **`auth`** | Auth & RBAC Security | Session decryption, token validation, 4-tier role enforcement (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`), and apartment-level row isolation. |
| **`apt`** | Apartment Component | Manages architectural layout, unit specifications, and legal titles (`apartments`, `owners`, `apartment_owners`). |
| **`res`** | Resident Registry | Validates National Citizen IDs, tracks family relationships, and governs stay state transitions (`residents`, `households`, `household_members`, `residence_records`). |
| **`park`** | Parking Component | Validates per-unit quotas, assigns RFID access cards, and prevents double-booking using pessimistic database locks (`vehicles`, `parking_slots`). |
| **`bill`** | Billing Engine | Computes tiered electricity/water consumption, calculates area-based fees, and generates itemized monthly bills (`invoices`, `invoice_items`, `meter_readings`, `fee_types`). |
| **`ticket`** | Ticket SLA Component | Workflow manager handling resident ticket creation, technician assignment, and SLA timer monitoring (`feedbacks`, `feedback_updates`). |
| **`notif`** | Notification Service | Template compiler and queue dispatcher forwarding billing notices and critical announcements to email and messaging gateways. |
| **`repo`** | Data Access Layer | Encapsulates connection pooling, parameterized query execution, and multi-table atomic transaction wrappers across all 18 database tables. |

---

## 4. C4 Code & Data Architecture - Level 4

Level 4 maps software components down to physical data modeling and object-oriented design patterns implemented in code.

### 4.1. The 18-Table Relational Schema Catalog (3NF)
The physical persistence layer is formally defined in [schema.sql](file:///d:/VSF/chung-cu-household-management/schema.sql) and [database/schema.dbml](file:///d:/VSF/chung-cu-household-management/database/schema.dbml), organized into 5 core business domains:

```mermaid
erDiagram
    BUILDINGS ||--o{ APARTMENTS : contains
    APARTMENTS ||--o{ APARTMENT_OWNERS : has
    OWNERS ||--o{ APARTMENT_OWNERS : owns
    APARTMENTS ||--o{ HOUSEHOLDS : hosts
    HOUSEHOLDS ||--o{ HOUSEHOLD_MEMBERS : includes
    RESIDENTS ||--o{ HOUSEHOLD_MEMBERS : member_of
    RESIDENTS ||--o{ RESIDENCE_RECORDS : logs
    APARTMENTS ||--o{ VEHICLES : registers
    PARKING_SLOTS ||--o| VEHICLES : parks
    APARTMENTS ||--o{ METER_READINGS : measures
    APARTMENTS ||--o{ INVOICES : bills
    FEE_TYPES ||--o{ INVOICE_ITEMS : categorizes
    INVOICES ||--o{ INVOICE_ITEMS : contains
    INVOICES ||--o{ PAYMENT_TRANSACTIONS : pays
    USERS ||--o{ FEEDBACKS : reports
    FEEDBACKS ||--o{ FEEDBACK_UPDATES : tracks
```

1. **Property & Asset Domain**: `buildings` (physical structures), `apartments` (living units), `owners` (legal title holders), `apartment_owners` (co-ownership relations).
2. **Residency & Census Domain**: `residents` (citizen profiles), `households` (family registry units), `household_members` (head/member relations), `residence_records` (temporary stay and absence history).
3. **Parking & Vehicle Domain**: `parking_slots` (underground B1/B2 slots), `vehicles` (registered motor vehicles and bikes).
4. **Finance & Metering Domain**: `fee_types` (tariff policies), `meter_readings` (utility meter readings), `invoices` (master monthly bill), `invoice_items` (line-item charge breakdown), `payment_transactions` (reconciled payment receipts).
5. **Governance & Service Domain**: `users` (system accounts and security credentials), `feedbacks` (incident service tickets), `feedback_updates` (chronological resolution and SLA audit log).

### 4.2. Core Design Patterns in Code
- **Strategy Pattern (Fee Calculation)**: Isolates tariff formulas (area-based maintenance fees, 6-tier progressive electricity tariffs, clean water tiers, and vehicle quota formulas) into interchangeable calculation strategies.
- **Finite State Machine (FSM)**:
  - *Residency Status*: `PERMANENT` $\leftrightarrow$ `ABSENT` $\rightarrow$ `MOVED`.
  - *Invoice Lifecycle*: `UNPAID` $\rightarrow$ `PARTIAL` $\rightarrow$ `PAID` / `OVERDUE`.
  - *Maintenance SLA*: `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
- **Repository & Unit of Work**: Ensures atomicity across multi-table operations through explicit PostgreSQL transactions (`BEGIN ... COMMIT / ROLLBACK`).

---

## 5. C4 Dynamic Diagram (`C4Dynamic`) - Supplementary Operational Workflow

The Dynamic diagram demonstrates the runtime collaboration between users, software components, and external gateways during the end-of-month utility billing and secure VietQR settlement cycle.

```mermaid
C4Dynamic
    title Dynamic diagram for ResidentHub - Monthly Billing & VietQR Settlement Flow

    Person(manager, "Building Management", "Accounting & operations staff")
    Person(resident, "Resident", "Apartment owner / tenant")
    Container(spa, "Single-Page Web App", "React 19", "Client Portal")
    Component(bill, "Utility & Billing Engine", "TypeScript", "Calculation Engine")
    Component(notif, "Notification Service", "TypeScript", "Dispatcher Service")
    Component(repo, "Data Access Layer", "TypeScript", "Database Access Tier")
    ContainerDb(db, "PostgreSQL Database", "PostgreSQL 16", "18-Table 3NF Database")
    System_Ext(vietqr, "VietQR Gateway", "Napas 247 Switch", "Inter-bank payment provider")
    System_Ext(mail, "Messaging Gateway", "SMTP / ZNS", "Notification service")

    Rel(manager, spa, "1. Inputs utility meter readings for cutoff cycle (25th)")
    Rel(spa, bill, "2. Submits batch meter readings payload")
    Rel(bill, repo, "3. Persists new utility records")
    Rel(repo, db, "4. INSERT INTO meter_readings")

    Rel(manager, spa, "5. Triggers automated batch invoice generation")
    Rel(spa, bill, "6. Calls batchGenerateInvoices(billingMonth)")
    Rel(bill, repo, "7. Reads unit floor area, active vehicle quota, utility reads")
    Rel(repo, db, "8. SELECT properties, active vehicles, meter readings")
    Rel(bill, repo, "9. Creates master INVOICES (status=UNPAID) + itemized INVOICE_ITEMS")
    Rel(repo, db, "10. INSERT invoices, invoice_items (ACID Transaction)")
    Rel(bill, notif, "11. Triggers billing announcement dispatch")
    Rel(notif, mail, "12. Sends e-statements with invoice breakdown to residents")

    Rel(resident, spa, "13. Logs in to inspect invoice and clicks 'Pay via VietQR'")
    Rel(spa, bill, "14. Requests payment session creation (POST /api/invoices/{id}/pay)")
    Rel(bill, vietqr, "15. Cryptographically signs request & asks for dynamic Napas 247 QR with invoice_id")
    Rel(vietqr, bill, "16. Returns dynamic QR payload with verification checksum")
    Rel(bill, spa, "17. Returns signed QR payload securely to browser client")
    Rel(spa, resident, "18. Renders dynamic VietQR on screen for resident")

    Rel(resident, vietqr, "19. Scans QR and transfers funds via Mobile Banking App")
    Rel(vietqr, bill, "20. Webhook IPN delivers verified payment notification")
    Rel(bill, repo, "21. Updates paid_amount and transitions invoice status to PAID")
    Rel(repo, db, "22. UPDATE invoices, INSERT payment_transactions")
    Rel(bill, notif, "23. Triggers payment confirmation receipt")
    Rel(notif, mail, "24. Delivers electronic receipt acknowledging cleared balance")
```

---

## 6. C4 Deployment Diagram (`C4Deployment`) - Supplementary Infrastructure View

The Deployment diagram maps software containers onto physical hardware, network boundaries, and managed cloud infrastructure tiers.

```mermaid
C4Deployment
    title Deployment diagram for ResidentHub - Live Production Environment

    Deployment_Node(user_device, "Customer's Computer / Mobile Device", "Microsoft Windows, Apple macOS, iOS, Android") {
        Deployment_Node(browser, "Web Browser", "Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge") {
            Container(spa, "Single-Page Web Application", "React 19 Runtime", "Delivers administrative portal and resident self-service UI.")
        }
    }

    Deployment_Node(cloud, "Cloud Infrastructure", "AWS / Cloudflare / Vercel") {
        Deployment_Node(edge, "Edge Network & Security Tier", "Cloudflare") {
            Container(waf, "Cloudflare WAF & CDN", "Reverse Proxy", "DDoS mitigation, SSL/TLS 1.3 termination, load balancing, and edge asset caching.")
        }

        Deployment_Node(app_server_node, "Application Server Cluster", "Ubuntu 22.04 LTS / Docker") {
            Deployment_Node(node_runtime, "Node.js 20 LTS Runtime", "Server Runtime") {
                Container(api, "ResidentHub App Server", "Next.js 16 App Router", "Handles business transactions, Server Actions, and REST APIs.")
                Container(worker, "Cron Background Worker", "Node.js Worker Process", "Background daemon auditing overdue accounts and scheduling recurring notifications.")
            }
        }

        Deployment_Node(db_node, "Database Cluster", "Managed AWS RDS / Supabase") {
            Deployment_Node(pg_primary_node, "Primary Database Instance", "Ubuntu / PostgreSQL 16") {
                ContainerDb(db_primary, "PostgreSQL Database - Primary", "PostgreSQL 16 Engine", "Manages 18 normalized 3NF tables; handles ACID read and write operations.")
            }
            Deployment_Node(pg_standby_node, "Secondary Database Instance", "Ubuntu / PostgreSQL 16") {
                ContainerDb(db_standby, "PostgreSQL Database - Standby", "PostgreSQL 16 Engine", "High-availability standby replica for disaster recovery and automatic failover.")
            }
        }

        Deployment_Node(storage_node, "Object Storage Service", "Amazon S3 / Cloudflare R2") {
            ContainerDb(s3, "Encrypted S3 Bucket", "Object Storage", "Stores encrypted meter photos, maintenance attachments, and PDF receipts.")
        }
    }

    Rel(spa, waf, "Accesses application interface", "HTTPS / TLS 1.3")
    Rel(waf, api, "Proxies verified traffic", "HTTPS / Reverse Proxy")

    Rel(api, db_primary, "Executes queries and transactions", "TCP 5432 / Connection Pooling")
    Rel(worker, db_primary, "Audits billing ledgers periodically", "TCP 5432")
    Rel(db_primary, db_standby, "Streams database replication asynchronously", "Streaming Replication")

    Rel(api, s3, "Uploads incident proofs and invoices", "HTTPS / S3 API")
    Rel(spa, s3, "Streams public media assets directly", "HTTPS / CDN")
```

### Infrastructure Mapping Catalog
| Infrastructure Node | Hardware / Cloud Environment | Deployed Container | Role & Capacity |
| :--- | :--- | :--- | :--- |
| **`browser`** | End-User Client Device | `spa` | Client environment executing optimized React 19 JavaScript bundles. |
| **`edge`** | Cloudflare Global Anycast Network | `waf` | Perimeter defense, Web Application Firewall (WAF), edge SSL offloading, and static asset caching. |
| **`app_server_node`** | Docker on Ubuntu 22.04 LTS | `api`, `worker` | Compute cluster running Next.js 16 App Server and headless Node.js cron workers. |
| **`db_node`** | AWS RDS Multi-AZ / Supabase | `db_primary`, `db_standby` | Enterprise database cluster operating active-standby replication across 18 normalized tables with automated failover. |
| **`storage_node`** | Amazon S3 / Cloudflare R2 | `s3` | Scalable object storage preserving encrypted unstructured media with regional CDN distribution. |
