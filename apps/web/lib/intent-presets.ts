/**
 * Intent-style preset chips shown under the search bar.
 * Each preset routes to /preview?q=<query> which the gallery filter understands.
 * Keep keys short and natural — the way builders actually describe what they need.
 */

export interface IntentPreset {
  label: string;
  query: string;
  emoji?: string;
}

export const INTENT_GROUPS: { title: string; items: IntentPreset[] }[] = [
  {
    title: "I'm building",
    items: [
      { label: 'SaaS', query: 'saas' },
      { label: 'Mobile app', query: 'mobile' },
      { label: 'AI agent / RAG', query: 'ai' },
      { label: 'Internal dashboard', query: 'admin' },
      { label: 'Marketing site', query: 'framework' },
      { label: 'Chrome extension', query: 'chrome extension' },
      { label: 'Scraper', query: 'scraper' },
      { label: 'E-commerce', query: 'ecommerce' },
    ],
  },
  {
    title: 'I need',
    items: [
      { label: 'Auth & login', query: 'auth' },
      { label: 'Payments (India)', query: 'razorpay' },
      { label: 'Database / ORM', query: 'database' },
      { label: 'Forms', query: 'forms' },
      { label: 'Search', query: 'search' },
      { label: 'Email sending', query: 'email' },
      { label: 'State management', query: 'state' },
      { label: 'UI components', query: 'components' },
      { label: 'Animation', query: 'animation' },
      { label: 'Charts', query: 'charts' },
      { label: 'Testing', query: 'testing' },
      { label: 'Analytics', query: 'analytics' },
      { label: 'CMS', query: 'cms' },
      { label: 'Rich text editor', query: 'editor' },
    ],
  },
  {
    title: 'My skill / stack',
    items: [
      { label: 'Next.js', query: 'next.js' },
      { label: 'React Native', query: 'react native' },
      { label: 'TypeScript', query: 'typescript' },
      { label: 'Tailwind', query: 'tailwind' },
      { label: 'Supabase', query: 'supabase' },
      { label: 'Python', query: 'python' },
      { label: 'Go', query: 'go' },
      { label: 'Postgres', query: 'postgres' },
    ],
  },
];

/**
 * Token expansion — when a user types one common word, also search related categories/topics.
 * Lets "mobile app" match the 'mobile' category, "payment" match 'payments', etc.
 */
