from typing import Any, Dict, List, Optional
from backend.app.db.session import get_db_pool

class ParkingRepository:
    async def find_all_slots(
        self,
        floor: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return []

        query = """
            SELECT ps.*, v.id as vehicle_id, v.license_plate
            FROM parking_slots ps
            LEFT JOIN vehicles v ON ps.id = v.parking_slot_id
            WHERE 1=1
        """
        params = []
        idx = 1

        if floor and floor != "ALL":
            query += f" AND ps.floor = ${idx}"
            params.append(floor)
            idx += 1
        if status and status != "ALL":
            query += f" AND ps.status = ${idx}"
            params.append(status)
            idx += 1

        query += " ORDER BY ps.floor ASC, ps.slot_code ASC"
        async with pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def find_slot_by_id(self, slot_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = """
            SELECT ps.*, v.id as vehicle_id, v.license_plate
            FROM parking_slots ps
            LEFT JOIN vehicles v ON ps.id = v.parking_slot_id
            WHERE ps.id = $1
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, slot_id)
            return dict(row) if row else None

    async def find_slot_with_lock(self, conn, slot_id: str) -> Optional[Dict[str, Any]]:
        query = "SELECT * FROM parking_slots WHERE id = $1 FOR UPDATE"
        row = await conn.fetchrow(query, slot_id)
        return dict(row) if row else None

    async def allocate_slot(self, conn, slot_id: str, vehicle_id: str) -> None:
        await conn.execute("UPDATE parking_slots SET status = 'OCCUPIED' WHERE id = $1", slot_id)
        await conn.execute("UPDATE vehicles SET parking_slot_id = $1 WHERE id = $2", slot_id, vehicle_id)

    async def count_vehicles_by_apartment_and_type(self, apartment_id: str, vehicle_type: str) -> int:
        pool = await get_db_pool()
        if not pool:
            return 0

        query = """
            SELECT COUNT(*) as total
            FROM vehicles
            WHERE apartment_id = $1 AND vehicle_type = $2 AND status = 'ACTIVE'
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, apartment_id, vehicle_type)
            return int(row["total"]) if row else 0

    async def find_vehicle_by_id(self, vehicle_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None
        query = "SELECT * FROM vehicles WHERE id = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, vehicle_id)
            return dict(row) if row else None

    async def find_vehicle_by_plate(self, license_plate: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None
        query = "SELECT * FROM vehicles WHERE license_plate = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, license_plate)
            return dict(row) if row else None

    async def create_vehicle(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            INSERT INTO vehicles (apartment_id, resident_id, license_plate, vehicle_type, brand_model, color, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["apartment_id"],
                data["resident_id"],
                data["license_plate"],
                data["vehicle_type"],
                data.get("brand_model"),
                data.get("color"),
            )
            return dict(row)
