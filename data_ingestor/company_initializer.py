"""
Company Initializer - Runs every 30 days to initialize/update company metadata.

Usage:
    python company_initializer.py

Schedule with cron:
    0 0 1 * * python /path/to/company_initializer.py  # Run on 1st of each month
"""

import asyncio
import json
from datetime import datetime, timezone

import shared
from shared import (
    COMPANIES_LIST,
    nse,
    init_connections,
    close_connections,
)


# -----------------------------------------------------------
# NORMALIZE COMPANY METADATA
# -----------------------------------------------------------
def normalize_company_metadata(raw: dict):
    info = raw.get("info", {})
    metadata = raw.get("metadata", {})
    security = raw.get("securityInfo", {})
    industry = raw.get("industryInfo", {})

    # Convert listing date
    listing_date = None
    if info.get("listingDate"):
        try:
            listing_date = datetime.fromisoformat(info["listingDate"])
        except:
            try:
                listing_date = datetime.strptime(info["listingDate"], "%d-%b-%Y")
            except:
                listing_date = None

    comp_data = {
        "company_name": info.get("companyName"),
        "symbol": info.get("symbol"),
        "listing_type": metadata.get("series"),  # Ex: EQ
        "listing_date": listing_date,
        "isin": info.get("isin"),
        "is_suspended": info.get("isSuspended"),
        "is_delisted": info.get("isDelisted"),
        "active_series": info.get("activeSeries", []),
        "temp_suspended_series": info.get("tempSuspendedSeries", []),
        "trading_status": security.get("tradingStatus"),
        "board_status": security.get("boardStatus"),
        "segment": info.get("segment"),
        "is_fno_sec": info.get("isFNOSec"),
        "is_ca_sec": info.get("isCASec"),
        "is_slb_sec": info.get("isSLBSec"),
        "is_debt_sec": info.get("isDebtSec"),
        "is_etf_sec": info.get("isETFSec"),
        "is_hybrid_symbol": info.get("isHybridSymbol"),
        "is_top10": info.get("isTop10"),
        "class_of_share": security.get("classOfShare"),
        "face_value": security.get("faceValue"),
        "derivatives": security.get("derivatives"),
        "industry_macro": industry.get("macro"),
        "industry_sector": industry.get("sector"),
        "industry_group": industry.get("industry"),
        "industry_basic": industry.get("basicIndustry"),

        # EVERYTHING else goes into misc_data (priceInfo, sddDetails, preOpenMarket, …)
        "misc_data": {
            "metadata": raw.get("metadata"),
            "sddDetails": raw.get("sddDetails"),
            "priceInfo": raw.get("priceInfo"),
            "preOpenMarket": raw.get("preOpenMarket"),
            "currentMarketType": raw.get("currentMarketType"),
        },
    }

    return comp_data


