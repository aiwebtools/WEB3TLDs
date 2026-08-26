from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
import asyncio
import httpx
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

class LeadCreate(BaseModel):
    name: str
    email: str
    offer: str = ""
    domains: List[str] = []
    message: str = ""

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    offer: str = ""
    domains: List[str] = []
    message: str = ""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.model_dump())
    doc = lead.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.leads.insert_one(doc)
    return lead

@api_router.get("/leads", response_model=List[Lead])
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead['timestamp'], str):
            lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
    return leads

TLD_SLUGS = [
    "transfermoney", "transfercoin", "cointransfer", "transfercash", "cashtransfer",
    "ai-tools", "aiwebtools", "aimainframe", "aitoolscompany",
    "robotsales", "robotshop", "robotstore",
    "worldpeace", "worldtrade", "worldtrader",
]
PRICE_REFRESH_INTERVAL = 30 * 60

# In-memory cache for name lookups: name -> (epoch_seconds, results)
NAME_PREVIEW_CACHE = {}
NAME_PREVIEW_TTL = 10 * 60
HTTP_TIMEOUT = 10

def collect_prices(node, out, suffix):
    if isinstance(node, dict):
        name = node.get("name")
        price = node.get("price")
        if (
            isinstance(name, str)
            and name.lower().endswith(suffix)
            and isinstance(price, dict)
            and price.get("amount")
        ):
            out.append(float(price["amount"]))
        for v in node.values():
            collect_prices(v, out, suffix)
    elif isinstance(node, list):
        for item in node:
            collect_prices(item, out, suffix)

async def fetch_tld_price(http, sem, slug: str):
    try:
        async with sem:
            r = await http.get(f"{FREENAME_RESELLER_SEARCH}/{slug}?searchString=")
        result = r.json().get("data", {}).get("result", {})
        prices = []
        collect_prices(result, prices, f".{slug}")
        return min(prices) if prices else None
    except Exception as e:
        logger.warning(f"price fetch failed for {slug}: {e!r}")
        return None


EXAMPLE_KEYWORDS = {
    "transfermoney": ["remit", "wire", "sendcash", "oil", "gold", "bank", "pay", "crypto", "global", "swift"],
    "transfercoin": ["bitcoin", "eth", "swap", "oil", "gold", "bank", "pay", "crypto", "defi", "whale"],
    "cointransfer": ["bitcoin", "eth", "defi", "oil", "gold", "bank", "pay", "crypto", "exchange", "whale"],
    "transfercash": ["atm", "instant", "oil", "gold", "bank", "pay", "crypto", "remit", "payday", "swift"],
    "cashtransfer": ["remit", "instant", "oil", "gold", "bank", "pay", "crypto", "family", "global", "atm"],
    "ai-tools": ["gpt", "image", "writer", "oil", "gold", "code", "video", "voice", "agent", "chat"],
    "aiwebtools": ["studio", "builder", "oil", "gold", "gpt", "image", "video", "seo", "agent", "launch"],
    "aimainframe": ["compute", "gpu", "oil", "gold", "core", "cloud", "data", "neural", "quantum", "node"],
    "aitoolscompany": ["labs", "hq", "oil", "gold", "pro", "studio", "works", "group", "ventures", "corp"],
    "robotsales": ["humanoid", "android", "oil", "gold", "drone", "bot", "mech", "cyborg", "factory", "pro"],
    "robotshop": ["humanoid", "toys", "oil", "gold", "drone", "pet", "home", "android", "kids", "pro"],
    "robotstore": ["parts", "droids", "oil", "gold", "drone", "android", "kits", "mega", "humanoid", "pro"],
    "worldpeace": ["hope", "unite", "oil", "gold", "give", "love", "earth", "global", "charity", "one"],
    "worldtrade": ["oil", "gas", "gold", "cargo", "shipping", "forex", "export", "import", "grain", "steel"],
    "worldtrader": ["forex", "whale", "oil", "gold", "pro", "fx", "bull", "elite", "crypto", "prime"],
}


async def fetch_tld_examples(http, sem, slug: str):
    keywords = EXAMPLE_KEYWORDS.get(slug, [])
    found = {}

    async def probe(kw):
        fqdn = f"{kw}.{slug}"
        for attempt in range(2):
            try:
                async with sem:
                    r = await http.get(f"{FREENAME_RESELLER_SEARCH}/{slug}?searchString={kw}")
                hit = extract_exact(r.json().get("data", {}).get("result", {}), fqdn)
                status = hit.get("status")
                if status:
                    found[fqdn] = {
                        "name": fqdn,
                        "price": float(hit["price"]) if hit.get("price") else None,
                        "status": status,
                        "buyUrl": buy_url_for(fqdn),
                    }
                return
            except Exception as e:
                if attempt == 1:
                    logger.warning(f"example fetch failed for {fqdn}: {e!r}")
                else:
                    await asyncio.sleep(1.5)

    await asyncio.gather(*[probe(kw) for kw in keywords])
    available = sorted(
        (e for e in found.values() if e["status"] == "AVAILABLE" and e["price"] is not None),
        key=lambda e: -e["price"],
    )
    sold = [e for e in found.values() if e["status"] != "AVAILABLE"]
    return (available + sold)[:8]


