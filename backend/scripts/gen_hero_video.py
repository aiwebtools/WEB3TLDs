import os
import sys

from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(""))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

load_dotenv()

OUTPUT = "/app/frontend/public/videos/hero-ai.mp4"

PROMPT = (
    "Dark futuristic cyberspace abstract background: a slow, smooth camera drift through "
    "a vast glowing network of neon acid-green (#CCFF00) nodes, thin light filaments and "
    "data streams floating in pure black space, faint cyan accents, subtle depth of field, "
    "gentle seamless ambient motion suitable for an infinite loop, cinematic, moody, "
    "high-end sci-fi minimalism, no text, no people, no logos"
)


def main():
    video_gen = OpenAIVideoGeneration(api_key=os.environ["EMERGENT_LLM_KEY"])
    video_bytes = video_gen.text_to_video(
        prompt=PROMPT,
        model="sora-2",
        size="1280x720",
        duration=8,
        max_wait_time=600,
    )
    if video_bytes:
        video_gen.save_video(video_bytes, OUTPUT)
        print(f"OK saved to {OUTPUT}")
    else:
        print("FAIL video generation returned nothing")


if __name__ == "__main__":
    main()
