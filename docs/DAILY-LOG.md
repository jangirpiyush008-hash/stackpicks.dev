# StackPicks — Daily Log

Running log of daily work. **Newest entry on top.** Read by "Start the day",
appended by "End today". Prime directive: rank on Google + AI agents to sell
lifetime subscriptions.

Two daily tracks:
- **SEO calendar** — `apps/web/lib/seo-calendar.ts` (tracker: `/admin/seo`)
- **Connect wiring** — `apps/web/lib/connect-roadmap.ts` (tracker: `/admin/connect`), 5 apps/day, launch at 50 live

---

## 2026-05-28 (Day 1 of the daily ritual)

### Shipped today
- **StackPicks Connect — full build, end to end:**
  - 817-app catalog + Composio-style directory UI (real logos, sidebar, search)
  - DB: oauth_connections, api_keys, audit_log, waitlist, + OAuth-server tables
  - **GitHub wired live end-to-end** — Nango (prod) + executor + verified in Claude
  - `@stackpicks/mcp` npm package **published** (v0.1.0)
  - Remote MCP URL endpoint (`/api/mcp/s/[key]`) — Streamable HTTP
  - **OAuth 2.1 server** (`/api/mcp` generic URL) — paste one URL, browser login, no key
  - Launch gate (`NEXT_PUBLIC_CONNECT_LAUNCHED=false`) — public sees "Coming soon" until 50 live
  - 56-app wiring roadmap (5/day, ads on Day 3) + admin tracker `/admin/connect`
  - Added Google Ads + Meta/TikTok/LinkedIn ads to catalog
- **SEO:**
  - Day 3 (Indie Hackers) ✅, Day 4 (SaaSHub — swapped from AlternativeTo) ✅
  - Launch blog post: `/blog/one-mcp-for-all-apps-composio-alternative-2026` (targets "Composio alternative", ~9k/mo)
  - Calendar updated: Day 4 → SaaSHub, Day 5 → StackShare + OpenAlternative

### State
- Connect: GitHub live (1/50 toward public launch). Gated.
- SEO calendar: through Day 4. Next = Day 5.

### Tomorrow / next
- **[ME]** Connect Day 2 wiring: executors for Slack, Notion, Linear, Stripe, Firecrawl
- **[YOU]** Register those 5 OAuth apps + add to Nango (prod, matching slugs)
- **[YOU]** Submit Google OAuth verification (needed for Days 3 + 9 Google/ads apps — long lead time)
- **[YOU]** SEO Day 5: StackShare + OpenAlternative.co (paste-packs on request)
- **[YOU]** Check off Day 4 in `/admin/seo`
