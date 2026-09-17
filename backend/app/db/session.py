import os
import asyncpg
from typing import Optional
from backend.app.core.config import settings

_pool: Optional[asyncpg.Pool] = None

async def init_db_pool() -> Optional[asyncpg.Pool]:
    global _pool
    if _pool is None:
        # Bypass network attempt during tests or when explicit mock is requested
        if os.getenv("PYTEST_CURRENT_TEST") or os.getenv("TESTING") == "true" or settings.ENVIRONMENT == "test":
            return None

        try:
            _pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=2,
                max_size=20,
                command_timeout=5,
            )
        except Exception as e:
            print(f"[AsyncPG Pool] Warning: Could not connect to PostgreSQL ({e}). Operating in memory/mock fallback mode.")
    return _pool

async def close_db_pool() -> None:
    global _pool
    if _pool:
        await _pool.close()
        _pool = None

async def get_db_pool() -> Optional[asyncpg.Pool]:
    global _pool
    if _pool is None:
        await init_db_pool()
    return _pool
