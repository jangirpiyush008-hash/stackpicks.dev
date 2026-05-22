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
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}
