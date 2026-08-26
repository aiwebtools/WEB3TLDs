# PRD — AIWEBTOOLS.AI Premium Web3 TLD Showcase

## Original Problem Statement
Showcase/sell 15 premium Web3 TLDs (.transfermoney, .transfercoin, .cointransfer, .transfercash, .cashtransfer, .ai-tools, .aiwebtools, .aimainframe, .aitoolscompany, .robotsales, .robotshop, .robotstore, .worldpeace, .worldtrade, .worldtrader) with direct Freename purchase links (referral `ref=olive-ears-obey`). Dark futuristic Web3 look, neon #CCFF00 accents, Awwwards-level UI, Framer Motion, Lenis smooth scroll, live Freename pricing, category showcases, custom pitches, name search with live pricing, custom AI art, social share + OG tags, hero promo video loop.

## Architecture
- Frontend: React + Tailwind + framer-motion + Lenis + react-fast-marquee (`/app/frontend/src/components/`)
- Backend: FastAPI `/app/backend/server.py`, MongoDB via MONGO_URL/DB_NAME
- Freename data: `v2-api.freename.com/api/v2/reseller/search/{tld}?searchString=` (public)
- Media: `/app/frontend/public/images/domains/*.png` (15 AI-generated card images), `/app/frontend/public/videos/hero-stock.mp4` (hero bg loop)

## Implemented (this session, 2026-08-26)
- Promo banner: `GET /api/promo` serves current Freename promo (seeded AUGUST50 — 50% off $300+, verified live 2026-08-26); backend scraper re-checks Freename public pages every 6h and auto-updates the code when a new one appears (JS-injected codes aren't statically scrapeable — banner keeps last verified code, marked with verified_at); frontend `PromoBanner.jsx` strip under nav with copy-to-clipboard (+ fallback), chime + confetti
- Share Image Cards: 15 branded 1200x630 OG cards auto-generated with Pillow (`/app/backend/scripts/og_images.py` -> `/app/frontend/public/og/{slug}.png`), regenerated every 30 min with live prices; `GET /api/share/{slug}` serves OG/Twitter meta (absolute image URLs via x-forwarded-host) and redirects humans to Freename purchase; DomainCard share/copy buttons now share the branded page URL
- Purchase celebration: confetti burst (canvas-confetti, acid-green palette) + WebAudio "bing" chime, then the Freename tab opens ~650ms later (about:blank trick = popup-blocker safe) on domain cards, buy buttons, search result cards and example rows
- Search glitch fix: 2-char minimum, 600ms debounce, previous results stay dimmed until new stream data arrives — no flicker/reset while typing
- Hero background video loop (stock clip self-hosted; Sora 2 AI clip BLOCKED — Universal Key budget insufficient)
- aiwebtools.app branding: nav logo, "Free AI Tools" chip (desktop+mobile menu), footer wordmark + presented-by, .aiwebtools card example chips + "Live proof" link — all open aiwebtools.app in new tab
- All external links open in NEW tab (target=_blank + noopener); Freename URLs carry ref=olive-ears-obey, quote-mark (%22) bug fixed
- Live name search: NDJSON streaming `/api/name-preview-stream` (first price ~6s, 15/15 in ~20s fresh, instant cached 10-min TTL), retry + semaphore(4) + 40s hang guard; "· · ·" placeholder instead of stale seed prices
- Clickable TLD filter chips ABOVE the search bar (tiny on desktop, 40px tap targets on mobile)
- Default view: 8 curated premium example names per TLD with real live prices (per-TLD keyword sets, e.g. oil.worldtrade $4,999); sold names show struck-through "No longer available"; refreshed every 30 min
- "Make Your Own TLD" buttons (nav desktop, mobile menu, hero, footer) → https://freename.com/home?ref=olive-ears-obey
- Mobile optimization: hamburger nav, 360px horizontal overflow fixed (html overflow-x), footer wordmark scales, chips tap-friendly
- Domain card action row: share/copy icons row + full-width Buy button (overflow fixed)
- Testing: /app/test_reports/iteration_1-3.json; backend pytest /app/backend/tests/backend_test.py (18/18 pass, incl. TestSharePages)
- Deployment readiness: PASS (deployment_agent, 2026-08-26). User presses Deploy in dashboard.

## Backlog
- P1: Generate Sora 2 hero loop when Universal Key budget is topped up (script ready: /app/backend/scripts/gen_hero_video.py, outputs /videos/hero-ai.mp4; re-add <source> in Hero.jsx)
- P2: Refactor ClaimYourName.jsx (extract stream hook + grids); centralize buy-URL builder
- P2: Consider WebM/VP9 hero video variant for broader codec support

## Notes
- No auth anywhere; /app/memory/test_credentials.md intentionally empty
- Preview URL may show "Preview Unavailable" after inactivity — curl the URL once to wake
