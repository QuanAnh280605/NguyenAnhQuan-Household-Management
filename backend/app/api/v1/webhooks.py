from fastapi import APIRouter
from backend.app.core.response import api_success
from backend.app.schemas.billing import VietQrIpnWebhookRequest
from backend.app.services.billing_service import BillingService

router = APIRouter()
service = BillingService()

@router.post("/vietqr", summary="Receive VietQR Napas 247 Instant Payment Notification (IPN)")
async def receive_vietqr_ipn(payload: VietQrIpnWebhookRequest):
    result = await service.process_vietqr_webhook(payload)
    return api_success(result)
