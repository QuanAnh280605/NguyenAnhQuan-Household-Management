import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from backend.app.db.session import get_db_pool

FALLBACK_FEEDBACKS = [
    {
        "id": "fb000000-0000-0000-0000-000000000001",
        "resident_id": "r0000000-0000-0000-0000-000000000001",
        "apartment_id": "a0000000-0000-0000-0000-000000001205",
        "assigned_to": "u0000000-0000-0000-0000-000000000003",
        "title": "Hỏng vòi nước ban công thoát sàn",
        "category": "REPAIR",
        "content": "Vòi cấp nước máy giặt ngoài lô gia bị rò rỉ nước liên tục làm ẩm tường.",
        "priority": "MEDIUM",
        "status": "IN_PROGRESS",
        "created_at": datetime.now(timezone.utc),
        "resolved_at": None,
        "resident_name": "Trần Hoàng Nam",
        "room_number": "A-1205",
        "assigned_staff_name": "Nguyễn Kỹ Thuật",
        "updates": [
            {
                "id": "fbu00000-0000-0000-0000-000000000001",
                "feedback_id": "fb000000-0000-0000-0000-000000000001",
                "updated_by_user_id": "u0000000-0000-0000-0000-000000000002",
                "message": "BQL tiếp nhận yêu cầu và điều phối kỹ thuật viên phụ trách.",
                "previous_status": "OPEN",
                "new_status": "IN_PROGRESS",
                "created_at": datetime.now(timezone.utc),
            }
        ],
    },
    {
        "id": "fb000000-0000-0000-0000-000000000002",
        "resident_id": "r0000000-0000-0000-0000-000000000005",
        "apartment_id": "a0000000-0000-0000-0000-000000001001",
        "assigned_to": "u0000000-0000-0000-0000-000000000003",
        "title": "Thang máy tháp A số 03 rung giật khi qua tầng 15",
        "category": "SECURITY",
        "content": "Thang máy số 3 có tiếng kêu rít cơ khí và giật mạnh khi di chuyển xuống tầng 15.",
        "priority": "URGENT",
        "status": "RESOLVED",
        "created_at": datetime.now(timezone.utc),
        "resolved_at": datetime.now(timezone.utc),
        "resident_name": "Nguyễn Văn An",
        "room_number": "A-1001",
        "assigned_staff_name": "Nguyễn Kỹ Thuật",
        "updates": [],
    },
    {
        "id": "fb000000-0000-0000-0000-000000000003",
        "resident_id": "r0000000-0000-0000-0000-000000000004",
        "apartment_id": "a0000000-0000-0000-0000-000000001206",
        "assigned_to": None,
        "title": "Vệ sinh sảnh hành lang tầng 12",
        "category": "CLEANING",
        "content": "Hành lang tầng 12 có vết bẩn sau khi vận chuyển đồ đạc cuối tuần qua.",
        "priority": "LOW",
        "status": "OPEN",
        "created_at": datetime.now(timezone.utc),
        "resolved_at": None,
        "resident_name": "Đặng Quốc Huy",
        "room_number": "A-1206",
        "assigned_staff_name": None,
        "updates": [],
    },
]

