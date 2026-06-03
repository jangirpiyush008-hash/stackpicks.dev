# CLAUDE.md — StackPicks Project Context

> This file is read by Claude Code on every session to understand the project.
> Do NOT delete or rename it. Update it when architecture or rules change.

---

## What is this project

**StackPicks** is a curated directory of open-source dev tools. Live at `stackpicks.dev` (or your chosen domain).

Each repo entry has:
- Live GitHub data (stars, forks, language, license) — scraped daily
- Curator take (1 paragraph opinion in plain English)
- "Use this if" + "Skip if" guidance
- Category tags (UI, animation, AI, auth, etc.)

The differentiator versus other dev-tool directories: **opinionated takes, not just star counts**.

## Who built it / who is Claude Code working for

**Piyush Jangir** — Head of Affiliate Marketing at HYPD (creator commerce platform, India). Self-taught builder. Ships products using Claude Code as the primary development surface.

Communication preferences:
- **Direct, code-first, skip lengthy explanations**
- Scaffold full project structure, not snippets
- Think architecture before writing code
- No emoji in code or professional content unless asked
- Comfortable with Hinglish (Hindi-English mix) in conversation
- Blunt feedback preferred over diplomatic hedging

## Why it exists (business case)

Five monetization rails, all wired from v1:

1. **Sponsored listings** — Razorpay subscription, ₹2,500/mo per category top, ₹10,000/mo homepage featured
2. **Affiliate links** — outbound clicks route through affiliate URLs where available
3. **Premium tier** — ₹299/month, gates weekly deep-dive content and members-only collections
4. **Newsletter sponsorships** — manual sales, weekly Sunday send
5. **Job board** — flat ₹5,000 per 30-day listing (phase 2, table exists from day 1)

Realistic Y1 revenue projection: ₹14k/mo by month 6 → ₹65-70k/mo by month 12. Compounds in Y2.
Full revenue model in `/docs/MONETIZATION.md`.

---

## The Architecture Rules (NEXUS — these are immutable)

These come from Piyush's established engineering system. Claude Code must follow them on every change.

### DRY-first shared-core architecture

All business logic lives in `/core/`. Apps (`/apps/web/`, future `/apps/mobile/`, future `/apps/admin/`) are thin wrappers that import from `/core/`.

**Allowed in `/apps/web/`:**
- React components, layouts, pages, routing
- API route handlers (Next.js Route Handlers)
- Style + tailwind config
- Platform-specific glue

**Required in `/core/`:**
- All Supabase queries (`/core/db/queries.ts`)
- All Razorpay logic (`/core/razorpay/`)
- All GitHub scraping (`/core/github/`)
- All Zod schemas (`/core/validation/`)
- All TypeScript types (`/core/types/`)
- All formatting utilities — INR, IST, slugs (`/core/utils/`)
- All SEO helpers (`/core/seo/`)
- All pricing/plan/category constants (`/core/constants/`)

If you find yourself writing business logic inside `/apps/web/`, stop and move it to `/core/`. This is non-negotiable. The mobile app, admin app, and any other future app must reuse `/core/` without modification.

### Database rules

- **RLS is mandatory on every Supabase table.** No exceptions. Every `create table` must be followed by `alter table ... enable row level security`.
- Service role is only used in: cron handlers, webhooks, admin scripts. Never in client-side code.
- All timestamps: store UTC, render IST in UI. Use `core/utils/formatIST()`.
- All monetary amounts in DB: store as **integer paise** (100 paise = ₹1). Use `core/utils/formatINR()` to display.
- All Indian phone numbers: validate with `core/validation/indianPhoneSchema` (+91 optional, 10 digits).
- All Indian pincodes: 6-digit. GSTIN: 15-char regex via `gstinSchema`.

### Payment rules

- **INR only. Razorpay only.** Never integrate Stripe.
- Razorpay payment signatures MUST be verified server-side after every checkout. Use `core/razorpay/verifyPaymentSignature()`.
- Razorpay webhook signatures MUST be verified before processing any event. Use `core/razorpay/verifyWebhookSignature()`.
- Member/subscription fees are processed via Razorpay only — never invoiced manually.
- Test mode is fine until KYC. After KYC, switch all keys to live mode and test one full purchase end-to-end before announcing.

