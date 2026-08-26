# PRD — AIWEBTOOLS.AI Web3 Domain Showcase

## Original Problem Statement
An app that sells 15 Web3 TLD domains (across Money Transfer, AI & Technology, Robotics & Automation, Global & World categories, on Polygon and Solana chains). Each domain has a direct purchase link on Freename with referral `ref=olive-ears-obey`. Pitch each domain. Presented by AIWEBTOOLS.AI.

## User Personas
- Web3 investor/speculator hunting premium TLDs
- Startup founder looking for a category-defining domain
- Collector browsing curated domain portfolios

## Architecture
- Pure static frontend: React 19 + Tailwind + framer-motion + @studio-freight/lenis + react-fast-marquee
- No backend database usage (all domain data hardcoded in `src/data/domains.js`)
- Purchase links go directly to freename.io (external checkout)

## Core Requirements (static)
- 15 domains, 4 numbered categories, per-domain pitch copy
- Buy buttons link to `https://freename.io/discover/{slug}?ref=olive-ears-obey`
- Chain badges (Polygon purple tint, Solana green tint)
- Dark futuristic Web3 aesthetic (void black + acid green #CCFF00)
- Presented by AIWEBTOOLS.AI branding

## Implemented (2026-08-26)
- Kinetic hero with masked line-by-line reveal + scroll parallax (framer-motion)
- Lenis smooth momentum scrolling with anchor-based smooth nav
- Editorial marquee (react-fast-marquee, slow drift)
- 4 numbered manifesto chapters with staggered glassmorphism domain cards
- Chain badges per card; "Live" verified badge on .worldtrader
- Footer with final-call CTA and massive outline brand text
- Noise/grain overlay, hero grid glow, acid-green accent system
- All 15 buy links verified to correct Freename URLs (HTTP 200)
- Live pricing scraped from each Freename discover page — "From $X.XX" shown per card (2026-08-26)
- Chain filter bar (All / Polygon / Solana), sticky, with live match count
- Copy referral link button per card (clipboard + toast)
- Bulk offer lead form (modal) → POST /api/leads stored in MongoDB (2026-08-26, later removed per user request)
- Price auto-refresh: backend polls Freename v2 API every 6h, caches in Mongo, serves /api/prices; frontend live-overrides card prices (2026-08-26)
- Category editorial images with parallax + spotlight frames (2026-08-26)
- "What exactly are you buying?" education section: TLD/SLD ownership model, 6 real-life utility cards, 3-step strip (2026-08-26)
- Per-card: custom artwork (8 AI-generated via Gemini Nano Banana, 7 curated stock pending LLM budget top-up), example names (mike.cashtransfer style), 3 plain-English utilities, MINTED ON POLYGON/SOLANA badges
- Whole card clickable → purchase URL; card name hover accent; shine + lift effects on all buttons
- Nav branding upgrade: live pulse pill, Browse Names + Freename CTAs; animated hero (panning grid, 3 drifting glow orbs)
- "Type your name" claim section: live Freename price-check API (/api/name-preview) across all 15 endings, personalized greeting, gradient glow input, staggered result cards linking to exact buy URLs (2026-08-26)
- Social share row per card (X / Telegram / WhatsApp intent links with prefilled promo text) + copy referral button (2026-08-26)
- 3D tilt on domain cards (spring physics), aurora background layer (acid + cyan drifting glows), gradient price text, OG/Twitter meta tags for premium link previews (2026-08-26)

## Backlog
- P0: Regenerate 7 remaining custom card images once user tops up Universal Key (Profile → Manage plan → Universal Key → Add Balance): ai-tools, aimainframe, aitoolscompany, robotsales, robotstore, worldpeace, worldtrade
- P1: Email notification to owner when a lead arrives (Resend); admin view of leads
- P2: Bundle deals section, per-domain OG images, availability webhook

## Next Tasks
1. Regenerate remaining 7 custom images after budget top-up
2. Wire lead notifications to owner email (Resend integration)
3. Per-domain dynamic OG images for richer social shares
