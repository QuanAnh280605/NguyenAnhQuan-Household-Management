from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.core.result import handle_result
from backend.app.schemas.billing import BillingBatchSagaRequest
from backend.app.services.billing_service import BillingService

router = APIRouter()
service = BillingService()

@router.get("/invoices", summary="Query Monthly Invoices")
async def list_invoices(
    month: Optional[str] = Query(None, description="Billing month (e.g. 10/2025)"),
    status: Optional[str] = Query(None, description="Status (UNPAID, PAID, PARTIAL, OVERDUE)"),
):
    result = await service.get_invoices(month, status)
    return handle_result(result)

@router.get("/invoices/{invoice_id}", summary="Get Invoice Details")
async def get_invoice(invoice_id: str):
    result = await service.get_invoice_by_id(invoice_id)
    return handle_result(result)

@router.post("/invoices/{invoice_id}/pay-session", status_code=status.HTTP_201_CREATED, summary="Initiate Dynamic VietQR Payment Session")
async def create_pay_session(invoice_id: str):
    result = await service.create_vietqr_pay_session(invoice_id)
    return handle_result(result)

@router.post("/invoices/batch-saga", status_code=status.HTTP_200_OK, summary="Execute Month-End Billing Batch Saga Workflow")
async def run_batch_billing_saga(payload: BillingBatchSagaRequest):
    result = await service.run_month_end_billing_saga(
        month=payload.month,
        simulate_failure_step=payload.simulateFailureStep,
        dry_run=payload.dryRun or False,
    )
    return handle_result(result)
