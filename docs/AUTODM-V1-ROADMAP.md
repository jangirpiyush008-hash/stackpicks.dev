# StackPicks AutoDM — v1 productization roadmap

> Decision logged 2026-06-06: path B — pitch HYPD on the engine, and / or
> spin StackPicks AutoDM out for dev creators (different ICP than HYPD).
> Approach assumes a clearance conversation with HYPD before going public.

## Why this can win

Today's IG auto-DM market has 2 huge gaps that even the leaders (ManyChat,
WhoseDM, Inrō) leave open:

1. **Setup time** — 30-60 min of manual rule wiring on every competitor.
2. **Post-DM death** — every bot dies after message #1. Recipient asks a
   follow-up question, gets silence. ~80% of conversions die there.

Plus a long tail of reliability bugs (we hit + fixed them all on the
StackPicks bot in one night):

- Private Reply API for non-followers (most tools use the standard
  messaging endpoint → silently blocks non-followers).
- Self-loop guard (bot replies → its own reply matches the keyword → loop).
- 2-message split (text + button card) instead of cramming text into a
  generic-template card's tiny `subtitle`.
- Follower-aware copy (clean DM for followers, follow-nudge for non).

Our pitch: *"ManyChat sends a template. Mine has a conversation."*

## The 14-day build to a sellable v1

### Days 1-2 — Multi-tenant migration

The bot today is single-tenant (StackPicks owns the IG account, the
keys, the token). Sellable v1 needs:

- `tenant` table — one row per creator account
  - `ig_business_id`, `ig_user_token` (encrypted), `meta_long_token`,
    `nango_connection_id`, `plan_tier`, `account_warming_ends_at`,
    `account_hourly_cap`, `is_active`
- All existing tables (`ig_dm_rules`, `ig_dm_log`, `ig_queue`,
  `ig_webhook_log`) get `tenant_id` FK + RLS policy:
  `tenant_id = (select id from tenants where owner_id = auth.uid())`
- Webhook handler routes by IG business ID → tenant lookup → use that
  tenant's token, not the global env.

### Day 3 — Onboarding OAuth flow

- `/autodm/connect` route — "Connect Instagram" button.
- Use Meta's IG Login OAuth (same flow our publisher already does).
- On callback: write to `tenant` row, kick off post-scan job.

### Days 4-5 — AI onboarding (the magic moment)

The 90-second setup is the killer feature. On connect:

1. Fetch last 30 IG media items via Graph API (already wired in
   `core/instagram/publisher.ts`).
2. For each: pull top 20 comments via `/{media-id}/comments`.
3. Cluster recurring questions / topics via Claude (e.g. for an animation
   creator: "how to install", "vs framer-motion", "react example").
4. Generate 5 starter rules — keyword + DM body + comment reply — all
   in the creator's tone (scraped from their past replies).
5. Show creator the draft: 5 rule cards, "Approve & go live" button.
6. Save rules → live.

Time-to-value target: **under 90 seconds from "Connect Instagram" click
to first live rule.**

### Day 6 — Voice cloning

- Fetch last 100 DMs the creator sent (Meta Graph API: `/me/conversations`
  → `/{convo-id}/messages`, filter `from.id == business_id`).
- Strip account-specific names. Keep emoji patterns, sentence length,
  Hinglish ratio, greetings, sign-offs.
- Build a per-tenant "style sheet" stored as JSON.
- DM-generation prompt: *"Write a DM matching this style sheet, in reply
  to this comment, on this post."*

**Validation step before exposing to customers:** test on Piyush's own
DMs first. If output reads convincingly like him, ship. If not, drop
this feature from v1 (rest of the product still wins).

### Days 7-8 — Conversational follow-up agent

Most valuable feature commercially. After bot sends the initial DM, if
the recipient replies:

- Pass full thread + tenant's product knowledge (URLs, FAQ, prices) to
  Claude.
- Claude responds in creator's voice, with creator's product info.
- Caps at 5 turns or 24h, whichever first.
- If Claude flags "I don't know how to respond" → pings the creator.

State stored in new `ig_conversations` table:
`tenant_id, recipient_igsid, last_turn_at, turn_count, status,
last_message_sent_id`.

