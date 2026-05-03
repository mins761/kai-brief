# KAI Brief

KAI Brief is a Next.js 14 news media site for Korea's AI and economy news in English.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase
- Python collector with OpenRouter Gemini and DART support

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in Supabase keys:

```bash
cp .env.example .env.local
```

3. Create Supabase tables by running `supabase.sql` in the Supabase SQL editor.

4. Start the app:

```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` defaults to `google/gemini-2.5-flash-lite`
- `DART_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Collector

The collector reads Korean RSS feeds and DART disclosures, rewrites new items in English through OpenRouter, and inserts them into Supabase.

```bash
pip install feedparser requests supabase python-dotenv
python scripts/collect.py
```

GitHub Actions runs `.github/workflows/collect.yml` every two hours. Add these repository secrets:

- `OPENROUTER_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `DART_API_KEY`

## Deployment

Deploy to Vercel and add the same environment variables in the Vercel project dashboard. Replace `ca-pub-XXXXXXXX`, analytics placeholders, and `NEXT_PUBLIC_SITE_URL` before production launch.
