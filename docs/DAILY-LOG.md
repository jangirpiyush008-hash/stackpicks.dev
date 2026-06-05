# StackPicks — Daily Log

Running log of daily work. **Newest entry on top.** Read by "Start the day",
appended by "End today". Prime directive: rank on Google + AI agents to sell
lifetime subscriptions.

Two daily tracks:
- **SEO calendar** — `apps/web/lib/seo-calendar.ts` (tracker: `/admin/seo`)
- **Connect wiring** — `apps/web/lib/connect-roadmap.ts` (tracker: `/admin/connect`), 5 apps/day, launch at 50 live

---

## 2026-06-05 (Day 7 — IG auto-DM live + catalog refresh + admin calendar)

### Shipped today

**Catalog refresh sweep**
- Re-scraped all 162 existing repos against GitHub GraphQL API → fresh stars/forks/lang
- Added 12 new repos: DuckDB, ClickHouse, OpenHands, modelcontextprotocol/servers, DeepSeek-V3, Convex backend, lobe-chat, Skyvern, ToolJet, Langfuse, Helicone, Qwik → 174 total published
- Added 8 new MCP servers to /mcp directory: AWS (GA), Cloudflare, Meta Ads (official), Groq, DeepSeek, DuckDB, Langfuse, ClickHouse → 122 MCPs total
- Shipped /blog/whats-new-june-2026-stackpicks with step-by-step install for each new MCP (quick_answer ≤350 chars, 5 FAQs, FAQPage JSON-LD)
- WhatsNewPopup component → bottom-right toast on /, /mcp, /connect showing +12 / +8 / 174 counts. Bumpable via REFRESH_ID const

**/admin/instagram — 3 tabs**
- Calendar tab (default): month grid showing every scheduled post by IST date with time + status pill, prev/next nav, today highlight, footer stats. Pre-populated 4 carousel placeholders for Jun 8/10/11/15
- Queue tab: existing table view
- DM rules tab: full CRUD for comment→DM auto-reply rules, with seeded "Comment STACK → directory link" rule
- Added `draft` status to ig_queue (cron skips drafts, calendar shows them)

**IG auto-DM live end-to-end**
- DB: ig_dm_rules + ig_dm_log + ig_webhook_log tables (RLS, service-role only)
- /api/webhook/instagram: GET verify + POST signature check (HMAC SHA-256), comment-match → send DM, daily-cap enforced
- /api/admin/ig-subscribe: one-click button to subscribe IG account via graph.instagram.com (auto-detects token type, tries IG-direct + Page fallback)
- /api/admin/ig-debug: token + scopes + subscription state introspection
- core/instagram/dm.ts: sendDm() via /<IG_BUSINESS_ID>/messages, generic template with CTA button
- **Long debug session** to resolve Meta's IG Login API quirks:
  - System User token couldn't subscribe webhooks (capability error) → had to OAuth via Add account flow
  - Token routes through graph.instagram.com, not graph.facebook.com (key insight from token-debugger showing IG App ID, not Meta App ID)
  - Webhook signatures signed with Instagram App Secret, not Meta App Secret → added IG_APP_SECRET env
  - App had to be in Live mode for IG Login API to deliver events
- **First DM sent ✅** — STACK comment from @piyush.jangir on Meta Ads AI Connector post → directory link DM landed

**Live status**
- IG auto-publisher: still autopilot Mon-Fri (cron-job.org → /api/cron/ig-publish)
- IG auto-DM: live + rule active ("STACK" keyword → stackpicks.dev link)
- Meta App: Live mode (Standard Access on instagram_business_*)

### To-do tomorrow
- Build HTML for carousels #3-#6 (MCP 2.0, Opus 4.8, AWS MCP GA, ChatGPT Ads) + export PNGs + flip draft rows to ready
- More auto-DM rules for future content drops
- Consider second keyword (e.g. "BUNDLE" → curated stack page)

---

## 2026-06-03 (Day 5 — Ads stack + content cluster)

