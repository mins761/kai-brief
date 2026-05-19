import hashlib
import json
import os
import sys
import time
from datetime import datetime
from typing import Any

import feedparser
import requests as req
import tweepy
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

RSS_FEEDS = [
    "https://aitimes.com/rss/allArticle.xml",
    "https://www.etnews.com/rss/section/1",
    "https://www.soompi.com/feed",
    "https://www.allkpop.com/rss",
    "https://english.visitkorea.or.kr/rss/news.rss",
    "https://www.koreatimes.co.kr/www/rss/rss.xml",
]

CATEGORIES = {"economy", "ai", "policy", "market", "culture", "beauty", "travel"}


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


def safe_print(message: str) -> None:
    try:
        print(message)
    except UnicodeEncodeError:
        encoding = sys.stdout.encoding or "utf-8"
        print(message.encode(encoding, errors="replace").decode(encoding))


def credential_fingerprint(name: str) -> str:
    value = os.environ.get(name, "")
    if not value:
        return f"{name}=MISSING"

    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()[:10]
    return f"{name}=set len={len(value)} sha256={digest}"


def x_credential_report() -> str:
    names = [
        "X_API_KEY",
        "X_API_SECRET",
        "X_ACCESS_TOKEN",
        "X_ACCESS_TOKEN_SECRET",
    ]
    return "X credential check: " + ", ".join(
        credential_fingerprint(name) for name in names
    )


SUPABASE_URL = require_env("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = require_env(
    "SUPABASE_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
)
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-oss-120b:free")
UNSPLASH_ACCESS_KEY = optional_env("UNSPLASH_ACCESS_KEY")
DART_API_KEY = optional_env("DART_API_KEY")
TMDB_API_KEY = optional_env("TMDB_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is required")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
x_client = tweepy.Client(
    consumer_key=os.environ.get("X_API_KEY"),
    consumer_secret=os.environ.get("X_API_SECRET"),
    access_token=os.environ.get("X_ACCESS_TOKEN"),
    access_token_secret=os.environ.get("X_ACCESS_TOKEN_SECRET"),
)


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


