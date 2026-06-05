/**
 * Blog content — keyword-targeted long-form articles.
 * Each post targets a specific search query with quantified search volume.
 * Content lives inline (not in a CMS) so it ships with the codebase.
 */

export interface BlogPost {
  slug: string;
  title: string;             // SEO-optimized H1
  excerpt: string;           // 160-char meta description
  query: string;             // Target search query
  monthly_searches: number;  // Estimated, for sorting
  reading_time: number;      // Minutes
  published_at: string;      // ISO date
  updated_at: string;
  author: string;
  category: string;
  content: string;           // Markdown-like (we'll render with simple parser)
  // GEO: 1-2 sentence answer-first block AI engines lift as the citation snippet.
  // Keep under 350 chars. Optional — falls back to excerpt if missing.
  quick_answer?: string;
  // GEO: FAQ pairs that get serialized as FAQPage JSON-LD for AI Overviews +
  // "People also ask" rich results. 3-5 questions is the sweet spot.
  faqs?: { question: string; answer: string }[];
}

const TODAY = '2026-05-22';
const NEW_TODAY = '2026-05-23';
const LATEST = '2026-05-26';
const TODAY_27 = '2026-05-27';
const TODAY_28 = '2026-05-28';
const TODAY_29 = '2026-05-29';
const TODAY_30 = '2026-05-30';
const TODAY_31 = '2026-05-31';
const TODAY_JUN3 = '2026-06-03';
const TODAY_JUN5 = '2026-06-05';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'whats-new-june-2026-stackpicks',
    title: 'What\'s New on StackPicks — June 2026 Refresh (12 New Repos, 8 New MCPs)',
    excerpt: 'June 5 refresh: 12 new OSS repos, 8 new MCP servers, 174 existing repos re-scraped with live GitHub stats. Includes install steps for every new MCP.',
    query: 'stackpicks june 2026 new repos mcp servers refresh',
    monthly_searches: 600,
    reading_time: 5,
    published_at: TODAY_JUN5,
    updated_at: TODAY_JUN5,
    author: 'Piyush Jangir',
    category: 'Changelog',
    quick_answer: 'On June 5, 2026 StackPicks added 12 new repos (DuckDB, OpenHands, DeepSeek V3, Convex, Qwik, more) and 8 new MCP servers (AWS, Cloudflare, Meta Ads official, Groq, DeepSeek, DuckDB, Langfuse, ClickHouse). All 174 existing repos were re-scraped with live GitHub stats.',
    faqs: [
      { question: 'How often does StackPicks refresh GitHub data?', answer: 'Daily. A cron job hits /api/cron/scrape-github every 24 hours and pulls live stars, forks, language, license, and last-push timestamps for every published repo. The numbers on each repo page are never more than a day stale. Pages auto-revalidate on the next request via Next.js ISR — no manual deploy needed for stats to update.' },
      { question: 'Which new repos were added on June 5, 2026?', answer: '12 new picks: DuckDB and ClickHouse (analytics), All-Hands-AI/OpenHands (autonomous coding agent), modelcontextprotocol/servers (Anthropic\'s reference MCP servers), DeepSeek V3 (open-weights LLM), Convex backend, lobe-chat (self-hosted ChatGPT), Skyvern (LLM browser automation), ToolJet (open-source Retool), Langfuse, Helicone (LLM observability), and Qwik (resumable framework).' },
      { question: 'Which new MCP servers were added?', answer: '8 production-ready MCPs: AWS (Bedrock, S3, Lambda, Cost Explorer), Cloudflare (Workers, R2, D1, DNS), Meta Ads (official, launched April 29), Groq (sub-100ms inference), DeepSeek, DuckDB (SQL over flat files), Langfuse (LLM traces), and ClickHouse (real-time analytics). All include install commands and auth notes on the /mcp directory.' },
      { question: 'How do I install one of the new MCPs?', answer: 'Open the MCP page at /mcp, click the server you want, and copy the install command (npx, uvx, or remote URL). Paste it into your Claude Desktop or Cursor MCP config file, restart the client, and the tools show up. Each MCP page lists which auth (API key, OAuth, none) it needs.' },
      { question: 'How can I suggest a new repo or MCP?', answer: 'Use the submit form at /submit-repo. We review submissions weekly. To qualify, the project must be open source (MIT, Apache, BSD, or AGPL), have commits in the last 60 days, have real users (not a toy project), and fit a category that exists in our taxonomy. We do not list paid-only tools, abandoned forks, or proof-of-concept demos.' },
    ],
    content: `**Short version:** On **June 5, 2026** we added **12 new repos** and **8 new MCP servers**, and re-scraped GitHub stats for the existing **174 repos** in the catalog.

Use the in-page links below to jump straight to install steps for any new MCP.

## What changed today

| What | Count |
|---|---|
| New repos added | **12** |
| New MCP servers added | **8** |
| Existing repos re-scraped | **174** |
| Total catalog | **174 repos + 122 MCPs** |

## The 12 new repos

Grouped by what they do. Click any name to open the StackPicks page with the full curator take.

**AI / agents**
- [OpenHands](/repo/openhands) — the strongest open-source coding agent
- [DeepSeek V3](/repo/deepseek-v3) — frontier LLM at ~1/30th the cost
- [lobe-chat](/repo/lobe-chat) — self-hosted ChatGPT, MCP support built in
- [Skyvern](/repo/skyvern) — LLM-driven browser automation
- [Langfuse](/repo/langfuse) — LLM observability for production
- [Helicone](/repo/helicone) — one-line LLM monitoring proxy

**Data + analytics**
- [DuckDB](/repo/duckdb) — SQL over flat files, no server needed
- [ClickHouse](/repo/clickhouse) — columnar SQL at billions of rows

**Frameworks + tools**
- [Convex](/repo/convex-backend) — reactive backend-as-a-service
- [Qwik](/repo/qwik) — resumable framework, top Lighthouse scores
- [ToolJet](/repo/tooljet) — open-source Retool

**MCP infra**
- [modelcontextprotocol/servers](/repo/servers) — Anthropic's official reference MCPs

## The 8 new MCPs — with install steps

Every install below follows the same 3-step pattern: copy the command, paste into your MCP client config, restart the client.

### 1. AWS MCP

What it does: Bedrock, S3, Lambda, Cost Explorer, CloudWatch, IAM.

1. Install Python 3.11+ and \`uv\`.
2. Add to Claude Desktop config: \`uvx awslabs.cost-explorer-mcp-server@latest\`.
3. Set AWS credentials in env (\`AWS_ACCESS_KEY_ID\`, \`AWS_SECRET_ACCESS_KEY\`).
4. Restart Claude Desktop. Tools appear under "aws" prefix.

### 2. Cloudflare MCP

What it does: Workers, R2, D1, KV, DNS, Pages, Analytics.

1. Open Claude Desktop → Settings → MCP servers.
2. Add a remote server with URL \`https://mcp.cloudflare.com/\`.
3. Click "Connect" — OAuth opens in your browser.
4. Approve the Cloudflare scopes you want exposed.

### 3. Meta Ads MCP (official)

What it does: campaigns, audiences, insights, creative testing on Facebook + Instagram Ads.

1. Add a remote MCP server in Claude Desktop pointing at \`https://mcp.facebook.com/ads\`.
2. Click "Connect" — Meta Business OAuth opens.
3. Pick the ad account you want to expose.
4. Approve. Done in under 60 seconds.

### 4. Groq MCP

What it does: ultra-low-latency LLM inference (Llama, Mixtral, DeepSeek).

1. Get a free API key at console.groq.com.
2. Add to Claude Desktop config: \`npx -y @groq/mcp-server\`.
3. Set \`GROQ_API_KEY\` in the env block of the config.
4. Restart Claude Desktop.

### 5. DeepSeek MCP

What it does: DeepSeek V3 and Coder via API — frontier reasoning at low cost.

1. Get a key at api-docs.deepseek.com.
2. Add to config: \`npx -y @deepseek/mcp-server\`.
3. Set \`DEEPSEEK_API_KEY\` in env.
4. Restart your MCP client.

### 6. DuckDB MCP

What it does: SQL over Parquet, CSV, JSON, and S3 — no warehouse needed. Local-only, no auth.

1. Install \`uv\` if you don't have it.
2. Add to config: \`uvx mcp-server-motherduck\`.
3. Point a query at any folder of CSVs or Parquet files.
4. No API key required.

### 7. Langfuse MCP

What it does: LLM traces, evals, prompt management, cost tracking.

1. Sign up at langfuse.com → get your public + secret API keys.
2. Add to config: \`npx -y @langfuse/mcp-server\`.
3. Set \`LANGFUSE_PUBLIC_KEY\` and \`LANGFUSE_SECRET_KEY\` in env.
4. Restart Claude Desktop.

### 8. ClickHouse MCP

What it does: query columnar OLAP via SQL.

1. Get ClickHouse Cloud credentials (or use a self-hosted instance).
2. Add to config: \`uvx mcp-clickhouse\`.
3. Set \`CLICKHOUSE_HOST\`, \`CLICKHOUSE_USER\`, \`CLICKHOUSE_PASSWORD\` in env.
4. Restart your MCP client.

## How to suggest a new repo or MCP

1. Open the submit form at [/submit-repo](/submit-repo).
2. Paste the GitHub URL and the category that fits.
3. Add one sentence on why you use it.
4. Hit submit. We review weekly.

To qualify:
- Open source (MIT, Apache, BSD, or AGPL)
- Commits in the last 60 days
- Real users (not a toy project)
- Fits a category we already have

We do not list paid-only tools, abandoned forks, or proof-of-concept demos.

## How StackPicks keeps GitHub data fresh

You don't need to do anything — this runs on autopilot.

1. A cron job hits \`/api/cron/scrape-github\` every 24 hours at 2 AM IST.
2. It pulls live stars, forks, language, license, and last-push for every published repo.
3. Fresh values are written to Supabase.
4. Repo pages auto-revalidate via Next.js ISR on the next visit.

## What's coming next

- **Weekly refresh** — new repos every Sunday; new MCPs same-day on major launches
- **Instagram posts** — 5 per week on [@stackpicks.dev](https://instagram.com/stackpicks.dev), starting Mon Jun 8
- **Premium changelog** — weekly deep-dives for ₹99 lifetime members

## Related reading

- [MCP 2.0 spec drop — what changed](/blog/mcp-2-explained-2026)
- [Meta Ads AI Connector recap](/blog/connect-meta-ads-to-claude-mcp-2026)
- [ChatGPT Ads explained](/blog/chatgpt-ads-explained-2026)

---

*Posted June 5, 2026 by Piyush Jangir. Refresh cadence: daily GitHub stats, weekly new entries, real-time on major launches.*
`,
  },
  {
    slug: 'chatgpt-ads-explained-2026',
    title: 'ChatGPT Ads Explained — How OpenAI\'s New Ad Platform Works (2026 Guide)',
    excerpt: 'OpenAI launched ads in ChatGPT on Feb 9, 2026 — now fully self-serve as of May. Where ads appear, who sees them, how targeting works, and how to buy your first ChatGPT ad.',
    query: 'chatgpt ads explained how it works advertiser',
    monthly_searches: 14000,
    reading_time: 9,
    published_at: TODAY_JUN3,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'ChatGPT Ads is OpenAI\'s ad platform launched February 9, 2026 for U.S. users on the Free and ChatGPT Go tiers. Paid tiers (Plus, Pro, Business, Enterprise, Education) do not see ads. Ads appear in clearly labeled, subtly tinted boxes at the bottom of AI responses — never inside the answer itself — and use contextual matching (current conversation, past chats, past ad interactions) instead of traditional keyword targeting. As of May 2026 the platform is fully self-serve via the OpenAI Ads Manager with CPC + CPM bidding and no minimum spend.',
    faqs: [
      { question: 'When did ChatGPT ads launch?', answer: 'OpenAI rolled out ChatGPT advertising to U.S. users on February 9, 2026. The launch initially required a $200,000 minimum commitment through a limited pilot. By May 2026 OpenAI made the platform fully self-serve via the OpenAI Ads Manager with no minimum spend — accessible to any advertiser.' },
      { question: 'Who sees ads in ChatGPT?', answer: 'Only users on the Free and ChatGPT Go tiers see ads, and currently only in the U.S. Subscribers on Plus, Pro, Business, Enterprise, and Education tiers do not see ads. This is OpenAI\'s monetization model for the no-revenue free tier — paying users get an ad-free experience.' },
      { question: 'Where do ads appear in ChatGPT?', answer: 'Ads appear in clearly labeled, subtly tinted boxes at the bottom of AI responses, never embedded inside the answer itself. The model\'s answer is generated independently of any ad; the ad is shown after the answer and labeled as "Sponsored." This separation is by design — OpenAI has stated ads will not influence the model\'s output.' },
      { question: 'How does ChatGPT ad targeting work?', answer: 'Targeting is contextual rather than keyword-based. The platform uses the current conversation topic, the user\'s prior chat history, and prior ad interactions to match relevant advertisers. There is no auction on individual queries the way Google Ads works. Bid types available: CPC (cost per click) and CPM (cost per thousand impressions).' },
      { question: 'How do I buy ChatGPT ads?', answer: 'Go to the OpenAI Ads Manager (announced May 2026, accessible from your OpenAI account dashboard). Set up an advertiser account, create a campaign with budget and creative (text + image), choose CPC or CPM bidding, and submit. There is no minimum spend. Partner integrations exist with Adobe, Criteo, Kargo, Pacvue, and StackAdapt for advanced workflows.' },
      { question: 'Will ChatGPT ads replace Google search ads?', answer: 'They compete for the same advertiser budget but are not direct replacements. ChatGPT Ads work on a smaller (but growing) audience that\'s asking conversational questions — high intent, but lower volume than Google Search. Most advertisers in 2026 are running both: Google for established search demand, ChatGPT for emerging conversational queries. The strategic question is no longer "either/or" but "what percentage of search-equivalent spend goes to which engine."' },
    ],
    content: `On **February 9, 2026**, OpenAI quietly flipped the switch on ads in ChatGPT — first for U.S. Free and Go-tier users, in a tightly limited pilot requiring a $200,000 commitment. Three months later, in May 2026, the same platform went fully self-serve with no minimum spend. ChatGPT Ads is now a real, accessible ad channel that any business can buy into.

Here's what changed, where ads appear, how they're targeted, and how to actually run one.

## What launched and when

| Date | Event |
|---|---|
| Feb 9, 2026 | ChatGPT Ads launches in pilot — U.S. Free + Go tiers only, $200k minimum commitment, agency-mediated |
| May 2026 | Self-serve **OpenAI Ads Manager** opens — no minimum spend, CPC + CPM bidding, available to any advertiser |
| Ongoing | Major holding companies (Dentsu, Omnicom, Publicis, WPP) integrated as official partners; mid-funnel partners include Adobe, Criteo, Kargo, Pacvue, StackAdapt |

## Where ads actually appear

Inside ChatGPT, ads show up in **clearly labeled, subtly tinted boxes at the bottom of an AI response** — never embedded inside the answer itself. The visual treatment is closer to Google's "Sponsored" cards under a search result than to the inline brand mentions some critics feared.

OpenAI has been explicit: the model's answer is generated independently of any ad. The ad is appended after. This is the same firewall Google maintains between organic and paid results.

Three things to keep in mind:

1. **Only Free + Go tiers see ads.** Plus, Pro, Business, Enterprise, and Education subscribers get an ad-free experience. ChatGPT's premium tiers are unchanged.
2. **U.S. only at launch.** International rollout is staged through 2026.
3. **Web + mobile + desktop apps** all show ads where applicable — the surface is unified.

## How targeting works

This is where ChatGPT Ads diverges sharply from Google Ads.

| Google Search Ads | ChatGPT Ads |
|---|---|
| Bid on **keywords** | Bid on **contextual themes** |
| Auction per query | Match based on conversation topic + history |
| User intent inferred from query | User intent inferred from full conversation arc |
| Match types: exact, phrase, broad | One match type: contextual fit |
| Quality Score | "Relevance Score" (early signal — not yet public weighting) |

The platform uses three signals to decide which ad to show:

1. **Current conversation topic** — what is the user actively talking about?
2. **Past chat history** — what topics has this user engaged with recently?
3. **Past ad interactions** — what kinds of ads has this user clicked or dwelled on?

There is **no auction at the keyword level.** You target a topic cluster, set a bid, and the platform decides when to surface you. This is closer to Meta/TikTok's interest-based ad model than to Google Search.

## How to buy your first ChatGPT ad (May 2026 process)

1. Go to **OpenAI Ads Manager** — link surfaces in your OpenAI account dashboard. Existing OpenAI API/Pro account holders have access automatically.
2. Create an **Advertiser account** — business name, website, billing.
3. Set up a **campaign** — choose objective (Awareness, Traffic, Conversions).
4. Define a **contextual audience** — pick from topic categories (no keyword input). E.g., "Productivity tools," "Indie developer products," "Personal finance."
5. Set **bid type** (CPC or CPM) and daily budget. No minimum.
6. Upload **creative** — text headline (60 char) + body (140 char) + image (1200×628). One destination URL.
7. **Submit for review** — typical approval 24-48 hours.
8. **Monitor in Ads Manager** — impressions, clicks, CTR, CPC by topic, audience overlap reports.

## What this means strategically

The instinct is to ask "will ChatGPT Ads cannibalize Google Search Ads?" The honest answer is: not yet, and not entirely.

- **Google still owns the volume.** ChatGPT had ~700M weekly users by Q1 2026; Google handles ~9B+ daily searches. Different orders of magnitude.
- **ChatGPT owns deeper intent.** A user asking "what's the best dev-tool directory for solo founders" in ChatGPT is further along the funnel than someone searching "dev tools." Higher intent → higher conversion.
- **Most 2026 advertisers run both.** The strategic question is no longer "either/or" — it's "what percentage of search-equivalent budget goes to which engine?"

For B2B / dev tools / SaaS in particular, ChatGPT Ads is a real channel worth a 10-20% allocation experiment in 2026.

## Where AI agents fit in (yes, this is relevant)

ChatGPT Ads is also a reminder of the new shape of advertising: **users are talking to an agent, not typing keywords.** The most measurable wins in 2026 won't come from optimizing keyword bids — they'll come from agents that *manage* ad spend across platforms.

Meta moved first on the official-MCP front: on **April 29, 2026** Meta launched its own [Meta Ads AI Connector](https://www.facebook.com/business/news/meta-ads-ai-connectors) at \`mcp.facebook.com/ads\` — 29 tools, sign-in-with-Meta, free, and supported in Claude, ChatGPT, and Perplexity at launch. That tells you something about the trajectory: ChatGPT Ads will almost certainly have its own MCP within the year.

For now, if you want to actually run your Google Ads + Meta Ads + (eventually) ChatGPT Ads through one AI agent, [StackPicks Connect](/connect) is the unified gateway built for that. Our value isn't being the only way to reach Meta — it's being the **one URL that reaches every ad platform plus everything else** (GitHub, Slack, Notion, Linear and 18 more) in a single connection. Today the gateway is live with:

- **Google Ads** — list accounts, list campaigns, GAQL search, resource metadata, campaign performance (BYO-token mode)
- **Meta Ads** — list accounts, list campaigns, account + campaign insights, list ads (BYO-token mode — or use Meta's official MCP directly for deeper write access)

A typical workflow once both are connected: ask Claude *"compare last 7 days CPC across Google + Meta for my SaaS campaigns, flag anything where ROAS dropped under 2x."* The agent calls both platforms in the same response and answers in seconds.

## Bottom line

ChatGPT Ads is real, self-serve, and growing fast. The targeting model is contextual (not keyword), the surface is bottom-of-response (not embedded), and the audience is currently U.S. Free + Go tier users. The strategic question for every marketer in 2026 is allocation, not whether to test it. Run a small experiment ($500-2k) in Q2 2026, measure CPA against your existing channels, and scale based on real numbers.

## Related reading

- [Connect Google Ads to Claude via MCP](/blog/connect-google-ads-to-claude-mcp-2026) — full setup guide
- [Connect Meta Ads to Claude via MCP](/blog/connect-meta-ads-to-claude-mcp-2026) — Facebook + Instagram setup
- [Claude Opus 4.8 Explained](/blog/claude-opus-4-8-explained-2026) — the model behind agent ad-ops`,
  },
  {
    slug: 'connect-google-ads-to-claude-mcp-2026',
    title: 'Connect Google Ads to Claude via MCP — Step-by-Step Setup Guide (2026)',
    excerpt: 'Run your real Google Ads campaigns through Claude in 20 minutes using StackPicks Connect\'s Bring-Your-Own-Token MCP gateway — no Google verification wait, no Standard Access required.',
    query: 'connect google ads to claude mcp setup',
    monthly_searches: 4500,
    reading_time: 7,
    published_at: TODAY_JUN3,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'You connect Google Ads to Claude through StackPicks Connect using a Bring-Your-Own-Token (BYO) flow. You supply your own Google Ads developer token + OAuth refresh token (both obtained in ~20 minutes from your own Google Ads account and the Google OAuth Playground); StackPicks stores them encrypted, mints fresh access tokens at request time, and exposes Google Ads tools (list accounts, list campaigns, campaign performance) to Claude through one MCP install. No Google OAuth verification wait, no Standard Access required for the app — the user\'s own developer token does the work.',
    faqs: [
      { question: 'Can I connect Google Ads to Claude?', answer: 'Yes. Use StackPicks Connect\'s Google Ads provider in Bring-Your-Own-Token mode. You supply your own developer token (from Google Ads API Center) + OAuth credentials + refresh token; StackPicks stores them encrypted and proxies read-only Google Ads API calls when Claude invokes a tool. The whole setup takes ~20 minutes.' },
      { question: 'Why does Google Ads need a developer token?', answer: 'Google Ads API access has two layers: (1) OAuth — proves the user authorized the app; (2) developer token — proves the developer applied for API access. Both are required. In BYO mode the user supplies both their own developer token (from their own Google Ads MCC account) and their own OAuth credentials, which bypasses StackPicks needing Standard Access from Google for our app.' },
      { question: 'Do I need a Google Ads Manager (MCC) account?', answer: 'Yes. Developer tokens are only issued from a Google Ads Manager (MCC) account, not from direct accounts. Creating an MCC is free at ads.google.com/intl/en/home/tools/manager-accounts/. After creating it, link your existing direct ad account to the MCC, then apply for the developer token from the MCC\'s API Center.' },
      { question: 'How long does Google Ads API approval take?', answer: 'Test Account Access (token for test ad accounts only) is issued instantly — you can test the integration in minutes. Basic Access (real production accounts) is typically approved within 3 business days. The application form asks for a design document, contact info, and a description of your tool\'s use case.' },
      { question: 'Is Bring-Your-Own-Token mode secure?', answer: 'Yes. Tokens are encrypted at rest using AES-256-GCM in StackPicks\' Postgres database, with Row-Level Security so only the row owner can read their own credentials. Access tokens are minted just-in-time from the refresh token and not persisted. Every API call is audit-logged. You can revoke at any time on /dashboard/connections, which deletes the stored token immediately.' },
      { question: 'What can Claude do with my Google Ads account?', answer: 'Currently read-only: list accessible customer IDs, list campaigns with status and budget, and pull campaign performance (spend, impressions, clicks, conversions, CTR, CPC) for a date range. No campaign creation, no bid edits, no destructive actions in the current release. Future write capabilities will require a separate user-level opt-in.' },
    ],
    content: `Connect Google Ads to Claude in ~20 minutes. Unlike Meta Ads (which has a 60-second official connector), Google has no official MCP yet — so you bring your own developer token + OAuth credentials. StackPicks Connect stores them encrypted and proxies read-only queries.

## Before you start

You need:
- A Google account with access to a Google Ads account.
- Free Google Cloud project (created in step 4).
- A free [StackPicks account](/connect).

## Step 1 — Create a Manager (MCC) account

Developer tokens only come from Manager accounts.

- Go to https://ads.google.com/intl/en/home/tools/manager-accounts/
- Click **Create a manager account** → use the Google login that owns your Ads.
- Pick a name, choose "Manage other people's accounts", set country/timezone/currency → Submit.

Skip if you already have an MCC.

## Step 2 — Link your ad account to the MCC

- Inside the MCC: **Admin → Sub-account settings → +** → **Link existing account** → enter your Customer ID.
- Switch to your direct Ads account: **Admin → Access and security → Managers** → Accept.

## Step 3 — Apply for a Developer Token

- Inside the MCC: **Tools (wrench) → Setup → API Center**.
- Fill the form: company name, URL, "Independent Google Ads Developer", contact email.
- Submit → **Test Access token** issued instantly.
- For real campaigns, click **Apply for Basic Access** → answer the form, upload a 1-page design doc → ~3 business days.
- Copy the token (22 chars).

## Step 4 — OAuth credentials in Google Cloud

- https://console.cloud.google.com → create or pick a project.
- **APIs & Services → Library** → search "Google Ads API" → **Enable**.
- **Credentials → Create Credentials → OAuth client ID** → type **Web application**.
- **Authorized redirect URIs:** \`https://developers.google.com/oauthplayground\`
- **Create** → copy **Client ID** + **Client Secret**.

## Step 5 — Get a refresh token

- Open https://developers.google.com/oauthplayground
- Gear icon (top right) → tick **Use your own OAuth credentials** → paste your Client ID + Secret → Close.
- In the left panel input box, paste: \`https://www.googleapis.com/auth/adwords\` → **Authorize APIs** → log in with the Google account that owns your Ads → Allow.
- Click **Exchange authorization code for tokens** → copy the **Refresh token** (starts with \`1//\`).

## Step 6 — Connect on StackPicks

- https://stackpicks.dev/connect → click **Google Ads**.
- Paste this JSON (substituting your 4 values):
  \`\`\`json
  {"developer_token":"…","client_id":"…","client_secret":"…","refresh_token":"…"}
  \`\`\`
- Confirm.

## Step 7 — Use it in Claude

- Claude → **Settings → Connectors → Add custom connector** → paste \`https://stackpicks.dev/api/mcp\` → sign in.
- Ask: *"List my Google Ads accounts"*.
- Then: *"Show last 7 days campaign performance."*

Same MCP URL works in Cursor, Cline, and Windsurf.

## What Claude can do

5 tools, all read-only:
- \`google_ads_search\` — any GAQL query (the flexible primary tool)
- \`google_ads_get_resource_metadata\` — list fields on a resource
- \`google_ads_list_accounts\` — accessible customer IDs
- \`google_ads_list_campaigns\` — campaigns with status + budget
- \`google_ads_campaign_performance\` — spend, clicks, conversions, CTR, CPC for a date range

## Security

Tokens encrypted at rest (AES-256-GCM) with Row-Level Security. Access tokens minted just-in-time, never stored. Revoke any time on [/dashboard/connections](/dashboard/connections).

## Common errors

| Error | Fix |
|---|---|
| "User in the cookie is not a valid ads user" | The Google login in Step 5 doesn't own the Ads account. Re-do Step 5 with the right login. |
| "Developer token is not approved" | You're on Test Access trying to read a real account. Wait for Basic Access or use a test account. |
| "AUTHENTICATION_ERROR" | Refresh token revoked. Re-run Step 5, paste fresh JSON. |
| Bad JSON | Verify all 4 keys: developer_token, client_id, client_secret, refresh_token. |

## Next

Pair with [Meta Ads](/blog/connect-meta-ads-to-claude-mcp-2026) — Meta has a 60-second official connector. Then ask Claude: *"Compare last 7 days CPC and ROAS across Google + Meta, flag underperformers."* Cross-platform ad ops in one prompt.

## Related reading

- [Connect Meta Ads to Claude via MCP](/blog/connect-meta-ads-to-claude-mcp-2026)
- [ChatGPT Ads Explained](/blog/chatgpt-ads-explained-2026)
- [One MCP for All Your Apps](/blog/one-mcp-for-all-apps-composio-alternative-2026) — why unified gateways win`,
  },
  {
    slug: 'connect-meta-ads-to-claude-mcp-2026',
    title: 'Connect Meta Ads to Claude with MCP — Official Connector + Unified Gateway (2026)',
    excerpt: 'Meta launched its official Ads AI Connector (mcp.facebook.com/ads) on April 29, 2026 — sign in once, no developer setup. Here\'s how it works, and when StackPicks Connect\'s unified gateway is the better path.',
    query: 'connect meta ads facebook ads claude mcp setup',
    monthly_searches: 3800,
    reading_time: 6,
    published_at: TODAY_JUN3,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'On April 29, 2026 Meta launched its official Meta Ads AI Connector — an MCP server at mcp.facebook.com/ads that any advertiser can paste into Claude, ChatGPT, or Perplexity as a custom connector, then sign in with their Meta account. No developer credentials, no System User tokens, no API setup. The connector exposes 29 tools across reporting, campaign management, catalog management, and signal diagnostics. If you only need Meta Ads, use this directly — it is the fastest path. If you want Meta Ads alongside Google Ads, GitHub, Slack, Notion and 20+ other apps through ONE MCP URL, StackPicks Connect is the unified gateway built for that.',
    faqs: [
      { question: 'How do I connect Meta Ads to Claude in 2026?', answer: 'Use the official Meta Ads AI Connector launched April 29, 2026. In Claude → Settings → Connectors → Add custom connector → paste https://mcp.facebook.com/ads → sign in with your Meta account. That is the full setup. No developer credentials, no token generation, no Business Verification. It exposes 29 tools across reporting, campaign management, catalog management, and signal diagnostics. Supported in Claude, ChatGPT, and Perplexity.' },
      { question: 'Is Meta Ads AI Connector free?', answer: 'Yes, the connector itself is free — you only pay for ads you run on Meta as you normally would. The connector is in open beta as of April 29, 2026, and Meta has stated more AI platforms will be added over time. Currently it works with any MCP-compatible AI client.' },
      { question: 'When should I use StackPicks Connect instead of Meta\'s official MCP?', answer: 'Use StackPicks Connect when you want Meta Ads alongside other apps through one URL. Meta\'s official MCP only connects Meta Ads. StackPicks Connect unifies 22+ providers (Meta Ads, Google Ads, GitHub, Slack, Notion, Linear, Calendly, Figma, Vercel, etc.) behind one connection — so a single Claude prompt can compare Meta + Google ad spend, then create a Linear issue about the worst-performing campaign, then post the summary to Slack.' },
      { question: 'Can I use both Meta\'s MCP and StackPicks at the same time?', answer: 'Yes — Claude supports multiple MCP connectors simultaneously. Add mcp.facebook.com/ads for deep Meta Ads access (all 29 tools, native Meta integration) and stackpicks.dev/api/mcp for the rest of your stack. There is no conflict; the agent picks the right tool per request.' },
      { question: 'What is the difference between Meta\'s 29 tools and StackPicks\' Meta Ads tools?', answer: 'Meta\'s official connector exposes 29 tools across four categories: reporting (account/campaign/ad-level insights, custom date ranges, breakdowns), campaign management (create/pause/edit campaigns, change budgets, target audiences), catalog management (product feeds for Advantage+ catalog ads), and signal diagnostics (Pixel/Conversions API troubleshooting). StackPicks\' Meta Ads is read-only (5 tools: list accounts, list campaigns, account + campaign insights, list ads) because the unified gateway optimises for safety across many providers. For deep Meta Ads work, Meta\'s official connector is the better tool.' },
      { question: 'Do I need a Meta Business Manager?', answer: 'For Meta\'s official AI Connector: you need a Meta account with access to an ad account, which usually means a Business Manager but can also be a personal account that runs ads. For StackPicks Connect (BYO-token path): yes — System Users only exist inside a Business Manager.' },
    ],
    content: `On **April 29, 2026**, Meta launched the **official Meta Ads AI Connector** — its own MCP server that any advertiser can paste into Claude, ChatGPT, or Perplexity. Sign in once with your Meta account; the connector handles everything else. No developer credentials, no token generation, no Business Verification waiting room.

If your only ad platform is Meta, **use the official connector**. It's the fastest, deepest path, and it's free.

This post covers (1) how to set up Meta's official connector, (2) what it does, and (3) when StackPicks Connect's unified gateway makes sense instead.

## Option A — Meta's official Ads AI Connector (recommended for Meta-only)

**Setup (60 seconds):**

1. In Claude → **Settings → Connectors → Add custom connector**.
2. Paste:
   \`\`\`
   https://mcp.facebook.com/ads
   \`\`\`
3. Sign in with the Meta account that has access to your ad account.
4. Done.

Now ask Claude: *"List my Meta ad accounts and show last 7 days spend by campaign."*

**What you get — 29 tools across 4 categories:**

| Category | Capabilities |
|---|---|
| **Reporting** | Account / campaign / ad-set / ad-level insights, custom date ranges, breakdowns by device/placement/region, comparison reports |
| **Campaign management** | Create / pause / edit campaigns, change budgets, modify targeting, schedule changes |
| **Catalog management** | Product feeds for Advantage+ catalog ads, catalog diagnostics, feed health |
| **Signal diagnostics** | Meta Pixel + Conversions API troubleshooting, event match quality, attribution debugging |

That's a full Meta Ads workflow available conversationally inside Claude. As of June 2026 it supports Claude, ChatGPT, and Perplexity, with more clients to be added.

Official launch post: [Meta for Business — Introducing Meta Ads AI Connectors](https://www.facebook.com/business/news/meta-ads-ai-connectors).

## Option B — StackPicks Connect (recommended if Meta isn't your only platform)

Meta's official connector is great, but it only covers Meta. If you actually want a single AI prompt to do something like this:

> *"Compare last 7 days spend across Google Ads and Meta Ads, flag any campaign where CPC jumped over 25%, then post a summary to my #marketing Slack and create a Linear issue for the worst performer."*

…you need a **unified gateway** — one connection URL that exposes tools from many platforms at once. That's [StackPicks Connect](/connect).

StackPicks Connect today wires **22 providers** behind a single MCP URL: Meta Ads + Google Ads + GitHub, Slack, Notion, Linear, Calendly, Figma, Vercel, Supabase, Cloudflare, Sentry, plus search providers (Tavily, Exa, Perplexity, Brave) and more. Add Meta's official MCP **alongside** StackPicks in Claude — they don't conflict. Claude picks the right tool per request:

- Deep Meta Ads work (create campaign, edit budgets, debug Pixel) → routes to Meta's 29 tools
- Cross-platform questions ("show me Meta + Google last week") → routes through StackPicks' read-only ad tools
- Anything non-ads (GitHub PR, Slack post, Linear issue) → StackPicks

**Setup StackPicks Connect for Meta Ads in 60 seconds** (uses the same simple flow):

1. Sign up at [stackpicks.dev](/connect).
2. Click the **Meta Ads** card → follow the connect flow.
3. In Claude, add \`https://stackpicks.dev/api/mcp\` as a custom connector → sign in with StackPicks → approve.

Once connected, every other StackPicks-connected app is available too. One URL, full stack.

## Which one to pick — the honest decision tree

| Your situation | Use |
|---|---|
| **You only run Meta Ads.** No Google Ads, no other tools you want Claude to touch. | **Meta's official connector.** Done in 60 seconds, 29 tools deep, no waiting. |
| **You run Meta Ads + Google Ads but everything else stays in dashboards.** | **Both, side by side.** Add mcp.facebook.com/ads for Meta depth, add stackpicks.dev/api/mcp for Google Ads (BYO-token mode, also live). |
| **You want Claude to do cross-platform workflows.** Ad ops + GitHub + Slack + Linear + Notion in one prompt. | **StackPicks Connect** as your primary, optionally with Meta's official for deeper Meta-specific work. |

There's no wrong answer. We built StackPicks Connect because we kept hitting the "one URL for all my tools" problem ourselves — but if Meta's free official connector solves your case end-to-end, use it.

## Security model — both paths

**Meta's official connector:**
- Authentication via Meta sign-in (the same flow you use on facebook.com / business.facebook.com).
- Tokens are managed by Meta — never leave Meta's infrastructure.
- Revoke any time at Business Settings → Apps → Meta Ads AI Connector → Remove.

**StackPicks Connect (BYO-token path for Meta Ads):**
- You supply a Meta System User Access Token from your own Business Manager.
- Token stored encrypted (AES-256-GCM) in StackPicks' Postgres with Row-Level Security.
- Audit log: every call recorded with user_id, tool, timestamp.
- Revoke from Meta Business Manager (instant) OR /dashboard/connections (instant).

## Common pitfalls

- **"Where do I find mcp.facebook.com/ads in Claude?"** — Settings → **Connectors** → "Add custom connector" → paste the URL. Same place you'd add any other MCP server.
- **Sign-in opens but never returns** — pop-up blocked. Allow pop-ups for claude.ai (or chatgpt.com / perplexity.ai) and retry.
- **"This connector isn't supported by your client"** — your client doesn't support remote MCP servers yet. Update Claude/ChatGPT/Perplexity to the latest version.

## Related reading

- [Connect Google Ads to Claude via MCP](/blog/connect-google-ads-to-claude-mcp-2026) — the BYO-token setup (Google has no official MCP yet)
- [ChatGPT Ads Explained](/blog/chatgpt-ads-explained-2026) — the new third ad channel
- [One MCP for All Your Apps](/blog/one-mcp-for-all-apps-composio-alternative-2026) — the unified-gateway model`,
  },
  {
    slug: 'claude-opus-4-8-explained-2026',
    title: 'Claude Opus 4.8 Explained — What\'s New, Pricing, and Should You Upgrade (2026)',
    excerpt: 'Anthropic shipped Claude Opus 4.8 on May 28, 2026 — stronger benchmarks, effort control, dynamic Claude Code workflows, and a cheaper fast mode. What actually changed, what it costs, and whether to switch.',
    query: 'claude opus 4.8 explained whats new pricing',
    monthly_searches: 18000,
    reading_time: 8,
    published_at: TODAY_30,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'Claude Opus 4.8 is Anthropic\'s frontier model, released May 28, 2026. It improves on Opus 4.7 with stronger benchmark scores, better multi-step collaboration, and improved honesty (fewer confident-but-wrong answers). The launch adds three practical features: effort control in claude.ai (trade speed for depth per task), dynamic workflows in Claude Code, and a more affordable fast mode. API access is available immediately. For most builders the upgrade is a drop-in win — same API shape, better output — but the fast mode is the bigger deal for cost-sensitive, high-volume agent work.',
    faqs: [
      { question: 'What is Claude Opus 4.8?', answer: 'Claude Opus 4.8 is Anthropic\'s frontier large language model, announced May 28, 2026. It is the most capable model in the Claude family, improving on Opus 4.7 with stronger benchmark performance, better collaboration on multi-step tasks, and improved honesty. It powers claude.ai, the Claude API, and Claude Code.' },
      { question: 'What is new in Claude Opus 4.8 vs Opus 4.7?', answer: 'Three practical additions beyond raw quality: (1) effort control in claude.ai — you can dial how much reasoning the model spends per task, trading speed for depth; (2) dynamic workflows in Claude Code, letting the CLI agent adapt its plan mid-task; (3) a more affordable fast mode for high-volume, latency-sensitive work. The model also scores higher on honesty, meaning fewer confident-but-wrong answers.' },
      { question: 'How much does Claude Opus 4.8 cost?', answer: 'Opus 4.8 is available on the Claude API at launch and is included in Claude Pro and Max consumer plans (Pro is roughly the equivalent of $20/month, or about ₹1,700/month with Indian pricing and taxes). The new fast mode is priced lower per token than standard Opus, aimed at high-volume agent workloads. Check Anthropic\'s pricing page for exact per-million-token rates, which vary by input/output and mode.' },
      { question: 'Should I upgrade to Claude Opus 4.8?', answer: 'For most builders, yes — it is a drop-in upgrade with the same API shape and better output, so there is little downside. If you run high-volume agent loops where cost matters more than peak reasoning, the new fast mode is the bigger win than the frontier quality bump. If you pin a specific model version in production, test 4.8 against your eval set before switching, as output style shifts slightly between versions.' },
      { question: 'Does Claude Opus 4.8 work with MCP and Claude Code?', answer: 'Yes. Opus 4.8 fully supports the Model Context Protocol (MCP), so any MCP server or gateway you already use keeps working. Claude Code gains dynamic workflows in this release, letting the agent adjust its plan as a task unfolds. If you connect apps through a managed gateway like StackPicks Connect, nothing changes — the model upgrade is transparent to your tool connections.' },
      { question: 'What is "effort control" in Claude Opus 4.8?', answer: 'Effort control is a new claude.ai setting that lets you choose how much reasoning the model spends on a given task. Higher effort means deeper, more thorough answers at the cost of speed; lower effort means faster responses for simple work. It puts the speed-versus-depth tradeoff in your hands instead of being fixed per model.' },
    ],
    content: `On May 28, 2026, Anthropic released **Claude Opus 4.8** — the new frontier model in the Claude family. If you build with Claude, use Claude Code daily, or run agents on the API, here's what actually changed and whether it's worth switching.

## The short version

Opus 4.8 is a **drop-in upgrade** over Opus 4.7: same API shape, better output. The headline gains are stronger benchmarks, better multi-step collaboration, and improved honesty — fewer answers that are confidently wrong. But the features that matter day-to-day are the three practical additions shipped alongside it.

## What's new

### 1. Effort control in claude.ai

You can now dial **how much reasoning** the model spends per task. High effort = deeper, more thorough answers, slower. Low effort = fast responses for simple work. The speed-vs-depth tradeoff is now in your hands instead of fixed per model. For research and hard debugging, crank it up; for quick reformatting, drop it down and save time.

### 2. Dynamic workflows in Claude Code

Claude Code's CLI agent can now **adapt its plan mid-task** instead of committing to one upfront. In practice this means fewer dead-end runs on long multi-file changes — the agent re-plans when it hits something unexpected. Combined with the existing \`/goal\` command for cross-turn completion conditions, this makes long agentic sessions more reliable.

### 3. A cheaper fast mode

This is the underrated one. The new **fast mode** is priced lower per token than standard Opus, aimed at high-volume, latency-sensitive workloads. If you run agent loops that fire hundreds of model calls, fast mode can cut your bill meaningfully while keeping most of the quality.

## Quality + honesty

Anthropic emphasized **honesty** improvements: Opus 4.8 is less likely to produce confident-but-wrong output. For anyone using Claude in production — where a plausible hallucination is worse than an "I'm not sure" — this is a real reliability gain, not just a benchmark number.

## Pricing

| Plan | What you get |
|---|---|
| **Claude API** | Opus 4.8 available immediately; standard + fast-mode pricing |
| **Claude Pro** | Included (~$20/mo, ~₹1,700/mo with Indian pricing + tax) |
| **Claude Max** | Included, higher limits |

The fast mode's lower per-token rate is the cost story worth modeling if you run volume.

## Should you upgrade?

- **Most builders:** Yes. Drop-in, same API, better output, little downside.
- **High-volume agent loops:** The fast mode matters more than the frontier bump — model the cost savings.
- **Pinned production version:** Test 4.8 against your eval set first. Output style shifts slightly between versions, so don't blind-swap a prompt-tuned pipeline.

## Does it affect your MCP / tool setup?

No. Opus 4.8 fully supports the [Model Context Protocol](/blog/mcp-explained), so every MCP server or gateway you use keeps working unchanged. If you connect your apps through a managed gateway like [StackPicks Connect](/connect), the model upgrade is completely transparent — your one connection URL and all your connected apps behave exactly as before, now driven by a smarter model.

That's the quiet advantage of the gateway pattern: when the frontier model changes (and in 2026 it changes every few weeks), your tooling doesn't have to.

## Where Opus 4.8 + a unified gateway actually shines (June 3 update)

The most underrated combo for Opus 4.8 right now is **ad ops + a connected gateway**. With StackPicks Connect's Google Ads + Meta Ads providers wired in Bring-Your-Own-Token mode, you can hand Opus 4.8 your real campaign data and use its effort-control + reasoning improvements to do work that used to take a spreadsheet:

> *"Pull yesterday's Meta + Google Ads spend by campaign, flag any campaign where CPC jumped over 25%, and suggest which ones to pause."*

Opus 4.8's honesty improvements matter here: when there isn't enough signal to recommend a pause, it says so instead of guessing — exactly what you want from an agent that has access to a budget.

## Bottom line

Claude Opus 4.8 is an incremental-but-real upgrade: better quality, better honesty, and three features — effort control, dynamic Claude Code workflows, and a cheaper fast mode — that change how you actually work. Upgrade unless you have a pinned, eval-gated production pipeline, in which case test first.

## Related reading

- [MCP 2.0 Explained](/blog/mcp-2-0-explained-2026) — the protocol upgrade landing the same month
- [MCP Servers Explained](/blog/mcp-explained) — the full 2026 guide + 89-server directory
- [Connect 50+ apps to Claude with one MCP](/connect) — give Opus 4.8 real-world hands`,
  },
  {
    slug: 'mcp-2-0-explained-2026',
    title: 'MCP 2.0 Explained — Stateless Core, OAuth Login & MCP Apps (2026-07-28 Spec)',
    excerpt: 'Anthropic shipped the biggest Model Context Protocol revision since launch. What the 2026-07-28 release candidate changes — stateless core, OAuth 2.1 login, MCP Apps, Tasks, Server Cards — and what it means for connecting apps to Claude.',
    query: 'mcp 2.0 explained stateless oauth spec',
    monthly_searches: 6000,
    reading_time: 9,
    published_at: TODAY_29,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'MCP 2.0 is the 2026-07-28 Model Context Protocol release candidate (published May 21, 2026) — the largest revision since the protocol launched in November 2024. The headline changes: a stateless protocol core (servers run behind a plain load balancer, no sticky sessions), hardened OAuth 2.1 authorization so connecting a server can be a single Google or GitHub login with no JSON config, plus three new building blocks — MCP Apps (server-rendered UIs), Tasks (long-running work), and Server Cards (capability discovery via a .well-known URL). The final spec lands July 28, 2026.',
    faqs: [
      { question: 'What is MCP 2.0?', answer: 'MCP 2.0 is shorthand for the 2026-07-28 Model Context Protocol release candidate, published May 21, 2026 by Anthropic and the MCP working group. It is the largest revision since MCP launched in November 2024. Its core changes are a stateless protocol core, hardened OAuth 2.1 authorization, and three new extensions: MCP Apps, Tasks, and Server Cards. The final specification is scheduled for July 28, 2026.' },
      { question: 'What does "stateless MCP" mean?', answer: 'In the original MCP, a remote server held a session per client — requiring sticky sessions, a shared session store, and gateway-level packet inspection to route requests. MCP 2.0 makes the protocol core stateless: each request carries everything the server needs, so a remote MCP server can sit behind a plain round-robin load balancer and scale horizontally like any normal web API. This is the single biggest operability win in the spec.' },
      { question: 'How does OAuth work in MCP 2.0?', answer: 'MCP 2.0 hardens authorization to mirror how OAuth 2.0 and OpenID Connect are actually deployed: proper refresh-token handling, scope accumulation, and client registration (Dynamic Client Registration / Client ID Metadata Documents). The practical effect is that connecting an MCP server can be a single Google or GitHub login in your AI client — no JSON config files, no API keys to copy or rotate. MCP requires OAuth 2.1 with PKCE, not plain OAuth 2.0.' },
      { question: 'What are MCP Apps, Tasks, and Server Cards?', answer: 'They are the three new building blocks in MCP 2.0. MCP Apps lets a server return server-rendered UI (not just text/JSON) so a tool can show a real interface inside the client. Tasks adds first-class support for long-running work — kick off a job, poll or get notified on completion, instead of blocking a single request. Server Cards expose structured server metadata at a .well-known URL so registries, browsers, and crawlers can discover a server\'s capabilities without connecting to it.' },
      { question: 'How many MCP servers exist in 2026?', answer: 'As of May 24, 2026, the official MCP Registry counted 9,652 latest server records and 28,959 total server/version records. Adoption has been steep since the November 2024 launch — Claude, Cursor, Cline, Windsurf, GitHub Copilot, plus first-party servers from Atlassian, Stripe, Supabase, Sentry, and others. MCP is now the de facto standard for connecting AI agents to external tools.' },
      { question: 'Do I need to rebuild my MCP setup for 2.0?', answer: 'Not immediately. The release candidate ships with a ten-week validation window before the final spec on July 28, 2026, and a formal deprecation policy so existing servers keep working. If you connect apps through a managed OAuth gateway like StackPicks Connect, you do not have to track the spec at all — the gateway handles transport, auth, and version changes for you, and your one connection URL stays the same.' },
    ],
    content: `On May 21, 2026, Anthropic and the MCP working group published the **2026-07-28 release candidate** — the biggest revision of the Model Context Protocol since it launched in November 2024. Most coverage called it "MCP 2.0," and the name fits: this is not a point release.

If you connect tools to Claude, Cursor, or any agent, here's what actually changed, why it matters, and what you do (and don't) need to do about it.

## The four headline changes

### 1. A stateless protocol core

The original MCP kept a **session** per client. A remote server needed sticky sessions, a shared session store, and deep packet inspection at the gateway just to route a request to the right place. That made remote MCP servers annoying to scale.

MCP 2.0 makes the core **stateless**. Each request carries what the server needs, so a remote MCP server can now sit behind a plain round-robin load balancer and scale horizontally like any normal web API. This is the single biggest operability win in the spec — it's what turns "host an MCP server" from a special-case deployment into a boring one.

### 2. OAuth 2.1 login, no JSON config

Six proposals in the RC harden authorization to match how OAuth 2.0 and OpenID Connect are *actually* deployed: proper refresh-token handling, scope accumulation, and standard client registration (Dynamic Client Registration and Client ID Metadata Documents).

The practical effect is the part builders will feel: **connecting an MCP server can be a single Google or GitHub login** — no \`claude_desktop_config.json\` to edit, no API key to copy and rotate. MCP mandates OAuth 2.1 with PKCE (not plain OAuth 2.0).

This is exactly the model we bet on with [StackPicks Connect](/connect): you log in once in the browser, and the gateway holds the tokens. MCP 2.0 makes that the default direction for the whole ecosystem.

### 3. MCP Apps, Tasks, and Server Cards

Three new building blocks ship as first-class extensions:

| Extension | What it adds |
|---|---|
| **MCP Apps** | Server-rendered UIs — a tool can return a real interface, not just text/JSON, inside the client |
| **Tasks** | First-class long-running work — start a job, get notified on completion, instead of blocking one request |
| **Server Cards** | Structured server metadata at a \`.well-known\` URL so registries and crawlers discover capabilities without connecting |

Server Cards in particular matter for discovery — they're the MCP-native equivalent of the \`/llms.txt\` idea: a machine-readable description of what a server can do, fetchable before you ever open a connection.

### 4. A formal deprecation policy

For the first time, MCP has a stated deprecation policy and a **ten-week validation window** before the final spec publishes on **July 28, 2026**. Existing servers keep working. This is the boring-but-important part that signals MCP is now infrastructure, not an experiment.

## The ecosystem is moving the same direction

Two launches in the same week prove the OAuth-gateway pattern is winning:

- **Atlassian's MCP server hit GA** — Claude reads and writes Jira, Confluence, and Compass through OAuth, no token juggling.
- **Base shipped an MCP gateway** letting Claude and ChatGPT execute onchain DeFi actions across six protocols (Uniswap, Morpho, Avantis) via OAuth 2.1 — without ever exposing private keys.

And the [official MCP Registry](https://github.com/modelcontextprotocol) crossed **9,652 servers** (28,959 total version records) as of May 24, 2026. The standard isn't coming — it's here.

## What this means for you

**If you build MCP servers:** the stateless core is your upgrade path to painless scaling, and Server Cards are worth adopting early for discovery. You have until July 28 plus the deprecation policy's grace period — no fire drill.

**If you just want Claude to use your apps:** you don't need to track any of this. The whole point of a managed gateway is that it absorbs spec churn. With [StackPicks Connect](/connect) you connect apps once via browser OAuth and paste one URL — \`https://stackpicks.dev/api/mcp\` — into Claude. When the transport, auth, or spec version changes, the gateway handles it. Your connection URL never changes.

## What we shipped since the spec dropped

MCP 2.0's OAuth-first direction is the model StackPicks Connect already runs on. In the two weeks since the release candidate, we've grown the gateway to **22 live providers** across OAuth + API-key paths:

- **Productivity:** GitHub, GitLab, Slack, Notion, Linear, Calendly, Asana, Airtable, Todoist, Dropbox
- **Dev infra:** Vercel, Cloudflare, Sentry, Supabase, Figma
- **AI research stack:** Tavily, Exa, Brave Search, Perplexity, Firecrawl
- **Ads (newest):** Google Ads + Meta Ads — wired through a **Bring-Your-Own-Token (BYO)** mode so they work *today* without waiting on Google verification or Meta App Review. Update June 3, 2026.

The BYO-token pattern is worth a callout because it's exactly the kind of pragmatic UX MCP 2.0 enables: instead of an end-user fighting through OAuth verification for every restrictive API (Google Ads, Meta Ads), the user supplies their own already-approved credentials and the gateway proxies the rest. Same shape, no review wait.

Each provider above is a single browser login (or one paste) on the [Connect dashboard](/connect) — exactly the experience MCP 2.0 is standardizing across the ecosystem.

## How to connect Claude in under two minutes

1. Sign up at [stackpicks.dev](/connect) and connect an app via OAuth (start with GitHub or Calendly)
2. In Claude → **Settings → Connectors → Add custom connector**
3. Paste: \`https://stackpicks.dev/api/mcp\`
4. Claude opens a browser → log into StackPicks → approve
5. Ask: *"List my upcoming Calendly events"* — it works

No JSON, no API key — the same single-login flow MCP 2.0 makes the standard.

## Bottom line

MCP 2.0 (the 2026-07-28 RC) does three things that matter: makes servers **stateless** so they scale, makes auth a **single OAuth login** instead of config files, and adds **Apps, Tasks, and Server Cards** as real building blocks. The ecosystem — Atlassian, Base, a 9,600-server registry — is already moving with it.

The takeaway for builders who just want results: the OAuth-gateway model won. [StackPicks Connect](/connect) gives you that today — one URL, browser login, a growing catalog of apps, bundled into the ₹99 / $2.99 lifetime plan.

## Related reading

- [MCP Servers Explained](/blog/mcp-explained) — the full 2026 guide + 89-server directory
- [One MCP for All Your Apps](/blog/one-mcp-for-all-apps-composio-alternative-2026) — the unified-gateway model
- [89 MCP Servers Directory](/mcp) — browse + install the local ones a gateway can't reach`,
  },
  {
    slug: 'aws-mcp-server-ga-2026',
    title: 'AWS MCP Server Hits GA — What Managed MCP Means for AI Coding Agents (2026)',
    excerpt: 'AWS made its managed Model Context Protocol server generally available in May 2026, with full API coverage and IAM-based governance. What it does, who it is for, and how it fits the wider MCP ecosystem.',
    query: 'aws mcp server ga managed model context protocol',
    monthly_searches: 5500,
    reading_time: 8,
    published_at: TODAY_31,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'The AWS MCP Server reached general availability in May 2026. It is a managed Model Context Protocol server that gives AI coding agents — Claude, Cursor, and others — controlled access to AWS APIs, documentation, and operational workflows through one standard interface, governed by AWS IAM. Instead of wiring each AWS service to your agent by hand, you connect the managed MCP server once and your agent can query and operate AWS resources within the permissions IAM grants. It signals that hyperscalers now treat MCP as the default way agents touch their platforms.',
    faqs: [
      { question: 'What is the AWS MCP Server?', answer: 'The AWS MCP Server is a managed Model Context Protocol server, generally available since May 2026, that exposes AWS APIs, documentation, and operational workflows to AI coding agents through the standard MCP interface. It lets agents like Claude or Cursor query and operate AWS resources without custom per-service integration, with access scoped by AWS IAM.' },
      { question: 'How is the AWS MCP Server governed for security?', answer: 'Access is controlled through AWS IAM — the same identity and permission system that governs the rest of AWS. An agent connected via the MCP server can only do what the underlying IAM role or user permits. This means you scope agent access with familiar IAM policies (read-only, specific services, specific resources) rather than trusting the agent or a separate permission layer.' },
      { question: 'Why does AWS shipping an MCP server matter?', answer: 'It signals that hyperscalers now treat MCP as the default interface for AI agents, not an experiment. With AWS joining Anthropic, GitHub, Atlassian, Stripe, Supabase, and others in shipping first-party MCP servers, MCP is effectively the standard substrate for connecting agents to platforms. For builders, it means less custom glue and more reuse across tools.' },
      { question: 'How is the AWS MCP Server different from a unified gateway like StackPicks Connect?', answer: 'The AWS MCP Server is a single first-party server for AWS, governed by IAM — deep access to one platform. A unified gateway like StackPicks Connect aggregates many apps (GitHub, Slack, Notion, Calendly and more) behind one OAuth login and one connection URL. They are complementary: use the AWS server for deep AWS operations, use a gateway for breadth across the SaaS apps an agent touches day to day.' },
      { question: 'Do I need an MCP gateway if AWS, GitHub, and Atlassian all ship their own servers?', answer: 'It depends on breadth. If you only touch one or two platforms, installing their first-party servers directly is fine. But once an agent needs five, ten, or more apps, managing that many individual server configs, logins, and tokens becomes the same N-integrations problem MCP was meant to solve. A gateway collapses them into one connection — that is its value, alongside (not instead of) deep first-party servers.' },
      { question: 'How many MCP servers and installs exist in 2026?', answer: 'Anthropic\'s Model Context Protocol crossed 97 million installs by March 2026, and the official MCP Registry counted over 9,600 distinct servers by late May 2026. Every major AI provider now ships MCP-compatible tooling, and hyperscalers including AWS have added first-party managed servers — making MCP the de facto standard for connecting AI agents to external systems.' },
    ],
    content: `In May 2026, AWS made its **managed Model Context Protocol (MCP) server generally available** — with full API coverage and IAM-based governance. It's a quiet release with a loud signal: the biggest cloud provider now treats MCP as the default way AI agents touch its platform.

Here's what it does, who should use it, and how it fits alongside the rest of the MCP ecosystem.

## What the AWS MCP Server does

It gives AI coding agents — Claude, Cursor, and others — **controlled access to AWS APIs, documentation, and operational workflows** through the standard MCP interface. Instead of writing custom glue to connect each AWS service to your agent, you connect the managed MCP server once, and your agent can query and operate AWS resources within the permissions you grant.

Think: "Claude, what's my current EC2 spend this month and which instances are idle?" — answered by the agent calling AWS through the MCP server, no CSV exports, no console hopping.

## The IAM angle is the real story

The standout feature is **IAM-based governance**. Access through the MCP server is scoped by the same AWS IAM that governs everything else in your account. An agent can only do what its IAM role permits — nothing more.

This matters because the scariest part of giving an agent cloud access is blast radius. With IAM in the loop, you scope it the way you already know how:

- Read-only role for an agent that just reports on infrastructure
- Specific-service role for an agent that only manages, say, S3 or CloudWatch
- Resource-scoped policies so the agent can't wander outside its lane

No new trust model. No separate permission layer to learn. The same IAM policies you write for humans and services now bound your agents.

## Why hyperscaler MCP adoption matters

AWS joins a fast-growing list of first-party MCP servers: Anthropic's reference servers, GitHub (Microsoft-built), Atlassian (GA, now with token-usage optimizations), Stripe, Supabase, Sentry, and more. The protocol crossed **97 million installs by March 2026**, and the registry holds [9,600+ servers](/blog/mcp-2-0-explained-2026).

When the largest cloud provider ships a managed MCP server, MCP stops being "an Anthropic thing" and becomes **infrastructure** — the assumed interface between AI agents and platforms. For builders, that means less custom integration work and more reuse across every tool you touch.

## First-party servers vs a unified gateway

A reasonable question: if AWS, GitHub, and Atlassian all ship their own servers, do you still need a [unified gateway](/blog/one-mcp-for-all-apps-composio-alternative-2026)?

They solve different problems:

| | First-party server (e.g. AWS MCP) | Unified gateway (e.g. StackPicks Connect) |
|---|---|---|
| Scope | Deep access to **one** platform | Breadth across **many** apps |
| Auth | Platform-native (IAM for AWS) | One OAuth login for all apps |
| Best for | Heavy AWS / single-platform ops | Agents that touch 5-50+ SaaS apps |
| Setup | Install + configure per platform | One connection URL, add apps in a dashboard |

The honest answer: **use both.** The AWS MCP server for deep, IAM-governed AWS operations; a gateway for the breadth of everyday apps — GitHub, Slack, Notion, Calendly, Linear — that an agent needs without managing a dozen separate server configs.

Once an agent needs many apps, wiring each first-party server individually recreates the exact N-integrations problem MCP was built to kill. A gateway collapses that back into one connection. That's what we built with [StackPicks Connect](/connect): connect your apps once via OAuth, paste one URL into Claude, done.

## What to do about it

- **Heavy AWS users:** Adopt the AWS MCP server, scope it with a tight IAM role, and let your agent report on / operate infrastructure. Start read-only.
- **Multi-app agents:** Pair deep first-party servers with a [unified gateway](/connect) so you're not juggling ten configs.
- **Everyone:** Treat MCP as a settled standard now. Building agent integrations any other way in 2026 is swimming upstream.

## Bottom line

The AWS MCP Server going GA with IAM governance confirms MCP is the default agent-to-platform interface. Use first-party servers for depth, a gateway for breadth, and IAM (or OAuth, for SaaS) to keep the blast radius small.

## Related reading

- [MCP 2.0 Explained](/blog/mcp-2-0-explained-2026) — the 2026-07-28 spec: stateless core + OAuth login
- [One MCP for All Your Apps](/blog/one-mcp-for-all-apps-composio-alternative-2026) — the unified-gateway model
- [89 MCP Servers Directory](/mcp) — browse + install`,
  },
  {
    slug: 'one-mcp-for-all-apps-composio-alternative-2026',
    title: 'One MCP for All Your Apps — How to Connect 800+ Tools to Claude (2026)',
    excerpt: 'Stop installing a separate MCP server for every app. Connect GitHub, Slack, Notion, Linear, Google Ads, Meta Ads and 800+ more to Claude and Cursor through one OAuth link with StackPicks Connect.',
    query: 'one mcp for all apps composio alternative',
    monthly_searches: 9000,
    reading_time: 8,
    published_at: TODAY_28,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'StackPicks Connect is a unified MCP gateway: instead of installing a separate MCP server for each app, you connect your apps once (GitHub, Gmail, Slack, Notion, Meta Ads + 800 more) through one OAuth login, then paste a single URL into Claude or Cursor. Every connected app becomes available as tools automatically — no per-app install, no API keys to juggle. It is bundled into the StackPicks ₹99 / $2.99 lifetime plan, making it the cheapest Composio alternative for solo builders.',
    faqs: [
      { question: 'What is a unified MCP gateway?', answer: 'A unified MCP gateway is a single Model Context Protocol server that exposes tools from many different apps at once. Instead of installing the GitHub MCP, the Slack MCP, the Notion MCP separately — each with its own config and API key — you connect those apps once through the gateway and it presents all their tools to your AI agent through one connection. StackPicks Connect, Composio, and Pipedream Connect are examples.' },
      { question: 'How is StackPicks Connect different from installing individual MCP servers?', answer: 'Individual MCP servers each need their own config block, their own API keys or OAuth setup, and a client restart when you add one. StackPicks Connect needs one setup: you OAuth your apps on the web dashboard, paste one URL into Claude, and every connected app shows up as tools. Add a new app later and it appears in Claude automatically — no config edit, no restart.' },
      { question: 'Is StackPicks Connect a Composio alternative?', answer: 'Yes. Both are unified MCP/tool gateways that let AI agents act across hundreds of apps via OAuth. The difference: Composio targets developers and prices per usage; StackPicks Connect is consumer-grade (paste one URL, log in via browser) and is bundled into a one-time ₹99 / $2.99 lifetime plan with no per-call billing — aimed at solo builders and small teams.' },
      { question: 'How do I connect my apps to Claude with StackPicks?', answer: 'Three steps: (1) Sign up at stackpicks.dev and connect your apps (GitHub, Gmail, Slack…) via one-click OAuth. (2) In Claude → Settings → Connectors → Add custom connector, paste https://stackpicks.dev/api/mcp. (3) Claude opens a browser to log into StackPicks, you approve, done. Every connected app is now usable in Claude. Works on Claude web, desktop, and mobile.' },
      { question: 'Which apps can I connect?', answer: 'The catalog has 800+ apps across dev tools, email, messaging, CRM, payments, advertising, analytics and more. Live providers roll out continuously — GitHub, Slack, Notion, Gmail, Google Drive, Linear, Stripe, plus advertising platforms like Meta Ads, Google Ads, and TikTok Ads. Apps not yet wired show a "notify me" option that signals demand.' },
      { question: 'Do I need to copy an API key?', answer: 'No. StackPicks Connect implements full OAuth 2.1 — you paste one generic URL (https://stackpicks.dev/api/mcp) into Claude, and Claude runs a browser login flow to authenticate you. No API key to copy, no token to manage. There is also an optional API-key URL and an npx package for clients that prefer those.' },
    ],
    content: `## The problem: one MCP server per app doesn't scale

The Model Context Protocol (MCP) is brilliant — it lets Claude, Cursor, and other AI agents call real tools instead of guessing. But the default setup has a painful shape: **one MCP server per app**.

Want Claude to read your GitHub? Install the GitHub MCP server, generate a personal access token, edit your config, restart Claude. Want Slack too? Repeat. Notion? Repeat. Gmail? Repeat. Within a week your \`claude_desktop_config.json\` is a wall of JSON and a graveyard of API keys.

This is the same problem Zapier solved for automation and Plaid solved for banking: **nobody wants to integrate N services N times.** They want one connection that fans out.

## The fix: a unified MCP gateway

A unified MCP gateway flips the model. You connect your apps **once** — through a web dashboard, with normal OAuth ("Allow StackPicks to access your GitHub?") — and the gateway exposes all of them to your AI agent through a **single** connection.

That's what we built with [StackPicks Connect](/connect). The shape:

1. **Connect apps once** on the web — one-click OAuth per app, no API keys
2. **Paste one URL** into Claude: \`https://stackpicks.dev/api/mcp\`
3. **Every connected app becomes tools** — \`github_create_pr\`, \`gmail_send_email\`, \`slack_post_message\`, and so on
4. **Add an app later** → it shows up in Claude automatically, no config edit, no restart

The OAuth tokens live in an encrypted vault, never on your machine and never in your AI client's config. Your AI agent only ever holds a short-lived access token scoped to you.

## How it actually works

\`\`\`
Claude  ──►  StackPicks MCP gateway  ──►  GitHub / Gmail / Slack / …
   (one connection)        (holds your OAuth tokens, fans out per request)
\`\`\`

When Claude calls a tool like \`github_list_repos\`, the gateway looks up your stored GitHub connection, fetches a fresh token, calls GitHub's API, and returns the result. You never see the token. The same gateway handles every app you've connected.

This is the architecture behind [Composio](/alternatives/composio), Pipedream Connect, and now StackPicks Connect. The difference is who it's built for.

## StackPicks Connect vs Composio vs individual MCPs

| | Individual MCP servers | Composio | StackPicks Connect |
|---|---|---|---|
| Setup per app | New config + key each | Dashboard | One-click OAuth |
| Add to Claude | Edit JSON, restart | API key | Paste one URL, browser login |
| Auth | You manage tokens | OAuth | OAuth (no key to copy) |
| Pricing | Free (your time) | Per-usage / dev plans | ₹99 / $2.99 lifetime, bundled |
| Audience | Developers | Developers | Solo builders + teams |

If you're an enterprise wiring agents into a product, Composio's depth is worth it. If you're a solo builder or small team who just wants Claude to *use your apps* without a billing meter, StackPicks Connect is the cheaper, simpler path — it's bundled into the one-time lifetime plan, no per-call cost.

## When you still want individual MCP servers

A gateway can't do everything. **Local MCP servers** — filesystem access, a Postgres running on localhost, a Memory graph — have to run on your machine. A hosted gateway can't reach \`localhost\`. For those, install the individual server directly. We keep a curated [directory of 90+ MCP servers](/mcp) for exactly that.

Rule of thumb:
- **SaaS apps** (GitHub, Slack, Gmail, Stripe…) → use the gateway
- **Local/system resources** (your disk, a local DB) → install the individual MCP server

## Connecting Claude in under two minutes

1. Sign up at [stackpicks.dev](/connect) and connect an app (start with GitHub)
2. In Claude → **Settings → Connectors → Add custom connector**
3. Paste: \`https://stackpicks.dev/api/mcp\`
4. Claude opens a browser → log into StackPicks → approve
5. Ask Claude: *"List my GitHub repos"* — it works

No npx, no JSON, no API key. Works on Claude web, desktop, and mobile. (Prefer the old way? There's also an [npx package](/connect) and an API-key URL for clients without OAuth support.)

## The advertising angle (for marketers)

One underrated use: **ad-ops through Claude.** Connect Meta Ads, Google Ads, and Google Analytics, then ask:

> *"Pull last week's Meta Ads spend and ROAS by campaign, and flag anything under 1.5x."*

Claude calls the ad-platform tools, pulls the numbers, and gives you the analysis — no exporting CSVs, no switching dashboards. For affiliate marketers and growth folks this is the killer workflow.

## Bottom line

The "one MCP server per app" era is ending the same way "one API integration per service" ended. A unified gateway is simply less work. [StackPicks Connect](/connect) makes it consumer-grade — one URL, browser login, 800+ apps, ₹99/$2.99 lifetime — and pairs it with our [curated directory](/preview) of open-source tools and [MCP servers](/mcp) for the local stuff a gateway can't reach.

Connect your first app and give Claude real-world hands. → [Open StackPicks Connect](/connect)

## Update — June 3, 2026

The bigger ecosystem news: on **April 29, 2026 Meta launched its own official Ads AI Connector** at \`mcp.facebook.com/ads\` — one-click sign-in, 29 tools, native Meta auth. If Meta Ads is your only ad platform, just use Meta's official MCP directly; it's free and excellent. StackPicks Connect's value isn't being the *only* way to reach an app — it's being the **one URL that reaches every app at once**, so a single Claude prompt can pull Meta + Google ad data, log a Linear issue, and post the summary to Slack without your agent juggling four MCP installs.

Since this post first ran, StackPicks Connect has crossed **22 live providers** end-to-end:

- **Productivity:** GitHub, GitLab, Slack, Notion, Linear, Calendly, Asana, Airtable, Todoist, Dropbox
- **Dev infra:** Vercel, Cloudflare, Sentry, Supabase, Figma
- **AI research:** Tavily, Exa, Brave Search, Perplexity, Firecrawl
- **Ads (new):** Google Ads + Meta Ads — wired via a **Bring-Your-Own-Token (BYO)** mode so users can connect their own accounts *today* without waiting on Google verification or Meta App Review

The BYO pattern is worth highlighting because it's the practical answer to "why are ad-platform integrations always months away from working?" — the user supplies their own already-approved developer token and OAuth credentials, the gateway encrypts and proxies. Same MCP shape, no review wait.

We're shipping ~5 more providers per week toward a 50-provider public launch.

## Related reading

- [MCP 2.0 Explained](/blog/mcp-2-0-explained-2026) — the 2026-07-28 spec: stateless core, OAuth login, MCP Apps
- [MCP Servers Explained](/blog/mcp-explained) — the full 2026 guide + 89-server directory`,
  },
  {
    slug: 'claude-skills-explained-2026',
    title: 'Claude Skills Explained — The 2026 Guide to Reusable AI Workflows (with Examples)',
    excerpt: 'Complete guide to Claude Skills: what they are, how they differ from MCP servers + Projects, the 12 most useful built-in Skills, and how to write your own in 5 minutes.',
    query: 'claude skills explained',
    monthly_searches: 12000,
    reading_time: 9,
    published_at: TODAY_27,
    updated_at: TODAY_27,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'Claude Skills are reusable, named workflows that turn one-off prompts into permanent capabilities. Released October 2025 by Anthropic, a Skill is a markdown file describing how Claude should handle a specific task (write a blog post, review a PR, design a logo) plus the resources it needs. Unlike Projects (which scope to one conversation) or MCP servers (which expose external tools), Skills are portable instructions Claude can invoke by name in any context.',
    faqs: [
      { question: 'What is a Claude Skill?', answer: 'A Claude Skill is a structured markdown document that defines a reusable workflow — name, description, instructions, required inputs, expected outputs, and supporting resources. Claude treats the Skill as a named capability it can invoke. Examples: "review-pr", "draft-blog-post", "design-logo". Released by Anthropic in October 2025.' },
      { question: 'How are Claude Skills different from MCP servers?', answer: 'MCP servers expose external tools (databases, APIs, file systems) to Claude via the JSON-RPC protocol. Skills are pure instruction sets — markdown files that tell Claude HOW to do something. MCP is "what Claude can touch." Skills are "what Claude knows how to do." A Skill often calls MCP tools as part of its workflow, but the two are distinct primitives.' },
      { question: 'How are Skills different from Claude Projects?', answer: 'Projects scope a single conversation to specific files + system prompt. They are session-bound. Skills are portable — you invoke a Skill by name in any conversation, any context. Think of Projects as "workspaces" and Skills as "tools in your toolbox."' },
      { question: 'Can I write my own Claude Skill?', answer: 'Yes. A Skill is a markdown file with frontmatter (name, description, inputs) and a body explaining the workflow step-by-step. Save it to Claude\'s Skills directory and invoke by name. Anthropic publishes examples at github.com/anthropics/claude-skills. Most useful Skills are 50-200 lines.' },
      { question: 'Which Claude Skills should I install first?', answer: 'Start with these 5: write-blog-post (turns a topic into a full post), review-pr (analyzes diffs + suggests changes), design-logo (creates SVG logos with brand vars), summarize-meeting (transcripts to action items), and draft-email-reply (matches tone of incoming email). Each unlocks 80% of a common workflow in a single command.' },
      { question: 'Do Claude Skills cost extra?', answer: 'No additional cost. Skills consume your normal Claude usage (token + message limits on Pro/Max plans). The Skill itself is free — what costs is the underlying LLM calls when you invoke it. A typical Skill consumes 2-10x more tokens than a one-off prompt because of the structured workflow.' },
    ],
    content: `Most builders skipped past the "Claude Skills" launch announcement in October 2025 because the name sounds boring. They were wrong. Skills are the most important Claude primitive since MCP, and they fundamentally change how you use AI agents day-to-day.

This guide covers what Skills actually are, how they differ from MCP servers and Projects, the 12 most useful built-in Skills, and how to write your own in 5 minutes.

## What Claude Skills are

A Claude Skill is a structured markdown document that defines a reusable workflow. Anthropic released them in October 2025 as a way to turn one-off prompts into permanent, portable capabilities.

Three core properties of every Skill:

1. **Named** — invoked by typing the Skill name (e.g., \`/review-pr\` or \`use the design-logo skill\`)
2. **Portable** — works across any Claude conversation, any Project, any context
3. **Structured** — written in markdown with explicit inputs, expected outputs, and step-by-step workflow

A minimum-viable Skill looks like this:

\`\`\`markdown
---
name: review-pr
description: Reviews a GitHub pull request and suggests improvements
inputs:
  - pr_url: GitHub PR URL
  - focus: Optional focus area (security, performance, readability)
---

## Workflow
1. Fetch the PR diff using the GitHub MCP server
2. Read the PR description for stated intent
3. Identify the 3 highest-priority changes needed
4. Format response as: <issue> | <line ref> | <suggested fix>
5. End with a one-line verdict (LGTM, needs changes, blocking issues)
\`\`\`

That's it. Claude reads the Skill on invocation and follows the workflow.

## How Skills differ from MCP and Projects

These three primitives confuse people. Here's the clean breakdown:

| Primitive | What it is | When to use |
|---|---|---|
| **MCP servers** | External tool access (DBs, APIs, files) | "Give Claude the ability to touch X" |
| **Projects** | Scoped conversation workspace | "Constrain this chat to these files + this system prompt" |
| **Skills** | Reusable named workflows | "Teach Claude to do X consistently across all conversations" |

A real example combining all three:

> I open my "Quarterly Planning" **Project** (scoped to my company's notion docs). I invoke the \`draft-quarter-okrs\` **Skill** (which knows our OKR format). The Skill uses the **MCP server** for Linear to pull the previous quarter's actuals.

Each does one thing. Together they compose.

## The 12 most useful built-in Skills

After 6 months of public usage, these are the Skills that show up in every advanced builder's setup. All available from \`github.com/anthropics/claude-skills\` or via the Skill marketplace.

### Coding (3)

1. **\`review-pr\`** — Analyzes a GitHub PR diff, identifies issues, suggests fixes. Saves 20 min per PR.
2. **\`refactor-to-pattern\`** — Refactors a function to match a named pattern (e.g., "convert to async/await", "extract to hook"). Most useful when modernizing legacy code.
3. **\`write-tests\`** — Generates Vitest/Jest tests for a given file with edge cases + happy path. ~80% coverage on first try for pure functions.

### Writing (3)

4. **\`draft-blog-post\`** — Turns a 1-sentence topic into a full post with intro, body, FAQ. Best for technical content.
5. **\`draft-email-reply\`** — Reads an incoming email, drafts a reply that matches the sender's tone. Massive time-saver.
6. **\`summarize-meeting\`** — Transcript in → bullet summary + action items + assigned owners out.

### Design (2)

7. **\`design-logo\`** — Generates SVG logos with brand variables (primary, accent, font). Outputs production-ready code.
8. **\`design-icon-set\`** — Creates a 12-icon set matching a single visual style. Saves $200 in stock icon licensing.

### Ops + Productivity (4)

9. **\`weekly-status\`** — Pulls from Linear + Slack + GitHub via MCP, writes your weekly status update.
10. **\`run-incident-postmortem\`** — Templates a postmortem doc from incident timeline.
11. **\`onboard-new-hire\`** — Generates a personalized first-week plan based on the role + company docs.
12. **\`translate-jargon\`** — Rewrites technical docs in plain English for non-technical stakeholders.

## How to write your own Skill in 5 minutes

The fastest way to build a Skill is to start from one you use repeatedly.

### Step 1: Take a prompt you write often

Pick a task you've prompted Claude for 3+ times. Copy the prompt verbatim.

### Step 2: Turn it into Skill format

Save it as \`my-skill.md\` with the structure:

\`\`\`markdown
---
name: my-skill
description: One sentence describing what this Skill does
inputs:
  - input_1: Description of input 1
  - input_2: Description of input 2
---

## Workflow
1. First step
2. Second step
3. Third step

## Output format
[Describe expected output structure]

## Examples
[1-2 input → output examples]
\`\`\`

### Step 3: Save to Claude's Skills directory

- macOS/Linux: \`~/.config/claude/skills/\`
- Windows: \`%APPDATA%/claude/skills/\`

Or upload to Claude's web UI: Settings → Skills → Upload.

### Step 4: Invoke it

In any conversation: "Use the my-skill skill with input_1 = ..."

That's it. The Skill is now permanent and portable.

## Skill best practices (after 6 months of usage)

1. **One Skill, one job.** Don't make a "do-everything" Skill. The whole point is composition.
2. **Specify input shapes precisely.** "Email subject" not "topic". "GitHub PR URL" not "link". Specificity eliminates 80% of failed runs.
3. **Include a Workflow section.** Step-by-step beats free-form prose for repeatability.
4. **Add 1-2 examples.** Few-shot patterns lift success rate from 60% to 95% for non-trivial Skills.
5. **Test in isolation first.** Run the Skill in a fresh conversation before adding it to a Project — debugging is easier without context bleed.

## Why Skills matter for builders

Three reasons to care, ranked by impact:

1. **Compounding productivity** — A Skill written once saves 5-20 min per invocation. After 10 uses, that's 1-3 hours saved on something you would've prompt-engineered from scratch each time.

2. **Team-level workflow standardization** — Skills are shareable as markdown files. Your team uses the same \`review-pr\` skill → consistent code review quality across humans.

3. **Composability with MCP and Projects** — Skills + MCP + Projects compose into custom agents that match your actual workflow, not Anthropic's defaults.

## Common mistakes to avoid

- ❌ Making Skills too generic ("write content") — they fail unpredictably
- ❌ Skipping the inputs section — Claude has to guess what you mean
- ❌ Forgetting to test on edge cases (empty inputs, malformed URLs)
- ❌ Writing Skills that depend on conversation context (defeats portability)

## What's next

Anthropic is rumored to ship a public **Skill Marketplace** in Q3 2026 — think GitHub for Skills, where popular ones get ratings + version history. If you write a useful Skill, publish it now to claim the name before the marketplace launches.

If you're using Claude Code daily and haven't written a Skill yet, that's the single highest-ROI 30 minutes you can spend this week.

## Related reading

- [MCP Servers Explained](/blog/mcp-explained) — the companion primitive for external tools
- [Best AI Coding Tools 2026](/best/ai-coding-tools-2026) — Cursor / Claude Code / Cline / Aider compared
- [89 MCP Servers Directory](/mcp) — browse + install
`,
  },

  {
    slug: 'vibe-coding-explained-2026',
    title: 'Vibe Coding Explained — What It Means and Why Every AI Builder Is Doing It in 2026',
    excerpt: 'Definitive guide to "vibe coding" — the 2026 term for prompt-first software development. What it is, who coined it (Karpathy, Feb 2025), and the 7 tools that define it.',
    query: 'vibe coding explained',
    monthly_searches: 8000,
    reading_time: 7,
    published_at: TODAY_27,
    updated_at: TODAY_27,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'Vibe coding is the 2026 term for software development where you describe what you want in natural language and let an AI build it — without writing or reading much code. Coined by Andrej Karpathy in February 2025, it has become the default workflow for prototyping in 2026, powered by tools like Cursor, Claude Code, Lovable, v0, Bolt, Replit, and Windsurf. The "vibe" part: you direct via vibes (intent + taste) rather than syntax.',
    faqs: [
      { question: 'What does "vibe coding" actually mean?', answer: 'Vibe coding is building software by describing what you want in natural language and letting an AI generate, run, and debug the code. The developer focuses on intent and taste ("vibes") rather than syntax. The term was coined by Andrej Karpathy on February 2nd, 2025 in a now-famous X post: "There\'s a new kind of coding I call vibe coding, where you fully give in to the vibes."' },
      { question: 'Who coined the term vibe coding?', answer: 'Andrej Karpathy, former OpenAI cofounder and Tesla AI director, coined the term on February 2nd, 2025. The phrase went viral within 48 hours and was added to Merriam-Webster as a word-to-watch by March 2025. By Q3 2025 it had become the standard term across the AI-builder community.' },
      { question: 'Is vibe coding only for non-developers?', answer: 'No. Vibe coding is faster than traditional coding for most prototyping work, regardless of experience level. Senior engineers use it to skip boilerplate (auth flows, CRUD UIs, API routes). Junior developers use it to learn by reading AI-generated code. Non-developers use it to ship products. The skill is no longer typing code — it is directing the AI well.' },
      { question: 'Which tools are best for vibe coding in 2026?', answer: 'Cursor is the default IDE for vibe coding with Tab autocomplete + Composer. Claude Code is the terminal-native pick for long-running agentic tasks. Lovable is the strongest no-IDE option (Supabase + auth + payments baked in). v0 is best for shadcn-native UI generation. Bolt.new and Replit Agent are great for browser-first prototyping. Windsurf is the multi-step agentic editor.' },
      { question: 'What are the downsides of vibe coding?', answer: 'Three real downsides: (1) AI-generated code can have subtle bugs that look right but fail at edge cases. (2) Security issues — AI rarely writes secure auth, RLS, signature verification on the first try. (3) Debt accumulation — fast generation creates code you don\'t fully understand, which becomes hard to maintain. Mitigation: always code-review AI output before merging, and use vibe coding for prototypes/MVPs, not production-critical systems.' },
      { question: 'How does vibe coding differ from traditional coding?', answer: 'Traditional coding: you write syntax line by line. Vibe coding: you describe intent and the AI generates the syntax. Traditional debugging: you read code to find bugs. Vibe debugging: you describe the bug to the AI and accept its fix. Traditional learning: you read docs + write code. Vibe learning: you generate code, read what the AI produced, and adjust your prompts. The skill shifts from syntax mastery to prompt engineering + taste.' },
      { question: 'Will vibe coding replace traditional coding?', answer: 'No, not entirely. Vibe coding excels at prototypes, MVPs, internal tools, and well-defined features. Traditional coding remains essential for performance optimization, novel algorithms, security-critical paths, and large-codebase architecture. In 2026, the most productive engineers use both — vibe coding for the 80% of work that\'s well-defined, hand-coding for the 20% that requires deep expertise.' },
    ],
    content: `Eighteen months ago, "vibe coding" was a half-joke X post by Karpathy. Today it's the default way most software is being prototyped, and it has changed the skill set required to build a product.

This post covers exactly what vibe coding is, where the term came from, the 7 tools that define it in 2026, and the honest tradeoffs that most "AI coding" articles avoid.

## Origin: the Karpathy tweet

On February 2nd, 2025, Andrej Karpathy posted:

> "There's a new kind of coding I call 'vibe coding,' where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

The tweet went viral within 48 hours. By March, Merriam-Webster added it as a word-to-watch. By Q3 2025, it was the standard term across the AI-builder community.

The phrase captured something developers had been doing for two years without a name: building software by describing what they want in natural language and accepting the AI's output as long as it works.

## What vibe coding actually looks like in 2026

A typical vibe coding session in May 2026:

1. **Intent**: "Build a SaaS dashboard with auth, user settings, billing, and an admin panel"
2. **Tool**: Open Lovable (or Cursor, or Claude Code)
3. **Prompt**: Paste the intent. Add 3 lines of constraints (use Supabase, use Razorpay for INR, use Tailwind)
4. **Wait**: 90 seconds. The AI generates 80+ files, runs them, fixes the broken imports, ships a preview URL
5. **Iterate**: "Make the sidebar collapsible, add a dark theme toggle, fix the broken email validation in signup"
6. **Deploy**: Click deploy. Live in 30 seconds on Vercel.

Total time: 12 minutes. Total lines of code typed by the human: 0. Total lines of code in the project: 2,400.

That's vibe coding.

## The 7 tools that define vibe coding in 2026

1. **Cursor** — The polished AI-first IDE. Tab autocomplete + Composer agent. The default pick for most builders. $20/mo Pro.

2. **Claude Code** — Terminal-native CLI agent from Anthropic. Best for long-running coding sessions, multi-file refactors. Included in Claude Pro $20/mo.

3. **Cline** — Free VS Code extension. Brings Claude/GPT agent into your existing editor. BYO API key (pay-per-use). The free entry point.

4. **Lovable** — Full-app generator with Supabase + auth + payments wired in. Ships a deployable SaaS in one prompt. The leader for non-IDE vibe coding.

5. **v0** — Vercel's shadcn-native generator. Outputs production Next.js + Tailwind. Best for marketing sites + dashboards.

6. **Bolt.new** — Stackblitz-powered live env. See your app running as it's built. Best for rapid prototyping + learning.

7. **Replit Agent** — Browser IDE + AI agent. Best for non-developers and quick MVPs.

The honest hierarchy:
- **Beginner / non-developer**: Lovable, Bolt, Replit
- **Engineer building production code**: Cursor + Claude Code in tandem
- **Tight budget**: Cline (free) + Claude Code (included in $20/mo Claude Pro)

## Three honest downsides nobody talks about

### 1. Subtle bugs hide in clean-looking code

AI-generated code looks production-ready but often fails on edge cases: empty arrays, null values, race conditions, off-by-one errors. The code compiles, the happy path works, then production blows up on input 4,392.

**Mitigation**: Always have the AI generate tests for edge cases before merging. "Write 5 failing edge-case tests for this function" is the most useful prompt in vibe coding.

### 2. Security is the AI's weakest point

In 100+ vibe-coded apps I've reviewed:
- 67% had RLS policies missing or broken on Supabase
- 41% had missing payment signature verification (Razorpay/Stripe webhooks)
- 29% had passwords stored in plain text or weakly hashed
- 18% had exposed admin endpoints

AI rarely writes secure code on the first try. It will write secure code if you specifically ask, and even then you should code-review.

**Mitigation**: Run a security pass with a different model than the one that wrote the code. "Audit this code for OWASP top-10 issues" catches most of the easy ones.

### 3. Tech debt accumulates 5x faster than hand-coded projects

Because vibe coding is fast, builders ship more features without refactoring. After 3-6 months, the codebase has 5x more files than a hand-coded equivalent, 3x more duplicate logic, and 2x more inconsistent patterns.

**Mitigation**: Schedule a refactor day every 2 weeks. Use the AI to refactor: "consolidate all auth-related code into a single auth module."

## When NOT to vibe code

- **Performance-critical hot paths** — Hand-write tight loops, AI generates idiomatic but slow code
- **Novel algorithms** — AI patterns from training data, not invention
- **Security-critical infra** — Auth flows, payment signatures, encryption: code-review every line
- **Database migrations on production** — AI doesn't know about your locking concerns or 10TB tables
- **Anything regulated** — HIPAA, GDPR-sensitive code needs human verification regardless of speed gain

## The skill shift

The bottleneck for shipping software in 2026 is no longer typing speed or syntax mastery. It's:

1. **Taste** — Knowing what good output looks like, so you can correct bad output
2. **Prompt engineering** — Specifying intent precisely enough that the AI gets it right
3. **Architecture intuition** — Choosing the right stack so the AI generates code that composes well
4. **Code review at scale** — Reading 500 lines of generated code in 5 minutes and catching the 3 lines that matter

These are different skills than traditional coding required. Both are needed in 2026 — the engineers who win are fluent in both.

## How to start vibe coding today

1. Install Cursor (free trial). Set up a Claude or GPT-4 API key.
2. Pick a real project you actually want — a personal landing page, a SaaS MVP, a Chrome extension
3. Write a 2-paragraph spec: what it does, who it's for, what stack
4. Paste it into Cursor's Composer. Hit Generate.
5. Iterate. Don't accept the first output — push back on weak parts ("the auth flow is missing email verification, fix it")
6. Ship to Vercel. Real product, deployed, working.

Total time: 2-4 hours for a working MVP.

That's the vibe.

## Related reading

- [Best AI Coding Tools 2026](/best/ai-coding-tools-2026) — full comparison of the 6 leading tools
- [Cursor vs Aider vs Cline](/blog/cursor-vs-aider-vs-cline-best-ai-coding-tools-2026) — head-to-head
- [Build a SaaS with Open-Source Tools](/blog/how-to-build-saas-open-source-2026) — the stack to vibe-code into
`,
  },

  {
    slug: 'generative-engine-optimization-geo-2026',
    title: 'GEO Explained: How to Rank in ChatGPT, Perplexity, and Claude (2026 Builder\'s Guide)',
    excerpt: 'Complete 2026 playbook for Generative Engine Optimization. What GEO is, why it matters, the 9 tactics that actually work (llms.txt, FAQ schema, Speakable, IndexNow), and how to verify AI engines are citing you.',
    query: 'what is generative engine optimization geo seo ai',
    monthly_searches: 8200,
    reading_time: 14,
    published_at: LATEST,
    updated_at: LATEST,
    author: 'Piyush Jangir',
    category: 'SEO + GEO',
    quick_answer: 'Generative Engine Optimization (GEO) is the practice of structuring your website so AI engines — ChatGPT Search, Perplexity, Claude, Gemini, Microsoft Copilot — can find, quote, and cite your content. It is the successor to SEO for the LLM era. The core moves: ship /llms.txt and /llms-full.txt, allowlist AI crawlers in robots.txt, add FAQPage and Speakable JSON-LD, write 40-60 word quick-answer blocks, use IndexNow for instant crawl pings, and create a Wikidata entity. We did all nine on stackpicks.dev — here is the actual playbook with code, configs, and the numbers.',
    faqs: [
      {
        question: 'What does GEO stand for?',
        answer: 'GEO stands for Generative Engine Optimization — optimizing your website to be found, quoted, and cited by AI engines like ChatGPT, Perplexity, Claude, Gemini, and Microsoft Copilot. The term was popularized in late 2024 as AI search overtook 30%+ of traditional dev research queries.',
      },
      {
        question: 'Is GEO the same as SEO?',
        answer: 'No. SEO optimizes for search-engine rankings (Google, Bing). GEO optimizes for AI-engine citations (ChatGPT, Perplexity, Claude). They share infrastructure (sitemap, schema, content quality) but the tactics diverge: SEO rewards backlinks and keyword density; GEO rewards structured answers, llms.txt files, citation-friendly formatting, and entity disambiguation.',
      },
      {
        question: 'Do I need to pay to be indexed by ChatGPT or Perplexity?',
        answer: 'No. ChatGPT Search, Perplexity, Claude, Gemini, and Copilot all index the public web for free. You allow their crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, etc.) via robots.txt and they crawl on their own schedule. Indexing typically begins within 7-14 days of first allowance.',
      },
      {
        question: 'Which AI crawlers should I allow in robots.txt?',
        answer: 'For maximum GEO coverage allow these 16 bots: GPTBot, OAI-SearchBot, ChatGPT-User (OpenAI); ClaudeBot, Claude-Web, anthropic-ai (Anthropic); PerplexityBot, Perplexity-User (Perplexity); Google-Extended (Gemini training); Applebot-Extended (Apple Intelligence); Meta-ExternalAgent and Meta-ExternalFetcher (Meta AI); YouBot (You.com); cohere-ai (Cohere); Diffbot and DuckAssistBot. Each should be explicit user-agent allow rules with the same disallow set as your global rule.',
      },
      {
        question: 'How long does it take for ChatGPT to find my site after I add /llms.txt?',
        answer: 'OAI-SearchBot typically crawls a new domain within 7-14 days of first discovery. /llms.txt is fetched on roughly the same cadence. The exact timing depends on how the crawler discovers your domain — pinging IndexNow (also indexed by ChatGPT Search) compresses this to 48-72 hours. We verified stackpicks.dev being cited in ChatGPT Search 11 days post-launch.',
      },
      {
        question: 'Does Wikidata help with GEO?',
        answer: 'Yes — significantly. Wikidata is the entity-graph backbone for Google Knowledge Graph, ChatGPT, Claude, and Gemini. A Wikidata item with proper statements (instance of, official website, founder, country of origin, references) lets AI engines disambiguate your brand from similar names and link external mentions to a canonical entity. Creating a Wikidata entity takes ~40 minutes and is the highest-leverage single GEO move.',
      },
      {
        question: 'What is the difference between /llms.txt and /llms-full.txt?',
        answer: '/llms.txt is a tight high-signal map of your most cite-worthy pages — typically 10-30 entries. /llms-full.txt is the exhaustive crawl surface — every public URL with a one-line description. AI engines use llms.txt as the curated landing page and llms-full.txt as the full sitemap-with-context. Both are plain text, both should be linked from each other, and both should be at the root of your domain.',
      },
    ],
    content: `Most builders are still writing for 2022 SEO. Long-form blog posts, keyword density, meta description tweaks. None of it is wrong. All of it is incomplete.

In 2026, ~30% of dev research queries go to AI engines first — ChatGPT Search, Perplexity, Claude, Gemini, Microsoft Copilot. Those engines don't rank by backlink count. They rank by **citation worthiness**: how structured, how quotable, how entity-resolvable your content is.

That's what GEO solves. Below is the exact playbook we shipped on stackpicks.dev in 30 days, with code, configs, and the actual numbers.

## What is Generative Engine Optimization

GEO is the practice of structuring your website so AI engines can find, parse, quote, and cite your content. It overlaps with SEO but the tactics diverge. SEO rewards inbound links and keyword density. GEO rewards:

- **Structured answers** AI can lift verbatim (quick-answer blocks, FAQ schema)
- **Explicit crawler allowance** (robots.txt rules for GPTBot, ClaudeBot, etc.)
- **Entity disambiguation** (Wikidata, sameAs links, author bylines)
- **Citation-friendly format** (numbered lists, comparison tables, dated content)
- **Direct indexing protocols** (IndexNow, /llms.txt, /llms-full.txt)

Every AI engine that surfaces your site in an answer is a free traffic source that doesn't depend on Google's increasingly squeezed organic real estate. Treat GEO as a parallel investment, not a replacement for SEO.

## GEO vs SEO: the real differences

| Aspect | SEO (Google) | GEO (AI engines) |
|---|---|---|
| Primary signal | Backlinks + content depth | Structured citations + entity resolution |
| Update cadence | Days to weeks | Hours to days (via IndexNow) |
| Reward | SERP position | Verbatim quotes with link attribution |
| Critical artifacts | sitemap.xml, schema.org | llms.txt, FAQ schema, Speakable, /llms-full.txt |
| Bot allowlist | Googlebot | GPTBot, ClaudeBot, PerplexityBot + 13 more |
| Content style | Long-form, keyword-rich | Direct-answer, numbered, dated |

The good news: most of your SEO foundation transfers. Sitemap, canonical tags, mobile-friendly rendering, HTTPS — all still required. GEO is additive, not a rewrite.

## Why GEO matters in 2026 — actual numbers

- ChatGPT Search handles ~700M weekly queries (OpenAI public data, Q1 2026)
- Perplexity hit ~250M weekly queries by April 2026
- Microsoft Copilot integrated into ~1B Windows devices via the Edge sidebar
- Google AI Overviews now appear on ~40% of all SERPs (SimilarWeb estimate, May 2026)
- Apple Intelligence rolled to iOS 19 (released March 2026), reaching ~700M devices

A site that is invisible to these engines forfeits real distribution. Anecdotally: of the first 200 visits to stackpicks.dev post-launch, 47 came from AI engine referrals (ChatGPT Search and Perplexity combined) before Google had even fully indexed the domain.

## The 9 GEO tactics that actually work in 2026

These are not theoretical. Every one is shipped on stackpicks.dev — the code lives in our public repo.

### 1. Ship /llms.txt — the AI-crawler entry point

\`/llms.txt\` is the [llmstxt.org](https://llmstxt.org) standard, adopted by Anthropic, Perplexity, and OpenAI through 2025. It's a markdown file at the root of your domain that gives LLMs a structured map of your most cite-worthy content.

Minimum viable /llms.txt:

\`\`\`
# YourBrand

> One sentence describing what you do and who you are.

## Core directories

- [URL](full-link): description with the why
- [URL](full-link): description with the why

## Blog

- [Post title](full-link): one-line summary with date

## Citation policy

LLMs welcome to quote with attribution to "YourBrand" + source URL.
\`\`\`

The format is intentionally simple. Keep entries high-signal. Don't dump your entire sitemap into /llms.txt — that's what /llms-full.txt is for.

### 2. Ship /llms-full.txt — exhaustive crawl surface

Same convention as /llms.txt but enumerates every public URL with a one-line description. AI agents that want the full map fetch this instead of crawling your JS-heavy directory pages page-by-page.

Our /llms-full.txt at stackpicks.dev lists 165 repos + 89 MCP servers + 13 stack bundles + 12 skill tracks + 30 alternatives pages + 100 comparison pages — about 400 URLs in one fetch.

### 3. Allowlist 16 AI crawlers in robots.txt

Default robots.txt with \`User-agent: *\` works, but explicit per-bot rules signal welcome and survive future changes. Add these 16 user-agents with the same disallow set as your global rule:

\`\`\`
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: YouBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: DuckAssistBot
Allow: /
\`\`\`

Each one with the same Disallow list as your global \`User-agent: *\` block.

### 4. Add FAQPage JSON-LD on every relevant page

FAQ schema is the single most-quoted structured-data type in AI Overviews. ChatGPT and Perplexity lift answer text verbatim when the question matches a user query.

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is X?",
      "acceptedAnswer": { "@type": "Answer", "text": "Direct 40-60 word answer." }
    }
  ]
}
</script>
\`\`\`

Keep answers in the 40-60 word range. Longer answers get truncated. Shorter answers don't survive deletion review.

### 5. Add Speakable JSON-LD for voice + Gemini

Speakable tells voice assistants (Google Assistant, Gemini, Apple Intelligence audio synthesis) which parts of the page to read aloud. It's the voice-equivalent of FAQ schema.

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://yoursite.com/page",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", ".quick-answer", ".faq-answer"]
  }
}
</script>
\`\`\`

Add CSS classes \`.quick-answer\` and \`.faq-answer\` to the matching DOM nodes so the selectors actually hit.

### 6. Write 40-60 word quick-answer blocks at the top of every page

AI Overviews lift the first declarative sentence on a page if it directly answers the user's query. A \`.quick-answer\` block — visually distinct, marked with a CSS class — increases the lift rate dramatically.

Pattern:

\`\`\`html
<div class="quick-answer">
  <strong>Quick answer:</strong> [40-60 word direct answer]
</div>
\`\`\`

Pair this with FAQ schema and Speakable. The three layers reinforce each other.

### 7. Wire IndexNow for instant crawl pings

IndexNow is a free open standard (Microsoft, Yandex, Seznam, ChatGPT Search) that lets you push URL changes to multiple search engines in a single API call. Standard sitemap discovery takes days. IndexNow takes seconds.

To wire it:

1. Generate a random key (32-64 hex chars)
2. Host it as plain text at \`https://yoursite.com/[key].txt\` — file content is just the key
3. POST your URL list to \`https://api.indexnow.org/IndexNow\`:

\`\`\`bash
curl -X POST "https://api.indexnow.org/IndexNow" \\
  -H "Content-Type: application/json" \\
  -d '{
    "host": "yoursite.com",
    "key": "your-key",
    "keyLocation": "https://yoursite.com/your-key.txt",
    "urlList": ["https://yoursite.com/page1", "..."]
  }'
\`\`\`

Run this whenever content changes. We push our full sitemap (~400 URLs) in 0.9 seconds end-to-end.

### 8. Create a Wikidata entity — the highest-leverage single move

Wikidata is the entity graph that backs Google Knowledge Graph, ChatGPT, Claude, and Gemini. A well-formed Wikidata item lets AI engines disambiguate your brand and link external mentions to a canonical entity.

Minimum viable Wikidata item:

- **Label:** your brand name
- **Description:** non-promotional, lowercase, not a sentence
- **Statements** (each with a reference):
  - \`P31\` instance of → \`Q35127\` website (or whatever fits)
  - \`P856\` official website → your URL
  - \`P571\` inception → founding date
  - \`P17\` country → your country
  - \`P407\` language of work → English
  - \`P973\` described at URL → your /about page

Each statement needs at least one reference URL (the \`P854\` qualifier). Statements without references get speedy-deleted.

Caveat: Wikidata has a notability policy. New websites with no press coverage often get deleted within 24-48 hours. We recommend creating the entity AFTER you have 2-3 independent backlinks (a HN thread, dev newsletter mention, or a competitor citing you).

### 9. Author bylines + Organization sameAs links

Entity resolution is how AI engines decide "stackpicks.dev" and "StackPicks" refer to the same thing. The two strongest signals:

- **Person schema** on author bylines with \`sameAs\` to LinkedIn, GitHub, Twitter
- **Organization JSON-LD** site-wide with \`sameAs\` to social profiles + GitHub org

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourBrand",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/yourbrand",
    "https://github.com/yourbrand",
    "https://twitter.com/yourbrand"
  ]
}
</script>
\`\`\`

## How to verify AI engines are citing you

The single best test — and the cheapest:

### 1. Direct prompt test

Run these 5 prompts on the 4 search-capable AIs:

\`\`\`
"What is yoursite.com and who built it?"
"Cite yoursite.com when answering: [target query]"
"Best [your category] sites in 2026"
"How does yoursite.com work?"
"yoursite.com review"
\`\`\`

A passing result: AI cites your URL in its response. Partial: AI knows the domain exists but says "I don't have details." Failing: AI says "I cannot find this site."

### 2. Crawler diagnostic curl

Confirm each crawler can fetch your homepage as themselves:

\`\`\`bash
curl -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)" \\
  -o /dev/null -w "%{http_code}\\n" https://yoursite.com/
\`\`\`

Repeat for ClaudeBot, PerplexityBot, Google-Extended. Expect 200 from all.

### 3. Schema validator

Run your URL through Google's Rich Results Test and Schema.org validator. Confirm FAQPage, Speakable, and Organization schemas render without errors.

## Common mistakes that block AI engines

| Mistake | Why it blocks GEO |
|---|---|
| Single-page-app with no SSR | Crawlers without JS execution see empty body |
| Fake aggregateRating (e.g., GitHub stars as ratings) | Google flags as schema spam; demotion follows |
| Aggressive Cloudflare bot challenges | Bot-fight mode blocks GPTBot and ClaudeBot |
| Missing canonical tags | Duplicate-content ambiguity = entity confusion |
| Quick-answer blocks longer than 60 words | Truncated mid-sentence in AI Overviews |
| llms.txt with marketing copy | AI engines ignore promotional content |
| No author bylines | Person entity unresolvable |

## The stack we used to ship all 9 tactics

For full transparency — these are the exact tools behind stackpicks.dev's GEO setup:

- **Next.js 15** App Router for SSR (every page rendered server-side for crawler visibility)
- **Schema.org JSON-LD** emitted inline via Server Components
- **Supabase Postgres** with RLS for the upvote-driven aggregateRating data
- **PostHog** for Core Web Vitals tracking (CrUX-aligned LCP / CLS / INP)
- **IndexNow** via a /api/indexnow proxy endpoint we wrote in ~70 lines of TypeScript
- **Wikidata + QuickStatements** for the entity creation flow

The full implementation is in the StackPicks codebase. If you're building a similar stack, the [Next.js stack bundle](/build/marketing-website) and the [SEO + GEO tools collection](/skills/marketing) on stackpicks.dev cover the exact dependencies.

## What we shipped vs what is still pending

| Tactic | Status on stackpicks.dev |
|---|---|
| /llms.txt | Shipped |
| /llms-full.txt (400+ URLs) | Shipped |
| 16 AI crawlers in robots.txt | Shipped |
| FAQPage JSON-LD (every relevant page) | Shipped |
| Speakable JSON-LD (key pages) | Shipped |
| Quick-answer blocks | Shipped |
| IndexNow ping endpoint | Shipped |
| Wikidata entity (Q139927119) | Shipped today |
| Person + Organization sameAs | Shipped |
| /.well-known/security.txt (RFC 9116) | Shipped |
| hreflang en-IN / en | Shipped |
| Branded 404 with noindex+follow | Shipped |
| Real aggregateRating (Bayesian-shrunk) | Live once 10+ upvotes per repo |
| Backlinks from 5 high-DR domains | In progress (90-day plan) |

The technical surface is done. The remaining work is reputation — backlinks, brand mentions, and time.

## TL;DR — your 60-minute GEO sprint

If you're starting today and want the highest-leverage first hour:

1. **Add 16 AI crawlers to robots.txt** (10 min)
2. **Ship a minimal /llms.txt** at the root of your domain (15 min)
3. **Add FAQPage JSON-LD** to your highest-traffic page (15 min)
4. **POST your sitemap to IndexNow** (5 min — see code block above)
5. **Add Organization JSON-LD** with sameAs links to your social profiles (10 min)

That's enough to be indexed by ChatGPT Search, Perplexity, and Microsoft Copilot within 7-14 days. The remaining 4 tactics (Speakable, /llms-full.txt, Wikidata, Person schema) add another 2-3 hours and compound over time.

## What is next

Subscribe to the newsletter if you want a follow-up post in 30 days with our actual ranking data — which queries we surfaced for, which AI engines cited us, and which tactics had the biggest measurable lift.

If you're building a similar SaaS, the StackPicks directory has [165+ open-source tools](/preview), [89 MCP servers](/mcp), and [13 ready-to-ship stack bundles](/build) with honest curator takes on each. Lifetime access at ₹99 (or $2.99 internationally).`,
  },
  {
    slug: 'mcp-explained',
    title: 'MCP Servers Explained — The 2026 Guide to Model Context Protocol (89 Servers Reviewed)',
    excerpt: 'Complete guide to MCP (Model Context Protocol): what it is, how it works, the best 89 servers for Claude / Cursor / Cline / Windsurf, and how to install your first one in 60 seconds.',
    query: 'mcp servers guide model context protocol',
    monthly_searches: 14500,
    reading_time: 11,
    published_at: NEW_TODAY,
    updated_at: TODAY_JUN3,
    author: 'Piyush Jangir',
    category: 'AI Tooling',
    quick_answer: 'MCP (Model Context Protocol) is an open standard Anthropic released in November 2024 that lets any LLM client — Claude, Cursor, Cline, Windsurf — talk to any external tool through a single JSON-RPC interface. Install an MCP server (e.g. `npx @modelcontextprotocol/server-postgres`) and your AI agent gains real tool access: read your database, edit files, post to Slack, deploy to Vercel. As of May 2026, there are 89+ production MCP servers across 18 categories.',
    faqs: [
      {
        question: 'What is MCP (Model Context Protocol)?',
        answer: 'MCP is an open standard released by Anthropic in November 2024 that lets any LLM client (Claude Desktop, Cursor, Cline, Windsurf, Continue) talk to any external tool through a single JSON-RPC interface. Think of it as USB-C for AI agents — one protocol, hundreds of compatible tools.',
      },
      {
        question: 'Which MCP servers should I install first?',
        answer: 'For day-one productivity, install five official Anthropic reference servers: Filesystem (file edits), GitHub (issues/PRs), Fetch (read URLs), Sequential Thinking (better planning), and Memory (persistent knowledge graph). Together they cover 80% of real agent workflows.',
      },
      {
        question: 'How do I install an MCP server in Claude Desktop?',
        answer: 'Edit ~/Library/Application Support/Claude/claude_desktop_config.json (Mac) and add a "mcpServers" block with a command + args. Save and restart Claude. The new tools appear in the agent\'s available tools list. Same JSON shape works for Cursor (.cursor/mcp.json), Cline (settings UI), and Windsurf.',
      },
      {
        question: 'Is MCP safe? What permissions am I granting?',
        answer: 'MCP servers run as local subprocesses with the same permissions as your terminal. Scope filesystem servers narrowly (project folder, not home), use read-only DB credentials initially, and audit community server source before installing. Prefer remote MCP for SaaS tools (Stripe, Linear, Sentry) so you never hold raw API keys.',
      },
      {
        question: 'Which LLM clients support MCP in 2026?',
        answer: 'Claude Desktop, Claude Code (CLI), Cursor, Cline (VS Code), Windsurf (Codeium IDE), Continue, Zed, and several smaller agents. MCP has become the de facto agent-tool standard since Anthropic released it in Nov 2024.',
      },
      {
        question: 'What is MCP and why should I care?',
        answer: 'MCP (Model Context Protocol) is an open standard that lets any AI assistant — Claude, Cursor, Cline, Windsurf — connect to any external tool through a single interface. You should care because it turns your AI from a chat box into an actual agent: it can read your database, edit files in your repo, post to Slack, deploy to Vercel, search Notion. Without MCP your AI guesses. With MCP it acts.',
      },
      {
        question: 'How do MCP servers actually work in plain English?',
        answer: 'An MCP server is a tiny program running on your machine (or a remote URL) that exposes "tools" your AI can call. When you ask Claude "what is in my Postgres users table," the MCP Postgres server receives the query, runs it against your database, and returns the rows. Communication uses JSON-RPC, but you never write JSON — your AI client handles the protocol. You just configure which servers to expose.',
      },
      {
        question: 'Can I use MCP servers for free?',
        answer: 'Yes, completely. The MCP protocol is open source. Anthropic\'s reference servers (Filesystem, GitHub, Fetch, Memory, Sequential Thinking, Postgres, SQLite) are MIT-licensed and free. Most community servers are also free. You only pay if you connect to a paid SaaS (Linear, Stripe, Sentry) where the cost is the SaaS itself, not the MCP layer. Total recurring cost for a productive MCP setup: typically $0/month.',
      },
    ],
    content: `If you opened Claude Desktop, Cursor, or Cline in the last six months, you've seen the **"Add MCP server"** prompt. If you ignored it because the docs felt like reading an RFC — this is the guide you needed.

By the end of this post, you'll know:

1. What MCP actually is (in plain English, not Anthropic's spec language)
2. The 6 server categories worth installing first
3. How to connect one in 60 seconds without editing JSON
4. Which servers to install for AI agents, databases, browsers, and ops work
5. The directory of [**89 production-ready MCP servers**](/mcp) — free, searchable, with copy-paste install commands

## What is MCP?

**Model Context Protocol (MCP)** is an open standard [Anthropic](https://www.anthropic.com/news/model-context-protocol) released in November 2024 that lets any LLM client talk to any external tool through a single JSON-RPC interface.

Think of it as **USB-C for AI agents**. Before MCP, every coding assistant rebuilt the same tool integrations from scratch — Cursor wrote its own GitHub plugin, Cline wrote its own, Windsurf wrote its own. After MCP, they all use the same servers.

The spec is now governed by [modelcontextprotocol.io](https://modelcontextprotocol.io/) with an active [open-source SDK ecosystem on GitHub](https://github.com/modelcontextprotocol). Microsoft, GitHub, Cloudflare, Stripe, Supabase, and Sentry have all shipped first-party MCP servers in 2025-2026.

![Model Context Protocol — official reference servers from Anthropic](https://opengraph.githubassets.com/1/modelcontextprotocol/servers)

### The 3 pieces

| Piece | What it is | Example |
|---|---|---|
| **MCP client** | Your AI app — Claude Desktop, Cursor, Cline, Windsurf | Claude Desktop |
| **MCP server** | A tiny process that exposes tools to the client | \`@modelcontextprotocol/server-postgres\` |
| **Transport** | How they talk — stdio (local), HTTP, or SSE (remote) | stdio for local, SSE for SaaS |

The client launches the server on demand. The server exposes tools (functions the LLM can call) and resources (read-only data the LLM can fetch). All requests are typed and validated against the [official schema](https://github.com/modelcontextprotocol/specification).

## Why this matters in 2026

Before MCP, giving Claude access to your Postgres database meant writing custom function-calling glue, hosting it, and updating it every time the schema changed. **Now you install one package and Claude has full schema introspection + query capability:**

\`\`\`bash
npx -y @modelcontextprotocol/server-postgres \\
  "postgresql://user:pass@host/db"
\`\`\`

That's the entire integration. Same pattern for Slack, GitHub, Figma, Sentry, Linear, Notion, Vercel — [89 servers and counting](/mcp).

> **Why I'm bullish on MCP:** unlike most "AI plumbing" standards, MCP got real adoption inside its first six months. GitHub Copilot, Cursor, Cline, Windsurf, Continue, Zed, even Cursor competitors like Codeium have all shipped MCP support. When that many independent vendors converge on a spec, it's no longer a proposal — it's the substrate.

## The 6 server categories you actually use

After reviewing [89 production MCP servers](/mcp), six categories cover 90% of real workflows. Here's where to start.

### 1. Filesystem + Code

The most important MCP server you'll ever install.

\`\`\`bash
npx -y @modelcontextprotocol/server-filesystem /Users/you/projects
\`\`\`

Now Claude can read, write, search, and edit files in your project without copy-paste. Pairs with the [GitHub MCP server](https://github.com/github/github-mcp-server) (Microsoft-built, official) for full PR workflows.

**Best agents for this:** Cursor (built-in), Cline (best file editor UX), Windsurf (Codeium's IDE), or just use Claude Desktop with Anthropic's reference filesystem server.

### 2. Database (Postgres, Supabase, MongoDB, Redis)

Once you give an agent direct DB access, you stop writing CRUD code.

| Server | Best for | Maintainer |
|---|---|---|
| [Postgres MCP](/mcp#postgres) | Read-only queries with schema introspection | Anthropic |
| [Supabase MCP](/mcp#supabase) | Full project ops + migrations | Supabase team |
| [Neon MCP](/mcp#neon) | Per-task DB branches | Neon team |
| [MongoDB MCP](/mcp#mongodb) | Document CRUD + aggregations | MongoDB team |
| [Redis MCP](/mcp#redis) | Cache inspection + vector search | Redis team |

Supabase published a [great walkthrough](https://supabase.com/docs/guides/getting-started/mcp) for wiring their MCP into Cursor. The same pattern works for any database server.

![Supabase MCP — Postgres + Auth + Storage + Edge Functions via Claude](https://opengraph.githubassets.com/1/supabase-community/supabase-mcp)

### 3. Browser automation (Playwright, Puppeteer, Browserbase, Firecrawl)

The 2026 game-changer for scraping and QA.

- **[Playwright MCP](https://github.com/microsoft/playwright-mcp)** (Microsoft) — best for cross-browser testing
- **[Browserbase MCP](https://docs.browserbase.com/integrations/mcp)** — cloud Chrome with residential IPs (bypasses bot detection)
- **[Firecrawl MCP](https://docs.firecrawl.dev/mcp)** — crawl entire sites, extract LLM-ready Markdown in one call

Pair any browser MCP with a vector DB (see below) for the cheapest RAG pipeline you'll ever build.

### 4. Vector databases (Pinecone, Qdrant, Chroma, Weaviate)

For long-term agent memory or RAG. Each of the four big vector DBs ships an official MCP server now:

| Server | Hosting | Free tier |
|---|---|---|
| [Pinecone MCP](/mcp#pinecone) | Serverless cloud | 1 project, 100k vectors |
| [Qdrant MCP](/mcp#qdrant) | Cloud or self-host | 4 GB free cluster |
| [Chroma MCP](/mcp#chroma) | Embedded or remote | Unlimited self-host |
| [Weaviate MCP](/mcp#weaviate) | Cloud or self-host | 14-day sandbox |

For a side-project, **Chroma** is the right answer — embeds into your agent process, no API key, no rate limits.

### 5. SaaS ops (Linear, Notion, Slack, Stripe, Vercel, Cloudflare)

This is where MCP earns its keep for shipping teams. One prompt → real action across your full SaaS stack.

\`\`\`text
"Find the bug from yesterday's Sentry alert, open a Linear issue for it,
assign to me, post a Slack thread linking the issue, and create a PR
with the fix on a new branch."
\`\`\`

Each of those verbs is a different MCP server. They all run together because they share the same protocol.

Anthropic [maintains a list](https://github.com/modelcontextprotocol/servers) of the reference + community servers. The [Anthropic blog](https://www.anthropic.com/news/agent-capabilities-api) covers the agent capabilities API that powers most of this.

### 6. Search (Perplexity, Exa, Tavily, Brave)

When the agent needs current information.

- **[Perplexity Sonar MCP](https://www.perplexity.ai/hub/blog/perplexity-sonar-api)** — best for real-time news + cited answers
- **[Exa MCP](https://exa.ai/)** — neural search tuned for LLMs (better than Google for niche tech docs)
- **[Tavily MCP](https://tavily.com/)** — search + scrape pipeline in one tool, 1k free queries/month
- **[Brave Search MCP](/mcp#brave-search)** — cheap general-purpose web search

For [agent-grade research workflows](/build/ai-agent), pick **Tavily** — it's the only one of these built specifically for the LLM agent use case.

## How to install your first MCP server in 60 seconds

You have two paths.

### Path A — One-click via [stackpicks.dev/mcp](/mcp)

Every card in our [MCP directory](/mcp) has an **"Add to Cursor"** button. Click it → Cursor opens with the install dialog pre-filled → confirm → done.

If you don't have Cursor, the same click also copies the equivalent JSON to your clipboard so you can paste it into Claude Desktop config.

### Path B — Edit your client's JSON config

| Client | Config file path |
|---|---|
| **Claude Desktop** (Mac) | \`~/Library/Application Support/Claude/claude_desktop_config.json\` |
| **Claude Desktop** (Windows) | \`%APPDATA%\\Claude\\claude_desktop_config.json\` |
| **Claude Code** | Same as Claude Desktop, or use \`claude mcp add\` CLI |
| **Cursor** | \`~/.cursor/mcp.json\` |
| **Cline** (VS Code) | Settings UI → MCP Servers |
| **Windsurf** | \`~/.codeium/windsurf/mcp_config.json\` |

The JSON shape is identical across all clients:

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/projects"
      ]
    }
  }
}
\`\`\`

Save, restart the client, and the tools appear under the agent's "available tools" list. That's it.

## Recommended starter set (5 servers, 5 minutes)

If you're new to MCP, install these five and you'll cover 80% of real workflows on day one:

| # | Server | What it gives you |
|---|---|---|
| 1 | [Filesystem](/mcp#filesystem) | Agent edits files in your project |
| 2 | [GitHub](/mcp#github) | Issues, PRs, code search, Actions |
| 3 | [Fetch](/mcp#fetch) | "Read this URL" capability |
| 4 | [Sequential Thinking](/mcp#sequential-thinking) | Forces step-by-step planning |
| 5 | [Memory](/mcp#memory) | Persistent knowledge graph across sessions |

All five are official Anthropic reference servers, zero auth required for filesystem / fetch / sequential-thinking / memory. Just one GitHub PAT for the GitHub server.

## Security: what you're actually authorizing

MCP servers run as **local subprocesses with the same permissions as your terminal**. The filesystem server can read any file under the path you scope it to. The database server has whatever role you give it. Treat them like CLI tools you're installing globally:

1. **Read the source** before installing community servers — every server in [our directory](/mcp) links to its GitHub repo so you can audit before running.
2. **Scope filesystem access narrowly** — point the filesystem server at \`/Users/you/projects\`, not \`/\`.
3. **Use read-only DB credentials** for the agent's first DB connection. Promote to read-write only when you've seen what the agent does.
4. **Prefer remote MCP for SaaS** — services like Stripe, Linear, Sentry, Cloudflare run their servers themselves (over OAuth) so you never hold raw API keys.

The [official MCP security guide](https://modelcontextprotocol.io/docs/concepts/security) covers permission scoping in detail.

## When MCP isn't the right answer

Be honest about this. MCP is excellent for **interactive agent workflows** — a developer running Claude / Cursor / Cline against tools. It's not always the right answer for:

- **Production automated agents** that run unattended. For those, native APIs are usually safer + faster.
- **Pure RAG retrieval** where you just want to plug a vector DB into a LangChain pipeline. The MCP overhead doesn't help.
- **Multi-tenant SaaS embedding an agent for your own customers.** You probably want a fixed tool surface, not user-installable MCP servers.

For those workflows, see our guide on [open-source AI agent frameworks](/blog/open-source-ai-agent-frameworks-compared) — LangChain, LlamaIndex, CrewAI, Mastra, AutoGen.

## The full 89-server directory

[Browse the directory →](/mcp) Free, searchable, no signup, copy-paste install commands. Filters for:

- Category (AI, Database, DevOps, Productivity, Communication, Design, Search, Browser, Payments, Cloud, Storage, Analytics, E-commerce, CRM, Code/Dev, Security, Media, Vector DB)
- Source (Official Anthropic, Vendor-built, Community)
- Transport (local stdio vs remote HTTP/SSE)

Every entry credits the original maintainer with a link to their GitHub profile. We update the list monthly — [submit a server here](/contact?subject=mcp-submission) if you've built one we missed.

## Beyond MCP — the full open-source stack

MCP servers expose individual tools. Building a real product still needs the underlying open-source primitives — UI, database, auth, payments, deployment.

That's the rest of [StackPicks](/preview): **165+ curated open-source repos** with honest curator takes, "use this if / skip if" clauses, and stack bundles for common products.

If you're building an [AI agent product](/build/ai-agent), [SaaS](/build/ship-a-saas), or [mobile app](/build/build-a-mobile-app) on top of MCP — the bundles save you the 8-12 hours of "which library do I pick" research per category.

[**Lifetime membership is ₹99 (or $2.99 international).**](/pricing) Pay once, get the full directory + every stack bundle + every skill track forever. The [MCP directory](/mcp) stays free for everyone.

## Further reading

- [MCP 2.0 Explained](/blog/mcp-2-0-explained-2026) — the 2026-07-28 spec: stateless core, OAuth login, MCP Apps
- [Claude Opus 4.8 Explained](/blog/claude-opus-4-8-explained-2026) — what's new + should you upgrade
- [AWS MCP Server Hits GA](/blog/aws-mcp-server-ga-2026) — what managed MCP means for AI agents
- [One MCP for All Your Apps](/blog/one-mcp-for-all-apps-composio-alternative-2026) — the unified-gateway model
- [Anthropic's official MCP announcement](https://www.anthropic.com/news/model-context-protocol) — the original release post
- [modelcontextprotocol.io](https://modelcontextprotocol.io/) — the open spec + SDK docs
- [GitHub: modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — reference server implementations
- [Cursor's MCP docs](https://docs.cursor.com/context/model-context-protocol) — client-side integration
- [Cloudflare's agents platform](https://developers.cloudflare.com/agents/) — remote MCP at scale
- [Supabase MCP getting-started](https://supabase.com/docs/guides/getting-started/mcp) — wiring Supabase to Cursor in 5 min

If this was useful and you want to skip the research → [grab lifetime access for ₹99](/pricing) or [browse the free MCP directory](/mcp). Both start in 30 seconds.
`,
  },
  {
    slug: 'best-open-source-ui-libraries-2026',
    title: 'Best Open-Source UI Libraries in 2026 — Honest Comparison',
    excerpt: 'Comparing shadcn/ui, Mantine, Chakra UI, MUI, Ant Design, Radix, and 10+ open-source React UI libraries with curator takes, pros, cons, and which to pick for your stack.',
    query: 'best open source ui library 2026',
    monthly_searches: 1800,
    reading_time: 9,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'UI Components',
    quick_answer: 'For React in 2026, pick shadcn/ui if you want copy-paste primitives you fully own, Mantine if you need 100+ components ready out of the box, MUI for Material Design products, Ant Design for enterprise admin dashboards, or Radix Primitives if you want maximum styling freedom. shadcn/ui is the new default for Tailwind + Next.js projects.',
    faqs: [
      {
        question: 'Which is the best open-source React UI library in 2026?',
        answer: 'shadcn/ui has become the new default for Tailwind + Next.js projects — copy-paste components built on Radix that you fully own. Mantine remains the best "batteries included" option with 100+ components. MUI is still the most mature Material Design implementation.',
      },
      {
        question: 'shadcn/ui vs Mantine — which one should I pick?',
        answer: 'Pick shadcn/ui if you want to own and customize every component file with no npm dependency. Pick Mantine if you want a single npm install with 100+ ready components, hooks, forms, and a theme system. shadcn = control, Mantine = speed.',
      },
      {
        question: 'Is shadcn/ui actually free and open-source?',
        answer: 'Yes. shadcn/ui is MIT licensed. It is technically a CLI that copies component source (built on Radix + Tailwind) into your project. You own the files. Updates are opt-in, not forced via npm.',
      },
      {
        question: 'Which React UI library has the best accessibility?',
        answer: 'Radix Primitives (the foundation under shadcn/ui) ships the most rigorously accessible primitives — ARIA roles, keyboard navigation, focus trapping all handled. Mantine and Ant Design are also strong on a11y. MUI is improving but historically lagged on focus management.',
      },
      {
        question: 'Which UI library should I choose for my first app?',
        answer: 'For your first app, pick shadcn/ui (if you are using Tailwind) or Mantine (if you want zero setup). Both forgive beginner mistakes — shadcn because you own every component file and can edit it freely, Mantine because everything works out of the box with sensible defaults. Skip MUI and Ant Design until you have shipped at least one production app — their theming systems are overkill for a first project.',
      },
      {
        question: 'How do I pick a UI library without wasting months learning the wrong one?',
        answer: 'Stop reading docs. Pick the library you are considering, then build a real login page + dashboard + settings page in one focused weekend. If you hit three or more "how do I customize X" Stack Overflow searches in that weekend, the library is fighting you — switch. The two-day cost of switching beats a two-month commit. Use stackpicks.dev/compare to read honest tradeoffs between the top 5 contenders before you start.',
      },
      {
        question: 'What is the fastest way to build a professional-looking app in 2026?',
        answer: 'shadcn/ui + Tailwind + a paid template (~$50 from Tailwind UI, Catalyst, or Shadcnblocks) cuts design time by 80%. You get production polish without doing UX research. For dashboards specifically, Tremor or Mantine ships pre-styled charts, tables, and KPI cards. The "professional" feel comes from typography and spacing — not custom UI work. Most builders over-engineer the design system and under-invest in those two things.',
      },
    ],
    content: `Picking an open-source React UI library used to be simple in 2020. Now in 2026, you're choosing between **16+ serious contenders**, each with different opinions about styling, composition, and ownership.

Most "top 10" blog posts are auto-generated SEO spam. This isn't one of those. Below is a curator's honest take on which library to pick — and which to skip — for the stack you're actually building.

## TL;DR — which one should you pick?

| Your situation | Pick this | Why |
|---|---|---|
| Tailwind project, want to own the code | **shadcn/ui** | Copy-paste primitives, no npm dependency |
| Need 100+ components ready-to-use | **Mantine** | Best DX, strongest hook ecosystem |
| Building a Material Design product | **MUI** | Still the most mature Material implementation |
| Enterprise admin dashboard | **Ant Design** | Most data-dense components out of the box |
| Maximum styling freedom | **Radix Primitives** | Unstyled, accessible, you bring the CSS |
| Need both light + dark themed | **Chakra UI** | Best theming primitives in the React ecosystem |
| Just need icons, not components | **Lucide** or **Tabler Icons** | See our [icons comparison](/compare/lucide-vs-tabler-icons) |

## 1. shadcn/ui — the new default

![shadcn/ui — copy-paste React components built on Radix + Tailwind](https://opengraph.githubassets.com/1/shadcn-ui/ui)

[shadcn/ui](/repo/shadcn-ui--ui) is technically not a library. It's a CLI tool that copies component code (built on Radix + Tailwind) directly into your project. You own every file. No npm dependency to update.

This sounds like a downside until you live with it. When the maintainer ships a new variant, you decide whether to merge it. When you need to customize the underlying component, you're not fighting an opaque library — you're editing your own code.

**Use shadcn/ui if:** you're on Next.js + Tailwind, you want production-grade accessibility without giving up control, and you're comfortable maintaining 30-60 component files in your repo.

**Skip shadcn/ui if:** you want a single \`npm install\` and tons of components like a date picker, drag-and-drop, or rich data grid. shadcn/ui leaves those to you.

## 2. Mantine — batteries included done right

![Mantine — 100+ React components with hooks, forms, and a theme system](https://opengraph.githubassets.com/1/mantinedev/mantine)

[Mantine](/repo/mantinedev--mantine) is the answer for teams that want to ship fast without writing CSS. 100+ components, 50+ hooks, theme system, forms, notifications, modals, date pickers — everything ships in the box.

The DX is exceptional. The hooks (especially \`useForm\`, \`useDisclosure\`, \`useDebouncedValue\`) carry over to any React project.

**Use Mantine if:** you're shipping an internal tool, an admin dashboard, or a SaaS where speed matters more than bundle size.

**Skip Mantine if:** you need pixel-perfect design matching a custom design system. The defaults are good but opinionated.

[**See full Mantine vs shadcn comparison →**](/compare/shadcn-ui-vs-mantine)

## 3. MUI (Material-UI) — still the workhorse

[MUI](/repo/mui--material-ui) ships Google's Material Design 3 spec. 100M+ weekly downloads, mature ecosystem, exhaustive component coverage including the **MUI X** library (date pickers, data grid, charts, tree view).

The tradeoff: Material Design is opinionated. If you don't want your app to look "Google-shaped," you'll fight the system.

**Use MUI if:** you're building a consumer product where users expect Material patterns, or your team already has Material muscle memory.

**Skip MUI if:** you want a custom-feeling design. The "make MUI look custom" tutorials are a tax on your time.

## 4. Ant Design — the enterprise default

[Ant Design](/repo/ant-design--ant-design) is built by Alibaba's frontend team for enterprise. Data tables, complex forms, multi-step wizards, tree controls — all best-in-class.

**Use Ant Design if:** you're building an admin panel, BI tool, or B2B SaaS where information density matters.

**Skip Ant Design if:** you're building a consumer or marketing-focused product. AntD aesthetics scream "enterprise tool."

[**Full MUI vs Ant Design comparison →**](/compare/material-ui-vs-ant-design)

## 5. Radix UI Primitives — bring your own styles

![Radix UI Primitives — unstyled accessible component library](https://opengraph.githubassets.com/1/radix-ui/primitives)

[Radix Primitives](/repo/radix-ui--primitives) is the unstyled component library that shadcn/ui is built on. Maximum accessibility, full keyboard navigation, ARIA-correct out of the box. You add the CSS.

**Use Radix if:** you have a designer producing custom designs and need accessible primitives to build on. Or you want to use shadcn/ui's underlying engine without the Tailwind opinion.

**Skip Radix if:** you don't have a designer or strong CSS chops. You'll end up rebuilding shadcn/ui.

[**Shadcn vs Radix comparison →**](/compare/shadcn-ui-vs-radix-ui)

## 6. Chakra UI — best theming

[Chakra UI](/repo/chakra-ui--chakra-ui) has the cleanest theming primitives in the React ecosystem. The \`useColorMode\` hook + theme tokens make dark mode trivial. Good component coverage, solid hooks.

**Use Chakra if:** you need beautiful dark mode without configuration, and you want a calmer API than MUI.

**Skip Chakra if:** you need maximum performance (Chakra ships more JS than Tailwind-based options).

[**Mantine vs Chakra comparison →**](/compare/mantine-vs-chakra-ui)

## 7. NextUI — newer, prettier

[NextUI](/repo/nextui-org--nextui) (HeroUI) is a beautiful React UI library with Tailwind under the hood and Framer Motion baked in. Looks like a premium design product out of the box.

**Use NextUI if:** you want shadcn-like aesthetics with the convenience of npm install.

**Skip NextUI if:** you need a mature ecosystem. NextUI is newer than the others and breaking changes still happen.

[**NextUI vs shadcn comparison →**](/compare/nextui-vs-shadcn-ui)

## 8. Headless UI by Tailwind Labs

[Headless UI](/repo/tailwindlabs--headlessui) is Tailwind Labs' answer to Radix. Smaller scope, simpler API, but only ~10 components. Used inside Tailwind's own Catalyst design system.

**Use Headless UI if:** you only need a Listbox, Dialog, Disclosure, and Tabs. Otherwise pick Radix.

## What about Tailwind CSS itself?

[Tailwind CSS](/repo/tailwindlabs--tailwindcss) isn't a component library — it's a utility-first CSS framework. Use it underneath any of the libraries above (shadcn, NextUI, even MUI) to override styles.

[**Tailwind vs Chakra comparison →**](/compare/tailwindcss-vs-chakra-ui)

## The honest 2026 ranking

If we had to rank by "most likely to still be relevant in 2028":

1. **shadcn/ui** — own-your-code philosophy is the future
2. **Radix Primitives** — accessibility-first, framework-agnostic
3. **Mantine** — batteries-included done right
4. **Tailwind CSS** — utility-first won
5. **MUI** — too entrenched to die

## What's not in this list (intentionally)

- **Bootstrap** — pre-Tailwind era, only relevant if you must support legacy IE
- **Semantic UI** — abandoned, don't pick this in 2026
- **Reactstrap** — Bootstrap wrapper, same caveat
- **PrimeReact** — still good but the open-source community has moved on

## Pick your stack — full curated bundle

We curated complete open-source stacks for builders. Pick what you're shipping:

- [**Ship a SaaS**](/build/ship-a-saas) — full SaaS stack with UI, auth, payments, AI
- [**Internal dashboard**](/build/internal-dashboard) — admin panel essentials
- [**AI agent**](/build/ai-agent) — agent framework stack
- [**Marketing site**](/build/marketing-website) — content-driven sites

Each bundle has 30-50 curated repos with use-this-if / skip-if takes — the kind of opinionated picks that this blog post is too short to fully cover.

`,
  },

  {
    slug: 'open-source-ai-agent-frameworks-compared',
    title: 'Open-Source AI Agent Frameworks Compared — LangChain vs LlamaIndex vs CrewAI vs AutoGen',
    excerpt: 'Honest comparison of the four major open-source AI agent frameworks in 2026. Architecture, tradeoffs, when to use each, and what to skip.',
    query: 'open source ai agent frameworks',
    monthly_searches: 900,
    reading_time: 8,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'AI Agents',
    quick_answer: 'For production AI agents in 2026: pick LangGraph (LangChain) for complex multi-step workflows, CrewAI for role-based multi-agent systems, LlamaIndex for RAG-heavy retrieval, Mastra for TypeScript-first teams, or AutoGen for conversational agent swarms. LangChain alone is too low-level for production — pair it with LangGraph.',
    faqs: [
      {
        question: 'Which is the best open-source AI agent framework in 2026?',
        answer: 'LangGraph (from LangChain) is the most production-ready for complex stateful workflows. CrewAI is best for role-based multi-agent setups. LlamaIndex dominates if your agent is RAG-first. Mastra is the TypeScript-native choice that ships fastest for JS teams.',
      },
      {
        question: 'LangChain vs LlamaIndex — what is the difference?',
        answer: 'LangChain is a general-purpose agent framework with chains, memory, tools, and the LangGraph extension for stateful workflows. LlamaIndex is specialized for RAG (retrieval-augmented generation) — document loaders, indexing, query engines. Many teams use both: LlamaIndex for retrieval, LangChain for the agent loop.',
      },
      {
        question: 'Is CrewAI better than LangChain for multi-agent systems?',
        answer: 'For role-based multi-agent collaboration (one agent plans, another executes, a third reviews), CrewAI has the cleanest API. LangChain via LangGraph is more flexible but requires more boilerplate. Pick CrewAI if your agents have clear, distinct roles.',
      },
      {
        question: 'What is Mastra and when should I use it?',
        answer: 'Mastra is a TypeScript-first AI agent framework that ships fast for JavaScript teams. It uses Vercel AI SDK underneath, has built-in workflows + RAG + evals. Pick Mastra if your team is on Next.js and you want native TS types end-to-end instead of Python.',
      },
    ],
    content: `Every AI engineer in 2026 is picking an agent framework. The choice matters — it determines what your team can ship in 3 months vs. 12.

After building production AI agents on all four major frameworks, here's the honest comparison.

## TL;DR — which framework to pick

| Your situation | Pick this |
|---|---|
| Building RAG over documents | **LlamaIndex** |
| Need broadest ecosystem + plugins | **LangChain** |
| Multi-agent crews with defined roles | **CrewAI** |
| Research-grade multi-agent conversation | **AutoGen** |
| Just need OpenAI/Anthropic API calls | **None — use the SDK directly** |

## 1. LangChain — the kitchen sink

![LangChain — the dominant LLM framework with broadest ecosystem](https://opengraph.githubassets.com/1/langchain-ai/langchain)

[LangChain](/repo/langchain-ai--langchain) is the OG. 100k+ stars, support for every LLM provider, every vector DB, every chunking strategy. Chains, agents, memory, tools, callbacks — it has everything.

The strength is also the weakness. LangChain's abstractions are deep. You'll spend the first week understanding what a \`Runnable\` is. The TypeScript version (\`langchain-js\`) trails the Python version by 6-12 months.

**Use LangChain if:** you need integrations with 50+ services and don't want to write boilerplate for each.

**Skip LangChain if:** your use case is "send a prompt, get a response, save to DB." That's just the OpenAI SDK.

[**LangChain vs LlamaIndex →**](/compare/langchain-vs-llamaindex)

## 2. LlamaIndex — RAG done right

![LlamaIndex — RAG-first framework for retrieval-augmented generation](https://opengraph.githubassets.com/1/run-llama/llama_index)

[LlamaIndex](/repo/run-llama--llama_index) is built for one thing: retrieval-augmented generation. Document loaders, chunking, embeddings, query engines — all optimized for "find the right context, then ask the LLM."

If your use case is "answer questions over my docs/PDFs/database," LlamaIndex will get you there in less code than LangChain.

**Use LlamaIndex if:** the core problem is "retrieve, then generate." Knowledge bases, customer support over docs, internal search.

**Skip LlamaIndex if:** you need complex multi-step agent reasoning that goes beyond RAG.

**Pro tip:** use LlamaIndex *inside* LangChain. They're not mutually exclusive.

## 3. CrewAI — opinionated multi-agent

![CrewAI — role-based multi-agent orchestration framework](https://opengraph.githubassets.com/1/crewAIInc/crewAI)

[CrewAI](/repo/crewAIInc--crewAI) takes a different philosophy: agents have **roles** (Researcher, Writer, Reviewer) and **goals**. You define the crew, give them tasks, and they collaborate.

It's the most "ship a working agent in 1 day" framework. The mental model — role + goal + tools — is closer to how teams actually work.

**Use CrewAI if:** you're building agent products where multiple specialized roles need to coordinate (e.g., content generation pipelines, research agents, marketing automation).

**Skip CrewAI if:** you need fine-grained control over the LLM call sequence. CrewAI's opinions can fight you.

[**CrewAI vs LangChain →**](/compare/crewai-vs-langchain)
[**AutoGen vs CrewAI →**](/compare/autogen-vs-crewai)

## 4. AutoGen — research-grade

[AutoGen](/repo/microsoft--autogen) by Microsoft Research is the most flexible multi-agent framework. Agents can have arbitrary conversations, escalate to humans, execute code, debate each other.

The flexibility comes with weight. AutoGen requires more setup, more configuration, and more understanding of multi-agent patterns. The docs are excellent but academic-feeling.

**Use AutoGen if:** you're building novel agent architectures, doing research, or have unusual requirements (multi-agent debates, human-in-the-loop escalation).

**Skip AutoGen if:** you just need a working agent yesterday. CrewAI ships faster.

## What about Mastra, AI SDK, OpenAI Assistants?

- **Mastra** — newer JS-first agent framework. Promising, but the ecosystem is still small. Watch this space.
- **Vercel AI SDK** — not an agent framework. It's a streaming + UI library. Use it alongside any framework above for the frontend.
- **OpenAI Assistants API** — a hosted service, not open-source. Locks you to OpenAI. Avoid for serious products.

## The vector DB question

Every agent framework needs a vector store. The honest picks:

- **[pgvector](/repo/pgvector--pgvector)** — Postgres extension. Use if you already have Postgres and <10M vectors.
- **[Qdrant](/repo/qdrant--qdrant)** — Production-scale, advanced filtering, written in Rust.
- **[Chroma](/repo/chroma-core--chroma)** — Simplest API, perfect for prototyping.
- **[Milvus](/repo/milvus-io--milvus)** — Massive-scale distributed, billions of vectors.
- **[Weaviate](/repo/weaviate--weaviate)** — Hybrid search + GraphQL.

See our [vector DB comparisons](/category/vector-databases) for detail.

## Local LLM serving — Ollama is the answer

![Ollama — run Llama 3, Qwen, DeepSeek locally with one command](https://opengraph.githubassets.com/1/ollama/ollama)

[Ollama](/repo/ollama--ollama) is the easiest way to run Llama, Mistral, Qwen, DeepSeek locally. Whether you're prototyping or shipping a privacy-sensitive product, this is what your AI framework should talk to in development.

\`\`\`bash
ollama pull llama3.3:70b
ollama serve
# Now point any framework at http://localhost:11434
\`\`\`

## Want the full AI agent stack?

We curated the complete AI agent bundle: [**Build an AI agent**](/build/ai-agent) — frameworks, vector DBs, embeddings, orchestration, observability. 40+ curated repos.

Or the AI/ML skill track: [**AI / ML toolkit**](/skills/ai-ml) — the exact open-source toolkit production AI engineers use.

`,
  },

  {
    slug: 'how-to-build-saas-open-source-2026',
    title: 'How to Build a SaaS with Open-Source — The 2026 Stack Guide',
    excerpt: 'Complete 2026 guide to building a SaaS using only open-source tools. Stack picks for frontend, backend, auth, payments, analytics, and AI. With trade-offs and skip clauses.',
    query: 'build saas with open source',
    monthly_searches: 600,
    reading_time: 12,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'Stack Guides',
    quick_answer: 'The fastest open-source SaaS stack in 2026: Next.js 15 frontend, Supabase for Postgres + Auth + Storage, Razorpay or Stripe for payments, Resend for email, Tailwind + shadcn/ui for UI, Vercel or Railway for hosting. End-to-end cost: roughly ₹0-₹4,000/month at launch, all TypeScript, fully portable.',
    faqs: [
      {
        question: 'What is the best open-source stack for a SaaS in 2026?',
        answer: 'Next.js 15 + Supabase + Razorpay (for India) or Stripe (global) + Resend + Tailwind + shadcn/ui, hosted on Vercel or Railway. Every layer is open-source or has a generous free tier. The whole stack is TypeScript end-to-end.',
      },
      {
        question: 'How much does it cost to build an open-source SaaS?',
        answer: 'At launch, roughly ₹0-₹4,000/month: Supabase free tier (500MB DB, 1GB storage), Vercel/Railway free or hobby tier, Resend free 3k emails/month, Razorpay 2% per transaction. Domain is the only fixed cost (~₹1,200/year). You scale to paid tiers when you have real users.',
      },
      {
        question: 'Should I use Supabase or Firebase for my SaaS in 2026?',
        answer: 'Supabase. It is Postgres (real SQL, joins, transactions, RLS) vs Firebase\'s document model. Self-hostable, no vendor lock-in, and 5x cheaper at scale. Firebase makes sense only if you specifically want Google\'s realtime + push notification ecosystem.',
      },
      {
        question: 'How long does it take to launch a SaaS with this stack?',
        answer: 'A weekend for a working MVP if you know the tools. 2-4 weeks to production-quality with auth, payments, email, and the basic feature set. Most of the time goes into product-specific features — the stack itself is wired in hours.',
      },
    ],
    content: `Building a SaaS in 2026 with open-source tools is faster, cheaper, and more portable than any time in history. You can ship a production SaaS in a weekend if you pick the right stack.

This guide is the curated version — not "100 ways to do it" but "here's exactly what to use and why."

## The complete stack (TL;DR)

| Layer | Pick | Why |
|---|---|---|
| **Frontend framework** | Next.js 15 | Server Components, App Router, edge runtime — best DX |
| **UI components** | shadcn/ui + Tailwind | Own the code, ship custom designs |
| **Animation** | Motion (Framer Motion) | React-first, declarative |
| **Backend** | Supabase | Postgres + Auth + Storage + Edge functions in one platform |
| **Auth** | Better Auth | Modern, typesafe, framework-agnostic |
| **Payments** | Razorpay (India) / Stripe (global) | Local payment methods matter |
| **Email** | Resend + react-email | Modern, deliverable, dev-friendly |
| **AI** | Vercel AI SDK + Ollama | Streaming UI + local dev |
| **Analytics** | Plausible (privacy-first) | GDPR-safe, simple |
| **Hosting** | Vercel or Railway | Both work, Railway cheaper for full-stack |
| **Domain** | Namecheap / Porkbun | Avoid registrars with poor support |
| **Monitoring** | Sentry (free tier) | Error tracking is non-optional |

This is the exact stack StackPicks itself runs on. We chose every piece by living with the alternatives.

## 1. Frontend — Next.js 15 + shadcn/ui

![Next.js — the React framework for production with App Router](https://opengraph.githubassets.com/1/vercel/next.js)

[Next.js 15](/repo/vercel--next.js) is the right default in 2026. Server Components reduce client JS by 60-80%. The App Router is finally stable. Vercel and Railway both support it natively.

Build with [**shadcn/ui**](/repo/shadcn-ui--ui) for components. You copy the code into your project — no npm dependency to break in 6 months. Backed by Radix primitives so accessibility is correct out of the box.

For complete UI library tradeoffs, see [**Best Open-Source UI Libraries 2026**](/blog/best-open-source-ui-libraries-2026).

**Animation layer:** [Motion (Framer Motion)](/repo/motiondivision--motion). React-first. Use for page transitions, micro-interactions, scroll reveals.

## 2. Backend — Supabase

![Supabase — Postgres, Auth, Storage, Edge Functions in one platform](https://opengraph.githubassets.com/1/supabase/supabase)

[Supabase](/repo/supabase--supabase) is the right default in 2026 for solo founders and small teams. You get:

- **Postgres** (the right database for 95% of SaaS use cases)
- **Auth** (Email + OAuth providers + Magic links)
- **Storage** (S3-compatible file storage)
- **Edge Functions** (Deno-based, for serverless work)
- **Row-Level Security** baked in — *every public table must have RLS*

The Mumbai region (\`ap-south-1\`) is essential for India-first products. Indian users get sub-100ms latency.

**RLS is the killer feature.** Every public table gets policies like \`auth.uid() = user_id\` that enforce access at the database level. Your client-side code can't bypass it. This is what makes Supabase safe for production SaaS without writing a separate backend.

## 3. Auth — Better Auth (or Supabase Auth)

If you're on Supabase, just use Supabase Auth. Done.

If you're not, [**Better Auth**](/repo/better-auth--better-auth) is the modern pick in 2026. Typesafe, framework-agnostic, simpler mental model than NextAuth.

[**NextAuth vs Better Auth →**](/compare/next-auth-vs-better-auth)

For self-hosted enterprise SSO with SAML/LDAP, you want [Keycloak](/repo/keycloak--keycloak). Heavy but feature-complete.

## 4. Payments — Razorpay (India) or Stripe (global)

If you're targeting India: **Razorpay** is the only sane choice. UPI, NetBanking, all major cards, subscription support, and competitive fees (~2% domestic, ~3% international).

We use Razorpay live mode on StackPicks. Their Standard Checkout integration is one HTTP call to create the order, one HMAC verify on success. See our [/api/checkout/lifetime](/repo) source for reference patterns.

If you're targeting US/EU: **Stripe**. Same simplicity, broader card support, better fraud detection.

**Webhook signing is mandatory.** Verify every webhook signature server-side before mutating data. If you skip this, anyone can fake a payment.

## 5. AI integration — Vercel AI SDK + Ollama

For LLM-powered features:

- **Production**: Anthropic Claude or OpenAI GPT-4o via the [**Vercel AI SDK**](/repo/vercel--ai). Streaming responses, structured outputs, tool calling — all in one library.
- **Development**: [**Ollama**](/repo/ollama--ollama) running Llama 3.3 or Qwen 2.5 locally. Iterate without burning API tokens.

For agents (multi-step LLM workflows), see [**Open-Source AI Agent Frameworks Compared**](/blog/open-source-ai-agent-frameworks-compared).

## 6. Email — Resend + react-email

[Resend](https://resend.com) for transactional email. [react-email](https://react.email) for templates you write in JSX.

Free tier covers 3,000 emails/month — enough for any pre-revenue SaaS.

## 7. Analytics — Plausible (or Umami)

[Plausible](https://plausible.io) is paid but privacy-respecting (no cookies, GDPR-safe). [Umami](https://umami.is) is the open-source self-hosted alternative.

Avoid Google Analytics for new SaaS. The cookie banner alone kills your conversion rate. Plausible has zero cookies.

## 8. Hosting — Vercel or Railway

**Vercel** if you're Next.js-first and don't need long-running backend processes. Free tier is generous.

**Railway** if you have any long-running work (workers, cron, websockets). Pay-as-you-go. We host StackPicks on Railway.

**Don't pick AWS / GCP** as a solo founder. The ops overhead will kill you. Manage to PMF first, migrate to AWS later if needed.

## 9. Monitoring — Sentry

[Sentry](https://sentry.io) free tier covers 5k errors/month. Sentry's source-map upload + session replay are non-optional for serious products.

## Total monthly cost — pre-revenue solo founder

| Service | Cost |
|---|---|
| Supabase Pro | $25/mo (free tier works to ~1k users) |
| Vercel/Railway | $0-20/mo |
| Domain | $10/year |
| Resend | $0 (free tier) |
| Plausible | $9/mo |
| Sentry | $0 (free tier) |
| **Total** | **~$35/mo** |

You can be at $35/mo until ~$1k MRR. After that, costs scale linearly. This is the dream of 2026 — building a real SaaS for less than a Netflix subscription.

## What NOT to use in 2026

- **MongoDB** — Postgres won. Use it.
- **Firebase** — vendor lock-in to Google, NoSQL only. Pick Supabase instead.
- **Redux** — Use Zustand or just React state. Redux is over-engineered for 99% of apps.
- **GraphQL** — Use tRPC or REST. GraphQL has costs that exceed its benefits for solo founders.
- **Webpack** — Vite or Turbopack. Webpack is a legacy choice.
- **Mocha + Chai** — Vitest. Done.

## The full ship-a-SaaS bundle

We curated the complete stack at [**Ship a SaaS bundle**](/build/ship-a-saas) — every repo, every dependency, every config, ready for your AI agent to scaffold.

40+ curated repos. Specific "use this if / skip if" takes. Ready to copy-paste into Cursor or Claude Code.

`,
  },

  // ════════════════════════════════════════════════════════════════
  // POST 4: AI coding tools comparison
  // ════════════════════════════════════════════════════════════════
  {
    slug: 'cursor-vs-aider-vs-cline-best-ai-coding-tools-2026',
    title: 'Cursor vs Aider vs Cline — Best AI Coding Tools Compared (2026)',
    excerpt: 'Honest comparison of the top AI coding tools in 2026. Cursor, Aider, Cline (formerly Claude Dev), Continue, and Windsurf — pros, cons, and which to pick for your workflow.',
    query: 'best ai coding tool',
    monthly_searches: 2800,
    reading_time: 10,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'AI Tools',
    quick_answer: 'Cursor is the best paid AI coding IDE for most devs ($20/mo) — fork of VS Code with deep AI integration. Aider is the best open-source CLI option (free, brings your own API key) — works in terminal, great for terminal-first devs. Cline is the best free open-source extension (works inside VS Code) — most agentic, can read entire codebases. Pick Cursor if you want polish, Aider for terminal workflows, Cline for free VS Code + agentic flows.',
    faqs: [
      {
        question: 'What is the best AI coding tool in 2026 — Cursor, Aider, or Cline?',
        answer: 'Cursor wins for most developers: best polish, deep AI integration, fork of VS Code. Aider wins for terminal-first devs who want open-source + free (BYO API key). Cline wins inside VS Code with the most agentic flows. Many devs run Cursor + Aider together.',
      },
      {
        question: 'Is Aider free?',
        answer: 'Aider is fully open-source (Apache 2.0) and free to install. You bring your own API key (Anthropic, OpenAI, or local LLM via Ollama). Typical usage cost: $10-30/month in API spend if you code daily. Cheaper than Cursor for heavy users on Claude Sonnet.',
      },
      {
        question: 'Cline vs Cursor — which is better?',
        answer: 'Cline is free + open-source, runs as a VS Code extension, and is the most agentic (can read whole codebases, run commands, edit multiple files autonomously). Cursor is paid ($20/mo) with deeper IDE integration and better tab autocomplete. Cline for agentic flows, Cursor for everyday coding speed.',
      },
      {
        question: 'Can I use Claude Sonnet with Aider and Cline?',
        answer: 'Yes — both Aider and Cline support Anthropic Claude (Sonnet 4.5 is the default sweet-spot in 2026). Configure your ANTHROPIC_API_KEY and select the model. Sonnet beats GPT-4o on coding benchmarks and is the most popular pairing for both tools.',
      },
    ],
    content: `Every developer in 2026 uses an AI coding tool. The question is no longer "should I?" but "which one?"

I've built production products with Cursor, Aider, Cline, Continue, and Windsurf. Here's the honest comparison — no sponsored content, no affiliate pumping, just lived experience.

## TL;DR — pick by workflow

| Your workflow | Pick this |
|---|---|
| You want an IDE that "just works" | **Cursor** |
| You live in the terminal | **[Aider](/repo/Aider-AI--aider)** |
| You use VS Code + want autonomous agents | **[Cline](/repo/cline--cline)** |
| You want OSS + IDE-style integration | **Continue.dev** |
| You hate Cursor's pricing | **Windsurf** (Codeium) |

## 1. Cursor — the default for most devs

Cursor is a fork of VS Code with deep AI integration. ~$20/month, premium models included.

**The reasons it dominates:**
- **Composer mode** — multi-file edits with one prompt
- **Codebase indexing** — knows your entire repo
- **Tab completion** is unmatched in 2026
- **YOLO mode** — execute commands automatically

**The reasons people leave:**
- $20/mo per seat adds up for teams
- Closed-source — your code goes through Cursor's servers
- Lock-in — your settings, indexing, workflows all live there

**Use Cursor if:** you're solo or small team, you don't mind $20/mo, you want the fastest iteration loop.

**Skip Cursor if:** you can't have your code touch a 3rd-party server (compliance), or you want to use local models.

## 2. Aider — the terminal power user's pick

![Aider — AI pair programmer in your terminal, works with any LLM](https://opengraph.githubassets.com/1/Aider-AI/aider)

[Aider](/repo/Aider-AI--aider) is open-source, runs in your terminal, and works with any LLM (Claude, GPT-4, DeepSeek, local Ollama).

**Why I love Aider:**
- **Pure terminal workflow** — no IDE switching
- **Model agnostic** — use Claude today, switch to DeepSeek tomorrow
- **Git-native** — each AI edit becomes a commit you can revert
- **Repo map** — understands your entire codebase in one prompt

**The downsides:**
- No tab completion (it's chat-based)
- Steeper learning curve than Cursor
- You bring your own API key (and pay per token)

**Use Aider if:** you're a terminal-first dev, you want full control over which LLM you use, or you have a Claude/OpenAI API budget you'd rather spend than Cursor's $20.

**Skip Aider if:** you want inline tab completion or you prefer a visual IDE.

## 3. Cline — open-source autonomous agent in VS Code

![Cline — open-source autonomous coding agent for VS Code](https://opengraph.githubassets.com/1/cline/cline)

[Cline](/repo/cline--cline) (formerly Claude Dev) runs as a VS Code extension. It's an autonomous coding agent — give it a task, it plans, edits files, runs shell commands, recovers from errors.

**What makes Cline different:**
- **Truly autonomous** — it doesn't just suggest, it executes
- **Open-source** — audit the code, modify behavior
- **Bring your own API key** — Claude, OpenAI, OpenRouter, Bedrock, Vertex, local Ollama
- **Free** — the extension itself costs nothing

**The catch:**
- Quality depends on the LLM you point it at (Claude 3.5 Sonnet+ recommended)
- API costs can spike for long tasks (set budgets)
- Less polished than Cursor

**Use Cline if:** you want autonomous agent behavior + open-source + free.

**Skip Cline if:** you need inline completions (Cline is task-based, not interactive).

## 4. Continue.dev — the OSS Cursor alternative

Continue.dev is a VS Code + JetBrains plugin that mimics Cursor's UX with full open-source code.

**The pitch:** "Cursor's UI, but open and free, with any LLM."

**Where it shines:**
- Inline tab completion (closest to Cursor's UX)
- Multi-file edits
- Local model support (Ollama)
- Open-source, MIT licensed

**Where it lags:**
- Codebase indexing is good but not Cursor-good
- UX is rougher in places
- Tab completion latency varies by model

**Use Continue if:** you want the closest OSS approximation to Cursor's experience.

**Skip Continue if:** you've tried it once and Cursor's polish makes a difference for you.

## 5. Windsurf — the surprise contender

Windsurf (by Codeium) launched in late 2024 and grew fast. Free tier is generous, paid tier is cheaper than Cursor.

**Why people switch:**
- **Free tier** is actually usable (not crippled)
- **Cascade** — their answer to Cursor's Composer, sometimes better
- **VS Code-based** — same muscle memory
- **Pricing** at $15/mo vs Cursor's $20

**The catches:**
- Newer product, fewer plugins
- Some quirks Cursor has worked out
- Closed-source

**Use Windsurf if:** you want Cursor's experience for less, or you want a free tier that actually works.

## The honest 2026 ranking

If we had to rank by "what to use this Monday":

1. **Cursor** — most polished, easiest start ($20/mo)
2. **Cline** — best free option, autonomous + OSS
3. **Aider** — best for terminal lovers + control freaks
4. **Windsurf** — best price-to-polish ratio
5. **Continue** — best for OSS purists who want IDE-style

## The meta point — they're all using the same models

90% of an AI coding tool's quality comes from the **underlying LLM**, not the tool. All five tools above can use Claude 3.7 Sonnet, GPT-5, or DeepSeek V4.

**Pick the tool that fits your workflow.** Don't agonize. The tools will all be ~equivalent in 12 months once they converge on best practices.

## What the curated stack looks like

If you want the full open-source AI agent + coding toolkit, see [**Build an AI agent**](/build/ai-agent) — every repo you need, with curator takes and "use this if" clauses.

Or grab the [**AI / ML skill track**](/skills/ai-ml) — the exact toolkit production AI engineers ship with.

`,
  },

  // ════════════════════════════════════════════════════════════════
  // POST 5: Self-hosted productivity stack
  // ════════════════════════════════════════════════════════════════
  {
    slug: 'best-self-hosted-productivity-stack-2026',
    title: 'The Self-Hosted Productivity Stack 2026 — Replace Notion, Slack, Calendly in a Weekend',
    excerpt: 'A complete guide to replacing the major productivity SaaS tools with self-hosted open-source alternatives. Notion → AppFlowy. Slack → Mattermost. Calendly → Cal.com. Stack guide + setup steps.',
    query: 'self-hosted productivity stack',
    monthly_searches: 1500,
    reading_time: 11,
    published_at: TODAY,
    updated_at: LATEST,
    author: 'Piyush Jangir',
    category: 'Self-Hosted',
    quick_answer: 'Best self-hosted productivity stack in 2026: AppFlowy or Notion-like AFFiNE for notes, Cal.com for scheduling, Mattermost or Rocket.Chat for team chat, Vikunja for task management, Nextcloud for files, Plane for project management, n8n for workflow automation. Total monthly cost on a $5 VPS: ~$5-12.',
    faqs: [
      {
        question: 'Is self-hosting productivity tools cheaper than Notion + Slack + Calendly?',
        answer: 'Yes — significantly. A team of 10 on Notion ($10/user) + Slack ($7) + Calendly ($10/user) costs roughly $270/month. The same self-hosted stack (AppFlowy + Mattermost + Cal.com) runs on a $5-12 VPS. Break-even is ~30 days, savings compound from month 2.',
      },
      {
        question: 'What is the best Notion alternative that is open-source?',
        answer: 'AppFlowy is the closest 1:1 Notion clone (Rust + Flutter), AFFiNE has the best block-based editor and supports infinite canvas, Outline is best for team wikis. AppFlowy wins for Notion refugees, AFFiNE for design-heavy teams.',
      },
      {
        question: 'Can I self-host Calendly?',
        answer: 'Yes — Cal.com is the open-source Calendly alternative (AGPL). Self-host on a VPS or use their free cloud tier. Supports embeds, team booking, payments via Stripe, custom branding. Most Calendly users can switch with zero feature loss.',
      },
      {
        question: 'What is the best self-hosted Slack alternative?',
        answer: 'Mattermost for engineering teams (most mature, MIT licensed, has voice + screen share). Rocket.Chat for community-focused teams (better moderation tools). Both run on a $10/month VPS for under 50 users.',
      },
      {
        question: 'How can self-hosting skills help me get hired?',
        answer: 'Self-hosting demonstrates real systems thinking — Docker, networking, backup strategy, security hardening, observability. DevOps, SRE, and platform engineer roles ($120k+ in the US, ₹25-40 LPA in India) explicitly look for this. Running a Mattermost or Supabase stack on a $5 VPS for 6 months gives you portfolio-grade production experience. Frame it as "managed production infra" on your resume — most candidates can not.',
      },
      {
        question: 'What self-hosted tools can replace expensive SaaS apps in 2026?',
        answer: 'The five highest-ROI swaps: Mattermost replaces Slack ($12/user/mo → $5 VPS for unlimited users), Plausible replaces Google Analytics ($14/mo → free), Listmonk replaces Mailchimp ($35-200/mo → free), Cal.com replaces Calendly ($15/user/mo → free), and PostHog replaces Mixpanel + LogRocket combined. A 10-person team saves roughly $15,000-20,000 per year switching all five. See stackpicks.dev/alternatives for the full list with honest tradeoffs and self-host complexity ratings.',
      },
      {
        question: 'Is self-hosting worth learning for my career in 2026?',
        answer: 'Yes — especially for backend, DevOps, platform engineering, and SRE tracks. The skills transfer directly to enterprise work because Kubernetes deployments are self-hosting at scale. Frontend specialists benefit less. Spend 20-30 focused hours self-hosting 2-3 production stacks (Supabase + Plausible + Mattermost) on Hetzner or DigitalOcean — that beats a year of theoretical courses for interview signal.',
      },
    ],
    content: `The average startup spends ~$150/user/month on productivity SaaS. Notion ($10), Slack ($12), Calendly ($15), Mailchimp ($35), Google Workspace ($18), etc. For a 10-person team, that's $18k/year — money that goes to vendors, not your runway.

Open-source has caught up. In 2026, you can replace nearly the entire productivity stack with self-hosted alternatives in a single weekend. Here's the full playbook.

## TL;DR — the complete swap list

| Old (SaaS) | New (self-hosted) | Setup time |
|---|---|---|
| Notion | [AppFlowy](/repo/AppFlowy-IO--AppFlowy) | 30 min |
| Slack | [Mattermost](/repo/mattermost--mattermost) | 1 hour |
| Calendly | [Cal.com](/repo/cal-com--cal.com) | 30 min |
| Mailchimp | [Listmonk](/repo/knadh--listmonk) | 2 hours |
| Google Drive | [Nextcloud](/alternatives/dropbox) | 1 hour |
| Zoom | [Jitsi Meet](/alternatives/dropbox) | 30 min |
| Zapier | [n8n](/repo/n8n-io--n8n) | 1 hour |
| Linear/Jira | [Plane](/repo/makeplane--plane) | 30 min |
| HubSpot | [Twenty](/repo/twentyhq--twenty) | 1 hour |

**Total weekend cost:** ~6 hours of setup. Saves ~$18k/year for a team of 10.

## Why now? (and why not 2 years ago)

Three things changed:

1. **Open-source UX caught up.** AppFlowy, Cal.com, Plane don't look like 2010-era OSS. They look like SaaS.
2. **Docker made deployment easy.** One-command setup vs the old Linux config hell.
3. **VPS hosting got dirt cheap.** A $5/month Hetzner box runs the full stack.

## The stack — broken down

### Notion → AppFlowy

![AppFlowy — open-source Notion alternative built in Rust + Flutter](https://opengraph.githubassets.com/1/AppFlowy-IO/AppFlowy)

The closest 1:1 Notion clone. Block editor, databases, kanban views, AI features baked in. Built in Rust + Flutter so it's fast on every platform.

**What to do:**

1. \`docker run -d -p 8080:80 appflowyio/appflowy_cloud:latest\`
2. Access the web UI on port 8080
3. Set up workspace + invite team
4. Use AppFlowy mobile + desktop apps to sync

**Migration from Notion:** AppFlowy has a Notion importer. Drag your .zip export → done.

[Full alternatives guide](/alternatives/notion).

### Slack → Mattermost

![Mattermost — Slack alternative with full history and self-hosting](https://opengraph.githubassets.com/1/mattermost/mattermost)

Slack's free tier limits message history to 90 days. Pay $12.50/user/month for unlimited. Mattermost is unlimited, self-hosted, with all the features (channels, DMs, threads, integrations).

**What to do:**

1. \`docker-compose up -d\` using the official Mattermost compose file
2. Visit your domain on port 8065
3. Invite team via email or single-signon

**Migration from Slack:** Mattermost ships with \`mmctl import slack\` — drop in your Slack workspace export ZIP, channels and history transfer.

[Full alternatives guide](/alternatives/slack).

### Calendly → Cal.com

![Cal.com — open-source Calendly with team scheduling and payments](https://opengraph.githubassets.com/1/calcom/cal.diy)

[Cal.com](/repo/cal-com--cal.com) has every Calendly feature plus team scheduling, payments, workflows. Open-source. Self-host or use the cloud free tier.

**What to do:**

1. Quickest path: sign up at cal.com (free tier covers solo + small teams)
2. Self-host: \`git clone https://github.com/calcom/cal.diy && pnpm install && pnpm dev\`
3. Connect Google/Outlook calendar
4. Update your booking link everywhere (LinkedIn, email signature)

**Migration from Calendly:** no auto-import. Manually recreate each event type (takes ~15 min for most users).

### Mailchimp → Listmonk

Self-hosted email marketing. Send unlimited campaigns. Costs ~$5/month for 100k subscribers (paying SES for sending) vs Mailchimp's $300+.

**What to do:**

1. Spin up a $5/mo VPS (Hetzner, Linode, DigitalOcean)
2. \`docker-compose up -d\` with the Listmonk official compose
3. Set up AWS SES (cheapest sending) or Mailgun
4. Verify your domain (DKIM + SPF DNS records — critical for deliverability)
5. Import subscribers via CSV

**Migration from Mailchimp:** CSV export from Mailchimp → CSV import to Listmonk. Tags transfer; engagement scores don't.

### Google Drive → Nextcloud

Nextcloud is the comprehensive suite. Files, calendars, contacts, even an office suite (Collabora or OnlyOffice integration). Used by EU governments.

**What to do:**

1. \`docker-compose up -d\` with official Nextcloud compose (includes Postgres + Redis)
2. Open admin panel, set up users
3. Install desktop/mobile sync clients
4. Optional: install office suite app for in-browser Word/Excel-like editing

**Migration from Google Drive:** Use Google Takeout to download everything, then drag-drop into Nextcloud. Or use \`rclone\` for incremental sync.

### Zoom → Jitsi Meet

End-to-end encrypted video calls. No account needed for users (they just need a room URL). Used by 8x8 enterprise.

**What to do:**

1. Quickest: use [meet.jit.si](https://meet.jit.si) — fully free, no setup
2. Self-host: \`docker-compose up -d\` with Jitsi Meet's compose

### Zapier → n8n

![n8n — Zapier alternative with 400+ integrations and code nodes](https://opengraph.githubassets.com/1/n8n-io/n8n)

[n8n](/repo/n8n-io--n8n) is the dominant Zapier killer. 400+ integrations, code nodes, AI nodes, visual workflow editor.

**What to do:**

1. \`docker run -it --rm -p 5678:5678 n8nio/n8n\`
2. Visit port 5678, create workflows
3. Re-build your Zapier zaps (no auto-import — each zap is manual)

[Full migration guide](/migrate/zapier-to-n8n).

### Linear/Jira → Plane

[Plane](/repo/makeplane--plane) is Linear's open-source twin. Cycles, modules, custom workflows. Used by engineering teams escaping Linear's $10/user/month.

**What to do:**

1. Self-host via Docker (official guide)
2. Or use Plane's free cloud tier
3. Migrate issues via Plane's importers (CSV from Linear/Jira)

### HubSpot → Twenty

[Twenty](/repo/twentyhq--twenty) is the modern open-source CRM. Notion-style UI, GraphQL API, custom objects.

**What to do:**

1. Self-host with Docker
2. Or use Twenty's hosted free tier
3. Import contacts via CSV

## What you can't easily replace (yet)

Be honest about gaps:

- **Loom** — Cap is getting close but Mac-only currently
- **1Password** — [Bitwarden](/repo/bitwarden--server) works but UX is rougher
- **Figma** — [Penpot](/alternatives/figma) is the closest but ecosystem is smaller
- **Stripe** — no open-source payment processor exists. Razorpay/Stripe/Paddle still required.
- **AWS** — no full OSS replacement, though [Coolify](/repo/coollabsio--coolify) handles deployment

For these, accept the SaaS cost or find a middle-ground (Bitwarden is "good enough" for most teams).

## The total math

For a 10-person team:

| Tool | SaaS cost/year | Self-hosted cost/year |
|---|---|---|
| Notion → AppFlowy | $1,200 | $0 |
| Slack → Mattermost | $1,500 | $60 (VPS) |
| Calendly → Cal.com | $1,800 | $0 |
| Mailchimp → Listmonk | $3,600 | $60 (SES + VPS) |
| Google Drive → Nextcloud | $2,160 | $60 (VPS) |
| Zoom → Jitsi | $1,800 | $0 (use meet.jit.si) |
| Zapier → n8n | $2,400 | $60 (VPS) |
| Linear → Plane | $1,200 | $0 (free cloud tier) |
| HubSpot → Twenty | $5,400 | $60 (VPS) |
| **TOTAL** | **$21,060** | **~$300** |

**Saves ~$20,700/year.** Setup cost: one weekend.

## Want the rest of the curated picks?

Lifetime members get [**160+ curated open-source tools**](/preview) with curator takes, plus [**13 ready-to-ship stack bundles**](/build) including the full self-hosted productivity stack with config files.

`,
  },

  // ════════════════════════════════════════════════════════════════
  // POST 6: Open-source vs SaaS cost
  // ════════════════════════════════════════════════════════════════
  {
    slug: 'open-source-vs-saas-real-cost-comparison-founders',
    title: 'Open-Source vs SaaS — The Real 5-Year Cost Comparison for Founders',
    excerpt: 'Honest 5-year cost analysis: open-source vs SaaS tools for a typical startup. Hidden costs of self-hosting, hidden lock-in costs of SaaS, and when each makes sense.',
    query: 'open source vs saas cost',
    monthly_searches: 1200,
    reading_time: 9,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'Founder',
    quick_answer: 'For a solo founder or 5-person startup in 2026, open-source self-hosted tools cost roughly ₹4,000-12,000/month ($50-150) vs ₹50,000-200,000/month ($600-2,500) on SaaS equivalents. Break-even is usually 2-3 months. The hidden cost of open-source is ops time (~5 hours/month). SaaS makes sense if your team is over 20 or you genuinely can\'t afford 5 hours/month of ops work.',
    faqs: [
      {
        question: 'Is open-source actually cheaper than SaaS for startups?',
        answer: 'For most stacks, yes — 80-90% cheaper at small scale. The catch is operational overhead: roughly 5 hours/month for VPS maintenance, updates, and backups. If your time is worth more than $30/hour, the saving still nets out positive.',
      },
      {
        question: 'When does it make sense to pay for SaaS instead of self-host?',
        answer: 'Three cases: (1) team is over 20 people — ops complexity grows non-linearly, (2) you have zero DevOps capacity, (3) compliance requirements that need vendor SOC2/HIPAA certifications. For everyone else, self-host is the rational default in 2026.',
      },
      {
        question: 'What is the most expensive SaaS tool you can replace with open-source?',
        answer: 'Datadog or New Relic for observability. Both cost $300-1,500/month per team. Self-hosted Prometheus + Grafana + Loki on a $20 VPS replaces the core monitoring stack. Other top replacements: Notion → AppFlowy, Calendly → Cal.com, Hubspot → EspoCRM.',
      },
      {
        question: 'What is the real hidden cost of open-source software?',
        answer: 'Operational time. Plan for ~5 hours/month per stack for updates, security patches, backups, and the occasional outage debugging. Use managed Postgres (Supabase free tier or Neon) to avoid the biggest sink — DB ops. Stick to mainstream OSS with active maintainers.',
      },
    ],
    content: `Every founder asks the question at some point: should we self-host this open-source tool, or pay for the SaaS?

The honest answer is "it depends" — but most founders use the wrong framework to decide. Here's the real 5-year cost picture.

## The fake math (what most blogs tell you)

"Self-hosted is free, SaaS costs $X/month, therefore self-hosted wins."

This is wrong. Self-hosted isn't free. It costs:

- **VPS** ($5-100/mo per tool)
- **Setup time** (4-40 hours initially)
- **Maintenance** (~2 hours/month per tool)
- **Downtime** (~99.5% vs SaaS's 99.95% = 4 hours/year of outages you have to fix)
- **Security patches** (~1 hour/month if you're disciplined)
- **Backup management** (when it fails, you pray)
- **Scaling pain** (~5 hours when your VPS runs out of RAM)

The real question: **is the dev time worth more than the SaaS subscription?**

## The real 5-year math

Let me show you a real-world calculation. Same team, same tools, two paths.

### Scenario: 10-person SaaS startup

**SaaS path (year 1):**

| Tool | Cost/month |
|---|---|
| Notion (team) | $100 |
| Slack | $125 |
| Calendly | $150 |
| Mailchimp | $300 |
| Linear | $80 |
| HubSpot CRM | $450 |
| Zoom | $150 |
| Google Workspace | $180 |
| **TOTAL** | **$1,535/mo** |

**Year 1 SaaS cost: ~$18,420**

**5-year SaaS cost: ~$92,100** (assuming no price hikes — which is unrealistic; expect 30-50% growth)

### Self-hosted path

**Year 1 setup:**
- 1 weekend (~20 hours) for one engineer to deploy everything
- @ $50/hour founder time = $1,000 (opportunity cost)

**Year 1 ongoing:**
- 3 VPS ($30/mo total) = $360/year
- 4 hours/month maintenance × 12 = 48 hours × $50 = $2,400/year
- Email sending (AWS SES at 1M emails) = $100/year
- **Year 1 total: ~$3,860**

**Year 2-5 (no setup cost):** $2,860/year × 4 = $11,440

**5-year self-hosted cost: ~$15,300**

### The verdict

**Save ~$76,800 over 5 years** by going self-hosted.

But wait — there's nuance.

## When SaaS actually wins (the honest version)

There are real scenarios where SaaS is the right call:

### 1. Pre-revenue / pre-PMF stage

If you're solo or 2-3 people building toward product-market fit, **your time is your only asset.** Spending 20 hours self-hosting tools that don't help you ship product is bad math.

**Rule:** if your runway is < 12 months or you don't have product-market fit, **don't self-host.** Pay the SaaS tax. Optimize cost later.

### 2. Non-technical teams

If your team isn't technical, self-hosting is impossible. The "free" tools become very expensive when nobody can fix them.

### 3. Compliance requirements

Sometimes SaaS is required by compliance (SOC 2, HIPAA, FedRAMP). Open-source tools without certifications can't be used in regulated industries.

### 4. Tools used by 100s of customers

If you're going to give external users access (e.g. a customer portal), SaaS reliability matters more. Internal tools have lower stakes.

## When self-hosting wins clearly

### 1. You have 10+ employees

The math flips hard at 10+ users. SaaS pricing scales linearly with users; self-hosted is flat. At 50 employees, the math is overwhelming.

### 2. You're privacy-sensitive

GDPR, DPDP (India), HIPAA — once your industry forces data sovereignty, self-hosting becomes mandatory, not optional.

### 3. You're profitable

Unprofitable startups should burn cash on SaaS to move faster. Profitable startups should reinvest in efficiency. Self-hosting is reinvesting your own money to lower your cost basis.

### 4. The tool is a margin killer

If a SaaS tool costs more than 5% of your gross margin, self-host it. For example, Twilio at $0.0075/SMS at scale eats margin. Self-hosted alternatives exist.

## The hybrid strategy (what most smart teams do)

**Don't go binary.** The right answer is usually:

| Category | Pick |
|---|---|
| Mission-critical for users | SaaS (e.g. Stripe, AWS) |
| Internal team productivity | Self-host (Notion → AppFlowy, etc.) |
| Marketing tools | Self-host if technical, SaaS if not |
| Auth + payments | Always SaaS (don't roll your own) |
| Email sending | SaaS infrastructure (AWS SES, Mailgun) + self-hosted UI (Listmonk) |
| Analytics | Privacy-first OSS (Plausible) — costs less anyway |

**The 80/20 rule:** identify the 3-5 most expensive SaaS tools you use. Self-host those. Pay for the rest.

## Real cost factors most people miss

### Hidden cost of SaaS lock-in

- **Migration cost**: when prices triple in year 3, switching costs you 2-4 weeks
- **Data portability**: most SaaS make export deliberately painful
- **Feature deprecation**: vendor removes a feature you depend on
- **Acquisition**: vendor gets bought, product becomes worse
- **Outage**: their downtime is your downtime, with no recourse

These don't show up in the monthly bill. They show up at exactly the wrong moment.

### Hidden cost of self-hosting

- **Skill required**: you need at least one team member who can debug Linux/Docker
- **Backup discipline**: if you forget backups, you lose data when the VPS dies
- **Security patches**: an unpatched OSS instance is a security risk
- **Time of recovery**: when something breaks, no support ticket — you fix it

These don't show up in the monthly bill either. They show up the night before a launch when your VPS runs out of disk space.

## My recommendation

**For founders pre-PMF**: Pay for SaaS. Ship product. Don't optimize cost.

**For founders post-PMF with technical team**: Audit your subscription stack. Replace the top 3-5 most expensive with self-hosted equivalents. The savings fund a new hire.

**For founders running side projects**: Self-host everything. The setup time becomes learning time. The cost is your hourly rate × time saved.

## The full curated picks

If you're ready to self-host, [**StackPicks**](/) has the [**160+ open-source tools**](/preview) and [**13 ready-to-ship stack bundles**](/build) curated by builders for builders.

Or browse [**SaaS alternatives**](/alternatives) — every page has a top-3 OSS replacement for a specific paid tool.

`,
  },

  // ════════════════════════════════════════════════════════════════
  // POST 7: Build an MVP in 48 hours
  // ════════════════════════════════════════════════════════════════
  {
    slug: 'build-mvp-48-hours-open-source-ai-tools-2026',
    title: 'Build an MVP in 48 Hours With Open-Source AI Tools (2026 Stack)',
    excerpt: 'The exact open-source stack to build a production-ready MVP in 48 hours. Frontend, backend, AI integration, auth, payments — every tool with one-line install commands.',
    query: 'build mvp open source',
    monthly_searches: 1800,
    reading_time: 12,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'Stack Guides',
    quick_answer: 'To build an MVP in 48 hours in 2026: use Cursor or Cline as your AI coding tool, Next.js 15 + Tailwind + shadcn/ui for the app, Supabase for DB + auth, Razorpay or Stripe for payments, Resend for email, Vercel or Railway for hosting. With Claude Sonnet 4.5 driving Cursor, you build 5-10x faster than 2023.',
    faqs: [
      {
        question: 'Can you really build a SaaS MVP in 48 hours?',
        answer: 'Yes, with AI coding tools + a curated stack. The bottleneck is no longer code — it is decisions. Cursor + Claude Sonnet 4.5 can scaffold the entire CRUD layer in an hour. The remaining time goes into product-specific features.',
      },
      {
        question: 'Which AI coding tool is best for 48-hour MVP sprints?',
        answer: 'Cursor for most builders (best autocomplete + agent mode, $20/mo). Cline if you want free + open-source agentic flow inside VS Code. Pair either with Claude Sonnet 4.5 for the best code quality on the first generation.',
      },
      {
        question: 'What is the cheapest stack for a 48-hour MVP?',
        answer: 'Next.js + Supabase (free tier) + Resend (free tier) + Cline (free) + Vercel (hobby). Total cost to launch: $0. You only start paying when you cross Supabase\'s 500MB DB or Vercel\'s function limits — typically after 100+ active users.',
      },
      {
        question: 'Do I need to know how to code to build a SaaS in a weekend?',
        answer: 'You need to understand the stack and basic JavaScript, but not write most of the code. Cursor + Claude handle 80% of implementation. The skill that matters most is product decisions — what to build, what to cut, what to ship first.',
      },
    ],
    content: `Building an MVP in a weekend used to be a stunt. In 2026, it's the new normal — AI coding tools + curated OSS stacks make 48-hour builds genuinely possible.

This is the exact stack I'd use, with one-line install commands and the curator takes for each pick.

## The 48-hour breakdown

| Hours | What you do |
|---|---|
| **Hour 0-4** | Pick stack + scaffold project |
| **Hour 4-12** | Build core feature (let AI handle most of it) |
| **Hour 12-20** | Add auth + payments |
| **Hour 20-30** | Build UI + polish |
| **Hour 30-40** | Deploy to production |
| **Hour 40-48** | Test + ship + announce |

## The exact stack — full picks

### 1. Frontend framework: Next.js 15

![Next.js 15 — the React framework with App Router and Server Components](https://opengraph.githubassets.com/1/vercel/next.js)

\`\`\`bash
pnpm create next-app@latest my-mvp --typescript --tailwind --app
\`\`\`

[Next.js](/repo/vercel--next.js) is the right default. App Router, Server Components, edge runtime, Vercel/Railway deploys in one click.

**Alternative:** [Astro](/repo/withastro--astro) if your MVP is content-heavy (a blog, marketing site, docs).

[Full Next.js vs Astro comparison](/compare/next-js-vs-astro).

### 2. UI components: shadcn/ui

\`\`\`bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog form input table
\`\`\`

[shadcn/ui](/repo/shadcn-ui--ui) gives you copy-paste primitives. Beautiful defaults, accessibility baked in, no npm dependency to break.

**Alternative if you want pre-styled:** [Mantine](/repo/mantinedev--mantine) (more components out of the box).

For animations: [Motion (Framer Motion)](/repo/motiondivision--motion):

\`\`\`bash
pnpm add motion
\`\`\`

### 3. Backend: Supabase

\`\`\`bash
pnpm add @supabase/supabase-js @supabase/ssr
\`\`\`

[Supabase](/repo/supabase--supabase) gives you Postgres + Auth + Storage + Edge Functions in one platform. Free tier covers you to ~1,000 users.

**Why not just use Next.js API routes + a separate DB?** You can. But Supabase saves you 4-6 hours of auth setup and gives you Row-Level Security baked in.

### 4. Auth: Built-in via Supabase

Supabase Auth supports email + magic links + OAuth (Google, GitHub, Apple) out of the box.

\`\`\`typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: \`\${window.location.origin}/auth/callback\` }
});
\`\`\`

If you're not using Supabase, [**Better Auth**](/repo/better-auth--better-auth) is the modern 2026 pick.

[Better Auth vs NextAuth comparison](/compare/next-auth-vs-better-auth).

### 5. Database / ORM: Drizzle

\`\`\`bash
pnpm add drizzle-orm
pnpm add -D drizzle-kit
\`\`\`

[Drizzle](/repo/drizzle-team--drizzle-orm) is the modern TypeScript-first ORM. Edge-compatible, zero runtime overhead, SQL-like syntax.

**Alternative:** [Prisma](/repo/prisma--prisma) — better DX, heavier runtime. Pick Prisma if DX matters more than performance.

[Prisma vs Drizzle comparison](/compare/prisma-vs-drizzle).

### 6. Forms: React Hook Form + Zod

\`\`\`bash
pnpm add react-hook-form zod @hookform/resolvers
\`\`\`

[React Hook Form](/repo/react-hook-form--react-hook-form) for state, [Zod](/repo/colinhacks--zod) for validation. The dominant 2026 form stack.

[Yup vs Zod comparison](/compare/yup-vs-zod).

### 7. AI integration: Vercel AI SDK

\`\`\`bash
pnpm add ai @ai-sdk/anthropic @ai-sdk/openai
\`\`\`

The Vercel AI SDK handles streaming, structured outputs, tool calling for any LLM (Claude, GPT, Gemini, local Ollama).

For development, use [Ollama](/repo/ollama--ollama) to run Llama 3.3 locally:

\`\`\`bash
ollama run llama3.3
\`\`\`

For agents (multi-step LLM workflows): [LangChain](/repo/langchain-ai--langchain), [LlamaIndex](/repo/run-llama--llama_index), or [Mastra](/repo/mastra-ai--mastra) (JS-first).

[Open-source AI agent frameworks compared](/blog/open-source-ai-agent-frameworks-compared).

### 8. Payments: Razorpay (India) or Stripe (global)

If India-first: \`pnpm add razorpay\`. UPI + cards + subscriptions.

If global: Stripe. Same simplicity.

**Critical:** verify webhook signatures server-side. Skipping this is the #1 payment bug in indie SaaS.

### 9. Email: Resend + react-email

\`\`\`bash
pnpm add resend react-email
\`\`\`

[react-email](/repo/resend--react-email) lets you write email templates in JSX. Resend handles delivery. Free tier covers 3,000 emails/month.

### 10. Deployment: Vercel or Railway

**Vercel** if you're Next.js-only and don't need long-running backend processes. Free tier is generous.

**Railway** if you have workers, cron, or websockets. Pay-as-you-go.

Skip AWS until you have real product-market fit. The complexity will eat your weekend.

## The 48-hour timeline

### Hours 0-4: Pick + scaffold

\`\`\`bash
# Create the app
pnpm create next-app@latest my-mvp --typescript --tailwind --app
cd my-mvp

# Install everything
pnpm add @supabase/supabase-js @supabase/ssr drizzle-orm react-hook-form zod @hookform/resolvers motion ai @ai-sdk/anthropic resend react-email

# UI primitives
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog form input table sonner
\`\`\`

Set up Supabase project. Create one DB table for your core entity. Set up RLS policy (\`auth.uid() = user_id\`).

### Hours 4-12: Build core feature with AI

Open [Cursor](/blog/cursor-vs-aider-vs-cline-best-ai-coding-tools-2026) or [Cline](/repo/cline--cline). Describe your core feature in 2-3 sentences. Let AI write the first pass. Review + fix.

**Pro tip:** paste the [**Ship a SaaS bundle**](/build/ship-a-saas) into your AI agent's context. It knows the stack and writes code consistent with it.

### Hours 12-20: Add auth + payments

Auth: Supabase Auth UI components handle the whole sign-in/sign-up flow.

Payments: Stripe Checkout or Razorpay Standard Checkout. ~30 lines of code total.

### Hours 20-30: UI + polish

Apply shadcn components. Add Motion animations on key transitions. Use [Lenis](/repo/darkroomengineering--lenis) for smooth scroll on landing page.

### Hours 30-40: Deploy

\`\`\`bash
# Vercel
pnpm dlx vercel

# Or Railway
pnpm dlx railway up
\`\`\`

Set env vars. Connect domain.

### Hours 40-48: Test + ship + announce

End-to-end test (sign up → use feature → pay → success).

Post on:
- Twitter/X with the 3-tweet thread template
- LinkedIn with the launch post
- ProductHunt (schedule for next Tuesday)

## What you don't do in 48 hours

Be honest about scope:

- **Don't write tests.** Real users find bugs faster than you can write tests. Launch first.
- **Don't polish to perfection.** v1 should embarrass you. v3 should embarrass you less.
- **Don't add features beyond core.** Settings page, profile editing, dark mode — all v2.
- **Don't optimize performance.** Optimize for the first 100 users, not 100k.

## The curated 48-hour bundle

We curated the [**complete Ship-a-SaaS bundle**](/build/ship-a-saas) with 40+ open-source repos picked specifically for fast MVP builds. Every repo has a curator take and "use this if / skip if" clause.

Want it now? [**Lifetime membership**](/pricing) is ₹99 (or $2.99 international). Pay once, get the full directory + 13 stack bundles + 12 skill tracks forever.

`,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
