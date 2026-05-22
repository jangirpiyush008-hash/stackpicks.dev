/**
 * "Awesome X" pages — highest-volume keyword class.
 * People literally search "awesome react", "awesome python" etc.
 * Each page is a curated list of OSS repos for the topic, grouped by sub-category.
 */

export interface AwesomeRepo {
  full_name: string;
  short_name: string;
  one_liner: string;          // 10-20 words
  stars_approx?: number;
}

export interface AwesomeSection {
  title: string;
  description?: string;
  repos: AwesomeRepo[];
}

export interface AwesomePage {
  slug: string;
  topic: string;              // Display name
  query: string;
  monthly_searches: number;
  intro: string;
  sections: AwesomeSection[];
}

export const AWESOME: AwesomePage[] = [
  {
    slug: 'react',
    topic: 'React',
    query: 'awesome react',
    monthly_searches: 30000,
    intro: 'Curated open-source picks for React developers in 2026. The libraries actually worth using — picked over star counts. UI, state, forms, data, animation, tooling.',
    sections: [
      {
        title: 'UI components',
        repos: [
          { full_name: 'shadcn-ui/ui', short_name: 'shadcn/ui', one_liner: 'Copy-paste primitives built on Radix + Tailwind. Own the code.', stars_approx: 90000 },
          { full_name: 'mantinedev/mantine', short_name: 'Mantine', one_liner: '100+ components, strong hooks, best DX for shipping fast.', stars_approx: 28000 },
          { full_name: 'mui/material-ui', short_name: 'MUI', one_liner: 'Material Design 3 spec, most mature React UI library.', stars_approx: 95000 },
          { full_name: 'radix-ui/primitives', short_name: 'Radix UI', one_liner: 'Unstyled accessible primitives. Bring your own CSS.', stars_approx: 17000 },
          { full_name: 'chakra-ui/chakra-ui', short_name: 'Chakra UI', one_liner: 'Best theming primitives, easy dark mode.', stars_approx: 38000 },
          { full_name: 'nextui-org/nextui', short_name: 'NextUI', one_liner: 'Beautiful Tailwind-based components with Framer Motion baked in.', stars_approx: 21000 },
          { full_name: 'tailwindlabs/headlessui', short_name: 'Headless UI', one_liner: 'Tailwind Labs unstyled components. Smaller scope than Radix.', stars_approx: 27000 },
        ],
      },
      {
        title: 'State management',
        repos: [
          { full_name: 'pmndrs/zustand', short_name: 'Zustand', one_liner: '~1KB store, no boilerplate. Right default for 95% of apps.', stars_approx: 50000 },
          { full_name: 'pmndrs/jotai', short_name: 'Jotai', one_liner: 'Atomic state per piece of data. React-like hooks API.', stars_approx: 19000 },
          { full_name: 'reduxjs/redux-toolkit', short_name: 'Redux Toolkit', one_liner: 'Battle-tested at scale. Use it if you have an existing Redux codebase.', stars_approx: 10000 },
          { full_name: 'mobxjs/mobx', short_name: 'MobX', one_liner: 'Observable mutation-friendly state. Best for deeply nested data.', stars_approx: 27000 },
        ],
      },
      {
        title: 'Data fetching + caching',
        repos: [
          { full_name: 'TanStack/query', short_name: 'TanStack Query', one_liner: 'The definitive data-fetching + caching library for React.', stars_approx: 43000 },
          { full_name: 'TanStack/router', short_name: 'TanStack Router', one_liner: 'Type-safe file-based router with data loaders.', stars_approx: 9000 },
          { full_name: 'TanStack/db', short_name: 'TanStack DB', one_liner: 'Real-time local-first sync DB for React.', stars_approx: 1500 },
        ],
      },
      {
        title: 'Forms + validation',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', short_name: 'React Hook Form', one_liner: 'The dominant form library. Performant, uncontrolled inputs.', stars_approx: 43000 },
          { full_name: 'colinhacks/zod', short_name: 'Zod', one_liner: 'TypeScript-first schema validation. Pair with RHF.', stars_approx: 36000 },
          { full_name: 'TanStack/form', short_name: 'TanStack Form', one_liner: 'Headless type-safe form library by TanStack.', stars_approx: 4500 },
          { full_name: 'jquense/yup', short_name: 'Yup', one_liner: 'Schema validation, broader ecosystem than Zod.', stars_approx: 23000 },
        ],
      },
      {
        title: 'Animation',
        repos: [
          { full_name: 'motiondivision/motion', short_name: 'Motion (Framer Motion)', one_liner: 'React-first declarative animation. The default pick.', stars_approx: 25000 },
          { full_name: 'pmndrs/react-spring', short_name: 'React Spring', one_liner: 'Physics-based animations. Pairs with React Three Fiber.', stars_approx: 28000 },
          { full_name: 'magic-ui-design/magic-ui', short_name: 'Magic UI', one_liner: 'Animated landing-page sections, shadcn-style copy-paste.', stars_approx: 18000 },
        ],
      },
      {
        title: 'Routing',
        repos: [
          { full_name: 'remix-run/react-router', short_name: 'React Router', one_liner: 'The standard React routing library since 2015.', stars_approx: 53000 },
          { full_name: 'molefrog/wouter', short_name: 'Wouter', one_liner: '~3KB minimalist router for React.', stars_approx: 6500 },
        ],
      },
    ],
  },

  {
    slug: 'python',
    topic: 'Python',
    query: 'awesome python',
    monthly_searches: 25000,
    intro: 'Curated Python open-source picks. The libraries Python developers actually ship with in 2026 — web, AI/ML, data, scraping, testing, DevOps.',
    sections: [
      {
        title: 'AI / LLM frameworks',
        repos: [
          { full_name: 'langchain-ai/langchain', short_name: 'LangChain', one_liner: 'The dominant LLM framework — chains, agents, integrations.', stars_approx: 100000 },
          { full_name: 'run-llama/llama_index', short_name: 'LlamaIndex', one_liner: 'RAG-first framework for retrieval-augmented generation.', stars_approx: 38000 },
          { full_name: 'crewAIInc/crewAI', short_name: 'CrewAI', one_liner: 'Role-based multi-agent orchestration. Ships fast.', stars_approx: 24000 },
          { full_name: 'microsoft/autogen', short_name: 'AutoGen', one_liner: 'Microsoft\'s research-grade multi-agent framework.', stars_approx: 36000 },
          { full_name: 'huggingface/transformers', short_name: 'Transformers', one_liner: 'The library that runs every modern open LLM.', stars_approx: 135000 },
        ],
      },
      {
        title: 'Web scraping',
        repos: [
          { full_name: 'scrapy/scrapy', short_name: 'Scrapy', one_liner: 'The classic Python web crawling framework.', stars_approx: 53000 },
          { full_name: 'mendableai/firecrawl', short_name: 'Firecrawl', one_liner: 'LLM-grade content extraction with clean markdown output.', stars_approx: 25000 },
          { full_name: 'unclecode/crawl4ai', short_name: 'Crawl4AI', one_liner: 'AI-friendly web crawler with built-in LLM extraction.', stars_approx: 20000 },
        ],
      },
      {
        title: 'Database / ORM',
        repos: [
          { full_name: 'pgvector/pgvector', short_name: 'pgvector', one_liner: 'Postgres vector extension. Add vector search to existing DB.', stars_approx: 14000 },
          { full_name: 'qdrant/qdrant', short_name: 'Qdrant', one_liner: 'Rust-based vector DB for production AI.', stars_approx: 22000 },
          { full_name: 'chroma-core/chroma', short_name: 'Chroma', one_liner: 'Python-first vector DB, perfect for prototyping.', stars_approx: 16000 },
          { full_name: 'milvus-io/milvus', short_name: 'Milvus', one_liner: 'Distributed vector DB for billions of vectors.', stars_approx: 30000 },
        ],
      },
      {
        title: 'Browser automation',
        repos: [
          { full_name: 'microsoft/playwright', short_name: 'Playwright', one_liner: 'Cross-browser automation with better selectors than Puppeteer.', stars_approx: 67000 },
          { full_name: 'puppeteer/puppeteer', short_name: 'Puppeteer', one_liner: 'Chrome automation. The OG headless browser library.', stars_approx: 88000 },
        ],
      },
      {
        title: 'Local LLM serving',
        repos: [
          { full_name: 'ollama/ollama', short_name: 'Ollama', one_liner: 'Run Llama 3, Qwen, DeepSeek locally with one command.', stars_approx: 110000 },
        ],
      },
    ],
  },

  {
    slug: 'ai',
    topic: 'AI',
    query: 'awesome ai',
    monthly_searches: 8000,
    intro: 'Curated open-source AI tools for builders in 2026. Frameworks, vector DBs, local model serving, UI clients, and the AI engineering toolkit pros actually ship with.',
    sections: [
      {
        title: 'Agent frameworks',
        repos: [
          { full_name: 'langchain-ai/langchain', short_name: 'LangChain', one_liner: 'Most mature LLM framework with broadest ecosystem.', stars_approx: 100000 },
          { full_name: 'run-llama/llama_index', short_name: 'LlamaIndex', one_liner: 'RAG-first framework for document retrieval + generation.', stars_approx: 38000 },
          { full_name: 'crewAIInc/crewAI', short_name: 'CrewAI', one_liner: 'Role-based multi-agent crews, ships fast.', stars_approx: 24000 },
          { full_name: 'microsoft/autogen', short_name: 'AutoGen', one_liner: 'Multi-agent conversation framework by Microsoft Research.', stars_approx: 36000 },
        ],
      },
      {
        title: 'Local LLM serving',
        repos: [
          { full_name: 'ollama/ollama', short_name: 'Ollama', one_liner: 'Easiest way to run Llama 3.3, Qwen, DeepSeek locally.', stars_approx: 110000 },
        ],
      },
      {
        title: 'Vector databases',
        repos: [
          { full_name: 'qdrant/qdrant', short_name: 'Qdrant', one_liner: 'Rust-based production vector DB.', stars_approx: 22000 },
          { full_name: 'chroma-core/chroma', short_name: 'Chroma', one_liner: 'Simple Python-first vector DB.', stars_approx: 16000 },
          { full_name: 'pgvector/pgvector', short_name: 'pgvector', one_liner: 'Postgres extension for vector search.', stars_approx: 14000 },
          { full_name: 'milvus-io/milvus', short_name: 'Milvus', one_liner: 'Distributed billions-of-vectors DB.', stars_approx: 30000 },
          { full_name: 'weaviate/weaviate', short_name: 'Weaviate', one_liner: 'Hybrid search + GraphQL API.', stars_approx: 12000 },
        ],
      },
      {
        title: 'AI chat UIs',
        repos: [
          { full_name: 'open-webui/open-webui', short_name: 'OpenWebUI', one_liner: 'ChatGPT-clone UI for local Ollama.', stars_approx: 65000 },
          { full_name: 'lobehub/lobe-chat', short_name: 'LobeChat', one_liner: 'Premium-looking chat UI with plugins.', stars_approx: 50000 },
        ],
      },
    ],
  },

  {
    slug: 'nextjs',
    topic: 'Next.js',
    query: 'awesome nextjs',
    monthly_searches: 4000,
    intro: 'The curated Next.js stack in 2026. UI, auth, payments, AI, scraping — every tool you need to ship a SaaS on Next.js 15.',
    sections: [
      {
        title: 'Foundation',
        repos: [
          { full_name: 'vercel/next.js', short_name: 'Next.js', one_liner: 'The React framework with App Router, Server Components, edge.', stars_approx: 130000 },
          { full_name: 'shadcn-ui/ui', short_name: 'shadcn/ui', one_liner: 'Copy-paste Tailwind + Radix component primitives.', stars_approx: 90000 },
          { full_name: 'tailwindlabs/tailwindcss', short_name: 'Tailwind CSS', one_liner: 'The CSS framework powering most modern Next.js apps.', stars_approx: 85000 },
        ],
      },
      {
        title: 'Backend / Database',
        repos: [
          { full_name: 'supabase/supabase', short_name: 'Supabase', one_liner: 'Postgres + Auth + Storage. The right backend default.', stars_approx: 80000 },
          { full_name: 'drizzle-team/drizzle-orm', short_name: 'Drizzle', one_liner: 'TypeScript-first SQL ORM, edge-compatible.', stars_approx: 27000 },
          { full_name: 'prisma/prisma', short_name: 'Prisma', one_liner: 'ORM with great DX and generated client.', stars_approx: 42000 },
        ],
      },
      {
        title: 'Auth',
        repos: [
          { full_name: 'better-auth/better-auth', short_name: 'Better Auth', one_liner: 'Modern typesafe auth, framework-agnostic.', stars_approx: 18000 },
          { full_name: 'nextauthjs/next-auth', short_name: 'NextAuth', one_liner: 'The Next.js-specific auth incumbent.', stars_approx: 26000 },
        ],
      },
      {
        title: 'Forms + validation',
        repos: [
          { full_name: 'react-hook-form/react-hook-form', short_name: 'React Hook Form', one_liner: 'The dominant React form library.', stars_approx: 43000 },
          { full_name: 'colinhacks/zod', short_name: 'Zod', one_liner: 'TypeScript-first schema validation.', stars_approx: 36000 },
        ],
      },
      {
        title: 'Email',
        repos: [
          { full_name: 'resend/react-email', short_name: 'react-email', one_liner: 'Build email templates with JSX components.', stars_approx: 16000 },
        ],
      },
    ],
  },

  {
    slug: 'self-hosted',
    topic: 'Self-hosted',
    query: 'awesome self-hosted',
    monthly_searches: 8000,
    intro: 'The curated self-hosted stack — replace every SaaS in your life with software you fully own. Privacy-first picks for 2026.',
    sections: [
      {
        title: 'Productivity & docs',
        repos: [
          { full_name: 'AppFlowy-IO/AppFlowy', short_name: 'AppFlowy', one_liner: 'Notion replacement, Rust + Flutter, self-hostable.', stars_approx: 60000 },
          { full_name: 'logseq/logseq', short_name: 'Logseq', one_liner: 'Roam-style PKM with markdown files.', stars_approx: 35000 },
          { full_name: 'outline/outline', short_name: 'Outline', one_liner: 'Team wiki + docs, clean markdown editor.', stars_approx: 30000 },
        ],
      },
      {
        title: 'Storage & sync',
        repos: [
          { full_name: 'nextcloud/server', short_name: 'Nextcloud', one_liner: 'Dropbox + Google Workspace self-hosted suite.', stars_approx: 28000 },
          { full_name: 'syncthing/syncthing', short_name: 'Syncthing', one_liner: 'P2P file sync, no central server.', stars_approx: 65000 },
        ],
      },
      {
        title: 'Communication',
        repos: [
          { full_name: 'mattermost/mattermost', short_name: 'Mattermost', one_liner: 'Slack replacement, used by DoD + regulated orgs.', stars_approx: 30000 },
          { full_name: 'RocketChat/Rocket.Chat', short_name: 'Rocket.Chat', one_liner: 'Team chat + customer support in one tool.', stars_approx: 41000 },
        ],
      },
      {
        title: 'Code & dev',
        repos: [
          { full_name: 'go-gitea/gitea', short_name: 'Gitea', one_liner: 'Lightweight self-hosted GitHub clone.', stars_approx: 47000 },
        ],
      },
      {
        title: 'Marketing & analytics',
        repos: [
          { full_name: 'plausible/analytics', short_name: 'Plausible', one_liner: 'Privacy-first analytics, GDPR-safe.', stars_approx: 21500 },
          { full_name: 'umami-software/umami', short_name: 'Umami', one_liner: 'Fully OSS Plausible alternative.', stars_approx: 26000 },
          { full_name: 'PostHog/posthog', short_name: 'PostHog', one_liner: 'Full product analytics + session replay.', stars_approx: 23000 },
          { full_name: 'knadh/listmonk', short_name: 'Listmonk', one_liner: 'Self-hosted email marketing, Mailchimp alternative.', stars_approx: 17000 },
        ],
      },
    ],
  },

  {
    slug: 'devops',
    topic: 'DevOps',
    query: 'awesome devops',
    monthly_searches: 3500,
    intro: 'The curated DevOps & infrastructure stack — Docker, Kubernetes, CI/CD, monitoring, deployment. The tools production engineers actually use in 2026.',
    sections: [
      {
        title: 'Self-hosted PaaS',
        repos: [
          { full_name: 'coollabsio/coolify', short_name: 'Coolify', one_liner: 'Self-hosted Heroku/Vercel alternative with beautiful UI.', stars_approx: 40000 },
          { full_name: 'caprover/caprover', short_name: 'CapRover', one_liner: 'App-deployment platform with template marketplace.', stars_approx: 13000 },
        ],
      },
      {
        title: 'Containers',
        repos: [
          { full_name: 'docker/compose', short_name: 'Docker Compose', one_liner: 'Define multi-container apps with YAML.', stars_approx: 35000 },
        ],
      },
      {
        title: 'Monorepo tooling',
        repos: [
          { full_name: 'turbo-build/turbo', short_name: 'Turborepo', one_liner: 'High-performance build system for monorepos.', stars_approx: 28000 },
          { full_name: 'pnpm/pnpm', short_name: 'pnpm', one_liner: 'Fast disk-efficient package manager.', stars_approx: 32000 },
        ],
      },
    ],
  },

  {
    slug: 'web-development',
    topic: 'Web Development',
    query: 'awesome web development',
    monthly_searches: 5000,
    intro: 'The full-stack web dev toolkit in 2026. Frameworks, UI, auth, payments, deployment — every tool you need to ship a modern web product.',
    sections: [
      {
        title: 'Frameworks',
        repos: [
          { full_name: 'vercel/next.js', short_name: 'Next.js', one_liner: 'The React framework for production.', stars_approx: 130000 },
          { full_name: 'withastro/astro', short_name: 'Astro', one_liner: 'Content-first framework with zero-JS by default.', stars_approx: 50000 },
          { full_name: 'nuxt/nuxt', short_name: 'Nuxt', one_liner: 'The Vue meta-framework, Next.js equivalent.', stars_approx: 56000 },
          { full_name: 'sveltejs/kit', short_name: 'SvelteKit', one_liner: 'Svelte-based meta-framework with smaller JS.', stars_approx: 19000 },
        ],
      },
      {
        title: 'Build tools',
        repos: [
          { full_name: 'vitejs/vite', short_name: 'Vite', one_liner: 'The dev server + build tool that replaced Webpack.', stars_approx: 73000 },
          { full_name: 'oven-sh/bun', short_name: 'Bun', one_liner: 'JS runtime + bundler + package manager in one.', stars_approx: 75000 },
        ],
      },
      {
        title: 'Testing',
        repos: [
          { full_name: 'vitest-dev/vitest', short_name: 'Vitest', one_liner: 'Vite-native test runner, Jest-compatible API.', stars_approx: 14000 },
          { full_name: 'microsoft/playwright', short_name: 'Playwright', one_liner: 'Cross-browser E2E testing.', stars_approx: 67000 },
        ],
      },
    ],
  },

  {
    slug: 'typescript',
    topic: 'TypeScript',
    query: 'awesome typescript',
    monthly_searches: 8000,
    intro: 'The curated TypeScript ecosystem in 2026 — validation, ORM, frameworks, build tools. The libraries that make TS development pleasant.',
    sections: [
      {
        title: 'Validation',
        repos: [
          { full_name: 'colinhacks/zod', short_name: 'Zod', one_liner: 'TS-first schema validation. Type inference baked in.', stars_approx: 36000 },
        ],
      },
      {
        title: 'ORM / Database',
        repos: [
          { full_name: 'drizzle-team/drizzle-orm', short_name: 'Drizzle', one_liner: 'SQL-first TS ORM, zero runtime, edge-compatible.', stars_approx: 27000 },
          { full_name: 'prisma/prisma', short_name: 'Prisma', one_liner: 'TS ORM with great DX and generated client.', stars_approx: 42000 },
          { full_name: 'kysely-org/kysely', short_name: 'Kysely', one_liner: 'Pure TS SQL query builder.', stars_approx: 12000 },
          { full_name: 'typeorm/typeorm', short_name: 'TypeORM', one_liner: 'Decorator-based ORM with broad DB support.', stars_approx: 35000 },
        ],
      },
      {
        title: 'Tooling',
        repos: [
          { full_name: 'tsx-shell/tsx', short_name: 'tsx', one_liner: 'Run TypeScript directly without compilation.', stars_approx: 12000 },
          { full_name: 'biomejs/biome', short_name: 'Biome', one_liner: 'Fast formatter + linter, ESLint + Prettier alternative.', stars_approx: 19000 },
        ],
      },
    ],
  },

  {
    slug: 'javascript',
    topic: 'JavaScript',
    query: 'awesome javascript',
    monthly_searches: 18000,
    intro: 'Curated open-source JavaScript libraries in 2026. The modern JS ecosystem — frameworks, tooling, animation, testing — picked by builders for builders.',
    sections: [
      {
        title: 'Runtime + Tooling',
        repos: [
          { full_name: 'oven-sh/bun', short_name: 'Bun', one_liner: 'Fast JS runtime + bundler + package manager.', stars_approx: 75000 },
          { full_name: 'vitejs/vite', short_name: 'Vite', one_liner: 'The dev server + build tool that won.', stars_approx: 73000 },
          { full_name: 'biomejs/biome', short_name: 'Biome', one_liner: 'Fast formatter + linter in Rust.', stars_approx: 19000 },
        ],
      },
      {
        title: 'Frameworks',
        repos: [
          { full_name: 'vercel/next.js', short_name: 'Next.js', one_liner: 'React framework with App Router.', stars_approx: 130000 },
          { full_name: 'withastro/astro', short_name: 'Astro', one_liner: 'Content-first framework with zero JS by default.', stars_approx: 50000 },
          { full_name: 'solidjs/solid', short_name: 'Solid', one_liner: 'Fine-grained reactive JS framework.', stars_approx: 33000 },
        ],
      },
      {
        title: 'Testing',
        repos: [
          { full_name: 'vitest-dev/vitest', short_name: 'Vitest', one_liner: 'Vite-native test runner, Jest-compatible.', stars_approx: 14000 },
          { full_name: 'microsoft/playwright', short_name: 'Playwright', one_liner: 'Cross-browser E2E testing.', stars_approx: 67000 },
        ],
      },
    ],
  },

  {
    slug: 'nodejs',
    topic: 'Node.js',
    query: 'awesome nodejs',
    monthly_searches: 4500,
    intro: 'The curated Node.js ecosystem for backend developers in 2026. ORMs, validation, automation, scraping — production-tested picks.',
    sections: [
      {
        title: 'Database / ORM',
        repos: [
          { full_name: 'prisma/prisma', short_name: 'Prisma', one_liner: 'Mature ORM with auto-generated client.', stars_approx: 42000 },
          { full_name: 'drizzle-team/drizzle-orm', short_name: 'Drizzle', one_liner: 'Zero-runtime ORM, edge-compatible.', stars_approx: 27000 },
          { full_name: 'typeorm/typeorm', short_name: 'TypeORM', one_liner: 'Decorator-based ORM.', stars_approx: 35000 },
        ],
      },
      {
        title: 'Validation',
        repos: [
          { full_name: 'colinhacks/zod', short_name: 'Zod', one_liner: 'TS-first schema validation.', stars_approx: 36000 },
        ],
      },
      {
        title: 'Web scraping',
        repos: [
          { full_name: 'microsoft/playwright', short_name: 'Playwright', one_liner: 'Cross-browser automation.', stars_approx: 67000 },
          { full_name: 'puppeteer/puppeteer', short_name: 'Puppeteer', one_liner: 'Chrome automation.', stars_approx: 88000 },
          { full_name: 'cheeriojs/cheerio', short_name: 'Cheerio', one_liner: 'Server-side jQuery-like HTML parser.', stars_approx: 28000 },
          { full_name: 'apify/crawlee', short_name: 'Crawlee', one_liner: 'Production-grade scraping framework.', stars_approx: 16000 },
        ],
      },
      {
        title: 'AI integration',
        repos: [
          { full_name: 'langchain-ai/langchain', short_name: 'LangChain JS', one_liner: 'JS port of LangChain for Node.', stars_approx: 100000 },
        ],
      },
    ],
  },
];

export function getAwesomePageBySlug(slug: string): AwesomePage | undefined {
  return AWESOME.find((a) => a.slug === slug);
}

export function getAllAwesomeSlugs(): string[] {
  return AWESOME.map((a) => a.slug);
}
