---
description: Add a new repo to the StackPicks directory with curator take
---

You are adding a new repo to the StackPicks directory. Follow this exact process:

1. Open `scripts/seed-data.ts`
2. Find the appropriate category section (UI Components, AI & ML, Animation, etc.)
3. Add a new `SeedEntry` object with ALL six required fields:
   - `full_name`: exact `owner/repo` from GitHub URL
   - `category_slugs`: array of category slugs (must exist in `supabase/migrations/20260521000002_seed_categories.sql`)
   - `is_featured`: `true` only for category leaders that should appear in homepage rotation
   - `curator_take`: 80-160 words, direct voice, no buzzwords, no emoji. Follow voice rules in CLAUDE.md
   - `use_this_if`: 1-2 sentences, specific (e.g. "You are on Next.js + Tailwind" not "You want components")
   - `skip_if`: 1-2 sentences, real reason (e.g. "Skip if you're deep in shadcn — migration cost is real" not "Skip if you don't need it")
4. Verify the category slugs exist by grepping the seed_categories migration
5. Show me the diff before running anything
6. After my approval, run: `npx tsx scripts/seed.ts`

Voice rules (from CLAUDE.md):
- No "Excited", "Thrilled", "Humbled" openings
- Never: synergy, 10x, growth hack, disrupt, leverage as verb, unlock, level up
- Show specific tradeoffs, not just praise
- Reference Indian context where relevant
- No emoji

Repo to add: $ARGUMENTS
