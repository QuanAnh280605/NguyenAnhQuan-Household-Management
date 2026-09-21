from typing import List, Optional
from pydantic import BaseModel, Field

class VietQrIpnWebhookRequest(BaseModel):
    transactionCode: str = Field(..., min_length=1)
    invoiceCode: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    paidAt: Optional[str] = None
    accountNumber: Optional[str] = None
    note: Optional[str] = None

class VietQrSessionOut(BaseModel):
    invoiceId: str
    invoiceCode: str
    amount: float
    qrRawData: str
    qrCodeUrl: str
    accountNumber: str
    bankCode: str
    accountName: str
    expiresInSeconds: int = 900

class InvoiceItemOut(BaseModel):
    id: str
    item_name: str
    quantity: float
    unit_price: float
    amount: float

class InvoiceOut(BaseModel):
    id: str
    apartment_id: str
    invoice_code: str
    billing_month: str
    total_amount: float
    paid_amount: float
    due_date: str
    status: str
    room_number: Optional[str] = None
    building_code: Optional[str] = None
    items: Optional[List[InvoiceItemOut]] = None

class BillingBatchSagaRequest(BaseModel):
    month: str = Field(..., description="Billing month, e.g. '10/2025'")
    simulateFailureStep: Optional[str] = Field(
        None,
        description="Step name to simulate failure for testing compensation (e.g. 'IssueVietQrSessionsStep')"
    )
    dryRun: Optional[bool] = Field(False, description="Dry-run execution without persistent changes")

class SagaJournalItemOut(BaseModel):
    stepName: str
    status: str
    startedAt: str
    completedAt: Optional[str] = None
    error: Optional[str] = None

class BillingBatchSagaResponse(BaseModel):
    sagaId: str
    workflowName: str
    status: str
    month: str
    totalInvoicesGenerated: int
    totalAmountVnd: float
    journal: List[SagaJournalItemOut]
