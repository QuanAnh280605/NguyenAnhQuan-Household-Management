from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.response import api_success
from backend.app.services.billing_service import BillingService

router = APIRouter()
service = BillingService()

@router.get("/invoices", summary="Query Monthly Invoices")
async def list_invoices(
    month: Optional[str] = Query(None, description="Billing month (e.g. 10/2025)"),
    status: Optional[str] = Query(None, description="Status (UNPAID, PAID, PARTIAL, OVERDUE)"),
):
    invoices = await service.get_invoices(month, status)
    return api_success(invoices)

@router.get("/invoices/{invoice_id}", summary="Get Invoice Details")
async def get_invoice(invoice_id: str):
    invoice = await service.get_invoice_by_id(invoice_id)
    return api_success(invoice)

@router.post("/invoices/{invoice_id}/pay-session", status_code=status.HTTP_201_CREATED, summary="Initiate Dynamic VietQR Payment Session")
async def create_pay_session(invoice_id: str):
    session = await service.create_vietqr_pay_session(invoice_id)
    return api_success(session.model_dump())
