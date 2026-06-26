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

Without an API key the UI runs on mock data; only the AI caption generation
needs `ANTHROPIC_API_KEY`.

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