### TypeScript rules

- Strict mode on. Zero `any` unless explicitly justified with a `// reason: ...` comment.
- No `@ts-ignore` without `// reason: ...`.
- Database row types come from `core/db/database.types.ts` — regenerate with `pnpm db:types` after any schema change.
- Shared interface types live in `core/types/index.ts`.

### Security rules

- All secrets in `.env.local` only. Never committed.
- Verify `.env*` is in `.gitignore` before every commit.
- Never log secrets. Never log Razorpay keys or signatures.
- Outbound click tracking uses SHA-256 IP hashing with daily-rotating salt — no persistent user identification across days.

### India-first defaults

- Currency: INR. Symbol: ₹ or "Rs" — never "$".
- Phone format: +91 optional prefix, 10 digits.
- Timezone: IST in UI. Cron schedules calculated as UTC offset from IST.
- Supabase region: Mumbai (`ap-south-1`).
- Hosting: Vercel (edge nodes serve India well).

---

## Tech Stack (current)

```
Frontend:    Next.js 15 (App Router, Server Components, ISR)
Database:    Supabase (Postgres + Auth + Storage + Edge Functions)
Payments:    Razorpay (INR, UPI, subscriptions)
Email:       Resend + react-email
Hosting:     Vercel (Hobby tier OK for v1, upgrade for cron)
Analytics:   Plausible (privacy-friendly, GDPR/DPDP ready)
Domain:      stackpicks.dev (Namecheap)
Package mgr: pnpm 9 (workspaces)
Language:    TypeScript strict
Styling:     Tailwind CSS
Icons:       lucide-react
Validation:  Zod
```

When adding a feature, check if any existing lib in the stack handles it before adding a new dependency.

---

## Repo Structure (memorize this)

```
stackpicks/
├── CLAUDE.md                      # This file
├── README.md                      # Public-facing overview
├── package.json                   # Root, workspace config
├── pnpm-workspace.yaml            # Workspace definitions
├── .env.example                   # Template — copy to .env.local
├── .gitignore                     # Critical: .env files must be in here
│
├── apps/
│   └── web/                       # Next.js 15 app
│       ├── app/
│       │   ├── layout.tsx         # Root layout, header, footer
│       │   ├── page.tsx           # Homepage
│       │   ├── globals.css        # Tailwind imports
│       │   ├── sitemap.ts         # Dynamic sitemap from DB
│       │   ├── robots.ts          # Robots.txt route
│       │   ├── category/[slug]/page.tsx
│       │   ├── repo/[slug]/page.tsx
│       │   ├── go/
│       │   │   ├── repo/[id]/route.ts        # Outbound click tracker
│       │   │   └── sponsored/[id]/route.ts   # Sponsored click tracker
│       │   └── api/
│       │       ├── newsletter/route.ts        # Newsletter signup
│       │       ├── cron/scrape-github/route.ts # Daily GitHub refresh
│       │       ├── checkout/sponsor/route.ts   # Razorpay order creation
│       │       └── webhook/razorpay/route.ts   # Razorpay webhook handler
│       ├── next.config.mjs
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       ├── package.json
│       └── vercel.json            # Cron config
│
├── core/                          # Shared logic — DRY layer
│   ├── package.json
│   ├── index.ts                   # Re-exports
│   ├── types/index.ts             # Shared interfaces
│   ├── constants/index.ts         # Pricing, categories, plans
│   ├── db/
│   │   ├── client.ts              # Supabase client factories
│   │   ├── queries.ts             # All typed DB queries
│   │   └── index.ts
│   ├── github/index.ts            # GraphQL scraper
│   ├── razorpay/index.ts          # Order/subscription/signature logic
│   ├── seo/index.ts               # JSON-LD, meta builders
│   ├── utils/index.ts             # formatINR, formatIST, hashIP, etc.
│   └── validation/index.ts        # Zod schemas
│
├── supabase/
│   └── migrations/
│       ├── 20260521000001_init.sql           # All tables + RLS policies
│       └── 20260521000002_seed_categories.sql # 22 starter categories
│
├── scripts/
│   ├── seed.ts                    # Run once: populate DB with 100+ repos
│   └── seed-data.ts               # The actual repo list with curator takes
│
├── docs/
│   ├── SETUP.md                   # Step-by-step environment setup
│   ├── ARCHITECTURE.md            # Why-we-built-it-this-way decisions
│   └── MONETIZATION.md            # Revenue model + projections
│
├── launch/
│   ├── QUICK-START.md             # 48-hour weekend launch plan
│   ├── POSTS.md                   # ProductHunt/HN/Reddit/LinkedIn/Twitter copy
│   └── SPONSOR-OUTREACH.md        # Cold email templates + Tier 1 targets
│
└── .claude/
    └── commands/                  # Custom Claude Code commands (see below)
```

