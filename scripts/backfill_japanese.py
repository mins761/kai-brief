import json
import os
import time
from typing import Any

import requests as req
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()


def require_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    joined_names = " or ".join(names)
    raise RuntimeError(f"{joined_names} is required")


SUPABASE_URL = require_env("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = require_env(
    "SUPABASE_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
)
OPENROUTER_API_KEY = require_env("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-oss-120b:free")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def parse_json(raw_text: str) -> dict[str, str]:
    cleaned = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(cleaned)


def translate_article(article: dict[str, Any]) -> dict[str, str]:
    response = req.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kaibrief.com",
            "X-Title": "KAI Brief",
        },
        json={
            "model": OPENROUTER_MODEL,
            "max_tokens": 900,
            "messages": [
                {
                    "role": "user",
                    "content": f"""
Translate this KAI Brief article into natural Japanese for Japanese readers.
Keep facts, names, numbers, and dates accurate.
Use a concise news style, not promotional language.
Return JSON only.

English title: {article.get("title_en", "")}
English summary: {article.get("summary_en", "")}
English body: {article.get("body_en", "")}

Return:
{{"title_ja":"...","summary_ja":"...","body_ja":"..."}}
""".strip(),
                }
            ],
        },
        timeout=60,
    )
    if not response.ok:
        print(f"OpenRouter status: {response.status_code}")
        print(f"OpenRouter response: {response.text[:500]}")
        response.raise_for_status()

    data = response.json()
    return parse_json(data["choices"][0]["message"]["content"])


def fetch_articles(limit: int) -> list[dict[str, Any]]:
    response = (
        supabase.table("articles")
        .select("id,title_en,summary_en,body_en,title_ja,summary_ja,body_ja")
        .eq("is_published", True)
        .order("published_at", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data or []


def main() -> None:
    limit = int(os.environ.get("BACKFILL_LIMIT", "50"))
    articles = fetch_articles(limit)
    missing = [
        article
        for article in articles
        if not article.get("title_ja")
        or not article.get("summary_ja")
        or not article.get("body_ja")
    ]
    print(f"Found {len(missing)} articles missing Japanese fields.")

    for index, article in enumerate(missing, start=1):
        translated = translate_article(article)
        payload = {
            "title_ja": translated.get("title_ja"),
            "summary_ja": translated.get("summary_ja"),
            "body_ja": translated.get("body_ja"),
        }
        supabase.table("articles").update(payload).eq("id", article["id"]).execute()
        print(f"[{index}/{len(missing)}] Updated: {article.get('title_en')}")
        time.sleep(1)


if __name__ == "__main__":
    main()
