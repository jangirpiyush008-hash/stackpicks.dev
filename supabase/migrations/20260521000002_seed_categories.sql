-- Seed: starter categories for StackPicks
-- Run once after init migration. Idempotent via ON CONFLICT.

insert into public.categories (slug, name, description, icon, sort_order) values
  ('ui-components', 'UI Components', 'React, Vue, Svelte component libraries and headless primitives', 'layout-grid', 10),
  ('design-systems', 'Design Systems', 'Complete design systems with tokens, components, and docs', 'palette', 20),
  ('animation', 'Animation & Motion', 'Animation libraries, motion primitives, scroll effects', 'sparkles', 30),
  ('icons', 'Icons & Illustrations', 'Icon sets, illustration libraries, SVG tools', 'star', 40),
  ('auth', 'Authentication', 'Auth providers, OAuth, magic links, RBAC', 'lock', 50),
  ('database', 'Database & ORM', 'Databases, ORMs, query builders, migrations', 'database', 60),
  ('payments', 'Payments & Billing', 'Payment processors, billing, subscriptions', 'credit-card', 70),
  ('ai-ml', 'AI & ML', 'LLM clients, vector DBs, AI agent frameworks', 'brain', 80),
  ('mobile', 'Mobile', 'React Native, Expo, Flutter ecosystem', 'smartphone', 90),
  ('forms', 'Forms & Validation', 'Form libraries, validators, Zod ecosystem', 'clipboard-check', 100),
  ('state', 'State Management', 'Stores, signals, query/cache libraries', 'database-zap', 110),
  ('routing', 'Routing', 'Routers for SPA, file-based routing', 'route', 120),
  ('testing', 'Testing', 'Test runners, mocking, E2E frameworks', 'flask-conical', 130),
  ('devops', 'DevOps & Deploy', 'Deployment, CI/CD, infrastructure as code', 'cloud', 140),
  ('analytics', 'Analytics', 'Product analytics, event tracking, dashboards', 'bar-chart-3', 150),
  ('email', 'Email', 'Email sending, templates, transactional', 'mail', 160),
  ('cms-content', 'CMS & Content', 'Headless CMS, markdown, MDX, content systems', 'file-text', 170),
  ('search', 'Search', 'Full-text search, vector search, indexing', 'search', 180),
  ('charts-viz', 'Charts & Viz', 'Charting libraries, data viz, D3 ecosystem', 'line-chart', 190),
  ('rich-text', 'Rich Text & Editors', 'WYSIWYG, markdown editors, code editors', 'pen-line', 200),
  ('frameworks', 'Frameworks', 'Web frameworks, meta-frameworks', 'boxes', 210),
  ('cli-tools', 'CLI & Dev Tools', 'CLI builders, scaffolders, dev utilities', 'terminal', 220)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order;
