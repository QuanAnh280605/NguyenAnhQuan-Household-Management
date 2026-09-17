# ResidentHub - UI to Database Traceability Matrix
## Direct Alignment Between UI Elements, Application Views & PostgreSQL Schema

This document provides complete traceability showing how every user interface view, form field, and interactive component maps to the normalized PostgreSQL relational database schema.

---

## 1. Apartments Management View (`/can-ho`, `/can-ho/[roomNumber]`)

Allows building management to query unit directories, inspect floorplans, inspect current occupancy, and manage property ownership.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Room Number Tag** | Apartment unit identifier (e.g. `1205`) | `apartments` | `room_number` | `VARCHAR(50)`, Composite Unique with `building_id` |
| **Building Name & Code** | Complex tower (e.g. `Tower A`) | `buildings` | `code`, `name` | `VARCHAR(50)`, `VARCHAR(255)` |
| **Floor Level** | Floor number | `apartments` | `floor` | `INT NOT NULL` |
| **Floor Area Badge** | Usable living area (e.g. `85.5 m²`) | `apartments` | `area` | `NUMERIC(8,2) NOT NULL` |
| **Room Configurations** | Bedroom & Bathroom counts | `apartments` | `bedroom_count`, `bathroom_count` | `INT DEFAULT 1` |
| **Occupancy Chip** | Occupancy status indicator | `apartments` | `status` | `apartment_status` (`EMPTY`, `RENTED`, `OWNER_OCCUPIED`) |
| **Owner Contact Card** | Legal owner name & Citizen ID | `owners` | `full_name`, `citizen_id` | `VARCHAR(255)`, `VARCHAR(50) UNIQUE` |
| **Owner Phone & Email** | Contact details of owner | `owners` | `phone`, `email` | `VARCHAR(20)`, `VARCHAR(255)` |
| **Ownership Tenure** | Start date & current status | `apartment_owners` | `start_date`, `is_current`, `ownership_type` | `DATE`, `BOOLEAN`, `ownership_type` |
| **Active Household Link** | Linked registered household | `households` | `household_code`, `status` | `VARCHAR(50) UNIQUE`, `household_status` |

---

## 2. Residents & Household Roster View (`/cu-dan`)

Manages individual demographic profiles, household registrations (*Sổ hộ khẩu*), and family relationships.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Resident Full Name** | Legal citizen name | `residents` | `full_name` | `VARCHAR(255) NOT NULL` |
| **Citizen ID / CCCD** | 12-digit national ID | `residents` | `citizen_id` | `VARCHAR(50) UNIQUE` (Indexed) |
| **Date of Birth & Gender** | Demographics | `residents` | `date_of_birth`, `gender` | `DATE`, `gender_type` (`MALE`, `FEMALE`, `OTHER`) |
| **Phone & Email** | Personal communication | `residents` | `phone`, `email` | `VARCHAR(20)` (Indexed), `VARCHAR(255)` |
| **Hometown Origin** | Place of origin (*Quê quán*) | `residents` | `hometown` | `TEXT` |
| **Residency Status Badge** | Civil stay classification | `residents` | `resident_status` | `resident_status` (`PERMANENT`, `TEMPORARY`, `ABSENT`, `MOVED`) |
| **Household Code** | Household book code (*HK-1205*) | `households` | `household_code` | `VARCHAR(50) UNIQUE NOT NULL` |
| **Household Head Badge** | Head of family indicator | `household_members` | `is_head` | `BOOLEAN DEFAULT FALSE` |
| **Relationship to Head** | Kinship (*Vợ, Con, Bố mẹ...*) | `household_members` | `relationship_to_head` | `VARCHAR(100) NOT NULL` |
| **Move-in / Join Date** | Date joined household | `household_members` | `joined_date` | `DATE DEFAULT CURRENT_DATE` |

---

## 3. Stay Declarations & Audit History (`/cu-tru`, `/lich-su-cu-tru`)

Tracks statutory civil status declarations (temporary stay, temporary absence) and historical relocation audit trail.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Record Type Chip** | Stay category | `residence_records` | `record_type` | `residence_record_type` (`TAM_TRU`, `TAM_VANG`, `NHAP_HO`, `CHUYEN_DI`) |
| **Declaration Date Range** | Validity period (From - To) | `residence_records` | `start_date`, `end_date` | `DATE NOT NULL`, `DATE` |
| **Declaration Reason** | Official reason submitted | `residence_records` | `reason` | `TEXT` |
| **Police Verification Code**| Local police filing number | `residence_records` | `police_verified_code` | `VARCHAR(100)` |
| **Review Status Chip** | Approval lifecycle | `residence_records` | `status` | `residence_record_status` (`PENDING`, `APPROVED`, `EXPIRED`, `REJECTED`) |
| **Target Resident Link** | Declaring resident identity | `residence_records` | `resident_id` | `UUID FK REFERENCES residents(id)` |
| **Target Apartment Link** | Declared unit location | `residence_records` | `apartment_id` | `UUID FK REFERENCES apartments(id)` |

---

## 4. Vehicles & Parking Allocation

