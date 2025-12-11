"""
Historical Tick Data Loader - Loads historical stock data (10 years) into the database.

Usage:
    python tick_historical.py                    # Load all symbols from database
    python tick_historical.py --symbol RELIANCE  # Load specific symbol
    python tick_historical.py --days 365         # Load specific number of days

This should be run once per symbol to backfill historical data.
"""

import asyncio
from datetime import datetime, timezone, timedelta, date
from typing import List, Dict
import pandas as pd

import shared
from shared import (
    TickData,
    nse,
    init_connections,
    close_connections,
    START_DATE,
    END_DATE
)

# IST timezone offset
IST = timezone(timedelta(hours=5, minutes=30))


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
# BULK INSERT HISTORICAL DATA
# -----------------------------------------------------------
async def insert_historical_batch_into_postgres(data: List[Dict]):
    """
    Bulk insert historical data using PostgreSQL COPY command for performance.

    Args:
        data: List of dictionaries containing tick data
    """
    if not data:
        print("[WARN] No data to insert")
        return

    print(f"[DB] Bulk inserting {len(data)} historical records...")

    # Use COPY command for bulk insert (much faster than individual INSERTs)
    async with shared.DB_POOL.acquire() as conn:
        # Prepare data for COPY
        records = [
            (
                item['time'],
                item['symbol'],
                item['close'],
                item['volume'],
                item['exchange'],
                item['high'],
                item['low'],
                item['open']
            )
            for item in data
        ]

        # Use COPY for bulk insert
        await conn.copy_records_to_table(
            'tick_data',
            records=records,
            columns=['time', 'symbol', 'close', 'volume', 'exchange', 'high', 'low', 'open']
        )

    print(f"[SUCCESS] Inserted {len(data)} records")


