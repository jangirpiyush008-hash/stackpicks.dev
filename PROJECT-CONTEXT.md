# StackPicks — Complete Project Context

> **For Claude Code:** This is the single source of truth for the StackPicks project.
> Read this end-to-end on your first session. After that, refer to `CLAUDE.md` for daily context.
>
> **For Piyush:** This doc consolidates everything — architecture, monetization, launch plan,
> sponsor strategy. Use it as the briefing doc for any new collaborator (human or AI).

---

# Table of Contents

1. [Project Overview](#1-project-overview)
2. [The Business Case](#2-the-business-case)
3. [Architecture & Stack](#3-architecture--stack)
4. [Repository Structure](#4-repository-structure)
5. [Database Schema](#5-database-schema)
6. [Engineering Rules (NEXUS)](#6-engineering-rules-nexus)
7. [Setup & Deployment](#7-setup--deployment)
8. [Seeding the Database](#8-seeding-the-database)
9. [Monetization Playbook](#9-monetization-playbook)
10. [SEO Strategy](#10-seo-strategy)
11. [Launch Plan (Week 1-3)](#11-launch-plan-week-1-3)
12. [Sponsor Outreach](#12-sponsor-outreach)
13. [Content Compounding (Week 4+)](#13-content-compounding-week-4)
14. [Common Pitfalls](#14-common-pitfalls)
15. [Phase 2 Roadmap](#15-phase-2-roadmap)
16. [Reference: Pricing, Plans, Constants](#16-reference-pricing-plans-constants)

---

# 1. Project Overview

**Name:** StackPicks
**Domain:** stackpicks.dev (Namecheap, ~₹1,200/year)
**Description:** Curated directory of open-source dev tools with opinionated build-or-skip takes per repo.
**Owner:** Piyush Jangir — Head of Affiliate Marketing at HYPD, Gurgaon/Faridabad, India.
**Built in:** May 2026.
**Live target:** Weekend of May 23-24, 2026.

## The differentiator

Other dev-tool directories rank by GitHub star count. StackPicks adds a curator take (1 paragraph plain-English opinion) plus "use this if" and "skip if" guidance to every entry. The takes are the moat — anyone can scrape GitHub, nobody can clone the opinions.

## Initial scope

- 104+ curated repos at launch
- 22 categories (UI, animation, AI, auth, payments, database, etc.)
- All 5 monetization rails wired from day 1
- SEO-ready foundation (sitemap, ISR, structured data)
- Mobile-responsive web only (mobile app deferred to Phase 2)

---

# 2. The Business Case

## Realistic Year 1 revenue model (INR)

| Stage | MAU | Sponsored | Affiliate | Premium | Newsletter | Jobs | **Monthly total** |
|---|---|---|---|---|---|---|---|
| Month 1-3 | <1,000 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | **₹0 (validation)** |
| Month 4-6 | 1k-3k | ₹5k | ₹3k | ₹3k | ₹3k | ₹0 | **₹14k** |
| Month 7-12 | 3k-10k | ₹25k | ₹12k | ₹15k | ₹10k | ₹5k | **₹67k** |
| Year 2 | 10k-30k | ₹70k | ₹25k | ₹40k | ₹30k | ₹40k | **₹2,05,000** |

Directories compound after month 12 as SEO matures. Y2 is when the money shows up if you don't quit.

## The 5 monetization rails

### Rail 1: Sponsored Listings (highest revenue lever)

| Placement | Price/month (INR) | Inventory |
|---|---|---|
| Homepage featured | ₹10,000 | 3 slots |
| Category top | ₹2,500 | 22 categories × 2 slots = 44 |
| Newsletter slot | ₹5,000/send | 4 sends/month |

**Max theoretical:** ₹1,60,000/month at full sellout.
**Realistic at 10k MAU:** 30-40% fill = ₹50-65k/month.

**Pricing strategy:**
- First 3 sponsors: 50% off as "founding sponsors" — locks them in for 6 months
- Months 1-3: Sell at founding-sponsor rates
- Month 4+: Raise to full rate once traffic justifies

### Rail 2: Affiliate Revenue

Best partners for a dev tool directory:
- Vercel referral credits
- Supabase partner program
- Hostinger (India angle) — ₹500-2,000 per signup
- Frontend Masters — 30% recurring
- Razorpay referral bonuses

Realistic at 10k MAU: ₹15,000-30,000/month with 5-8 active partners.

### Rail 3: Premium Tier (₹299/month)

What's gated:
- Weekly "Stack of the Week" deep dives (2,000-word analyses)
- Full collections (curated stacks for specific use cases)
- Members-only Discord
- Newsletter without sponsor blocks
- Early access to new categories

**Conversion benchmark for builder audiences:** 0.5-1.5% of MAU.
At 10k MAU = 50-150 subscribers = ₹15,000-45,000/month.

### Rail 4: Newsletter Sponsorships

Wait until 1,000 confirmed subscribers, then:
- 1k-5k subs: ₹3,000-₹8,000 per send
- 5k-10k subs: ₹10,000-₹20,000 per send
- 10k+ subs: ₹25,000+ per send

### Rail 5: Job Board (Phase 2)

Flat ₹5,000 per 30-day listing. Realistic at 5k MAU: 8-15 listings/month.

## Hidden revenue: lead gen

StackPicks becomes top-of-funnel for Piyush's freelance/consulting work. One ₹3 lakh project pays for hosting forever. Subtle "Need help building? Taking 2 clients/quarter" link in footer (don't be aggressive).

## What NOT to do

- No display ads (AdSense, Carbon) — cheapens brand
- No paywall on the directory itself — that's the SEO play
- No fake sponsored slots to inflate visible inventory
- No "growth hacks" — directories are 12-month compounding plays
- No paid ads in months 1-3 — wait for organic signal

---

# 3. Architecture & Stack

## Why this stack

| Choice | Why over alternatives |
|---|---|
| Next.js 15 over Astro | Need server-side payment flows, auth, sponsor dashboards |
| Supabase over Postgres + Auth0 + S3 | One vendor, Mumbai region for India latency, RLS built in |
| Razorpay over Stripe | Mandatory for INR, better domestic rates, UPI Autopay |
| Tailwind over CSS-in-JS | Bundle size, ecosystem, defaults for shadcn-style components |
| pnpm over npm/yarn | Workspace support, disk efficiency for monorepos |
| Plausible over GA4 | Privacy-friendly, ₹720/year, simpler |
| Vercel over Render/Fly | India edge nodes, ISR support, Hobby tier sufficient for v1 |
| TypeScript strict | Catch class of bugs at compile time |

## The DRY architecture

All business logic in `/core/`. Apps are thin wrappers.

```
apps/
└── web/                  Next.js — UI + routing only
core/                     Shared logic — DRY layer
├── db/                   All Supabase queries
├── github/               GraphQL scraper
├── razorpay/             Payment logic (server-side)
├── seo/                  Structured data, meta
├── types/                Shared interfaces
├── validation/           Zod schemas
├── constants/            Pricing, plans
└── utils/                INR/IST formatters
```

When the mobile app comes (Phase 2), it's a thin wrapper over the same `core/`. Zero rewriting.

## Stack inventory

```
Frontend:      Next.js 15 (App Router, Server Components, ISR)
Database:      Supabase (Postgres, RLS, Auth, Storage, Edge Functions)
Region:        Mumbai (ap-south-1)
Payments:      Razorpay (INR, UPI, subscriptions)
Email:         Resend + react-email
Analytics:     Plausible
Hosting:       Vercel
Domain:        Namecheap → stackpicks.dev
Package mgr:   pnpm 9
Language:      TypeScript strict
Styling:       Tailwind CSS 3.4
Icons:         lucide-react
Validation:    Zod
Auth:          Supabase Auth (later switch to Better Auth if needed)
```

---

# 4. Repository Structure

```
stackpicks/
├── CLAUDE.md                              # Project context for Claude Code
├── README.md                              # Public overview
├── package.json                           # Root workspace
├── pnpm-workspace.yaml
├── .env.example                           # Template — copy to .env.local
├── .gitignore
│
├── apps/
│   └── web/                               # Next.js 15
│       ├── app/
│       │   ├── layout.tsx                 # Root layout, header, footer
│       │   ├── page.tsx                   # Homepage
│       │   ├── globals.css                # Tailwind base
│       │   ├── sitemap.ts                 # Dynamic from DB
│       │   ├── robots.ts                  # robots.txt route
│       │   ├── category/[slug]/page.tsx   # Category listing
│       │   ├── repo/[slug]/page.tsx       # Individual repo page
│       │   ├── go/
│       │   │   ├── repo/[id]/route.ts     # Tracked outbound redirect
│       │   │   └── sponsored/[id]/route.ts # Sponsored click + redirect
│       │   └── api/
│       │       ├── newsletter/route.ts    # POST signup
│       │       ├── cron/scrape-github/    # Daily scraper (Bearer auth)
│       │       ├── checkout/sponsor/      # Razorpay order creation
│       │       └── webhook/razorpay/      # Razorpay event handler
│       ├── next.config.mjs
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       ├── package.json
│       └── vercel.json                    # Cron schedule (2 AM IST)
│
├── core/                                  # Shared logic
│   ├── package.json
│   ├── index.ts
│   ├── types/index.ts
│   ├── constants/index.ts
│   ├── db/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── index.ts
│   ├── github/index.ts
│   ├── razorpay/index.ts
│   ├── seo/index.ts
│   ├── utils/index.ts
│   └── validation/index.ts
│
├── supabase/
│   └── migrations/
│       ├── 20260521000001_init.sql        # All tables + RLS
│       └── 20260521000002_seed_categories.sql # 22 categories
│
├── scripts/
│   ├── package.json
│   ├── seed.ts                            # Run once to populate DB
│   └── seed-data.ts                       # The 104 repos + takes
│
├── docs/
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── MONETIZATION.md
│
├── launch/
│   ├── QUICK-START.md                     # 48-hour weekend plan
│   ├── POSTS.md                           # Launch posts (PH/HN/Reddit/LI/X)
│   └── SPONSOR-OUTREACH.md
│
└── .claude/
    └── commands/                          # Claude Code custom commands
        ├── add-repo.md                    # /add-repo <owner/name>
        ├── ship-check.md                  # /ship-check
        ├── onboard-sponsor.md             # /onboard-sponsor <details>
        └── write-collection.md            # /write-collection <theme>
```

---

# 5. Database Schema

All in `supabase/migrations/20260521000001_init.sql`. Every table has RLS enabled with explicit policies.

## Core entities

```sql
categories (id, slug, name, description, icon, sort_order)
repos (id, github_id, slug, owner, name, full_name, description, homepage,
       github_url, language, topics[], license, stars, forks, open_issues,
       watchers, stars_last_week, pushed_at, github_created_at,
       curator_take, use_this_if, skip_if, is_featured, is_published,
       affiliate_url)
repo_categories (repo_id, category_id)  -- many-to-many
collections (id, slug, title, description, cover_image, is_premium, is_published)
collection_repos (collection_id, repo_id, sort_order, note)  -- many-to-many
```

## Monetization

```sql
sponsors (id, user_id, company_name, contact_email, contact_phone, website,
          gstin, razorpay_customer_id)
sponsored_slots (id, sponsor_id, repo_id, external_name, external_url,
                 external_logo, placement, category_id, starts_at, ends_at,
                 amount_inr, razorpay_subscription_id, razorpay_payment_id,
                 status, impressions, clicks)
premium_subscriptions (id, user_id, razorpay_subscription_id,
                       razorpay_customer_id, plan_id, status,
                       current_period_start, current_period_end, amount_inr)
```

## Engagement

```sql
repo_views (id, repo_id, view_date, view_count)  -- aggregated daily
repo_upvotes (id, repo_id, ip_hash, created_at)  -- IP-hashed, no PII
outbound_clicks (id, repo_id, sponsored_slot_id, destination_url,
                 is_affiliate, is_sponsored, ip_hash, user_agent,
                 referrer, created_at)
newsletter_subs (id, email, source, confirmed, confirmed_at,
                 unsubscribed_at, created_at)
```

## Phase 2 (tables exist, UI not built)

```sql
job_posts (id, user_id, company_name, company_logo, title, description,
           apply_url, location, job_type, remote, salary_min_inr,
           salary_max_inr, required_tags[], amount_paid_inr,
           razorpay_payment_id, is_published, expires_at)
```

## Views

```sql
revenue_summary  -- monthly active sponsor revenue (admin via service role)
```

## RLS Patterns Used

| Pattern | Tables | Behavior |
|---|---|---|
| Public read, no write | categories, repos (published), repo_categories | `SELECT USING (true)` or `USING (is_published = true)` |
| Owner scoped | sponsors, job_posts | `auth.uid() = user_id` on all ops |
| Premium gated | collections (premium), collection_repos | SELECT joins to active subscription |
| Service role only | outbound_clicks, repo_views, newsletter_subs, premium_subscriptions | Writes via webhook/API only |

---

# 6. Engineering Rules (NEXUS)

These are immutable. Every change must comply.

## DRY-first

- All business logic in `/core/`
- `/apps/web/` is UI + routing glue only
- Future `/apps/mobile/` and `/apps/admin/` will reuse `/core/` unchanged

## Database

- RLS mandatory on every table
- All timestamps: UTC in DB, IST in UI
- All money: integer paise in DB (100 paise = ₹1)
- Phone: +91 optional prefix, 10 digits
- Pincode: 6 digits
- GSTIN: 15-char regex

## Payments

- INR only. Razorpay only. **Never integrate Stripe.**
- Server-side signature verification mandatory for both checkouts and webhooks
- Test mode until KYC, then live mode with one end-to-end test before announcing

## TypeScript

- Strict mode on
- No `any` without `// reason:` comment
- No `@ts-ignore` without `// reason:` comment
- DB types regenerated from schema (`pnpm db:types`)

## Security

- Secrets in `.env.local` only
- `.env*` always in `.gitignore`
- Never log secrets or signatures
- IP hashing with daily-rotating salt for analytics — no persistent user identification

## India-first

- Currency: INR. Symbol: ₹ or "Rs" — never "$"
- Timezone: IST in UI
- Region: Mumbai (Supabase ap-south-1)
- Cron schedules in IST (compute UTC offset)

## Code style

- No emoji in code or code comments
- No emoji in commit messages
- UI/marketing copy: minimal emoji only if asked

---

# 7. Setup & Deployment

## Prerequisites

- Node 20+
- pnpm 9+
- Git
- Supabase account (free tier OK for v1)
- Razorpay account (test mode OK initially)
- GitHub Personal Access Token (`public_repo` scope only)
- Resend account (optional for v1 — needed for newsletter)
- Vercel account
- Namecheap account (for domain)

## Local setup (~30 minutes)

```bash
# 1. Clone
git clone <repo-url> stackpicks
cd stackpicks

# 2. Environment
cp .env.example .env.local
# Edit .env.local — fill all values from Supabase, Razorpay, GitHub

# 3. Install
pnpm install

# 4. Database
supabase link --project-ref <your-ref>
pnpm db:push
pnpm db:types

# 5. Seed (fetches live GitHub data, takes ~30 sec)
npx tsx scripts/seed.ts

# 6. Run dev
pnpm dev
# Open http://localhost:3000
```

## Smoke test (~10 minutes)

1. Homepage shows real repos with stars
2. Each category page shows 4-12 repos
3. Repo page shows curator_take, use_this_if, skip_if
4. Click "View on GitHub" → redirects through `/go/repo/[id]`
5. Newsletter form submits without error
6. `/sitemap.xml` returns XML with all routes

## Vercel deploy (~20 minutes)

1. Push to GitHub
2. Vercel → Import project → select `apps/web` as root
3. Build command: `pnpm build`
4. Add ALL env vars from `.env.local`
5. Deploy
6. Add custom domain `stackpicks.dev` → update Namecheap DNS
7. Wait for DNS propagation
8. Update `NEXT_PUBLIC_SITE_URL=https://stackpicks.dev` in Vercel env vars

## Post-deploy checklist

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] `robots.txt` allows indexing
- [ ] Search Console verified (DNS TXT record via Namecheap)
- [ ] Sitemap submitted to Search Console
- [ ] Plausible analytics installed
- [ ] OG default image at `/public/og-default.png`
- [ ] Razorpay webhook URL configured
- [ ] Razorpay events subscribed (see Cron + Webhooks below)

## Cron setup

`vercel.json` defines a daily cron at `30 20 * * *` UTC = 2 AM IST.

**Catch:** Vercel Cron requires Pro plan ($20/mo). For Hobby tier:
1. Use cron-job.org (free) → set URL `https://stackpicks.dev/api/cron/scrape-github`
2. Add header: `Authorization: Bearer ${CRON_SECRET}`
3. Schedule: daily at 02:00 IST
4. Save

## Razorpay webhook events

Subscribe to:
- `subscription.activated`
- `subscription.charged`
- `subscription.cancelled`
- `subscription.completed`
- `payment.captured`
- `payment.failed`

Webhook URL: `https://stackpicks.dev/api/webhook/razorpay`

---

# 8. Seeding the Database

The seed script (`scripts/seed.ts`) populates 104+ repos with curator takes.

## How it works

1. Reads `SEED_REPOS` from `scripts/seed-data.ts`
2. Batches and fetches live GitHub data via GraphQL (50 repos per request)
3. Loads category mappings from `categories` table
4. Upserts `repos` with curator takes (idempotent via `github_id` conflict)
5. Inserts `repo_categories` links

## Running it

```bash
npx tsx scripts/seed.ts
```

Output:
```
Seeding 104 repos...
Loaded 22 categories
Fetching live GitHub data (this takes ~30s)...
Fetched 104 repos from GitHub
Upserting 104 repos...
Repos upserted.
Linking categories...
Linked 220 repo-category relationships (skipped 0 unknown categories)
Seed complete! 104 repos published.
```

## Adding a new repo

Edit `scripts/seed-data.ts`. Add to `SEED_REPOS` array:

```typescript
{
  full_name: 'owner/repo',
  category_slugs: ['ui-components', 'design-systems'],
  is_featured: false,
  curator_take: 'Your 80-160 word opinion...',
  use_this_if: '1-2 sentence guidance.',
  skip_if: '1-2 sentence guidance.',
}
```

Re-run `npx tsx scripts/seed.ts` — idempotent.

## Voice rules for curator takes

- Direct builder + marketer voice. No buzzwords.
- No "Excited", "Thrilled", "Humbled" openings.
- Never use: synergy, 10x, growth hack, disrupt, leverage as verb, unlock, level up.
- Show specific tradeoffs, not just praise.
- Reference Indian context where it makes sense.
- 80-160 words per take.
- No emoji.

## Take structure

1. What it is in 1 sentence
2. Why it matters in 1 sentence
3. The honest tradeoff — what's not great
4. (Optional) Maintainer, license, ecosystem signal

## Examples (good takes from the actual seed)

**shadcn-ui/ui:**
> The default for Next.js builders in 2026. Not a dependency — you copy components into your codebase and own them forever. Built on Radix primitives so accessibility is solid out of the box. The catch: when something breaks or needs updating, you maintain it yourself. For most apps that is the right trade. For huge teams it can create drift across projects.

**pgvector/pgvector:**
> Vector search inside Postgres. ~12k stars and dominant in 2026 as the boring-but-correct default. If you already have Postgres (Supabase, Neon, RDS), do not add another database — just install this extension. Works for the vast majority of RAG apps.

---

# 9. Monetization Playbook

## Founding sponsor pricing (months 1-3)

50% off all tiers:
- Category top: ₹1,250/mo (instead of ₹2,500)
- Homepage featured: ₹5,000/mo (instead of ₹10,000)
- Newsletter: ₹2,500/send (instead of ₹5,000)

**Lock in 6-month minimum.** Convert at full rate after 6 months or when traffic 10x's.

## Sales cycle

1. Build initial traffic (months 1-3) — 100% organic
2. Cold outreach to Tier 1 targets (month 3-4) — see SPONSOR-OUTREACH.md
3. First 3 sponsors at founding-sponsor rates
4. Use first sponsors as case studies for full-rate sales (month 5+)
5. Raise rates as traffic compounds (month 9+)

## What NOT to do

- Don't run display ads (AdSense, Carbon) — cheapens brand
- Don't paywall the directory — kills SEO
- Don't take low-ball sponsors (<₹1k/mo) — anchors expectations
- Don't promise SEO bumps to sponsors — Google policy violation
- Don't fake "founding sponsors" by paying yourself

---

# 10. SEO Strategy

## The directory pattern

Each repo gets a unique page with:
- Unique title + description per route
- JSON-LD structured data (SoftwareApplication schema)
- Canonical URL
- OG image (static default + dynamic per-repo in Phase 2)
- Listed in dynamic sitemap

ISR with 1-hour revalidation balances freshness vs build cost.

## Long-tail strategy

Build pages for these query types:
- `[tool] alternative` → `/repo/[slug]` pages compete here
- `best [category] [year]` → `/category/[slug]` pages compete here
- `[tool A] vs [tool B]` → Phase 2 dedicated comparison posts
- `stack for [use case]` → `/collection/[slug]` pages

## Programmatic SEO from data

The scaffold's `is_published = true` repos automatically generate:
- Individual `/repo/[slug]` pages
- Appearance on `/category/[slug]` pages they're tagged with
- Sitemap entries

Add 1 repo → get 1 indexable page automatically.

## Realistic timeline

| Time | What |
|---|---|
| Day 0 | Submit sitemap to Google Search Console |
| Week 1-2 | Google crawls and indexes initial pages |
| Month 1-2 | 0-10 organic visitors/day. Normal. |
| Month 3-4 | 50-100 organic visitors/day. Long-tail starts ranking. |
| Month 6 | 200-500 organic visitors/day. First sponsor possible. |
| Month 12 | 1,000-5,000 organic visitors/day. Revenue compounds. |

## Don't expect month-1 traffic. This is a 12-month bet.

## Manual SEO content (weekly)

Twice a week starting Week 4:
- **Monday/Thursday:** Publish 1 new collection (e.g. "Stack for shipping a SaaS in a weekend")
- **Tuesday/Friday:** Publish 1 long-form comparison post

Long-form posts go in `apps/web/app/blog/[slug]/page.tsx` (route to be built — phase 2).

---

# 11. Launch Plan (Week 1-3)

## Week 1: Build & Soft Deploy

| Day | Task |
|---|---|
| Thursday | Buy domain, set up Supabase, Razorpay, GitHub PAT |
| Friday | Run migrations, run seed script, test locally |
| Saturday | Deploy to Vercel, point domain, Search Console + Plausible |
| Sunday | Soft post on LinkedIn (no fanfare), DM 10 builder friends |

**End of Week 1:** Site live with 104 repos, 1 soft LinkedIn post, 5-10 testers giving feedback.

## Week 2: Private Feedback

- Add 30 more curator takes (target: 130-150 total)
- Write OG image generator (dynamic per repo)
- Fix bugs reported by testers
- Set up Plausible analytics
- No public posts yet

**End of Week 2:** 150 repos, polished site, bugs fixed.

## Week 3: Public Launch

Cadence: Tuesday → Friday (highest-engagement days).

| Day | Platform |
|---|---|
| Tuesday 12:30 AM IST | ProductHunt submit |
| Tuesday 9 AM IST | LinkedIn post |
| Tuesday 6 PM IST | r/webdev |
| Wednesday 8 AM IST | Twitter/X thread |
| Wednesday 6 PM IST | r/reactjs |
| Wednesday 9:30 PM IST | Hacker News (Show HN) |
| Thursday 6 PM IST | r/SideProject |
| Thursday 7 PM IST | Indie Hackers |
| Friday 8 AM IST | Dev.to long-form |

All copy ready in `launch/POSTS.md` — copy-paste with minor tweaks for current state.

**Rules during launch:**
- Respond to every comment within 1 hour for the first 6 hours
- Defend takes you stand by — don't fold under pushback
- Update takes that are genuinely wrong + thank the corrector publicly
- Don't crosspost the same words — each platform needs platform-specific tone
- Track signups + sponsor inquiries, not vanity metrics

---

# 12. Sponsor Outreach

## Tier 1 targets (approach in months 3-4)

Well-funded, sponsorship-budget-aware:

| Company | Their tool | Fit |
|---|---|---|
| Resend | Email API | Email category top |
| Convex | Reactive backend | Database top |
| Trigger.dev | Background jobs | DevOps top |
| Drizzle Team | Drizzle ORM | Database featured |
| Better Auth | Auth library | Auth top |
| Tiptap | Rich-text editor | Rich Text top |
| PostHog | Product analytics | Analytics featured |
| Meilisearch | Search engine | Search top |
| Liveblocks | Realtime collab | Featured |
| Inngest | Background jobs | DevOps top |

## Cold email template (use for Tier 1)

```
Subject: Featured slot on StackPicks ({{their_category}})

Hey {{first_name}},

Piyush here, founder of StackPicks — the curated directory of
open-source dev tools that launched this week. 100+ repos with
opinionated "use this if / skip if" takes.

{{Their tool}}'s page is here: stackpicks.dev/repo/{{their_slug}}

Current numbers (3 weeks in):
- {{X}}k monthly visitors
- {{Y}}+ newsletter subscribers
- {{Z}}% of traffic lands on the {{category}} category page

Featured slots are available:
- Category top ({{category}}): ₹2,500/month
- Homepage rotation: ₹10,000/month

Each includes a paragraph of dedicated copy, your logo, and
clickthrough tracking. Avg CTR so far: ~4-6%.

Want the spec? Happy to send a one-pager.

— Piyush
Founder, StackPicks
stackpicks.dev
```

## Rules

- No "AI built this" mentions
- No "synergy / 10x / disrupt"
- No 30-min discovery calls — pitch the spec
- Max 2 follow-ups (Day 0, Day 4, Day 14 = done)
- Track every send in a sheet

Full template + Twitter DM + LinkedIn DM versions in `launch/SPONSOR-OUTREACH.md`.

---

# 13. Content Compounding (Week 4+)

## Twice-weekly cadence

- **Monday:** Publish 1 new collection
- **Thursday:** Publish 1 long-form comparison post
- **Sunday:** Newsletter with the week's picks

## LinkedIn cadence (your existing ECHO playbook)

3 posts/week, Mon/Wed/Fri 8-10 AM IST.

One post per week should reference StackPicks naturally — not promotional, just "while building X for StackPicks I noticed Y."

## Content pillars (40/30/30 split)

| Pillar | Share | Topics |
|---|---|---|
| Building with AI | 40% | Claude Code workflows, agent stacks, RAG builds |
| Affiliate Marketing | 30% | CPS/CPA models, creator economy, India performance marketing |
| Marketing meets Product | 30% | Builder POV on growth, SEO, distribution |

## Newsletter target by month

| Month | Target |
|---|---|
| 3 | 100 subs |
| 6 | 500 subs |
| 9 | 1,500 subs |
| 12 | 3,000-5,000 subs |

Once at 1,000 subs, start selling newsletter sponsorships at ₹3-8k per send.

---

# 14. Common Pitfalls

## Missing RLS
**Symptom:** Anonymous users can write to a table.
**Cause:** Forgot `alter table X enable row level security;` after `create table`.
**Fix:** Every new table needs `enable row level security` + at least one explicit policy.

## Razorpay client-side trust
**Symptom:** Frontend reports payment success but Supabase shows no record.
**Cause:** Trusted the client's success callback without server-side signature verification.
**Fix:** Always call `verifyPaymentSignature()` server-side. Update DB only after verification.

## Vercel cron requires Pro
**Symptom:** Cron set up in `vercel.json` but no daily scrape happens.
**Cause:** Vercel Cron only runs on Pro plan.
**Fix:** Upgrade to Pro OR use cron-job.org with Bearer token.

## ISR not refreshing
**Symptom:** Edited curator take in Supabase but old version still shows on `/repo/[slug]`.
**Cause:** ISR cache. Page has `export const revalidate = 3600` — refreshes hourly.
**Fix:** Call `revalidatePath('/repo/' + slug)` from a server action, OR redeploy, OR wait the hour.

## Emoji in code
**Symptom:** PR has emoji in console.log or code comments.
**Fix:** No emoji in code per NEXUS rules. UI strings can have minimal emoji only if asked.

## USD prices
**Symptom:** Pricing component shows "$10/month" somewhere.
**Fix:** Everything in INR. Use `formatINR(paise)`. Stripe is banned.

## Stale GitHub data
**Symptom:** Repo page shows old star count.
**Fix:** Cron hasn't run yet. Trigger manually via the cron endpoint with curl, or wait for nightly run.

## "Cannot find module @stackpicks/core" on Vercel
**Symptom:** Build fails on Vercel.
**Fix:** Verify `transpilePackages: ['@stackpicks/core']` is in `next.config.mjs` (it is in the scaffold). Vercel should auto-detect pnpm workspaces.

## "No repos in this category"
**Symptom:** Category page is empty.
**Fix:** Either seed didn't run, OR `is_published = false`. Check Supabase Table Editor → repos.

---

# 15. Phase 2 Roadmap

These are wired (DB tables exist) but UI not built. Don't ship them in v1 — let traffic prove demand first.

## Phase 2 features

- **Premium content gating UI** — paywall component for premium collections
- **Job board frontend** — `/jobs` page + posting flow
- **Admin dashboard** — edit curator takes, approve sponsored slots without Supabase Studio
- **Newsletter sending automation** — scheduled Sunday send via Resend
- **Dynamic OG image generator** — `/api/og` route per-repo
- **Mobile companion app** — Expo + RN + NativeWind, thin wrapper over `/core/`
- **Search functionality** — Meilisearch or Postgres FTS
- **API for partners** — read-only public API at `/api/v1/`
- **Comparison pages** — `/compare/[tool-a]-vs-[tool-b]` for SEO
- **Long-form blog** — `/blog/[slug]` for deep-dive content

## Sequencing

| Month | Phase 2 priority |
|---|---|
| 4-6 | Newsletter automation + admin dashboard |
| 6-9 | Premium gating UI + dynamic OG |
| 9-12 | Job board + comparison pages |
| 12+ | Mobile app + public API |

Each phase only happens when revenue justifies the build time.

---

# 16. Reference: Pricing, Plans, Constants

## PRICING (paise, from `core/constants/index.ts`)

```typescript
{
  premium_monthly: 29900,           // ₹299
  sponsor_category_top: 250000,     // ₹2,500
  sponsor_homepage_featured: 1000000, // ₹10,000
  sponsor_newsletter: 500000,       // ₹5,000 per send
  job_post: 500000,                 // ₹5,000 for 30 days
}
```

## SUBSCRIPTION_STATUSES

`pending | active | cancelled | expired | paused`

## SPONSOR_PLACEMENTS

`category_top | homepage_featured | newsletter`

## REPO_SORT_OPTIONS

`trending | stars | newest | curated`

## Categories (22 seeded)

ui-components, design-systems, animation, icons, auth, database, payments,
ai-ml, mobile, forms, state, routing, testing, devops, analytics, email,
cms-content, search, charts-viz, rich-text, frameworks, cli-tools

---

# Quick Links

| Resource | URL |
|---|---|
| Site (after deploy) | https://stackpicks.dev |
| Repository | (your GitHub URL) |
| Supabase Dashboard | https://supabase.com/dashboard/project/<ref> |
| Razorpay Dashboard | https://dashboard.razorpay.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Search Console | https://search.google.com/search-console |
| Plausible | https://plausible.io/stackpicks.dev |

---

# Decision Log

When making non-obvious architectural decisions, append here:

- **2026-05-21:** Picked Next.js 15 over Astro. Reason: server-side payment + auth flows needed.
- **2026-05-21:** Picked PRP-style curator takes over star-count rankings. Reason: takes are the moat.
- **2026-05-21:** Picked Plausible over PostHog for v1. Reason: simpler, cheaper, sufficient.
- **2026-05-21:** Deferred mobile app to Phase 2. Reason: prove web traffic first.
- **2026-05-21:** Set founding-sponsor pricing at 50% off. Reason: anchor expectations + secure 6-month commits.

Append new decisions below as the project evolves.

---

End of master context document.
