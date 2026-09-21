import pytest
from unittest.mock import AsyncMock
from backend.app.core.errors import ConflictError, NotFoundError
from backend.app.repositories.billing_repository import BillingRepository
from backend.app.schemas.billing import VietQrIpnWebhookRequest
from backend.app.services.billing_service import BillingService

@pytest.fixture
def mock_repo():
    repo = AsyncMock(spec=BillingRepository)
    return repo

@pytest.fixture
def billing_service(mock_repo):
    return BillingService(repo=mock_repo)

def test_tiered_water_calculation(billing_service):
    # 25 m3 = (10 * 6000) + (10 * 7500) + (5 * 9000) = 60,000 + 75,000 + 45,000 = 180,000 VND
    result = billing_service.calculate_tiered_water(25)
    assert result["total"] == 180000
    assert len(result["breakdown"]) == 3
    assert result["breakdown"][0]["cost"] == 60000
    assert result["breakdown"][1]["cost"] == 75000
    assert result["breakdown"][2]["cost"] == 45000

def test_tiered_electricity_calculation(billing_service):
    # 120 kWh = (50 * 1806) + (50 * 1866) + (20 * 2167) = 90,300 + 93,300 + 43,340 = 226,940 VND
    result = billing_service.calculate_tiered_electricity(120)
    assert result["total"] == 226940
    assert len(result["breakdown"]) == 3
    assert result["breakdown"][0]["units"] == 50
    assert result["breakdown"][1]["units"] == 50
    assert result["breakdown"][2]["units"] == 20

@pytest.mark.asyncio
async def test_create_vietqr_pay_session_success(billing_service, mock_repo):
    sample_invoice = {
        "id": "inv-uuid-1",
        "invoice_code": "INV-202510-1205",
        "total_amount": 1500000,
        "paid_amount": 0,
        "status": "UNPAID",
    }
    mock_repo.find_invoice_by_id.return_value = sample_invoice

    result = await billing_service.create_vietqr_pay_session("inv-uuid-1")
    assert result.is_success
    session = result.value
    assert session.invoiceId == "inv-uuid-1"
    assert session.amount == 1500000
    assert "amount=1500000" in session.qrCodeUrl
    assert "RESIDENTHUB" in session.qrCodeUrl
    assert session.expiresInSeconds == 900

@pytest.mark.asyncio
async def test_create_vietqr_pay_session_already_paid(billing_service, mock_repo):
    mock_repo.find_invoice_by_id.return_value = {
        "id": "inv-uuid-1",
        "invoice_code": "INV-202510-1205",
        "total_amount": 1500000,
        "paid_amount": 1500000,
        "status": "PAID",
    }
    result = await billing_service.create_vietqr_pay_session("inv-uuid-1")
    assert result.is_failure
    assert result.error.code == "INVOICE_ALREADY_PAID"
    assert "already been fully paid" in result.error.message

@pytest.mark.asyncio
async def test_process_vietqr_webhook_idempotency(billing_service, mock_repo):
    existing_tx = {
        "id": "tx-1",
        "transaction_code": "TXN-DUPLICATE",
        "amount": 1500000,
    }
    mock_repo.find_transaction_by_code.return_value = existing_tx

    payload = VietQrIpnWebhookRequest(
        transactionCode="TXN-DUPLICATE",
        invoiceCode="INV-202510-1205",
        amount=1500000,
    )
    result = await billing_service.process_vietqr_webhook(payload)
    assert result.is_success
    data = result.value
    assert data["alreadyProcessed"] is True
    mock_repo.record_payment_transaction.assert_not_called()
    mock_repo.update_invoice_paid_amount.assert_not_called()

@pytest.mark.asyncio
async def test_process_vietqr_webhook_success(billing_service, mock_repo):
    mock_repo.find_transaction_by_code.return_value = None
    mock_repo.find_invoice_by_code.return_value = {
        "id": "inv-uuid-1",
        "invoice_code": "INV-202510-1205",
        "total_amount": 1500000,
        "paid_amount": 0,
    }
    mock_repo.record_payment_transaction.return_value = {"id": "tx-new", "amount": 1500000}
    mock_repo.update_invoice_paid_amount.return_value = {"id": "inv-uuid-1", "status": "PAID"}

    payload = VietQrIpnWebhookRequest(
        transactionCode="TXN-NEW",
        invoiceCode="INV-202510-1205",
        amount=1500000,
    )
    result = await billing_service.process_vietqr_webhook(payload)
    assert result.is_success
    data = result.value
    assert data["alreadyProcessed"] is False
    assert data["invoice"]["status"] == "PAID"
    mock_repo.record_payment_transaction.assert_called_once()