export const KEYWORD_EXPANSIONS: Record<string, string[]> = {
  // App types
  mobile: ['mobile', 'react-native', 'expo', 'flutter', 'ios', 'android', 'nativewind', 'tamagui'],
  app: ['mobile', 'frameworks', 'next.js', 'expo'],
  ios: ['mobile', 'expo', 'react-native'],
  android: ['mobile', 'expo', 'react-native'],
  flutter: ['mobile'],
  saas: ['auth', 'payments', 'database', 'email', 'next.js'],
  startup: ['saas', 'auth', 'payments', 'next.js'],
  product: ['saas', 'analytics'],
  ecommerce: ['payments', 'razorpay', 'medusa', 'commerce', 'cart', 'checkout'],
  'e-commerce': ['payments', 'medusa', 'commerce'],
  shop: ['ecommerce', 'medusa', 'payments'],
  store: ['ecommerce', 'medusa', 'state', 'zustand'],
  cart: ['ecommerce', 'medusa'],
  checkout: ['payments', 'razorpay', 'stripe'],
  marketplace: ['ecommerce', 'payments', 'auth'],
  dashboard: ['mui', 'shadcn', 'charts', 'tanstack', 'database', 'analytics'],
  admin: ['mui', 'analytics', 'cms-content', 'directus', 'payload'],
  internal: ['admin', 'dashboard'],
  ops: ['admin', 'dashboard', 'analytics'],
  b2b: ['admin', 'dashboard', 'crm'],
  crm: ['supabase', 'forms', 'database', 'resend'],
  // AI / agents
  ai: ['ai-ml', 'llm', 'rag', 'vector', 'agent', 'openai', 'claude', 'ollama'],
  llm: ['ai-ml', 'ollama', 'openai'],
  rag: ['ai-ml', 'vector', 'embeddings', 'pgvector', 'chroma', 'weaviate'],
  embedding: ['ai-ml', 'pgvector', 'chroma', 'weaviate'],
  embeddings: ['ai-ml', 'pgvector', 'chroma', 'weaviate'],
  agent: ['ai-ml', 'llm'],
  chatbot: ['ai-ml', 'tiptap', 'shadcn'],
  vector: ['pgvector', 'chroma', 'weaviate', 'milvus'],
  openai: ['ai-ml'],
  claude: ['ai-ml'],
  anthropic: ['ai-ml'],
  ollama: ['ai-ml'],
  gemini: ['ai-ml'],
  // Auth
  auth: ['auth', 'oauth', 'login', 'session', 'better-auth', 'lucia', 'supabase'],
  login: ['auth'],
  signup: ['auth'],
  oauth: ['auth'],
  signin: ['auth'],
  authentication: ['auth'],
  password: ['auth'],
  magic: ['auth'],
  // Payments
  payments: ['payments', 'razorpay', 'stripe', 'billing', 'subscription'],
  payment: ['payments', 'razorpay'],
  razorpay: ['payments'],
  stripe: ['payments'],
  billing: ['payments', 'razorpay', 'stripe'],
  subscription: ['payments', 'razorpay', 'stripe'],
  invoice: ['payments', 'razorpay'],
  india: ['razorpay'],
  upi: ['razorpay'],
  inr: ['razorpay'],
  // DB
  database: ['database', 'orm', 'sql', 'postgres', 'sqlite', 'mysql', 'supabase'],
  db: ['database'],
  postgres: ['database', 'supabase', 'drizzle', 'prisma'],
  postgresql: ['database', 'supabase'],
  sql: ['database', 'drizzle', 'prisma'],
  orm: ['database', 'drizzle', 'prisma', 'kysely'],
  supabase: ['database', 'auth'],
  drizzle: ['database', 'orm'],
  prisma: ['database', 'orm'],
  sqlite: ['database', 'pocketbase'],
  mysql: ['database'],
  // Forms
  forms: ['forms', 'validation', 'zod', 'react-hook-form'],
  form: ['forms'],
  validation: ['forms', 'zod'],
  zod: ['forms', 'validation'],
  // Email
  email: ['email', 'transactional', 'newsletter', 'resend', 'react-email'],
  newsletter: ['email', 'resend'],
  mail: ['email'],
  smtp: ['email', 'resend'],
  transactional: ['email', 'resend'],
  // Search
  search: ['search', 'fts', 'meilisearch', 'algolia', 'typesense', 'orama'],
  fulltext: ['search', 'meilisearch', 'typesense'],
  algolia: ['search'],
  meilisearch: ['search'],
  // Analytics
  analytics: ['analytics', 'tracking', 'plausible', 'posthog', 'umami'],
  tracking: ['analytics'],
  events: ['analytics', 'posthog'],
  experiments: ['analytics', 'posthog'],
  'a/b': ['analytics', 'posthog'],
  funnel: ['analytics', 'posthog'],
  plausible: ['analytics'],
  posthog: ['analytics'],
  // State
  state: ['state', 'signals', 'zustand', 'jotai', 'redux'],
  zustand: ['state'],
  redux: ['state'],
  signals: ['state', 'solid'],
  // Routing
  routing: ['routing', 'router'],
  router: ['routing'],
  // Testing
  testing: ['testing', 'vitest', 'playwright', 'storybook'],
  test: ['testing'],
  e2e: ['testing', 'playwright'],
  unit: ['testing', 'vitest'],
  jest: ['testing'],
  vitest: ['testing'],
  // DevOps
  devops: ['devops', 'deploy', 'docker', 'ci', 'coolify'],
  deploy: ['devops'],
  hosting: ['devops', 'vercel'],
  docker: ['devops'],
  kubernetes: ['devops'],
  // Components / UI
  components: ['ui-components', 'shadcn', 'radix', 'headless', 'mui'],
  component: ['ui-components'],
  ui: ['ui-components', 'design-systems'],
  shadcn: ['ui-components'],
  radix: ['ui-components'],
  headless: ['ui-components', 'radix'],
  mui: ['ui-components'],
  material: ['ui-components', 'mui'],
  design: ['design-systems'],
  // Charts
  charts: ['charts-viz', 'd3', 'chart', 'recharts', 'echarts'],
  chart: ['charts-viz'],
  visualization: ['charts-viz', 'd3'],
  viz: ['charts-viz'],
  graph: ['charts-viz', 'd3'],
  // Animation
  animation: ['animation', 'motion', 'framer'],
  animate: ['animation'],
  motion: ['animation'],
  // Icons
  icons: ['icons', 'lucide'],
  icon: ['icons'],
  // CMS / content
  cms: ['cms-content', 'markdown', 'mdx', 'payloadcms', 'directus', 'strapi'],
  content: ['cms-content'],
  blog: ['cms-content', 'next.js', 'astro'],
  markdown: ['cms-content', 'rich-text'],
  mdx: ['cms-content', 'rich-text'],
  payload: ['cms-content'],
  directus: ['cms-content'],
  strapi: ['cms-content'],
  // Editor
  editor: ['rich-text', 'tiptap', 'codemirror', 'lexical'],
  wysiwyg: ['rich-text', 'tiptap'],
  tiptap: ['rich-text'],
  notion: ['rich-text', 'tiptap', 'blocknote'],
  // CLI / dev tools
  cli: ['cli-tools', 'bun', 'tsx'],
  bun: ['cli-tools'],
  pnpm: ['cli-tools'],
  monorepo: ['cli-tools', 'turbo', 'pnpm'],
  // Framework
  framework: ['frameworks', 'next', 'remix', 'astro', 'svelte', 'nuxt', 'solid'],
  frameworks: ['frameworks'],
  'next.js': ['frameworks'],
  next: ['frameworks'],
  nextjs: ['frameworks'],
  astro: ['frameworks'],
  remix: ['frameworks'],
  svelte: ['frameworks'],
  nuxt: ['frameworks'],
  // Scraping
  scraping: ['scraping', 'scraper', 'crawler', 'crawling', 'playwright', 'puppeteer'],
  scraper: ['scraping'],
  scrape: ['scraping'],
  crawl: ['scraping'],
  crawler: ['scraping'],
  crawling: ['scraping'],
  playwright: ['scraping', 'testing'],
  puppeteer: ['scraping'],
  cheerio: ['scraping'],
  scrapy: ['scraping'],
  crawlee: ['scraping'],
  firecrawl: ['scraping', 'ai-ml'],
  'browser automation': ['scraping', 'playwright', 'puppeteer'],
  // Chrome extension
  chrome: ['vitejs', 'shadcn', 'zustand'],
  extension: ['vitejs', 'shadcn', 'zustand'],
  // Misc
  realtime: ['supabase', 'state'],
  websocket: ['supabase'],
  storage: ['supabase'],
  upload: ['supabase'],
  file: ['supabase'],
  pdf: ['cms-content'],
  i18n: ['frameworks'],
  localization: ['frameworks'],
};

export function expandQuery(raw: string): string[] {
  // Split + lowercase. Also include the raw multi-word phrase so "browser automation" can match.
  const normalized = raw.toLowerCase();
  const tokens = normalized.split(/[\s,/+]+/).filter(Boolean);
  const out = new Set<string>([normalized, ...tokens]);
  for (const t of tokens) {
    const exp = KEYWORD_EXPANSIONS[t];
    if (exp) for (const e of exp) out.add(e);
  }
  // Also try the whole phrase as a key (e.g. "react native")
  const phrase = tokens.join(' ');
  const phraseExp = KEYWORD_EXPANSIONS[phrase];
  if (phraseExp) for (const e of phraseExp) out.add(e);
  return Array.from(out);
}
