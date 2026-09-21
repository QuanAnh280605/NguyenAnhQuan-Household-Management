import urllib.parse
from typing import Any, Dict, List, Optional
from backend.app.core.result import (
    ConflictDomainError,
    DomainError,
    Failure,
    ResourceNotFoundError,
    Result,
    Success,
)
from backend.app.repositories.billing_repository import BillingRepository
from backend.app.schemas.billing import VietQrIpnWebhookRequest, VietQrSessionOut

class BillingService:
    def __init__(self, repo: Optional[BillingRepository] = None):
        self.repo = repo or BillingRepository()

    async def get_invoices(
        self,
        month: Optional[str] = None,
        status: Optional[str] = None
    ) -> Result[List[Dict[str, Any]], DomainError]:
        invoices = await self.repo.find_all_invoices(month, status)
        return Success(invoices)

    async def get_invoice_by_id(self, invoice_id: str) -> Result[Dict[str, Any], DomainError]:
        invoice = await self.repo.find_invoice_by_id(invoice_id)
        if not invoice:
            return Failure(ResourceNotFoundError(f"Invoice with id '{invoice_id}' not found"))
        return Success(invoice)

    async def create_vietqr_pay_session(self, invoice_id: str) -> Result[VietQrSessionOut, DomainError]:
        inv_res = await self.get_invoice_by_id(invoice_id)
        if inv_res.is_failure:
            return inv_res
        invoice = inv_res.value

        if invoice.get("status") == "PAID":
            return Failure(ConflictDomainError("INVOICE_ALREADY_PAID", f"Invoice '{invoice.get('invoice_code')}' has already been fully paid"))

        remaining = float(invoice.get("total_amount", 0)) - float(invoice.get("paid_amount", 0))
        if remaining <= 0:
            return Failure(ConflictDomainError("ZERO_BALANCE", "Remaining invoice balance is 0 VND"))

        bank_code = "970422" # MBBank BIN
        account_number = "0987654321"
        account_name = "BAN QUAN LY CHUNG CU RESIDENTHUB"
        memo = f"RESIDENTHUB {invoice.get('invoice_code')}"
        encoded_memo = urllib.parse.quote(memo)
        encoded_name = urllib.parse.quote(account_name)

        qr_code_url = f"https://img.vietqr.io/image/{bank_code}-{account_number}-compact2.png?amount={int(remaining)}&addInfo={encoded_memo}&accountName={encoded_name}"
        qr_raw_data = f"00020101021238540010A00000072701240006{bank_code}0110{account_number}5303704540{int(remaining)}5802VN62{len(memo):02d}{memo}6304"

        return Success(VietQrSessionOut(
            invoiceId=invoice["id"],
            invoiceCode=invoice["invoice_code"],
            amount=remaining,
            qrRawData=qr_raw_data,
            qrCodeUrl=qr_code_url,
            accountNumber=account_number,
            bankCode=bank_code,
            accountName=account_name,
            expiresInSeconds=900,
        ))

    async def process_vietqr_webhook(self, payload: VietQrIpnWebhookRequest) -> Result[Dict[str, Any], DomainError]:
        # 1. Idempotency Guard (US-BIL-04)
        existing_tx = await self.repo.find_transaction_by_code(payload.transactionCode)
        if existing_tx:
            return Success({
                "alreadyProcessed": True,
                "transaction": existing_tx,
            })

        # 2. Check Invoice
        invoice = await self.repo.find_invoice_by_code(payload.invoiceCode)
        if not invoice:
            return Failure(ResourceNotFoundError(f"Invoice with code '{payload.invoiceCode}' was not found in billing ledger"))

        # 3. Record transaction and update invoice
        transaction = await self.repo.record_payment_transaction({
            "invoice_id": invoice["id"],
            "amount": payload.amount,
            "payment_method": "VIETQR_NAPAS247",
            "transaction_code": payload.transactionCode,
            "note": payload.note or f"IPN Auto-Reconciled: {payload.invoiceCode}",
            "paid_at": payload.paidAt or "CURRENT_TIMESTAMP",
        })

        updated_invoice = await self.repo.update_invoice_paid_amount(invoice["id"], payload.amount)

        return Success({
            "alreadyProcessed": False,
            "transaction": transaction,
            "invoice": updated_invoice,
        })

    def calculate_tiered_water(self, m3: float) -> Dict[str, Any]:
        tiers = [
            {"max": 10, "rate": 6000, "label": "Bậc 1 (0 - 10 m³)"},
            {"max": 20, "rate": 7500, "label": "Bậc 2 (10 - 20 m³)"},
            {"max": 30, "rate": 9000, "label": "Bậc 3 (20 - 30 m³)"},
            {"max": float("inf"), "rate": 16000, "label": "Bậc 4 (> 30 m³)"},
        ]
        remaining = m3
        total = 0.0
        breakdown = []
        prev_max = 0

        for tier in tiers:
            if remaining <= 0:
                break
            tier_capacity = tier["max"] - prev_max
            units = min(remaining, tier_capacity)
            cost = units * tier["rate"]
            breakdown.append({
                "tier": tier["label"],
                "units": units,
                "rate": tier["rate"],
                "cost": cost,
            })
            total += cost
            remaining -= units
            prev_max = tier["max"]

        return {"total": total, "breakdown": breakdown}

    def calculate_tiered_electricity(self, kwh: float) -> Dict[str, Any]:
        tiers = [
            {"max": 50, "rate": 1806, "label": "Bậc 1 (0 - 50 kWh)"},
            {"max": 100, "rate": 1866, "label": "Bậc 2 (51 - 100 kWh)"},
            {"max": 200, "rate": 2167, "label": "Bậc 3 (101 - 200 kWh)"},
            {"max": 300, "rate": 2729, "label": "Bậc 4 (201 - 300 kWh)"},
            {"max": 400, "rate": 3050, "label": "Bậc 5 (301 - 400 kWh)"},
            {"max": float("inf"), "rate": 3151, "label": "Bậc 6 (> 400 kWh)"},
        ]
        remaining = kwh
        total = 0.0
        breakdown = []
        prev_max = 0

        for tier in tiers:
            if remaining <= 0:
                break
            tier_capacity = tier["max"] - prev_max
            units = min(remaining, tier_capacity)
            cost = units * tier["rate"]
            breakdown.append({
                "tier": tier["label"],
                "units": units,
                "rate": tier["rate"],
                "cost": cost,
            })
            total += cost
            remaining -= units
            prev_max = tier["max"]

        return {"total": total, "breakdown": breakdown}
