# ResidentHub - Technical Documentation Hub

Welcome to the **ResidentHub** architecture and technical specifications repository. This directory houses the comprehensive architectural designs, behavioral models, field-level traceability matrices, and visual artifacts governing the platform.

```mermaid
flowchart TD
    Hub["📚 docs/README.md<br/><b>Documentation Hub</b>"]
    
    Invest["📋 REQUIREMENTS_INVEST.md<br/><b>Agile Requirements (INVEST)</b><br/><i>6 Epics, 22 Stories & BDD Gherkin</i>"]
    UIUX["🖥️ UI_UX_SPECIFICATION.md<br/><b>UI/UX & IA Specifications</b><br/><i>IA Tree, Screens Hierarchy & Tokens</i>"]
    Folder["📂 FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md<br/><b>3-Tier Layering & Folders</b><br/><i>Clean Architecture, Boundaries & Boilerplate</i>"]
    UML["🧩 DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md<br/><b>Detailed Class & Sequences</b><br/><i>3-Tier UML Classes & Method Calls</i>"]
    Arc42["📘 ARCHITECTURE_ARC42.md<br/><b>arc42 Architecture Dossier</b><br/><i>12-Section IEEE Specification</i>"]
    C4["🏛️ ARCHITECTURE_C4.md<br/><b>C4 Visual Architecture</b><br/><i>Standard Mermaid L1-L3 & Quad-Trace</i>"]
    ADR["📑 adr/README.md<br/><b>Architecture Decision Records</b><br/><i>8 Formal ADRs (MADR 3.0)</i>"]
    UseCases["📋 USE_CASES.md<br/><b>Use Cases & E2E Journeys</b><br/><i>UML & Fully-Dressed Specs</i>"]
    Specs["⚙️ SYSTEM_WORKFLOWS_AND_SPECS.md<br/><b>State Machines & RBAC</b><br/><i>Lifecycles & Governance</i>"]
    Api["🔌 API_DOCUMENTATION.md<br/><b>API & Ingress Specs</b><br/><i>REST, Actions & Webhooks</i>"]
    Trace["🔗 UI_DATABASE_MAPPING.md<br/><b>UI-DB Traceability</b><br/><i>Field & Screen Mapping</i>"]
    Shots["🖼️ screenshots/<br/><b>UI Visual Catalog</b><br/><i>7 Production Screens</i>"]
    DB[("🗄️ database/schema.dbml & schema.sql<br/><b>18-Table 3NF Relational Model</b>")]

    Hub --> Invest
    Hub --> UIUX
    Hub --> Folder
    Hub --> UML
    Hub --> Arc42
    Hub --> C4
    Hub --> ADR
    Hub --> UseCases
    Hub --> Specs
    Hub --> Api
    Hub --> Trace
    Hub --> Shots

    Invest <--> UIUX
    Invest <--> C4
    Invest <--> UseCases
    Folder <--> UML
    Folder <--> C4
    UML <--> Api
    Arc42 <--> C4
    Arc42 <--> ADR
    ADR <--> C4
    UseCases <--> Specs
    Api <--> Specs
    Api -.-> DB
    C4 -.-> DB
    Trace -.-> DB
    UseCases -.-> Trace
    Shots -.-> Trace

    style Hub fill:#1e293b,stroke:#0f172a,color:#f8fafc
    style Invest fill:#059669,stroke:#047857,color:#ecfdf5
    style UIUX fill:#0284c7,stroke:#0369a1,color:#f0f9ff
    style Folder fill:#d97706,stroke:#b45309,color:#fffbeb
    style UML fill:#7c3aed,stroke:#6d28d9,color:#f5f3ff
    style Arc42 fill:#1e40af,stroke:#1d4ed8,color:#eff6ff
    style C4 fill:#1e40af,stroke:#1d4ed8,color:#eff6ff
    style ADR fill:#0284c7,stroke:#0369a1,color:#f0f9ff
    style UseCases fill:#0d9488,stroke:#0f766e,color:#f0fdfa
    style Specs fill:#b45309,stroke:#d97706,color:#fffbeb
    style Api fill:#7c3aed,stroke:#6d28d9,color:#f5f3ff
    style DB fill:#065f46,stroke:#059669,color:#ecfdf5
    style Trace fill:#065f46,stroke:#059669,color:#ecfdf5
    style Shots fill:#6b21a8,stroke:#7e22ce,color:#faf5ff
```

