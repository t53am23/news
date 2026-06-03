# Choyis news

Premium hybrid news, policy, visa, and trend intelligence platform built with Next.js, TypeScript, Tailwind CSS, shadcn-compatible primitives, Lucide icons, and Supabase Edge Functions.

## Current build

- Premium responsive UI with mock SignalBrief data.
- Internal brief/detail pages for every content card.
- Source directory with API, RSS, official update page, and directory-only modes.
- Visa country landing pages and sensitive-topic disclaimers.
- SEO metadata, sitemap, robots, schema.org brief detail markup, and PWA manifest/icons.
- Supabase Edge Function scaffolding for RSS/API fetching, source normalization, caching, and support messages.

## Development

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and keep provider keys server-side. Frontend code should call Supabase Edge Functions rather than external APIs directly.

## Supabase

Run the migration in `supabase/migrations/0001_cache_and_support.sql`, then deploy:

```bash
supabase functions deploy fetch-content
supabase functions deploy support-contact
```

Required secrets:

```bash
supabase secrets set GUARDIAN_API_KEY=...
supabase secrets set GNEWS_API_KEY=...
supabase secrets set GITHUB_TOKEN=...
```

`YOUTUBE_API_KEY` can be added when video briefs move from mock data to the YouTube Data API.

## Compliance rules

- Do not scrape full copyrighted articles.
- Do not store full article text.
- Store permitted metadata, summaries, feed descriptions, thumbnails, source details, tags, categories, original URLs, and cache timestamps only.
- Keep source attribution visible on cards and brief pages.
- Visa, immigration, health, finance, policy, and legal topics must show the sensitive-topic disclaimer.