### Days 9-10 — Spam-shield (the "we won't get your account banned" pitch)

- **Auto-delay** — 2-5s random (shipped on the StackPicks bot today).
- **Account-warming wizard** — new tenants: 30 DMs/day for 7 days,
  60/day for next 14, then unlimited (or plan-tier cap).
- **Account-hourly cap** — default 60/hr (shipped today).
- **Spam-risk linter** in rule editor:
  - Red squiggle under "free", "guaranteed", "limited offer", etc.
  - Refuses to save if body contains a raw URL when CTA card has one.
  - Warns if same exact body would be sent to 100+ recipients
    (no variants).
- **Body variants** — `dm_template_variants text[]` column. UI lets
  creator add 2-4 variants per rule. Webhook picks at random.
- **Meta 429 detector** — when sendDm returns "action blocked", auto-pause
  the tenant for 4 hours, email + in-app alert.

### Day 11 — Pricing + billing

- Free: 100 DMs/mo, 1 rule, branding line appended.
- Creator: ₹499/mo · 5,000 DMs · 10 rules.
- Pro: ₹1,499/mo · unlimited · AI body generation + follow-up agent.
- Agency: ₹4,999/mo · multi-account, white-label, team seats.

Razorpay subscription plans (we already have INR + plan IDs in `.env`).

### Day 12 — Landing page

- `/autodm` — one-page sales site.
- Hero: *"Auto-DM that closes — not just sends."*
- 30-second demo video (screen recording of the 90-sec onboarding).
- Pricing table.
- Comparison table vs ManyChat / WhoseDM / SuperProfile (steal from
  this doc).

### Day 13 — MCP-native control (the press hook)

- `/api/autodm/mcp` — expose rule CRUD as MCP tools.
- "Connect StackPicks AutoDM" listed in `/connect`.
- Creator says in Claude: *"Add a rule: when someone comments
  CALENDAR, DM my Calendly."* → MCP call → rule created.
- Niche but THE press hook for the launch.

### Day 14 — Beta with 10-20 hand-picked creators

- HYPD network folks Piyush trusts (with HYPD clearance per path B).
- 1 dev-creator (audience for the MCP angle).
- 5 lifestyle / fashion creators (audience for voice clone + follow-up).
- 5 commerce / fitness creators (audience for the conversion story).
- Free Pro tier for 30 days. Feedback every 3 days.

## What we already have that goes straight in

- IG webhook receiver — works, signature-verified, logged.
- Private Reply API send path — debugged tonight, works for non-followers.
- Self-loop guard — shipped.
- 2-message text + card split — shipped.
- Follower-aware copy — shipped.
- Multi-keyword rules (comma syntax) — shipped.
- Daily cap per recipient — shipped.
- Public comment reply — shipped.
- Diagnostic columns (`is_follower`, `reply_status`, `reply_id`,
  `follow_check_source`, `follow_check_error`) — shipped.
- Account hourly cap + humanizing 2-5s delay — shipped tonight.

About 60% of the engine is done. The remaining 40% is the multi-tenant
shell + AI layer + billing.

## HYPD path (per Piyush's decision)

Before any public launch:

1. Demo the working StackPicks bot to HYPD leadership.
2. Receipts for HYPD's broken cases — non-follower failures, self-loops,
   whatever Piyush has seen on the inside.
3. Offer two paths:
   - **Bring the engine in-house** — Piyush owns the upgrade, gets
     a clear cash + equity bump for it.
   - **Spin out for non-overlapping market** — StackPicks AutoDM
     serves dev / SaaS creators (not lifestyle / fashion creators that
     HYPD targets).
4. Get this in writing before any code goes public.

## Open questions

- Voice cloning quality — must validate on real DMs before pricing
  the Pro tier around it.
- Token cost per DM — Claude API at ~₹0.20-0.50 per AI-generated DM
  shapes the Pro tier unit economics. Need a sample run before locking
  pricing.
- Meta app review — for non-StackPicks tenants, the IG app needs to
  pass Business Verification for "instagram_business_manage_messages"
  scope at scale. Worth starting tomorrow.
- HYPD employment contract — non-compete clause specifics. Path B
  hinges on this.
