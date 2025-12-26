import requests

session = requests.Session()

session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json,text/plain,*/*",
    "Referer": "https://www.nseindia.com/",
    "Origin": "https://www.nseindia.com",
})

# Step 1: Get cookies
session.get("https://www.nseindia.com", timeout=10)

# Step 2: Call API
url = "https://www.nseindia.com/api/NextApi/apiClient/GetQuoteApi"

params = {
    "functionName": "getHistoricalTradeData",
    "symbol": "SOLARINDS",
    "series": "EQ",
    "fromDate": "26-11-2025",
    "toDate": "26-12-2025",
}

resp = session.get(url, params=params, timeout=10)

resp.raise_for_status()
data = resp.json()

print(data)