# -----------------------------------------------------------
# STORE AND LOAD COMPANY SYMBOLS
# -----------------------------------------------------------
async def store_company_symbols(query: str, results: list[dict]):
    sql = """INSERT INTO company_symbols (
        query, company_name, symbol, listing_type, listing_date, last_checked_date,
        isin, original_search, is_suspended, is_delisted,
        active_series, temp_suspended_series, trading_status, board_status, segment,
        is_fno_sec, is_ca_sec, is_slb_sec, is_debt_sec, is_etf_sec, is_hybrid_symbol,
        is_top10, class_of_share, face_value, derivatives,
        industry_macro, industry_sector, industry_group, industry_basic,
        misc_data
    )
    VALUES (
        $1, $2, $3, $4, $5, NOW(),
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24,
        $25, $26, $27, $28,
        $29
    )
    ON CONFLICT (symbol)
    DO UPDATE SET
        query = EXCLUDED.query,
        company_name = EXCLUDED.company_name,
        listing_type = EXCLUDED.listing_type,
        last_checked_date = EXCLUDED.last_checked_date,
        isin = EXCLUDED.isin,
        original_search = EXCLUDED.original_search,
        is_suspended = EXCLUDED.is_suspended,
        is_delisted = EXCLUDED.is_delisted,
        active_series = EXCLUDED.active_series,
        temp_suspended_series = EXCLUDED.temp_suspended_series,
        trading_status = EXCLUDED.trading_status,
        board_status = EXCLUDED.board_status,
        segment = EXCLUDED.segment,
        is_fno_sec = EXCLUDED.is_fno_sec,
        is_ca_sec = EXCLUDED.is_ca_sec,
        is_slb_sec = EXCLUDED.is_slb_sec,
        is_debt_sec = EXCLUDED.is_debt_sec,
        is_etf_sec = EXCLUDED.is_etf_sec,
        is_hybrid_symbol = EXCLUDED.is_hybrid_symbol,
        is_top10 = EXCLUDED.is_top10,
        class_of_share = EXCLUDED.class_of_share,
        face_value = EXCLUDED.face_value,
        derivatives = EXCLUDED.derivatives,
        industry_macro = EXCLUDED.industry_macro,
        industry_sector = EXCLUDED.industry_sector,
        industry_group = EXCLUDED.industry_group,
        industry_basic = EXCLUDED.industry_basic,
        misc_data = company_symbols.misc_data || EXCLUDED.misc_data;"""

    async with shared.DB_POOL.acquire() as conn:
        async with conn.transaction():
            for key, values in results.items():
                if key == 'symbols':
                    for comp_row in values:
                        comp_data = normalize_company_metadata(nse.quote(comp_row["symbol"]))
                        if comp_data.get('listing_date') is not None:
                            await conn.execute(
                                sql,
                                query,
                                comp_row["symbol_info"],
                                comp_row["symbol"],
                                comp_row["result_sub_type"],
                                datetime.strptime(comp_row["listing_date"], '%Y-%m-%d'),
                                comp_data.get("isin"),
                                comp_data.get("original_search"),
                                comp_data.get("is_suspended"),
                                comp_data.get("is_delisted"),
                                comp_data.get("active_series"),
                                comp_data.get("temp_suspended_series"),
                                comp_data.get("trading_status"),
                                comp_data.get("board_status"),
                                comp_data.get("segment"),
                                comp_data.get("is_fno_sec"),
                                comp_data.get("is_ca_sec"),
                                comp_data.get("is_slb_sec"),
                                comp_data.get("is_debt_sec"),
                                comp_data.get("is_etf_sec"),
                                comp_data.get("is_hybrid_symbol"),
                                comp_data.get("is_top10"),
                                comp_data.get("class_of_share"),
                                comp_data.get("face_value"),
                                comp_data.get("derivatives"),
                                comp_data.get("industry_macro"),
                                comp_data.get("industry_sector"),
                                comp_data.get("industry_group"),
                                comp_data.get("industry_basic"),
                                json.dumps(comp_data.get("misc_data", {})),
                            )
                            print(f"{comp_row['symbol_info']} Company info Inserted")


async def load_cached_symbols(query: str) -> list[dict]:
    sql = "SELECT symbol, last_checked_date FROM company_symbols WHERE query=$1;"
    async with shared.DB_POOL.acquire() as conn:
        rows = await conn.fetch(sql, query)
        return [{'symbol': r["symbol"], 'last_checked_date': r["last_checked_date"]} for r in rows]


# -----------------------------------------------------------
# INITIALIZE COMPANIES
# -----------------------------------------------------------
async def initialize_symbols(company: str, force: bool = False):
    """
    Initialize or update company symbols.

    Args:
        company: Company name to search for
        force: If True, always refresh data regardless of last check date
    """
    # Load from database first
    cached = await load_cached_symbols(company)

    if cached and not force:
        print("Loaded symbols from DB:", cached)
        min_date = min(cached, key=lambda r: r["last_checked_date"])["last_checked_date"]
        if (datetime.now(timezone.utc) - min_date).days <= 30:
            print("Company data is recent (< 30 days). Skipping refresh.")
            return [row.get('symbol') for row in cached]
        print("Company Last Check more than 30 days ago. Refreshing...")

    # Fetch using python-nse
    loop = asyncio.get_running_loop()
    lookup_results = await loop.run_in_executor(None, nse.lookup, company)

    if not lookup_results:
        raise Exception(f"No symbols found for query: {company}")

    # Store results
    await store_company_symbols(company, lookup_results)

    # Return updated symbols
    updated = await load_cached_symbols(company)
    symbols = [row.get('symbol') for row in updated]
    print("Fetched & stored symbols:", symbols)
    return symbols


# -----------------------------------------------------------
# MAIN ENTRY
# -----------------------------------------------------------
async def run_company_initializer(force: bool = False):
    """
    Run the company initializer for all companies in COMPANIES_LIST.

    Args:
        force: If True, refresh all companies regardless of last check date
    """
    await init_connections()

    try:
        all_symbols = []
        for company in COMPANIES_LIST:
            print(f"\nInitializing company: {company}")
            symbols = await initialize_symbols(company, force=force)
            all_symbols.extend(symbols)

        print(f"\nTotal symbols initialized: {len(all_symbols)}")
        print("Symbols:", all_symbols)
        return all_symbols
    finally:
        await close_connections()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Initialize company symbols")
    parser.add_argument("--force", action="store_true", help="Force refresh all companies")
    args = parser.parse_args()

    asyncio.run(run_company_initializer(force=args.force))
