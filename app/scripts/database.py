import asyncpg
import os

DATABASE_URL = os.getenv("DATABASE_URL")

pool = None


async def init_db_pool():
    global pool

    pool = await asyncpg.create_pool(dsn=DATABASE_URL)


async def get_db_connection():
    return await pool.acquire()


async def fetch_api_key(api_key: str) -> str | None:
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """
            SELECT id
            FROM api_keys
            WHERE api_key = $1 AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
            """,
            api_key,
        )
        return str(row["id"]) if row else None
    finally:
        await pool.release(conn)
