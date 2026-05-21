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
      { label: 'Chrome extension', query: 'cli' },
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
      { label: 'Postgres', query: 'postgres' },
    ],
  },
];

/**
 * Token expansion — when a user types one common word, also search related categories/topics.
 * Lets "mobile app" match the 'mobile' category, "payment" match 'payments', etc.
 */
export const KEYWORD_EXPANSIONS: Record<string, string[]> = {
  mobile: ['mobile', 'react-native', 'expo', 'flutter', 'ios', 'android'],
  app: ['mobile', 'frameworks'],
  saas: ['auth', 'payments', 'database', 'email'],
  ai: ['ai-ml', 'llm', 'rag', 'vector', 'agent', 'openai', 'claude'],
  rag: ['ai-ml', 'vector', 'embeddings'],
  agent: ['ai-ml'],
  auth: ['auth', 'oauth', 'login', 'session'],
  login: ['auth'],
  payments: ['payments', 'razorpay', 'stripe', 'billing'],
  payment: ['payments', 'razorpay'],
  razorpay: ['payments'],
  billing: ['payments'],
  india: ['razorpay'],
  database: ['database', 'orm', 'sql', 'postgres', 'sqlite'],
  postgres: ['database'],
  orm: ['database'],
  forms: ['forms', 'validation', 'zod'],
  validation: ['forms', 'zod'],
  email: ['email', 'transactional', 'newsletter', 'resend'],
  search: ['search', 'fts', 'meilisearch', 'algolia'],
  analytics: ['analytics', 'tracking', 'plausible', 'posthog'],
  state: ['state', 'store', 'signals', 'zustand'],
  routing: ['routing', 'router'],
  testing: ['testing', 'vitest', 'playwright'],
  devops: ['devops', 'deploy', 'docker', 'ci'],
  components: ['ui-components', 'shadcn', 'radix', 'headless'],
  ui: ['ui-components', 'design-systems'],
  design: ['design-systems'],
  charts: ['charts-viz', 'd3', 'chart'],
  viz: ['charts-viz'],
  animation: ['animation', 'motion', 'framer'],
  icons: ['icons', 'lucide'],
  cms: ['cms-content', 'markdown', 'mdx'],
  markdown: ['cms-content', 'rich-text'],
  editor: ['rich-text', 'tiptap', 'codemirror'],
  cli: ['cli-tools'],
  framework: ['frameworks', 'next', 'remix', 'astro', 'svelte'],
  admin: ['analytics', 'cms-content'],
};

export function expandQuery(raw: string): string[] {
  const tokens = raw
    .toLowerCase()
    .split(/[\s,/+]+/)
    .filter(Boolean);
  const out = new Set<string>(tokens);
  for (const t of tokens) {
    const exp = KEYWORD_EXPANSIONS[t];
    if (exp) for (const e of exp) out.add(e);
  }
  return Array.from(out);
}
