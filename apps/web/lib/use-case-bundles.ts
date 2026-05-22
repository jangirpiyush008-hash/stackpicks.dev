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
          { full_name: 'motiondivision/motion', reason: 'Production motion library (formerly Framer Motion). Required for landing pages that need to feel premium.' },
          { full_name: 'darkroomengineering/lenis', reason: 'Smooth scroll — used by every Awwwards-winning site in 2026.' },
        ],
      },
      {
        title: 'Scheduling + workflows',
        repos: [
          { full_name: 'calcom/cal.com', reason: 'Open-source Calendly. Embed booking in your app or use cloud free tier.' },
          { full_name: 'inngest/inngest', reason: 'Durable functions for background jobs, webhooks, scheduled tasks. The 2026 TS queue.' },
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
          { full_name: 'gorhom/react-native-bottom-sheet', reason: 'The bottom sheet every RN app uses. Gesture-perfect, smooth on iOS + Android.' },
          { full_name: 'Shopify/react-native-skia', reason: 'High-perf 2D graphics — needed for custom drawings, animated charts, complex transitions.' },
        ],
      },
      {
        title: 'UI components (modern)',
        repos: [
          { full_name: 'gluestack-ui/gluestack-ui', reason: 'The new RN+web universal UI library. Replaces NativeBase, simpler than Tamagui.' },
        ],
      },
      {
        title: 'Cross-platform desktop (bonus)',
        repos: [
          { full_name: 'tauri-apps/tauri', reason: 'Tauri 2 ships desktop + iOS + Android from a single Rust+JS codebase. The 2026 dark horse for cross-platform.' },
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
          { full_name: 'vllm-project/vllm', reason: 'Production LLM serving — 10-24× faster than HF Transformers for batched inference. Used at scale by Mistral, Together AI.' },
          { full_name: 'open-webui/open-webui', reason: 'ChatGPT-clone UI for your Ollama. Multi-user, RAG, plugins. The default frontend for local LLMs.' },
        ],
      },
      {
        title: 'Voice AI (optional)',
        repos: [
          { full_name: 'pipecat-ai/pipecat', reason: 'Open-source voice AI pipelines. Build phone agents that call APIs + speak responses.' },
          { full_name: 'livekit/livekit', reason: 'WebRTC infrastructure for real-time voice/video. Powers OpenAI Realtime API.' },
        ],
      },
      {
        title: 'AI coding agents (developer use)',
        repos: [
          { full_name: 'Aider-AI/aider', reason: 'Terminal AI pair programmer. Bring your own LLM. Git-native — every edit becomes a commit.' },
          { full_name: 'cline/cline', reason: 'Autonomous VS Code agent. Free, open-source, brings your own API key. The OSS Cursor alternative.' },
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
        title: 'Agent frameworks',
        repos: [
          { full_name: 'langchain-ai/langchain', reason: 'The ecosystem standard for chaining LLM calls, tools, and retrievers. Verbose but universal.' },
          { full_name: 'run-llama/llama_index', reason: 'Better than Langchain for pure RAG — indexing, query engines, and retrievers are first-class.' },
          { full_name: 'microsoft/autogen', reason: 'Multi-agent orchestration. Use when one LLM call is not enough.' },
          { full_name: 'pydantic/pydantic-ai', reason: 'Type-safe agent framework if you\'re Python-native. Smaller surface area than Langchain.' },
          { full_name: 'crewAIInc/crewAI', reason: 'Role-based multi-agent crews. Ships fast — the easiest framework for production agent teams.' },
          { full_name: 'mastra-ai/mastra', reason: 'TS-native AI framework. The LangChain alternative if you\'re Node/TypeScript-first.' },
          { full_name: 'stanfordnlp/dspy', reason: 'Program LLMs instead of prompting. Optimises prompts automatically — Stanford research-grade.' },
          { full_name: 'BerriAI/litellm', reason: 'Universal proxy for 100+ LLM providers. Switch from OpenAI to Claude with one line.' },
        ],
      },
      {
        title: 'Embeddings + reranking',
        repos: [
          { full_name: 'FlagOpen/FlagEmbedding', reason: 'BGE family — the open-source embedding models that actually beat OpenAI on retrieval benchmarks.' },
          { full_name: 'jina-ai/jina', reason: 'Production-grade multimodal embeddings. Pair with their reranker for hybrid search.' },
        ],
      },
      {
        title: 'Observability (LLM-specific)',
        repos: [
          { full_name: 'langfuse/langfuse', reason: 'Trace every LLM call, see costs, see prompts. Self-hostable. The Sentry for AI apps.' },
          { full_name: 'Helicone/helicone', reason: 'Lighter than Langfuse. Drop-in proxy that logs without code changes.' },
        ],
      },
      {
        title: 'Frontend chat UI',
        repos: [
          { full_name: 'vercel/ai', reason: 'Vercel\'s AI SDK + UI components for streaming chat. Drop-in chat experiences.' },
          { full_name: 'shadcn-ui/ui', reason: 'Command palette, message list, thread switcher — all primitives included.' },
        ],
      },
      {
        title: 'Data ingestion',
        repos: [
          { full_name: 'mendableai/firecrawl', reason: 'Scrape websites into LLM-ready markdown.' },
          { full_name: 'unclecode/crawl4ai', reason: 'Python alternative with embedded LLM extraction.' },
        ],
      },
      {
        title: 'Validation + types',
        repos: [
          { full_name: 'colinhacks/zod', reason: 'Validate LLM JSON outputs before they hit your DB.' },
        ],
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
          { full_name: 'origin-space/origin-ui', reason: 'shadcn-style components with 300+ pieces. Best for marketing site sections.' },
          { full_name: 'DavidHDev/react-bits', reason: 'Animated React components — Instagram-worthy hero sections.' },
          { full_name: 'saadeghi/daisyui', reason: 'Pure Tailwind components — no JS required.' },
          { full_name: 'markmead/hyperui', reason: 'Free Tailwind UI blocks — drop-in marketing sections.' },
        ],
      },
      {
        title: 'Server-rendered (alternative to React)',
        repos: [
          { full_name: 'bigskysoftware/htmx', reason: 'HTML over the wire. No JS bundle, no build step. The anti-SPA movement\'s flagship.' },
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
          { full_name: 'PostHog/posthog', reason: 'Add later for funnels + session replay. Free tier is generous.' },
        ],
      },
      {
        title: 'Animation + motion',
        repos: [
          { full_name: 'motiondivision/motion', reason: 'Production motion (formerly Framer Motion). Required for landing pages that feel premium.' },
          { full_name: 'darkroomengineering/lenis', reason: 'The smooth-scroll library every Awwwards-winning site uses in 2026.' },
          { full_name: 'theatre-js/theatre', reason: 'Keyframe + scrub animation editor — for cinematic scroll-tied web experiences.' },
          { full_name: 'rive-app/rive-runtime', reason: 'Interactive animations exported from Rive Editor. After Effects killer.' },
          { full_name: 'formkit/auto-animate', reason: 'One-line magic — add `data-auto-animate` to any list, get smooth animations.' },
        ],
      },
      {
        title: '3D / WebGL (for hero impact)',
        repos: [
          { full_name: 'mrdoob/three.js', reason: '105k stars. The 3D library powering every "wow factor" landing page.' },
          { full_name: 'pmndrs/react-three-fiber', reason: 'Declarative React renderer for Three.js. The way React devs do 3D.' },
        ],
      },
      {
        title: 'Icons + visuals',
        repos: [
          { full_name: 'lucide-icons/lucide', reason: '1500+ icons, tree-shakable. Pairs natively with shadcn.' },
        ],
      },
      {
        title: 'SEO essentials',
        repos: [
          { full_name: 'garmeeh/next-seo', reason: 'Easier metadata + JSON-LD for older Next versions. Built-in on App Router but still useful for blog posts.' },
        ],
      },
      {
        title: 'Markdown / MDX content',
        repos: [
          { full_name: 'remarkjs/remark', reason: 'Markdown processor. Use with MDX for component-rich blog posts.' },
          { full_name: 'rehypejs/rehype', reason: 'HTML transformation pipeline — syntax highlighting, headings, anchors.' },
        ],
      },
      {
        title: 'Images',
        repos: [
          { full_name: 'lovell/sharp', reason: 'Image resize / format conversion. Used under the hood by next/image.' },
        ],
      },
      {
        title: 'Search',
        repos: [
          { full_name: 'orama/orama', reason: 'In-browser search for docs/blog. Zero backend, instant.' },
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
      {
        title: 'Tables (advanced)',
        repos: [
          { full_name: 'TanStack/table', reason: 'Headless table primitive. Sort, filter, paginate — bring your own JSX.' },
        ],
      },
      {
        title: 'Layout + drag',
        repos: [
          { full_name: 'react-grid-layout/react-grid-layout', reason: 'Resizable + draggable widget dashboards. Users love rearranging things.' },
          { full_name: 'clauderic/dnd-kit', reason: 'Modern drag and drop. Replaces react-dnd. Kanban, sortable lists.' },
        ],
      },
      {
        title: 'Auth + RBAC',
        repos: [
          { full_name: 'better-auth/better-auth', reason: 'Type-safe sessions + role-based access. Faster to wire than spinning your own.' },
        ],
      },
      {
        title: 'Export + reporting',
        repos: [
          { full_name: 'mholt/PapaParse', reason: 'CSV parse + stringify in browser. For "Export to CSV" buttons.' },
          { full_name: 'wojtekmaj/react-pdf', reason: 'Generate PDF receipts and reports client-side.' },
        ],
      },
      {
        title: 'Component documentation',
        repos: [
          { full_name: 'storybookjs/storybook', reason: 'Document every dashboard widget in isolation. Speeds up new feature reviews.' },
        ],
      },
      {
        title: 'Email (digest / alerts)',
        repos: [
          { full_name: 'resend/react-email', reason: 'Weekly digest emails to stakeholders. Templates in React.' },
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
      {
        title: 'Extension frameworks',
        repos: [
          { full_name: 'wxt-dev/wxt', reason: 'Next.js-style DX for extensions. File-based routing, hot reload, MV3 by default.' },
          { full_name: 'plasmohq/plasmo', reason: 'Alternative extension framework with React-first APIs and built-in messaging.' },
        ],
      },
      {
        title: 'Storage + sync',
        repos: [
          { full_name: 'pmndrs/jotai', reason: 'Alternative store for derived/computed state in popup + side panel.' },
        ],
      },
      {
        title: 'AI augmentation',
        repos: [
          { full_name: 'vercel/ai', reason: 'Stream LLM responses inside the extension popup. Drop-in chat UI.' },
          { full_name: 'ollama/ollama', reason: 'Local LLM for extensions that should not call cloud APIs.' },
        ],
      },
      {
        title: 'Animation + polish',
        repos: [
          { full_name: 'framer/motion', reason: 'Smooth open/close transitions for the popup panel.' },
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
      {
        title: 'Job orchestration',
        repos: [
          { full_name: 'inngest/inngest', reason: 'Modern job runner with built-in retries, fan-out, scheduling. The new default.' },
          { full_name: 'triggerdotdev/trigger.dev', reason: 'Background jobs as TypeScript functions. Self-host or use their cloud.' },
          { full_name: 'taskforcesh/bullmq', reason: 'Redis-backed queues. Ship-tested at huge scale.' },
        ],
      },
      {
        title: 'Postgres-native queues',
        repos: [
          { full_name: 'graphile/worker', reason: 'Job queue inside your existing Postgres. No Redis to operate.' },
          { full_name: 'timgit/pg-boss', reason: 'Same idea, different implementation. Pick whichever API you prefer.' },
        ],
      },
      {
        title: 'Notifications',
        repos: [
          { full_name: 'slackapi/node-slack-sdk', reason: 'Send job-status messages to your team Slack.' },
          { full_name: 'twilio/twilio-node', reason: 'SMS / WhatsApp for production alerts.' },
        ],
      },
      {
        title: 'AI-augmented automation',
        repos: [
          { full_name: 'mendableai/firecrawl', reason: 'Automate competitive intel — scrape competitor pages on a cron.' },
          { full_name: 'vercel/ai', reason: 'LLM-driven decision-making inside automation steps.' },
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
      {
        title: 'A/B testing + feature flags',
        repos: [
          { full_name: 'growthbook/growthbook', reason: 'Open-source A/B testing engine. Self-host, own your experiments data.' },
          { full_name: 'Unleash/unleash', reason: 'Feature flags + experiments. Enterprise-grade, OSS-friendly.' },
        ],
      },
      {
        title: 'Marketing automation',
        repos: [
          { full_name: 'mautic/mautic', reason: 'Self-hosted marketing automation. Drip sequences, lead scoring — the HubSpot alternative if you want to own your data.' },
          { full_name: 'novuhq/novu', reason: 'Multi-channel notification infra — push, email, SMS, in-app — through one API.' },
        ],
      },
      {
        title: 'Landing pages + builders',
        repos: [
          { full_name: 'withastro/astro', reason: 'Ship a 100/100 Lighthouse landing page in a weekend.' },
          { full_name: 'shadcn-ui/ui', reason: 'Hero, pricing, FAQ blocks. Copy in, customise, ship.' },
        ],
      },
      {
        title: 'SEO tooling',
        repos: [
          { full_name: 'garmeeh/next-seo', reason: 'JSON-LD + canonical + OG tags. Skips repetitive head-tag wiring.' },
          { full_name: 'remarkjs/remark', reason: 'Process blog markdown with plugins for headings, anchors, syntax highlights.' },
        ],
      },
      {
        title: 'Lead capture',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', reason: 'Newsletter, lead-gen, contact forms — all the same library.' },
          { full_name: 'colinhacks/zod', reason: 'Validate before hitting your CRM.' },
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
      {
        title: 'Pipeline UI (kanban + drag)',
        repos: [
          { full_name: 'clauderic/dnd-kit', reason: 'The modern kanban primitive. Smooth, accessible drag-and-drop.' },
          { full_name: 'TanStack/table', reason: 'Sortable + filterable lead lists.' },
        ],
      },
      {
        title: 'Voice + telephony',
        repos: [
          { full_name: 'twilio/twilio-node', reason: 'Click-to-call, SMS sequences. The classic for sales tools.' },
        ],
      },
      {
        title: 'AI-assisted outreach',
        repos: [
          { full_name: 'vercel/ai', reason: 'Draft personalised emails from a lead\'s public info. The 2026 sales motion.' },
          { full_name: 'mendableai/firecrawl', reason: 'Scrape a prospect\'s site so the AI has context before drafting.' },
        ],
      },
      {
        title: 'Scheduling',
        repos: [
          { full_name: 'calcom/cal.com', reason: 'Open-source Calendly alternative. Embed in lead emails or self-host.' },
        ],
      },
      {
        title: 'State + background jobs',
        repos: [
          { full_name: 'TanStack/query', reason: 'Optimistic updates so the kanban does not lag during DB writes.' },
          { full_name: 'inngest/inngest', reason: 'Sequence runner — drip a 5-email cadence over 14 days reliably.' },
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
      {
        title: 'Alternative commerce backends',
        repos: [
          { full_name: 'saleor/saleor', reason: 'GraphQL-first headless commerce. Python backend, modern API.' },
          { full_name: 'vendure-ecommerce/vendure', reason: 'TypeScript headless commerce. Plugin-rich.' },
        ],
      },
      {
        title: 'Inventory + admin',
        repos: [
          { full_name: 'TanStack/table', reason: 'Bulk product editor. Filter, sort, edit in place.' },
          { full_name: 'mholt/PapaParse', reason: 'CSV bulk import of products — common merchant flow.' },
        ],
      },
      {
        title: 'Reviews + UGC',
        repos: [
          { full_name: 'ueberdosis/tiptap', reason: 'Rich-text reviews with images + ratings. Less abusable than raw textarea.' },
        ],
      },
      {
        title: 'AI shopping assistants',
        repos: [
          { full_name: 'vercel/ai', reason: 'Streamed product Q&A on PDPs. Boosts conversion meaningfully.' },
          { full_name: 'pgvector/pgvector', reason: 'Vector search across your catalog — "shoes for monsoon" returns the right SKUs.' },
        ],
      },
      {
        title: 'Animation + polish',
        repos: [
          { full_name: 'framer/motion', reason: 'Add-to-cart animations, drawer transitions — the small things that lift conversion.' },
        ],
      },
      {
        title: 'CMS for content marketing',
        repos: [
          { full_name: 'payloadcms/payload', reason: 'Blog + landing CMS that sits next to your storefront code.' },
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
      {
        title: 'Library bundling',
        repos: [
          { full_name: 'egoist/tsup', reason: 'Bundle TypeScript libraries without a webpack config. Outputs ESM + CJS + types.' },
          { full_name: 'unjs/unbuild', reason: 'Alternative — opinionated bundler for libraries. Used by Nuxt ecosystem.' },
        ],
      },
      {
        title: 'Codegen + scaffolders',
        repos: [
          { full_name: 'sindresorhus/yo', reason: 'Yeoman-style project scaffolders. Old but reliable.' },
          { full_name: 'sindresorhus/got', reason: 'HTTP client. Drop-in fetch replacement with retries baked in.' },
        ],
      },
      {
        title: 'Dependency hygiene',
        repos: [
          { full_name: 'antfu/taze', reason: 'Modern alternative to npm-check-updates. Faster, prettier.' },
          { full_name: 'webpro/knip', reason: 'Find unused files, dependencies, exports. Will surprise you.' },
          { full_name: 'JamieMason/syncpack', reason: 'Keeps versions consistent across a monorepo.' },
        ],
      },
      {
        title: 'Git hooks',
        repos: [
          { full_name: 'typicode/husky', reason: 'Pre-commit hooks. Standard for lint-on-commit.' },
          { full_name: 'evilmartians/lefthook', reason: 'Faster + more flexible than Husky. Go-based.' },
        ],
      },
      {
        title: 'CLI UX',
        repos: [
          { full_name: 'unjs/citty', reason: 'Modern CLI framework. Type-safe args, clean help output.' },
          { full_name: 'natemoo-re/clack', reason: 'Beautiful interactive prompts. Used by Astro\'s create command.' },
        ],
      },
      {
        title: 'Modern compilers (early adoption)',
        repos: [
          { full_name: 'oxc-project/oxc', reason: 'Rust-based JS toolchain — linter, parser, transformer. Watch this space.' },
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
      {
        title: 'Block-style editors',
        repos: [
          { full_name: 'TypeCellOS/BlockNote', reason: 'Notion-style block editor on top of Tiptap. Fastest path to a Notion clone.' },
          { full_name: 'ianstormtaylor/slate', reason: 'Lower-level alternative for completely custom editors.' },
        ],
      },
      {
        title: 'Code editor inside content',
        repos: [
          { full_name: 'codemirror/codemirror5', reason: 'Embed CodeMirror for code blocks inside articles.' },
          { full_name: 'microsoft/monaco-editor', reason: 'VS Code\'s editor — heavier but better for IDE-style content.' },
        ],
      },
      {
        title: 'Markdown / MDX',
        repos: [
          { full_name: 'remarkjs/remark', reason: 'Markdown processor. Use plugins for headings, anchors, tables.' },
          { full_name: 'rehypejs/rehype', reason: 'HTML transformer. Syntax highlighting via rehype-prism-plus.' },
        ],
      },
      {
        title: 'Realtime collaboration',
        repos: [
          { full_name: 'yjs/yjs', reason: 'CRDT for real-time collaborative editing. Pair with Tiptap.' },
        ],
      },
      {
        title: 'Animation + interactions',
        repos: [
          { full_name: 'framer/motion', reason: 'Smooth transitions when blocks expand/collapse, dialogs open.' },
        ],
      },
      {
        title: 'Search inside content',
        repos: [
          { full_name: 'meilisearch/meilisearch', reason: 'Search across all docs/pages with typo tolerance.' },
        ],
      },
      {
        title: 'AI in the editor',
        repos: [
          { full_name: 'vercel/ai', reason: 'Slash-command AI — "/improve writing", "/translate to Hindi" inside the editor.' },
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
