import importlib.util
import os
import sys
import types
import unittest
from pathlib import Path


class FakeTable:
    def select(self, *_args, **_kwargs):
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def insert(self, payload):
        self.payload = payload
        return self

    def execute(self):
        return types.SimpleNamespace(data=[])


class CollectTweetingTests(unittest.TestCase):
    def load_collect(self):
        os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
        os.environ.setdefault("SUPABASE_KEY", "anon-key")
        os.environ.setdefault("OPENROUTER_API_KEY", "openrouter-key")

        sys.modules["feedparser"] = types.SimpleNamespace(parse=lambda _url: None)
        sys.modules["dotenv"] = types.SimpleNamespace(load_dotenv=lambda: None)
        sys.modules["requests"] = types.SimpleNamespace()
        sys.modules["tweepy"] = types.SimpleNamespace(
            Client=lambda **_kwargs: types.SimpleNamespace(create_tweet=lambda **_kw: None)
        )
        sys.modules["supabase"] = types.SimpleNamespace(
            create_client=lambda *_args, **_kwargs: types.SimpleNamespace(
                table=lambda _name: FakeTable()
            )
        )

        module_path = Path(__file__).with_name("collect.py")
        spec = importlib.util.spec_from_file_location("collect_under_test", module_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def test_post_tweet_uses_article_fields_and_caps_text_at_280_chars(self):
        collect = self.load_collect()
        calls = []
        collect.x_client = types.SimpleNamespace(
            create_tweet=lambda **kwargs: calls.append(kwargs)
        )
        collect.time.sleep = lambda _seconds: None

        collect.post_tweet(
            {
                "category": "ai",
                "title_en": "Korean AI chip startup raises funding",
                "summary_en": "A" * 180,
                "slug": "abc123",
            }
        )

        self.assertEqual(len(calls), 1)
        text = calls[0]["text"]
        self.assertLessEqual(len(text), 280)
        self.assertTrue(text.startswith("\U0001f916 Korean AI chip startup raises funding"))
        self.assertIn("https://kai-brief.vercel.app/article/abc123", text)
        self.assertIn("#Korea #KAIBrief #Ai", text)
        self.assertIs(calls[0]["user_auth"], True)

    def test_x_credential_report_masks_secret_values(self):
        collect = self.load_collect()
        collect.os.environ["X_API_KEY"] = "raw-api-key"
        collect.os.environ["X_API_SECRET"] = "raw-api-secret"
        collect.os.environ["X_ACCESS_TOKEN"] = "raw-access-token"
        collect.os.environ["X_ACCESS_TOKEN_SECRET"] = "raw-access-token-secret"

        report = collect.x_credential_report()

        self.assertIn("X_API_KEY=set len=11 sha256=", report)
        self.assertIn("X_ACCESS_TOKEN_SECRET=set len=23 sha256=", report)
        self.assertNotIn("raw-api-key", report)
        self.assertNotIn("raw-access-token-secret", report)

    def test_main_tweets_only_after_successful_insert_for_non_duplicates(self):
        collect = self.load_collect()
        tweeted = []

        collect.collect_rss_items = lambda: [
            {
                "title": "Fresh article",
                "body": "Fresh body",
                "source_url": "https://example.com/fresh",
                "source_name": "Example",
            },
            {
                "title": "Duplicate article",
                "body": "Duplicate body",
                "source_url": "https://example.com/duplicate",
                "source_name": "Example",
            },
        ]
        collect.collect_dart_items = lambda: []
        collect.is_duplicate = lambda source_url: source_url.endswith("duplicate")
        collect.rewrite_article = lambda _title, _body: {
            "title": "Fresh EN",
            "body": "Body EN",
            "summary": "Summary EN",
            "category": "economy",
            "tags": ["tag"],
        }
        collect.insert_article = lambda item, rewritten: {
            "title_en": rewritten["title"],
            "summary_en": rewritten["summary"],
            "category": rewritten["category"],
            "slug": collect.slug_for(item["source_url"]),
        }
        collect.post_tweet = lambda article: tweeted.append(article)
        collect.time.sleep = lambda _seconds: None

        collect.main()

        self.assertEqual(len(tweeted), 1)
        self.assertEqual(tweeted[0]["title_en"], "Fresh EN")


if __name__ == "__main__":
    unittest.main()
