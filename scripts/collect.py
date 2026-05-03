import hashlib
import json
import os
import time
from datetime import datetime
from typing import Any

import feedparser
import requests as req
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

RSS_FEEDS = [
    "https://aitimes.com/rss/allArticle.xml",
    "https://www.etnews.com/rss/section/1",
]

CATEGORIES = {"economy", "ai", "policy", "market"}


def require_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    joined_names = " or ".join(names)
    raise RuntimeError(f"{joined_names} is required")


def optional_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    return ""


SUPABASE_URL = require_env("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = require_env(
    "SUPABASE_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
)
OPENROUTER_API_KEY = require_env("OPENROUTER_API_KEY")
DART_API_KEY = optional_env("DART_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def slug_for(url: str) -> str:
    return hashlib.md5(url.encode("utf-8")).hexdigest()[:12]


def is_duplicate(source_url: str) -> bool:
    result = (
        supabase.table("articles")
        .select("id")
        .eq("source_url", source_url)
        .limit(1)
        .execute()
    )
    return bool(result.data)


def rewrite_to_english(title: str, summary: str) -> str:
    response = req.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kaibrief.com",
            "X-Title": "KAI Brief",
        },
        json={
            "model": "google/gemini-2.0-flash-exp:free",
            "messages": [
                {
                    "role": "user",
                    "content": f"""
You are an English financial journalist covering Korean economy and AI.
Rewrite into original English article for global readers.
150-200 words, add global context. Factual only.

Korean Title: {title}
Korean Summary: {summary}

Return JSON only:
{{"title":"...","body":"...","summary":"...","category":"economy|ai|policy|market","tags":["tag1","tag2"]}}
""".strip(),
                }
            ],
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def parse_rewrite(raw_text: str) -> dict[str, Any]:
    cleaned = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
    parsed = json.loads(cleaned)
    parsed["category"] = parsed.get("category", "economy").lower()
    if parsed["category"] not in CATEGORIES:
        parsed["category"] = "economy"
    return parsed


def rewrite_article(title: str, body: str) -> dict[str, Any]:
    return parse_rewrite(rewrite_to_english(title, body))


def collect_rss_items() -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for feed_url in RSS_FEEDS:
        feed = feedparser.parse(feed_url)
        for entry in feed.entries[:10]:
            items.append(
                {
                    "title": entry.get("title", ""),
                    "body": entry.get("summary", "") or entry.get("description", ""),
                    "source_url": entry.get("link", ""),
                    "source_name": feed.feed.get("title", "RSS Feed"),
                }
            )
    return items


def collect_dart_items() -> list[dict[str, str]]:
    if not DART_API_KEY:
        return []

    today = datetime.utcnow().strftime("%Y%m%d")
    response = req.get(
        "https://opendart.fss.or.kr/api/list.json",
        params={
            "crtfc_key": DART_API_KEY,
            "bgn_de": today,
            "end_de": today,
            "pblntf_ty": "A",
            "page_count": 10,
        },
        timeout=20,
    )
    response.raise_for_status()
    data = response.json()

    items: list[dict[str, str]] = []
    for item in data.get("list", []):
        report_url = f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={item.get('rcept_no')}"
        items.append(
            {
                "title": item.get("report_nm", ""),
                "body": f"{item.get('corp_name', '')} filed {item.get('report_nm', '')}.",
                "source_url": report_url,
                "source_name": "DART",
            }
        )
    return items


def insert_article(item: dict[str, str], rewritten: dict[str, Any]) -> None:
    source_url = item["source_url"]
    payload = {
        "title_en": rewritten["title"],
        "body_en": rewritten["body"],
        "summary_en": rewritten["summary"],
        "category": rewritten["category"],
        "source_url": source_url,
        "source_name": item["source_name"],
        "tags": rewritten.get("tags", []),
        "slug": slug_for(source_url),
        "is_published": True,
    }
    supabase.table("articles").insert(payload).execute()


def main() -> None:
    items = collect_rss_items() + collect_dart_items()
    print(f"Collected {len(items)} candidates")

    for item in items:
        try:
            source_url = item.get("source_url", "")
            if not source_url or is_duplicate(source_url):
                continue

            rewritten = rewrite_article(item.get("title", ""), item.get("body", ""))
            insert_article(item, rewritten)
            print(f"Inserted: {rewritten['title']}")
            time.sleep(2)
        except Exception as exc:
            print(f"Failed item {item.get('source_url')}: {exc}")


if __name__ == "__main__":
    main()