async def refresh_prices():
    prices = {}
    examples = {}
    async with httpx.AsyncClient(timeout=25) as http:
        sem = asyncio.Semaphore(4)

        async def one(slug):
            return slug, await fetch_tld_price(http, sem, slug), await fetch_tld_examples(http, sem, slug)

        results = await asyncio.gather(*[one(slug) for slug in TLD_SLUGS])
    for slug, price, ex in results:
        if price is not None:
            prices[slug] = price
        if ex:
            examples[slug] = ex
    if prices or examples:
        await db.tld_prices.update_one(
            {"_id": "current"},
            {"$set": {"prices": prices, "examples": examples, "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        logger.info(f"refreshed prices for {len(prices)} TLDs, examples for {len(examples)}")

async def price_refresh_loop():
    while True:
        await refresh_prices()
        await asyncio.sleep(PRICE_REFRESH_INTERVAL)

@app.on_event("startup")
async def start_price_refresh():
    asyncio.create_task(price_refresh_loop())

@api_router.get("/prices")
async def get_prices():
    doc = await db.tld_prices.find_one({"_id": "current"}, {"_id": 0})
    return doc or {"prices": {}, "updated_at": None}

FREENAME_RESELLER_SEARCH = "https://v2-api.freename.com/api/v2/reseller/search"


def buy_url_for(fqdn: str) -> str:
    return f"https://freename.io/results?search={fqdn}&ref=olive-ears-obey"


def extract_exact(result, fqdn):
    found = {}

    def walk(node):
        if isinstance(node, dict):
            if node.get("name") == fqdn:
                found["price"] = (node.get("price") or {}).get("amount")
                found["status"] = node.get("availabilityStatus")
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(result)
    return found


async def check_name_on_tld(http, sem, clean, slug):
    fqdn = f"{clean}.{slug}"
    found = {}
    for attempt in range(3):
        try:
            async with sem:
                r = await http.get(f"{FREENAME_RESELLER_SEARCH}/{slug}?searchString={clean}")
            found = extract_exact(r.json().get("data", {}).get("result", {}), fqdn)
            break
        except Exception as e:
            if attempt == 2:
                logger.warning(f"name preview failed for {fqdn}: {e!r}")
            else:
                await asyncio.sleep(1.5 * (attempt + 1))
    return {
        "slug": slug,
        "fqdn": fqdn,
        "price": found.get("price"),
        "status": found.get("status", "UNKNOWN"),
        "buyUrl": buy_url_for(fqdn),
    }


@api_router.get("/name-preview")
async def name_preview(name: str):
    clean = "".join(c for c in name.lower() if c.isalnum() or c == "-").strip("-")[:30]
    if not clean:
        return {"name": "", "results": []}

    now = datetime.now(timezone.utc).timestamp()
    cached = NAME_PREVIEW_CACHE.get(clean)
    if cached and now - cached[0] < NAME_PREVIEW_TTL:
        return {"name": clean, "results": cached[1]}

    async with httpx.AsyncClient(timeout=25) as http:
        sem = asyncio.Semaphore(4)
        results = list(await asyncio.gather(*[check_name_on_tld(http, sem, clean, slug) for slug in TLD_SLUGS]))

    NAME_PREVIEW_CACHE[clean] = (now, results)
    if len(NAME_PREVIEW_CACHE) > 500:
        NAME_PREVIEW_CACHE.clear()
    return {"name": clean, "results": results}


@api_router.get("/name-preview-stream")
async def name_preview_stream(name: str):
    clean = "".join(c for c in name.lower() if c.isalnum() or c == "-").strip("-")[:30]

    async def gen():
        if not clean:
            return
        now = datetime.now(timezone.utc).timestamp()
        cached = NAME_PREVIEW_CACHE.get(clean)
        if cached and now - cached[0] < NAME_PREVIEW_TTL:
            for r in cached[1]:
                yield json.dumps(r) + "\n"
            return

        queue = asyncio.Queue()
        async with httpx.AsyncClient(timeout=25) as http:
            sem = asyncio.Semaphore(4)

            async def run(slug):
                res = await check_name_on_tld(http, sem, clean, slug)
                await queue.put(res)

            tasks = [asyncio.create_task(run(slug)) for slug in TLD_SLUGS]
            collected = []
            for _ in TLD_SLUGS:
                try:
                    res = await asyncio.wait_for(queue.get(), timeout=40)
                except asyncio.TimeoutError:
                    logger.warning("name-preview-stream: timed out waiting for a worker result")
                    break
                collected.append(res)
                yield json.dumps(res) + "\n"
            await asyncio.gather(*tasks, return_exceptions=True)

        collected.sort(key=lambda r: TLD_SLUGS.index(r["slug"]))
        NAME_PREVIEW_CACHE[clean] = (now, collected)
        if len(NAME_PREVIEW_CACHE) > 500:
            NAME_PREVIEW_CACHE.clear()

    return StreamingResponse(gen(), media_type="application/x-ndjson")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()