---

## 🗺️ Role-Based Reading Paths

Select the reading path tailored to your role, perspective, and available time:

### 1. "I want to grasp the system overview in 15–20 minutes" (Executive & Lead Review)
>
> **Goal:** Understand the big picture, business context, system boundaries, and primary stakeholders.

- ➡️ **[ARCHITECTURE_ARC42.md §1 & §4](ARCHITECTURE_ARC42.md#1-introduction-and-goals)**: Context, stakeholders, and measurable quality goals.
- ➡️ **[ARCHITECTURE_C4.md §1 & §2](ARCHITECTURE_C4.md#1-c4-system-context-diagram---level-1)**: C4 Level 1 (System Context) and Level 2 (Containers) diagrams.
- ➡️ **[screenshots/README.md](screenshots/README.md)**: Visual tour of the 7 production user interfaces.

### 2. "I am a newly onboarded developer" (First Day Setup & Code Structure)
>
> **Goal:** Master the codebase layout, folder organization, architectural layering, and engineering conventions.

- ➡️ **[../README.md](../README.md)**: Local development setup with Next.js and Docker.
- ➡️ **[FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md)**: 3-Tier Layering architecture, physical folder layout, strict boundary rules, and boilerplate code skeletons.
- ➡️ **[DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md](DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md)**: UML class diagrams and method-level sequence diagrams across the 3 tiers.
- ➡️ **[UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md)**: Information Architecture tree, screens hierarchy, and reusable component tokens.
- ➡️ **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**: Standard REST endpoints, Next.js Server Actions, RFC 7807 error catalog, and RBAC matrix.
- ➡️ **[UI_DATABASE_MAPPING.md](UI_DATABASE_MAPPING.md)**: Field-by-field UI-to-database mapping and query contracts.

### 3. "I want an in-depth architectural audit" (Architect & Senior Technical Review)
>
> **Goal:** Evaluate system reliability, financial integrity, failure recovery mechanisms, and Architecture Decision Records (ADRs).

- ➡️ **[ARCHITECTURE_ARC42.md](ARCHITECTURE_ARC42.md)**: Complete 12-section IEEE 42010 architectural dossier.
- ➡️ **[adr/README.md](adr/README.md)**: Master ADR Catalog capturing 8 formal architectural decision records (MADR 3.0).
- ➡️ **[ARCHITECTURE_C4.md §4 & §7](ARCHITECTURE_C4.md#4-c4-dynamic-diagrams---runtime-view--failure-twins)**: Real-time runtime sequences, Failure Twins, and Quad-Traceability Matrix.
- ➡️ **[DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md](DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md)**: In-depth UML class models, method signatures, and concurrency pessimistic locking sequences.
- ➡️ **[API_DOCUMENTATION.md §5 & §6](API_DOCUMENTATION.md#5-external-ingress--webhook-specifications)**: VietQR IPN Webhooks, idempotency checks, and API failure twins.
- ➡️ **[ARCHITECTURE_ARC42.md §9 & §12](ARCHITECTURE_ARC42.md#9-architecture-decisions-adr-index)**: Architectural Decision Records (ADR Index) and automated CI Fitness Functions.

### 4. "I work with the database & financial/operations domain" (Backend & Data Engineer)
>
> **Goal:** Master the 18-table 3NF relational schema, utility billing calculation strategies, and state machines.

- ➡️ **[../database/schema.sql](../database/schema.sql)** & **[../database/schema.dbml](../database/schema.dbml)**: 18 relational tables, foreign keys, constraints, and indexes.
- ➡️ **[SYSTEM_WORKFLOWS_AND_SPECS.md §1](SYSTEM_WORKFLOWS_AND_SPECS.md#1-core-lifecycles-state-machines--failure-twins)**: Residence lifecycles, billing debt transitions, and parking quota allocation.
- ➡️ **[UI_DATABASE_MAPPING.md](UI_DATABASE_MAPPING.md)**: Comprehensive mapping matrix from 18 SQL tables to UI screens.

### 5. "I am a Product Owner / BA / QA engineer seeking requirements & specs"
>
> **Goal:** Construct test suites covering Agile User Stories, BDD Given-When-Then criteria, E2E journeys, and edge cases.

- ➡️ **[REQUIREMENTS_INVEST.md](REQUIREMENTS_INVEST.md)**: **6 Epics, 22 User Stories** strictly adhering to INVEST criteria with BDD Gherkin test scenarios.
- ➡️ **[UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md)**: Screen hierarchy, 5 core UI states, and navigation transition matrix.
- ➡️ **[USE_CASES.md](USE_CASES.md)**: Complete UML use case catalogs, 4 End-to-End resident journeys, 6 fully-dressed specifications, and traceability matrix.
- ➡️ **[ARCHITECTURE_C4.md §4](ARCHITECTURE_C4.md#4-c4-dynamic-diagrams---runtime-view--failure-twins)**: Failure twins: VietQR expiration, duplicate webhook delivery, meter audit rollbacks.
- ➡️ **[SYSTEM_WORKFLOWS_AND_SPECS.md §2](SYSTEM_WORKFLOWS_AND_SPECS.md#2-role-based-access-control-rbac-matrix)**: 4-tier RBAC permission verification matrix across 7 system modules.

### 6. "I manage infrastructure, operations & reliability" (DevOps & SRE Engineer)
>
> **Goal:** Operate cloud infrastructure, WAF security, high-availability database replication, and autoscaling policies.

- ➡️ **[ARCHITECTURE_C4.md §5](ARCHITECTURE_C4.md#5-c4-deployment-diagram---infrastructure-view)**: Cloudflare Anycast + AWS RDS Multi-AZ + S3 deployment topology.
- ➡️ **[ARCHITECTURE_ARC42.md §2 & §11](ARCHITECTURE_ARC42.md#2-architecture-constraints)**: Operational constraints and system risk register.

---

## 📑 Documentation Index

| Document | Focus Area | Target Audience | Primary Contents |
| :--- | :--- | :--- | :--- |
| **[adr/README.md](adr/README.md)** | **Architecture Decision Records (MADR)** | Architects, Leads, Reviewers | • Master ADR catalog & lifecycle governance<br/>• 8 formal decisions (PostgreSQL 3NF, Lock, VietQR, Monorepo)<br/>• Rationale, considered alternatives & trade-offs |
| **[FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md)** | **3-Tier Layering & Folder Architecture** | Fullstack & Backend Devs | • Physical folder breakdown (Frontend & Backend)<br/>• 4 Strict Layer Boundary Rules<br/>• Pipeline data flow & RFC 7807 error mapper<br/>• Complete boilerplate code skeleton (VietQR flow) |
| **[DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md](DETAILED_CLASS_AND_SEQUENCE_DIAGRAMS.md)** | **Detailed UML Class & Sequence Models** | Backend Devs, Architects, QA | • 4 Subsystem UML Class Diagrams across 3 Tiers<br/>• Method signatures & parameter types<br/>• **4 Method-level Sequence Diagrams (VietQR, Lock, CCCD, Batch)**<br/>• Method Traceability Matrix |
| **[REQUIREMENTS_INVEST.md](REQUIREMENTS_INVEST.md)** | **Agile Requirements (INVEST & BDD)** | POs, BAs, QA, Developers | • 6 Epics covering 100% of business domains<br/>• 22 User Stories with INVEST scorecards<br/>• BDD Acceptance Criteria (*Given-When-Then*)<br/>• Requirements Traceability Matrix |
| **[UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md)** | **Information Architecture & UI/UX** | UI/UX Designers, Frontend Devs, POs | • 4 IA systems (Organization, Labeling, Nav, Search)<br/>• Comprehensive Mermaid IA Tree diagram<br/>• 4-level Screens Hierarchy & Transition Matrix<br/>• Design Tokens & 5 Core UI States |
| **[USE_CASES.md](USE_CASES.md)** | **Use Cases & E2E Journeys** | POs, BAs, QA, Fullstack | • Actor & Trigger taxonomy (HTTP, Cron, Webhook)<br/>• 4 UML Subsystem Use Case Diagrams<br/>• **4 End-to-End Journeys (Move-in, Billing, SLA, Move-out)**<br/>• 6 Fully-Dressed Use Case Specs with Failure Twins<br/>• Use Case $\leftrightarrow$ UI $\leftrightarrow$ Service $\leftrightarrow$ DB Traceability |
| **[ARCHITECTURE_ARC42.md](ARCHITECTURE_ARC42.md)** | **arc42 Complete Architecture Dossier** | Architects, Leads, Reviewers | • 12 standard IEEE sections<br/>• Measurable Quality Goals (Q1-Q7)<br/>• External Interfaces & Solution Strategy<br/>• ADR Index (ADR-0001 to ADR-0008)<br/>• Architecture Fitness Functions in CI |
| **[ARCHITECTURE_C4.md](ARCHITECTURE_C4.md)** | **C4 Visual Architecture (Standard Mermaid)** | Developers, Architects, DevOps | • Level 1 System Context (Black box)<br/>• Level 2 Containers (React 19, Next.js 16, PostgreSQL 16)<br/>• **Level 3 Components (Frontend SPA + Backend Services)**<br/>• **Dynamic Runtime View with Story IDs & Failure Twins**<br/>• Full Quad-Traceability Matrix |
| **[SYSTEM_WORKFLOWS_AND_SPECS.md](SYSTEM_WORKFLOWS_AND_SPECS.md)** | **Business Lifecycles & Governance** | Backend Developers, QA | • Residence State Machine (`PERMANENT` / `TEMPORARY` / `ABSENT` / `MOVED`)<br/>• Billing & VietQR Failure Twin State Machine<br/>• Incident SLA & Escalation State Machine<br/>• RBAC Matrix (4 Roles across 7 Modules)<br/>• Post-DBML 4-Phase Implementation Roadmap |
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | **API & External Ingress Specs** | Backend, Frontend, QA, Integrators | • Ground Truth status matrix (Mocked vs Real)<br/>• Standard Ingress & RFC 7807 Error Catalog<br/>• 7 Core modules REST & Action endpoints with DTOs<br/>• **VietQR Webhook IPN & S3 Storage Specs**<br/>• **API Runtime Views & Failure Twins** |
| **[UI_DATABASE_MAPPING.md](UI_DATABASE_MAPPING.md)** | **Data Traceability Matrix** | Fullstack Engineers, QA, DBAs | • Granular field-by-field mapping between UI controls and 18 SQL tables<br/>• Data flow validation (Read vs. Write vs. Computed)<br/>• Missing column and schema alignment rules |
| **[screenshots/README.md](screenshots/README.md)** | **Visual Interface Gallery** | UI/UX Designers, Stakeholders, Developers | • Visual inventory of 7 primary application views<br/>• Route mappings and primary user role permissions<br/>• Feature walkthroughs for all core pages |

---

## 🏛️ Related Root Resources

- **[Project Root README](../README.md)**: Main developer portal with installation instructions, scripts, and feature highlights.
- **[Database SQL Schema](../database/schema.sql)**: Official PostgreSQL (v13+) DDL definition file with ENUMs, triggers, and indices.
- **[Database DBML Definition](../database/schema.dbml)**: Visual schema script for [dbdiagram.io](https://dbdiagram.io) and [dbdocs.io](https://dbdocs.io).
- **[Interactive Stitch Prototype](https://stitch.withgoogle.com/projects/16326783556633031011?pli=1)**: High-fidelity interactive UI prototype.
