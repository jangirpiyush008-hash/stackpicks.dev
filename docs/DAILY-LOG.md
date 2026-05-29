# StackPicks — Daily Log

Running log of daily work. **Newest entry on top.** Read by "Start the day",
appended by "End today". Prime directive: rank on Google + AI agents to sell
lifetime subscriptions.

Two daily tracks:
- **SEO calendar** — `apps/web/lib/seo-calendar.ts` (tracker: `/admin/seo`)
- **Connect wiring** — `apps/web/lib/connect-roadmap.ts` (tracker: `/admin/connect`), 5 apps/day, launch at 50 live

---

## 2026-05-29 (Day 2 of the daily ritual)

### Shipped today
- **Connect — 4 more OAuth providers wired (code-ready, +22 tools):**
  - New executors: `core/connect/executors/{gitlab,airtable,calendly,asana}.ts`
  - Registered in dispatcher `core/connect/executors/index.ts` + tool registry `core/connect/tools.ts` (Provider union extended)
  - **Calendly flipped LIVE** (4 tools) — OAuth verified end-to-end via Nango prod; catalog status → live in `apps/web/lib/connect-apps.ts`
  - GitLab / Airtable / Asana: code shipped, catalog still `soon` — pending Piyush Nango registration
  - Live providers now: GitHub, Slack, Notion, Linear, Firecrawl, **Calendly** = 6
- **SEO — new timely blog post (the real win today):**
  - `/blog/mcp-2-0-explained-2026` — "MCP 2.0 Explained (2026-07-28 spec RC)"
  - Targets fresh, low-competition keyword **"mcp 2.0 explained"** off the May 21 release candidate news (stateless core, OAuth 2.1, MCP Apps/Tasks/Server Cards, 9,652-server registry, Atlassian + Base gateways)
  - quick_answer + 6 FAQs (FAQPage JSON-LD) + internal links to /connect, /mcp, /blog/mcp-explained, /blog/one-mcp-for-all-apps...
  - Auto-wired into sitemap, /llms.txt, /llms-full.txt, RSS, blog index (all derive from BLOG_POSTS)
- **SEO Day 5 (directories):** StackShare submitted (after fixing the AI category-classifier copy: lead with "SaaS platform / developer tool / AI agents"). OpenAlternative.co flagged as poor fit — it requires a public OSS repo; StackPicks app is closed-source. Use awesome-stackpicks repo or skip (honesty rule).

### Files touched today (for memory)
- `core/connect/executors/gitlab.ts` `airtable.ts` `calendly.ts` `asana.ts` (new)
- `core/connect/executors/index.ts` (dispatcher cases)
- `core/connect/tools.ts` (Provider union + 22 tool defs)
- `apps/web/lib/connect-apps.ts` (Calendly → live)
- `apps/web/lib/blog.ts` (new post + TODAY_29 const)
- `docs/DAILY-LOG.md` (this entry)

### State
- Connect: 6 live. GitLab/Airtable/Asana code-ready, awaiting Nango OAuth registration by Piyush.
- SEO: Day 5 directories partial (StackShare done, OpenAlternative skipped/pending repo). New blog post #11 shipped.

### Tomorrow / next
- **[YOU]** Register GitLab / Airtable / Asana OAuth apps + Nango (prod, slugs: gitlab, airtable, asana). Airtable needs the 3 scopes enabled on the app registration.
- **[YOU]** Distribute the MCP 2.0 post (see channel list) — Reddit r/ClaudeAI, HN, dev.to cross-post, LinkedIn, X.
- **[ME]** Trigger IndexNow ping for the new post once Railway deploy is live.
- **[YOU]** Still pending: RESEND_AUDIENCE_ID in Railway; Google OAuth verification kickoff.

---

## 2026-05-28 (Day 1 of the daily ritual)

Big day — StackPicks Connect went from idea to a launch-gated, OAuth-live product, and the newsletter became a real pipeline.

### Shipped today
- **StackPicks Connect — full product, end to end:**
  - 818-app catalog + Composio-style directory UI (real brand logos via Clearbit/DDG/Google, sidebar, search)
  - DB: oauth_connections, stackpicks_api_keys, mcp_audit_log, mcp_waitlist + OAuth-server tables (oauth_clients, oauth_auth_codes, mcp_oauth_tokens) — all RLS-on, applied to prod Supabase
  - **GitHub wired LIVE end-to-end** — Nango (prod env) + executor (8 tools) + verified working in Claude
  - `@stackpicks/mcp` npm package **published to npm** (v0.1.0)
  - 3 install paths: (1) generic OAuth URL `/api/mcp` (paste one link, browser login, no key), (2) per-key URL `/api/mcp/s/[key]`, (3) npx package
  - **OAuth 2.1 authorization server** — discovery metadata, dynamic client registration, /authorize (Supabase session + PKCE), /token, generic /api/mcp. Verified discovery + 401 flow on prod.
  - Launch gate `NEXT_PUBLIC_CONNECT_LAUNCHED` (false) — public gets a full **Coming Soon takeover** (hero + waitlist + dimmed logo teaser + "connect the MCP now" early-access card). Admins bypass to test/wire.
  - 56-app wiring roadmap (5/day, ads on Day 3) + admin tracker `/admin/connect`
  - Catalog expanded with Google Ads + Meta/TikTok/LinkedIn ads
  - /mcp two-product splitter + homepage promo both show "Coming soon" until launch
- **Newsletter — now a real pipeline:**
  - Confirmed capture works (signups → Supabase, 3 subs)
  - Auto-sync signups → Resend Audience (RESEND_AUDIENCE_ID, fire-and-forget)
  - Designed dark-themed HTML emails (cold intro + Cal.com Sunday-drop template)
  - Piyush: created Resend audience, imported existing email list, sent test
- **Trust/honesty pass:** stripped all fabricated counts ("2,000 subscribers", "847+ builders") site-wide per brand rule
- **SEO:**
  - Day 3 (Indie Hackers) ✅, Day 4 (SaaSHub — swapped from AlternativeTo, which rejects new entries) ✅
  - Launch blog post: `/blog/one-mcp-for-all-apps-composio-alternative-2026` (targets "Composio alternative", ~9k/mo)
  - Calendar updated: Day 4 → SaaSHub, Day 5 → StackShare + OpenAlternative
- **Process:** established the daily ritual (Start the day / End today) in CLAUDE.md + this log

### State
- Connect: GitHub live (1/50 toward public launch). Publicly gated; MCP URL works for early adopters.
- SEO calendar: through Day 4. Next = Day 5.
- Newsletter: capture + Resend sync live; Piyush sending intro to imported list.

### Tomorrow / next
- **[ME]** Connect Day 2 wiring: executors for Slack, Notion, Linear, Stripe, Firecrawl
- **[YOU]** Register those 5 OAuth apps + add to Nango (prod, matching slugs)
- **[YOU]** Submit Google OAuth verification now (Days 3 + 9 Google/ads apps — weeks of lead time)
- **[YOU]** Set `RESEND_AUDIENCE_ID` in Railway (auto-sync future signups)
- **[YOU]** SEO Day 5: StackShare + OpenAlternative.co (paste-packs on request)
- **[YOU]** Check off Day 4 in `/admin/seo`
- **[MAYBE]** Decide on fake testimonials in testimonials.ts (remove or reframe — same honesty risk as the counts)
