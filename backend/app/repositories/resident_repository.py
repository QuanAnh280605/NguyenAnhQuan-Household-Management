from typing import Any, Dict, List, Optional
from backend.app.db.session import get_db_pool

class ResidentRepository:
    async def find_all(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return []

        query = """
            SELECT r.*, hm.household_id, h.household_code, h.apartment_id, a.room_number,
                   hm.relationship_to_head, hm.is_head
            FROM residents r
            LEFT JOIN household_members hm ON r.id = hm.resident_id
            LEFT JOIN households h ON hm.household_id = h.id
            LEFT JOIN apartments a ON h.apartment_id = a.id
            WHERE 1=1
        """
        params = []
        idx = 1

        if status and status != "ALL":
            query += f" AND r.resident_status = ${idx}"
            params.append(status)
            idx += 1
        if search:
            query += f" AND (r.full_name ILIKE ${idx} OR r.citizen_id ILIKE ${idx} OR r.phone ILIKE ${idx} OR a.room_number ILIKE ${idx})"
            params.append(f"%{search}%")
            idx += 1

        query += " ORDER BY r.created_at DESC"
        async with pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def find_by_id(self, resident_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = """
            SELECT r.*, hm.household_id, h.household_code, h.apartment_id, a.room_number,
                   hm.relationship_to_head, hm.is_head
            FROM residents r
            LEFT JOIN household_members hm ON r.id = hm.resident_id
            LEFT JOIN households h ON hm.household_id = h.id
            LEFT JOIN apartments a ON h.apartment_id = a.id
            WHERE r.id = $1
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, resident_id)
            return dict(row) if row else None

    async def find_by_citizen_id(self, citizen_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = "SELECT * FROM residents WHERE citizen_id = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, citizen_id)
            return dict(row) if row else None

    async def find_household_by_id(self, household_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = "SELECT * FROM households WHERE id = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, household_id)
            return dict(row) if row else None

    async def create_resident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            INSERT INTO residents (full_name, citizen_id, date_of_birth, gender, phone, email, hometown, resident_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["full_name"],
                data["citizen_id"],
                data["date_of_birth"],
                data["gender"],
                data["phone"],
                data.get("email"),
                data.get("hometown"),
                data.get("resident_status", "PERMANENT"),
            )
            return dict(row)

    async def add_member_to_household(self, household_id: str, resident_id: str, relationship: str, is_head: bool) -> None:
        pool = await get_db_pool()
        query = """
            INSERT INTO household_members (household_id, resident_id, relationship_to_head, is_head)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (household_id, resident_id) DO NOTHING
        """
        async with pool.acquire() as conn:
            await conn.execute(query, household_id, resident_id, relationship, is_head)

    async def create_stay_record(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            INSERT INTO residence_records (resident_id, apartment_id, record_type, start_date, end_date, reason, police_verified_code, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["resident_id"],
                data["apartment_id"],
                data["record_type"],
                data["start_date"],
                data.get("end_date"),
                data["reason"],
                data.get("police_verified_code"),
            )
            return dict(row)