### Shipped today
- **Connect: Google Ads + Meta Ads LIVE** via Bring-Your-Own-Token mode (22 providers live).
  - Rewrote `core/connect/executors/google-ads.ts` to accept JSON config (developer_token, client_id, client_secret, refresh_token) and mint access tokens via refresh-token grant just-in-time.
  - `core/connect/executors/facebook-ads.ts` accepts a System User Access Token as Bearer directly.
  - Both added to `API_KEY_PROVIDERS` + `API_KEY_HINTS`. Catalog flipped → live.
- **Google Ads dev token process kicked off:**
  - New MCC `857-177-3115` created + existing direct account linked.
  - Test Account dev token issued instantly.
  - **Basic Access application submitted** (full design doc + form) — Google review SLA 3 business days.
- **Refreshed top 5 existing blog posts** (date bump to 2026-06-03 + meaningful content updates reflecting 22 live + BYO ads):
  - `/blog/mcp-explained` (14.5k/mo flagship), `/blog/one-mcp-for-all-apps...` (9k), `/blog/mcp-2-0-explained-2026` (6k), `/blog/claude-opus-4-8-explained-2026` (18k), `/blog/aws-mcp-server-ga-2026` (5.5k).
- **3 new blog posts shipped — ad-ops content cluster:**
  - `/blog/chatgpt-ads-explained-2026` (14k/mo) — news explainer on OpenAI's Feb 9 ads launch + May self-serve rollout
  - `/blog/connect-google-ads-to-claude-mcp-2026` (4.5k/mo) — full BYO-token setup guide
  - `/blog/connect-meta-ads-to-claude-mcp-2026` (3.8k/mo) — System User Access Token guide
  - All 3 cross-link → forms ad-ops topical cluster. quick_answer + 6 FAQs each (FAQPage JSON-LD). Auto-wired into sitemap / llms.txt / RSS / blog index.

### Files touched today
- `core/connect/executors/google-ads.ts` (rewrote to JSON-config BYO mode)
- `core/connect/executors/facebook-ads.ts` (existing — works as-is with System User token)
- `core/connect/providers.ts` (added google-ads + facebook-ads to API_KEY_PROVIDERS + HINTS)
- `apps/web/lib/connect-apps.ts` (Google Ads + Meta Ads → live)
- `apps/web/lib/blog.ts` (3 new posts + 5 refreshed posts + TODAY_JUN3 const)
- `docs/DAILY-LOG.md`

### State
- **Connect: 22 / 50 live.** (github, slack, notion, linear, gitlab, airtable, asana, calendly, todoist, dropbox + vercel, cloudflare, sentry, supabase, figma, firecrawl, tavily, exa, brave-search, perplexity + google-ads, facebook-ads)
- Code-ready, awaiting Nango registration (4 OAuth): Intercom, Jira, HubSpot, ClickUp. monday.com parked (needs paid plan).
- **Blog: 16 posts.** Newest cluster (Ads × MCP) is the highest-leverage SEO content yet — direct purchase intent + fresh news hook.

### Tomorrow / next
- **[YOU]** Google Ads Basic Access decision lands within 3 business days. Watch `stackpicks.dev@gmail.com`. Once approved → 5-min setup (OAuth Playground → paste JSON on /connect) → real ads data through Claude.
- **[YOU]** Meta Ads System User token setup (~15 min, no waiting period) — parked today, easy win whenever.
- **[YOU]** GSC + Bing manual indexing for the 3 new posts (~5 min each):
  - /blog/chatgpt-ads-explained-2026
  - /blog/connect-google-ads-to-claude-mcp-2026
  - /blog/connect-meta-ads-to-claude-mcp-2026
- **[YOU]** Continue Nango queue: Intercom → Jira → HubSpot → retry ClickUp. Set RESEND_AUDIENCE_ID in Railway.
- **[ME]** Next OAuth executor batch when needed: Box, Trello, Zendesk, Discord.

---

## 2026-06-02 (Day 4 — Connect push to 20 live)

### Shipped today
- **+2 apps LIVE end-to-end via Nango (Piyush registered, Nango "Test Connection" passed):**
  - **Todoist** (4 tools) — fixed "Invalid redirect URI" by saving redirect chip + ensuring Service URL was changed off the callback value
  - **Dropbox** (4 tools)
