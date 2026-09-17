import pytest
from backend.app.core.errors import NotFoundError, ValidationError
from backend.app.schemas.feedback import FeedbackCreate, FeedbackStatusUpdate
from backend.app.services.feedback_service import FeedbackService

@pytest.mark.asyncio
async def test_feedback_list_all():
    service = FeedbackService()
    feedbacks = await service.get_feedbacks()
    assert len(feedbacks) >= 1

@pytest.mark.asyncio
async def test_feedback_filter_by_status():
    service = FeedbackService()
    feedbacks = await service.get_feedbacks(status="OPEN")
    for fb in feedbacks:
        assert fb["status"] == "OPEN"

@pytest.mark.asyncio
async def test_feedback_create_success():
    service = FeedbackService()
    payload = FeedbackCreate(
        resident_id="r0000000-0000-0000-0000-000000000001",
        apartment_id="a0000000-0000-0000-0000-000000001205",
        title="Đèn hành lang bị chớp tắt liên tục",
        category="REPAIR",
        content="Bóng đèn LED chiếu sáng tại sảnh thang máy bị nhấp nháy cần thay thế gấp.",
        priority="MEDIUM",
    )
    created = await service.create_feedback(payload)
    assert created["id"] is not None
    assert created["title"] == payload.title
    assert created["status"] == "OPEN"

@pytest.mark.asyncio
async def test_feedback_create_invalid_category():
    service = FeedbackService()
    with pytest.raises(ValidationError):
        await service.create_feedback(
            FeedbackCreate(
                resident_id="r1",
                apartment_id="a1",
                title="Báo cáo sự cố kiểm tra",
                category="NON_EXISTENT_CAT",
                content="Nội dung mô tả chi tiết sự cố...",
                priority="MEDIUM",
            )
        )

@pytest.mark.asyncio
async def test_feedback_update_status_success():
    service = FeedbackService()
    feedbacks = await service.get_feedbacks()
    target_id = feedbacks[0]["id"]

    update_payload = FeedbackStatusUpdate(
        status="RESOLVED",
        message="Kỹ thuật viên đã kiểm tra và hoàn thành việc xử lý.",
        user_id="u0000000-0000-0000-0000-000000000003",
    )
    updated = await service.update_status(target_id, update_payload)
    assert updated["status"] == "RESOLVED"
