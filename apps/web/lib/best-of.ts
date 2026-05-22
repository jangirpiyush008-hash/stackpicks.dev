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
];

export function getBestOfBySlug(slug: string): BestOfPage | undefined {
  return BEST_OF.find((b) => b.slug === slug);
}

export function getAllBestOfSlugs(): string[] {
  return BEST_OF.map((b) => b.slug);
}
