// AutoDM-specific blog data — lives at /autodm/blog.
//
// Separate from apps/web/lib/blog.ts (the main directory blog) so the
// AutoDM subdomain stays focused. Same SEO + GEO armor (quick_answer
// + FAQs + dates + sources) but the topics are Meta IG automation,
// Private Reply API, Meta Ads MCP, ban-avoidance, etc.

export interface AutoDmBlogPost {
  slug: string;
  title: string;                 // SEO-optimized H1
  excerpt: string;
  query: string;                 // primary search query target
  monthly_searches: number;      // rough estimate, for prioritisation
  reading_time: number;          // in minutes
  published_at: string;          // ISO
  updated_at: string;
  author: string;
  category: 'API guide' | 'Compliance' | 'How-to' | 'Comparison';
  quick_answer: string;          // ≤350 chars — front-load the answer
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  content: string;               // markdown — rendered server-side
}

const TODAY = '2026-06-06';
const YESTERDAY = '2026-06-05';

export const AUTODM_BLOG_POSTS: AutoDmBlogPost[] = [
  // ─── Post 1: Private Reply API (the bug we LIVED yesterday) ──────────
  {
    slug: 'instagram-private-reply-api-non-followers-2026',
    title: 'Instagram Private Reply API — Why Your Auto-DM Fails for Non-Followers (2026 Fix)',
    excerpt:
      'Most IG auto-DM tools silently fail for users who don\'t follow you. The fix is one API endpoint switch: Private Reply API addresses by comment_id, not user_id, and grants a 7-day window from the comment.',
    query: 'instagram private reply api non followers',
    monthly_searches: 1900,
    reading_time: 6,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'API guide',
    quick_answer:
      'IG\'s standard messaging API only works inside a 24-hour conversation window — so DMs to non-followers fail with "This message is sent outside of allowed window." The Private Reply API fixes this: address the recipient by comment_id (not user_id), and Meta grants a 7-day messaging window from the comment timestamp. POST /{comment-id}/replies for the public reply; POST /{ig-business-id}/messages with recipient: { comment_id } for the DM.',
    faqs: [
      {
        question: 'Why do auto-DMs fail for non-followers on Instagram?',
        answer: 'Most automation tools use the standard messaging endpoint (POST /me/messages with recipient: { id: <user_id> }). That endpoint requires an active 24-hour conversation window — meaning the recipient must have messaged you in the last 24 hours. Non-followers and cold recipients usually haven\'t, so Meta returns "This message is sent outside of allowed window." and silently drops the DM.',
      },
      {
        question: 'What is the Instagram Private Reply API?',
        answer: 'Private Reply is a separate Messenger Platform endpoint that lets a business DM a commenter directly, addressed by the comment\'s ID rather than the user\'s ID. The payload uses recipient: { comment_id: "<id>" } instead of { id: "<user_id>" }. Meta grants a 7-day messaging window from the comment timestamp regardless of follow status. This is the supported path for "comment → DM" automation in 2026.',
      },
      {
        question: 'How long is the Private Reply window?',
        answer: 'Seven days from the moment the comment was created. If a user commented today at 14:00 IST, you have until exactly 14:00 IST seven days from now to send them a Private Reply DM. After that, the conversation falls back to the 24-hour standard messaging window — meaning you can only DM them if they message you first.',
      },
      {
        question: 'Do I still need to handle the 24-hour window?',
        answer: 'Yes — but only after the first reply. The Private Reply API opens a 7-day window from the comment. Once you and the recipient have a live conversation going, follow-up messages within 24 hours of their last reply work via the standard messaging endpoint. Tools like StackPicks AutoDM use Private Reply for the first message of any comment-triggered conversation, then switch to standard messaging for any AI follow-up replies that arrive in-window.',
      },
      {
        question: 'Will Meta ban my account for using the Private Reply API?',
        answer: 'No — Private Reply is the official, documented path. Meta\'s anti-abuse system flags high-volume cold-DM patterns from standard messaging, but Private Replies tied to real comments on your own posts are explicitly allowed. The safeguards that matter are content (no spam triggers like "free", "guaranteed"), volume (under 200 DMs/hour for established accounts, lower for warming accounts), and link hygiene (single button-card link, not multi-URL text bodies).',
      },
      {
        question: 'How do I implement Private Reply API for a comment trigger?',
        answer: 'Subscribe to the "comments" webhook field on your IG business account. When a comment matching your keyword arrives, capture comment_id from the webhook value. For the public reply, POST /{comment-id}/replies with { message }. For the DM, POST /{ig-business-id}/messages with { recipient: { comment_id }, message: { text } }. Do NOT include messaging_type — Meta infers it from the recipient shape. Test with a non-follower account to confirm Private Reply path is firing.',
      },
    ],
    sources: [
      { label: 'Meta Developers — Private Replies docs', url: 'https://developers.facebook.com/docs/instagram-platform/private-replies/' },
      { label: 'Meta Developers — Instagram Messaging API', url: 'https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/' },
      { label: 'Meta Developers — IG Comment Replies', url: 'https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment/replies/' },
    ],
    content: `If you've built an Instagram auto-DM bot in 2026 and your sends silently fail for users who don't follow you, you've hit the most common bug in the space. Meta returns:

\`\`\`json
{
  "error": {
    "message": "This message is sent outside of allowed window.",
    "type": "OAuthException",
    "code": 10
  }
}
\`\`\`

The fix is one endpoint switch. It's been live since Meta opened the path for "comment → DM" automation in 2024, and the documentation is buried two clicks deep.

## The standard messaging endpoint is the wrong endpoint

Most tutorials show this:

\`\`\`http
POST /me/messages?access_token=...
{
  "recipient": { "id": "<recipient_igsid>" },
  "message":   { "text": "Hey, here's your link!" },
  "messaging_type": "RESPONSE"
}
\`\`\`

This works **only inside an active 24-hour conversation window**. Non-followers who comment on your post haven't started a conversation with you, so Meta blocks the DM.

## Private Reply: address by comment_id, not user_id

\`\`\`http
POST /<your-ig-business-id>/messages?access_token=...
{
  "recipient": { "comment_id": "<the_comment_id>" },
  "message":   { "text": "Hey, here's your link!" }
}
\`\`\`

Two changes from the broken version:

1. **\`recipient\` keys on \`comment_id\`, not \`id\`** — Meta uses the comment as the messaging anchor.
2. **No \`messaging_type\`** — Meta infers \`MESSAGE_TAG\` from the recipient shape.

This grants a **7-day window from the comment timestamp**. Works for followers and non-followers identically.

## The webhook side

To get \`comment_id\` in the first place, subscribe to the \`comments\` field on your IG business account:

\`\`\`bash
curl -X POST "https://graph.facebook.com/v22.0/<ig-business-id>/subscribed_apps?\\
  subscribed_fields=comments&access_token=<token>"
\`\`\`

Then in your webhook handler:

\`\`\`js
const v = entry.changes[0].value;
const commentId  = v.id;          // ← the Private Reply key
const fromIgsid  = v.from.id;     // ← for follower checks, not DMs
const text       = v.text;        // match against your keyword rules
\`\`\`

## The public comment reply

While you're DM'ing, also post a public reply on the same comment. This serves two purposes: viewers see the bot worked, and others are more likely to copy the behavior.

\`\`\`http
POST /<comment-id>/replies?access_token=...
{ "message": "Sent ✓ check your DMs @user" }
\`\`\`

Public replies are not subject to either messaging window — they're regular comment activity governed by spam policy.

## What StackPicks AutoDM does differently

When we hit this bug ourselves on June 5, 2026 — \`demo_fluenco\` getting "outside allowed window" while \`piyush.jangir\` (who follows us) succeeded — we ripped out the standard messaging path and rebuilt the engine around Private Reply. The result: 100% delivery rate to non-followers within the 7-day window, regardless of follower count.

Our follow-up agent then uses standard messaging for AI-generated replies that arrive after the recipient has DM'd back — at that point the 24-hour conversation window is open, and standard messaging is the right tool.

## Quick checklist before shipping

1. Switch your DM send to \`recipient: { comment_id }\`.
2. Remove \`messaging_type\` from the payload.
3. Verify your webhook captures \`value.id\` as \`comment_id\`.
4. Test with a non-follower account and watch your dm_log.

That's the whole fix.

— Piyush
`,
  },

  // ─── Post 2: Compliance + ban-avoidance ──────────────────────────────
  {
    slug: 'instagram-auto-dm-compliance-2026',
    title: 'Instagram Auto-DM Compliance 2026 — What Meta Actually Allows',
    excerpt:
      'Meta removed 10 million Instagram accounts in 2026 alone. Here\'s what gets your account banned, what\'s still allowed, and the 4-rule checklist every safe auto-DM tool follows.',
    query: 'instagram auto dm compliance 2026 banned',
    monthly_searches: 4400,
    reading_time: 7,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'Compliance',
    quick_answer:
      'In 2026 Meta removed 10M+ accounts for bot activity, and enforcement is layered: shadowbans → action blocks (24h-30d) → suspensions → permanent bans. Safe auto-DM means: (1) official Graph API only, no browser bots; (2) reply to user-triggered events only (comments, story replies, keyword DMs); (3) stay under 200 DMs/hour per account, lower for new accounts; (4) no spam-trigger words ("free", "guarantee", "click here") or multi-URL bodies.',
    faqs: [
      {
        question: 'How many Instagram accounts has Meta banned in 2026?',
        answer: 'Meta has removed more than 10 million Instagram accounts in 2026 for bot activity, spam, fake engagement, and suspicious behaviour. The crackdown is part of an ongoing AI-driven enforcement wave that began in late 2025 and intensified through Q1-Q2 2026. Most bans hit accounts using browser-based scraping tools, password sharing, and cold DM bots — not accounts using Meta\'s official Graph API.',
      },
      {
        question: 'Will I get banned for using auto-DM tools?',
        answer: 'Not if the tool uses Meta\'s official Instagram Graph API (Private Reply, Messaging API, Comment Replies) and respects rate limits. Bans hit tools that scrape the web flow with browser bots, use password sharing, send cold DMs to non-engagers, or trigger more than 200 DMs/hour. Compliant tools like ManyChat, Inrō, WhoseDM, and StackPicks AutoDM use the Graph API path and don\'t cause bans on their own.',
      },
      {
        question: 'What\'s the maximum auto-DMs per hour Instagram allows?',
        answer: 'Established accounts: ~200 DMs/hour as a soft ceiling before Meta\'s spam ML starts watching. New business accounts (less than 21 days old): closer to 20-30/hour during the warming period. Accounts that just came off a Meta cooldown: 10-20/hour for 7 days while reputation rebuilds. Spreading sends across the hour matters more than the absolute number — bursts of 50 in one minute trip the ML harder than 200 spread evenly.',
      },
      {
        question: 'Which Instagram automation actions are banned by Meta in 2026?',
        answer: 'Browser bots (Selenium, Puppeteer wrapping the web flow), Python/Node libraries that scrape Instagram URLs, password sharing with third-party services, auto-following or unfollowing in bulk, generic mass commenting on hashtag feeds, cold DMs to users who haven\'t engaged, and the deprecated CONFIRMED_EVENT_UPDATE message tag (effective April 27, 2026). Meta has issued DMCA takedowns against many of these libraries.',
      },
      {
        question: 'What are the 4 rules of safe Instagram auto-DM?',
        answer: '(1) Only use Meta\'s official Graph API — no browser automation, no scrapers. (2) Only DM in response to user actions — comments, story replies, message keywords. Never cold-DM. (3) Stay under 200 DMs/hour and warm new accounts from 30/day for the first week. (4) No spam-trigger language in DM bodies ("free", "guaranteed", "exclusive offer", "click here") and no more than ONE link per DM, preferably in a CTA button card rather than the text body.',
      },
      {
        question: 'How do I recover from an Instagram action block on a business account?',
        answer: 'Action blocks usually last 24 hours to 30 days. Stop ALL automation immediately when one fires — continuing to retry compounds the block. If you\'re using an auto-DM tool, pause it. Wait the full block duration before sending any DMs at all. When you resume, drop your hourly cap to 20% of where you were when the block hit. If the block was on the developer account (re-verification required), complete Meta\'s email + SMS verification flow — that usually clears API access within 15 min.',
      },
    ],
    sources: [
      { label: 'Instagram DM Compliance 2026 — CreatorFlow', url: 'https://creatorflow.so/blog/instagram-dm-compliance-meta-rules/' },
      { label: 'Instagram Mass Ban Wave 2026 — Unban.net', url: 'https://unban.net/tpost/instagram-mass-ban-wave-2026' },
      { label: 'Meta Developers — Instagram Platform changelog', url: 'https://developers.facebook.com/docs/instagram-platform/changelog/' },
    ],
    content: `In 2026 Meta removed more than 10 million Instagram accounts in a single enforcement wave. The CEOs of two of the largest creator-marketing platforms have publicly confirmed account losses in the hundreds of thousands. If you run any kind of Instagram automation, this is the most important paragraph you'll read this quarter.

The good news: Meta isn't targeting automation itself. They're targeting the **wrong kind** of automation. Tools built on the official Graph API, respecting documented rate limits, are not in the firing line. Browser bots, scrapers, password-sharing services, and bulk-action tools are.

## What Meta is actually penalising

The 2026 ban wave hits four patterns:

1. **Browser automation** — Selenium, Puppeteer, Playwright wrappers that drive the instagram.com web flow. Meta detects these via behavioural fingerprinting (mouse movement, request cadence, missing headers). Detection happens within hours of first run.
2. **Scraping libraries** — Python and Node packages that bypass Graph API. Meta has issued DMCA takedowns against many of the popular ones. Using them puts your account on a watchlist independent of the API.
3. **Cold DMs to non-engagers** — sending DMs to users who haven't interacted with your account. Meta's spam ML treats this as the strongest signal of a bot.
4. **Bulk follow/unfollow + mass commenting** — automated likes at high volume, generic comments on hashtag feeds, follow trains. All detected within hours.

## What's still allowed

**Comment-triggered DMs via Private Reply API.** A user comments \`STACK\` on your post. You DM them the link. Meta loves this — it's user-initiated, contextual, and the Private Reply window (7 days from comment) is the documented path.

**Story-reply triggers.** Same idea: user replies to your story, you DM them back. Standard messaging window applies.

**Keyword DM triggers.** User DMs you the word \`PRICE\`. You auto-reply with your pricing. The conversation window is already open.

**Recurring notifications.** Users who opt-in to notifications (e.g., new product drops, restock alerts) can receive your DMs even outside the standard window.

Note: the \`CONFIRMED_EVENT_UPDATE\` message tag was deprecated effective April 27, 2026. If your tool still uses this tag, switch to \`HUMAN_AGENT\` or \`POST_PURCHASE_UPDATE\` depending on the use case.

## The 4-rule checklist

1. **Official Graph API only.** If your tool requires your Instagram password, it's a browser bot. Switch tools today.
2. **User-triggered only.** Never cold-DM. Always respond to comments, story replies, or inbound messages.
3. **Volume caps.** Hard ceiling: 200 DMs/hour for established accounts. New accounts: 20-30/hour for first 21 days. After Meta cooldown: 10-20/hour for 7 days.
4. **Content hygiene.** No spam-trigger words. Maximum one URL per DM. No identical bodies fanning out to 100+ recipients — rotate 2-4 variants.

## What happens when you violate

Enforcement is layered:

- **Shadowban** — your posts disappear from hashtag pages and Explore. Often the first signal something's wrong.
- **Action block** — Meta freezes specific features (commenting, DMing, following) for 24 hours to 30 days. The block notice itself appears in the IG app under Settings → Account Status.
- **Suspension** — full account lock-out, usually with a 30-day appeal window.
- **Permanent ban** — account and all content removed. No appeals after the 30-day window closes.

Once an action block fires, do not continue retrying. Pause your automation immediately. Wait the full block period. When you resume, drop your hourly cap to 20% of what it was when the block hit, and stay there for 7 days.

## Account warming

A new business account doing 200 DMs in its first day is suspicious to Meta even if every DM is contextually appropriate. Warm it:

- **Day 0-6:** maximum 30 DMs/day
- **Day 7-13:** maximum 60 DMs/day
- **Day 14-20:** maximum 100 DMs/day
- **Day 21+:** plan caps unlock

This is the schedule built into StackPicks AutoDM by default — you can't bypass it on a Free or Creator plan, only Pro+ can raise the warming cap with manual override.

## Practical day-1 setup

1. Use the official Instagram Graph API. Sign up at developers.facebook.com.
2. Subscribe to the \`comments\` webhook field on your business account.
3. Pin one keyword rule per post (\`STACK\`, \`LINK\`, \`MOTION\` — whatever you've teased in the caption).
4. Set hourly cap to 30 and daily cap to 50 for the first week, then ramp from there.

That's enough to be safe in 2026.

— Piyush
`,
  },

  // ─── Post 3: Meta Ads MCP setup ──────────────────────────────────────
  {
    slug: 'meta-ads-mcp-setup-claude-chatgpt-2026',
    title: 'Meta Ads MCP Setup — Connect Meta Ads to Claude or ChatGPT (2026 Guide)',
    excerpt:
      'Meta\'s official Ads MCP server (mcp.facebook.com/ads) launched in April 2026 — one URL, sign-in with your Meta account, 29 tools across reporting, campaigns, catalog, and diagnostics. No developer token. No code. 90 seconds.',
    query: 'meta ads mcp setup claude chatgpt 2026',
    monthly_searches: 2900,
    reading_time: 5,
    published_at: TODAY,
    updated_at: TODAY,
    author: 'Piyush Jangir',
    category: 'How-to',
    quick_answer:
      'Meta\'s official Ads AI Connectors went into open beta in April 2026. To connect: open Claude → Settings → Connectors → Add custom connector → paste https://mcp.facebook.com/ads → sign in with your Meta account. No developer token. No API setup. 29 tools across reporting, campaigns, catalog, and diagnostics. Works identically in ChatGPT and Cursor. Free.',
    faqs: [
      {
        question: 'What is Meta Ads MCP?',
        answer: 'Meta Ads MCP is Meta\'s official Model Context Protocol server, launched April 2026 in open beta. It exposes 29 tools across four categories — reporting, campaign management, catalog management, and diagnostics — letting AI clients like Claude, ChatGPT, Cursor, and Perplexity manage Meta ad campaigns directly. The server is hosted by Meta at mcp.facebook.com/ads. There\'s also a Meta Ads CLI for terminal workflows.',
      },
      {
        question: 'How do I set up Meta Ads MCP in Claude Desktop?',
        answer: 'Open Claude → Settings → Connectors → Add custom connector. Paste https://mcp.facebook.com/ads as the connector URL. Claude opens a Meta sign-in window — log in with the Meta account that has Business Manager access to the ad accounts you want to query. Grant the requested permissions. The connector activates instantly. No JSON config, no API key juggling, no developer token.',
      },
      {
        question: 'Does Meta Ads MCP cost money?',
        answer: 'No. The MCP server itself is free during the open beta. You pay only for the Meta Ads spend you create through it — same as if you ran the ads through Ads Manager. There\'s no per-tool charge, no API call cost, no setup fee. The AI client (Claude, ChatGPT) bills separately for their model usage, but the Meta side is free.',
      },
      {
        question: 'What can I do with Meta Ads MCP that I can\'t do in Ads Manager?',
        answer: 'Bulk operations in natural language. "Pause every campaign with ROAS under 1.5x last 7 days." "Summarise CPC trends across my Top-of-Funnel campaigns weekly." "Create a lookalike audience from purchasers in the last 30 days, then test 3 ad creatives against it." All of these would take 30-90 minutes of Ads Manager clicking. Through Claude with the MCP wired in, they take one prompt.',
      },
      {
        question: 'Is Meta Ads MCP safer than third-party tools like Revealbot?',
        answer: 'Yes for two reasons. (1) It\'s Meta\'s own server, so it has full access to all current and future APIs without dependency on a third party staying in business. (2) Authorization happens through Meta\'s own sign-in flow, not through a third-party OAuth proxy or developer token. Your credentials never touch the MCP itself. The risk surface is essentially the same as logging into business.facebook.com.',
      },
      {
        question: 'Can I use Meta Ads MCP and Google Ads MCP at the same time?',
        answer: 'Yes — but you need to add each one separately in Claude. The Meta one is mcp.facebook.com/ads. Google\'s isn\'t officially hosted yet (as of June 2026), so most builders use the open-source mcp-google-ads server (github.com/cohnen/mcp-google-ads) — that one requires a Google Ads developer token + OAuth refresh token setup, about 20 minutes one-time. Once both are connected, you can run cross-platform queries: "Compare ROAS by channel for last 30 days."',
      },
    ],
    sources: [
      { label: 'Meta for Business — Meta Ads AI Connectors announcement', url: 'https://www.facebook.com/business/news/meta-ads-ai-connectors' },
      { label: 'Meta Developers — Ads CLI documentation', url: 'https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-cli/ads-cli-overview' },
      { label: 'Meta Help — Manage Ads from an AI Agent', url: 'https://www.facebook.com/business/help/1456422242197840' },
    ],
    content: `On April 29, 2026, Meta launched Meta Ads AI Connectors — an official MCP (Model Context Protocol) server that lets Claude, ChatGPT, Cursor, and any MCP-compatible AI client manage your Meta ad campaigns through one URL, with a single Meta sign-in.

If you've ever wired up Marketing API access by hand — developer token, app review, Business Verification, OAuth refresh tokens — this is the most welcome thing Meta has shipped for advertisers since detailed targeting got nuked.

## What you get

**29 tools across 4 categories:**

- **Reporting** — campaign performance, breakdown by demo / geo / device / placement, account-level metrics, ad-level metrics. Replaces 80% of Looker dashboards.
- **Campaign management** — create campaigns, ad sets, ads. Pause / activate. Budget adjustments. Schedule changes.
- **Catalog management** — upload products, update inventory, sync to Advantage+ shopping campaigns.
- **Diagnostics** — Pixel signal quality, audience overlap warnings, optimisation event readiness.

It works in Claude Desktop, Claude.ai web, ChatGPT (with the Connectors feature), Cursor, Cline, Windsurf, and Perplexity Comet — any MCP 2026-07-28 spec-compliant client. (See [our MCP 2.0 explainer](/blog/mcp-2-0-explained-2026) for what's new in the latest spec.)

## 90-second setup

1. Open **Claude → Settings → Connectors → Add custom connector**.
2. Paste \`https://mcp.facebook.com/ads\` as the URL.
3. Claude opens Meta sign-in — log in with the Meta account that has Business Manager access.
4. Grant the requested permissions.

That's it. The connector activates instantly. No JSON config. No API key in environment variables. No app review wait.

## A real example

Once it's wired, this prompt works:

> "Pause every active campaign with ROAS under 1.5x in the last 7 days, then show me what we're spending on the ones still running."

Claude calls 3 MCP tools sequentially:
1. \`list_active_campaigns\` to get the candidate list.
2. \`get_campaign_performance\` with last_7_days, ROAS metric, for each one.
3. \`pause_campaign\` on the ones returning ROAS < 1.5.
4. \`get_spend_summary\` on the survivors.

Replies with a clean table. Total time: ~12 seconds.

## What it costs

The MCP server itself is free during open beta. You pay only for:
- The Meta ad spend you create through it (same as Ads Manager).
- Your AI client's usage (Claude Pro, ChatGPT Plus, etc.).

There's no per-tool charge or API call fee on the Meta side.

## The honest caveats

- **Open beta.** Tool surface may change. Treat it as production-stable for reporting / queries; treat it as experimental for high-stakes bulk changes until GA.
- **Permissions follow Meta Business Manager.** If your role can't pause a campaign in the UI, the MCP can't either. Use a Business Manager admin token for full access.
- **Per-account scope.** You connect one Meta business account per OAuth grant. Agencies managing multiple businesses need to add the connector multiple times with different sign-ins.

## Compared to building it yourself

Before this launched, the alternative was:
1. Apply for Meta App access.
2. Wait for App Review (1-3 weeks).
3. Pass Business Verification (1-2 weeks).
4. Get a developer token (Standard Access usually).
5. Implement OAuth in your own service.
6. Mirror the entire Marketing API surface as tool definitions.

Total: 4-8 weeks. Meta did all of this for you and charges $0.

## Where StackPicks fits

If you only run Meta Ads, **use Meta's MCP directly**. It's the fastest, cleanest path.

If you want Meta Ads + Google Ads + GitHub + Slack + Notion + 20 other apps through ONE connector URL, that's where [StackPicks Connect](https://stackpicks.dev/connect) earns its keep. We're the unified gateway — one OAuth sign-in per app, one MCP URL into your AI client, every provider on the same dashboard.

For ads specifically, we wire Meta's official MCP through Connect for unified-billing customers, and we offer a Bring-Your-Own-Token (BYO) path for Google Ads via the open-source [mcp-google-ads](https://github.com/cohnen/mcp-google-ads) server.

— Piyush
`,
  },
];

export function getAutoDmBlogPost(slug: string): AutoDmBlogPost | undefined {
  return AUTODM_BLOG_POSTS.find((p) => p.slug === slug);
}

export function listAutoDmBlogPosts(): AutoDmBlogPost[] {
  return [...AUTODM_BLOG_POSTS].sort((a, b) =>
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
}

// Provided for the FAQPage JSON-LD GEO armor on each post page.
export function faqJsonLd(post: AutoDmBlogPost): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  });
}

// Suppress unused-var warning during dev — referenced for future "updated yesterday" badges.
export const _YESTERDAY = YESTERDAY;
