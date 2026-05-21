export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sort: number;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: 'ui-components', name: 'UI Components', description: 'React, Vue, Svelte component libraries and headless primitives', icon: 'layout-grid', sort: 10 },
  { slug: 'design-systems', name: 'Design Systems', description: 'Complete design systems with tokens, components, and docs', icon: 'palette', sort: 20 },
  { slug: 'animation', name: 'Animation & Motion', description: 'Animation libraries, motion primitives, scroll effects', icon: 'sparkles', sort: 30 },
  { slug: 'icons', name: 'Icons & Illustrations', description: 'Icon sets, illustration libraries, SVG tools', icon: 'star', sort: 40 },
  { slug: 'auth', name: 'Authentication', description: 'Auth providers, OAuth, magic links, RBAC', icon: 'lock', sort: 50 },
  { slug: 'database', name: 'Database & ORM', description: 'Databases, ORMs, query builders, migrations', icon: 'database', sort: 60 },
  { slug: 'payments', name: 'Payments & Billing', description: 'Payment processors, billing, subscriptions', icon: 'credit-card', sort: 70 },
  { slug: 'ai-ml', name: 'AI & ML', description: 'LLM clients, vector DBs, AI agent frameworks', icon: 'brain', sort: 80 },
  { slug: 'mobile', name: 'Mobile', description: 'React Native, Expo, Flutter ecosystem', icon: 'smartphone', sort: 90 },
  { slug: 'forms', name: 'Forms & Validation', description: 'Form libraries, validators, Zod ecosystem', icon: 'clipboard-check', sort: 100 },
  { slug: 'state', name: 'State Management', description: 'Stores, signals, query/cache libraries', icon: 'database-zap', sort: 110 },
  { slug: 'routing', name: 'Routing', description: 'Routers for SPA, file-based routing', icon: 'route', sort: 120 },
  { slug: 'testing', name: 'Testing', description: 'Test runners, mocking, E2E frameworks', icon: 'flask-conical', sort: 130 },
  { slug: 'devops', name: 'DevOps & Deploy', description: 'Deployment, CI/CD, infrastructure as code', icon: 'cloud', sort: 140 },
  { slug: 'analytics', name: 'Analytics', description: 'Product analytics, event tracking, dashboards', icon: 'bar-chart-3', sort: 150 },
  { slug: 'email', name: 'Email', description: 'Email sending, templates, transactional', icon: 'mail', sort: 160 },
  { slug: 'cms-content', name: 'CMS & Content', description: 'Headless CMS, markdown, MDX, content systems', icon: 'file-text', sort: 170 },
  { slug: 'search', name: 'Search', description: 'Full-text search, vector search, indexing', icon: 'search', sort: 180 },
  { slug: 'charts-viz', name: 'Charts & Viz', description: 'Charting libraries, data viz, D3 ecosystem', icon: 'line-chart', sort: 190 },
  { slug: 'rich-text', name: 'Rich Text & Editors', description: 'WYSIWYG, markdown editors, code editors', icon: 'pen-line', sort: 200 },
  { slug: 'frameworks', name: 'Frameworks', description: 'Web frameworks, meta-frameworks', icon: 'boxes', sort: 210 },
  { slug: 'cli-tools', name: 'CLI & Dev Tools', description: 'CLI builders, scaffolders, dev utilities', icon: 'terminal', sort: 220 },
];

export const CATEGORY_BY_SLUG: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);
