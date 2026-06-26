# Socialyze — AI Social Media Management

An AI-powered social media management platform — publishing, scheduling, analytics,
competitor intelligence, and a unified inbox. Built with Next.js, TypeScript, Tailwind,
and the Claude API.

> Inspired by Hootsuite & Sprout Social, with deeper AI baked into every workflow.

## Features

| Pillar | Status | What it does |
|---|---|---|
| **Dashboard** | ✅ UI | KPIs, connected accounts, upcoming & pending posts |
| **Compose / Publishing** | ✅ UI + AI | Multi-platform composer with a **live Claude caption writer** |
| **Calendar / Scheduling** | ✅ UI | 7-day calendar, best-time hints, bulk schedule |
| **Reports & Analytics** | ✅ UI | Charts, top posts, exportable reports, **AI insights** |
| **Competitor Dashboard** | ✅ UI | Share-of-voice, benchmarks, **AI competitive summary** |
| **Unified Inbox** | ✅ UI | Comments/DMs/mentions, AI sentiment + priority triage |

### AI features (powered by Claude)
- **Caption generator** — platform-aware, tone-controlled, with hashtags. *(wired end-to-end)*
- **Performance insights** — plain-English "why it worked + what to do next."
- **Competitive summaries** — what's working for rivals this week.
- **Inbox triage & reply drafting** — sentiment/priority sorting and on-brand replies.

The caption writer is fully functional via `POST /api/ai/caption`; the other AI
surfaces are scaffolded in the UI and share the same `src/lib/ai.ts` client, ready
to be wired up next.

## Getting started

```bash
npm install
cp .env.example .env.local      # add your ANTHROPIC_API_KEY
npm run dev                     # http://localhost:3000
```

Without an API key the AI features return clearly-labelled demo output; add
`ANTHROPIC_API_KEY` to switch them to real Claude.

## Deploy it live — free, no credit card

The app is built to run on free serverless tiers: persistence degrades to
in-memory when the filesystem is read-only, and scheduling works primarily via
an opportunistic request-time sweep (scheduled posts publish whenever anyone
opens the app), backed by a once-a-day Vercel Cron (`vercel.json`). The cron is
set to daily (`0 0 * * *`) because Vercel's free Hobby tier only allows daily
cron jobs — the request-time sweep covers the gaps, so no paid plan is needed.

### Option A — Vercel (recommended, ~2 min)
1. Push this repo to GitHub (already done if you're reading this there).
2. Go to **[vercel.com/new](https://vercel.com/new)**, sign in with GitHub (free, no card).
3. **Import** this repository → **Deploy**. That's it — you get a public
   `https://<your-app>.vercel.app` URL.
4. (Optional) In **Settings → Environment Variables**, add `ANTHROPIC_API_KEY`
   to turn on real Claude AI, then redeploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aistudio-pantheon/social-media-management)

### Option B — Render (free, keeps the live scheduler running)
A `render.yaml` blueprint is included. On **[render.com](https://render.com)**:
New + → **Blueprint** → pick this repo → Apply. Render's free web service stays
alive, so the in-process scheduler runs continuously (no cron needed).

> **Free-tier note:** without a database, data resets on a cold start. To make
> it permanent for free, add a free Postgres (Neon / Supabase) and set
> `DATABASE_URL` — the store's access functions in `src/lib/store.ts` are the
> only thing to swap.

### Going fully live (real posting)
Sandbox mode publishes to a simulator so everything works today. To post for
real, register a developer app on each network (Meta, X, LinkedIn), pass their
review, and add the OAuth secrets from `.env.example` to your host's
environment variables. The gateway (`src/lib/gateway.ts`) flips that platform
to live automatically — no code change.

## Architecture

```
src/
  app/
    page.tsx              Dashboard
    compose/              AI composer (client) + uses /api/ai/caption
    calendar/             Scheduling calendar
    analytics/            Reports & charts (recharts)
    competitors/          Competitor benchmarking
    inbox/                Unified social inbox
    api/ai/caption/       Claude-backed caption endpoint
  components/             Sidebar, PageHeader
  lib/
    ai.ts                 Shared Claude client + content helpers
    types.ts              Domain models (Post, Account, Competitor, …)
    mockData.ts           Demo data — swap for a real DB/platform APIs
    ui.tsx                Shared UI helpers (badges, formatters)
```

### How it's built to scale to a real product
- **Mock data layer** (`lib/mockData.ts`) is isolated — replace each export with a
  DB query (PostgreSQL recommended) without touching the UI.
- **Platform adapter pattern** — each network (Meta, X, LinkedIn, TikTok…) becomes a
  pluggable module behind a common publish/fetch interface.
- **AI through one client** (`lib/ai.ts`) — add repurposing, insights, and reply
  drafting as new helpers there.

## Roadmap (next)
1. **Persistence** — PostgreSQL + Prisma for accounts, posts, analytics.
2. **Real publishing** — OAuth + platform adapters (Meta Graph, X v2, LinkedIn).
3. **Scheduling engine** — BullMQ/Redis job queue for timed publishing.
4. **More AI** — repurposing (1 input → N posts), AI insights & reply drafting.
5. **Team workflows** — roles, approvals, audit log, multi-workspace (agencies).

## Tech stack
Next.js 14 · React 18 · TypeScript · Tailwind CSS · Recharts · Claude API
(`@anthropic-ai/sdk`).
