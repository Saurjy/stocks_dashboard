import asyncpg
import redis.asyncio as aioredis
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, date, timedelta
import os
from nse import NSE
from pathlib import Path
import requests


# -----------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------
POSTGRES_DSN = f"postgresql://postgres:{os.getenv('POSTGRESS_PASSWORD')}@{os.getenv('POSTGRES_HOST','localhost')}:5432/ist_db"
REDIS_URL = "redis://localhost:6380"
PROXIES = {"http_proxy":f"{os.getenv('PROXY')}",
           "https_proxy":f"{os.getenv('PROXY')}",
           "no_proxy":f"{os.getenv('PROXY')}"}
FETCH_COOLDOWN_TIME = 2 # seconds
BASE_URL = "https://www.nseindia.com"
API_URL = f"{BASE_URL}/api/NextApi/apiClient/GetQuoteApi"

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json,text/plain,*/*",
    "Referer": BASE_URL,
    "Origin": BASE_URL,
    "Connection": "keep-alive",
}


# Working directory
DIR = Path(__file__).parent

# NSE client
nse = NSE(download_folder=DIR, server=False)

# Companies to track
COMPANIES_LIST: list[str] = []

# Define date range for historical load
END_DATE = date.today() - timedelta(days=1)
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

async def load_companies():
    """
    Load company names from database into COMPANIES_LIST.
    """
    global COMPANIES_LIST

    if DB_POOL is None:
        raise RuntimeError("DB_POOL not initialized. Call init_connections() first.")

    query = """
        SELECT company,symbol 
        FROM user_requests 
        WHERE NOT is_checked
    """

    async with DB_POOL.acquire() as conn:
        rows = await conn.fetch(query)

    # Populate global list
    COMPANIES_LIST.clear()
    COMPANIES_LIST.extend(row["company"] for row in rows)
    COMPANIES_LIST.extend(row["symbol"] for row in rows)

    print(f"Loaded {len(COMPANIES_LIST)} companies")


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

class NSESession:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)
        self._init_cookies()

    def _init_cookies(self):
        # Mandatory cookie bootstrap
        self.session.get(BASE_URL, timeout=10)

    def get(self, url: str, params: dict, proxies: Optional[dict] = None):
        resp = self.session.get(url, params=params, timeout=15, proxies=proxies)
        resp.raise_for_status()
        return resp