---

## Database Schema (high-level)

Full SQL in `supabase/migrations/20260521000001_init.sql`. Summary:

**Core entities:**
- `categories` — 22 seeded categories (UI, AI, auth, etc.)
- `repos` — scraped from GitHub, has `curator_take`, `use_this_if`, `skip_if`, `is_featured`, `is_published`
- `repo_categories` — many-to-many join
- `collections` — curated stacks ("Best for shadcn builders"), can be premium-gated
- `collection_repos` — many-to-many join

**Monetization:**
- `sponsors` — user-linked, GSTIN-aware for invoicing
- `sponsored_slots` — placement (category_top/homepage_featured/newsletter), Razorpay sub IDs
- `premium_subscriptions` — Razorpay subscription state
- `outbound_clicks` — IP-hashed, no PII

**Engagement:**
- `repo_views` — aggregated daily
- `repo_upvotes` — IP-hashed, no login required
- `newsletter_subs` — Resend integration

**Phase 2:**
- `job_posts` — table exists, route not yet built

**View:**
- `revenue_summary` — admin monthly view of active sponsor revenue

**Key RLS patterns:**
1. Public read on `categories`, `repos`, `repo_categories` (with `is_published` filter)
2. Owner-scoped on `sponsors`, `job_posts` via `auth.uid()`
3. Premium-gated on premium `collections` via subscription join
4. Service-role-only on `outbound_clicks`, `repo_views`, `newsletter_subs`

---

## Commands You Can Run (Claude Code)

```bash
# Setup (one-time per machine)
pnpm install
cp .env.example .env.local        # Then fill in keys

# Development
pnpm dev                          # Next.js dev server
pnpm typecheck                    # Type-check without build
pnpm build                        # Production build
pnpm lint                         # ESLint

# Database
pnpm db:push                      # Apply migrations to linked Supabase project
pnpm db:reset                     # DESTROY local DB, re-run migrations
pnpm db:types                     # Regenerate core/db/database.types.ts

# Seeding
npx tsx scripts/seed.ts           # Populate DB with 104+ curator-take repos

# Manual cron trigger (for testing)
curl -H "Authorization: Bearer $CRON_SECRET" https://stackpicks.dev/api/cron/scrape-github
```

---

## Active Work Areas (where Claude Code typically operates)

### Adding a new repo to the directory
1. Edit `scripts/seed-data.ts`
2. Add an entry to `SEED_REPOS` array with all 6 required fields:
   - `full_name` — exact `owner/repo` from GitHub
   - `category_slugs` — array, must exist in `supabase/migrations/20260521000002_seed_categories.sql`
   - `is_featured` — boolean, true puts it in homepage rotation
   - `curator_take` — 80-160 words, direct voice, no buzzwords, no emoji
   - `use_this_if` — 1-2 sentences
   - `skip_if` — 1-2 sentences
3. Run `npx tsx scripts/seed.ts` — idempotent, upserts on `github_id`

### Adding a new category
1. Add to `supabase/migrations/20260521000002_seed_categories.sql` (preserve the `on conflict` block)
2. Re-run the migration via Supabase SQL Editor or `pnpm db:push`
3. Update `core/constants/index.ts` if it needs a special pricing tier

