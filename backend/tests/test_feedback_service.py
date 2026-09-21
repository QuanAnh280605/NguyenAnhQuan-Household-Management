import pytest
from backend.app.schemas.feedback import FeedbackCreate, FeedbackStatusUpdate
from backend.app.services.feedback_service import FeedbackService

@pytest.mark.asyncio
async def test_feedback_list_all():
    service = FeedbackService()
    result = await service.get_feedbacks()
    assert result.is_success
    feedbacks = result.value
    assert len(feedbacks) >= 1

@pytest.mark.asyncio
async def test_feedback_filter_by_status():
    service = FeedbackService()
    result = await service.get_feedbacks(status="OPEN")
    assert result.is_success
    feedbacks = result.value
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
    result = await service.create_feedback(payload)
    assert result.is_success
    created = result.value
    assert created["id"] is not None
    assert created["title"] == payload.title
    assert created["status"] == "OPEN"

@pytest.mark.asyncio
async def test_feedback_create_invalid_category():
    service = FeedbackService()
    result = await service.create_feedback(
        FeedbackCreate(
            resident_id="r1",
            apartment_id="a1",
            title="Báo cáo sự cố kiểm tra",
            category="NON_EXISTENT_CAT",
            content="Nội dung mô tả chi tiết sự cố...",
            priority="MEDIUM",
        )
    )
    assert result.is_failure
    assert result.error.code == "INVALID_CATEGORY"
    assert "Invalid category" in result.error.message

@pytest.mark.asyncio
async def test_feedback_update_status_success():
    service = FeedbackService()
    list_res = await service.get_feedbacks()
    assert list_res.is_success
    feedbacks = list_res.value
    target_id = feedbacks[0]["id"]

    update_payload = FeedbackStatusUpdate(
        status="RESOLVED",
        message="Kỹ thuật viên đã kiểm tra và hoàn thành việc xử lý.",
        user_id="u0000000-0000-0000-0000-000000000003",
    )
    update_res = await service.update_status(target_id, update_payload)
    assert update_res.is_success
    updated = update_res.value
    assert updated["status"] == "RESOLVED"

