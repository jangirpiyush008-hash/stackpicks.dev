# Architecture Decisions

## Why Next.js 15 App Router

- ISR (Incremental Static Regeneration) for SEO-critical pages
- Server Components mean DB queries happen on the server, reducing client JS
- Server Actions for sponsor/premium checkout flows
- Built-in `sitemap.ts` and `robots.ts` conventions
- Vercel's edge network = fast for global readers

## Why not Astro / static-only

Premium gating, sponsor dashboards, click tracking, and Razorpay flows all need dynamic server logic. Astro is great for pure content sites but you'd outgrow it in month 2 when adding auth.

## Why Supabase over Postgres + Auth0 + S3 separately

- One vendor for DB + Auth + Storage + Edge Functions
- Mumbai region available for India latency
- RLS gives row-level security without writing middleware
- Free tier handles up to ~50k MAU before needing Pro

## Why Razorpay (not Stripe)

- Mandatory for INR collection in India
- Lower fees domestic (2% vs Stripe India's 3%+)
- GST-compliant invoicing
- UPI Autopay support for subscriptions

## Why DRY `core/` package

The site is web-only today, but the audience is mobile-first Indian developers. A read-only mobile app (RN + Expo) becomes a thin wrapper:
- Same DB queries (`core/db/queries.ts`)
- Same types (`core/types`)
- Same validation (`core/validation`)
- Mobile only adds UI + native interactions

Without `core/`, every cross-platform feature costs 2x.

## RLS strategy

Three RLS patterns used:

1. **Public-readable, admin-writable** (categories, repos, collections):
   - `SELECT USING (true)` or `USING (is_published = true)`
   - No INSERT/UPDATE/DELETE policies → only service role can write
   - Editorial workflow goes through Supabase Studio or admin scripts

2. **Owner-scoped** (sponsors, job_posts):
   - All policies key off `auth.uid() = user_id`
   - Users can only see/edit their own records

3. **Premium-gated** (premium collections):
   - SELECT policy joins to `premium_subscriptions` and checks `status = 'active'`
   - Free users see only `is_premium = false` rows

## Click tracking without cookies

To respect privacy and avoid GDPR/DPDP complications:

- Hash IP with daily-rotating salt: `sha256(ip + YYYY-MM-DD)`
- Salt rotates daily so historical reconstruction is impossible
- No persistent user identification across days
- Aggregate counts only, no individual user journeys

## SEO architecture

The directory pattern wins on long-tail keywords:

- `/repo/[slug]` → "shadcn ui alternative" type queries
- `/category/[slug]` → "best react component library 2026"
- `/collection/[slug]` → "stack for shadcn next.js builders"

Each page has:
- Unique title + description per route
- JSON-LD structured data (SoftwareApplication for repos, CollectionPage for categories/collections)
- Canonical URL set
- OG image (default + per-repo dynamic via `/api/og`)
- Listed in dynamic sitemap

ISR with 1-hour revalidation balances freshness vs build cost.

## Performance budget

- Initial JS: <100kb (Server Components do most work)
- LCP target: <1.5s on 4G India
- No client-side data fetching on critical paths
- Images: `next/image` with proper sizing
- Fonts: `next/font` with `display: swap`

## Future-proofing for mobile

When mobile app comes (v2 or v3):

```
apps/
├── web/          (existing)
├── mobile/       (RN + Expo, reads from core/)
└── admin/        (optional internal Tauri dashboard for repo curation)
```

All three apps consume the same `core/` package. Zero rewriting.
