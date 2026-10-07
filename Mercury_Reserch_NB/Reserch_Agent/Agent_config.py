import os
import requests

def search_google_custom(query: str):
    GOOGLE_API_KEY = os.getenv("GOOGLE_SEARCH_API")
    CX = os.getenv("SERACH_ENGINE_ID")

    if not GOOGLE_API_KEY:
        raise RuntimeError("Missing env: GOOGLE_SEARCH_API")
    if not CX:
        raise RuntimeError("Missing env: SERACH_ENGINE_ID")

    url = "https://www.googleapis.com/customsearch/v1"
    
    params = {
        "key": GOOGLE_API_KEY,
        "cx": CX,
        "q": query.strip(),
        "num": 10
    }

    res = requests.get(url, params=params, timeout=10)
    res.raise_for_status()
    data = res.json()

    results = [
        {
            "title": item.get("title"),
            "link": item.get("link"),
            "snippet": item.get("snippet")
        }
        for item in data.get("items", [])
    ]

    return results