### Writing curator takes (Piyush's voice rules)

Read first: takes are the entire moat. Anyone can scrape GitHub. Nobody can clone "Piyush thinks skip X because Y."

**Voice rules:**
- Direct builder + marketer. No buzzwords.
- No "Excited", "Thrilled", "Humbled" openings.
- Never use: synergy, 10x, growth hack, disrupt, leverage (as a verb), unlock, level up.
- Show specific tradeoffs, not just praise.
- 80-160 words per take. Brevity over completeness.
- No emoji.
- Use real version numbers and star counts when stable.
- Reference Indian context where relevant (Razorpay > Stripe for INR, Mumbai region, etc.).

**Structure each take like:**
1. What it is in 1 sentence.
2. Why it matters in 1 sentence.
3. The honest tradeoff — what's not great about it.
4. (Optional) Who maintains it, license, ecosystem signal.

**Use this if / Skip if:**
- 1-2 sentences each, no more.
- Specific. "You are on Next.js + Tailwind" > "You want components."
- Skip clause should be a real reason, not "if you don't want this." Bad: "Skip if you don't need it." Good: "Skip if you're already deep in shadcn — migration cost is real."

### Adding a new monetization tier
1. Add to `PRICING` in `core/constants/index.ts`
2. Create Razorpay plan via dashboard, add plan ID to `.env`
3. If subscription: extend `premium_subscriptions` table OR new table with own RLS
4. Write checkout route in `apps/web/app/api/checkout/[purpose]/route.ts`
5. Wire webhook handler in `apps/web/app/api/webhook/razorpay/route.ts` switch statement
6. Add UI flow

### Modifying SEO
- Per-page metadata goes in `generateMetadata()` of each page using `core/seo/buildMeta()`
- Sitemap auto-updates from DB — only modify `apps/web/app/sitemap.ts` to add new route types
- JSON-LD helpers in `core/seo/index.ts` (softwareJsonLd, categoryJsonLd, collectionJsonLd)
- For OG images: dynamic generation via `apps/web/app/api/og/route.ts` (not yet built — phase 2)

---

## Common Pitfalls (don't repeat these)

### Pitfall: missing RLS
**Symptom:** Anonymous users can write to a table.
**Cause:** Forgot `alter table X enable row level security;` after `create table`.
**Fix:** Every new table migration must include `enable row level security` AND at least one explicit policy.

### Pitfall: Razorpay client-side trust
**Symptom:** Frontend reports payment success but Supabase shows no record.
**Cause:** Trusting the client's success callback without server-side signature verification.
**Fix:** Always call `verifyPaymentSignature()` server-side. Update DB only after verification returns true.

### Pitfall: Vercel cron requires Pro
**Symptom:** Cron set up in `vercel.json`, but no daily scrape happens.
**Cause:** Vercel Cron only runs on Pro plan ($20/mo).
**Fix:** Either upgrade to Pro, OR use cron-job.org pointing at `https://stackpicks.dev/api/cron/scrape-github` with `Authorization: Bearer ${CRON_SECRET}` header.

### Pitfall: ISR not refreshing
**Symptom:** Edited curator take in Supabase but old version still shows on `/repo/[slug]`.
**Cause:** ISR cache. The page has `export const revalidate = 3600` — refreshes hourly.
**Fix:** For instant refresh, call `revalidatePath('/repo/' + slug)` from a server action, OR redeploy, OR wait the hour.

### Pitfall: emoji in code
**Symptom:** PR has emoji in console.log or code comments.
**Cause:** Auto-completion or copy-paste from other docs.
**Fix:** Per NEXUS rules, no emoji in code. UI surfaces (LinkedIn posts, marketing copy) can have minimal emoji only if asked. Code never.

### Pitfall: USD prices
**Symptom:** Pricing component shows "$10/month" somewhere.
**Cause:** Default Stripe-pilled habit.
**Fix:** Everything is INR. ₹ symbol. Use `formatINR(paise)`. Stripe is banned.

