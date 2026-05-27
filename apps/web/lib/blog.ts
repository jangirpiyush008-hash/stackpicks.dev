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

export const BLOG_POSTS: BlogPost[] = [
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
    updated_at: NEW_TODAY,
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
