/**
 * Pre-curated comparison pages — "X vs Y" SEO gold.
 * Each pair targets a high-volume search query.
 *
 * Slug format: <repo-a-short>-vs-<repo-b-short>
 * Where short = the repo name (not owner), lowercased, hyphenated.
 */

export interface Comparison {
  slug: string;                     // URL slug
  a_full: string;                   // owner/repo
  b_full: string;
  query: string;                    // The actual Google query this targets
  monthly_searches: number;         // Estimated (used for sorting/priority only)
  category: string;                 // For navigation
  one_liner: string;                // Quick verdict shown at top of page
}

export const COMPARISONS: Comparison[] = [
  // ─── UI components (highest volume) ────────────────────────────────
  {
    slug: 'shadcn-ui-vs-mantine',
    a_full: 'shadcn-ui/ui',
    b_full: 'mantinedev/mantine',
    query: 'shadcn vs mantine',
    monthly_searches: 3200,
    category: 'UI components',
    one_liner: 'Copy-paste primitives vs a full batteries-included library. Pick shadcn for Tailwind-first projects you want to fully own; pick Mantine when you need 100+ components ready to use with hooks and forms baked in.',
  },
  {
    slug: 'shadcn-ui-vs-radix-ui',
    a_full: 'shadcn-ui/ui',
    b_full: 'radix-ui/primitives',
    query: 'shadcn vs radix',
    monthly_searches: 2400,
    category: 'UI components',
    one_liner: 'Shadcn is Radix wrapped with Tailwind. Use Radix directly if you want full styling control and zero opinion; use shadcn if you want sensible defaults you can still own.',
  },
  {
    slug: 'mantine-vs-chakra-ui',
    a_full: 'mantinedev/mantine',
    b_full: 'chakra-ui/chakra-ui',
    query: 'mantine vs chakra ui',
    monthly_searches: 1800,
    category: 'UI components',
    one_liner: 'Both are batteries-included. Mantine has more components and a stronger hook ecosystem; Chakra has better dark-mode primitives and broader Next.js compatibility.',
  },
  {
    slug: 'material-ui-vs-ant-design',
    a_full: 'mui/material-ui',
    b_full: 'ant-design/ant-design',
    query: 'mui vs ant design',
    monthly_searches: 4100,
    category: 'UI components',
    one_liner: 'MUI follows Google Material specs and is best for consumer apps; Ant Design optimizes for enterprise dashboards and admin UIs. Both have ~70+ components.',
  },
  {
    slug: 'nextui-vs-shadcn-ui',
    a_full: 'nextui-org/nextui',
    b_full: 'shadcn-ui/ui',
    query: 'nextui vs shadcn',
    monthly_searches: 1500,
    category: 'UI components',
    one_liner: 'NextUI ships as an npm package with theming baked in; shadcn is copy-paste code you own. Pick NextUI for speed, shadcn for control.',
  },
  {
    slug: 'tailwindcss-vs-chakra-ui',
    a_full: 'tailwindlabs/tailwindcss',
    b_full: 'chakra-ui/chakra-ui',
    query: 'tailwind vs chakra',
    monthly_searches: 2700,
    category: 'Styling',
    one_liner: 'Tailwind is utility-first CSS, no components included. Chakra is React components with built-in styling. Use both together for max flexibility.',
  },

  // ─── Animation ──────────────────────────────────────────────────────
  {
    slug: 'framer-motion-vs-gsap',
    a_full: 'motiondivision/motion',
    b_full: 'greensock/GSAP',
    query: 'framer motion vs gsap',
    monthly_searches: 2100,
    category: 'Animation',
    one_liner: 'Motion (formerly Framer Motion) is React-first, declarative, smaller bundle. GSAP is framework-agnostic, more powerful timeline control, larger ecosystem.',
  },
  {
    slug: 'framer-motion-vs-react-spring',
    a_full: 'motiondivision/motion',
    b_full: 'pmndrs/react-spring',
    query: 'framer motion vs react spring',
    monthly_searches: 900,
    category: 'Animation',
    one_liner: 'Motion uses tween-based animations and is easier to learn. React Spring uses physics-based animations and integrates beautifully with React Three Fiber.',
  },

  // ─── AI / LLM ───────────────────────────────────────────────────────
  {
    slug: 'langchain-vs-llamaindex',
    a_full: 'langchain-ai/langchain',
    b_full: 'run-llama/llama_index',
    query: 'langchain vs llamaindex',
    monthly_searches: 5400,
    category: 'AI agents',
    one_liner: 'LangChain is broader — chains, agents, memory, integrations. LlamaIndex is RAG-first, optimized for indexing documents and retrieval. Use LlamaIndex inside LangChain for the best of both.',
  },
  {
    slug: 'autogen-vs-crewai',
    a_full: 'microsoft/autogen',
    b_full: 'crewAIInc/crewAI',
    query: 'autogen vs crewai',
    monthly_searches: 1800,
    category: 'AI agents',
    one_liner: 'AutoGen by Microsoft is research-grade, multi-agent conversation primitives. CrewAI is opinionated, role-based, easier for shipping production agent teams.',
  },
  {
    slug: 'crewai-vs-langchain',
    a_full: 'crewAIInc/crewAI',
    b_full: 'langchain-ai/langchain',
    query: 'crewai vs langchain',
    monthly_searches: 1400,
    category: 'AI agents',
    one_liner: 'CrewAI is built specifically for multi-agent role orchestration. LangChain is a general framework you can use to build similar systems. CrewAI ships faster; LangChain offers more flexibility.',
  },

  // ─── Vector DB ──────────────────────────────────────────────────────
  {
    slug: 'pgvector-vs-qdrant',
    a_full: 'pgvector/pgvector',
    b_full: 'qdrant/qdrant',
    query: 'pgvector vs qdrant',
    monthly_searches: 2300,
    category: 'Vector databases',
    one_liner: 'pgvector adds vector search to existing Postgres — zero new infra. Qdrant is purpose-built for vectors at scale with filtering and quantization. Pick pgvector for <10M vectors, Qdrant beyond.',
  },
  {
    slug: 'qdrant-vs-chroma',
    a_full: 'qdrant/qdrant',
    b_full: 'chroma-core/chroma',
    query: 'qdrant vs chroma',
    monthly_searches: 1200,
    category: 'Vector databases',
    one_liner: 'Qdrant is Rust, production-scale, advanced filtering. Chroma is Python-first, simpler API, perfect for prototyping and small projects.',
  },
  {
    slug: 'milvus-vs-weaviate',
    a_full: 'milvus-io/milvus',
    b_full: 'weaviate/weaviate',
    query: 'milvus vs weaviate',
    monthly_searches: 1500,
    category: 'Vector databases',
    one_liner: 'Milvus excels at massive-scale (billions of vectors), distributed by design. Weaviate offers built-in hybrid search and a friendlier GraphQL API for smaller-to-medium teams.',
  },

  // ─── Auth ───────────────────────────────────────────────────────────
  {
    slug: 'next-auth-vs-better-auth',
    a_full: 'nextauthjs/next-auth',
    b_full: 'better-auth/better-auth',
    query: 'next-auth vs better-auth',
    monthly_searches: 800,
    category: 'Authentication',
    one_liner: 'NextAuth is the incumbent, Next.js-specific, huge ecosystem. Better Auth is the newer challenger — framework-agnostic, typesafe, simpler mental model. Better Auth wins for new projects in 2026.',
  },
  {
    slug: 'lucia-vs-next-auth',
    a_full: 'lucia-auth/lucia',
    b_full: 'nextauthjs/next-auth',
    query: 'lucia vs next-auth',
    monthly_searches: 600,
    category: 'Authentication',
    one_liner: 'Lucia is session-based, framework-agnostic, gives you full control. NextAuth is OAuth-first with provider configs baked in. Use Lucia if you want to own auth completely.',
  },

  // ─── Auth (extended) ────────────────────────────────────────────────
  {
    slug: 'supertokens-vs-keycloak',
    a_full: 'supertokens/supertokens-core',
    b_full: 'keycloak/keycloak',
    query: 'supertokens vs keycloak',
    monthly_searches: 600,
    category: 'Authentication',
    one_liner: 'SuperTokens is modern, opinionated, easier to ship. Keycloak is enterprise-grade SSO with SAML/LDAP/OIDC, decades of features, heavier to operate.',
  },

  // ─── Icons ──────────────────────────────────────────────────────────
  {
    slug: 'lucide-vs-tabler-icons',
    a_full: 'lucide-icons/lucide',
    b_full: 'tabler/tabler-icons',
    query: 'lucide vs tabler icons',
    monthly_searches: 700,
    category: 'Icons',
    one_liner: 'Lucide is the Feather Icons fork with 1500+ icons, slightly heavier strokes. Tabler has 4500+ icons including filled variants. Pick Lucide for minimalist UI, Tabler for breadth.',
  },
  {
    slug: 'lucide-vs-phosphor-icons',
    a_full: 'lucide-icons/lucide',
    b_full: 'phosphor-icons/core',
    query: 'lucide vs phosphor',
    monthly_searches: 400,
    category: 'Icons',
    one_liner: 'Lucide ships one consistent style. Phosphor ships 6 weights (thin/light/regular/bold/fill/duotone) per icon — same 1200 icons in every weight.',
  },

  // ─── Frameworks ─────────────────────────────────────────────────────
  {
    slug: 'next-js-vs-astro',
    a_full: 'vercel/next.js',
    b_full: 'withastro/astro',
    query: 'next.js vs astro',
    monthly_searches: 8000,
    category: 'Frameworks',
    one_liner: 'Next.js wins for app-heavy products with auth, payments, dynamic data. Astro wins for content-heavy sites (blogs, marketing, docs) where you want zero JS by default.',
  },
  {
    slug: 'next-js-vs-nuxt',
    a_full: 'vercel/next.js',
    b_full: 'nuxt/nuxt',
    query: 'next.js vs nuxt',
    monthly_searches: 3500,
    category: 'Frameworks',
    one_liner: 'Next.js is the React-world standard; Nuxt is the Vue-world equivalent. Pick by ecosystem familiarity. Both have App Router-style routing, server components, edge runtimes.',
  },
  {
    slug: 'next-js-vs-sveltekit',
    a_full: 'vercel/next.js',
    b_full: 'sveltejs/kit',
    query: 'next.js vs sveltekit',
    monthly_searches: 2200,
    category: 'Frameworks',
    one_liner: 'Next.js has a larger ecosystem and more job opportunities. SvelteKit ships less JS, has simpler syntax, and feels faster to write. Both are production-ready in 2026.',
  },

  // ─── Browser automation / Scraping ──────────────────────────────────
  {
    slug: 'puppeteer-vs-playwright',
    a_full: 'puppeteer/puppeteer',
    b_full: 'microsoft/playwright',
    query: 'puppeteer vs playwright',
    monthly_searches: 7500,
    category: 'Browser automation',
    one_liner: 'Playwright supports Chromium + Firefox + WebKit. Puppeteer is Chrome-only. Playwright has better selectors, auto-waiting, and parallel test orchestration. Pick Playwright unless you have a specific Puppeteer dependency.',
  },
  {
    slug: 'cheerio-vs-puppeteer',
    a_full: 'cheeriojs/cheerio',
    b_full: 'puppeteer/puppeteer',
    query: 'cheerio vs puppeteer',
    monthly_searches: 1200,
    category: 'Browser automation',
    one_liner: 'Cheerio parses HTML server-side with no browser — 10× faster but only works on static HTML. Puppeteer runs a real Chrome — slower but handles JS-rendered pages.',
  },
  {
    slug: 'firecrawl-vs-playwright',
    a_full: 'mendableai/firecrawl',
    b_full: 'microsoft/playwright',
    query: 'firecrawl vs playwright',
    monthly_searches: 600,
    category: 'Browser automation',
    one_liner: 'Firecrawl is purpose-built for LLM-grade content extraction (clean markdown, no nav junk). Playwright is general-purpose. Use Firecrawl for AI agents; Playwright for QA and broader scraping.',
  },

  // ─── Mobile ─────────────────────────────────────────────────────────
  {
    slug: 'react-native-vs-expo',
    a_full: 'facebook/react-native',
    b_full: 'expo/expo',
    query: 'react native vs expo',
    monthly_searches: 5000,
    category: 'Mobile',
    one_liner: 'Expo is a framework built on top of React Native. In 2026, the answer is almost always "use Expo." It gives you OTA updates, easier builds (EAS), 50+ native APIs without ejecting.',
  },
  {
    slug: 'tamagui-vs-nativewind',
    a_full: 'tamagui/tamagui',
    b_full: 'nativewind/nativewind',
    query: 'tamagui vs nativewind',
    monthly_searches: 600,
    category: 'Mobile',
    one_liner: 'Tamagui is a full design system with compiler-level optimization. NativeWind is Tailwind for React Native. Pick Tamagui for performance + complex animations; NativeWind for Tailwind muscle memory.',
  },

  // ─── Validation ─────────────────────────────────────────────────────
  {
    slug: 'yup-vs-zod',
    a_full: 'jquense/yup',
    b_full: 'colinhacks/zod',
    query: 'yup vs zod',
    monthly_searches: 4500,
    category: 'Validation',
    one_liner: 'Zod is TypeScript-first with full type inference — write a schema once, get a TS type for free. Yup has been around longer with broader integrations. Pick Zod for new TS projects.',
  },

  // ─── State management ──────────────────────────────────────────────
  {
    slug: 'zustand-vs-redux-toolkit',
    a_full: 'pmndrs/zustand',
    b_full: 'reduxjs/redux-toolkit',
    query: 'zustand vs redux',
    monthly_searches: 4500,
    category: 'State management',
    one_liner: 'Zustand is ~1KB, no boilerplate, perfect for 95% of React apps. Redux Toolkit is verbose but battle-tested at scale with rich DevTools. Pick Zustand for new projects, Redux for existing Redux codebases.',
  },
  {
    slug: 'zustand-vs-jotai',
    a_full: 'pmndrs/zustand',
    b_full: 'pmndrs/jotai',
    query: 'zustand vs jotai',
    monthly_searches: 1800,
    category: 'State management',
    one_liner: 'Both by the same team (pmndrs). Zustand uses a single store with selectors; Jotai uses atomic state per piece of data. Jotai feels more "React-like" with hooks; Zustand has simpler debugging.',
  },
  {
    slug: 'redux-vs-mobx',
    a_full: 'reduxjs/redux-toolkit',
    b_full: 'mobxjs/mobx',
    query: 'redux vs mobx',
    monthly_searches: 2400,
    category: 'State management',
    one_liner: 'Redux is explicit, unidirectional, immutable. MobX is observable, mutation-friendly, magic. Redux scales better in large teams; MobX feels faster to write.',
  },
  {
    slug: 'zustand-vs-mobx',
    a_full: 'pmndrs/zustand',
    b_full: 'mobxjs/mobx',
    query: 'zustand vs mobx',
    monthly_searches: 1200,
    category: 'State management',
    one_liner: 'Zustand is minimal, explicit, hooks-first. MobX is observable, automatically reactive, more "magic." Zustand wins on simplicity; MobX wins on complex deeply-nested state.',
  },

  // ─── ORM / Database ─────────────────────────────────────────────────
  {
    slug: 'prisma-vs-drizzle',
    a_full: 'prisma/prisma',
    b_full: 'drizzle-team/drizzle-orm',
    query: 'prisma vs drizzle',
    monthly_searches: 4200,
    category: 'ORM',
    one_liner: 'Prisma has the better DX (auto-generated client, migrations) but ships a heavy runtime. Drizzle is SQL-first with zero runtime overhead. Pick Drizzle for edge/serverless; Prisma for relational complexity.',
  },
  {
    slug: 'prisma-vs-typeorm',
    a_full: 'prisma/prisma',
    b_full: 'typeorm/typeorm',
    query: 'prisma vs typeorm',
    monthly_searches: 2100,
    category: 'ORM',
    one_liner: 'Prisma uses a separate schema file + generated client. TypeORM uses decorators on TypeScript classes. Prisma wins on DX and type safety; TypeORM wins on flexibility and existing-DB integration.',
  },
  {
    slug: 'drizzle-vs-kysely',
    a_full: 'drizzle-team/drizzle-orm',
    b_full: 'kysely-org/kysely',
    query: 'drizzle vs kysely',
    monthly_searches: 800,
    category: 'ORM',
    one_liner: 'Both are SQL-first, type-safe, lightweight. Drizzle generates SQL closer to raw; Kysely is a pure query builder. Drizzle has more features (migrations, relations); Kysely is the minimalist pick.',
  },
  {
    slug: 'drizzle-vs-typeorm',
    a_full: 'drizzle-team/drizzle-orm',
    b_full: 'typeorm/typeorm',
    query: 'drizzle vs typeorm',
    monthly_searches: 700,
    category: 'ORM',
    one_liner: 'Drizzle is the modern pick — zero runtime, edge-compatible, SQL-like syntax. TypeORM is legacy-heavy with decorators and a runtime. Pick Drizzle for new TypeScript projects.',
  },

  // ─── CMS / Backend ──────────────────────────────────────────────────
  {
    slug: 'strapi-vs-directus',
    a_full: 'strapi/strapi',
    b_full: 'directus/directus',
    query: 'strapi vs directus',
    monthly_searches: 2500,
    category: 'CMS',
    one_liner: 'Strapi is plugin-rich, has a strong community, REST + GraphQL out of the box. Directus is more flexible with existing databases (it wraps your DB; Strapi creates one). Pick Directus to add CMS to an existing Postgres.',
  },
  {
    slug: 'strapi-vs-payload',
    a_full: 'strapi/strapi',
    b_full: 'payloadcms/payload',
    query: 'strapi vs payload',
    monthly_searches: 1800,
    category: 'CMS',
    one_liner: 'Payload is TypeScript-first, code-defined collections, and ships an admin UI you can fully customize. Strapi is database-first with a more "WordPress for devs" feel. Pick Payload for type-safe headless CMS.',
  },
  {
    slug: 'directus-vs-payload',
    a_full: 'directus/directus',
    b_full: 'payloadcms/payload',
    query: 'directus vs payload',
    monthly_searches: 1100,
    category: 'CMS',
    one_liner: 'Directus wraps any SQL database (great for migrating existing data). Payload is code-first, TypeScript-native, ships its own MongoDB or Postgres setup. Pick Directus to add CMS to existing DB; Payload for greenfield.',
  },
  {
    slug: 'supabase-vs-pocketbase',
    a_full: 'supabase/supabase',
    b_full: 'pocketbase/pocketbase',
    query: 'supabase vs pocketbase',
    monthly_searches: 1500,
    category: 'BaaS',
    one_liner: 'Supabase is Postgres + multi-service (auth, storage, edge funcs) — cloud or self-host. Pocketbase is a single Go binary with SQLite — easiest self-host. Pick Pocketbase for hobby projects; Supabase for SaaS.',
  },

  // ─── Charts / Visualization ─────────────────────────────────────────
  {
    slug: 'recharts-vs-echarts',
    a_full: 'recharts/recharts',
    b_full: 'apache/echarts',
    query: 'recharts vs echarts',
    monthly_searches: 1800,
    category: 'Charts',
    one_liner: 'Recharts is React-native, declarative, smaller bundle — perfect for dashboards. ECharts is framework-agnostic with way more chart types and configurability. Pick Recharts for React simplicity; ECharts for chart breadth.',
  },
  {
    slug: 'd3-vs-recharts',
    a_full: 'd3/d3',
    b_full: 'recharts/recharts',
    query: 'd3 vs recharts',
    monthly_searches: 1200,
    category: 'Charts',
    one_liner: 'D3 is the low-level primitive — build any visualization but write a lot of code. Recharts is high-level React components built on D3. Pick Recharts for standard charts; D3 for custom visualizations.',
  },

  // ─── Search ─────────────────────────────────────────────────────────
  {
    slug: 'meilisearch-vs-typesense',
    a_full: 'meilisearch/meilisearch',
    b_full: 'typesense/typesense',
    query: 'meilisearch vs typesense',
    monthly_searches: 1500,
    category: 'Search',
    one_liner: 'Both are Algolia alternatives. Meilisearch is Rust, slightly faster ingestion. Typesense is C++, slightly faster queries. Both have similar APIs and DX. Pick on hosted-pricing preference.',
  },

  // ─── Analytics ──────────────────────────────────────────────────────
  {
    slug: 'plausible-vs-posthog',
    a_full: 'plausible/analytics',
    b_full: 'PostHog/posthog',
    query: 'plausible vs posthog',
    monthly_searches: 1200,
    category: 'Analytics',
    one_liner: 'Plausible is privacy-first, simple, GDPR-safe (no cookies). PostHog is full product analytics with session replay, feature flags, A/B tests. Pick Plausible for marketing sites; PostHog for SaaS product analytics.',
  },
  {
    slug: 'plausible-vs-umami',
    a_full: 'plausible/analytics',
    b_full: 'umami-software/umami',
    query: 'plausible vs umami',
    monthly_searches: 800,
    category: 'Analytics',
    one_liner: 'Both are privacy-first, no-cookie analytics. Plausible is paid SaaS (also self-hostable); Umami is fully open-source self-host. Pick Umami if you want to self-host for free.',
  },

  // ─── Rich text editors ──────────────────────────────────────────────
  {
    slug: 'tiptap-vs-lexical',
    a_full: 'ueberdosis/tiptap',
    b_full: 'facebook/lexical',
    query: 'tiptap vs lexical',
    monthly_searches: 1100,
    category: 'Rich text',
    one_liner: 'Tiptap is ProseMirror-based, plugin-rich, well-documented for solo devs. Lexical (by Meta) is newer, more performant, more complex API. Pick Tiptap for productivity; Lexical for Meta-scale performance.',
  },
  {
    slug: 'tiptap-vs-blocknote',
    a_full: 'ueberdosis/tiptap',
    b_full: 'BlockNote/BlockNote',
    query: 'tiptap vs blocknote',
    monthly_searches: 400,
    category: 'Rich text',
    one_liner: 'BlockNote is built on Tiptap with Notion-style block UI out of the box. Tiptap gives full control but you build the UI. Pick BlockNote for Notion-clone speed; Tiptap for total control.',
  },

  // ─── Deploy / PaaS ──────────────────────────────────────────────────
  {
    slug: 'coolify-vs-caprover',
    a_full: 'coollabsio/coolify',
    b_full: 'caprover/caprover',
    query: 'coolify vs caprover',
    monthly_searches: 700,
    category: 'Self-hosting',
    one_liner: 'Both are self-hosted Heroku/Vercel alternatives. Coolify is newer, Docker-Compose-friendly, beautiful UI. CapRover is more mature, app-template marketplace. Pick Coolify for new self-hosts.',
  },

  // ─── UI Animation ──────────────────────────────────────────────────
  {
    slug: 'magic-ui-vs-aceternity',
    a_full: 'magic-ui-design/magic-ui',
    b_full: 'aceternity/ui',
    query: 'magic ui vs aceternity',
    monthly_searches: 400,
    category: 'UI components',
    one_liner: 'Both are shadcn-style copy-paste animated component libraries. Magic UI focuses on landing-page sections (hero, pricing, testimonials). Aceternity has more flashy interactive components.',
  },
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}