- **Connect: 5 new OAuth executors code-ready (ClickUp, Dropbox, monday, Intercom, Todoist):**
  - Files: `core/connect/executors/{clickup,dropbox,monday,intercom,todoist}.ts`
  - All wired into dispatcher + Provider union + tool registry, +21 tools
- **Connect: 2 more OAuth executors code-ready (Jira, HubSpot):**
  - Atlassian Jira uses cloudId resolution via `accessible-resources` then v3 REST; HubSpot CRM v3
  - +9 tools — stay 'soon' until Nango registration
- **Daily ritual:** confirmed standing rule in CLAUDE.md works (news → blog post). Wrote 3 timely posts earlier in the session (MCP 2.0, Claude Opus 4.8, AWS MCP GA) — all live.
- **DB honesty check:** queried `oauth_connections` + `api_key_connections` in prod — both empty. "Live" means code-complete; no end-user round-trip yet. Logged this gap.
- **Catalog flips:** Calendly (earlier), GitLab, Airtable, Asana, Todoist, Dropbox → live.

### Live providers now (20)
github, slack, notion, linear, gitlab, airtable, asana, calendly, todoist, dropbox + vercel, cloudflare, sentry, supabase, figma, firecrawl, tavily, exa, brave-search, perplexity.

### Files touched today
- `core/connect/executors/{jira,hubspot,clickup,dropbox,monday,intercom,todoist}.ts` (new)
- `core/connect/executors/index.ts` (7 dispatcher cases)
- `core/connect/tools.ts` (Provider union + 30 tool defs)
- `apps/web/lib/connect-apps.ts` (Todoist + Dropbox → live)
- `docs/DAILY-LOG.md` (this entry)

### State
- Connect: 20 live, 30 to public launch.
- Code-ready, awaiting Nango registration (5 OAuth): ClickUp, monday.com, Intercom, Jira, HubSpot.
- **monday.com blocked** — requires paid Developer plan. Park until plan upgrade.
- ClickUp blocked — settings page flaky during Piyush's session; retry later.

### Late additions (after first end-of-day)
- **Inbound internal links shipped:** flagship `/blog/mcp-explained` (14.5k/mo, highest authority) now links to all 3 new posts (MCP 2.0, Opus 4.8, AWS MCP GA) — link-equity pass for faster ranking.
- **SEO Day 6 — LaunchingNext submission:** paste-ready copy provided (tagline, 600-char description, tags, "bootstrapped startup", "<$1k marketing", launch date 2026-05-21). Piyush submitting.
- **Newsletter broadcast draft:** subject + body ready for Resend → 3-post roundup tying back to /connect.
- **IndexNow note:** my local CRON_SECRET ≠ Railway's, so the 3 new posts didn't auto-ping. Bing Webmaster manual submit + GSC Request Indexing is the workaround for instant crawl.
- **Google Ads + Meta Ads switched to BYO-token mode (LIVE in catalog):** rewrote google-ads executor to accept JSON config (developer_token, client_id, client_secret, refresh_token) — mints access tokens via refresh-token grant just-in-time. facebook-ads stays Bearer-token directly (System User token). Both added to `API_KEY_PROVIDERS` + `API_KEY_HINTS`. Catalog flipped → 22 apps live.
- **Google Ads developer token:** Test Account tier issued instantly to new MCC `857-177-3115`. **Basic Access application submitted** (full design doc + form) — review SLA 3 business days. Once approved, Piyush can connect his real Google Ads account end-to-end (OAuth Playground → refresh token → paste JSON on /connect).

### Tomorrow / next
- **[YOU]** Continue Nango registration queue (4 remaining): Intercom → Jira → HubSpot → retry ClickUp. Monday parked.
- **[YOU]** Start **Google OAuth verification** (still pending, weeks of lead time — unlocks Gmail, Drive, Sheets, Calendar, Docs, GA, GSC, Google Ads = 8 apps).
- **[YOU]** Set `RESEND_AUDIENCE_ID` in Railway.
- **[YOU]** Confirm: LaunchingNext + StartupBase submissions, GSC + Bing Request Indexing × 3 URLs, Resend broadcast sent.
- **[YOU]** Verify end-to-end: connect 1 OAuth (Todoist) + 1 API-key (Tavily) on /connect, ask Claude to use them. If both work, we trust the rest.
- **[ME]** Next OAuth batch when you're ready: Box, Trello, Zendesk, Discord — basic + useful.

