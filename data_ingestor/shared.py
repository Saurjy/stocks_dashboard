import asyncpg
import redis.asyncio as aioredis
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, date, timedelta
import os
from nse import NSE
from pathlib import Path

# -----------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------
POSTGRES_DSN = f"postgresql://postgres:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:5432/ist_db"
REDIS_URL = "redis://localhost:6380"

# Working directory
DIR = Path(__file__).parent

# NSE client
nse = NSE(download_folder=DIR, server=False)

# Companies to track
COMPANIES_LIST = ["Reliance Industries Limited"]

# Define date range for historical load
END_DATE = date.today()
START_DATE = END_DATE - timedelta(days=10 * 365) # Approximately 10 years


# -----------------------------------------------------------
# DATA MODEL (Pydantic)
# -----------------------------------------------------------
class TickData(BaseModel):
    time: datetime = datetime.now(timezone.utc)
    symbol: str
    close: float
    open: float
    high: float
    low: float
    volume: int
    exchange: str


# -----------------------------------------------------------
# GLOBAL CONNECTION POOLS
# -----------------------------------------------------------
DB_POOL: Optional[asyncpg.Pool] = None
REDIS_CLIENT: Optional[aioredis.Redis] = None


async def init_connections():
    """Initialize database and Redis connections."""
    global DB_POOL, REDIS_CLIENT
    DB_POOL = await asyncpg.create_pool(dsn=POSTGRES_DSN)
    REDIS_CLIENT = aioredis.from_url(REDIS_URL, decode_responses=True)
    print("Connected to TimescaleDB and Redis")


async def close_connections():
    """Close database and Redis connections."""
    global DB_POOL, REDIS_CLIENT
    if DB_POOL:
        await DB_POOL.close()
    if REDIS_CLIENT:
        await REDIS_CLIENT.close()
