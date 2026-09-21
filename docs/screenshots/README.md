# ResidentHub - User Interface Gallery & Visual Catalog

This directory catalogs the high-fidelity user interface captures for **ResidentHub**, demonstrating the production UI implemented with **Next.js 16 App Router**, **React 19**, and **Tailwind CSS v4**.

For the underlying database field connections, see [UI Database Traceability Matrix](../10-UI_DATABASE_MAPPING.md).

---

## 📸 Screen Catalog Summary

| Preview | Screen Name | Route Path | Target Roles | Primary Features |
| :--- | :--- | :--- | :--- | :--- |
| [Preview](#1-analytics--operations-dashboard) | **Operations Dashboard** | `/` | `ADMIN`, `MANAGER` | High-level KPI metrics, real-time collection rates, occupancy doughnut chart, recent ticket activity. |
| [Preview](#2-apartment-directory) | **Apartment Directory** | `/can-ho` | `ADMIN`, `MANAGER`, `TECHNICIAN` | Building & floor filters, room status badges, area m², owner contact info, quick search. |
| [Preview](#3-apartment-unit-detail) | **Apartment Unit Detail** | `/can-ho/[id]` | `ADMIN`, `MANAGER`, `RESIDENT` | Deep dive into a single unit: ownership history, current resident roster, registered vehicles, and billing history. |
| [Preview](#4-resident--household-registry) | **Resident & Household Registry** | `/cu-dan` | `ADMIN`, `MANAGER` | 12-digit Citizen ID lookup, stay status tags (Permanent, Temporary, Absent), household head indicator. |
| [Preview](#5-vehicles--parking-management) | **Vehicles & Parking Management** | `/phuong-tien-va-bai-do` | `ADMIN`, `MANAGER`, `TECHNICIAN` | License plate registry, vehicle type quotas (1 car, 2 bikes), RFID badge assignments, B1/B2 slot status. |
| [Preview](#6-utility-metering--billing-engine) | **Utility Metering & Billing Engine** | `/phi-chung-cu` | `ADMIN`, `MANAGER`, `RESIDENT` | Monthly meter read logging, tiered tariff calculations, batch invoice generation, VietQR modal. |
| [Preview](#7-maintenance-tickets--sla-tracking) | **Maintenance Tickets & SLA Tracking** | `/phan-anh-va-yeu-cau` | `ALL ROLES` | Incident reporting, photo evidence attachments, technician assignment, priority SLA deadline tracking. |

---

## 🖼️ Detailed Screen Previews

### 1. Analytics & Operations Dashboard
- **Route**: `/`
- **Primary Roles**: `ADMIN`, `MANAGER`
- **Associated Database Tables**: `apartments`, `invoices`, `feedbacks`, `residents`
- **Key Capabilities**: 
  - Real-time aggregate indicators (Total Apartments, Occupancy Rate, Total Revenue, Open Tickets).
  - Quick action shortcuts (Add Resident, Record Meters, Issue Monthly Invoices).
  - Urgent alerts panel for overdue accounts and pending SLA tickets.

![Analytics & Operations Dashboard](dashboard.png)

---

### 2. Apartment Directory
- **Route**: `/can-ho`
- **Primary Roles**: `ADMIN`, `MANAGER`, `TECHNICIAN`
- **Associated Database Tables**: `buildings`, `apartments`, `owners`, `apartment_owners`
- **Key Capabilities**:
  - Filterable directory by Building block, Floor, and Occupancy Status (`EMPTY`, `RENTED`, `OWNER_OCCUPIED`).
  - Floor plan area ($m^2$) display linked directly to utility area fee calculation formulas.
  - Direct navigation to individual unit dossiers.

![Apartment Directory](apartments.png)

---

### 3. Apartment Unit Detail
- **Route**: `/can-ho/[id]`
- **Primary Roles**: `ADMIN`, `MANAGER`, `RESIDENT` (Unit scoped)
- **Associated Database Tables**: `apartments`, `owners`, `households`, `residents`, `vehicles`, `invoices`
- **Key Capabilities**:
  - Comprehensive unit dossier consolidating physical specs, legal owner details, and active lease contracts.
  - Tabbed sub-views: Inhabitant Roster, Registered Vehicles & Parking Slots, Utility Billing Ledger.
  - Action buttons to add co-inhabitants or register a new vehicle against unit quotas.

![Apartment Unit Detail](apartment_detail.png)

---

### 4. Resident & Household Registry
- **Route**: `/cu-dan`
- **Primary Roles**: `ADMIN`, `MANAGER`
- **Associated Database Tables**: `residents`, `households`, `household_members`, `residence_records`
- **Key Capabilities**:
  - National Citizen ID (CCCD 12 digits) validation and search.
  - Residency status tagging (`PERMANENT`, `TEMPORARY`, `ABSENT`, `MOVED`).
  - Visual Household Head badge (`is_head = true`) and relationship designations.
  - Declarations for temporary absence and move-out workflows.

![Resident & Household Registry](residents.png)

---

### 5. Vehicles & Parking Management
- **Route**: `/phuong-tien-va-bai-do`
- **Primary Roles**: `ADMIN`, `MANAGER`, `TECHNICIAN`
- **Associated Database Tables**: `parking_slots`, `vehicles`, `apartments`
- **Key Capabilities**:
  - Vehicle classification (Car, Motorbike, Electric Bike, Bicycle).
  - Unit quota validation enforcement (Maximum 1 Car, 2 Motorbikes per apartment unit).
  - B1 and B2 basement parking slot visualization with occupancy badges.
  - RFID access card linking and registration validity dates.

![Vehicles & Parking Management](vehicles.png)

---

### 6. Utility Metering & Billing Engine
- **Route**: `/phi-chung-cu`
- **Primary Roles**: `ADMIN`, `MANAGER`, `RESIDENT` (Self-service billing view)
- **Associated Database Tables**: `meter_readings`, `fee_types`, `invoices`, `invoice_items`, `payment_transactions`
- **Key Capabilities**:
  - Utility meter read entry interface for electricity and water (cutoff cycle on the 25th).
  - Automated 1-click batch invoice generation triggering tiered price calculations.
  - Invoice status tracking (`UNPAID`, `PARTIAL`, `PAID`, `OVERDUE`).
  - Dynamic **VietQR (Napas 247)** payment dialog generation with embedded transaction checksums.

![Utility Metering & Billing Engine](billing.png)

---

### 7. Maintenance Tickets & SLA Tracking
- **Route**: `/phan-anh-va-yeu-cau`
- **Primary Roles**: `RESIDENT` (Submit/Inspect), `MANAGER` (Dispatch), `TECHNICIAN` (Resolve)
- **Associated Database Tables**: `feedbacks`, `feedback_updates`, `users`
- **Key Capabilities**:
  - Multi-category ticket submission (Repairs, Noise, Cleaning, Security).
  - Priority-based SLA resolution time tracking (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
  - Technician work order assignment and resolution progress timeline.
  - On-site photo verification upload for before/after maintenance audits.

![Maintenance Tickets & SLA Tracking](tickets.png)

---

## 🔗 Related Documentation
- [Master Technical Documentation Hub](../README.md)
- [C4 Architectural Specifications](../03-ARCHITECTURE_C4.md)
- [UI to Database Traceability Matrix](../10-UI_DATABASE_MAPPING.md)
- [System Workflows & RBAC Matrix](../09-SYSTEM_WORKFLOWS_AND_SPECS.md)
