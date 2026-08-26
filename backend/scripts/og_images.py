"""Generate branded 1200x630 Open Graph share cards for each TLD.

Used standalone (python scripts/og_images.py) and by server.refresh_prices()
so card prices stay in sync with live Freename data.
"""

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

W, H = 1200, 630
ACID = (204, 255, 0)
BG = (5, 5, 5)
WHITE = (245, 245, 245)
DIM = (150, 150, 150)

FRONTEND_PUBLIC = Path("/app/frontend/public")
ART_DIR = FRONTEND_PUBLIC / "images" / "domains"
OUT_DIR = FRONTEND_PUBLIC / "og"

FONT_BOLD = "/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf"
FONT_SANS_BOLD = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
FONT_SANS = "/usr/share/fonts/truetype/freefont/FreeSans.ttf"

DOMAIN_META = {
    "transfermoney": (".transfermoney", "Polygon", "The rails of global remittance"),
    "transfercoin": (".transfercoin", "Polygon", "Bridge fiat and crypto seamlessly"),
    "cointransfer": (".cointransfer", "Polygon", "The standard for token exchange"),
    "transfercash": (".transfercash", "Polygon", "Instant liquidity, instantly recognized"),
    "cashtransfer": (".cashtransfer", "Polygon", "The definitive Web3 payment gateway name"),
    "ai-tools": (".ai-tools", "Solana", "The hub for next-gen AI utilities"),
    "aiwebtools": (".aiwebtools", "Solana", "Your brand's home for AI-driven web apps"),
    "aimainframe": (".aimainframe", "Solana", "Core infrastructure for AI processing"),
    "aitoolscompany": (".aitoolscompany", "Solana", "Instant authority in the AI corporate space"),
    "robotsales": (".robotsales", "Polygon", "The premier marketplace for automation hardware"),
    "robotshop": (".robotshop", "Polygon", "The consumer storefront for personal robotics"),
    "robotstore": (".robotstore", "Polygon", "The go-to retail hub for androids and parts"),
    "worldpeace": (".worldpeace", "Polygon", "Unite communities with a purpose-driven TLD"),
    "worldtrade": (".worldtrade", "Solana", "The foundation for global decentralized commerce"),
    "worldtrader": (".worldtrader", "Polygon", "For the elite international crypto merchant"),
}


def _font(path, size):
    return ImageFont.truetype(path, size)


def generate_og_images(prices=None):
    prices = prices or {}
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = []

    for slug, (tld, chain, tagline) in DOMAIN_META.items():
        card = Image.new("RGB", (W, H), BG)

        # Right-side neon artwork, darkened, feathered into the black background
        art_path = ART_DIR / f"{slug}.png"
        if art_path.exists():
            art = Image.open(art_path).convert("RGB")
            target_h = H
            target_w = int(art.width * (target_h / art.height))
            art = art.resize((target_w, target_h), Image.LANCZOS)
            art = art.crop((max(0, target_w - 620), 0, target_w, target_h)) if target_w > 620 else art
            art = ImageEnhance.Brightness(art).enhance(0.55)
            mask = Image.new("L", art.size, 0)
            md = ImageDraw.Draw(mask)
            for x in range(art.width):
                alpha = int(255 * min(1, x / 220))  # fade in from the left edge
                md.line([(x, 0), (x, art.height)], fill=alpha)
            card.paste(art, (W - art.width, 0), mask)

        d = ImageDraw.Draw(card)
        # Acid accent bar + frame
        d.rectangle([0, 0, 10, H], fill=ACID)
        d.rectangle([0, H - 4, W, H], fill=(30, 30, 30))

        # Branding
        d.text((56, 48), "AIWEBTOOLS.AI", font=_font(FONT_BOLD, 30), fill=ACID)
        d.text((56, 92), "PREMIUM WEB3 TLDS", font=_font(FONT_SANS, 20), fill=DIM)

        # Big domain name (shrink to fit)
        size = 92
        f = _font(FONT_BOLD, size)
        while d.textlength(tld, font=f) > 660 and size > 48:
            size -= 6
            f = _font(FONT_BOLD, size)
        d.text((56, 220), tld, font=f, fill=WHITE)

        d.text((56, 220 + size + 18), tagline, font=_font(FONT_SANS, 28), fill=DIM)

        # Price + chain chips
        price = prices.get(slug)
        price_txt = f"From ${price:,.2f}" if price else "Premium Web3 TLD"
        y = H - 150
        d.rounded_rectangle([56, y, 56 + d.textlength(price_txt, font=_font(FONT_BOLD, 34)) + 44, y + 60], radius=8, fill=ACID)
        d.text((78, y + 12), price_txt, font=_font(FONT_BOLD, 34), fill=BG)
        chain_txt = f"Minted on {chain}"
        cw = d.textlength(chain_txt, font=_font(FONT_SANS_BOLD, 24)) + 40
        x2 = 56 + d.textlength(price_txt, font=_font(FONT_BOLD, 34)) + 44 + 20
        d.rounded_rectangle([x2, y, x2 + cw, y + 60], radius=8, outline=(80, 80, 80), width=2)
        d.text((x2 + 20, y + 16), chain_txt, font=_font(FONT_SANS_BOLD, 24), fill=WHITE)

        d.text((56, H - 60), "Pay once. Own forever. Buy on Freename", font=_font(FONT_SANS, 22), fill=DIM)

        out = OUT_DIR / f"{slug}.png"
        card.save(out, "PNG", optimize=True)
        written.append(str(out))

    return written


if __name__ == "__main__":
    files = generate_og_images()
    print(f"generated {len(files)} OG cards -> {OUT_DIR}")