### Pitfall: Stale GitHub data
**Symptom:** Repo page shows old star count.
**Cause:** Cron hasn't run yet.
**Fix:** Trigger manually via the curl in "Commands" section, OR wait for nightly cron at 2 AM IST.

---

## Decision Log

When making non-obvious architectural decisions, append here:

- **2026-05-21:** Picked Next.js 15 over Astro despite Astro's better content-site DX. Reason: need server-side payment flows, auth, sponsor dashboards. Astro would force a second backend.
- **2026-05-21:** Picked Drizzle/raw SQL via Supabase client over Prisma. Reason: serverless cold-start matters on Vercel Hobby tier; Drizzle codegen step is also faster.
- **2026-05-21:** Picked PRP-style (Plan-Research-Polish) curator takes over star-count rankings. Reason: takes are the moat. Star counts are commodity.
- **2026-05-21:** Picked Plausible over PostHog for v1 analytics. Reason: simpler, cheaper, sufficient for first 6 months. Will migrate to PostHog if/when we need session replay or feature flags.

---

## What's NOT in this scaffold (intentionally deferred)

These are wired for a later phase but not built in v1. Don't add them without a discussion:

- **Premium content gating UI** — `is_premium` flag exists on `collections`, but the paywall component isn't built
- **Job board frontend** — `job_posts` table exists, RLS exists, but `/jobs` page and posting flow aren't built
- **Admin dashboard** — for editing curator takes, approving sponsored slots. Currently done via Supabase Studio.
- **Newsletter sending** — `newsletter_subs` captures emails, but no scheduled send pipeline yet. Manual send via Resend dashboard for v1.
- **OG image generator** — `/api/og` route not built. Using static `/public/og-default.png` for now.
- **Mobile companion app** — `/apps/mobile` will use Expo + RN + NativeWind. Whole point of `/core/` is to make this thin.
- **Search functionality** — basic `ilike` search works, but full-text + filters need Meilisearch or Postgres FTS.

---

## DAILY RITUAL (Piyush's standing rule — follow exactly)

The prime directive behind everything: **rank stackpicks.dev on Google (SEO)
and AI agents (GEO) to sell as many lifetime subscriptions as possible.**
Every task is judged by: does it drive traffic → visibility → subscription
sales? If not, flag it as low-priority.

