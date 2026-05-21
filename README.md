# StackPicks

> The curated directory of open-source dev tools. Builder POV, not just star counts.

**Domain:** stackpicks.dev
**Stack:** Next.js 15 + Supabase + Razorpay + Vercel
**Owner:** Piyush Jangir

---

## For Piyush — Start Here

Open these in order:

1. `CLAUDE-CODE-START.md` — If you're starting a Claude Code session
2. `PROJECT-CONTEXT.md` — The single master document (16 sections, everything)
3. `launch/QUICK-START.md` — Your 48-hour weekend deploy plan
4. `CLAUDE.md` — Project rules + architecture for Claude Code

## For Claude Code — Start Here

Open `CLAUDE-CODE-START.md` first. Don't propose features unprompted.

---

## What This Is

A public directory of open-source dev tools across 22 categories
(UI, animation, AI, auth, payments, databases, etc.). Every repo
entry has a curator take (1 paragraph opinion) plus "use this if"
and "skip if" guidance. Not just star counts.

## Monetization (5 rails wired in v1)

1. Sponsored listings — Razorpay subscription, INR 2,500-10,000/month
2. Affiliate links — outbound clicks via affiliate URLs
3. Premium tier (₹299/mo) — weekly deep dives, members-only Discord
4. Newsletter sponsorships — manual sales
5. Job board — flat ₹5,000 per 30-day listing (Phase 2)

Realistic Year 1 revenue: ₹14k/mo by month 6 → ₹65-70k/mo by month 12.

## Quick Setup

```bash
# 1. Install
pnpm install

# 2. Environment
cp .env.example .env.local
# Fill in: Supabase, GitHub PAT, Razorpay, Resend

# 3. Database
pnpm db:push

# 4. Seed (104 repos with curator takes)
npx tsx scripts/seed.ts

# 5. Run
pnpm dev
```

Full setup steps in `docs/SETUP.md` and `launch/QUICK-START.md`.

## Repository Structure

```
stackpicks/
├── apps/web/             Next.js 15 app
├── core/                 Shared logic (DRY layer)
├── supabase/migrations/  DB schema + RLS
├── scripts/              Seed script + 104 repos data
├── docs/                 Setup, Architecture, Monetization
├── launch/               Quick-start, posts, sponsor outreach
└── .claude/commands/     Claude Code custom commands
```

See `PROJECT-CONTEXT.md` for the full tree explanation.

## Engineering Rules (Immutable)

- All business logic in `/core/` (DRY)
- RLS mandatory on every Supabase table
- INR only, Razorpay only — never Stripe
- TypeScript strict, no `any` without `// reason:`
- No emoji in code
- IST in UI, UTC in DB
- All money as integer paise in DB

Full rules in `CLAUDE.md`.

---

Built with intent. Shipped solo. Compound the takes.
