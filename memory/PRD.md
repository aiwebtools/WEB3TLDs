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

## Backlog
- P0: none blocking
- P1: Search/filter by chain or category; contact/lead capture form for bulk buyers
- P2: Price display per domain (manual data), bundle deals section, live availability check via Freename API, share/referral copy button per domain

## Next Tasks
1. Add lead capture form for bulk/portfolio offers
2. Add chain + category filters above the grid
3. Add per-domain pricing once confirmed
