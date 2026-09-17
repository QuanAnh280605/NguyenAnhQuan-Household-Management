from fastapi import APIRouter
from backend.app.api.v1 import apartments, auth, billing, feedbacks, parking, residents, webhooks

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(apartments.router, prefix="/apartments", tags=["Apartments"])
api_router.include_router(residents.router, prefix="/residents", tags=["Residents & Households"])
api_router.include_router(parking.router, prefix="/parking", tags=["Vehicles & Parking"])
api_router.include_router(billing.router, prefix="/billing", tags=["Billing & Utility Invoices"])
api_router.include_router(feedbacks.router, prefix="/feedbacks", tags=["Feedbacks & Maintenance SLA"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["External Webhooks"])

