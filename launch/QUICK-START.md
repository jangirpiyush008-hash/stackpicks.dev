# StackPicks — Quick Start to Live (Weekend Plan)

You have ~48 hours. Here's the exact sequence.

## Saturday Morning (3 hours)

### 1. Buy the domain (10 min)
- Namecheap: search `stackpicks.dev`, buy it, ~₹1,200

### 2. Set up Supabase (30 min)
- Create new project at supabase.com, choose **Mumbai region**
- Copy `Project URL`, `anon key`, `service_role key` from Settings → API
- In SQL Editor, paste & run both migrations:
  - `supabase/migrations/20260521000001_init.sql`
  - `supabase/migrations/20260521000002_seed_categories.sql`
- Verify: Table Editor should show ~12 tables, Categories tab should show 22 categories

### 3. Get a GitHub Personal Access Token (5 min)
- github.com → Settings → Developer settings → PATs → Generate new (classic)
- Scope: `public_repo` only
- Copy the token

### 4. Set up Razorpay (15 min)
- razorpay.com → Sign up (test mode is fine for now)
- Settings → API Keys → Generate test keys
- Skip plan creation for now — you'll do that when you wire premium tier

### 5. Set up Resend (10 min, optional for week 1)
- resend.com → Sign up → API Keys → Create
- Skip if you're not launching the newsletter on day 1

### 6. Clone the project (5 min)
```bash
unzip stackpicks.zip
cd stackpicks
cp .env.example .env.local
# Open .env.local and fill in all the keys you just got
pnpm install
```

### 7. Seed the database with 100+ repos (10 min)
```bash
npx tsx scripts/seed.ts
```

This fetches live GitHub data and inserts 100+ repos with curator takes.
Expect output: "Fetched 104 repos... Upserting 104 repos... Linked 220 repo-category relationships... Seed complete!"

### 8. Run dev locally (5 min)
```bash
pnpm dev
```
Open http://localhost:3000 — homepage should show real repos, real takes, real categories.

### 9. Smoke test (15 min)
- Click each category — should show 4-12 repos
- Click into 5 different repos — verify takes are showing
- Click "View on GitHub" — should redirect through `/go/repo/[id]` and log a click
- Subscribe to newsletter form — should redirect with `?subscribed=1`

If any of these fail, fix before deploying.

## Saturday Afternoon (2 hours)

### 10. Deploy to Vercel (20 min)
```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial: StackPicks live"
git remote add origin <your-github-repo>
git push -u origin main
```

Then on Vercel:
- Import the repo
- Set root directory: `apps/web`
- Build command: `pnpm build`
- Add ALL env vars from `.env.local`
- Deploy

### 11. Connect domain (15 min)
- Vercel project → Settings → Domains → Add `stackpicks.dev`
- Update Namecheap DNS to point at Vercel (Vercel will tell you exactly which records)
- Wait ~10 min for propagation
- Update `NEXT_PUBLIC_SITE_URL=https://stackpicks.dev` in Vercel env vars
- Redeploy

### 12. Google Search Console (15 min)
- search.google.com/search-console → Add property `stackpicks.dev`
- Verify via DNS TXT record (Namecheap)
- Submit sitemap: `https://stackpicks.dev/sitemap.xml`

### 13. Plausible Analytics (15 min)
- plausible.io → Add site → `stackpicks.dev`
- Copy script tag, add to `app/layout.tsx` in the `<head>` (use the official Plausible Next.js integration)
- Verify: visit site, then check Plausible dashboard for 1 page view

### 14. OG image (30 min)
- For now: use a static OG image at `/public/og-default.png` (1200x630)
- Quick option: design one in Canva using StackPicks colors (#0a0a0a background, #c6ff00 accent)
- Add it: in `core/constants/index.ts`, `ogImage` already points to `/og-default.png`

## Sunday (2 hours)

### 15. Soft post on LinkedIn (no fanfare)
- Use the LinkedIn post from `launch/POSTS.md` section #6
- But DON'T schedule the big launch yet — this is just the soft signal to your network
- DM 10 builder friends asking for feedback specifically

### 16. Fix what they complain about
- Expect 3-5 bugs or copy issues in the first 10 hours
- Fix them — most will be tiny

### 17. Add 10 more curator takes (1 hour)
- Find 10 missing repos your friends mentioned
- Add to `scripts/seed-data.ts`
- Re-run `npx tsx scripts/seed.ts` (it's idempotent)

### 18. Test the full sponsor flow
- Even if no sponsor yet, test in Razorpay test mode:
  - Manually insert a row in `sponsors` table via Supabase Studio
  - Manually insert a row in `sponsored_slots` with `status='active'`, future `ends_at`
  - Refresh homepage — sponsored slot should render
  - Click it — should track in `outbound_clicks` table

## Week 2 (private feedback loop)

- Add 30 more curator takes (~150 total repos)
- Write 1 deep-dive blog post: "shadcn vs Material UI in 2026 (when to use which)"
- Email 20 more builder friends
- DO NOT publicly launch yet

## Week 3 (public launch)

Use `launch/POSTS.md` exactly as written. Tuesday-Friday cadence.
ProductHunt → HackerNews → Reddit → LinkedIn → Twitter → Dev.to → IndieHackers.

---

## Common Issues

**Seed script fails: "Failed to load categories"**
→ You forgot to run the categories migration. Open SQL Editor in Supabase, paste `20260521000002_seed_categories.sql`, run.

**Seed script fails: "GitHub GraphQL errors: rate limit"**
→ Your token doesn't have right scope, or you hit the 5000/hr limit. Wait 1 hour or generate a new token.

**Vercel build fails: "Cannot find module @stackpicks/core"**
→ Make sure `transpilePackages: ['@stackpicks/core']` is in `next.config.mjs` (it is in the scaffold). Also verify pnpm workspaces are detected — Vercel should auto-detect.

**Pages show "No repos in this category"**
→ Either the seed didn't run, OR `is_published = false`. Check Supabase Table Editor → repos → confirm `is_published` is `true` for at least some rows. The seed sets this to true automatically.

**Vercel Cron not running**
→ Vercel Cron requires Pro plan ($20/mo) for crons. On Hobby plan, use an external service like cron-job.org to hit `/api/cron/scrape-github` with the Bearer token in the Authorization header.

---

## What to do AFTER launch week

See `docs/MONETIZATION.md` for the revenue playbook and `launch/SPONSOR-OUTREACH.md` for cold outreach scripts.
