"""
Tick Data Poller - Runs continuously to fetch and store tick data every minute.

Usage:
    python tick_poller.py

Schedule with systemd service or run in background:
    nohup python tick_poller.py &
"""

import asyncio
from datetime import datetime, timezone, timedelta

import shared
from shared import (
    TickData,
    nse,
    init_connections,
    close_connections,
)

# IST timezone offset
IST = timezone(timedelta(hours=5, minutes=30))

# Polling interval in seconds (1 minute)
POLL_INTERVAL = 60


# -----------------------------------------------------------
# DATABASE INSERT
# -----------------------------------------------------------
async def insert_into_postgres(data: TickData):
    sql = """
        INSERT INTO tick_data (time, symbol, close, volume, exchange, high, low, open)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    """

    async with shared.DB_POOL.acquire() as conn:
        await conn.execute(
            sql,
            data.time,
            data.symbol,
            data.close,
            data.volume,
            data.exchange,
            data.high,
            data.low,
            data.open
        )
        print(f"Tick Data Inserted for {data.symbol}")


# -----------------------------------------------------------
# PUBLISH TO REDIS
# -----------------------------------------------------------
async def publish_to_redis(data: TickData):
    channel = f"market_data:{data.symbol}"
    await shared.REDIS_CLIENT.publish(channel, data.json())


# -----------------------------------------------------------
# LOAD TICKER LIST FROM DATABASE
# -----------------------------------------------------------
async def load_ticker_list() -> list[str]:
    """Load all tracked symbols from the database."""
    sql = "SELECT symbol FROM company_symbols;"
    async with shared.DB_POOL.acquire() as conn:
        rows = await conn.fetch(sql)
        return [r["symbol"] for r in rows]


# -----------------------------------------------------------
# FETCH + PROCESS ONE TICKER
# -----------------------------------------------------------
async def fetch_and_process_data(ticker: str):
    """Fetch a tick from NSE using python-nse and push to Postgres + Redis."""
    try:
        loop = asyncio.get_running_loop()

        # Fetch quote (python-nse is synchronous)
        quote = await loop.run_in_executor(None, nse.equityQuote, ticker)

        if not quote:
            print(f"[WARN] No data for {ticker}")
            return

        # Parse time
        time = datetime.now(timezone.utc)
        if quote.get("date"):
            try:
                time = (
                    datetime.strptime(quote["date"], "%d-%b-%Y %H:%M:%S")
                    .replace(tzinfo=IST)
                    .astimezone(timezone.utc)
                )
            except ValueError:
                pass  # Use current time if parsing fails

        tick = TickData(
            time=time,
            symbol=ticker,
            close=quote.get("close"),
            volume=quote.get("volume") or 0,
            high=quote.get("high"),
            low=quote.get("low"),
            open=quote.get("open"),
            exchange="NSE"
        )

        # Store in DB + publish via Redis
        await asyncio.gather(
            insert_into_postgres(tick),
            publish_to_redis(tick)
        )

    except Exception as e:
        print(f"[ERROR] {ticker}: {e}")


# -----------------------------------------------------------
# RUNNING LOOP
# -----------------------------------------------------------
async def run_tick_poller():
    """Main polling loop that fetches tick data every minute."""
    await init_connections()

    print("Tick Poller Started")

    try:
        # Load ticker list from database
        ticker_list = await load_ticker_list()

        if not ticker_list:
            print("[WARN] No symbols found in database. Run company_initializer.py first.")
            return

        print(f"Polling {len(ticker_list)} symbols: {ticker_list}")

        # Main loop
        while True:
            print(f"\n[{datetime.now()}] Fetching tick data...")

            # Refresh ticker list periodically (in case new companies were added)
            ticker_list = await load_ticker_list()

            tasks = [fetch_and_process_data(t) for t in ticker_list]
            await asyncio.gather(*tasks)

            print(f"Sleeping for {POLL_INTERVAL} seconds...")
            await asyncio.sleep(POLL_INTERVAL)

    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        await close_connections()


# -----------------------------------------------------------
# MAIN ENTRY
# -----------------------------------------------------------
if __name__ == "__main__":
    asyncio.run(run_tick_poller())