def rewrite_to_english(title: str, summary: str, tmdb_context: str = "") -> str:
    print(f"API Key exists: {bool(OPENROUTER_API_KEY)}")
    print(
        "API Key prefix: "
        f"{OPENROUTER_API_KEY[:6]}..." if OPENROUTER_API_KEY else "API Key prefix: None"
    )
    print(f"OpenRouter model: {OPENROUTER_MODEL}")

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
            "max_tokens": 2600,
            "messages": [
                {
                    "role": "user",
                    "content": f"""
You are an English financial journalist covering Korean economy and AI.
Rewrite the source material into an original, useful KAI Brief article for global readers.
Write 650-900 English words with enough context for a standalone publisher page.
Do not copy the source wording. Do not invent facts, quotes, numbers, dates, or claims that are not supported by the source material or the provided context.
Make the article analytical and helpful, not a thin rewrite.
Use Markdown-style section headings inside body:
- Start with a strong 2-3 paragraph news lead.
- Add 3-5 H2 sections using "##".
- Include at least one short bullet list only when it genuinely helps the reader.
- Include a "## What to watch next" section near the end.
Vary sentence length on purpose. Mix short and longer sentences, and avoid overly rigid list-style prose.
Explain technical, policy, financial, or entertainment-industry terms in plain language when needed.
Keep a calm editorial voice. Avoid hype, clickbait, promotional language, and generic AI-sounding phrases.
Also create a natural Japanese version for Japanese readers.
Japanese body should be 500-800 Japanese characters with short paragraphs and clear context.

For culture reviews or entertainment coverage:
- Be honest and balanced.
- Include both strengths AND weaknesses.
- Do NOT be overly promotional.
- Mention season/episode count if relevant.
- When TMDB season data is provided, keep each season separate and use the exact season_number values.

Korean Title: {title}
Korean Summary: {summary}
TMDB Season Context: {tmdb_context or "Not available"}

Category guidance:
- culture: K-Pop, K-Drama, Korean entertainment
- beauty: K-Beauty, skincare, cosmetics
- travel: Korea tourism, travel destinations
- economy: Korean economy, business, companies, trade
- ai: artificial intelligence, chips, automation, technology
- policy: government policy, regulation, public affairs
- market: finance, stocks, bonds, currencies

Return JSON only:
{{"title":"...","body":"...","summary":"...","title_ja":"...","body_ja":"...","summary_ja":"...","category":"economy|ai|policy|market|culture|beauty|travel","tags":["tag1","tag2"]}}
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
    return data["choices"][0]["message"]["content"]


def parse_rewrite(raw_text: str) -> dict[str, Any]:
    cleaned = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
    parsed = json.loads(cleaned)
    parsed["category"] = parsed.get("category", "economy").lower()
    if parsed["category"] not in CATEGORIES:
        parsed["category"] = "economy"
    return parsed


def rewrite_article(title: str, body: str) -> dict[str, Any]:
    tmdb_context = get_tmdb_season_context(title, body)
    return parse_rewrite(rewrite_to_english(title, body, tmdb_context))


def post_tweet(article: dict[str, Any]) -> None:
    category_emoji = {
        "economy": "📊",
        "ai": "🤖",
        "culture": "🎵",
        "beauty": "💄",
        "travel": "✈️",
        "market": "📈",
        "policy": "🏛️",
    }
    emoji = category_emoji.get(article["category"], "🇰🇷")

    tweet = f"""{emoji} {article['title_en']}

{article['summary_en'][:100]}...

👉 https://kai-brief.vercel.app/article/{article['slug']}

#Korea #KAIBrief #{article['category'].capitalize()}"""

    try:
        safe_print(f"API_KEY: {os.environ.get('X_API_KEY', 'MISSING')[:6]}")
        safe_print(f"API_SECRET: {os.environ.get('X_API_SECRET', 'MISSING')[:6]}")
        safe_print(
            f"ACCESS_TOKEN: {os.environ.get('X_ACCESS_TOKEN', 'MISSING')[:6]}"
        )
        safe_print(
            "ACCESS_TOKEN_SECRET: "
            f"{os.environ.get('X_ACCESS_TOKEN_SECRET', 'MISSING')[:6]}"
        )
        safe_print(x_credential_report())
        x_client.create_tweet(text=tweet[:280], user_auth=True)
        safe_print(f"✅ Tweeted: {article['title_en']}")
        time.sleep(3)
    except Exception as exc:
        safe_print(f"❌ Tweet failed: {exc}")


def infer_category(title: str, summary: str) -> str | None:
    text = f"{title} {summary}".lower()
    keyword_categories = {
        "culture": ["kpop", "k-pop", "drama", "bts", "blackpink", "kdrama", "k-drama"],
        "beauty": ["beauty", "skincare", "skin care", "makeup", "cosmetic", "cosmetics"],
        "travel": ["travel", "tourism", "jeju", "seoul", "visit"],
    }

    for category, keywords in keyword_categories.items():
        if any(keyword in text for keyword in keywords):
            return category
    return None


def should_fetch_tmdb(title: str, summary: str) -> bool:
    if not TMDB_API_KEY:
        return False

    text = f"{title} {summary}".lower()
    keywords = [
        "k-drama",
        "kdrama",
        "drama",
        "series",
        "season",
        "episode",
        "netflix",
        "disney+",
        "tvn",
    ]
    return infer_category(title, summary) == "culture" or any(
        keyword in text for keyword in keywords
    )


def format_tmdb_seasons(show: dict[str, Any]) -> str:
    seasons = show.get("seasons", [])
    if not seasons:
        return ""

    lines = [
        f"TV show: {show.get('name') or show.get('original_name', 'Unknown')}",
        "Seasons:",
    ]
    for season in sorted(seasons, key=lambda item: item.get("season_number", 0)):
        season_number = season.get("season_number")
        episode_count = season.get("episode_count")
        name = season.get("name") or f"Season {season_number}"
        air_date = season.get("air_date") or "unknown air date"
        lines.append(
            "- "
            f"season_number={season_number}; "
            f"name={name}; "
            f"episode_count={episode_count}; "
            f"air_date={air_date}"
        )
    return "\n".join(lines)


def get_tmdb_season_context(title: str, summary: str) -> str:
    if not should_fetch_tmdb(title, summary):
        return ""

    query = title.split(":")[0].strip()
    if not query:
        return ""

    search_response = req.get(
        "https://api.themoviedb.org/3/search/tv",
        params={"api_key": TMDB_API_KEY, "query": query, "include_adult": "false"},
        timeout=20,
    )
    if not search_response.ok:
        print(f"TMDB search status: {search_response.status_code}")
        print(f"TMDB search response: {search_response.text[:300]}")
        return ""

    results = search_response.json().get("results", [])
    if not results:
        return ""

    show_id = results[0].get("id")
    if not show_id:
        return ""

    detail_response = req.get(
        f"https://api.themoviedb.org/3/tv/{show_id}",
        params={"api_key": TMDB_API_KEY},
        timeout=20,
    )
    if not detail_response.ok:
        print(f"TMDB detail status: {detail_response.status_code}")
        print(f"TMDB detail response: {detail_response.text[:300]}")
        return ""

    return format_tmdb_seasons(detail_response.json())


def get_unsplash_image(keyword: str) -> str | None:
    if not UNSPLASH_ACCESS_KEY or not keyword:
        return None

    response = req.get(
        "https://api.unsplash.com/search/photos",
        params={
            "query": keyword,
            "per_page": 1,
            "orientation": "landscape",
        },
        headers={
            "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}",
        },
        timeout=20,
    )

    if not response.ok:
        print(f"Unsplash status: {response.status_code}")
        print(f"Unsplash response: {response.text[:300]}")
        return None

    data = response.json()
    results = data.get("results", [])
    if results:
        return results[0].get("urls", {}).get("regular")
    return None


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


def insert_article(item: dict[str, str], rewritten: dict[str, Any]) -> dict[str, Any]:
    source_url = item["source_url"]
    inferred_category = infer_category(item.get("title", ""), item.get("body", ""))
    if inferred_category:
        rewritten["category"] = inferred_category

    keyword = " ".join(str(rewritten["title"]).split()[:3])
    image_url = get_unsplash_image(keyword)
    payload = {
        "title_en": rewritten["title"],
        "body_en": rewritten["body"],
        "summary_en": rewritten["summary"],
        "title_ja": rewritten.get("title_ja"),
        "body_ja": rewritten.get("body_ja"),
        "summary_ja": rewritten.get("summary_ja"),
        "category": rewritten["category"],
        "source_url": source_url,
        "source_name": item["source_name"],
        "tags": rewritten.get("tags", []),
        "slug": slug_for(source_url),
        "image_url": image_url,
        "is_published": True,
    }
    try:
        supabase.table("articles").insert(payload).execute()
    except Exception as exc:
        if any(column in str(exc) for column in ["title_ja", "body_ja", "summary_ja"]):
            print("Japanese article columns are unavailable; inserting article without Japanese fields.")
            payload.pop("title_ja", None)
            payload.pop("body_ja", None)
            payload.pop("summary_ja", None)
            supabase.table("articles").insert(payload).execute()
            return payload

        if "image_url" not in str(exc):
            raise

        print("articles.image_url is unavailable; inserting article without image_url.")
        payload.pop("image_url", None)
        supabase.table("articles").insert(payload).execute()

    return payload


def main() -> None:
    items = collect_rss_items() + collect_dart_items()
    print(f"Collected {len(items)} candidates")

    for item in items:
        try:
            source_url = item.get("source_url", "")
            if not source_url or is_duplicate(source_url):
                continue

            rewritten = rewrite_article(item.get("title", ""), item.get("body", ""))
            article = insert_article(item, rewritten)
            post_tweet(article)
            print(f"Inserted: {rewritten['title']}")
            time.sleep(2)
        except Exception as exc:
            print(f"Failed item {item.get('source_url')}: {exc}")


if __name__ == "__main__":
    main()
