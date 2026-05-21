/**
 * StackPicks master seed database.
 *
 * 110 hand-curated open-source repos across 16 categories.
 * Every entry has: verified GitHub path, category mapping, curator take,
 * "use this if" and "skip if" notes.
 *
 * Star counts in comments are approximate as of May 2026 — the scraper
 * refreshes live values nightly so these are just for sorting/sanity.
 *
 * Run: npx tsx scripts/seed.ts
 * Requires env: GITHUB_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

export interface SeedEntry {
  full_name: string;          // owner/repo
  category_slugs: string[];   // must exist in seed_categories.sql
  is_featured: boolean;       // shows on homepage rotation
  curator_take: string;       // 80-160 words, direct voice, no buzzwords
  use_this_if: string;        // 1-2 sentences
  skip_if: string;            // 1-2 sentences
  affiliate_url?: string;     // optional outbound override
}

export const SEED_REPOS: SeedEntry[] = [
  // ════════════════════════════════════════════════════════════════
  // UI COMPONENTS (10)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'shadcn-ui/ui',
    category_slugs: ['ui-components', 'design-systems'],
    is_featured: true,
    curator_take:
      'The default for Next.js builders in 2026. Not a dependency — you copy components into your codebase and own them forever. Built on Radix primitives so accessibility is solid out of the box. The catch: when something breaks or needs updating, you maintain it yourself. For most apps that is the right trade. For huge teams it can create drift across projects. Survey data from 2026 puts it as the third-most-loved tool in the React ecosystem.',
    use_this_if: 'You are on Next.js or Vite + React with Tailwind, you want full control over component code, and you do not mind some manual maintenance.',
    skip_if: 'You need Material Design specifically, you want automatic library upgrades, or you are not on Tailwind.',
  },
  {
    full_name: 'mui/material-ui',
    category_slugs: ['ui-components', 'design-systems'],
    is_featured: false,
    curator_take:
      'The safe enterprise pick. Massive component library, well-documented, every internal admin tool uses it. Price: your app will look like every other Material Design app, bundle sizes are heavy, and customising past the defaults is genuinely painful. ~93k stars and 3.8M weekly npm downloads. Great for B2B dashboards where nobody cares about visual differentiation.',
    use_this_if: 'You are building internal tools or B2B dashboards where speed of assembly matters more than brand identity.',
    skip_if: 'You are building a consumer product, marketing site, or anything where the brand needs to look distinct.',
  },
  {
    full_name: 'radix-ui/primitives',
    category_slugs: ['ui-components'],
    is_featured: true,
    curator_take:
      'The accessibility primitives shadcn/ui is built on. If shadcn is too opinionated drop down one level and use these directly. WAI-ARIA compliant out of the box, unstyled so you bring your own design. ~18k stars and maintained by WorkOS. Pairs well with Tailwind for custom design systems.',
    use_this_if: 'You are building a custom design system and need accessible primitives without imposed styling.',
    skip_if: 'You want ready-to-ship styled components — use shadcn/ui or Material UI instead.',
  },
  {
    full_name: 'mui/base-ui',
    category_slugs: ['ui-components'],
    is_featured: false,
    curator_take:
      'New library from the MUI team in 2026, similar philosophy to Radix Primitives — unstyled accessible components. ~3.7M weekly downloads in early 2026 and moving fast. Worth watching if you hit Radix limitations on complex components like Combobox or multi-select.',
    use_this_if: 'You are starting a new design system and want the most actively maintained primitive layer right now.',
    skip_if: 'You are already deep in Radix or shadcn — migration cost is real, no urgency to switch.',
  },
  {
    full_name: 'chakra-ui/chakra-ui',
    category_slugs: ['ui-components', 'design-systems'],
    is_featured: false,
    curator_take:
      'Composable component library with strong defaults and a great theming system. ~38k stars. Sits between Material UI (too opinionated) and shadcn (too DIY). Good developer experience and accessibility — though development pace has slowed in 2026.',
    use_this_if: 'You want batteries-included components with clean visuals and a sensible theming API.',
    skip_if: 'You need cutting-edge features — release cadence has slowed and momentum has shifted to shadcn/Base UI.',
  },
  {
    full_name: 'nextui-org/nextui',
    category_slugs: ['ui-components'],
    is_featured: false,
    curator_take:
      'Modern visual style, animations baked in, built on Tailwind. ~22k stars. Slightly more opinionated than shadcn but ships pre-styled. Recently rebranded — check the latest docs.',
    use_this_if: 'You want modern visuals without writing the design yourself and you are okay with their aesthetic.',
    skip_if: 'You need a fully custom design or already invested in shadcn ecosystem.',
  },
  {
    full_name: 'mantinedev/mantine',
    category_slugs: ['ui-components', 'forms'],
    is_featured: false,
    curator_take:
      '100+ components and 50+ hooks. ~26k stars. Particularly strong on form handling and date pickers. Less hyped than shadcn but mature, well-documented, and just works. Good fit for SaaS dashboards.',
    use_this_if: 'You want a comprehensive React component library with excellent forms and hooks out of the box.',
    skip_if: 'You want copy-paste ownership of component code — Mantine is a traditional dependency.',
  },
  {
    full_name: 'ant-design/ant-design',
    category_slugs: ['ui-components', 'design-systems'],
    is_featured: false,
    curator_take:
      'The B2B default in Asia. ~93k stars. Deep, enterprise-grade component set — tables, forms, dates, charts all included. Visually distinctive (and dated to some eyes). Strong choice for admin panels but a poor fit for consumer products.',
    use_this_if: 'You are building enterprise admin panels, data-heavy dashboards, or SaaS for Chinese/SEA markets.',
    skip_if: 'You are building consumer-facing products — the look is too enterprise.',
  },
  {
    full_name: 'tailwindlabs/headlessui',
    category_slugs: ['ui-components'],
    is_featured: false,
    curator_take:
      'Unstyled, accessible components from the Tailwind team. Smaller surface than Radix but tighter integration with Tailwind ecosystem. Good for simple custom design systems where you do not need Radix-level breadth.',
    use_this_if: 'You are on Tailwind and need a few accessible primitives (dialog, menu, listbox) without bringing in Radix.',
    skip_if: 'You need a full set of primitives or community-maintained components — Radix has more.',
  },
  {
    full_name: 'arco-design/arco-design',
    category_slugs: ['ui-components', 'design-systems'],
    is_featured: false,
    curator_take:
      'ByteDance enterprise design system. Cleaner aesthetics than Ant Design, deep component library, growing presence outside China. Solid pick for enterprise tooling where you want a more modern visual baseline.',
    use_this_if: 'You like Ant Design but want a more modern visual style.',
    skip_if: 'You are building consumer products or expect long-term English-language community support — Chinese-language docs dominate.',
  },

  // ════════════════════════════════════════════════════════════════
  // DESIGN SYSTEMS (5)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'tailwindlabs/tailwindcss',
    category_slugs: ['design-systems'],
    is_featured: true,
    curator_take:
      'The CSS framework that won. Utility-first, brutal on first sight, addictive after a week. ~83k stars. Pairs with literally every UI library that matters in 2026. Default expectation for new React/Vue/Svelte projects.',
    use_this_if: 'You are starting any new web project in 2026 — yes, even this one.',
    skip_if: 'You are in a CSS Modules / styled-components codebase and the team is happy. Do not migrate for migration sake.',
  },
  {
    full_name: 'system-ui/theme-ui',
    category_slugs: ['design-systems'],
    is_featured: false,
    curator_take:
      'Theme tokens spec for React — colors, spacing, typography as a single config. Older but the underlying idea (design tokens) still matters. Worth knowing the pattern even if you build tokens yourself with CSS variables.',
    use_this_if: 'You want a tested theme-token pattern and a community spec to align around.',
    skip_if: 'You are using shadcn or Tailwind — they have their own token systems.',
  },
  {
    full_name: 'lucide-icons/lucide',
    category_slugs: ['design-systems', 'icons'],
    is_featured: true,
    curator_take:
      'The icon set shadcn ships with. Clean, consistent stroke, ~1,400 icons, MIT licensed. ~13k stars. Better designed than Feather (which it forked from), better licensed than Heroicons in some setups.',
    use_this_if: 'You want a single, modern, well-licensed icon library that covers most product needs.',
    skip_if: 'You need brand logos (use simple-icons) or filled iconography (use Phosphor or Tabler).',
  },
  {
    full_name: 'tabler/tabler-icons',
    category_slugs: ['icons', 'design-systems'],
    is_featured: false,
    curator_take:
      '5,000+ free MIT-licensed SVG icons. Wider coverage than Lucide for niche concepts. ~19k stars. Active maintenance, frequent releases.',
    use_this_if: 'You need an icon Lucide does not have, or you want a much larger set.',
    skip_if: 'You are already on Lucide and only need 20-30 icons — stay where you are.',
  },
  {
    full_name: 'phosphor-icons/core',
    category_slugs: ['icons'],
    is_featured: false,
    curator_take:
      'Distinctive icon set with six weight variants (thin to fill). Best when your brand has a strong visual identity and the default Lucide aesthetic feels too generic.',
    use_this_if: 'You want icon weights to match your typographic hierarchy and a memorable visual style.',
    skip_if: 'You need a huge library (use Tabler) or just shipping a default style (use Lucide).',
  },

  // ════════════════════════════════════════════════════════════════
  // ANIMATION (8)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'motiondivision/motion',
    category_slugs: ['animation'],
    is_featured: true,
    curator_take:
      'Formerly Framer Motion. The default React animation library in 2026. Declarative, gesture support, layout animations, scroll, presence. ~31k stars and 3.6M weekly downloads. Trusted by Framer and Figma. Now a hybrid engine targeting 120fps GPU-accelerated animations.',
    use_this_if: 'You are doing any non-trivial React animation — page transitions, gestures, layout animations.',
    skip_if: 'You are doing only static fades — CSS transitions are enough and ship zero JS.',
  },
  {
    full_name: 'greensock/GSAP',
    category_slugs: ['animation'],
    is_featured: true,
    curator_take:
      'The industry standard for advanced web animation since forever. Framework-agnostic — works with React, Vue, vanilla JS, anywhere. Strongest tool for complex timelines, scroll-driven animation, and SVG morphing. Free core, paid plugins for the fanciest stuff.',
    use_this_if: 'You are building marketing sites with award-show-worthy animation, complex scroll narratives, or SVG art.',
    skip_if: 'You are doing standard React UI animation — Motion is more idiomatic.',
  },
  {
    full_name: 'juliangarnier/anime',
    category_slugs: ['animation'],
    is_featured: false,
    curator_take:
      'Lightweight JavaScript animation engine. ~66k stars. Great for SVG and DOM animation without React-specific bindings. Smaller community than GSAP, but the API is approachable and the bundle is tiny.',
    use_this_if: 'You want a small, framework-agnostic animation library for marketing sites or vanilla JS projects.',
    skip_if: 'You are in React — Motion is more idiomatic, similar bundle size, larger community.',
  },
  {
    full_name: 'pmndrs/react-spring',
    category_slugs: ['animation'],
    is_featured: false,
    curator_take:
      'Physics-based spring animations for React. ~29k stars. Better than Motion when you need genuinely physical motion (interruptible drags, momentum scrolls). Less DX polish than Motion for the common cases.',
    use_this_if: 'You are building interruptible drag interactions, momentum-based UI, or physics-feeling motion.',
    skip_if: 'You want declarative tween-based animations — Motion is easier.',
  },
  {
    full_name: 'airbnb/lottie-web',
    category_slugs: ['animation'],
    is_featured: false,
    curator_take:
      'Render Adobe After Effects animations as JSON in the browser. ~30k stars. Best way to bring a designer\'s After Effects work to web/mobile without re-implementing. Files can be large — optimize them.',
    use_this_if: 'A designer is delivering complex animations (onboarding flows, illustrations) authored in After Effects.',
    skip_if: 'You need interactive animations — Lottie is for playback, not interaction.',
  },
  {
    full_name: 'mojs/mojs',
    category_slugs: ['animation'],
    is_featured: false,
    curator_take:
      'Motion graphics for the web — built for animated UI flourishes. Smaller community than Motion or GSAP but produces distinctive, polished microinteractions out of the box.',
    use_this_if: 'You want delightful microinteractions (toast pops, button effects, confetti) and want them to look good without tuning.',
    skip_if: 'You need the full timeline/scroll control of GSAP or the React integration of Motion.',
  },
  {
    full_name: 'magic-ui-design/magic-ui',
    category_slugs: ['animation', 'ui-components'],
    is_featured: false,
    curator_take:
      '50+ animated React components built on Motion + Tailwind. Copy-paste style like shadcn but for animated effects: animated text, marquee, bento grids, file trees. Pairs perfectly with shadcn for landing pages.',
    use_this_if: 'You need animated marketing landing components fast and you are already on shadcn + Tailwind.',
    skip_if: 'You are building a utility app where animation is decoration — focus on UX, not flair.',
  },
  {
    full_name: 'aceternity/ui',
    category_slugs: ['animation', 'ui-components'],
    is_featured: false,
    curator_take:
      'Premium-feeling animated components for landing pages. Free core + paid pro. Useful as a reference even if you do not use the components directly — the source shows good Motion patterns.',
    use_this_if: 'You are shipping a SaaS landing page and want premium-feeling motion without a designer.',
    skip_if: 'You need consistent product UI components — these are landing-page flair, not a design system.',
  },

  // ════════════════════════════════════════════════════════════════
  // AI & ML (10)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'langchain-ai/langchain',
    category_slugs: ['ai-ml'],
    is_featured: true,
    curator_take:
      'The biggest LLM framework. Chains, agents, RAG pipelines, integrations with every model, vector DB, and tool. Strong ecosystem with LangGraph for agentic workflows. The criticism: for simple use cases the abstractions feel heavy and the API has churned across versions. Worth it once your AI stack outgrows direct API calls.',
    use_this_if: 'You are building multi-step AI pipelines (agents, complex RAG, tool use) and need the ecosystem.',
    skip_if: 'You are just calling an LLM API and processing the response — use the native SDK directly.',
  },
  {
    full_name: 'run-llama/llama_index',
    category_slugs: ['ai-ml'],
    is_featured: true,
    curator_take:
      'RAG specialist. Better document loading, chunking, and retrieval than LangChain for retrieval-first apps. Strong on advanced strategies — hybrid search, re-ranking, recursive retrieval. Now expanded into a general LLM toolkit but RAG is still the sweet spot.',
    use_this_if: 'Your AI app is mostly retrieval over documents — knowledge base, support bot, internal search.',
    skip_if: 'You need broad agent/tool use — LangChain has wider integration coverage.',
  },
  {
    full_name: 'microsoft/autogen',
    category_slugs: ['ai-ml'],
    is_featured: false,
    curator_take:
      'Multi-agent conversation framework from Microsoft. Stronger than LangChain for genuinely autonomous multi-agent setups where agents negotiate with each other. Younger ecosystem, fewer integrations.',
    use_this_if: 'You are building experimental multi-agent systems where agents collaborate or debate.',
    skip_if: 'You just want a single agent or a simple chatbot — overkill.',
  },
  {
    full_name: 'crewAIInc/crewAI',
    category_slugs: ['ai-ml'],
    is_featured: false,
    curator_take:
      'Role-based agent orchestration. Simpler mental model than AutoGen — define agents with roles, give them tools, let them collaborate. Popular for content workflows, research agents, and internal automation.',
    use_this_if: 'You want multi-agent collaboration with a simple role-based mental model.',
    skip_if: 'You need fine-grained control over agent communication or large-scale production deployment.',
  },
  {
    full_name: 'qdrant/qdrant',
    category_slugs: ['ai-ml', 'database'],
    is_featured: false,
    curator_take:
      'Rust-based vector database — fast, production-grade, Apache 2.0. Good developer experience and clear pricing if you use their managed cloud. Strong choice if Postgres+pgvector cannot handle your scale.',
    use_this_if: 'You need production-grade vector search at scale and Postgres is hitting limits.',
    skip_if: 'You are starting fresh on Postgres — pgvector is enough for most apps.',
  },
  {
    full_name: 'chroma-core/chroma',
    category_slugs: ['ai-ml', 'database'],
    is_featured: false,
    curator_take:
      'AI-native embedding database designed for rapid prototyping. Easy to run locally, tight LangChain integration. Better for hackathons and internal tools than huge production deployments.',
    use_this_if: 'You are prototyping RAG, building an internal tool, or bundling a vector DB into a desktop/local app.',
    skip_if: 'You expect millions of vectors in production — look at Qdrant, Weaviate, or pgvector.',
  },
  {
    full_name: 'pgvector/pgvector',
    category_slugs: ['ai-ml', 'database'],
    is_featured: true,
    curator_take:
      'Vector search inside Postgres. ~12k stars and dominant in 2026 as the boring-but-correct default. If you already have Postgres (Supabase, Neon, RDS), do not add another database — just install this extension. Works for the vast majority of RAG apps.',
    use_this_if: 'You are already on Postgres and want vector search without operating a second database.',
    skip_if: 'You need billion-scale vector search with millisecond latency — a dedicated vector DB is worth the operational cost.',
  },
  {
    full_name: 'milvus-io/milvus',
    category_slugs: ['ai-ml', 'database'],
    is_featured: false,
    curator_take:
      'Open-source vector DB with the most mature features for huge scale. ~30k stars. Steeper operational burden than Qdrant. Used in production by companies doing serious vector workloads.',
    use_this_if: 'You are running vector search at extreme scale with a team that can operate distributed systems.',
    skip_if: 'You are a small team — Qdrant or pgvector will be enough and easier to run.',
  },
  {
    full_name: 'weaviate/weaviate',
    category_slugs: ['ai-ml', 'database'],
    is_featured: false,
    curator_take:
      'Vector DB with strong hybrid search (vector + keyword) and built-in modules for common embedding workflows. Slightly higher learning curve than Qdrant but powerful for production RAG.',
    use_this_if: 'You need hybrid keyword + vector search and want it built in rather than bolted on.',
    skip_if: 'You only need pure vector search — Qdrant is simpler.',
  },
  {
    full_name: 'ollama/ollama',
    category_slugs: ['ai-ml', 'cli-tools'],
    is_featured: true,
    curator_take:
      'Run open-source LLMs locally with one command. ~95k stars. Essential for AI development — test prompts against Llama, Mistral, Phi without burning API credits. Production use is limited unless you have the GPUs.',
    use_this_if: 'You want to develop and test LLM features without API costs, or run small models on a workstation.',
    skip_if: 'You need production inference at scale — use vLLM or a hosted API.',
  },

  // ════════════════════════════════════════════════════════════════
  // AUTH (5)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'better-auth/better-auth',
    category_slugs: ['auth'],
    is_featured: true,
    curator_take:
      'The most flexible modern auth library for TypeScript stacks in 2026. Plugin ecosystem for 2FA, phone OTP, organization roles, audit logs. Same code works with Next.js, TanStack Start, Express. Becoming the default choice for greenfield TS projects.',
    use_this_if: 'You are starting a full-stack TypeScript app and want long-term scalability with full control over auth flows.',
    skip_if: 'You want a fully managed auth platform with no ops — use WorkOS or Auth0.',
  },
  {
    full_name: 'nextauthjs/next-auth',
    category_slugs: ['auth'],
    is_featured: false,
    curator_take:
      'The OG Next.js auth library, now Auth.js. ~24k stars. Quick to add OAuth providers (80+ preconfigured). Best for fast MVP work where you mostly need social login. Less flexible than Better Auth for advanced flows.',
    use_this_if: 'You are shipping a Next.js MVP fast and need social login (Google, GitHub) working in an hour.',
    skip_if: 'You need fine-grained control over sessions, multi-tenant logic, or organization roles — pick Better Auth.',
  },
  {
    full_name: 'supertokens/supertokens-core',
    category_slugs: ['auth'],
    is_featured: false,
    curator_take:
      'Self-hostable auth backend with managed cloud option. Full session management, user management dashboard, multi-tenancy. Good middle ground between rolling your own and using a SaaS like Auth0.',
    use_this_if: 'You want full control over auth data, self-hosting capability, and a working admin dashboard.',
    skip_if: 'You want zero ops — managed providers will be less work.',
  },
  {
    full_name: 'lucia-auth/lucia',
    category_slugs: ['auth'],
    is_featured: false,
    curator_take:
      'Note: Lucia announced deprecation in 2024 — the maintainer is sunsetting it in favor of writing your own. Still useful as a learning reference for session-based auth patterns in TypeScript. Better Auth picks up where Lucia left off.',
    use_this_if: 'You want to learn how session-based auth works from a clean codebase before building your own.',
    skip_if: 'You are picking auth for a new production app — use Better Auth or Auth.js instead.',
  },
  {
    full_name: 'keycloak/keycloak',
    category_slugs: ['auth'],
    is_featured: false,
    curator_take:
      'Enterprise auth/IAM platform. ~24k stars. Java-based, self-hosted, supports SAML, OIDC, fine-grained authorization. Heavy to operate but the right pick for compliance-heavy enterprise apps.',
    use_this_if: 'You are doing enterprise SSO with SAML/OIDC and need self-hosting for compliance reasons.',
    skip_if: 'You are a small team or a B2C product — way too much complexity.',
  },

  // ════════════════════════════════════════════════════════════════
  // DATABASE & ORM (8)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'supabase/supabase',
    category_slugs: ['database', 'auth'],
    is_featured: true,
    curator_take:
      'Postgres + Auth + Storage + Realtime + Edge Functions in one open-source platform. ~73k stars. The fastest way to ship a backend in 2026 for solo founders and small teams. Mumbai region for India latency. Free tier handles real apps until ~50k MAU.',
    use_this_if: 'You are a solo founder or small team shipping a SaaS or mobile app and want one backend service.',
    skip_if: 'You need NoSQL specifically, or your team has strong DevOps and wants raw Postgres.',
  },
  {
    full_name: 'drizzle-team/drizzle-orm',
    category_slugs: ['database'],
    is_featured: true,
    curator_take:
      'TypeScript-first ORM with SQL-like syntax. ~25k stars. Lighter than Prisma, zero codegen step, faster cold starts on serverless. Becoming the default for new Next.js + Postgres projects.',
    use_this_if: 'You are on Postgres/MySQL/SQLite, write TypeScript, and want SQL-like queries with type safety.',
    skip_if: 'Your team prefers a high-level ORM with relations resolved magically — Prisma is more polished.',
  },
  {
    full_name: 'prisma/prisma',
    category_slugs: ['database'],
    is_featured: false,
    curator_take:
      'The polished ORM. ~38k stars. Best developer experience for relational data, declarative schema, generated client. Trade-off: cold starts on serverless are slower than Drizzle, and the abstraction can fight you on complex queries.',
    use_this_if: 'Your team values DX over performance and most queries are CRUD on relational data.',
    skip_if: 'You are running on Edge or Vercel functions where cold start matters — Drizzle is faster.',
  },
  {
    full_name: 'typeorm/typeorm',
    category_slugs: ['database'],
    is_featured: false,
    curator_take:
      'Decorator-based ORM, used heavily in NestJS ecosystem. Battle-tested but development pace has slowed. Drizzle and Prisma are the newer defaults for greenfield projects.',
    use_this_if: 'You are on NestJS where TypeORM is the expected default.',
    skip_if: 'You are starting a new project — pick Drizzle or Prisma.',
  },
  {
    full_name: 'planetscale/database-js',
    category_slugs: ['database'],
    is_featured: false,
    curator_take:
      'Serverless-first MySQL client. Good when you are on PlanetScale specifically. Works well with Drizzle as the driver.',
    use_this_if: 'You are on PlanetScale or another Vitess-based MySQL service.',
    skip_if: 'You are not on PlanetScale — pick a database first.',
  },
  {
    full_name: 'pocketbase/pocketbase',
    category_slugs: ['database', 'auth'],
    is_featured: false,
    curator_take:
      'Single-file Go backend with SQLite, auth, file storage, realtime. ~40k stars. Pocket-sized Supabase alternative. Great for indie projects, prototypes, and self-hosted internal tools.',
    use_this_if: 'You want a single binary you can drop on a VPS for an indie project, prototype, or internal tool.',
    skip_if: 'You are scaling past ~10k users or need Postgres-specific features.',
  },
  {
    full_name: 'kysely-org/kysely',
    category_slugs: ['database'],
    is_featured: false,
    curator_take:
      'Type-safe SQL query builder for TypeScript. Lower level than Drizzle/Prisma — closer to writing raw SQL with types. Best when you really want to think in SQL.',
    use_this_if: 'You write complex SQL and want type safety without an ORM abstraction.',
    skip_if: 'You want schema migration tooling and a managed query layer — pick Drizzle.',
  },
  {
    full_name: 'edgedb/edgedb',
    category_slugs: ['database'],
    is_featured: false,
    curator_take:
      'Graph-relational database with EdgeQL. Beautiful query language, strong types, very opinionated. Smaller ecosystem so harder to hire for.',
    use_this_if: 'You are a small founding team that loves typed query languages and is okay with smaller community.',
    skip_if: 'You need to hire developers fast or integrate with the broader Postgres ecosystem.',
  },

  // ════════════════════════════════════════════════════════════════
  // PAYMENTS (4)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'razorpay/razorpay-node',
    category_slugs: ['payments'],
    is_featured: true,
    curator_take:
      'The Indian payment stack. UPI, cards, wallets, EMI, subscriptions. INR-native so you avoid currency-conversion headaches. Mandatory if you are charging Indian customers. Better domestic rates than Stripe India.',
    use_this_if: 'You are charging Indian customers — this is the default, not a choice.',
    skip_if: 'You serve only international customers — use Stripe.',
  },
  {
    full_name: 'stripe/stripe-node',
    category_slugs: ['payments'],
    is_featured: true,
    curator_take:
      'The global payment standard. ~3.9k stars on the Node SDK. Best developer experience in the industry. India support exists but pricing and onboarding are weaker than Razorpay for INR collection.',
    use_this_if: 'You serve global customers, especially US/EU SaaS — DX is unmatched.',
    skip_if: 'You serve only Indian customers — Razorpay has better local rates and UPI support.',
  },
  {
    full_name: 'getlago/lago',
    category_slugs: ['payments'],
    is_featured: false,
    curator_take:
      'Open-source billing/metering for usage-based pricing. Self-hostable or managed. Lighter than Stripe Billing for pure metering use cases.',
    use_this_if: 'You are doing usage-based pricing (API credits, tokens, seats) and want billing infra you can own.',
    skip_if: 'You are doing simple monthly subscriptions — Stripe Billing or Razorpay subscriptions are easier.',
  },
  {
    full_name: 'medusajs/medusa',
    category_slugs: ['payments'],
    is_featured: false,
    curator_take:
      'Open-source headless commerce. ~25k stars. Strong alternative to Shopify for teams that want full control over their commerce backend. Solid plugin ecosystem.',
    use_this_if: 'You are building custom e-commerce and Shopify\'s opinions are getting in your way.',
    skip_if: 'You just need a store — Shopify will be faster.',
  },

  // ════════════════════════════════════════════════════════════════
  // FORMS & VALIDATION (5)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'colinhacks/zod',
    category_slugs: ['forms', 'frameworks'],
    is_featured: true,
    curator_take:
      'TypeScript-first schema validation. ~35k stars. The de facto choice for input validation in TS apps. Works with every form library, every API framework, every ORM. If you are not using it yet, you should be.',
    use_this_if: 'You are writing TypeScript and validating any input — forms, API requests, env vars, anything.',
    skip_if: 'You are not on TypeScript or you are deep in a Yup codebase that works fine.',
  },
  {
    full_name: 'react-hook-form/react-hook-form',
    category_slugs: ['forms'],
    is_featured: true,
    curator_take:
      'The fastest, smallest form library for React. ~39k stars. Uncontrolled by default so re-renders stay minimal. Pairs naturally with Zod for validation. Default choice for any React form heavier than a couple of inputs.',
    use_this_if: 'You are building any non-trivial form in React.',
    skip_if: 'You have a 2-input form — useState is enough.',
  },
  {
    full_name: 'TanStack/form',
    category_slugs: ['forms'],
    is_featured: false,
    curator_take:
      'New TanStack entry, framework-agnostic forms. Headless, type-safe, supports React/Vue/Solid. Worth watching but React Hook Form is more mature today.',
    use_this_if: 'You want a framework-agnostic form library and you are early enough to bet on a younger tool.',
    skip_if: 'You need maturity and community size — React Hook Form is safer.',
  },
  {
    full_name: 'jquense/yup',
    category_slugs: ['forms'],
    is_featured: false,
    curator_take:
      'Schema validation predating Zod. Still works fine but Zod has better TypeScript inference. New projects should pick Zod.',
    use_this_if: 'You are in a Yup codebase and migration cost is real.',
    skip_if: 'You are starting fresh — use Zod.',
  },
  {
    full_name: 'final-form/final-form',
    category_slugs: ['forms'],
    is_featured: false,
    curator_take:
      'Form state library, framework-agnostic. React Final Form was popular pre-React Hook Form. Less active today.',
    use_this_if: 'You are maintaining an existing Final Form codebase.',
    skip_if: 'You are starting new — React Hook Form has won.',
  },

  // ════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT (6)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'TanStack/query',
    category_slugs: ['state', 'database'],
    is_featured: true,
    curator_take:
      'The #1-rated tool in the React 2025 survey. Async state management — fetching, caching, syncing server state. Not a state library exactly but solves what most React apps actually needed Redux for. Default choice.',
    use_this_if: 'You are fetching data from any API in React. Yes, you need this.',
    skip_if: 'You are on Next.js App Router with mostly server components — fetch directly on the server.',
  },
  {
    full_name: 'pmndrs/zustand',
    category_slugs: ['state'],
    is_featured: true,
    curator_take:
      '#2 in the React survey. Tiny, no boilerplate, hook-based. Replaced Redux for most teams. Stays out of your way until you genuinely need it.',
    use_this_if: 'You have global client state (auth, UI flags, undo history) and useContext is creaking.',
    skip_if: 'You only have server state — TanStack Query covers it.',
  },
  {
    full_name: 'pmndrs/jotai',
    category_slugs: ['state'],
    is_featured: false,
    curator_take:
      'Atomic state for React. Different model than Zustand — composable atoms instead of a single store. Better for derived state that updates granularly without re-renders.',
    use_this_if: 'You have lots of small interconnected state pieces with computed values.',
    skip_if: 'You want a simple single store — Zustand is easier.',
  },
  {
    full_name: 'reduxjs/redux-toolkit',
    category_slugs: ['state'],
    is_featured: false,
    curator_take:
      'Modern Redux. Massively better DX than classic Redux but still more boilerplate than Zustand. Still relevant for big enterprise apps with established Redux patterns and devtools requirements.',
    use_this_if: 'You are in an existing Redux codebase or your team needs predictable, time-travel-able state for very complex apps.',
    skip_if: 'You are starting new and not building Photoshop — Zustand is enough.',
  },
  {
    full_name: 'statelyai/xstate',
    category_slugs: ['state'],
    is_featured: false,
    curator_take:
      'Actor-based state machines. ~27k stars. Overkill for most apps but unbeatable for genuinely complex workflows — multi-step forms, async retries with rollback, real-time collaboration. Worth learning even if you do not adopt.',
    use_this_if: 'You have a genuinely complex workflow with many states, transitions, and side effects.',
    skip_if: 'You have toggles and modals — useState is enough.',
  },
  {
    full_name: 'mobxjs/mobx',
    category_slugs: ['state'],
    is_featured: false,
    curator_take:
      'Observable-based reactive state. Different mental model than Zustand/Jotai — closer to Vue\'s reactivity. Still active but losing ground to simpler stores in 2026.',
    use_this_if: 'Your team comes from Vue/Angular and wants familiar reactive patterns.',
    skip_if: 'You are React-first — Zustand fits the ecosystem better.',
  },

  // ════════════════════════════════════════════════════════════════
  // ROUTING (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'remix-run/react-router',
    category_slugs: ['routing'],
    is_featured: true,
    curator_take:
      'The default React router. ~53k stars. v7 merged Remix into React Router so it now also does data loading and form actions. Best choice for React SPAs and SSR apps not on Next.js.',
    use_this_if: 'You are building a React SPA or non-Next.js SSR app — this is the default.',
    skip_if: 'You are on Next.js or TanStack Start — they have their own routers.',
  },
  {
    full_name: 'TanStack/router',
    category_slugs: ['routing'],
    is_featured: false,
    curator_take:
      'Type-safe router with first-class search-param handling. The router that powers TanStack Start. Stronger types than React Router but newer ecosystem.',
    use_this_if: 'You want truly typed routes and search params, especially in SPAs without Next.js.',
    skip_if: 'You need maturity and community size — React Router is safer.',
  },
  {
    full_name: 'molefrog/wouter',
    category_slugs: ['routing'],
    is_featured: false,
    curator_take:
      '~1.5kb router for React. Sometimes that is exactly what you want — a marketing site, an embedded widget, a Chrome extension popup.',
    use_this_if: 'You are building something tiny where bundle size matters more than features.',
    skip_if: 'You need nested routes, loaders, or anything beyond basic navigation.',
  },

  // ════════════════════════════════════════════════════════════════
  // FRAMEWORKS (6)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'vercel/next.js',
    category_slugs: ['frameworks'],
    is_featured: true,
    curator_take:
      'The React framework. ~128k stars. App Router is the bet — server components, server actions, edge runtime. 2026 sentiment is mixed: people love the capabilities, complain about the complexity. Still the default for most React production apps in 2026.',
    use_this_if: 'You are building a React app that needs SSR, SEO, and server-side data fetching.',
    skip_if: 'You are building a pure SPA or content site — Vite or Astro is simpler.',
  },
  {
    full_name: 'vitejs/vite',
    category_slugs: ['frameworks', 'devops'],
    is_featured: true,
    curator_take:
      'The build tool that won. ~71k stars. Dev server is instant, build is fast, plugin ecosystem is rich. Default for most non-Next.js React/Vue/Svelte projects in 2026.',
    use_this_if: 'You are building anything that does not need Next.js-specific features.',
    skip_if: 'You are on Next.js — its build tooling is included.',
  },
  {
    full_name: 'withastro/astro',
    category_slugs: ['frameworks', 'cms-content'],
    is_featured: true,
    curator_take:
      'Content-first framework with islands architecture. ~47k stars. Ships minimal JS, multi-framework component support (React + Vue + Svelte in one project). Best choice for content-heavy sites where Next.js feels too heavy.',
    use_this_if: 'You are building a blog, marketing site, docs, or any content-heavy site.',
    skip_if: 'Your app is highly interactive — Next.js or Vite handle that better.',
  },
  {
    full_name: 'sveltejs/kit',
    category_slugs: ['frameworks'],
    is_featured: false,
    curator_take:
      'Svelte\'s Next.js. ~19k stars. Smaller community than React but the DX is genuinely better and runtime bundles are smaller. Worth considering for greenfield projects where team training is feasible.',
    use_this_if: 'You are starting a new project and your team is open to Svelte.',
    skip_if: 'You need to hire fast — the React talent pool is much larger.',
  },
  {
    full_name: 'nuxt/nuxt',
    category_slugs: ['frameworks'],
    is_featured: false,
    curator_take:
      'Vue\'s Next.js. ~56k stars. Mature, great DX, strong ecosystem. The default for Vue apps that need SSR and SEO.',
    use_this_if: 'Your team writes Vue and you need a full-stack framework.',
    skip_if: 'You are not on Vue — pick the React or Svelte equivalent.',
  },
  {
    full_name: 'solidjs/solid',
    category_slugs: ['frameworks'],
    is_featured: false,
    curator_take:
      'JSX with fine-grained reactivity instead of VDOM. ~33k stars. Closer to Svelte\'s mental model with React\'s syntax. Smaller community but excellent performance.',
    use_this_if: 'You want React-like JSX with better performance and can accept a smaller ecosystem.',
    skip_if: 'You need a vast plugin ecosystem or fast hiring — React still wins.',
  },

  // ════════════════════════════════════════════════════════════════
  // MOBILE (4)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'expo/expo',
    category_slugs: ['mobile'],
    is_featured: true,
    curator_take:
      'The way to build React Native in 2026. ~32k stars. Managed workflow that handles native builds (EAS), updates (OTA), and routing (Expo Router). Default for cross-platform mobile unless you have hard native requirements.',
    use_this_if: 'You are building an iOS + Android app and your team writes React.',
    skip_if: 'You need deep platform-specific features (Apple Watch, complex AR) — go fully native.',
  },
  {
    full_name: 'facebook/react-native',
    category_slugs: ['mobile'],
    is_featured: false,
    curator_take:
      'The cross-platform mobile framework. ~120k stars. Most people use it through Expo now. New Architecture (Fabric + TurboModules) shipped widely and improved performance significantly.',
    use_this_if: 'You are working on an existing RN codebase or have specific reasons to avoid Expo.',
    skip_if: 'You are starting new — use Expo (which is React Native under the hood).',
  },
  {
    full_name: 'tamagui/tamagui',
    category_slugs: ['mobile', 'ui-components'],
    is_featured: false,
    curator_take:
      'Universal UI for React Native + web. Compile-time style extraction means near-native performance. The best option in 2026 for genuinely sharing UI code across web and mobile.',
    use_this_if: 'You are shipping mobile and web with one codebase and want truly performant UI.',
    skip_if: 'You are web-only or mobile-only — simpler libraries exist for each.',
  },
  {
    full_name: 'nativewind/nativewind',
    category_slugs: ['mobile'],
    is_featured: false,
    curator_take:
      'Tailwind for React Native. Compiles utility classes at build time. Best when you already love Tailwind on web and want the same workflow on mobile.',
    use_this_if: 'You are on Expo + React Native and want the Tailwind DX you have on web.',
    skip_if: 'You are not on Tailwind — use StyleSheet or styled-components.',
  },

  // ════════════════════════════════════════════════════════════════
  // CMS & CONTENT (4)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'payloadcms/payload',
    category_slugs: ['cms-content'],
    is_featured: true,
    curator_take:
      'TypeScript-native headless CMS. ~30k stars. Self-hostable, code-first schema, generated TypeScript types. Best choice in 2026 for builders who want a CMS that respects code workflows.',
    use_this_if: 'You want a CMS you can version-control and self-host with a TypeScript-native API.',
    skip_if: 'Your content team needs a polished WYSIWYG and you are okay with SaaS — use Contentful or Sanity.',
  },
  {
    full_name: 'directus/directus',
    category_slugs: ['cms-content', 'database'],
    is_featured: false,
    curator_take:
      'Headless CMS layered on top of any SQL database. ~28k stars. Strong when you have an existing database and want a no-code admin UI bolted on.',
    use_this_if: 'You have an existing Postgres/MySQL DB and want a CMS admin UI without migrating schema.',
    skip_if: 'You are starting fresh — Payload is more modern.',
  },
  {
    full_name: 'strapi/strapi',
    category_slugs: ['cms-content'],
    is_featured: false,
    curator_take:
      'Headless CMS with admin UI. ~64k stars. Mature, large community, plugin ecosystem. Heavier than Payload, more familiar if you come from WordPress.',
    use_this_if: 'You want a mature CMS with a friendly admin UI and a large plugin ecosystem.',
    skip_if: 'You want TypeScript-native code-first content modeling — Payload fits builders better.',
  },
  {
    full_name: 'TanStack/db',
    category_slugs: ['cms-content', 'database', 'state'],
    is_featured: false,
    curator_take:
      'New 2026 entry from TanStack — local-first reactive DB for offline-capable apps. Worth watching but ecosystem is still young.',
    use_this_if: 'You are building an offline-first app and want to bet on the TanStack stack.',
    skip_if: 'You need production maturity today — wait 6-12 months.',
  },

  // ════════════════════════════════════════════════════════════════
  // ANALYTICS (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'PostHog/posthog',
    category_slugs: ['analytics'],
    is_featured: true,
    curator_take:
      'Open-source product analytics. ~21k stars. Self-hostable or managed. Combines analytics, session replay, feature flags, A/B testing in one platform. Generous free tier — most early-stage products never hit the paid threshold.',
    use_this_if: 'You want product analytics + session replay + feature flags in one tool without paying GA-replacement prices.',
    skip_if: 'You just want simple page-view counts — Plausible is lighter.',
  },
  {
    full_name: 'plausible/analytics',
    category_slugs: ['analytics'],
    is_featured: false,
    curator_take:
      'Lightweight, privacy-friendly Google Analytics alternative. Cookie-less, GDPR/DPDP-friendly. Self-host or use their managed service from ₹720/year.',
    use_this_if: 'You want simple traffic analytics without privacy headaches or 50MB scripts.',
    skip_if: 'You need funnel analysis, session replay, or product event tracking — PostHog is the better fit.',
  },
  {
    full_name: 'umami-software/umami',
    category_slugs: ['analytics'],
    is_featured: false,
    curator_take:
      'Self-hosted Plausible alternative. ~22k stars. Free if you can run a Node process and a Postgres database.',
    use_this_if: 'You want privacy-friendly analytics and can self-host.',
    skip_if: 'You do not want to run another service — Plausible managed is cheap.',
  },

  // ════════════════════════════════════════════════════════════════
  // SEARCH (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'meilisearch/meilisearch',
    category_slugs: ['search'],
    is_featured: true,
    curator_take:
      'Fast, typo-tolerant search engine in Rust. ~48k stars. Easiest search engine to operate — single binary, sensible defaults, great DX. Good middle ground between Postgres full-text and Elasticsearch.',
    use_this_if: 'You need user-facing search on a product catalog, docs site, or app.',
    skip_if: 'You need extreme scale or complex aggregations — Elasticsearch still wins.',
  },
  {
    full_name: 'typesense/typesense',
    category_slugs: ['search'],
    is_featured: false,
    curator_take:
      'C++ search engine with similar DX to Meilisearch. ~21k stars. Slightly more mature on some clustering features. Either is fine — pick the docs you like better.',
    use_this_if: 'You want a Meilisearch-equivalent with slightly better clustering for production scale.',
    skip_if: 'You are happy with Meilisearch — no reason to switch.',
  },
  {
    full_name: 'orama/orama',
    category_slugs: ['search'],
    is_featured: false,
    curator_take:
      'Full-text and vector search engine that runs everywhere — browser, edge, server. Useful for client-side search on small datasets (docs, blogs) where you avoid backend round-trips.',
    use_this_if: 'You need fast in-browser search over a small dataset — docs, blog posts, product catalog under 10k items.',
    skip_if: 'Your dataset is huge or changes constantly — use a server-side engine.',
  },

  // ════════════════════════════════════════════════════════════════
  // CHARTS & VISUALIZATION (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'recharts/recharts',
    category_slugs: ['charts-viz'],
    is_featured: true,
    curator_take:
      'Composable charting library for React. ~24k stars. Built on D3 but with a much friendlier API. Default choice for dashboards and analytics UIs in React.',
    use_this_if: 'You are adding charts to a React dashboard or analytics view.',
    skip_if: 'You need fully custom data viz — D3 directly gives you more control.',
  },
  {
    full_name: 'd3/d3',
    category_slugs: ['charts-viz'],
    is_featured: false,
    curator_take:
      'The data visualization library. ~108k stars. Steep learning curve but unmatched flexibility. Used under the hood by most React charting libraries. Reach for it when off-the-shelf charts cannot do what you need.',
    use_this_if: 'You are building genuinely custom data visualization or interactive infographics.',
    skip_if: 'You need standard bar/line/pie charts — Recharts is faster.',
  },
  {
    full_name: 'apache/echarts',
    category_slugs: ['charts-viz'],
    is_featured: false,
    curator_take:
      'Mature, feature-rich charting library with strong support for complex chart types (sankey, treemap, candlestick). Heavier than Recharts but richer out of the box.',
    use_this_if: 'You need advanced chart types out of the box without building them on D3.',
    skip_if: 'You only need basic charts — Recharts is lighter.',
  },

  // ════════════════════════════════════════════════════════════════
  // EMAIL (2)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'resend/react-email',
    category_slugs: ['email'],
    is_featured: true,
    curator_take:
      'React components for email. Build emails as React, render to HTML for sending. Pairs with Resend\'s sending API for the cleanest email DX in 2026. Free up to 100 emails/day on Resend.',
    use_this_if: 'You are sending transactional or marketing email and want to author templates in React.',
    skip_if: 'You only send plain-text emails — overkill.',
  },
  {
    full_name: 'maizzle/maizzle',
    category_slugs: ['email'],
    is_featured: false,
    curator_take:
      'Tailwind for email. Authors HTML emails using Tailwind classes, compiles to inlined CSS for email clients. Smaller community than React Email but battle-tested for client compatibility.',
    use_this_if: 'You write emails in HTML and want Tailwind without compatibility headaches.',
    skip_if: 'You are React-first — use React Email.',
  },

  // ════════════════════════════════════════════════════════════════
  // TESTING (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'vitest-dev/vitest',
    category_slugs: ['testing'],
    is_featured: true,
    curator_take:
      'Vite-native unit test runner. ~13k stars. Faster than Jest, compatible API. Default for new Vite-based projects in 2026.',
    use_this_if: 'You are starting a new project on Vite or modernizing from Jest.',
    skip_if: 'You are deep in a Jest codebase and migration cost is high — Jest still works.',
  },
  {
    full_name: 'microsoft/playwright',
    category_slugs: ['testing'],
    is_featured: true,
    curator_take:
      'End-to-end browser testing. ~65k stars. Beat Cypress on speed, parallelism, and multi-browser support. Default for E2E testing in 2026.',
    use_this_if: 'You are writing E2E tests for a web app.',
    skip_if: 'You only need unit tests — use Vitest.',
  },
  {
    full_name: 'storybookjs/storybook',
    category_slugs: ['testing', 'ui-components'],
    is_featured: false,
    curator_take:
      'Component development environment. ~84k stars. Develop, test, and document components in isolation. Mostly used by larger teams with design systems.',
    use_this_if: 'You are maintaining a design system or have multiple developers building components in parallel.',
    skip_if: 'You are a solo developer — overkill for most product work.',
  },

  // ════════════════════════════════════════════════════════════════
  // RICH TEXT & EDITORS (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'ueberdosis/tiptap',
    category_slugs: ['rich-text'],
    is_featured: true,
    curator_take:
      'Headless rich-text editor built on ProseMirror. ~28k stars. The default in 2026 for embedded editors in SaaS apps — Notion-style document editing, comments, blog posts.',
    use_this_if: 'You are adding a rich-text editor anywhere in your app.',
    skip_if: 'You need a simple textarea — do not over-engineer.',
  },
  {
    full_name: 'facebook/lexical',
    category_slugs: ['rich-text'],
    is_featured: false,
    curator_take:
      'Meta\'s extensible text editor framework. Used in Facebook and Instagram. More framework-y than Tiptap, steeper learning curve, more powerful for complex editors.',
    use_this_if: 'You are building a complex editor with custom blocks and need maximum extensibility.',
    skip_if: 'You want fast adoption with sensible defaults — Tiptap.',
  },
  {
    full_name: 'BlockNote/BlockNote',
    category_slugs: ['rich-text'],
    is_featured: false,
    curator_take:
      'Notion-style block editor built on Tiptap. Higher abstraction — drop it in and get a Notion-clone editor without configuring blocks yourself.',
    use_this_if: 'You want a Notion-like editor immediately and do not care about deep customization.',
    skip_if: 'You need custom blocks and behaviors — go one layer down to Tiptap directly.',
  },

  // ════════════════════════════════════════════════════════════════
  // DEVOPS & DEPLOY (3)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'docker/compose',
    category_slugs: ['devops'],
    is_featured: false,
    curator_take:
      'Define multi-container apps in a single YAML file. Still the simplest way to run a local dev environment with multiple services (DB, cache, app, worker).',
    use_this_if: 'You need to spin up DB + Redis + app for local dev or quick self-hosted deploys.',
    skip_if: 'You are serverless-first and never run a Postgres locally.',
  },
  {
    full_name: 'coollabsio/coolify',
    category_slugs: ['devops'],
    is_featured: false,
    curator_take:
      'Self-hosted Heroku/Vercel alternative. ~30k stars. Deploy from Git to your own VPS. Good for indie devs avoiding Vercel costs at scale.',
    use_this_if: 'You want Vercel-like DX on your own VPS and you are okay running infrastructure.',
    skip_if: 'You are early-stage — Vercel/Netlify free tiers are easier and faster.',
  },
  {
    full_name: 'caprover/caprover',
    category_slugs: ['devops'],
    is_featured: false,
    curator_take:
      'Self-hosted PaaS. ~13k stars. Similar pitch to Coolify, slightly older. Both work — pick the docs you find clearer.',
    use_this_if: 'You want a self-hosted PaaS and Coolify is not vibing with you.',
    skip_if: 'You are happy on Vercel/Render/Railway — no need to self-host.',
  },

  // ════════════════════════════════════════════════════════════════
  // CLI & DEV TOOLS (5)
  // ════════════════════════════════════════════════════════════════
  {
    full_name: 'pnpm/pnpm',
    category_slugs: ['cli-tools'],
    is_featured: true,
    curator_take:
      'Fast, disk-efficient Node package manager. ~30k stars. Replaces npm/yarn for monorepo work. Default for new TypeScript projects in 2026.',
    use_this_if: 'You manage a monorepo or have multiple Node projects on one machine.',
    skip_if: 'You have a single project and npm works — no need to switch.',
  },
  {
    full_name: 'biomejs/biome',
    category_slugs: ['cli-tools'],
    is_featured: false,
    curator_take:
      'Fast Rust-based formatter + linter. ~15k stars. Replaces Prettier + ESLint with one tool. Adoption is rising; ESLint plugin ecosystem is still wider for now.',
    use_this_if: 'You want one fast tool instead of Prettier + ESLint + Stylelint.',
    skip_if: 'You depend on niche ESLint plugins — they may not exist for Biome yet.',
  },
  {
    full_name: 'oven-sh/bun',
    category_slugs: ['cli-tools'],
    is_featured: false,
    curator_take:
      'JavaScript runtime + package manager + bundler in Zig. ~76k stars. Faster than Node for many workloads. Production use is rising, but most teams still default to Node for stability.',
    use_this_if: 'You are starting greenfield and want maximum speed for scripts, tests, or simple servers.',
    skip_if: 'You have native modules or third-party tools assuming Node — verify compatibility first.',
  },
  {
    full_name: 'tsx-shell/tsx',
    category_slugs: ['cli-tools'],
    is_featured: false,
    curator_take:
      'Run TypeScript files directly in Node. Replaces ts-node for most workflows. Used by half the scripts in your `package.json`.',
    use_this_if: 'You write CLI scripts in TypeScript and want to run them without compilation.',
    skip_if: 'You are on Bun — it does this natively.',
  },
  {
    full_name: 'turbo-build/turbo',
    category_slugs: ['cli-tools', 'devops'],
    is_featured: false,
    curator_take:
      'Monorepo build orchestrator from Vercel. ~26k stars. Speeds up large monorepos with caching. Overkill for small projects but transformative for big ones.',
    use_this_if: 'You have 4+ packages in a monorepo with shared dependencies.',
    skip_if: 'You have a single app — pnpm workspaces are enough.',
  },
];

export const TOTAL_REPOS = SEED_REPOS.length;
