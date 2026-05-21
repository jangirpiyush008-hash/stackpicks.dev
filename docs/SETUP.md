# Setup Guide

## Prerequisites

- Node 20+
- pnpm 9+
- Supabase CLI: `npm install -g supabase`
- A Supabase project (free tier works for v1)
- Razorpay account (test mode initially)
- GitHub Personal Access Token (`public_repo` scope only)
- Resend account (for newsletter, optional for v1)

## Local setup

```bash
# 1. Clone and install
git clone <your-repo-url> stackpicks
cd stackpicks
pnpm install

# 2. Environment
cp .env.example .env.local
# Fill in all values

# 3. Database
supabase link --project-ref <your-project-ref>
pnpm db:push
pnpm db:types

# 4. Seed initial repos (run once)
# Use the helper script in scripts/seed-repos.ts (see below)
# Or manually insert via Supabase Studio

# 5. Run dev server
pnpm dev
# Open http://localhost:3000
```

## Seeding initial repos

Create a `scripts/seed-repos.ts` with your starter list. Example:

```ts
import { adminClient } from '../core/db';
import { fetchManyRepos, slugFromFullName } from '../core/github';

const SEED = [
  'shadcn-ui/ui',
  'mui/material-ui',
  'tailwindlabs/tailwindcss',
  'framer/motion',
  'TanStack/query',
  'vercel/next.js',
  'supabase/supabase',
  // ... add 50+ to start
];

async function main() {
  const repos = await fetchManyRepos(SEED);
  const supabase = adminClient();

  const inserts = repos.map((r) => ({
    ...r,
    slug: slugFromFullName(r.full_name),
    is_published: false, // review queue before going live
    stars_last_week: 0,
  }));

  const { error } = await supabase.from('repos').upsert(inserts, { onConflict: 'github_id' });
  if (error) console.error(error); else console.log(`Seeded ${inserts.length} repos`);
}

main();
```

Run with: `npx tsx scripts/seed-repos.ts`

Then review and publish via Supabase Studio (set `is_published = true`), and add `curator_take`, `use_this_if`, `skip_if` for the ones you want to feature.

## Razorpay setup

1. Create test mode keys in Razorpay dashboard
2. Create plans via API or dashboard:
   - Premium Monthly: ₹299/month
   - Sponsor Category Top: ₹2,500/month
   - Sponsor Homepage: ₹10,000/month
3. Add plan IDs to `.env.local`
4. Configure webhook URL: `https://stackpicks.dev/api/webhook/razorpay`
5. Subscribe to events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.captured`, `payment.failed`

## Vercel deployment

1. Push repo to GitHub
2. Import project in Vercel, select `apps/web` as root
3. Add all env vars from `.env.example`
4. Set `CRON_SECRET` to a strong random value
5. Deploy

The Vercel Cron config in `vercel.json` will trigger daily scraping automatically.

## Custom domain

1. Buy `stackpicks.dev` from Namecheap (~₹1,200/yr)
2. In Vercel project settings → Domains → Add `stackpicks.dev`
3. Update Namecheap DNS to Vercel's nameservers
4. Wait for DNS propagation (~10 min)
5. Update `NEXT_PUBLIC_SITE_URL` env var

## Production checklist (per NEXUS rules)

- [ ] All env vars set in Vercel
- [ ] `.env*` files in `.gitignore`
- [ ] RLS enabled on every table (verify in Supabase Studio → Authentication → Policies)
- [ ] Razorpay in live mode after KYC + first test payment verified end-to-end
- [ ] `CRON_SECRET` set and rotated
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] OG default image uploaded to `/public/og-default.png`
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Plausible or Umami analytics (privacy-friendly)
- [ ] Test webhook with Razorpay's webhook tester