**When Piyush says "Start the day"** (his first prompt most mornings):
1. Read `docs/DAILY-LOG.md` — recap what we did yesterday (features shipped,
   MCP apps wired, SEO tasks, blog posts, fixes). Be specific ("wired 5 apps:
   Slack, Notion, Linear, Stripe, Firecrawl").
2. List today's to-dos across both tracks:
   - **SEO calendar** — today's task from `apps/web/lib/seo-calendar.ts`
   - **Connect wiring** — today's 5 apps from `apps/web/lib/connect-roadmap.ts`
   - Anything carried over / unfinished
3. **Market research** — WebSearch for what's new/trending in MCP, AI agents,
   dev tools, SEO/GEO. Surface anything relevant as "news of the day."
4. **Mark ownership** per item: **[YOU]** (form submissions, OAuth app
   registrations, payments) vs **[ME]** (code, content, executors).
5. Frame all of it by the prime directive above.

**Standing rule — "search latest news" → ship a blog post (SEO + GEO):**
When Piyush asks me to search/research the latest news (MCP, AI agents, dev
tools, SEO/GEO), I do NOT just summarize in chat. I also **write or update a
blog post** in `apps/web/lib/blog.ts` targeting the freshest, lowest-competition
keyword from that news, optimized for BOTH:
- **SEO** (Google/Bing): keyword in title/slug/H1, internal links in + out,
  auto-wired into sitemap/RSS, IndexNow ping after deploy.
- **GEO** (AI engines): `quick_answer` + 4-6 `faqs` (FAQPage JSON-LD), pinned in
  `/llms.txt` "Latest posts", citation-friendly tables/lists, dated, cite sources.
Freshness is the edge — publish while the keyword is days old and uncontested.
Then tie it back to StackPicks Connect / the directory with internal CTAs.

**MANDATORY post-write audit (every time, no exceptions):**
After writing OR updating any blog post, BEFORE committing, run this audit
pass and apply fixes in the same commit:
1. **Simple steps:** every numbered list is ≤4 bullets/step, each bullet is
   one action, no time-tags like "(5 min)", no restated intros. If a step
   has a paragraph preamble, kill the preamble.
2. **Tight quick_answer:** ≤350 chars, leads with the direct answer in the
   first sentence (AI engines lift verbatim — front-load the citation).
3. **FAQ answers:** 50-100 words each, crisp, no hedging.
4. **Honesty check:** if a newer official solution exists (e.g. Meta's MCP
   for Meta Ads), the post must say so before pitching ours. Never push
   users into a worse path. Per the brand-honesty rule.
5. **Freshness:** confirm `updated_at` is today; if dates are stale, bump
   them. Confirm any time-bound claims (counts, "as of X") are current.
6. **Internal links:** new post links to ≥2 existing posts; ≥1 existing
   post links back. Use existing high-traffic posts to pass equity.
7. **Auto-wired:** sitemap, /llms.txt, /llms-full.txt, RSS, blog index all
   derive from `BLOG_POSTS` automatically — confirm by typecheck only,
   no manual wiring needed.
8. **Typecheck + commit + push.** Then report what was audited.

**Distribution = OWNED channels only (Piyush has NO Reddit/HN/dev.to/social):**
1. **Newsletter** (Resend) — send/queue the post to the owned list.
2. **On-site internal linking** — link new post from related posts + /mcp +
   /connect + blog index (equity from established pages).
3. **Google Search Console + Bing Webmaster** — Request indexing / Submit URL.
4. **IndexNow** — automated ping (ChatGPT Search + Bing crawl within hours).
5. **Network share** (Piyush's own WhatsApp/contacts).
Never assume a social account; default to these five.

**When Piyush says "End today"**:
- Summarize what got done.
- Append a dated entry to `docs/DAILY-LOG.md` (newest at top), commit + push.
  This is the memory the next "Start the day" reads.

Connect launch state: gated behind `NEXT_PUBLIC_CONNECT_LAUNCHED` until 50
apps are live. Wire 5/day. Track at `/admin/connect`. SEO calendar at
`/admin/seo`. Never invent customers/metrics — honesty protects the brand.

---

## What Claude Code Should Do First (in a fresh session)

1. **Read this file (`CLAUDE.md`) completely.** Don't skim. The pitfalls section catches most footguns.
2. **Read `docs/DAILY-LOG.md`** — the running daily log (what we did, what's next).
3. **Check `git log -10`** to see recent changes.
4. **Run `pnpm typecheck`** to see if the project is in a known-good state.
5. **Follow the DAILY RITUAL above** if Piyush opens with "Start the day".

When in doubt, follow the existing patterns in `/core/` and `/apps/web/`. The codebase is small enough to read end-to-end in 30 minutes.

---

## Brutal truths Piyush has already heard (don't re-pitch)

- Directories are 6-12 month SEO plays. Don't expect traffic before month 3.
- ₹5k/mo ad budget is too small for paid acquisition. Stay 100% organic for first 90 days.
- The takes are the moat. The code is replaceable.
- Sponsors won't sign up until traffic exists. Patience > sales pressure.
- Newsletter is the real product. Optimize for email capture.
- First 100 users come from network (LinkedIn, IAS, HYPD). Not SEO.
- 80% of build time was on the boring 80% (DB, RLS, SEO foundations). That's normal.

Don't waste session tokens re-explaining these.

---

## Environment Variables Quick Reference

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_TOKEN` (PAT, `public_repo` scope)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `CRON_SECRET` (random, used to authenticate cron endpoints)
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://stackpicks.dev`)

Optional:
- `RESEND_API_KEY` (newsletter)
- `RAZORPAY_PLAN_PREMIUM_MONTHLY` (subscription plan IDs, populate when premium tier ships)
- `RAZORPAY_PLAN_SPONSOR_CATEGORY`
- `RAZORPAY_PLAN_SPONSOR_FEATURED`

If any required var is missing, fail loudly at startup. Don't silently default.

---

End of CLAUDE.md.