Manages basement parking spaces (B1, B2), assigned resident vehicles, and automated RFID card issuance.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **License Plate** | Vehicle registration plate | `vehicles` | `license_plate` | `VARCHAR(30) NOT NULL` (Indexed) |
| **Vehicle Category** | Vehicle classification | `vehicles` | `vehicle_type` | `vehicle_type` (`CAR`, `MOTORBIKE`, `ELECTRIC_BIKE`, `BICYCLE`) |
| **Brand & Color** | Vehicle model & aesthetics | `vehicles` | `brand_model`, `color` | `VARCHAR(100)`, `VARCHAR(50)` |
| **RFID Card Code** | Contactless access card code | `vehicles` | `rfid_card_number` | `VARCHAR(100) UNIQUE` |
| **Vehicle Status** | Operational state | `vehicles` | `status` | `vehicle_status` (`ACTIVE`, `INACTIVE`, `REVOKED`) |
| **Parking Slot Code** | Dedicated bay (e.g. `B1-05`) | `parking_slots` | `slot_code` | `VARCHAR(50) NOT NULL` |
| **Basement Floor** | Level allocation (`B1`, `B2`) | `parking_slots` | `floor` | `VARCHAR(20) NOT NULL` |
| **Slot Availability** | Occupancy status of slot | `parking_slots` | `status` | `parking_slot_status` (`AVAILABLE`, `OCCUPIED`, `RESERVED`) |

---

## 5. Billing, Utility Readings & Payments (`/phi-chung-cu`)

Handles monthly utility meter readings, automated batch invoicing, itemized tariff breakdowns, and multi-channel reconciliation.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Utility Meter Type** | Meter service | `meter_readings` | `meter_type` | `meter_type` (`WATER`, `ELECTRICITY`) |
| **Billing Cycle** | Statement month (e.g. `10-2025`)| `meter_readings` | `billing_period` | `VARCHAR(20) NOT NULL` |
| **Start / End Index** | Beginning & closing readings | `meter_readings` | `previous_reading`, `current_reading` | `NUMERIC(10,2) NOT NULL` |
| **Computed Usage** | Net consumption | `meter_readings` | `consumption` | `GENERATED ALWAYS AS (current - previous)` |
| **Invoice Number** | Unique bill statement code | `invoices` | `invoice_code` | `VARCHAR(100) UNIQUE NOT NULL` |
| **Total Amount Due** | Total payable | `invoices` | `total_amount` | `NUMERIC(12,2) NOT NULL DEFAULT 0` |
| **Settled Amount** | Accumulated payments | `invoices` | `paid_amount` | `NUMERIC(12,2) NOT NULL DEFAULT 0` |
| **Due Date** | Payment deadline | `invoices` | `due_date` | `DATE NOT NULL` |
| **Invoice Status Chip** | Debt status | `invoices` | `status` | `invoice_status` (`UNPAID`, `PARTIAL`, `PAID`, `OVERDUE`) |
| **Itemized Fee Line** | Breakdown line item | `invoice_items` | `item_name`, `quantity`, `unit_price`, `amount` | `NUMERIC(10,2)`, `NUMERIC(12,2)` |
| **Payment Receipt Entry**| Settlement transaction | `payment_transactions` | `amount`, `payment_method`, `transaction_code`, `paid_at` | `NUMERIC(12,2)`, `payment_method`, `VARCHAR(100)` |

---

## 6. Service Requests & Resident Feedback (`/phan-anh`)

Coordinates maintenance reporting, technician assignments, resolution notes, and SLA status tracking.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Ticket Title & Topic** | Incident summary | `feedbacks` | `title`, `category` | `VARCHAR(255)`, `feedback_category` |
| **Detailed Content** | Problem description | `feedbacks` | `content` | `TEXT NOT NULL` |
| **Priority Badge** | Urgency level | `feedbacks` | `priority` | `feedback_priority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) |
| **Workflow Status** | Progress state | `feedbacks` | `status` | `feedback_status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) |
| **Assigned Technician** | Dispatched engineer | `feedbacks` | `assigned_to` | `UUID FK REFERENCES users(id)` |
| **Originating Unit** | Location of issue | `feedbacks` | `apartment_id` | `UUID FK REFERENCES apartments(id)` |
| **Reporting Resident** | Author of report | `feedbacks` | `resident_id` | `UUID FK REFERENCES residents(id)` |
| **Progress Update Message**| Work notes / photo notes | `feedback_updates` | `message`, `previous_status`, `new_status` | `TEXT`, `feedback_status` |

---

## 7. Identity & Access Governance (`/nguoi-dung`)

Governs administrative access, role capabilities, credentials, and resident user linkage.

| UI Component / Field | Description | Target SQL Table | Relevant Column(s) | Data Type & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| **Username** | Sign-in username | `users` | `username` | `VARCHAR(100) UNIQUE NOT NULL` (Indexed) |
| **Full Name** | Staff / Resident name | `users` | `full_name` | `VARCHAR(255) NOT NULL` |
| **Assigned System Role**| RBAC authorization level | `users` | `role` | `user_role` (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`) |
| **Email & Phone** | Profile contact | `users` | `email`, `phone` | `VARCHAR(255) UNIQUE`, `VARCHAR(20)` |
| **Account State Switch**| Active / Suspended toggle | `users` | `is_active` | `BOOLEAN DEFAULT TRUE` |
| **Linked Resident Link** | Link to resident profile | `users` | `resident_id` | `UUID UNIQUE FK REFERENCES residents(id)` |
