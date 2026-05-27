/**
 * "Best open-source [X]" pages — second-highest-volume keyword class.
 * Each page targets a specific "best open source X" query and ranks the top picks.
 */

export interface BestPick {
  full_name: string;
  short_name: string;
  one_liner: string;            // 12-25 words
  highlight: string;            // The specific strength to call out
  license?: string;
  stars_approx?: number;
  self_hosted: boolean;
}

export interface BestOfPage {
  slug: string;                // URL slug, e.g. "crm"
  category: string;            // "Best open-source <category>"
  display_name: string;        // Pretty display name
  query: string;
  monthly_searches: number;
  intro: string;               // ~150-word intro
  picks: BestPick[];
}

export const BEST_OF: BestOfPage[] = [
  {
    slug: 'crm',
    category: 'CRM',
    display_name: 'CRM',
    query: 'best open source crm',
    monthly_searches: 5400,
    intro: 'A CRM that locks you in for $50/user/month is a tax. The best open-source CRMs in 2026 are production-ready, self-hostable, and good enough to replace Salesforce/HubSpot for 80% of teams. Below are the top picks ranked by curator experience — not stars.',
    picks: [
      {
        full_name: 'twentyhq/twenty',
        short_name: 'Twenty',
        one_liner: 'Notion-style modern CRM. Beautiful UI, GraphQL API, custom objects. The default pick in 2026.',
        highlight: 'Best modern UI / DX',
        license: 'AGPL-3.0',
        stars_approx: 22000,
        self_hosted: true,
      },
      {
        full_name: 'EspoCRM/EspoCRM',
        short_name: 'EspoCRM',
        one_liner: 'Mature, feature-complete CRM. Less pretty than Twenty but battle-tested for B2B sales teams.',
        highlight: 'Most mature feature set',
        license: 'AGPL-3.0',
        stars_approx: 5000,
        self_hosted: true,
      },
      {
        full_name: 'salesagility/SuiteCRM',
        short_name: 'SuiteCRM',
        one_liner: 'The SugarCRM fork. Powerful customization, large community, plugin ecosystem. Best for complex sales orgs.',
        highlight: 'Most plugins / customization',
        license: 'AGPL-3.0',
        stars_approx: 5000,
        self_hosted: true,
      },
      {
        full_name: 'krayin/laravel-crm',
        short_name: 'Krayin CRM',
        one_liner: 'Laravel-based CRM with pretty UI and good defaults. Best if your team is PHP-fluent.',
        highlight: 'PHP / Laravel stack',
        license: 'MIT',
        stars_approx: 2300,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'project-management',
    category: 'Project management',
    display_name: 'Project management',
    query: 'best open source project management tool',
    monthly_searches: 4400,
    intro: 'Jira/Asana/Linear/Monday.com cost $10-30/user/month and lock your data in. Open-source project management tools in 2026 match commercial features for kanban, sprints, time tracking, and team collaboration — at zero per-user cost.',
    picks: [
      {
        full_name: 'makeplane/plane',
        short_name: 'Plane',
        one_liner: 'Linear/Jira killer. Cycles, modules, views, custom workflows. Best DX of any OSS PM tool in 2026.',
        highlight: 'Best modern UX',
        license: 'AGPL-3.0',
        stars_approx: 30000,
        self_hosted: true,
      },
      {
        full_name: 'go-vikunja/vikunja',
        short_name: 'Vikunja',
        one_liner: 'Todoist-style task manager with team features. Lighter than Plane, perfect for solo + small teams.',
        highlight: 'Lightest / fastest',
        license: 'AGPL-3.0',
        stars_approx: 5500,
        self_hosted: true,
      },
      {
        full_name: 'leantime/leantime',
        short_name: 'Leantime',
        one_liner: 'PM tool designed for ADHD-friendly workflows. Gantt, kanban, sprints, time tracking, plus designed for non-traditional thinkers.',
        highlight: 'Best for neurodivergent teams',
        license: 'GPL-2.0',
        stars_approx: 6500,
        self_hosted: true,
      },
      {
        full_name: 'kanboard/kanboard',
        short_name: 'Kanboard',
        one_liner: 'Minimalist kanban. PHP, single binary, runs anywhere. Best if you only need a kanban board.',
        highlight: 'Minimalist / self-host on shared hosting',
        license: 'MIT',
        stars_approx: 9000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'notes',
    category: 'Notes / Knowledge base',
    display_name: 'Notes / Personal knowledge',
    query: 'best open source notes app',
    monthly_searches: 2900,
    intro: 'Evernote, Notion, Apple Notes — all lock your data into proprietary formats. The best open-source notes apps in 2026 use plain Markdown files you own forever, with sync, mobile apps, and powerful linking.',
    picks: [
      {
        full_name: 'logseq/logseq',
        short_name: 'Logseq',
        one_liner: 'Outliner-based PKM (personal knowledge management) with bidirectional links, daily journaling, graph view.',
        highlight: 'Best for PKM / Roam-style',
        license: 'AGPL-3.0',
        stars_approx: 35000,
        self_hosted: true,
      },
      {
        full_name: 'siyuan-note/siyuan',
        short_name: 'SiYuan',
        one_liner: 'Notion + Roam hybrid with block editor, kanban, mind map. Local-first, can sync via WebDAV.',
        highlight: 'Most feature-rich',
        license: 'AGPL-3.0',
        stars_approx: 22000,
        self_hosted: true,
      },
      {
        full_name: 'streetwriters/notesnook',
        short_name: 'Notesnook',
        one_liner: 'End-to-end encrypted notes (zero-knowledge). Apple Notes-like UX, fully OSS, free sync.',
        highlight: 'Best for privacy / E2EE',
        license: 'GPL-3.0',
        stars_approx: 12500,
        self_hosted: true,
      },
      {
        full_name: 'standardnotes/app',
        short_name: 'Standard Notes',
        one_liner: 'Minimalist E2EE notes app. Cross-platform sync. Audited security. Free tier covers basic use.',
        highlight: 'Audited E2EE',
        license: 'AGPL-3.0',
        stars_approx: 6000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'ecommerce',
    category: 'E-commerce',
    display_name: 'E-commerce',
    query: 'best open source ecommerce platform',
    monthly_searches: 2700,
    intro: 'Shopify takes 2-3% of every sale forever. WooCommerce is a security nightmare. The best open-source e-commerce platforms in 2026 give you Shopify-grade features with zero transaction fees and full ownership.',
    picks: [
      {
        full_name: 'medusajs/medusa',
        short_name: 'Medusa',
        one_liner: 'Headless commerce with Node/TypeScript. Customizable storefront, plugin ecosystem, multi-region support.',
        highlight: 'Best for developers / modern stack',
        license: 'MIT',
        stars_approx: 26000,
        self_hosted: true,
      },
      {
        full_name: 'vendure-ecommerce/vendure',
        short_name: 'Vendure',
        one_liner: 'NestJS-based headless commerce. Enterprise features (multi-channel, multi-currency, complex tax).',
        highlight: 'Best for enterprise / B2B',
        license: 'MIT',
        stars_approx: 6000,
        self_hosted: true,
      },
      {
        full_name: 'saleor/saleor',
        short_name: 'Saleor',
        one_liner: 'Python/Django headless commerce with GraphQL API. Used by H&M, Lush, others. Mature.',
        highlight: 'Battle-tested at scale',
        license: 'BSD-3-Clause',
        stars_approx: 20000,
        self_hosted: true,
      },
      {
        full_name: 'spree/spree',
        short_name: 'Spree',
        one_liner: 'Ruby on Rails commerce platform. 15-year history, huge ecosystem, large extension library.',
        highlight: 'Largest ecosystem',
        license: 'BSD-3-Clause',
        stars_approx: 13000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'chatbot',
    category: 'AI chatbot',
    display_name: 'AI chatbots',
    query: 'best open source chatbot',
    monthly_searches: 2200,
    intro: 'ChatGPT costs $20/user/month and trains on your conversations. Open-source chatbots in 2026 run on your own hardware (or any cloud GPU), give you full data ownership, and can fine-tune on your domain.',
    picks: [
      {
        full_name: 'open-webui/open-webui',
        short_name: 'OpenWebUI',
        one_liner: 'ChatGPT-clone UI that runs against Ollama or any OpenAI-compatible endpoint. Multi-user, RAG, model switcher.',
        highlight: 'Best UI / closest ChatGPT clone',
        license: 'MIT',
        stars_approx: 65000,
        self_hosted: true,
      },
      {
        full_name: 'lobehub/lobe-chat',
        short_name: 'LobeChat',
        one_liner: 'Premium-looking chat UI with plugin ecosystem, voice synthesis, multi-model support. Beautiful.',
        highlight: 'Best aesthetic / plugins',
        license: 'MIT',
        stars_approx: 50000,
        self_hosted: true,
      },
      {
        full_name: 'mckaywrigley/chatbot-ui',
        short_name: 'Chatbot UI',
        one_liner: 'Simple, ChatGPT-style React frontend. Easy to fork and customize for your own product.',
        highlight: 'Simplest to customize / fork',
        license: 'MIT',
        stars_approx: 30000,
        self_hosted: true,
      },
      {
        full_name: 'huggingface/chat-ui',
        short_name: 'HuggingFace Chat UI',
        one_liner: 'Powers HuggingChat. Production-grade, supports any Inference Endpoint or local model.',
        highlight: 'Battle-tested at scale',
        license: 'Apache-2.0',
        stars_approx: 8000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'password-manager',
    category: 'Password manager',
    display_name: 'Password managers',
    query: 'best open source password manager',
    monthly_searches: 1500,
    intro: '1Password, LastPass, Dashlane — all closed-source services holding your most sensitive data. Open-source password managers let you self-host the vault, audit the code, and avoid breach risk (LastPass had two major breaches in 2022).',
    picks: [
      {
        full_name: 'bitwarden/server',
        short_name: 'Bitwarden',
        one_liner: 'The dominant OSS password manager. Browser ext, mobile apps, free cloud tier, self-host option.',
        highlight: 'Default pick / largest ecosystem',
        license: 'AGPL-3.0',
        stars_approx: 16000,
        self_hosted: true,
      },
      {
        full_name: 'dani-garcia/vaultwarden',
        short_name: 'Vaultwarden',
        one_liner: 'Lightweight Bitwarden server in Rust. Compatible with Bitwarden clients but uses 100× less RAM.',
        highlight: 'Self-host on a Raspberry Pi',
        license: 'AGPL-3.0',
        stars_approx: 47000,
        self_hosted: true,
      },
      {
        full_name: 'keepassxreboot/keepassxc',
        short_name: 'KeePassXC',
        one_liner: 'Local-only password vault — no cloud sync, no server. Your vault file is yours.',
        highlight: 'Local-only / maximum privacy',
        license: 'GPL-3.0',
        stars_approx: 22000,
        self_hosted: true,
      },
      {
        full_name: 'padloc/padloc',
        short_name: 'Padloc',
        one_liner: 'Beautiful modern E2EE password manager. Smaller community than Bitwarden but cleaner UX.',
        highlight: 'Best modern UI',
        license: 'GPL-3.0',
        stars_approx: 1900,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'database',
    category: 'Database',
    display_name: 'Database',
    query: 'best open source database',
    monthly_searches: 1200,
    intro: 'The right open-source database powers everything from a side project to a unicorn SaaS. In 2026, the answer is almost always Postgres — but vector, time-series, and NoSQL use cases have their own winners. Here are the picks by use case.',
    picks: [
      {
        full_name: 'postgres/postgres',
        short_name: 'PostgreSQL',
        one_liner: 'The right default for 95% of apps. JSON support, RLS, extensions (pgvector, PostGIS, TimescaleDB).',
        highlight: 'Default for relational data',
        license: 'PostgreSQL',
        stars_approx: 18000,
        self_hosted: true,
      },
      {
        full_name: 'clickhouse/ClickHouse',
        short_name: 'ClickHouse',
        one_liner: 'Columnar OLAP database. Crushes analytics queries 100-1000× faster than Postgres at billions of rows.',
        highlight: 'Analytics / OLAP at scale',
        license: 'Apache-2.0',
        stars_approx: 38000,
        self_hosted: true,
      },
      {
        full_name: 'duckdb/duckdb',
        short_name: 'DuckDB',
        one_liner: 'SQLite for analytics. Embedded columnar DB, blazingly fast on a single machine. No server needed.',
        highlight: 'Single-machine analytics',
        license: 'MIT',
        stars_approx: 22000,
        self_hosted: true,
      },
      {
        full_name: 'qdrant/qdrant',
        short_name: 'Qdrant',
        one_liner: 'Vector database for AI applications. Production-scale similarity search, written in Rust.',
        highlight: 'Vector / AI workloads',
        license: 'Apache-2.0',
        stars_approx: 22000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'video-editor',
    category: 'Video editor',
    display_name: 'Video editors',
    query: 'best open source video editor',
    monthly_searches: 1800,
    intro: 'Adobe Premiere costs $20/month, Final Cut requires a Mac, DaVinci Resolve free tier is closed-source. The best open-source video editors in 2026 are production-grade and run on every platform.',
    picks: [
      {
        full_name: 'kdenlive/kdenlive',
        short_name: 'Kdenlive',
        one_liner: 'The most mature OSS video editor. Multi-track, transitions, effects, color grading. Cross-platform.',
        highlight: 'Most feature-complete',
        license: 'GPL-3.0',
        stars_approx: 1200,
        self_hosted: true,
      },
      {
        full_name: 'shotcut/shotcut',
        short_name: 'Shotcut',
        one_liner: 'Cross-platform, FFmpeg-based, easier learning curve than Kdenlive. Good for content creators.',
        highlight: 'Easiest learning curve',
        license: 'GPL-3.0',
        stars_approx: 11000,
        self_hosted: true,
      },
      {
        full_name: 'OpenShot/openshot-qt',
        short_name: 'OpenShot',
        one_liner: 'Simple, drag-and-drop video editor for casual use. Good for short YouTube videos / explainers.',
        highlight: 'Most beginner-friendly',
        license: 'GPL-3.0',
        stars_approx: 4500,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'cms',
    category: 'Headless CMS',
    display_name: 'Headless CMS',
    query: 'best open source headless cms',
    monthly_searches: 1300,
    intro: 'WordPress is dying. Contentful is expensive. The best open-source headless CMS in 2026 gives you a beautiful admin UI, code-defined schemas, and a fast API — at zero hosting cost.',
    picks: [
      {
        full_name: 'payloadcms/payload',
        short_name: 'Payload',
        one_liner: 'TypeScript-first headless CMS with code-defined collections, fully customizable admin UI, generated types.',
        highlight: 'Best for TypeScript teams',
        license: 'MIT',
        stars_approx: 30000,
        self_hosted: true,
      },
      {
        full_name: 'strapi/strapi',
        short_name: 'Strapi',
        one_liner: 'Most popular OSS CMS. Plugin marketplace, REST + GraphQL, large community.',
        highlight: 'Largest ecosystem / plugins',
        license: 'SSPL + Enterprise',
        stars_approx: 65000,
        self_hosted: true,
      },
      {
        full_name: 'directus/directus',
        short_name: 'Directus',
        one_liner: 'Wraps any SQL DB as a CMS + auto-generated API. Best for adding CMS to existing data.',
        highlight: 'Wraps existing DBs',
        license: 'BSL 1.1',
        stars_approx: 30000,
        self_hosted: true,
      },
      {
        full_name: 'sanity-io/sanity',
        short_name: 'Sanity (Studio)',
        one_liner: 'Sanity Studio is OSS (the SaaS backend is paid). Code-defined schemas, real-time collaborative editing.',
        highlight: 'Best collaborative editing',
        license: 'MIT (Studio)',
        stars_approx: 5200,
        self_hosted: false,
      },
    ],
  },

  {
    slug: 'analytics',
    category: 'Analytics',
    display_name: 'Analytics',
    query: 'best open source analytics',
    monthly_searches: 900,
    intro: 'Google Analytics is invasive (cookies, GDPR pain) and slow. The best open-source analytics in 2026 are privacy-first, GDPR-safe by default, faster scripts, and (often) more useful insights than GA4.',
    picks: [
      {
        full_name: 'plausible/analytics',
        short_name: 'Plausible',
        one_liner: 'Privacy-first, cookieless, 1KB script. Self-host or use $9/mo cloud. Best for marketing sites.',
        highlight: 'Best for marketing sites',
        license: 'AGPL-3.0',
        stars_approx: 21500,
        self_hosted: true,
      },
      {
        full_name: 'PostHog/posthog',
        short_name: 'PostHog',
        one_liner: 'Full product analytics: funnels, retention, session replay, feature flags, A/B testing.',
        highlight: 'Best for SaaS products',
        license: 'MIT',
        stars_approx: 23000,
        self_hosted: true,
      },
      {
        full_name: 'umami-software/umami',
        short_name: 'Umami',
        one_liner: 'Fully OSS Plausible alternative. Free self-hosting, similar UX, smaller team.',
        highlight: 'Fully free / self-host',
        license: 'MIT',
        stars_approx: 26000,
        self_hosted: true,
      },
      {
        full_name: 'matomo-org/matomo',
        short_name: 'Matomo',
        one_liner: 'The OG GA replacement. Most GA-like features (goals, funnels, heatmaps). Heavier than Plausible.',
        highlight: 'Closest GA feature parity',
        license: 'GPL-3.0',
        stars_approx: 20000,
        self_hosted: true,
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  // AI-VERTICAL EXPANSIONS — May 2026 added batch (~233k mo combined)
  // ═════════════════════════════════════════════════════════════════════

  {
    slug: 'ai-coding-tools-2026',
    category: 'AI coding tools',
    display_name: 'AI Coding Tools',
    query: 'best ai coding tools 2026',
    monthly_searches: 40000,
    intro: 'Every developer in 2026 ships with an AI coding tool — the question is which one. Cursor still leads on Tab autocomplete and IDE polish, but Claude Code dominates terminal-native long-running tasks, Cline is the free in-IDE alternative, and Aider is the OG that nothing has dethroned for git-aware editing. Below are the honest picks ranked by real-world experience, not marketing copy.',
    picks: [
      { full_name: 'getcursor/cursor', short_name: 'Cursor', one_liner: 'The polished AI-first IDE. Tab autocomplete + Composer + Agents. The default pick for most builders in 2026.', highlight: 'Best IDE polish', license: 'Proprietary', stars_approx: 28000, self_hosted: false },
      { full_name: 'anthropics/claude-code', short_name: 'Claude Code', one_liner: 'Terminal-native CLI agent from Anthropic. Best for long-running coding sessions, multi-file refactors, and full app generation.', highlight: 'Best terminal agent', stars_approx: 24000, self_hosted: false },
      { full_name: 'cline/cline', short_name: 'Cline', one_liner: 'VS Code extension that brings Claude/GPT agentic editing into your existing editor. Free, BYO API key.', highlight: 'Best free option', license: 'Apache-2.0', stars_approx: 25000, self_hosted: false },
      { full_name: 'Aider-AI/aider', short_name: 'Aider', one_liner: 'CLI-based git-aware pair programmer. Most surgical edits, best for working on existing large codebases.', highlight: 'Best git integration', license: 'Apache-2.0', stars_approx: 26000, self_hosted: false },
      { full_name: 'Exafunction/codeium', short_name: 'Windsurf', one_liner: 'Codeium\'s agentic IDE. Cascade agent runs multi-step refactors. Strong free tier.', highlight: 'Best generous free tier', stars_approx: 0, self_hosted: false },
      { full_name: 'continuedev/continue', short_name: 'Continue', one_liner: 'Open-source autopilot for VS Code + JetBrains. BYO model, including local Ollama. Most customizable.', highlight: 'Most customizable / OSS', license: 'Apache-2.0', stars_approx: 22000, self_hosted: true },
    ],
  },

  {
    slug: 'ai-image-generators-2026',
    category: 'AI image generators',
    display_name: 'AI Image Generators',
    query: 'best ai image generators 2026',
    monthly_searches: 90000,
    intro: 'AI image generation in 2026 is no longer a "wow demo" — it\'s production tooling for marketing, product, and creative work. Flux dominates on prompt adherence and open weights, Midjourney still wins on aesthetic ceiling, Ideogram nails typography, and Recraft is the new pick for brand-consistent vector + raster output. Below are the picks ranked by real production usage, not marketing.',
    picks: [
      { full_name: 'black-forest-labs/flux', short_name: 'Flux', one_liner: 'Best open-weights image model. Pro tier is paid but Flux.1 dev is open. Best prompt adherence, photo realism on par with Midjourney.', highlight: 'Best open weights', license: 'Apache-2.0 (dev) / Commercial (pro)', stars_approx: 22000, self_hosted: true },
      { full_name: 'midjourney/midjourney', short_name: 'Midjourney v7', one_liner: 'Highest aesthetic ceiling. Still the artist-favorite. Native web app, no Discord. $10-120/mo.', highlight: 'Best aesthetic quality', self_hosted: false },
      { full_name: 'ideogram-ai/ideogram', short_name: 'Ideogram', one_liner: 'Best AI image gen for typography. Renders text correctly inside images. $8-20/mo. Killer for logo and poster generation.', highlight: 'Best typography rendering', self_hosted: false },
      { full_name: 'recraft-ai/recraft', short_name: 'Recraft V3', one_liner: 'Brand-consistent generation. Vector + raster output. Best for design systems and marketing teams that need on-brand outputs.', highlight: 'Best for brand consistency', self_hosted: false },
      { full_name: 'Stability-AI/stable-diffusion', short_name: 'Stable Diffusion 3.5', one_liner: 'Most flexible open-source image generation. SD3.5 Large is competitive with Flux. Self-host on a GPU box.', highlight: 'Most flexible OSS', license: 'Stability Community', stars_approx: 70000, self_hosted: true },
      { full_name: 'lllyasviel/Fooocus', short_name: 'Fooocus', one_liner: 'Easiest local image gen UI. Built on Stable Diffusion. Zero config, looks like Midjourney for self-hosters.', highlight: 'Easiest local install', license: 'GPL-3.0', stars_approx: 40000, self_hosted: true },
    ],
  },

  {
    slug: 'ai-website-builders-2026',
    category: 'AI website builders',
    display_name: 'AI Website Builders',
    query: 'best ai website builders 2026',
    monthly_searches: 50000,
    intro: 'AI website builders went from "look at the prompt" toys in 2023 to production tools in 2026. v0 dominates shadcn-native generation, Lovable owns the full-app + Supabase backend integration, Bolt has the cleanest Stackblitz preview, and Replit ships with a hosted environment. Below are the picks ranked by what actually ships, not what looks impressive in demos.',
    picks: [
      { full_name: 'vercel/v0', short_name: 'v0', one_liner: 'Vercel\'s shadcn-native generator. Outputs production Next.js + Tailwind. Best for polished marketing sites + dashboards.', highlight: 'Best for production Next.js', self_hosted: false },
      { full_name: 'lovable/lovable', short_name: 'Lovable', one_liner: 'Full-app generator with Supabase integration baked in. Auth, DB, payments wired automatically. Ships deployable SaaS in one prompt.', highlight: 'Best for full-stack SaaS', self_hosted: false },
      { full_name: 'stackblitz/bolt', short_name: 'Bolt.new', one_liner: 'Stackblitz-powered live env. See your app running as it\'s built. Best for prototyping and learning AI builders.', highlight: 'Best live preview', self_hosted: false },
      { full_name: 'replit/replit', short_name: 'Replit Agent', one_liner: 'AI agent + hosted environment. Builds + deploys in browser. Best for non-devs and quick MVPs.', highlight: 'Best for non-developers', self_hosted: false },
      { full_name: 'codeium/windsurf', short_name: 'Windsurf', one_liner: 'IDE + agent for engineers who want control. Slower iteration than v0 but better for complex apps.', highlight: 'Best for engineers', self_hosted: false },
    ],
  },

  {
    slug: 'local-llms-2026',
    category: 'Local LLMs',
    display_name: 'Local LLMs',
    query: 'best local llm 2026',
    monthly_searches: 18000,
    intro: 'Running LLMs locally in 2026 is no longer a hacker pastime — it\'s the privacy-first default for sensitive work. Llama 3.3 70B matches GPT-4o on most benchmarks, DeepSeek-R1 brings frontier reasoning to consumer hardware, and Ollama makes the whole thing one command. Below are the picks for offline/private AI ranked by real production usage.',
    picks: [
      { full_name: 'ollama/ollama', short_name: 'Ollama', one_liner: 'Easiest local LLM runner. One install, one command. Mac/Linux/Windows. The default for 90% of local LLM use cases.', highlight: 'Easiest install', license: 'MIT', stars_approx: 110000, self_hosted: true },
      { full_name: 'lmstudio-ai/lmstudio', short_name: 'LM Studio', one_liner: 'Desktop GUI for local LLMs. Beautiful interface, model browser, easy quantization picking. Best for non-CLI users.', highlight: 'Best GUI', self_hosted: true },
      { full_name: 'ggml-org/llama.cpp', short_name: 'llama.cpp', one_liner: 'The C++ engine under Ollama and LM Studio. Direct usage gives max performance + custom integrations.', highlight: 'Max performance', license: 'MIT', stars_approx: 70000, self_hosted: true },
      { full_name: 'oobabooga/text-generation-webui', short_name: 'Text Generation WebUI', one_liner: 'Featureful web UI for local LLMs. Character cards, RAG, extensions. Best if you want to tinker.', highlight: 'Most features', license: 'AGPL-3.0', stars_approx: 42000, self_hosted: true },
      { full_name: 'ml-explore/mlx-examples', short_name: 'MLX (Apple)', one_liner: 'Apple Silicon-native ML framework. 2-3x faster than llama.cpp on M-series chips. Best for Mac users.', highlight: 'Fastest on Apple Silicon', license: 'MIT', stars_approx: 7000, self_hosted: true },
      { full_name: 'open-webui/open-webui', short_name: 'Open WebUI', one_liner: 'ChatGPT-clone interface that connects to your local Ollama. RAG over docs, multi-user, image gen. The full local AI stack.', highlight: 'Best chat UI', license: 'MIT', stars_approx: 65000, self_hosted: true },
    ],
  },

  {
    slug: 'vector-databases-2026',
    category: 'Vector databases',
    display_name: 'Vector Databases',
    query: 'best vector database 2026',
    monthly_searches: 15000,
    intro: 'Every RAG app needs a vector database. The question in 2026 is no longer "Pinecone or build your own" — it\'s which open-source option fits your stack. pgvector wins if you already use Postgres. Qdrant leads on pure-vector performance. Chroma is the easiest start. Weaviate has the best hybrid (keyword + vector) search. Below are the honest picks for production AI apps.',
    picks: [
      { full_name: 'pgvector/pgvector', short_name: 'pgvector', one_liner: 'Postgres extension for vector search. The default if you already use Supabase, Neon, or Postgres. Production-ready.', highlight: 'Best if you use Postgres', license: 'PostgreSQL', stars_approx: 13000, self_hosted: true },
      { full_name: 'qdrant/qdrant', short_name: 'Qdrant', one_liner: 'Rust-based dedicated vector DB. Best raw performance + filtering. Hosted cloud or self-host with one Docker container.', highlight: 'Best raw performance', license: 'Apache-2.0', stars_approx: 22000, self_hosted: true },
      { full_name: 'chroma-core/chroma', short_name: 'Chroma', one_liner: 'Easiest start. `pip install chromadb` and you have a vector DB. Best for prototyping + sub-100k embeddings.', highlight: 'Easiest to start', license: 'Apache-2.0', stars_approx: 16000, self_hosted: true },
      { full_name: 'weaviate/weaviate', short_name: 'Weaviate', one_liner: 'Hybrid search (vector + keyword + filters). Best when search relevance matters more than pure semantic similarity.', highlight: 'Best hybrid search', license: 'BSD-3-Clause', stars_approx: 12000, self_hosted: true },
      { full_name: 'milvus-io/milvus', short_name: 'Milvus', one_liner: 'Largest-scale vector DB. Billion+ vectors. Pick this when you outgrow others. Heavy to operate but unmatched at scale.', highlight: 'Best at billion+ scale', license: 'Apache-2.0', stars_approx: 30000, self_hosted: true },
      { full_name: 'lancedb/lancedb', short_name: 'LanceDB', one_liner: 'Embedded vector DB (think SQLite for vectors). Zero infra. Best for on-device or edge-deployed AI.', highlight: 'Embedded / on-device', license: 'Apache-2.0', stars_approx: 4500, self_hosted: true },
    ],
  },

  {
    slug: 'ai-video-generation-2026',
    category: 'AI video generation',
    display_name: 'AI Video Generation Tools',
    query: 'best ai video generators 2026',
    monthly_searches: 35000,
    intro: 'AI video in 2026 finally crossed the "actually usable" threshold. Sora 2 dominates physics + character consistency, Veo 3.5 has the best motion quality, Kling 2.5 offers the cheapest production-grade output, Hailuo nails character animation, and Runway is still the editor of choice. Below are the honest picks ranked by what actually ships in real marketing campaigns.',
    picks: [
      { full_name: 'openai/sora', short_name: 'Sora 2', one_liner: 'Best motion physics + character consistency. $20-200/mo. Killer for product reveals and cinematic shots.', highlight: 'Best motion physics', self_hosted: false },
      { full_name: 'google-deepmind/veo', short_name: 'Veo 3.5', one_liner: 'Google\'s flagship. Best lip-sync, native audio generation, 1080p output. Bundled in Google AI Pro.', highlight: 'Best audio + lip-sync', self_hosted: false },
      { full_name: 'kuaishou/kling', short_name: 'Kling 2.5', one_liner: 'Chinese model with cinematic output at 5-10x cheaper than Sora. $10-90/mo. Killer ROI for short-form video.', highlight: 'Best price/quality ratio', self_hosted: false },
      { full_name: 'minimaxi/hailuo', short_name: 'Hailuo AI', one_liner: 'Best character animation + lip-sync at consumer prices. $10-30/mo. The pick for character-driven content.', highlight: 'Best character animation', self_hosted: false },
      { full_name: 'runwayml/runway', short_name: 'Runway Gen-4', one_liner: 'Full video editor + generation suite. Image-to-video, motion brush, lip-sync. Best for editors who need full pipeline.', highlight: 'Best editor + suite', self_hosted: false },
      { full_name: 'pika-ai/pika', short_name: 'Pika 2.5', one_liner: 'Indie favorite. Strong character consistency, good motion, $10-70/mo. Best community + ecosystem.', highlight: 'Best community / indie', self_hosted: false },
    ],
  },

  {
    slug: 'ai-agent-frameworks-2026',
    category: 'AI agent frameworks',
    display_name: 'AI Agent Frameworks',
    query: 'best ai agent framework 2026',
    monthly_searches: 14000,
    intro: 'AI agent frameworks in 2026 fragmented into clear niches. LangGraph wins for production stateful agents. CrewAI dominates multi-agent role-based workflows. AutoGen leads research + tool use. Mastra is the new TypeScript-native pick. Pydantic AI offers the cleanest type-safe API. Below are the picks ranked by what real teams ship in production.',
    picks: [
      { full_name: 'langchain-ai/langgraph', short_name: 'LangGraph', one_liner: 'Production stateful agent orchestration from LangChain. Best for complex multi-step workflows with retries and human-in-the-loop.', highlight: 'Best for production agents', license: 'MIT', stars_approx: 14000, self_hosted: true },
      { full_name: 'crewAIInc/crewAI', short_name: 'CrewAI', one_liner: 'Multi-agent role-based orchestration. Define a "research crew" or "writing crew" with specialized agent personas. Most intuitive API.', highlight: 'Best multi-agent UX', license: 'MIT', stars_approx: 30000, self_hosted: true },
      { full_name: 'microsoft/autogen', short_name: 'AutoGen', one_liner: 'Microsoft\'s framework for research-grade multi-agent systems. Strong on tool use and code execution sandboxes.', highlight: 'Best for research', license: 'CC-BY-4.0', stars_approx: 36000, self_hosted: true },
      { full_name: 'pydantic/pydantic-ai', short_name: 'Pydantic AI', one_liner: 'Type-safe agent framework. Cleanest API of any agent library. Best if you want strict validation + clear interfaces.', highlight: 'Best type safety', license: 'MIT', stars_approx: 7000, self_hosted: true },
      { full_name: 'mastra-ai/mastra', short_name: 'Mastra', one_liner: 'TypeScript-native agent framework. Built by the Gatsby team. Best for JS/TS shops that don\'t want to drop into Python.', highlight: 'Best for TypeScript', license: 'Elastic-2.0', stars_approx: 8000, self_hosted: true },
      { full_name: 'pydantic/logfire', short_name: 'Logfire', one_liner: 'Observability layer for agents. Pair with any framework above. Tracks every LLM call + tool use + retry with deep filtering.', highlight: 'Best agent observability', license: 'MIT', stars_approx: 2200, self_hosted: true },
    ],
  },
];

export function getBestOfBySlug(slug: string): BestOfPage | undefined {
  return BEST_OF.find((b) => b.slug === slug);
}

export function getAllBestOfSlugs(): string[] {
  return BEST_OF.map((b) => b.slug);
}
