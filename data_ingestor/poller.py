"""
DEPRECATED: This file has been split into separate modules.

Use the following files instead:

1. company_initializer.py - Run every 30 days to initialize/update company metadata
   $ python company_initializer.py
   $ python company_initializer.py --force  # Force refresh

2. tick_poller.py - Run continuously to fetch tick data every minute
   $ python tick_poller.py

3. shared.py - Common configuration, models, and database connections

Example cron setup:
    # Run company initializer on the 1st of each month at midnight
    0 0 1 * * cd /path/to/data_ingestor && python company_initializer.py

    # Run tick poller as a systemd service or in a screen/tmux session
"""

import asyncio
from company_initializer import run_company_initializer
from tick_poller import run_tick_poller


async def main():
    """
    Legacy entry point that runs both company initialization and tick polling.
    Consider running these separately for better control.
    """
    # Initialize companies first
    await run_company_initializer()

    # Then start tick polling
    await run_tick_poller()


if __name__ == "__main__":
    print("WARNING: This is the legacy entry point.")
    print("Consider running company_initializer.py and tick_poller.py separately.")
    print()
    asyncio.run(main())
