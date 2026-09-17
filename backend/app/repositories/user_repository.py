from typing import Any, Dict, List, Optional
from backend.app.db.session import get_db_pool

# In-memory fallback for isolated testing / offline development
FALLBACK_USERS = [
    {
        "id": "u0000000-0000-0000-0000-000000000001",
        "username": "admin",
        "password_hash": "$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c",
        "role": "ADMIN",
        "full_name": "Quản Trị Viên Hệ Thống",
        "email": "admin@residenthub.vn",
        "phone": "0901000001",
        "resident_id": None,
        "is_active": True,
    },
    {
        "id": "u0000000-0000-0000-0000-000000000002",
        "username": "manager1",
        "password_hash": "$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c",
        "role": "MANAGER",
        "full_name": "Trần Văn Bình (Trưởng BQL)",
        "email": "binh.bql@residenthub.vn",
        "phone": "0901000002",
        "resident_id": None,
        "is_active": True,
    },
    {
        "id": "u0000000-0000-0000-0000-000000000003",
        "username": "tech1",
        "password_hash": "$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c",
        "role": "TECHNICIAN",
        "full_name": "Nguyễn Kỹ Thuật",
        "email": "tech.nguyen@residenthub.vn",
        "phone": "0901000003",
        "resident_id": None,
        "is_active": True,
    },
    {
        "id": "u0000000-0000-0000-0000-000000000004",
        "username": "resident1205",
        "password_hash": "$2b$12$e8YnJSmxP7G0n1sPzE9i0.XvN7WfP4i7B2F1O2C.J2qL3yZ4a5b6c",
        "role": "RESIDENT",
        "full_name": "Trần Hoàng Nam",
        "email": "nam.tran@email.com",
        "phone": "0912345678",
        "resident_id": "r0000000-0000-0000-0000-000000000001",
        "is_active": True,
    },
]

class UserRepository:
    async def find_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            for u in FALLBACK_USERS:
                if u["username"].lower() == username.lower():
                    return dict(u)
            return None

        query = "SELECT * FROM users WHERE username = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, username)
            return dict(row) if row else None

    async def find_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            for u in FALLBACK_USERS:
                if u["id"] == user_id:
                    return dict(u)
            return None

        query = "SELECT * FROM users WHERE id = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, user_id)
            return dict(row) if row else None