# -----------------------------------------------------------
# LOAD HISTORICAL DATA FOR A TICKER
# -----------------------------------------------------------
async def load_historical_data(ticker: str, start_date: date = None, end_date: date = None):
    """
    Fetches historical data for a ticker and inserts it into the database.

    Args:
        ticker: Stock symbol (e.g., "RELIANCE")
        start_date: Start date for historical data (default: 10 years ago)
        end_date: End date for historical data (default: today)
    """
    start_date = start_date or START_DATE
    end_date = end_date or END_DATE

    print(f"\n[INFO] Starting HISTORICAL load for {ticker}")
    print(f"[INFO] Date range: {start_date} to {end_date}")

    loop = asyncio.get_running_loop()

    try:
        # Check if historical data already loaded by checking the earliest record
        async with shared.DB_POOL.acquire() as conn:
            earliest_record = await conn.fetchval(
                "SELECT MIN(time) FROM tick_data WHERE symbol = $1",
                ticker
            )

            if earliest_record:
                earliest_date = earliest_record.date()
                # If we have data going back close to our start date, skip
                # Allow 7 days tolerance
                if earliest_date <= start_date + timedelta(days=7):
                    print(f"[INFO] Historical data already exists for {ticker} (earliest: {earliest_date}). Skipping...")
                    return
                else:
                    print(f"[INFO] Found existing data from {earliest_date}, but will backfill to {start_date}")

        # Fetch historical data using NSE client (runs in executor since it's synchronous)
        print(f"[INFO] Fetching historical data from NSE...")
        historical_data = await loop.run_in_executor(
            None,
            nse.fetch_equity_historical_data,
            ticker,
            start_date,
            end_date,
            ["EQ"]
        )

        if not historical_data or len(historical_data) == 0:
            print(f"[WARN] No historical data retrieved for {ticker}")
            print(f"[INFO] Creating placeholder records to mark as attempted...")

            # Create placeholder records for each day in the range to avoid retrying
            placeholder_batch = []
            current_date = start_date
            while current_date <= end_date:
                placeholder_batch.append({
                    'time': datetime.combine(current_date, datetime.min.time()).replace(tzinfo=timezone.utc),
                    'symbol': ticker,
                    'open': 0.0,
                    'high': 0.0,
                    'low': 0.0,
                    'close': 0.0,
                    'volume': 0,
                    'exchange': 'NSE'
                })
                current_date += timedelta(days=1)

            await insert_historical_batch_into_postgres(placeholder_batch)
            print(f"[INFO] Inserted {len(placeholder_batch)} placeholder records for {ticker}")
            return

        print(f"[INFO] Fetched {len(historical_data)} historical bars for {ticker}")

        # Process data into the format expected by our database
        processed_batch = []

        for item in historical_data:
            try:
                # Parse the date from NSE format (typically "DD-MMM-YYYY")
                date_str = item.get('CH_TIMESTAMP') or item.get('date') or item.get('DATE')

                if not date_str:
                    continue

                # Try different date formats
                tick_time = None
                for date_format in ["%d-%b-%Y", "%d-%m-%Y", "%Y-%m-%d"]:
                    try:
                        tick_time = datetime.strptime(str(date_str), date_format).replace(tzinfo=IST).astimezone(timezone.utc)
                        break
                    except ValueError:
                        continue

                if not tick_time:
                    print(f"[WARN] Could not parse date: {date_str}")
                    continue

                # Extract OHLCV data
                processed_batch.append({
                    'time': tick_time,
                    'symbol': ticker,
                    'open': float(item.get('CH_OPENING_PRICE') or item.get('open') or item.get('OPEN') or 0),
                    'high': float(item.get('CH_TRADE_HIGH_PRICE') or item.get('high') or item.get('HIGH') or 0),
                    'low': float(item.get('CH_TRADE_LOW_PRICE') or item.get('low') or item.get('LOW') or 0),
                    'close': float(item.get('CH_CLOSING_PRICE') or item.get('close') or item.get('CLOSE') or 0),
                    'volume': int(item.get('CH_TOT_TRADED_QTY') or item.get('volume') or item.get('VOLUME') or 0),
                    'exchange': 'NSE'
                })
            except Exception as e:
                print(f"[WARN] Error processing record: {e}")
                continue

        if not processed_batch:
            print(f"[WARN] No valid records to insert for {ticker}")
            return

        # Bulk insert into database
        await insert_historical_batch_into_postgres(processed_batch)

        print(f"[SUCCESS] Historical load completed for {ticker} ({len(processed_batch)} records)")

    except Exception as e:
        print(f"[ERROR] Historical load failed for {ticker}: {e}")
        import traceback
        traceback.print_exc()


# -----------------------------------------------------------
# MAIN ENTRY POINT
# -----------------------------------------------------------
async def run_historical_loader(symbols: List[str] = None, days: int = None):
    """
    Load historical data for symbols.

    Args:
        symbols: List of symbols to load (default: all from database)
        days: Number of days of history to load (default: 10 years)
    """
    await init_connections()

    try:
        # Get ticker list
        if symbols:
            ticker_list = symbols
        else:
            ticker_list = await load_ticker_list()

        if not ticker_list:
            print("[ERROR] No symbols found. Run company_initializer.py first.")
            return

        print(f"[INFO] Loading historical data for {len(ticker_list)} symbols: {ticker_list}")

        # Calculate date range
        end_date = END_DATE
        start_date = START_DATE if not days else end_date - timedelta(days=days)

        # Load historical data for each ticker
        for ticker in ticker_list:
            await load_historical_data(ticker, start_date, end_date)
            # Small delay to avoid rate limiting
            await asyncio.sleep(1)

        print(f"\n[SUCCESS] Historical data load completed for all symbols")

    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user")
    finally:
        await close_connections()


# -----------------------------------------------------------
# CLI ENTRY POINT
# -----------------------------------------------------------
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Load historical stock data")
    parser.add_argument("--symbol", type=str, help="Specific symbol to load (default: all)")
    parser.add_argument("--days", type=int, help="Number of days of history (default: 10 years)")
    args = parser.parse_args()

    symbols = [args.symbol] if args.symbol else None
    asyncio.run(run_historical_loader(symbols=symbols, days=args.days))
