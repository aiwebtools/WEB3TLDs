"""Backend API tests for Web3 TLD showcase app.
Covers: /api/ root, /api/prices (prices + examples), /api/name-preview,
/api/name-preview-stream (NDJSON streaming), /api/leads, /api/status.
"""
import json
import os
import time
import uuid

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

TLD_SLUGS = [
    "transfermoney", "transfercoin", "cointransfer", "transfercash", "cashtransfer",
    "ai-tools", "aiwebtools", "aimainframe", "aitoolscompany",
    "robotsales", "robotshop", "robotstore",
    "worldpeace", "worldtrade", "worldtrader",
]


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health / root ---
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200
        assert r.json().get("message") == "Hello World"


# --- /api/prices : live prices + premium examples ---
class TestPrices:
    def test_prices_shape(self, api):
        r = api.get(f"{BASE_URL}/api/prices", timeout=60)
        assert r.status_code == 200
        data = r.json()
        assert "prices" in data and "examples" in data
        assert data.get("updated_at")
        prices = data["prices"]
        # all 15 TLDs should have a live price
        missing = [s for s in TLD_SLUGS if s not in prices]
        assert not missing, f"prices missing for {missing}"
        for slug, p in prices.items():
            assert isinstance(p, (int, float)) and p > 0

    def test_examples_quality(self, api):
        data = api.get(f"{BASE_URL}/api/prices", timeout=60).json()
        examples = data["examples"]
        missing = [s for s in TLD_SLUGS if not examples.get(s)]
        assert not missing, f"examples missing for {missing}"
        for slug, rows in examples.items():
            assert len(rows) <= 8, f"{slug} returned {len(rows)} examples (max 8)"
            for row in rows:
                assert row["name"].endswith(f".{slug}")
                assert "status" in row
                url = row["buyUrl"]
                assert url == (
                    f"https://freename.io/results?search={row['name']}&ref=olive-ears-obey"
                ), url
                assert "%22" not in url and '"' not in url
                if row["status"] == "AVAILABLE":
                    assert row["price"] is not None, f"{row['name']} available with no price"

    def test_no_mongo_id_leak(self, api):
        assert "_id" not in api.get(f"{BASE_URL}/api/prices", timeout=60).text


# --- /api/name-preview ---
class TestNamePreview:
    def test_name_preview_all_tlds(self, api):
        r = api.get(f"{BASE_URL}/api/name-preview", params={"name": "voting"}, timeout=90)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "voting"
        results = data["results"]
        assert len(results) == 15
        slugs = {x["slug"] for x in results}
        assert slugs == set(TLD_SLUGS)
        for x in results:
            assert x["buyUrl"] == f"https://freename.io/results?search=voting.{x['slug']}&ref=olive-ears-obey"
            assert "%22" not in x["buyUrl"] and '"' not in x["buyUrl"]
        resolved = [x for x in results if x["status"] != "UNKNOWN"]
        assert len(resolved) >= 12, f"only {len(resolved)}/15 resolved from upstream"

    def test_name_sanitization(self, api):
        r = api.get(f"{BASE_URL}/api/name-preview", params={"name": '"vo ting"!'}, timeout=90)
        assert r.status_code == 200
        assert r.json()["name"] == "voting"

    def test_empty_name(self, api):
        r = api.get(f"{BASE_URL}/api/name-preview", params={"name": "!!!"}, timeout=30)
        assert r.status_code == 200
        assert r.json() == {"name": "", "results": []}

    def test_missing_param_returns_422(self, api):
        r = api.get(f"{BASE_URL}/api/name-preview", timeout=30)
        assert r.status_code == 422


# --- /api/name-preview-stream : NDJSON progressive streaming ---
class TestNamePreviewStream:
    def _stream(self, name, timeout=90):
        first_at = None
        rows = []
        start = time.time()
        with requests.get(
            f"{BASE_URL}/api/name-preview-stream",
            params={"name": name},
            stream=True,
            timeout=timeout,
        ) as r:
            assert r.status_code == 200, r.text[:300]
            assert "ndjson" in r.headers.get("content-type", "")
            for line in r.iter_lines(decode_unicode=True):
                if not line:
                    continue
                if first_at is None:
                    first_at = time.time() - start
                rows.append(json.loads(line))
        return rows, first_at, time.time() - start

    def test_stream_fresh_name_progressive(self):
        name = "qa" + uuid.uuid4().hex[:8]
        rows, first_at, total = self._stream(name)
        print(f"fresh stream {name}: first={first_at:.1f}s total={total:.1f}s")
        assert len(rows) == 15, f"got {len(rows)} rows"
        assert {r["slug"] for r in rows} == set(TLD_SLUGS)
        for r in rows:
            assert r["fqdn"] == f"{name}.{r['slug']}"
            assert r["buyUrl"] == f"https://freename.io/results?search={name}.{r['slug']}&ref=olive-ears-obey"
            assert "%22" not in r["buyUrl"]
        assert first_at < 15, f"first result took {first_at:.1f}s (>15s)"
        assert total < 45, f"full stream took {total:.1f}s (>45s)"

    def test_stream_cached_is_fast(self):
        name = "voting"
        self._stream(name)  # warm cache
        rows, first_at, total = self._stream(name)
        print(f"cached stream: total={total:.2f}s")
        assert len(rows) == 15
        assert total < 5, f"cached stream took {total:.1f}s"

    def test_stream_empty_name_no_rows(self):
        rows, _, _ = self._stream("###", timeout=30)
        assert rows == []


# --- /api/leads and /api/status persistence ---
class TestLeadsAndStatus:
    def test_create_lead_and_persist(self, api):
        payload = {
            "name": "TEST_qa_lead",
            "email": "TEST_qa@example.com",
            "offer": "1000",
            "domains": ["transfermoney"],
            "message": "TEST",
        }
        r = api.post(f"{BASE_URL}/api/leads", json=payload, timeout=30)
        assert r.status_code == 200, r.text[:300]
        body = r.json()
        assert body["email"] == payload["email"]
        assert isinstance(body["id"], str)
        listed = api.get(f"{BASE_URL}/api/leads", timeout=30)
        assert listed.status_code == 200
        assert any(l["id"] == body["id"] for l in listed.json())

    def test_lead_validation(self, api):
        r = api.post(f"{BASE_URL}/api/leads", json={"email": "x@y.com"}, timeout=30)
        assert r.status_code == 422

    def test_status_create_and_list(self, api):
        r = api.post(f"{BASE_URL}/api/status", json={"client_name": "TEST_qa"}, timeout=30)
        assert r.status_code == 200
        sid = r.json()["id"]
        listed = api.get(f"{BASE_URL}/api/status", timeout=30)
        assert listed.status_code == 200
        assert any(s["id"] == sid for s in listed.json())