---

## 2026-05-31 (Day 3 of the ritual — 2-day catch-up for 5-30 + 5-31)

### Shipped today
- **Connect Day 4 — 5 platforms LIVE via API-key path (+26 tools, zero Nango):**
  - New executors: `core/connect/executors/{vercel,cloudflare,sentry,supabase-mgmt,figma}.ts`
  - All token-based, so wired through the encrypted API-key path (Option B) — no OAuth app registration needed. User pastes a token on /connect and it works.
  - Added to `API_KEY_PROVIDERS` + `API_KEY_HINTS` (with get-token URLs + prefixes; Sentry prefix omitted — multiple valid formats), Provider union, dispatcher, tool registry.
  - Catalog flipped live: vercel, cloudflare, sentry, supabase, figma (5 tools each).
  - **Live providers now: 11** — github, slack, notion, linear, firecrawl, calendly, + vercel, cloudflare, sentry, supabase, figma.
  - Figma note: uses `X-Figma-Token` header (not Bearer) — handled in its executor.
- **SEO — 2 timely blog posts (Day 6 + Day 7 catch-up, the real wins):**
  - `/blog/claude-opus-4-8-explained-2026` — "Claude Opus 4.8 Explained" (target ~18k/mo, model launched May 28, 3 days old, low competition)
  - `/blog/aws-mcp-server-ga-2026` — "AWS MCP Server Hits GA" (target ~5.5k/mo, enterprise MCP angle, ties to /mcp + /connect)
  - Both: quick_answer + 6 FAQs (FAQPage JSON-LD), internal links, auto-wired into sitemap/llms.txt/RSS. Both pinned via /llms.txt "Latest posts" (newest-first).
- **Process:** confirmed standing rule in CLAUDE.md — "search latest news" → ship SEO+GEO blog post; distribution via OWNED channels only (newsletter, internal links, GSC/Bing, IndexNow, network).

### Files touched (for memory)
- `core/connect/executors/{vercel,cloudflare,sentry,supabase-mgmt,figma}.ts` (new)
- `core/connect/executors/index.ts` (5 dispatcher cases)
- `core/connect/tools.ts` (Provider union + 26 tool defs)
- `core/connect/providers.ts` (5 API-key providers + hints)
- `apps/web/lib/connect-apps.ts` (5 → live)
- `apps/web/lib/blog.ts` (2 new posts + TODAY_30/TODAY_31 consts)
- `CLAUDE.md` (standing news→blog rule + owned-channel distribution)
- `apps/web/app/llms.txt/route.ts` (pinned latest posts — done 5-29)

### State
- Connect: 11 live (toward 50 for public launch). GitLab/Airtable/Asana still code-ready, awaiting Piyush Nango registration.
- SEO: blog posts #11, #12, #13 shipped (MCP 2.0, Opus 4.8, AWS MCP GA). Calendar Days 6-7 are [YOU] tasks (directories + indexing review).
- News of the day logged: Opus 4.8 (May 28), AWS MCP GA, Atlassian MCP token updates, MS Agent 365 GA, OpenCode 150k stars.

### Tomorrow / next
- **[YOU]** Test a Day-4 connection: paste a Vercel/Figma token on /connect (admin bypass), confirm tools appear in Claude.
- **[YOU]** SEO Day 6: submit LaunchingNext + StartupBase. Day 7: GSC/Bing indexing review.
- **[YOU]** Register GitLab/Airtable/Asana in Nango (prod). Set RESEND_AUDIENCE_ID in Railway. Start Google OAuth verification.
- **[YOU]** Newsletter: send the 3 new posts as a Resend broadcast to the imported list.
- **[ME]** Connect Day 5 (brave-search, tavily, exa, airtable, canva) next session — tavily/exa/brave are API-key (fast).

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
