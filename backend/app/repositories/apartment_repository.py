from typing import Any, Dict, List, Optional
from backend.app.db.session import get_db_pool

class ApartmentRepository:
    async def find_all(
        self,
        building: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return []

        query = """
            SELECT a.*, b.code as building_code, b.name as building_name,
                   o.full_name as owner_name, o.phone as owner_phone, o.citizen_id as owner_cccd
            FROM apartments a
            JOIN buildings b ON a.building_id = b.id
            LEFT JOIN apartment_owners ao ON a.id = ao.apartment_id AND ao.is_current = TRUE
            LEFT JOIN owners o ON ao.owner_id = o.id
            WHERE 1=1
        """
        params = []
        idx = 1

        if building and building != "ALL":
            query += f" AND b.code = ${idx}"
            params.append(building)
            idx += 1
        if status and status != "ALL":
            query += f" AND a.status = ${idx}"
            params.append(status)
            idx += 1
        if search:
            query += f" AND (a.room_number ILIKE ${idx} OR o.full_name ILIKE ${idx} OR o.phone ILIKE ${idx})"
            params.append(f"%{search}%")
            idx += 1

        query += " ORDER BY a.floor ASC, a.room_number ASC"
        async with pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def find_by_id(self, apartment_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = """
            SELECT a.*, b.code as building_code, b.name as building_name,
                   o.full_name as owner_name, o.phone as owner_phone, o.citizen_id as owner_cccd
            FROM apartments a
            JOIN buildings b ON a.building_id = b.id
            LEFT JOIN apartment_owners ao ON a.id = ao.apartment_id AND ao.is_current = TRUE
            LEFT JOIN owners o ON ao.owner_id = o.id
            WHERE a.id = $1
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, apartment_id)
            return dict(row) if row else None

    async def find_by_room_number(self, building_id: str, room_number: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = "SELECT * FROM apartments WHERE building_id = $1 AND room_number = $2"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, building_id, room_number)
            return dict(row) if row else None

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            INSERT INTO apartments (building_id, room_number, floor, area, bedroom_count, bathroom_count, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        """
        status = data.get("status", "EMPTY")
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["building_id"],
                data["room_number"],
                data["floor"],
                data["area"],
                data["bedroom_count"],
                data["bathroom_count"],
                status,
            )
            return dict(row)

    async def find_owner_by_citizen_id(self, citizen_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None
        query = "SELECT * FROM owners WHERE citizen_id = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, citizen_id)
            return dict(row) if row else None

    async def create_owner(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            INSERT INTO owners (full_name, citizen_id, phone, email, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["full_name"],
                data["citizen_id"],
                data["phone"],
                data.get("email"),
                data.get("address"),
            )
            return dict(row)

    async def link_owner(self, apartment_id: str, owner_id: str, start_date: str) -> None:
        pool = await get_db_pool()
        query = """
            INSERT INTO apartment_owners (apartment_id, owner_id, start_date, is_current)
            VALUES ($1, $2, $3, TRUE)
        """
        async with pool.acquire() as conn:
            await conn.execute(query, apartment_id, owner_id, start_date)

    async def archive_previous_owners(self, apartment_id: str, end_date: str) -> None:
        pool = await get_db_pool()
        query = """
            UPDATE apartment_owners
            SET is_current = FALSE, end_date = $2
            WHERE apartment_id = $1 AND is_current = TRUE
        """
        async with pool.acquire() as conn:
            await conn.execute(query, apartment_id, end_date)
