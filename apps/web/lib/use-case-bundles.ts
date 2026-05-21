/**
 * Use-case bundles — high-intent "I want to build X" stacks.
 * Each bundle aggregates the repos a builder needs to ship that thing end-to-end.
 * Repo full_names must exist in scripts/seed-data.ts; the bundle page will
 * stitch them with the curator take from the seed data.
 */

export interface BundleRepo {
  full_name: string;
  reason: string; // one-line "why is this in the bundle"
}

export interface BundleSection {
  title: string;
  repos: BundleRepo[];
}

export interface UseCaseBundle {
  slug: string;
  title: string;
  pitch: string; // one-line marketing pitch
  description: string; // 2-3 sentence overview
  icon: string; // lucide icon name
  gradient: string; // tailwind gradient (e.g. 'from-fuchsia-500 to-indigo-500')
  difficulty: 'weekend' | 'two-weeks' | 'one-month';
  outcome: string; // what you'll have at the end (one sentence)
  sections: BundleSection[];
  keywords: string[]; // for search ranking
}

export const USE_CASE_BUNDLES: UseCaseBundle[] = [
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'ship-a-saas',
    title: 'Ship a SaaS',
    pitch: 'Auth, payments, database, email — every brick to launch a paid product.',
    description:
      'A complete stack for a paid product with users, subscriptions, transactional email, analytics, and a polished UI. Every repo here is one we would actually ship with — the boring choices that compound.',
    icon: 'rocket',
    gradient: 'from-fuchsia-500/60 via-indigo-500/40 to-cyan-500/30',
    difficulty: 'two-weeks',
    outcome: 'A multi-tenant SaaS with paid signup, dashboard, billing, and email — all on one stack.',
    sections: [
      {
        title: 'Framework + UI',
        repos: [
          { full_name: 'vercel/next.js', reason: 'App router + server actions + ISR — the default for shipping fast in 2026.' },
          { full_name: 'shadcn-ui/ui', reason: 'Copy-paste components built on Radix. You own the code, you own the look.' },
          { full_name: 'radix-ui/primitives', reason: 'Accessibility primitives under the hood. Use directly when shadcn is overkill.' },
        ],
      },
      {
        title: 'Auth',
        repos: [
          { full_name: 'better-auth/better-auth', reason: 'The new default — replaces NextAuth in 2026. Type-safe, plugin-driven.' },
          { full_name: 'lucia-auth/lucia', reason: 'For when you want minimal magic — Lucia gives you raw building blocks.' },
        ],
      },
      {
        title: 'Database + ORM',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Postgres + Auth + Storage + Edge Functions. The fastest path to a backend.' },
          { full_name: 'drizzle-team/drizzle-orm', reason: 'SQL-first ORM with codegen. Pairs cleanly with Supabase Postgres.' },
        ],
      },
      {
        title: 'Payments (India + global)',
        repos: [
          { full_name: 'razorpay/razorpay-node', reason: 'INR payments, UPI, subscriptions — mandatory if you have Indian customers.' },
          { full_name: 'stripe/stripe-node', reason: 'For international customers. Pair with Razorpay for full-world coverage.' },
        ],
      },
      {
        title: 'Forms + Validation',
        repos: [
          { full_name: 'colinhacks/zod', reason: 'Schema validation on client and server. Use the same Zod schema everywhere.' },
          { full_name: 'react-hook-form/react-hook-form', reason: 'The form library with the least magic and the best DX.' },
        ],
      },
      {
        title: 'Email',
        repos: [
          { full_name: 'resend/react-email', reason: 'React components for email. Resend SDK pairs with it natively.' },
        ],
      },
      {
        title: 'State + Data',
        repos: [
          { full_name: 'TanStack/query', reason: 'Server state caching. The cure for useEffect spaghetti.' },
          { full_name: 'pmndrs/zustand', reason: 'Tiny client-state store. Use for UI state, not data.' },
        ],
      },
      {
        title: 'Analytics',
        repos: [
          { full_name: 'plausible/analytics', reason: 'Privacy-friendly, cookie-free, GDPR/DPDP ready.' },
          { full_name: 'PostHog/posthog', reason: 'When you need session replay or feature flags later.' },
          { full_name: 'umami-software/umami', reason: 'Self-host on a ₹500 VPS if you want full data ownership.' },
        ],
      },
      {
        title: 'Animation + polish',
        repos: [
          { full_name: 'framer/motion', reason: 'Production motion library. Required for landing pages that need to feel premium.' },
        ],
      },
      {
        title: 'Search inside your app',
        repos: [
          { full_name: 'meilisearch/meilisearch', reason: 'Typo-tolerant full-text search for docs/help/inventory. Self-host on the same VPS.' },
          { full_name: 'typesense/typesense', reason: 'Alternative with strong faceting. Cloud option if you do not want to self-host.' },
        ],
      },
      {
        title: 'CMS for editorial content',
        repos: [
          { full_name: 'payloadcms/payload', reason: 'TS-native CMS for the blog and changelog. Sits next to your app code.' },
        ],
      },
      {
        title: 'Tooling',
        repos: [
          { full_name: 'biomejs/biome', reason: 'Linter + formatter + import sorter in one binary. 10x faster than ESLint + Prettier.' },
          { full_name: 'pnpm/pnpm', reason: 'Workspaces for monorepos. Web + mobile + scripts in one repo.' },
          { full_name: 'turbo-build/turbo', reason: 'Build cache across the monorepo. Skips unchanged work in CI.' },
          { full_name: 'vitest-dev/vitest', reason: 'Test runner that just works with TS/ESM.' },
          { full_name: 'microsoft/playwright', reason: 'E2E tests for the signup → checkout flow. Don\'t ship without these.' },
        ],
      },
      {
        title: 'Icons',
        repos: [
          { full_name: 'lucide-icons/lucide', reason: '1500+ icons, tree-shakable, fits any design.' },
        ],
      },
    ],
    keywords: ['saas', 'app', 'subscription', 'product', 'launch', 'startup'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'mobile-app',
    title: 'Build a Mobile App',
    pitch: 'Expo + React Native + the same backend as your web app.',
    description:
      'A native iOS + Android app shipped from one codebase, using Expo for the boring parts (builds, updates, push notifications) and the same Supabase + Razorpay backend as your web app.',
    icon: 'smartphone',
    gradient: 'from-violet-500/60 via-pink-500/40 to-orange-400/30',
    difficulty: 'two-weeks',
    outcome: 'An iOS + Android app on the App Store and Play Store sharing one TypeScript codebase.',
    sections: [
      {
        title: 'Core',
        repos: [
          { full_name: 'expo/expo', reason: 'OTA updates, EAS Build, push, file system — RN without the platform pain.' },
          { full_name: 'facebook/react-native', reason: 'Under Expo. You will not touch it directly until you need a native module.' },
        ],
      },
      {
        title: 'UI',
        repos: [
          { full_name: 'nativewind/nativewind', reason: 'Tailwind in React Native. Same className API as your web app.' },
          { full_name: 'tamagui/tamagui', reason: 'The other choice — universal RN + web components with a compiler. Heavier setup but extreme performance.' },
        ],
      },
      {
        title: 'State + Data',
        repos: [
          { full_name: 'TanStack/query', reason: 'Same data layer as web — caches, refetches, optimistic updates.' },
          { full_name: 'pmndrs/zustand', reason: 'Client state. Persists with AsyncStorage in two lines.' },
        ],
      },
      {
        title: 'Backend',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Auth + DB + Storage with React Native SDK. RLS protects you from a leaky mobile client.' },
        ],
      },
      {
        title: 'Forms',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', reason: 'Works on RN identically. Reuse schemas from web.' },
          { full_name: 'colinhacks/zod', reason: 'One schema, both apps. Catch typos at compile time.' },
        ],
      },
      {
        title: 'Payments',
        repos: [
          { full_name: 'razorpay/razorpay-node', reason: 'Razorpay has a React Native SDK with UPI Intent built in.' },
        ],
      },
      {
        title: 'Animation + gestures',
        repos: [
          { full_name: 'software-mansion/react-native-reanimated', reason: 'Animations that run on the UI thread. Mandatory for production-feel apps.' },
          { full_name: 'software-mansion/react-native-gesture-handler', reason: 'Native gesture system. Pair with Reanimated for swipeable lists.' },
        ],
      },
      {
        title: 'Storage + offline',
        repos: [
          { full_name: 'mrousavy/react-native-mmkv', reason: 'Fastest mobile key-value store. Replaces AsyncStorage everywhere.' },
        ],
      },
      {
        title: 'Push notifications',
        repos: [
          { full_name: 'expo/expo', reason: 'Expo Notifications API handles iOS + Android push with one call.' },
        ],
      },
      {
        title: 'Icons + media',
        repos: [
          { full_name: 'lucide-icons/lucide', reason: 'Works in RN via the lucide-react-native package.' },
        ],
      },
    ],
    keywords: ['mobile', 'app', 'ios', 'android', 'react-native', 'expo'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-agent',
    title: 'Build an AI Agent / RAG App',
    pitch: 'Vector DB, LLM client, embeddings, agent loop — the full stack.',
    description:
      'A retrieval-augmented assistant that ingests your docs, retrieves over a vector store, and runs a model with tool use. Local-first if you want privacy, or cloud LLMs if you want speed.',
    icon: 'brain',
    gradient: 'from-emerald-400/60 via-cyan-500/40 to-blue-500/30',
    difficulty: 'two-weeks',
    outcome: 'An agent that answers questions over your data with citations, runs locally or in the cloud.',
    sections: [
      {
        title: 'Vector storage',
        repos: [
          { full_name: 'pgvector/pgvector', reason: 'Postgres extension. If you already have Postgres, do not add another DB.' },
          { full_name: 'chroma-core/chroma', reason: 'Embedded or server. The easiest first vector DB before scale.' },
          { full_name: 'weaviate/weaviate', reason: 'When you need hybrid search and module-rich pipelines.' },
          { full_name: 'milvus-io/milvus', reason: 'Battle-tested at billions of vectors. Overkill for v1.' },
        ],
      },
      {
        title: 'Local LLM',
        repos: [
          { full_name: 'ollama/ollama', reason: 'Run Llama 3, Qwen, Mistral on your machine. One curl install, full local privacy.' },
        ],
      },
      {
        title: 'Framework + UI',
        repos: [
          { full_name: 'vercel/next.js', reason: 'Streaming responses, server actions, API routes — RAG fits naturally.' },
          { full_name: 'shadcn-ui/ui', reason: 'Chat UI primitives, message list, command palette.' },
          { full_name: 'ueberdosis/tiptap', reason: 'Rich-text composer for the chat input. Slash commands, mentions, the works.' },
        ],
      },
      {
        title: 'Data layer',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Postgres for state + pgvector for embeddings + Auth for user gating.' },
        ],
      },
      {
        title: 'Background jobs (embedding indexing)',
        repos: [],
      },
    ],
    keywords: ['ai', 'agent', 'rag', 'llm', 'embeddings', 'vector', 'chatbot'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-website',
    title: 'Build a Marketing Website',
    pitch: 'Fast, indexable, animated — Astro or Next with the right primitives.',
    description:
      'A landing page or content site that loads instantly, ranks well, and looks like you spent more on it than you did. Astro for content-heavy, Next.js if you also need auth/payments later.',
    icon: 'globe',
    gradient: 'from-cyan-400/60 via-blue-500/40 to-indigo-500/30',
    difficulty: 'weekend',
    outcome: 'A multi-page marketing site with blog, SEO meta, OG images, dark mode, and analytics.',
    sections: [
      {
        title: 'Framework',
        repos: [
          { full_name: 'withastro/astro', reason: 'Ship static-first. Ship less JS. Use when there is no auth or dashboards.' },
          { full_name: 'vercel/next.js', reason: 'Use Next when you know auth/payments are coming and want one codebase.' },
        ],
      },
      {
        title: 'UI + Animation',
        repos: [
          { full_name: 'shadcn-ui/ui', reason: 'Hero, pricing, FAQ, navbar — copy in, customize, ship.' },
        ],
      },
      {
        title: 'CMS',
        repos: [
          { full_name: 'payloadcms/payload', reason: 'TypeScript-native, self-hostable, great for marketing teams who edit content.' },
          { full_name: 'directus/directus', reason: 'Postgres-backed admin UI. Great when content lives in a relational DB.' },
        ],
      },
      {
        title: 'Forms + Email capture',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', reason: 'Newsletter forms, contact forms — no client state library needed.' },
          { full_name: 'resend/react-email', reason: 'Branded welcome email and double opt-in templates.' },
        ],
      },
      {
        title: 'Analytics',
        repos: [
          { full_name: 'plausible/analytics', reason: 'No cookie banner needed. Lighthouse score stays at 100.' },
          { full_name: 'umami-software/umami', reason: 'Self-hostable alternative if you have a VPS.' },
        ],
      },
    ],
    keywords: ['marketing', 'landing', 'website', 'site', 'content', 'blog', 'seo'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'internal-dashboard',
    title: 'Build an Internal Dashboard',
    pitch: 'Tables, charts, filters, exports — fast to build, never a brand.',
    description:
      'The opposite of a marketing site: a dense, function-first admin tool for your team or your customers\' ops. Material UI for speed, custom shadcn if you must brand it.',
    icon: 'layout-dashboard',
    gradient: 'from-amber-400/60 via-orange-500/40 to-rose-500/30',
    difficulty: 'one-month',
    outcome: 'A multi-page admin with auth, role-based access, data tables, charts, and CSV export.',
    sections: [
      {
        title: 'Framework + UI',
        repos: [
          { full_name: 'vercel/next.js', reason: 'Server components keep heavy queries off the client.' },
          { full_name: 'mui/material-ui', reason: 'Faster to assemble dense admin UIs than rebuilding shadcn primitives.' },
        ],
      },
      {
        title: 'Tables + Data',
        repos: [
          { full_name: 'TanStack/db', reason: 'Reactive client store synced from server. The new pattern for dashboards.' },
          { full_name: 'TanStack/query', reason: 'When you want pure server-state caching without the store layer.' },
        ],
      },
      {
        title: 'Charts',
        repos: [
          { full_name: 'recharts/recharts', reason: 'Decent defaults, decent API. The pragmatic React choice.' },
          { full_name: 'apache/echarts', reason: 'When you need real interactivity — zooming, brushing, large datasets.' },
          { full_name: 'd3/d3', reason: 'When the chart you need does not exist anywhere else.' },
        ],
      },
      {
        title: 'DB + Auth',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Postgres + Auth + Storage. RLS lets you build role-based views without code.' },
          { full_name: 'drizzle-team/drizzle-orm', reason: 'Type-safe SQL queries for the dashboard. Pairs with Supabase.' },
        ],
      },
      {
        title: 'Forms + Validation',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', reason: 'Edit forms, filters, multi-step wizards.' },
          { full_name: 'colinhacks/zod', reason: 'Schema validation that backs Postgres column types.' },
        ],
      },
    ],
    keywords: ['admin', 'dashboard', 'internal', 'ops', 'crm', 'b2b'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'chrome-extension',
    title: 'Build a Chrome Extension',
    pitch: 'TypeScript + Vite + Manifest V3 — and reuse your React skills.',
    description:
      'A Chrome / Edge / Brave extension with a popup, a side panel, content scripts, and a backend that stores user data. Useful for productivity tools, scrapers, and AI-augmented browsing.',
    icon: 'chrome',
    gradient: 'from-yellow-400/60 via-amber-500/40 to-red-500/30',
    difficulty: 'weekend',
    outcome: 'A published Chrome extension with a polished popup, settings page, and cloud sync.',
    sections: [
      {
        title: 'Build tooling',
        repos: [
          { full_name: 'vitejs/vite', reason: 'Fastest bundler for the extension content + popup. Use the @crxjs/vite-plugin alongside.' },
          { full_name: 'oven-sh/bun', reason: 'Alternative for the dev script runner. Faster cold starts than Node.' },
          { full_name: 'biomejs/biome', reason: 'Single tool that lints + formats faster than ESLint + Prettier.' },
        ],
      },
      {
        title: 'UI in popup + side panel',
        repos: [
          { full_name: 'shadcn-ui/ui', reason: 'Small primitives that fit popup constraints (380px width).' },
          { full_name: 'radix-ui/primitives', reason: 'Headless dialogs, popovers — kept compact for the constrained surface.' },
        ],
      },
      {
        title: 'State + Storage',
        repos: [
          { full_name: 'pmndrs/zustand', reason: 'Persist to chrome.storage in two lines. Survives popup re-open.' },
          { full_name: 'colinhacks/zod', reason: 'Validate everything coming across the content-script boundary.' },
        ],
      },
      {
        title: 'Backend / sync',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Auth + sync. Pair with Magic Link login since extensions cannot do redirect OAuth easily.' },
        ],
      },
    ],
    keywords: ['chrome', 'extension', 'browser', 'plugin', 'addon'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'automation-workflow',
    title: 'Build an Automation Workflow',
    pitch: 'Triggers, queues, retries, observability — production-grade jobs.',
    description:
      'Background workflows that run on schedules or webhooks: scrapers, email senders, AI batch jobs, notifications. Pair a job runner with Postgres and you have a production-grade automation platform.',
    icon: 'workflow',
    gradient: 'from-green-400/60 via-teal-500/40 to-cyan-500/30',
    difficulty: 'weekend',
    outcome: 'A workflow service that runs scheduled jobs, retries on failure, and exposes a UI.',
    sections: [
      {
        title: 'Job orchestration',
        repos: [],
      },
      {
        title: 'Database + queues',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Postgres + cron + Edge Functions. Sufficient for most v1 automation.' },
          { full_name: 'drizzle-team/drizzle-orm', reason: 'Type-safe queries for the job state tables.' },
        ],
      },
      {
        title: 'Webhooks + payments',
        repos: [
          { full_name: 'razorpay/razorpay-node', reason: 'If your automation reacts to Razorpay events (subscription renewals, etc.).' },
        ],
      },
      {
        title: 'Email + notifications',
        repos: [
          { full_name: 'resend/react-email', reason: 'Compose, send, monitor — Resend has webhooks for delivery state.' },
        ],
      },
      {
        title: 'Observability',
        repos: [
          { full_name: 'PostHog/posthog', reason: 'Custom events for job lifecycle. Funnels show where jobs fail.' },
        ],
      },
    ],
    keywords: ['automation', 'workflow', 'cron', 'jobs', 'background', 'webhook'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-stack',
    title: 'Marketing Stack',
    pitch: 'Email, analytics, A/B, SEO, copy tooling — for growth, not just looks.',
    description:
      'Everything a marketer or solo founder needs to capture, measure, segment, and re-engage users. Skip the bloated all-in-ones — these are the focused, open-source pieces that compose.',
    icon: 'megaphone',
    gradient: 'from-pink-500/60 via-rose-400/40 to-amber-400/30',
    difficulty: 'weekend',
    outcome: 'A full growth toolchain: email capture, analytics, A/B, SEO, content management.',
    sections: [
      {
        title: 'Analytics + A/B',
        repos: [
          { full_name: 'plausible/analytics', reason: 'Page views, referrers, GDPR-safe. The first analytics you install.' },
          { full_name: 'PostHog/posthog', reason: 'Feature flags + experimentation + session replay when Plausible runs out.' },
          { full_name: 'umami-software/umami', reason: 'Self-host on a ₹500/mo VPS. Privacy + cost.' },
        ],
      },
      {
        title: 'Email + newsletters',
        repos: [
          { full_name: 'resend/react-email', reason: 'React components for transactional and broadcast emails.' },
          { full_name: 'maizzle/maizzle', reason: 'Tailwind for email. Best for marketing teams who design with utility classes.' },
        ],
      },
      {
        title: 'Content + SEO',
        repos: [
          { full_name: 'payloadcms/payload', reason: 'Content models, drafts, scheduled publishing — built for editorial teams.' },
          { full_name: 'strapi/strapi', reason: 'When the marketing team wants a more click-driven admin.' },
        ],
      },
      {
        title: 'Search on your own site',
        repos: [
          { full_name: 'meilisearch/meilisearch', reason: 'Typo-tolerant search for blog + docs. Self-host on the same VPS as Umami.' },
          { full_name: 'typesense/typesense', reason: 'Alternative — strong faceting, real-time index.' },
          { full_name: 'orama/orama', reason: 'Run search in the browser. Zero backend.' },
        ],
      },
    ],
    keywords: ['marketing', 'growth', 'seo', 'email', 'analytics', 'content'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'sales-crm-stack',
    title: 'Sales + CRM Stack',
    pitch: 'Lead capture, pipeline, sequenced outreach, INR billing.',
    description:
      'A lightweight CRM you control. Open-source pieces glued with Supabase + Razorpay + a couple of background workers. Cheaper than HubSpot, more honest with your data.',
    icon: 'handshake',
    gradient: 'from-orange-400/60 via-red-500/40 to-pink-500/30',
    difficulty: 'two-weeks',
    outcome: 'A CRM with lead capture, kanban pipelines, automated email sequences, and INR invoicing.',
    sections: [
      {
        title: 'Backend',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Postgres for the contact graph + Auth for sales team logins.' },
          { full_name: 'drizzle-team/drizzle-orm', reason: 'Query patterns get complex fast — type safety pays.' },
        ],
      },
      {
        title: 'UI + Pipeline',
        repos: [
          { full_name: 'shadcn-ui/ui', reason: 'Card, dialog, table, command — every CRM component fits in shadcn primitives.' },
          { full_name: 'mui/material-ui', reason: 'Faster for dense admin tables when you do not care about visual differentiation.' },
        ],
      },
      {
        title: 'Forms + Lead capture',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', reason: 'Public lead forms + internal edit forms — same library.' },
          { full_name: 'colinhacks/zod', reason: 'Shared schema with the public site.' },
        ],
      },
      {
        title: 'Email sequences',
        repos: [
          { full_name: 'resend/react-email', reason: 'Branded outbound sequences. Track opens, schedule sends.' },
        ],
      },
      {
        title: 'Billing (India + global)',
        repos: [
          { full_name: 'razorpay/razorpay-node', reason: 'Generate INR invoices with GSTIN compliance — required for B2B in India.' },
        ],
      },
    ],
    keywords: ['sales', 'crm', 'leads', 'pipeline', 'b2b', 'invoicing'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'e-commerce',
    title: 'Build an E-commerce Store',
    pitch: 'Product catalog, cart, checkout, INR + UPI — own the funnel.',
    description:
      'A storefront on your domain, not someone else\'s. Use a headless commerce backend with a Next.js storefront and Razorpay checkout. India-first, Shopify-replaceable.',
    icon: 'shopping-bag',
    gradient: 'from-emerald-500/60 via-teal-500/40 to-sky-500/30',
    difficulty: 'two-weeks',
    outcome: 'A storefront with catalog, cart, INR/UPI checkout, order tracking, and admin.',
    sections: [
      {
        title: 'Commerce backend',
        repos: [
          { full_name: 'medusajs/medusa', reason: 'Modular headless commerce — own the data, swap any module.' },
        ],
      },
      {
        title: 'Storefront',
        repos: [
          { full_name: 'vercel/next.js', reason: 'App router gives you streaming product pages + edge cache.' },
          { full_name: 'shadcn-ui/ui', reason: 'Cart drawer, product card, dialog flows — straight out of the box.' },
        ],
      },
      {
        title: 'Payments',
        repos: [
          { full_name: 'razorpay/razorpay-node', reason: 'UPI, cards, netbanking, EMI — the right rail for Indian retail.' },
        ],
      },
      {
        title: 'Search',
        repos: [
          { full_name: 'meilisearch/meilisearch', reason: 'Typo-tolerant product search. ms-level response.' },
          { full_name: 'typesense/typesense', reason: 'Faceted search across categories.' },
        ],
      },
      {
        title: 'Email + ops',
        repos: [
          { full_name: 'resend/react-email', reason: 'Order confirmation, shipping, abandoned cart — all branded.' },
        ],
      },
    ],
    keywords: ['ecommerce', 'shop', 'store', 'cart', 'checkout', 'retail'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'developer-tools',
    title: 'Build a Developer Tool / CLI',
    pitch: 'Bun + biome + tsx — modern tooling that does not feel modern.',
    description:
      'A CLI, a SaaS for developers, or a paid dev-tool — the meta-game of selling shovels. Lean on the same tools StackPicks itself was built with.',
    icon: 'terminal',
    gradient: 'from-slate-400/60 via-zinc-500/40 to-stone-500/30',
    difficulty: 'weekend',
    outcome: 'A published CLI on npm + a paid dashboard for power users.',
    sections: [
      {
        title: 'Runtime + tooling',
        repos: [
          { full_name: 'oven-sh/bun', reason: 'Standalone executable bundling. Distribute one binary, no Node prerequisite.' },
          { full_name: 'biomejs/biome', reason: 'One tool: linter + formatter + import sorter. Fewer config files.' },
          { full_name: 'pnpm/pnpm', reason: 'Workspaces. If your CLI has a monorepo of subcommands, pnpm is the right choice.' },
          { full_name: 'turbo-build/turbo', reason: 'Build caching across the monorepo. Skips work when nothing changed.' },
        ],
      },
      {
        title: 'Testing',
        repos: [
          { full_name: 'vitest-dev/vitest', reason: 'Vitest just works with TypeScript and ESM. The cleanest test runner.' },
        ],
      },
      {
        title: 'Distribution',
        repos: [
          { full_name: 'changesets/changesets', reason: 'Semver + changelogs + npm publish. Run by Vercel, used by every modern monorepo.' },
        ],
      },
      {
        title: 'Companion web app',
        repos: [
          { full_name: 'vercel/next.js', reason: 'A dashboard for usage, billing, and team management.' },
          { full_name: 'shadcn-ui/ui', reason: 'Same primitives as everything else here. Consistency compounds.' },
        ],
      },
    ],
    keywords: ['cli', 'devtool', 'tooling', 'developer', 'sdk'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'content-platform',
    title: 'Build a Content Platform / Editor',
    pitch: 'Rich text, real-time, comments, embeds — Notion-style without the lock-in.',
    description:
      'Anything where users write and collaborate: a blog editor, a docs platform, a content workspace, an LMS module. Tiptap and BlockNote handle the editor; the rest is your domain.',
    icon: 'pen-line',
    gradient: 'from-purple-500/60 via-fuchsia-500/40 to-pink-500/30',
    difficulty: 'two-weeks',
    outcome: 'A collaborative editor with slash commands, embeds, presence, and persistent storage.',
    sections: [
      {
        title: 'Editor',
        repos: [
          { full_name: 'ueberdosis/tiptap', reason: 'Headless rich-text editor. Build any UI on top, extend with plugins.' },
          { full_name: 'facebook/lexical', reason: 'Meta\'s editor. Fast, but less mature ecosystem than Tiptap.' },
        ],
      },
      {
        title: 'Backend + persistence',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Realtime + Auth + Storage. Tiptap + Supabase Realtime = presence in a weekend.' },
        ],
      },
      {
        title: 'UI scaffolding',
        repos: [
          { full_name: 'vercel/next.js', reason: 'Server components for fast initial load with editor mounted client-side.' },
          { full_name: 'shadcn-ui/ui', reason: 'Toolbar, command palette, dialogs — all the chrome around the editor.' },
        ],
      },
      {
        title: 'Forms + Schema',
        repos: [
          { full_name: 'colinhacks/zod', reason: 'Validate document JSON before it hits the DB.' },
        ],
      },
    ],
    keywords: ['cms', 'editor', 'content', 'blog', 'docs', 'notion'],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'web-scraper',
    title: 'Build a Web Scraper',
    pitch: 'Scrape JS-heavy sites, dump to Postgres, feed to an LLM — the modern data stack.',
    description:
      'A production-grade scraping pipeline: headless browser, queues, retries, structured extraction. Use the LLM-friendly tools when the output goes to RAG; the classic ones when you need raw throughput.',
    icon: 'globe-2',
    gradient: 'from-lime-400/60 via-emerald-500/40 to-teal-500/30',
    difficulty: 'weekend',
    outcome: 'A scraper that crawls thousands of pages reliably, stores clean output, and feeds your AI agent.',
    sections: [
      {
        title: 'LLM-grade scrapers',
        repos: [
          { full_name: 'mendableai/firecrawl', reason: 'One API, returns clean markdown ready for RAG. Self-host or use their cloud — same SDK.' },
          { full_name: 'unclecode/crawl4ai', reason: 'Python alternative when you need strict JSON-schema extraction with an embedded LLM.' },
        ],
      },
      {
        title: 'Production crawlers',
        repos: [
          { full_name: 'apify/crawlee', reason: 'Node-native. Queues, retries, proxy rotation. The default for serious TS scraping.' },
          { full_name: 'scrapy/scrapy', reason: 'Python\'s veteran. Battle-tested middleware + pipeline architecture.' },
          { full_name: 'gocolly/colly', reason: 'Go option. Single binary, low memory, runs on a ₹500 VPS.' },
        ],
      },
      {
        title: 'Browser automation',
        repos: [
          { full_name: 'microsoft/playwright', reason: 'JS-heavy sites, anti-bot bypass, multi-browser. Also your E2E test runner.' },
          { full_name: 'puppeteer/puppeteer', reason: 'Chrome-only, thinner abstraction. Use when Playwright is too much.' },
        ],
      },
      {
        title: 'Plain HTML parsing',
        repos: [
          { full_name: 'cheeriojs/cheerio', reason: 'jQuery API for server-rendered pages. 10x faster than spinning up a browser.' },
        ],
      },
      {
        title: 'Storage + queue',
        repos: [
          { full_name: 'supabase/supabase', reason: 'Postgres for scraped rows, queues table for the job state, Auth for your dashboard.' },
        ],
      },
      {
        title: 'Feed to your AI agent',
        repos: [
          { full_name: 'pgvector/pgvector', reason: 'Embed scraped chunks and retrieve them in your RAG agent.' },
          { full_name: 'ollama/ollama', reason: 'Run a local model to summarise or tag scraped content without API costs.' },
        ],
      },
    ],
    keywords: ['scraper', 'scraping', 'crawler', 'crawling', 'data extraction', 'web data'],
  },
];

export function getBundleBySlug(slug: string): UseCaseBundle | undefined {
  return USE_CASE_BUNDLES.find((b) => b.slug === slug);
}
