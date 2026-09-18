# ADR-0005: Dynamic VietQR Napas 247 Sessions & Webhook Idempotency

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Principal Architect, Financial Lead, Backend Engineer
- **Consulted:** Banking Integration Partner, Security Officer
- **Informed:** Core Engineering Team

---

## 1. Context and Problem Statement

Residential building fee collection involves hundreds of monthly invoices totaling billions of VND across management fees, vehicle parking, water, and EVN electricity.

Legacy collection methods suffer from critical vulnerabilities:
1. **Static Bank Transfers:** Residents manually transfer funds to a generic building account and forget to write the exact room code in the transfer memo. Accountants spend days manually matching bank statements against unpaid invoices.
2. **Third-Party Payment Gateway Commissions:** Traditional credit card / payment gateway merchants charge 1.2% to 2.5% per transaction, imposing a significant financial burden on the building's operating budget.
3. **Webhook Duplication / Replay Attacks:** Financial webhooks from banking partners (IPN — Instant Payment Notification) are frequently retried by the gateway due to network timeouts, risking duplicate invoice clearing or ledger imbalance.

We must decide on the architecture for digital bill payment and automated reconciliation.

## 2. Decision Drivers

- **Zero Transaction Fees:** Maximize net building collection without recurring percentage deductions.
- **Automated Instant Reconciliation:** Sub-second balance clearing without human accountant intervention.
- **Absolute Idempotency:** Guarantee that the exact same webhook transaction payload processed multiple times results in **zero duplicate payments**.
- **Vietnamese National Banking Standard:** Direct integration with the **VietQR Napas 247** inter-bank standard supported by 40+ commercial banks in Vietnam.

## 3. Considered Options

1. **Option 1: Manual Cash / Static Account Transfer with Slip Upload**
   - *Pros:* Zero technical integration overhead.
   - *Cons:* Error-prone; slow; requires full-time accounting staff to verify screenshots.
2. **Option 2: Commercial Gateway Aggregator (VNPAY / Momo Merchant API)**
   - *Pros:* Ready-made checkout SDK.
   - *Cons:* 1.5% - 2.5% transaction fees; proprietary sandbox constraints; locked into third-party checkout redirects.
3. **Option 3: Dynamic VietQR Pay Session + Asynchronous Idempotent IPN Webhook**
   - *Pros:* Direct bank-to-bank transfer via Napas 247 with zero merchant percentage fees; QR code encodes exact invoice correlation ID, account number, and amount; mobile banking apps autofill all fields; asynchronous webhook auto-reconciles ledger idempotently.
   - *Cons:* Requires building a robust webhook ingress service with cryptographic verification and idempotency storage.

## 4. Decision Outcome

**Chosen Option:** **Option 3 — Dynamic VietQR Napas 247 Sessions with Idempotent IPN Webhooks**.

Implemented across [BillingService.create_vietqr_pay_session](file:///d:/VSF/chung-cu-household-management/backend/app/services/billing_service.py#L24-L55) and [BillingService.process_vietqr_webhook](file:///d:/VSF/chung-cu-household-management/backend/app/services/billing_service.py#L56-L87):

```
Resident Client           ResidentHub API         Napas / Bank Gateway
      │                         │                         │
      │── 1. Create Pay Session ──>                       │
      │   (POST /pay-session)   │                         │
      │<── 2. Dynamic VietQR ───│                         │
      │      (15 min TTL)       │                         │
      │                         │                         │
      │── 3. Scan & Authorize via Mobile Banking App ────>│
      │                                                   │── 4. Inter-bank Settlement
      │                         │<── 5. Asynchronous IPN ─│      (Napas 247 Switch)
      │                         │    (POST /webhooks/vietqr)
      │                         │                         │
      │                         ├── Check transactionCode in DB
      │                         ├── IF EXISTS: return { alreadyProcessed: true }
      │                         ├── ELSE: atomic payment record + update invoice
      │                         │
```

### 4.1 Idempotency Guard Implementation
To guarantee that duplicate webhook deliveries never double-credit an invoice:
1. `payment_transactions.transaction_code` is governed by a **UNIQUE constraint**.
2. Before modifying the invoice `paid_amount`, the service checks if `transaction_code` has already been recorded.
3. If duplicate, the service immediately acknowledges with HTTP 200 `{ "alreadyProcessed": true }` without mutating invoice balances.

### 4.2 Positive Consequences
- **Instant Resident Experience:** The resident scans the QR in their banking app; the exact remaining balance and invoice memo are auto-filled; the bill is marked `PAID` within seconds.
- **Zero Surcharge:** Building retains 100% of collected utility and management fees.
- **Audit Ledger:** Every payment creates an immutable audit row in `payment_transactions`.

### 4.3 Negative Consequences / Trade-offs
- The system must expose a secure public HTTPS webhook endpoint with IP-whitelisting or HMAC signature validation to protect against spoofed IPN payloads.

---

## 5. Pros and Cons of the Options

| Dimension | Option 1: Manual Transfer | Option 2: Gateway Aggregator | **Option 3: VietQR + IPN (Selected)** |
| :--- | :---: | :---: | :---: |
| **Transaction Fees** | 0% (Manual overhead) | 1.5% - 2.5% per bill | **0% (Direct Inter-Bank)** |
| **Reconciliation Speed** | 1 - 3 Days (Manual) | Instant | **Sub-second (Automated IPN)** |
| **User Input Friction** | High (manual typing) | Low | **Zero (Auto-filled QR Payload)** |
| **Idempotency Guard** | N/A (Manual human review) | Handled by provider | **Engineered at DB Layer** |

---

## 6. Links & References

- [VietQR National Standard (Napas 247 Specification)](https://vietqr.net)
- [Billing Service Implementation: create_vietqr_pay_session](../../backend/app/services/billing_service.py#L24)
- [Pytest Suite: test_process_vietqr_webhook_idempotency](../../backend/tests/test_billing_service.py#L48)
- [UI VietQR Modal Component: PaymentModal.tsx](../../frontend/src/components/domain/billing/PaymentModal.tsx)
