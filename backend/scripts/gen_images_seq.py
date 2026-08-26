import asyncio
import base64
import os

from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT = "/app/frontend/public/images/domains"
os.makedirs(OUT, exist_ok=True)

STYLE = (
    ", minimalist dark futuristic illustration on a pure black background, "
    "glowing neon chartreuse acid-green (#CCFF00) accent lighting, subtle thin grid lines, "
    "premium fintech aesthetic, cinematic, high contrast, no text, no letters, no words, no watermark"
)

PROMPTS = {
    "transfermoney": "Glowing streams of digital money flowing between two abstract city skylines",
    "transfercoin": "A golden digital coin dissolving into green light particles as it passes through a portal",
    "cointransfer": "Two luminous coins exchanging orbits around a glowing core",
    "transfercash": "A paper banknote dissolving into glowing digital pixels mid-air",
    "cashtransfer": "A futuristic neon vault door opening with light rays streaming out",
    "ai-tools": "A floating holographic toolbox filled with glowing neural network tools",
    "aiwebtools": "A holographic browser window with a neural network growing inside it",
    "aimainframe": "A massive monolithic server mainframe glowing with circuits in a dark hall",
    "aitoolscompany": "A corporate glass tower built from glowing circuitry patterns at night",
    "robotsales": "A sleek humanoid robot presenting a glowing product on a pedestal in a showroom",
    "robotshop": "A cozy futuristic storefront with a small friendly robot in the window at night",
    "robotstore": "Dark warehouse shelves stocked with glowing robotic parts and android arms",
    "worldpeace": "A glowing dove formed of light particles flying over planet earth in darkness",
    "worldtrade": "Planet earth wrapped in glowing trade routes and shipping lines of light",
    "worldtrader": "A silhouetted trader in front of a giant holographic glowing globe with charts",
}


async def gen(slug, prompt):
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"img-{slug}-{os.getpid()}",
        system_message="You generate images.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )
    text, images = await chat.send_message_multimodal_response(
        UserMessage(text=prompt + STYLE)
    )
    if images:
        with open(f"{OUT}/{slug}.png", "wb") as f:
            f.write(base64.b64decode(images[0]["data"]))
        return True
    return False


async def main():
    for slug, prompt in PROMPTS.items():
        path = f"{OUT}/{slug}.png"
        if os.path.exists(path) and os.path.getsize(path) > 10000:
            print(f"SKIP {slug}", flush=True)
            continue
        ok = False
        for attempt in range(4):
            try:
                ok = await gen(slug, prompt)
            except Exception as e:
                print(f"RETRY {slug} attempt {attempt + 1}: {str(e)[:80]}", flush=True)
            if ok:
                print(f"OK {slug}", flush=True)
                break
            await asyncio.sleep(20)
        if not ok:
            print(f"FAIL {slug}", flush=True)
        await asyncio.sleep(8)


asyncio.run(main())
print("DONE", flush=True)