class FeedbackRepository:
    def __init__(self):
        self._memory_feedbacks = list(FALLBACK_FEEDBACKS)

    async def find_all(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            results = self._memory_feedbacks
            if status and status != "ALL":
                results = [f for f in results if f["status"] == status]
            if category and category != "ALL":
                results = [f for f in results if f["category"] == category]
            if search:
                s = search.lower()
                results = [
                    f for f in results
                    if s in f["title"].lower() or s in f.get("room_number", "").lower()
                ]
            return results

        query = """
            SELECT fb.*, r.full_name as resident_name, a.room_number, u.full_name as assigned_staff_name
            FROM feedbacks fb
            JOIN residents r ON fb.resident_id = r.id
            JOIN apartments a ON fb.apartment_id = a.id
            LEFT JOIN users u ON fb.assigned_to = u.id
            WHERE 1=1
        """
        params = []
        idx = 1
        if status and status != "ALL":
            query += f" AND fb.status = ${idx}"
            params.append(status)
            idx += 1
        if category and category != "ALL":
            query += f" AND fb.category = ${idx}"
            params.append(category)
            idx += 1
        if search:
            query += f" AND (fb.title ILIKE ${idx} OR a.room_number ILIKE ${idx})"
            params.append(f"%{search}%")
            idx += 1

        query += " ORDER BY fb.created_at DESC"
        async with pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def find_by_id(self, feedback_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            for f in self._memory_feedbacks:
                if f["id"] == feedback_id:
                    return dict(f)
            return None

        query = """
            SELECT fb.*, r.full_name as resident_name, a.room_number, u.full_name as assigned_staff_name
            FROM feedbacks fb
            JOIN residents r ON fb.resident_id = r.id
            JOIN apartments a ON fb.apartment_id = a.id
            LEFT JOIN users u ON fb.assigned_to = u.id
            WHERE fb.id = $1
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, feedback_id)
            if not row:
                return None
            data = dict(row)
            # fetch updates
            log_query = "SELECT * FROM feedback_updates WHERE feedback_id = $1 ORDER BY created_at ASC"
            log_rows = await conn.fetch(log_query, feedback_id)
            data["updates"] = [dict(r) for r in log_rows]
            return data

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        now = datetime.now(timezone.utc)
        if not pool:
            new_id = f"fb-{str(uuid.uuid4())[:8]}"
            record = {
                "id": new_id,
                "resident_id": data["resident_id"],
                "apartment_id": data["apartment_id"],
                "assigned_to": None,
                "title": data["title"],
                "category": data.get("category", "OTHER"),
                "content": data["content"],
                "priority": data.get("priority", "MEDIUM"),
                "status": "OPEN",
                "created_at": now,
                "resolved_at": None,
                "resident_name": "Cư Dân",
                "room_number": "N/A",
                "assigned_staff_name": None,
                "updates": [],
            }
            self._memory_feedbacks.insert(0, record)
            return record

        query = """
            INSERT INTO feedbacks (resident_id, apartment_id, title, category, content, priority, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'OPEN')
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["resident_id"],
                data["apartment_id"],
                data["title"],
                data.get("category", "OTHER"),
                data["content"],
                data.get("priority", "MEDIUM"),
            )
            return dict(row)

    async def update_status(
        self,
        feedback_id: str,
        new_status: str,
        message: str,
        user_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        now = datetime.now(timezone.utc)
        if not pool:
            for f in self._memory_feedbacks:
                if f["id"] == feedback_id:
                    prev_status = f["status"]
                    f["status"] = new_status
                    if new_status in ["RESOLVED", "CLOSED"]:
                        f["resolved_at"] = now
                    update_entry = {
                        "id": f"fbu-{str(uuid.uuid4())[:8]}",
                        "feedback_id": feedback_id,
                        "updated_by_user_id": user_id or "system",
                        "message": message,
                        "previous_status": prev_status,
                        "new_status": new_status,
                        "created_at": now,
                    }
                    f.setdefault("updates", []).append(update_entry)
                    return dict(f)
            return None

        async with pool.acquire() as conn:
            async with conn.transaction():
                prev_row = await conn.fetchrow("SELECT status FROM feedbacks WHERE id = $1", feedback_id)
                if not prev_row:
                    return None
                prev_status = prev_row["status"]

                resolved_at = now if new_status in ["RESOLVED", "CLOSED"] else None
                update_query = """
                    UPDATE feedbacks 
                    SET status = $2, resolved_at = COALESCE($3, resolved_at), updated_at = $4
                    WHERE id = $1
                    RETURNING *
                """
                row = await conn.fetchrow(update_query, feedback_id, new_status, resolved_at, now)
                
                # Insert log
                if user_id:
                    log_query = """
                        INSERT INTO feedback_updates (feedback_id, updated_by_user_id, message, previous_status, new_status)
                        VALUES ($1, $2, $3, $4, $5)
                    """
                    await conn.execute(log_query, feedback_id, user_id, message, prev_status, new_status)

                return dict(row)
