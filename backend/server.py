from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
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
PRICE_REFRESH_INTERVAL = 6 * 60 * 60

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

async def fetch_tld_price(slug: str):
    try:
        async with httpx.AsyncClient(timeout=20) as http:
            r = await http.get(f"https://v2-api.freename.com/api/v2/reseller/search/{slug}?searchString=")
            result = r.json().get("data", {}).get("result", {})
        prices = []
        collect_prices(result, prices, f".{slug}")
        return min(prices) if prices else None
    except Exception as e:
        logger.warning(f"price fetch failed for {slug}: {e}")
        return None

async def refresh_prices():
    prices = {}
    for slug in TLD_SLUGS:
        price = await fetch_tld_price(slug)
        if price is not None:
            prices[slug] = price
    if prices:
        await db.tld_prices.update_one(
            {"_id": "current"},
            {"$set": {"prices": prices, "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        logger.info(f"refreshed prices for {len(prices)} TLDs")

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