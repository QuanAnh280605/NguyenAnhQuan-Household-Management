# ResidentHub — Agile Requirements Dossier (INVEST Framework)
## Comprehensive User Stories, Acceptance Criteria (Gherkin) & INVEST Verification Matrix

> **Status:** Approved Architectural Baseline  
> **Audience:** Product Owners, Agile Development Teams, QA/SDET, Solution Architects, System Auditors  
> **Methodology:** Agile User Stories, INVEST Best Practices, BDD Gherkin (*Given - When - Then*)  
> **Traceability Links:**  
> - 📋 [USE_CASES.md](USE_CASES.md) (UML Functional Catalog & Fully-Dressed Use Cases)  
> - 🏛️ [ARCHITECTURE_C4.md](ARCHITECTURE_C4.md) (Context, Container, Components & Runtime View)  
> - 🖥️ [UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md) (Information Architecture & Screens Hierarchy)  
> - 📂 [FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md) (3-Tier Layering Specifications)  
> - 🗄️ [schema.sql](../schema.sql) (18-Table 3NF Normalized Relational Database Schema)

---

## 📑 Table of Contents

1. [INVEST Methodology & BDD Gherkin Standards](#1-invest-methodology--bdd-gherkin-standards)
2. [User Personas & Actor Taxonomy](#2-user-personas--actor-taxonomy)
3. [EPIC-01: Apartments & Ownership Lifecycle (Apartments & Ownership)](#3-epic-01-apartments--ownership-lifecycle)
4. [EPIC-02: Residents, Census & Civil Movement (Residents & Civil Registry)](#4-epic-02-residents-census--civil-movement)
5. [EPIC-03: Vehicles & Underground Parking Quota (Vehicles & Parking)](#5-epic-03-vehicles--underground-parking-quota)
6. [EPIC-04: Utilities, Automated Billing Engine & Digital Payment (Billing & VietQR)](#6-epic-04-utilities-automated-billing-engine--digital-payment)
7. [EPIC-05: Incident Maintenance & SLA Defect Tracking (Tickets & Maintenance)](#7-epic-05-incident-maintenance--sla-defect-tracking)
8. [EPIC-06: Administration, 4-Tier RBAC & Tariffs (Admin & Security)](#8-epic-06-administration-4-tier-rbac--tariffs)
9. [Comprehensive INVEST Compliance Scorecard](#9-comprehensive-invest-compliance-scorecard)
10. [Bidirectional Requirements Traceability Matrix](#10-bidirectional-requirements-traceability-matrix)

---

## 1. INVEST Methodology & BDD Gherkin Standards

All functional requirements for the **ResidentHub** platform are standardized according to the **INVEST** guidelines (Bill Wake):

| INVEST Criteria | Engineering Standard in ResidentHub |
| :--- | :--- |
| **I — Independent** | Each User Story is decoupled from other stories, allowing agile teams to prioritize, implement, and ship features without blocking dependencies. |
| **N — Negotiable** | Stories are treated as an invitation to conversation between Product Owners and Engineers to continuously optimize technical implementations during sprint planning. |
| **V — Valuable** | Every story delivers measurable operational value to end-users (Residents, Facility Managers, Technicians) or optimizes building operations. |
| **E — Estimable** | Acceptance criteria are explicit and technically bounded, allowing engineering teams to estimate complexity using Fibonacci Story Points (1, 2, 3, 5, 8). |
| **S — Small** | Stories are scoped to be fully developed and tested within 1 to 3 business days (never exceeding a single 2-week sprint). |
| **T — Testable** | Every story includes verifiable **Acceptance Criteria (AC)** written in standard **Given - When - Then** (Gherkin syntax), covering Happy Paths, Edge Cases, Concurrency Twins, and Failure Paths. |

---

## 2. User Personas & Actor Taxonomy

| Actor Code | Role Display Name | Primary Responsibilities & Operational Goals |
| :--- | :--- | :--- |
| **`ACT-RES`** | **Resident / Household Head** | Apartment occupant: Reviews itemized monthly statements, pays fees via VietQR, declares civil residency shifts online, and submits maintenance reports. |
| **`ACT-MGR`** | **Building Manager / Accountant** | Operations staff: Audits unit directories, verifies residency dossiers, manages parking slots, logs utility meters, and runs automated batch billing. |
| **`ACT-TECH`**| **Building Technician** | Field engineer: Receives assigned repair tickets, performs physical inspections, logs photographic completion proofs, and observes strict SLA targets. |
| **`ACT-ADM`** | **System Administrator** | IT Security officer: Enforces 4-tier Role-Based Access Control (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`), configures utility tariffs, and monitors audit logs. |

---

## 3. EPIC-01: Apartments & Ownership Lifecycle

Governs building physical zoning, apartment unit directories, usable living areas (m²), legal title ownership, and occupancy transitions.

### US-APT-01: Apartment Unit Directory Search & Multi-Faceted Filtering
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* search and filter apartment units by tower, floor, usable area, and occupancy status (*Empty, Rented, Owner-Occupied*),  
  *So that* I can quickly assess occupancy rates and provide accurate information for administrative inquiries.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: High | `E`: Clear (Indexed SQL) | `S`: 1-2 days | `T`: High
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Successfully filter apartments by occupancy status (Happy Path)
    Given The manager is authenticated at "/can-ho"
    When The manager selects Tower "Tower A" and Status "EMPTY"
    Then The system displays all apartment units in Tower A with status "EMPTY"
    And The record count matches the database count exactly
    And Each row displays Room Number, Floor, Net Living Area (m²), and Bedroom Count

  Scenario: Quick search by room number keyword
    Given The manager is on the apartment directory page
    When The manager types "1205" into the search bar
    Then The system displays room "1205" for the corresponding building
    And If no matching record exists, an Empty State "No apartments found" is rendered
  ```
- **Traceability:** `UC-RES-04` | `apartments`, `buildings` | `/can-ho`

---

### US-APT-02: New Apartment Onboarding & Initial Legal Owner Provisioning
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* create a new apartment record and assign legal ownership details (*Full Name, Citizen ID, Phone, Handover Date*),  
  *So that* property rights are established and management fees can be assessed.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: High | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Successfully onboard apartment with valid owner data (Happy Path)
    Given The manager opens the "Add New Apartment" modal
    When The manager inputs Room "1508", Tower "A", Floor 15, Area 85.5 m²
    And Inputs owner details: Name "Nguyen Van An", Citizen ID "001099012345", Phone "0987654321"
    And Clicks "Save Record"
    Then A record is created in "apartments" with status "OWNER_OCCUPIED"
    And A link is created in "apartment_owners" with is_current = TRUE
    And A success toast notification "Apartment 1508 registered successfully" is rendered

  Scenario: Prevent duplicate apartment numbers within the same tower (Negative Path)
    Given Apartment "1508" already exists in Tower "A"
    When The manager attempts to create another apartment "1508" in Tower "A"
    Then The system rejects the submission with HTTP 422 / RFC 7807
    And An error message "Apartment 1508 already exists in Tower A" is displayed
  ```
- **Traceability:** `UC-RES-04` | `apartments`, `owners`, `apartment_owners` | `/can-ho`

---

### US-APT-03: Apartment Handover & Legal Ownership Title Transfer
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* register the transfer of an apartment to a new owner while archiving previous ownership tenure,  
  *So that* legal financial accountability is maintained without losing audit history.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: High | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Successfully transfer apartment ownership (Happy Path)
    Given Apartment "1002" has current active owner "Tran Dinh C"
    When The manager transfers ownership to "Le Thi D", Citizen ID "034199008877"
    And Sets transfer effective date to today's date
    Then The previous ownership record is updated with is_current = FALSE and end_date = CURRENT_DATE
    And A new ownership record is inserted for "Le Thi D" with is_current = TRUE
    And The complete historical ownership chain for apartment 1002 is preserved
  ```
- **Traceability:** `UC-RES-05` | `apartment_owners`, `apartments` | `/can-ho/[roomNumber]`

---

## 4. EPIC-02: Residents, Census & Civil Movement

Manages household registries (*Sổ hộ khẩu*), occupant demographic rosters, 12-digit Citizen Identity verification, and statutory civil movement declarations (Temporary Stay / Absence).

### US-RES-01: Household Member Registration & 12-Digit Citizen ID Verification
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* register a new occupant into an apartment household with validated 12-digit Citizen ID (CCCD) and kinship relation,  
  *So that* demographic census data is kept accurate for security and per-capita utility levies.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Independent | `N`: Yes | `V`: High | `E`: Clear | `S`: 2 days | `T`: High
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Register new household occupant with valid 12-digit Citizen ID (Happy Path)
    Given Household "HK-1205" exists with status "ACTIVE"
    When The manager adds member: Name "Nguyen Van Binh", CCCD "001202005678", DOB "15/08/2002", Kinship "Child"
    Then The occupant record is saved to "residents"
    And A link is created in "household_members" with is_head = FALSE
    And The displayed occupant count for HK-1205 increases by 1

  Scenario: Reject invalid format or duplicate Citizen ID (Edge Case)
    Given An existing active resident possesses Citizen ID "001202005678"
    When The manager attempts to register another resident with Citizen ID "001202005678"
    Then The form displays a validation error: "Citizen ID must be 12 digits and uniquely registered"
    And The submit button remains disabled
  ```
- **Traceability:** `UC-RES-03`, `UC-RES-01` | `residents`, `household_members` | `/cu-dan`

---

### US-RES-02: Household Head Succession Handover
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* reassign the Head of Household role from the current head to an eligible adult member,  
  *So that* exactly one primary legal representative exists per unit at all times.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Invariant integrity | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Reassign household head within the same family (Happy Path)
    Given Household "HK-0803" currently has "Pham Van E" as head
    When The manager designates member "Pham Thi F" (Spouse) as the new head
    Then Within a single atomic database transaction, `is_head = FALSE` is set for "Pham Van E"
    And `is_head = TRUE` is set for "Pham Thi F"
    And The `head_resident_id` in "households" is updated to "Pham Thi F"
    And The system guarantees that exactly 1 head exists for HK-0803
  ```
- **Traceability:** `UC-RES-02` | `households`, `household_members` | `/cu-dan`

---

### US-RES-03: Online Civil Stay Declaration (Temporary Stay / Absence)
- **User Story:**  
  *As a* **Resident (`ACT-RES`)**,  
  *I want to* submit a temporary stay or temporary absence declaration online,  
  *So that* I can fulfill civil regulatory requirements without visiting the management office in person.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Self-service convenience | `E`: Yes | `S`: 1.5 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Resident submits temporary stay declaration (Happy Path)
    Given The resident is authenticated and belongs to unit "0901"
    When The resident accesses "/cu-tru" and chooses "Temporary Stay (TAM_TRU)"
    And Selects date range from "01/10/2026" to "31/12/2026" with reason "Project assignment"
    And Clicks "Submit Declaration"
    Then A record is created in "residence_records" with status "PENDING"
    And A receipt dossier code formatted as "REC-202610-XXXX" is generated
    And Status displays as "Pending Management Review"

  Scenario: Prevent end date occurring before start date (Negative Path)
    Given The resident selects start date "10/10/2026"
    When The resident selects end date "05/10/2026"
    Then The form displays validation error "End date cannot precede start date"
    And Inbound submission is prevented
  ```
- **Traceability:** `UC-RES-01` | `residence_records` | `/cu-tru`

---

### US-RES-04: Digital Dossier Verification & Local Police Endorsement
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* audit civil stay declaration submissions, cross-check citizen credentials, and record police registration codes,  
  *So that* digital compliance records can be filed with local administrative authorities.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Statutory compliance | `E`: Yes | `S`: 1 day | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Manager approves valid residency declaration (Happy Path)
    Given A residency declaration "REC-202610-0012" has status "PENDING"
    When The manager enters police filing code "CA-P05-9981" and clicks "Approve"
    Then The record status in "residence_records" updates to "APPROVED"
    And The system records `approved_by` and `approved_at = NOW()`
    And An approval notification is dispatched to the resident's portal
  ```
- **Traceability:** `UC-RES-06`, `UC-RES-07` | `residence_records` | `/lich-su-cu-tru`

---

## 5. EPIC-03: Vehicles & Underground Parking Quota

Enforces apartment vehicle quotas, manages pessimistic-lock underground slot reservations (B1/B2), provisions RFID cards, and releases slots upon vehicle revocation.

### US-VEH-01: Vehicle Registration & Quota Compliance Enforcement
- **User Story:**  
  *As a* **Resident / Manager (`ACT-RES`, `ACT-MGR`)**,  
  *I want to* register a new vehicle for an apartment unit with license plate and registration photo,  
  *So that* the system automatically validates apartment quota limits (*Max 1 Car, 2 Motorbikes per unit*).
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Fair resource allocation | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Register motorbike within quota limits (Happy Path)
    Given Apartment "1104" has 1 active motorbike and 0 active cars
    When Resident registers a 2nd motorbike: Plate "29A1-999.88", Model "Honda SH"
    Then System verifies quota capacity is available (1/2 motorbikes)
    And Saves vehicle to "vehicles" with status "ACTIVE"
    And Shows estimated monthly parking tariff (100,000 VND/month)

  Scenario: Reject registration when car quota is exhausted (Quota Limit Reached)
    Given Apartment "1104" already has 1 registered car (1/1)
    When Resident attempts to register a 2nd car for apartment 1104
    Then The system blocks registration with HTTP 422
    And Displays error: "Apartment 1104 has reached the maximum quota of 1 automobile"
  ```
- **Traceability:** `UC-VEH-01` | `vehicles`, `apartments` | `/phuong-tien-va-bai-do`

---

### US-VEH-02: Underground Slot Reservation via Pessimistic Locking
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* allocate an available basement parking slot (B1/B2) to an approved automobile using pessimistic row locks,  
  *So that* concurrent managers cannot double-book the same parking slot.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Prevents physical conflicts | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Allocate available slot successfully (Happy Path)
    Given Slot "B1-C12" has status "AVAILABLE"
    When The manager assigns slot "B1-C12" to car "30E-123.45"
    Then System executes `SELECT ... FOR UPDATE` to lock the slot row
    And Updates slot status to "OCCUPIED" with `vehicle_id`
    And Updates vehicle with `parking_slot_id`
    And Slot color on the floorplan transitions from Green to Red

  Scenario: Prevent double-booking under concurrent assignment (Concurrency Twin)
    Given Two managers A and B attempt to allocate "B1-C12" simultaneously
    When Manager A's transaction commits first
    And Manager B's transaction attempts to commit 200ms later
    Then Manager B's transaction detects slot is no longer "AVAILABLE"
    And System rolls back Manager B's transaction with HTTP 409 Conflict
    And Displays: "Slot B1-C12 was just reserved by another user. Please choose another slot"
  ```
- **Traceability:** `UC-VEH-02`, `UC-VEH-05` | `parking_slots`, `vehicles` | `/phuong-tien-va-bai-do`

---

### US-VEH-03: RFID Access Card Provisioning & Activation
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* link an RFID card code to a registered vehicle and activate it,  
  *So that* the resident can access the underground parking barrier.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Physical access sync | `E`: Yes | `S`: 1 day | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Activate unique RFID card successfully (Happy Path)
    Given Vehicle "30E-123.45" is allocated a slot without an assigned RFID card
    When Manager enters RFID code "RFID-99882211" and clicks "Activate Card"
    Then System verifies "RFID-99882211" is not assigned to any other vehicle
    And Updates `rfid_card_code` on the vehicle record and sets card status to "ACTIVE"
  ```
- **Traceability:** `UC-VEH-03` | `vehicles` | `/phuong-tien-va-bai-do`

---

### US-VEH-04: Vehicle De-registration & Automatic Slot Release
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* de-register a vehicle when a tenant moves out,  
  *So that* its parking slot is immediately released and parking charges cease in the subsequent billing cycle.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Optimizes capacity | `E`: Yes | `S`: 1.5 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: De-register vehicle and release slot (Happy Path)
    Given Car "30E-123.45" occupies parking slot "B1-C12"
    When The manager revokes the vehicle registration
    Then Vehicle status updates to "REVOKED" and RFID card is deactivated
    And Within the same transaction, slot "B1-C12" is set to `status = 'AVAILABLE'` and `vehicle_id = NULL`
    And Slot B1-C12 immediately displays as Green (Available) on the floorplan
  ```
- **Traceability:** `UC-VEH-04` | `vehicles`, `parking_slots` | `/phuong-tien-va-bai-do`

---

## 6. EPIC-04: Utilities, Automated Billing Engine & Digital Payment

Measures monthly utility consumption, computes progressive tiered tariffs, executes month-end automated batch billing, generates dynamic Napas VietQRs, and processes webhook IPNs.

### US-BIL-01: Utility Meter Capture & Automated Anomaly Detection
- **User Story:**  
  *As a* **Technician / Accountant (`ACT-TECH`, `ACT-MGR`)**,  
  *I want to* record monthly electric/water meter indices with photographic evidence,  
  *So that* the system flags abnormal consumption shifts (> 300% surge compared to 3-month average) before billing.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Error prevention | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Record normal utility meter reading (Happy Path)
    Given Apartment "1205" had previous electric index of 1,250 kWh
    When Technician inputs current index 1,450 kWh with meter photo
    Then System calculates consumption of 200 kWh (within normal range)
    And Saves record in "meter_readings" with status "AUDITED"

  Scenario: Prevent current index lower than previous reading (Negative Path)
    Given Previous electric index was 1,250 kWh
    When Technician inputs current index 1,100 kWh
    Then System blocks save and displays error: "Current index cannot be lower than previous index (1,250 kWh)"

  Scenario: Flag consumption surge anomaly (Anomaly Twin)
    Given 3-month average water consumption for unit 1205 is 15 m³
    When Technician inputs reading resulting in 75 m³ consumption (+400%)
    Then System displays yellow warning alert: "Abnormal surge detected (> 300%)"
    And Sets record status to "ANOMALY_PENDING_REVIEW" for supervisor confirmation
  ```
- **Traceability:** `UC-FIN-01` | `meter_readings`, `apartments` | `/phi-chung-cu`

---

### US-BIL-02: Month-End Batch Invoice Generation Engine
- **User Story:**  
  *As a* **Building Accountant (`ACT-MGR`)**,  
  *I want to* trigger automated batch invoicing on the 25th of each month for all occupied apartments,  
  *So that* itemized bills (Management fee, Parking fee, Progressive power/water) are generated consistently.
- **Estimate:** 8 Story Points (Large - Core Calculation Engine)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Financial core | `E`: Clear math | `S`: Chunked | `T`: High
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Run month-end batch billing successfully (Happy Path)
    Given All meter readings for cycle "2026-09" have been audited
    When Accountant triggers "Run Batch Invoicing for 2026-09"
    Then System processes all occupied units:
      | Fee Type | Calculation Formula |
      | Management Fee | Net Floor Area (m²) x 12,000 VND/m² |
      | Parking Fee | Sum of active registered motorbikes and cars |
      | Utility Fees | Progressive 6-tier electricity & 3-tier water tariffs |
    And Creates master invoice records in "invoices" with status "UNPAID"
    And Sets payment due date to the 10th of the following month (10/10/2026)
    And Enforces idempotency: subsequent triggers for cycle 2026-09 will not create duplicate invoices
  ```
- **Traceability:** `UC-FIN-02` | `invoices`, `invoice_items`, `fee_types` | `/phi-chung-cu`

---

### US-BIL-03: Dynamic VietQR Napas 247 Session Generation
- **User Story:**  
  *As a* **Resident (`ACT-RES`)**,  
  *I want to* open an unpaid invoice and view a dynamic Napas 247 VietQR code with pre-filled amount and reference code,  
  *So that* I can pay instantly using mobile banking without typing account numbers manually.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Excellent UX | `E`: Standard VietQR | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Generate dynamic VietQR session successfully (Happy Path)
    Given Invoice "INV-202609-1205" has outstanding balance 2,350,000 VND
    When Resident clicks "Pay via VietQR"
    Then System renders a modal containing a dynamic Napas 247 QR code:
      | Field | Encoded Value |
      | Beneficiary Bank | MB Bank |
      | Account Number | 098765432199 |
      | Exact Amount | 2,350,000 VND |
      | Transfer Content | INV-202609-1205 CANHO 1205 |
    And A 15-minute expiration countdown timer is displayed
    And Client polling starts checking for payment settlement signals
  ```
- **Traceability:** `UC-FIN-03`, `UC-FIN-04` | `invoices`, `payment_transactions` | `/phi-chung-cu`

---

### US-BIL-04: Asynchronous IPN Webhook & Idempotent Balance Settlement
- **User Story:**  
  *As a* **Backend System (`SYS-CRON` / Gateway)**,  
  *I want to* receive Napas 247 IPN webhooks, verify HMAC-SHA256 signatures, and settle invoice balances within 500ms,  
  *So that* resident invoices are marked paid instantly while eliminating duplicate settlement risks.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Automated ledger | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Receive valid IPN and settle invoice balance (Happy Path)
    Given Invoice "INV-202609-1205" has status "UNPAID"
    When Gateway posts to "/api/v1/webhooks/vietqr" with valid HMAC signature
    And Payload references "INV-202609-1205" with amount 2,350,000 VND
    Then System verifies transaction code is unique (Idempotency check)
    And Updates invoice status to "PAID" with `paid_at = NOW()`
    And Inserts record into "payment_transactions" with method "VIETQR"
    And Resident's open modal updates to "Payment Successful"
    And HTTP 200 OK is returned to Gateway within 500ms

  Scenario: Duplicate IPN delivery defense (Idempotency Twin)
    Given Transaction "TXN-998811" has already been committed
    When Gateway redelivers duplicate webhook packet for "TXN-998811"
    Then System detects transaction already exists in database
    And Bypasses duplicate balance updates
    And Returns HTTP 200 OK so Gateway halts retry attempts
  ```
- **Traceability:** `UC-FIN-04` | `payment_transactions`, `invoices` | Webhook API

---

### US-BIL-05: Automated Overdue Debt Audit & Penalty Trigger
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want* the system to automatically audit unpaid invoices after the 10th of each month,  
  *So that* delinquent accounts are flagged as "OVERDUE" and automated reminders are dispatched.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Debt recovery | `E`: Cron worker | `S`: 1 day | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Automatically flag overdue balances after payment cutoff (Happy Path)
    Given Invoice "INV-202609-0504" has due date "10/10/2026" and status "UNPAID"
    When Clock strikes 00:01 on 11/10/2026 and Cron Worker executes
    Then System updates invoice status to "OVERDUE"
    And Dispatches an overdue notification to the resident account
  ```
- **Traceability:** `UC-FIN-06` | `invoices` | Worker Daemon

---

## 7. EPIC-05: Incident Maintenance & SLA Defect Tracking

Complete lifecycle for reporting resident maintenance issues, assigning field technicians, verifying photo proofs, and escalating SLA breaches.

### US-TKT-01: Resident Defect Reporting with Photographic Evidence
- **User Story:**  
  *As a* **Resident (`ACT-RES`)**,  
  *I want to* submit a repair request (electrical, plumbing, carpentry) with description and up to 3 defect photos,  
  *So that* management can evaluate urgency and assign the proper technician.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Direct service | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Resident submits defect report with photos (Happy Path)
    Given The resident is authenticated at "/phan-anh-va-yeu-cau"
    When Resident selects Category "Electrical", Title "Circuit breaker tripping"
    And Uploads 2 photos of the electrical panel
    And Clicks "Submit Request"
    Then A record is inserted into "feedbacks" with status "PENDING"
    And Sets SLA target resolution deadline (Target SLA = Submission time + 4 hours for URGENT)
    And Displays confirmation "Ticket #TKT-1082 submitted successfully"
  ```
- **Traceability:** `UC-SRV-01` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau`

---

### US-TKT-02: Technician Dispatch & Task Intake
- **User Story:**  
  *As a* **Building Manager (`ACT-MGR`)**,  
  *I want to* assign a pending ticket to a qualified technician based on specialty,  
  *So that* the technician receives a push alert and proceeds to the site.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Optimized dispatch | `E`: Yes | `S`: 1 day | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Dispatch technician to service ticket (Happy Path)
    Given Ticket "#TKT-1082" has status "PENDING"
    When Manager assigns technician "Tran Van Tho" (Electrician)
    Then Ticket status transitions to "PROCESSING"
    And `assigned_to` is updated to the technician's user ID
    And An audit entry is appended to "feedback_updates"
    And Technician receives a notification on their mobile interface
  ```
- **Traceability:** `UC-SRV-02` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau`

---

### US-TKT-03: Work Completion Inspection & Photographic Proof Upload
- **User Story:**  
  *As a* **Technician (`ACT-TECH`)**,  
  *I want to* record notes on parts replaced, upload completion photos, and mark the ticket resolved,  
  *So that* the repair is documented and resident satisfaction can be evaluated.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Transparency | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Technician marks ticket resolved with photo proof (Happy Path)
    Given Technician is working on ticket "#TKT-1082"
    When Technician enters resolution notes: "Replaced 32A breaker with Panasonic unit"
    And Uploads 1 photo of the functional breaker
    And Clicks "Complete Repair"
    Then Ticket status in "feedbacks" transitions to "RESOLVED" with `resolved_at = NOW()`
    And Resident receives a notification requesting a 1-to-5 star rating
  ```
- **Traceability:** `UC-SRV-03`, `UC-SRV-05` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau`

---

### US-TKT-04: Automated SLA Breach Monitoring & Emergency Escalation
- **User Story:**  
  *As a* **Facility Operations Head (`ACT-MGR`)**,  
  *I want* the system to detect unassigned tickets exceeding 60 minutes or unresolved tickets violating SLA limits,  
  *So that* emergency escalation alerts are routed to management for intervention.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Preserves SLA quality | `E`: Yes | `S`: 1 day | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Auto-escalate urgent ticket violating SLA target (SLA Escalation Twin)
    Given An URGENT ticket was submitted at 08:00 with a 60-minute assignment SLA
    When At 09:05 the ticket remains in "PENDING" status
    Then The SLA Watchdog flags the ticket as "SLA_BREACHED"
    And An emergency push alert is dispatched to the Operations Head
    And The ticket card on the Kanban board flashes a red warning border
  ```
- **Traceability:** `UC-SRV-04` | `feedbacks` | Cron Watchdog

---

## 8. EPIC-06: Administration, 4-Tier RBAC & Tariffs

Manages system user credentials, enforces 4-tier Role-Based Access Control, manages utility tariff configurations, and maintains immutable audit logs.

### US-ADM-01: 4-Tier Role-Based Access Control Enforcement
- **User Story:**  
  *As a* **System Administrator (`ACT-ADM`)**,  
  *I want to* manage user accounts and assign roles (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`),  
  *So that* users are restricted to authorized operational boundaries.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Security core | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Block resident from accessing administrative tariff configuration (RBAC Guard)
    Given User is authenticated with role "RESIDENT"
    When User navigates directly to "/cai-dat/bieu-phi"
    Then Next.js Middleware blocks the request
    And Redirects to a 403 Forbidden page: "You do not have permission to access system configuration"
  ```
- **Traceability:** `UC-ADM-01` | `users` | Middleware Security

---

### US-ADM-02: Progressive Utility Tariff & Unit Fee Configuration
- **User Story:**  
  *As a* **System Administrator (`ACT-ADM`)**,  
  *I want to* configure progressive power/water price brackets and management fee rates,  
  *So that* the calculation engine reflects updated municipal or building council decisions.
- **Estimate:** 5 Story Points (Medium)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Financial agility | `E`: Yes | `S`: 2 days | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Update management fee unit rate (Happy Path)
    Given Current management fee rate is 12,000 VND/m²/month
    When Admin updates rate to 13,500 VND/m²/month effective from "01/10/2026"
    Then System updates "fee_types" with `effective_from = '2026-10-01'`
    And Invoices generated before 01/10 retain the 12,000 VND rate
    And Invoices generated after 01/10 apply the 13,500 VND rate
  ```
- **Traceability:** `UC-ADM-03` | `fee_types` | `/cai-dat`

---

### US-ADM-03: Immutable Security Audit Logging
- **User Story:**  
  *As a* **System Administrator (`ACT-ADM`)**,  
  *I want* an immutable audit log recording all sensitive mutations (deleting vehicles, changing household heads, granting fee waivers),  
  *So that* internal fraud can be detected and compliance audits verified.
- **Estimate:** 3 Story Points (Small)
- **INVEST Evaluation:** `I`: Yes | `N`: Yes | `V`: Compliance integrity | `E`: Yes | `S`: 1 day | `T`: Yes
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Automatically record audit trail on sensitive mutation
    Given A manager de-registers a vehicle from the system
    When The transaction commits in the database
    Then System inserts an immutable record into "audit_logs":
      | Field | Value |
      | Actor ID | Manager User ID |
      | Action Code | DELETE_VEHICLE |
      | Target Entity | Plate "30E-123.45" |
      | Client IP | Authenticated Remote IP |
      | Timestamp | Millisecond-precision Timestamp |
  ```
- **Traceability:** `UC-ADM-04` | Audit Log / DB Trigger | `/cai-dat`

---

## 9. Comprehensive INVEST Compliance Scorecard

Summary verification table confirming that 100% of the User Stories meet all 6 **INVEST** criteria:

| Story ID | Story Title | I | N | V | E | S (Duration) | T | Story Points | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `US-APT-01` | Search apartment directory | ✅ | ✅ | ✅ | ✅ | ✅ (3d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-APT-02` | Onboard apartment & legal owner | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-APT-03` | Ownership transfer & title chain | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-RES-01` | Add member & verify Citizen ID | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-RES-02` | Household head successor handover | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-RES-03` | Online stay declaration | ✅ | ✅ | ✅ | ✅ | ✅ (1.5d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-RES-04` | Digital dossier police endorsement | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-VEH-01` | Register vehicle & enforce quota | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-VEH-02` | Pessimistic lock slot reservation | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-VEH-03` | Provision RFID access card | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-VEH-04` | Revoke vehicle & release slot | ✅ | ✅ | ✅ | ✅ | ✅ (1.5d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-BIL-01` | Utility meters & anomaly detection | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-BIL-02` | Month-end batch invoicing engine | ✅ | ✅ | ✅ | ✅ | ✅ (3d) | ✅ | **8 SP** | **COMPLIANT** |
| `US-BIL-03` | Dynamic VietQR Napas 247 session | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-BIL-04` | Asynchronous IPN webhook settlement | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-BIL-05` | Automated overdue debt audit | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-TKT-01` | Resident defect report with photos | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-TKT-02` | Technician dispatch & intake | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-TKT-03` | Resolution inspection & photo proof | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-TKT-04` | Automated SLA breach escalation | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **COMPLIANT** |
| `US-ADM-01` | 4-tier RBAC security enforcement | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-ADM-02` | Utility tariff configuration | ✅ | ✅ | ✅ | ✅ | ✅ (2d) | ✅ | **5 SP** | **COMPLIANT** |
| `US-ADM-03` | Immutable security audit logging | ✅ | ✅ | ✅ | ✅ | ✅ (1d) | ✅ | **3 SP** | **COMPLIANT** |

---

## 10. Bidirectional Requirements Traceability Matrix

| User Story ID | Corresponding Use Case | Primary SQL Tables (3NF Schema) | Frontend View / Modal | Target C4 Component |
| :--- | :--- | :--- | :--- | :--- |
| `US-APT-01` | `UC-RES-04` | `apartments`, `buildings` | `/can-ho` | `ApartmentDirectoryView` $\rightarrow$ `ApartmentService` |
| `US-APT-02` | `UC-RES-04` | `apartments`, `owners` | `/can-ho` | `ApartmentCreateModal` $\rightarrow$ `ApartmentService` |
| `US-APT-03` | `UC-RES-05` | `apartment_owners` | `/can-ho/[roomNumber]` | `OwnershipTransferDrawer` $\rightarrow$ `ApartmentService` |
| `US-RES-01` | `UC-RES-03` | `residents`, `household_members` | `/cu-dan` | `ResidentRegisterModal` $\rightarrow$ `ResidentService` |
| `US-RES-02` | `UC-RES-02` | `households`, `household_members` | `/cu-dan` | `HouseholdHeadTransferModal` $\rightarrow$ `ResidentService` |
| `US-RES-03` | `UC-RES-01` | `residence_records` | `/cu-tru` | `StayDeclarationForm` $\rightarrow$ `ResidentService` |
| `US-RES-04` | `UC-RES-06` | `residence_records` | `/lich-su-cu-tru` | `DossierApprovalAction` $\rightarrow$ `ResidentService` |
| `US-VEH-01` | `UC-VEH-01` | `vehicles`, `apartments` | `/phuong-tien-va-bai-do` | `VehicleRegisterModal` $\rightarrow$ `ParkingService` |
| `US-VEH-02` | `UC-VEH-02` | `parking_slots`, `vehicles` | `/phuong-tien-va-bai-do` | `SlotAllocationGrid` $\rightarrow$ `ParkingService` |
| `US-VEH-03` | `UC-VEH-03` | `vehicles` | `/phuong-tien-va-bai-do` | `RfidActivationCard` $\rightarrow$ `ParkingService` |
| `US-VEH-04` | `UC-VEH-04` | `vehicles`, `parking_slots` | `/phuong-tien-va-bai-do` | `VehicleRevokeDialog` $\rightarrow$ `ParkingService` |
| `US-BIL-01` | `UC-FIN-01` | `meter_readings` | `/phi-chung-cu` | `MeterReadingBatchTable` $\rightarrow$ `BillingService` |
| `US-BIL-02` | `UC-FIN-02` | `invoices`, `invoice_items` | `/phi-chung-cu` | `MonthlyBillingAction` $\rightarrow$ `BillingService` |
| `US-BIL-03` | `UC-FIN-03` | `invoices`, `payment_transactions` | `/phi-chung-cu` | `VietQrPaymentModal` $\rightarrow$ `BillingService` |
| `US-BIL-04` | `UC-FIN-04` | `payment_transactions`, `invoices` | `/api/webhooks/vietqr` | `VietQrIpnWebhookHandler` $\rightarrow$ `BillingService` |
| `US-BIL-05` | `UC-FIN-06` | `invoices` | Background Worker | `OverdueScanDaemon` $\rightarrow$ `BillingService` |
| `US-TKT-01` | `UC-SRV-01` | `feedbacks` | `/phan-anh-va-yeu-cau` | `TicketSubmitDrawer` $\rightarrow$ `MaintenanceService` |
| `US-TKT-02` | `UC-SRV-02` | `feedback_updates` | `/phan-anh-va-yeu-cau` | `TicketDispatchModal` $\rightarrow$ `MaintenanceService` |
| `US-TKT-03` | `UC-SRV-03` | `feedbacks`, `feedback_updates` | `/phan-anh-va-yeu-cau` | `TicketResolveDrawer` $\rightarrow$ `MaintenanceService` |
| `US-TKT-04` | `UC-SRV-04` | `feedbacks` | Cron Watchdog | `SlaEscalationDaemon` $\rightarrow$ `MaintenanceService` |
| `US-ADM-01` | `UC-ADM-01` | `users` | `/nguoi-dung` | `UserManagementConsole` $\rightarrow$ `SecurityAuthService` |
| `US-ADM-02` | `UC-ADM-03` | `fee_types` | `/cai-dat` | `FeeTariffConfigTable` $\rightarrow$ `BillingService` |
| `US-ADM-03` | `UC-ADM-04` | `audit_logs` | `/cai-dat` | `AuditLogAuditViewer` $\rightarrow$ `SecurityAuthService` |
