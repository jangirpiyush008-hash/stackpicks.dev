---
description: Create a new curated collection (e.g. "Stack for shipping a SaaS in a weekend")
---

Create a new curated collection that bundles 6-12 repos around a theme. Collections drive newsletter content, SEO long-tail, and premium gating.

### Process

1. **Theme:** I'll give you a theme like "Indian solo founder stack" or "AI agent dev tools 2026"

2. **Brainstorm the bundle:**
   - Pick 6-12 repos from `scripts/seed-data.ts` that fit the theme
   - Order them — most important first
   - For each, write a 1-line `note` explaining WHY it's in this collection (different from the curator_take which is generic)

3. **Decide:** Is this premium-gated or public?
   - Public: SEO play, top of funnel — go for high-volume themes ("react UI libraries 2026")
   - Premium: deep specificity — "How I'd build [specific product]", "stack for [niche]"

4. **Write the collection description:**
   - 2-3 sentences, builder voice
   - Says who the collection is for and what they'll save by reading

5. **Generate the SQL to insert:**

```sql
-- Step 1: Insert collection
insert into public.collections (
  slug, title, description, is_premium, is_published
) values (
  '$SLUG',
  '$TITLE',
  '$DESCRIPTION',
  $IS_PREMIUM,  -- true or false
  true
)
returning id;
```

Then for each repo:

```sql
-- Step 2: Link repos (run after getting collection_id)
insert into public.collection_repos (collection_id, repo_id, sort_order, note)
select
  '$COLLECTION_ID',
  r.id,
  $SORT_ORDER,
  '$NOTE'
from public.repos r where r.full_name = '$REPO_FULL_NAME';
```

6. **Generate the launch tweet/LinkedIn post** announcing the collection.

### Voice rules (per CLAUDE.md)

- Direct, no buzzwords
- Reference Indian context where it makes sense
- Show the tradeoff this collection makes (why these picks, not others)
- 80-160 word collection description max

### SEO bonus

After insertion, the collection auto-appears in sitemap.xml on the next ISR refresh (hourly). No code changes needed.

Theme/brief: $ARGUMENTS
