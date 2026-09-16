# ResidentHub — Detailed Class & Sequence Diagrams (3-Tier Layering)
## Comprehensive UML Class Specifications & Method-Level Sequence Diagrams Aligned with 3-Tier Architecture

> **Status:** Approved Architectural Baseline  
> **Audience:** Backend Engineers, Software Architects, QA/SDET, Code Reviewers  
> **Standard:** UML 2.5, Clean Architecture / 3-Tier Layering, RFC 7807  
> **Traceability Links:**  
> - 📂 [FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md) (Physical Folder Layout & Layer Boundaries)  
> - 📋 [REQUIREMENTS_INVEST.md](REQUIREMENTS_INVEST.md) (Agile Requirements & INVEST Acceptance Criteria)  
> - 🏛️ [ARCHITECTURE_C4.md](ARCHITECTURE_C4.md) (C4 Level 3 Component Diagrams)  
> - 🔌 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) (REST Endpoints & DTO Contracts)  
> - 🗄️ [schema.sql](../schema.sql) (PostgreSQL 18-Table 3NF Normalized Database Schema)

---

## 📑 Table of Contents

1. [3-Tier UML Design Methodology](#1-3-tier-uml-design-methodology)
2. [UML Class Diagrams across the 3 Tiers](#2-uml-class-diagrams-across-the-3-tiers)
   - [2.1. Billing, Metering & VietQR Payment Subsystem](#21-billing-metering--vietqr-payment-subsystem)
   - [2.2. Residents, Households & Civil Registry Subsystem](#22-residents-households--civil-registry-subsystem)
   - [2.3. Vehicles & Underground Parking Subsystem](#23-vehicles--underground-parking-subsystem)
   - [2.4. Service Tickets & Maintenance SLA Subsystem](#24-service-tickets--maintenance-sla-subsystem)
3. [Detailed Method-Level Sequence Diagrams](#3-detailed-method-level-sequence-diagrams)
   - [3.1. Flow 1: Dynamic VietQR Payment & Webhook IPN Settlement (US-BIL-03, US-BIL-04)](#31-flow-1-dynamic-vietqr-payment--webhook-ipn-settlement-us-bil-03-us-bil-04)
   - [3.2. Flow 2: Underground Parking Slot Allocation via Pessimistic Lock (US-VEH-02)](#32-flow-2-underground-parking-slot-allocation-via-pessimistic-lock-us-veh-02)
   - [3.3. Flow 3: Household Member Registration & Citizen ID Verification (US-RES-01)](#33-flow-3-household-member-registration--citizen-id-verification-us-res-01)
   - [3.4. Flow 4: Month-End Meter Capture & Batch Billing Generation (US-BIL-02)](#34-flow-4-month-end-meter-capture--batch-billing-generation-us-bil-02)
4. [3-Tier Method Traceability Matrix](#4-3-tier-method-traceability-matrix)

---

## 1. 3-Tier UML Design Methodology

The Class and Sequence diagrams in this document strictly enforce the **3-Tier Architecture** established in [FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md](FOLDER_STRUCTURE_AND_3TIER_ARCHITECTURE.md):

1. **Presentation Tier (Controllers / Route Handlers):** Acts as the ingress boundary, receiving HTTP requests, executing authentication & authorization guards (`rbacGuard`), validating input payloads with Zod schemas, and delegating business execution to the Service layer.
2. **Business Logic Tier (Domain Services):** Encapsulates core business rules, progressive tariff computations, quota enforcement, and ACID transaction orchestration (`runInTransaction`), remaining completely independent of HTTP framework primitives.
3. **Data Access Tier (Repositories & Storage):** Executes parameterized SQL statements (`$1, $2`), acquires pessimistic locks (`SELECT ... FOR UPDATE`), and maps relational database rows to domain entities.

---

## 2. UML Class Diagrams across the 3 Tiers

### 2.1. Billing, Metering & VietQR Payment Subsystem

```mermaid
classDiagram
    %% PRESENTATION TIER
    class BillingController {
        +POST_paySession(request: NextRequest, params: RouteParams) Promise~NextResponse~
        +POST_webhookIpn(request: NextRequest) Promise~NextResponse~
        +POST_batchGenerate(request: NextRequest) Promise~NextResponse~
        +GET_invoices(request: NextRequest) Promise~NextResponse~
        +GET_invoiceDetail(request: NextRequest, params: RouteParams) Promise~NextResponse~
    }

    %% BUSINESS LOGIC TIER
    class IBillingService {
        <<interface>>
        +generateVietQrSession(params: GeneratePaySessionParams) Promise~VietQrSessionDto~
        +processIpnSettlement(ipnPayload: VietQrIpnPayloadDto) Promise~PaymentResultDto~
        +runBatchInvoicing(billingMonth: string) Promise~BatchBillingSummaryDto~
        +getInvoicesByApartment(apartmentId: string) Promise~InvoiceDto[]~
    }

    class BillingService {
        -invoiceRepo: IInvoiceRepository
        -meterRepo: IMeterReadingRepository
        -paymentRepo: IPaymentTransactionRepository
        -tariffRepo: IFeeTariffRepository
        -notificationService: INotificationService
        +generateVietQrSession(params: GeneratePaySessionParams) Promise~VietQrSessionDto~
        +processIpnSettlement(ipnPayload: VietQrIpnPayloadDto) Promise~PaymentResultDto~
        +runBatchInvoicing(billingMonth: string) Promise~BatchBillingSummaryDto~
        -calculateTieredUtility(usage: number, tariffs: FeeTariffEntity[]) number
    }

    %% DATA ACCESS TIER
    class IInvoiceRepository {
        <<interface>>
        +findById(invoiceId: string) Promise~InvoiceEntity~
        +updateStatusToPaid(client: PoolClient, invoiceId: string, amount: number) Promise~void~
        +batchInsertInvoices(client: PoolClient, invoices: NewInvoiceRecord[]) Promise~string[]~
        +batchInsertItems(client: PoolClient, items: NewInvoiceItemRecord[]) Promise~void~
        +verifyUserBelongsToApartment(userId: string, apartmentId: string) Promise~boolean~
    }

    class InvoiceRepository {
        -dbPool: Pool
        +findById(invoiceId: string) Promise~InvoiceEntity~
        +updateStatusToPaid(client: PoolClient, invoiceId: string, amount: number) Promise~void~
        +batchInsertInvoices(client: PoolClient, invoices: NewInvoiceRecord[]) Promise~string[]~
        +batchInsertItems(client: PoolClient, items: NewInvoiceItemRecord[]) Promise~void~
        +verifyUserBelongsToApartment(userId: string, apartmentId: string) Promise~boolean~
    }

    class IPaymentTransactionRepository {
        <<interface>>
        +findByGatewayTxCode(txCode: string) Promise~PaymentTransactionEntity~
        +create(client: PoolClient, tx: NewPaymentTxRecord) Promise~PaymentTransactionEntity~
    }

    class PaymentTransactionRepository {
        -dbPool: Pool
        +findByGatewayTxCode(txCode: string) Promise~PaymentTransactionEntity~
        +create(client: PoolClient, tx: NewPaymentTxRecord) Promise~PaymentTransactionEntity~
    }

    %% DOMAIN ENTITIES & DTOS
    class InvoiceEntity {
        +UUID id
        +string invoiceCode
        +UUID apartmentId
        +number totalAmount
        +number paidAmount
        +string status
        +Date dueDate
    }

    class PaymentTransactionEntity {
        +UUID id
        +UUID invoiceId
        +number amount
        +string paymentMethod
        +string gatewayTxCode
        +Date paymentTime
    }

    class VietQrSessionDto {
        +string sessionId
        +string qrCodeUrl
        +string bankName
        +string accountNumber
        +number amount
        +string transferContent
        +string expiresAt
    }

    BillingController ..> IBillingService : invokes
    IBillingService <|.. BillingService : implements
    BillingService ..> IInvoiceRepository : depends on
    BillingService ..> IPaymentTransactionRepository : depends on
    IInvoiceRepository <|.. InvoiceRepository : implements
    IPaymentTransactionRepository <|.. PaymentTransactionRepository : implements
    InvoiceRepository ..> InvoiceEntity : returns
    PaymentTransactionRepository ..> PaymentTransactionEntity : returns
    BillingService ..> VietQrSessionDto : produces
```

---

### 2.2. Residents, Households & Civil Registry Subsystem

```mermaid
classDiagram
    %% PRESENTATION TIER
    class ResidentController {
        +GET_residents(request: NextRequest) Promise~NextResponse~
        +POST_registerResident(request: NextRequest) Promise~NextResponse~
        +POST_transferHead(request: NextRequest) Promise~NextResponse~
        +POST_declareStay(request: NextRequest) Promise~NextResponse~
        +POST_verifyStayRecord(request: NextRequest, params: RouteParams) Promise~NextResponse~
    }

    %% BUSINESS LOGIC TIER
    class IResidentService {
        <<interface>>
        +registerMember(dto: RegisterMemberInputDto) Promise~ResidentDetailDto~
        +transferHouseholdHead(dto: TransferHeadInputDto) Promise~HouseholdDto~
        +declareStayMovement(dto: StayDeclarationInputDto) Promise~StayRecordDto~
        +verifyStayRecord(recordId: string, verifierId: string, isApproved: boolean) Promise~void~
    }

    class ResidentService {
        -residentRepo: IResidentRepository
        -householdRepo: IHouseholdRepository
        -stayRepo: IStayRecordRepository
        +registerMember(dto: RegisterMemberInputDto) Promise~ResidentDetailDto~
        +transferHouseholdHead(dto: TransferHeadInputDto) Promise~HouseholdDto~
        +declareStayMovement(dto: StayDeclarationInputDto) Promise~StayRecordDto~
        +verifyStayRecord(recordId: string, verifierId: string, isApproved: boolean) Promise~void~
    }

    %% DATA ACCESS TIER
    class IResidentRepository {
        <<interface>>
        +findByCccd(cccd: string) Promise~ResidentEntity~
        +create(client: PoolClient, resident: NewResidentRecord) Promise~ResidentEntity~
        +updateStatus(residentId: string, status: string) Promise~void~
    }

    class ResidentRepository {
        -dbPool: Pool
        +findByCccd(cccd: string) Promise~ResidentEntity~
        +create(client: PoolClient, resident: NewResidentRecord) Promise~ResidentEntity~
        +updateStatus(residentId: string, status: string) Promise~void~
    }

    class IHouseholdRepository {
        <<interface>>
        +findById(householdId: string) Promise~HouseholdEntity~
        +setHouseholdHead(client: PoolClient, householdId: string, newHeadId: string) Promise~void~
        +addMember(client: PoolClient, member: NewMemberLink) Promise~void~
    }

    class HouseholdRepository {
        -dbPool: Pool
        +findById(householdId: string) Promise~HouseholdEntity~
        +setHouseholdHead(client: PoolClient, householdId: string, newHeadId: string) Promise~void~
        +addMember(client: PoolClient, member: NewMemberLink) Promise~void~
    }

    %% ENTITIES
    class ResidentEntity {
        +UUID id
        +string fullName
        +string citizenId
        +Date dateOfBirth
        +string gender
        +string phone
        +string residentStatus
    }

    class HouseholdEntity {
        +UUID id
        +string householdCode
        +UUID apartmentId
        +UUID headResidentId
        +string status
    }

    ResidentController ..> IResidentService : invokes
    IResidentService <|.. ResidentService : implements
    ResidentService ..> IResidentRepository : depends on
    ResidentService ..> IHouseholdRepository : depends on
    IResidentRepository <|.. ResidentRepository : implements
    IHouseholdRepository <|.. HouseholdRepository : implements
    ResidentRepository ..> ResidentEntity : produces
    HouseholdRepository ..> HouseholdEntity : produces
```

---

### 2.3. Vehicles & Underground Parking Subsystem

```mermaid
classDiagram
    %% PRESENTATION TIER
    class ParkingController {
        +GET_slots(request: NextRequest) Promise~NextResponse~
        +POST_allocateSlot(request: NextRequest) Promise~NextResponse~
        +POST_registerVehicle(request: NextRequest) Promise~NextResponse~
        +POST_activateRfid(request: NextRequest, params: RouteParams) Promise~NextResponse~
        +POST_revokeVehicle(request: NextRequest, params: RouteParams) Promise~NextResponse~
    }

    %% BUSINESS LOGIC TIER
    class IParkingService {
        <<interface>>
        +registerVehicle(dto: RegisterVehicleInputDto) Promise~VehicleDto~
        +allocateSlotPessimistic(dto: AllocateSlotInputDto) Promise~SlotAllocationDto~
        +activateRfidCard(vehicleId: string, rfidCode: string) Promise~void~
        +revokeVehicleAndReleaseSlot(vehicleId: string, reason: string) Promise~void~
    }

    class ParkingService {
        -slotRepo: IParkingSlotRepository
        -vehicleRepo: IVehicleRepository
        -apartmentRepo: IApartmentRepository
        +registerVehicle(dto: RegisterVehicleInputDto) Promise~VehicleDto~
        +allocateSlotPessimistic(dto: AllocateSlotInputDto) Promise~SlotAllocationDto~
        +activateRfidCard(vehicleId: string, rfidCode: string) Promise~void~
        +revokeVehicleAndReleaseSlot(vehicleId: string, reason: string) Promise~void~
    }

    %% DATA ACCESS TIER
    class IParkingSlotRepository {
        <<interface>>
        +findAvailableByFloor(floorZone: string) Promise~ParkingSlotEntity[]~
        +acquireSlotForUpdate(client: PoolClient, slotId: string) Promise~ParkingSlotEntity~
        +occupySlot(client: PoolClient, slotId: string, vehicleId: string) Promise~void~
        +releaseSlot(client: PoolClient, slotId: string) Promise~void~
    }

    class ParkingSlotRepository {
        -dbPool: Pool
        +findAvailableByFloor(floorZone: string) Promise~ParkingSlotEntity[]~
        +acquireSlotForUpdate(client: PoolClient, slotId: string) Promise~ParkingSlotEntity~
        +occupySlot(client: PoolClient, slotId: string, vehicleId: string) Promise~void~
        +releaseSlot(client: PoolClient, slotId: string) Promise~void~
    }

    class IVehicleRepository {
        <<interface>>
        +countActiveByApartment(apartmentId: string, vehicleType: string) Promise~number~
        +create(client: PoolClient, vehicle: NewVehicleRecord) Promise~VehicleEntity~
        +updateSlotId(client: PoolClient, vehicleId: string, slotId: string) Promise~void~
        +setRfidCard(vehicleId: string, rfidCode: string) Promise~void~
        +revokeVehicle(client: PoolClient, vehicleId: string) Promise~void~
    }

    class VehicleRepository {
        -dbPool: Pool
        +countActiveByApartment(apartmentId: string, vehicleType: string) Promise~number~
        +create(client: PoolClient, vehicle: NewVehicleRecord) Promise~VehicleEntity~
        +updateSlotId(client: PoolClient, vehicleId: string, slotId: string) Promise~void~
        +setRfidCard(vehicleId: string, rfidCode: string) Promise~void~
        +revokeVehicle(client: PoolClient, vehicleId: string) Promise~void~
    }

    ParkingController ..> IParkingService : invokes
    IParkingService <|.. ParkingService : implements
    ParkingService ..> IParkingSlotRepository : depends on
    ParkingService ..> IVehicleRepository : depends on
    IParkingSlotRepository <|.. ParkingSlotRepository : implements
    IVehicleRepository <|.. VehicleRepository : implements
```

---

### 2.4. Service Tickets & Maintenance SLA Subsystem

```mermaid
classDiagram
    %% PRESENTATION TIER
    class TicketController {
        +GET_tickets(request: NextRequest) Promise~NextResponse~
        +POST_submitTicket(request: NextRequest) Promise~NextResponse~
        +PATCH_dispatchTechnician(request: NextRequest, params: RouteParams) Promise~NextResponse~
        +PATCH_resolveTicket(request: NextRequest, params: RouteParams) Promise~NextResponse~
    }

    %% BUSINESS LOGIC TIER
    class ITicketService {
        <<interface>>
        +createTicket(dto: CreateTicketInputDto) Promise~TicketDetailDto~
        +dispatchTechnician(ticketId: string, technicianId: string) Promise~void~
        +resolveTicket(ticketId: string, resolutionProofDto: ResolveProofDto) Promise~void~
        +scanSlaBreaches() Promise~number~
    }

    class TicketService {
        -ticketRepo: ITicketRepository
        -notificationService: INotificationService
        +createTicket(dto: CreateTicketInputDto) Promise~TicketDetailDto~
        +dispatchTechnician(ticketId: string, technicianId: string) Promise~void~
        +resolveTicket(ticketId: string, resolutionProofDto: ResolveProofDto) Promise~void~
        +scanSlaBreaches() Promise~number~
    }

    %% DATA ACCESS TIER
    class ITicketRepository {
        <<interface>>
        +create(client: PoolClient, ticket: NewTicketRecord) Promise~FeedbackEntity~
        +addHistoryUpdate(client: PoolClient, update: NewTicketUpdateRecord) Promise~void~
        +updateStatus(client: PoolClient, ticketId: string, status: string, techId: string) Promise~void~
        +findOverdueSlaPending() Promise~FeedbackEntity[]~
        +markSlaBreached(ticketId: string) Promise~void~
    }

    class TicketRepository {
        -dbPool: Pool
        +create(client: PoolClient, ticket: NewTicketRecord) Promise~FeedbackEntity~
        +addHistoryUpdate(client: PoolClient, update: NewTicketUpdateRecord) Promise~void~
        +updateStatus(client: PoolClient, ticketId: string, status: string, techId: string) Promise~void~
        +findOverdueSlaPending() Promise~FeedbackEntity[]~
        +markSlaBreached(ticketId: string) Promise~void~
    }

    TicketController ..> ITicketService : invokes
    ITicketService <|.. TicketService : implements
    TicketService ..> ITicketRepository : depends on
    ITicketRepository <|.. TicketRepository : implements
```

---

## 3. Detailed Method-Level Sequence Diagrams

### 3.1. Flow 1: Dynamic VietQR Payment & Webhook IPN Settlement (US-BIL-03, US-BIL-04)

Illustrates the full settlement lifecycle: (A) Dynamic QR payment session initiation and (B) Asynchronous Napas 247 IPN webhook handling with strict Idempotency deduplication:

```mermaid
sequenceDiagram
    autonumber
    actor Resident as 👤 Resident (Client Device)
    participant UI as 🖥️ VietQrPaymentModal (SPA)
    participant Ctrl as 🌐 BillingController (Presentation)
    participant Svc as ⚙️ BillingService (Business Logic)
    participant InvRepo as 🗄️ InvoiceRepository (DAL)
    participant TxRepo as 🗄️ PaymentTxRepository (DAL)
    participant DB as 🐘 PostgreSQL 16 (ACID Engine)
    participant Gateway as 💳 VietQR / Napas 247 Gateway

    %% PHASE A: DYNAMIC QR INITIATION
    Note over Resident,Gateway: PHASE A: DYNAMIC QR PAYMENT SESSION INITIATION [US-BIL-03]
    Resident->>UI: Clicks "Pay via VietQR" on Invoice #INV-1205
    UI->>Ctrl: POST /api/v1/billing/invoices/1205/pay-session
    Ctrl->>Ctrl: rbacGuard(request, ['RESIDENT']) -> session
    Ctrl->>Ctrl: createPaySessionSchema.safeParse(body) -> { invoiceId: "1205" }
    Ctrl->>Svc: generateVietQrSession({ invoiceId: "1205", requestUserId: session.userId, userRole: "RESIDENT" })
    Svc->>InvRepo: findById("1205")
    InvRepo->>DB: SELECT * FROM invoices WHERE id = '1205' LIMIT 1;
    DB-->>InvRepo: Return invoice record (status: 'UNPAID', total: 2,350,000 VND)
    InvRepo-->>Svc: Return InvoiceEntity
    Svc->>Svc: Assert invoice.status !== 'PAID'
    Svc->>Svc: Construct Napas transferContent: "INV INV-202609-1205 CANHO 1205"
    Svc->>Svc: Encode Dynamic VietQR URL & compute 15-minute expiration timestamp
    Svc-->>Ctrl: Return VietQrSessionDto
    Ctrl-->>UI: HTTP 200 OK (VietQrSessionDto)
    UI->>Resident: Renders VietQR image, MB Bank account info, and 15:00 countdown timer
    UI->>UI: Initiates client polling (every 3000ms)

    %% PHASE B: ASYNCHRONOUS IPN SETTLEMENT
    Note over Resident,Gateway: PHASE B: ASYNCHRONOUS IPN WEBHOOK & IDEMPOTENT SETTLEMENT [US-BIL-04]
    Resident->>Gateway: Scans QR code & authorizes transfer of 2,350,000 VND via Mobile Banking
    Gateway->>Ctrl: POST /api/v1/webhooks/vietqr (Headers: X-Signature: HMAC_SHA256)
    Ctrl->>Ctrl: verifyHmacSha256(payload, secretKey) -> Valid Signature!
    Ctrl->>Svc: processIpnSettlement(ipnPayloadDto)
    
    %% Idempotency validation
    Svc->>TxRepo: findByGatewayTxCode("TXN-NAPAS-998811")
    TxRepo->>DB: SELECT * FROM payment_transactions WHERE gateway_tx_code = $1;
    DB-->>TxRepo: rowCount == 0 (New unique transaction)
    TxRepo-->>Svc: Return null

    %% Transactional settlement block
    Svc->>DB: BEGIN TRANSACTION (runInTransaction)
    Svc->>TxRepo: create(client, { invoiceId: "1205", amount: 2350000, method: 'VIETQR' })
    TxRepo->>DB: INSERT INTO payment_transactions (...) VALUES (...)
    Svc->>InvRepo: updateStatusToPaid(client, "1205", 2350000)
    InvRepo->>DB: UPDATE invoices SET status = 'PAID', paid_amount = 2350000, paid_at = NOW() WHERE id = '1205';
    Svc->>DB: COMMIT
    
    Svc-->>Ctrl: Return PaymentResultDto(status: 'SUCCESS')
    Ctrl-->>Gateway: HTTP 200 OK ({ acknowledged: true })
    
    %% Polling response reflects updated status
    UI->>Ctrl: GET /api/v1/billing/invoices/1205 (Polling check)
    Ctrl->>Svc: getInvoiceDetail("1205")
    Svc->>InvRepo: findById("1205")
    InvRepo-->>Svc: Return InvoiceEntity (status: 'PAID')
    Svc-->>Ctrl: Return InvoiceEntity (status: 'PAID')
    Ctrl-->>UI: HTTP 200 OK (status: 'PAID')
    UI->>Resident: Triggers celebration fireworks animation & closes modal
```

---

### 3.2. Flow 2: Underground Parking Slot Allocation via Pessimistic Lock (US-VEH-02)

Demonstrates how the Data Access layer utilizes PostgreSQL `SELECT ... FOR UPDATE` row locks to completely eliminate race conditions when multiple managers attempt to reserve the same parking slot:

```mermaid
sequenceDiagram
    autonumber
    actor ManagerA as 👔 Manager A
    actor ManagerB as 👔 Manager B
    participant Ctrl as 🌐 ParkingController
    participant Svc as ⚙️ ParkingService
    participant SlotRepo as 🗄️ ParkingSlotRepository
    participant VehRepo as 🗄️ VehicleRepository
    participant DB as 🐘 PostgreSQL 16 (Lock Engine)

    ManagerA->>Ctrl: POST /api/v1/parking/slots/allocate { slotId: "B1-C12", vehicleId: "VEH-01" }
    ManagerB->>Ctrl: POST /api/v1/parking/slots/allocate { slotId: "B1-C12", vehicleId: "VEH-02" } (+50ms offset)

    %% Manager A transaction processes first
    Ctrl->>Svc: allocateSlotPessimistic({ slotId: "B1-C12", vehicleId: "VEH-01" })
    Svc->>DB: BEGIN TRANSACTION (Tx_A)
    Svc->>SlotRepo: acquireSlotForUpdate(client_A, "B1-C12")
    SlotRepo->>DB: SELECT * FROM parking_slots WHERE id = 'B1-C12' FOR UPDATE;
    Note over DB: Tx_A acquires Exclusive Row Lock on Slot B1-C12!
    DB-->>SlotRepo: Return slot record (status: 'AVAILABLE')

    %% Manager B transaction hits row lock
    Ctrl->>Svc: allocateSlotPessimistic({ slotId: "B1-C12", vehicleId: "VEH-02" })
    Svc->>DB: BEGIN TRANSACTION (Tx_B)
    Svc->>SlotRepo: acquireSlotForUpdate(client_B, "B1-C12")
    SlotRepo->>DB: SELECT * FROM parking_slots WHERE id = 'B1-C12' FOR UPDATE;
    Note over DB,SlotRepo: Tx_B is BLOCKED waiting for Tx_A lock release!

    %% Manager A completes allocation
    Svc->>SlotRepo: occupySlot(client_A, "B1-C12", "VEH-01")
    SlotRepo->>DB: UPDATE parking_slots SET status = 'OCCUPIED', vehicle_id = 'VEH-01' WHERE id = 'B1-C12';
    Svc->>VehRepo: updateSlotId(client_A, "VEH-01", "B1-C12")
    VehRepo->>DB: UPDATE vehicles SET parking_slot_id = 'B1-C12' WHERE id = 'VEH-01';
    Svc->>DB: COMMIT (Tx_A)
    Note over DB: Tx_A Committed successfully -> Exclusive Lock Released!
    Svc-->>Ctrl: Return allocation success
    Ctrl-->>ManagerA: HTTP 200 OK (Slot B1-C12 allocated to VEH-01)

    %% Manager B is unblocked and observes occupied state
    DB-->>SlotRepo: Tx_B reads row state after Tx_A commit (status: 'OCCUPIED')
    SlotRepo-->>Svc: Return slot record (status: 'OCCUPIED', vehicle_id: 'VEH-01')
    Svc->>Svc: Assert slot.status === 'AVAILABLE' -> Fails! Conflict detected.
    Svc->>DB: ROLLBACK (Tx_B)
    Svc-->>Ctrl: Throws ConcurrencyError("Slot B1-C12 was just allocated by another user.")
    Ctrl-->>ManagerB: HTTP 409 Conflict (RFC 7807: ERR_PARKING_SLOT_ALREADY_OCCUPIED)
```

---

### 3.3. Flow 3: Household Member Registration & Citizen ID Verification (US-RES-01)

```mermaid
sequenceDiagram
    autonumber
    actor Manager as 👔 Building Manager
    participant UI as 🖥️ ResidentRegisterModal
    participant Ctrl as 🌐 ResidentController
    participant Svc as ⚙️ ResidentService
    participant ResRepo as 🗄️ ResidentRepository
    participant HouseRepo as 🗄️ HouseholdRepository
    participant DB as 🐘 PostgreSQL 16

    Manager->>UI: Enters Form: Name, CCCD "001202005678", DOB, Relation "Child", Household "HK-1205"
    UI->>Ctrl: POST /api/v1/residents (Body: RegisterMemberInputDto)
    Ctrl->>Ctrl: rbacGuard(request, ['MANAGER', 'ADMIN'])
    Ctrl->>Ctrl: residentSchema.safeParse(body) -> Valid DTO
    Ctrl->>Svc: registerMember(dto)
    
    %% Citizen ID uniqueness check
    Svc->>ResRepo: findByCccd("001202005678")
    ResRepo->>DB: SELECT id FROM residents WHERE citizen_id = $1 LIMIT 1;
    DB-->>ResRepo: rowCount == 0 (Valid: No duplicate citizen ID)
    ResRepo-->>Svc: Return null

    %% Household validity verification
    Svc->>HouseRepo: findById(dto.householdId)
    HouseRepo->>DB: SELECT * FROM households WHERE id = $1 AND status = 'ACTIVE';
    DB-->>HouseRepo: Return HouseholdEntity
    HouseRepo-->>Svc: Return household

    %% ACID Transaction execution
    Svc->>DB: BEGIN TRANSACTION (runInTransaction)
    Svc->>ResRepo: create(client, residentRecord)
    ResRepo->>DB: INSERT INTO residents (full_name, citizen_id, phone, ...) VALUES (...) RETURNING *;
    DB-->>ResRepo: Return ResidentEntity (id: "RES-9988")
    
    Svc->>HouseRepo: addMember(client, { householdId: dto.householdId, residentId: "RES-9988", relation: "Child", isHead: false })
    HouseRepo->>DB: INSERT INTO household_members (household_id, resident_id, relationship_to_head, is_head) VALUES (...);
    Svc->>DB: COMMIT

    Svc-->>Ctrl: Return ResidentDetailDto
    Ctrl-->>UI: HTTP 201 Created (ResidentDetailDto)
    UI->>Manager: Displays Toast "Household member registered successfully" & refreshes roster
```

---

### 3.4. Flow 4: Month-End Meter Capture & Batch Billing Generation (US-BIL-02)

```mermaid
sequenceDiagram
    autonumber
    actor Accountant as 👔 Building Accountant
    participant UI as 🖥️ MonthlyBillingAction
    participant Ctrl as 🌐 BillingController
    participant Svc as ⚙️ BillingService
    participant MeterRepo as 🗄️ MeterReadingRepository
    participant TariffRepo as 🗄️ FeeTariffRepository
    participant InvRepo as 🗄️ InvoiceRepository
    participant DB as 🐘 PostgreSQL 16

    Accountant->>UI: Clicks "Run Month-End Batch Invoicing (Period: 2026-09)"
    UI->>Ctrl: POST /api/v1/billing/batch-generate { month: "2026-09" }
    Ctrl->>Ctrl: rbacGuard(request, ['MANAGER', 'ADMIN'])
    Ctrl->>Svc: runBatchInvoicing("2026-09")

    %% Meter audit validation
    Svc->>MeterRepo: findAuditedReadingsByMonth("2026-09")
    MeterRepo->>DB: SELECT * FROM meter_readings WHERE billing_period = '2026-09' AND status = 'AUDITED';
    DB-->>MeterRepo: Return 1,200 meter records
    MeterRepo-->>Svc: Return MeterReadingEntity[]

    %% Active fee tariffs retrieval
    Svc->>TariffRepo: getCurrentTariffs()
    TariffRepo->>DB: SELECT * FROM fee_types WHERE is_active = true;
    DB-->>TariffRepo: Return Tariff List (Management 12,000 VND/m², Tiered Water, Parking rates)
    TariffRepo-->>Svc: Return FeeTariffEntity[]

    %% Pure service-tier business calculation
    Note over Svc: Service computes fees for 1,200 units:<br/>1. Management Fee = Net Area (m²) x 12,000 VND<br/>2. Parking Fee = Active Vehicles x Vehicle Tariffs<br/>3. Utilities = Progressive tiered water/power computation<br/>Aggregated outputs: 1,200 Invoices & 4,800 Itemized Line Items

    %% High-throughput batch insert within transaction
    Svc->>DB: BEGIN TRANSACTION (runInTransaction)
    Svc->>InvRepo: batchInsertInvoices(client, newInvoices)
    InvRepo->>DB: INSERT INTO invoices (...) VALUES (...) RETURNING id;
    DB-->>InvRepo: Return 1,200 generated UUIDs
    
    Svc->>InvRepo: batchInsertItems(client, newInvoiceItems)
    InvRepo->>DB: INSERT INTO invoice_items (...) VALUES (...) [4,800 items committed in chunks of 500]
    Svc->>DB: COMMIT

    Svc-->>Ctrl: Return BatchBillingSummaryDto(totalInvoices: 1200, totalAmount: 3840000000)
    Ctrl-->>UI: HTTP 200 OK (BatchBillingSummaryDto)
    UI->>Accountant: Displays summary report: "1,200 invoices successfully issued. Due date: 10/10/2026"
```

---

## 4. 3-Tier Method Traceability Matrix

Bidirectional cross-reference matrix tracing **REST API Endpoints (#4)** $\leftrightarrow$ **Controller Methods (#5)** $\leftrightarrow$ **Service Methods (#5)** $\leftrightarrow$ **Repository Methods (#5)** $\leftrightarrow$ **SQL Tables (#4)**:

| REST API Endpoint | Controller Ingress (Presentation) | Service Logic (Business Tier) | Repository Operations (Data Access) | SQL Tables (3NF Schema) |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/v1/billing/invoices/{id}/pay-session` | `BillingController.POST_paySession` | `BillingService.generateVietQrSession` | `InvoiceRepository.findById` | `invoices`, `apartments` |
| `POST /api/v1/webhooks/vietqr` | `BillingController.POST_webhookIpn` | `BillingService.processIpnSettlement` | `PaymentTxRepo.create`<br/>`InvoiceRepo.updateStatusToPaid` | `payment_transactions`, `invoices` |
| `POST /api/v1/billing/batch-generate` | `BillingController.POST_batchGenerate` | `BillingService.runBatchInvoicing` | `MeterRepo.findAuditedReadings`<br/>`InvoiceRepo.batchInsertInvoices` | `meter_readings`, `invoices`, `invoice_items` |
| `POST /api/v1/residents` | `ResidentController.POST_registerResident` | `ResidentService.registerMember` | `ResidentRepo.create`<br/>`HouseholdRepo.addMember` | `residents`, `household_members` |
| `POST /api/v1/residents/head-transfer` | `ResidentController.POST_transferHead` | `ResidentService.transferHouseholdHead` | `HouseholdRepo.setHouseholdHead` | `households`, `household_members` |
| `POST /api/v1/stay-records` | `ResidentController.POST_declareStay` | `ResidentService.declareStayMovement` | `StayRecordRepo.create` | `residence_records` |
| `POST /api/v1/parking/slots/allocate` | `ParkingController.POST_allocateSlot` | `ParkingService.allocateSlotPessimistic` | `SlotRepo.acquireSlotForUpdate`<br/>`SlotRepo.occupySlot` | `parking_slots`, `vehicles` |
| `POST /api/v1/parking/vehicles` | `ParkingController.POST_registerVehicle` | `ParkingService.registerVehicle` | `VehRepo.countActiveByApartment`<br/>`VehRepo.create` | `vehicles`, `apartments` |
| `POST /api/v1/tickets` | `TicketController.POST_submitTicket` | `TicketService.createTicket` | `TicketRepo.create` | `feedbacks`, `feedback_updates` |
| `PATCH /api/v1/tickets/{id}/dispatch` | `TicketController.PATCH_dispatchTechnician` | `TicketService.dispatchTechnician` | `TicketRepo.updateStatus` | `feedbacks`, `feedback_updates` |
| `PATCH /api/v1/tickets/{id}/resolve` | `TicketController.PATCH_resolveTicket` | `TicketService.resolveTicket` | `TicketRepo.updateStatus` | `feedbacks`, `feedback_updates` |
| `POST /api/v1/apartments` | `ApartmentController.POST_create` | `ApartmentService.createApartment` | `ApartmentRepo.create`<br/>`OwnerRepo.create` | `apartments`, `owners`, `apartment_owners` |
