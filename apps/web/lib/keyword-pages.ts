/**
 * Consolidated data for 3 keyword-targeted page types:
 *   - /self-hosted/[type]   — "self-hosted X" queries
 *   - /migrate/[from-to]    — "migrate from X to Y" queries
 *   - /for/[audience]       — "open source for X" queries
 *
 * Each page is a short, focused, search-optimized landing page.
 */

// ─── SELF-HOSTED ────────────────────────────────────────────────────────
export interface SelfHostedPick {
  full_name: string;
  short_name: string;
  one_liner: string;
  highlight: string;
  license?: string;
}

export interface SelfHostedPage {
  slug: string;
  display: string;          // "Email", "Cloud storage"
  query: string;
  monthly_searches: number;
  intro: string;
  picks: SelfHostedPick[];
}

export const SELF_HOSTED: SelfHostedPage[] = [
  {
    slug: 'email',
    display: 'Email',
    query: 'self-hosted email',
    monthly_searches: 6600,
    intro: 'Self-hosting email gives you full control of inbox data, no scanning by Gmail/Outlook, and unlimited aliases. Setup is harder than other self-hosted apps — DNS, deliverability, anti-spam all matter. Below are the picks that make it bearable in 2026.',
    picks: [
      { full_name: 'mail-in-a-box/mailinabox', short_name: 'Mail-in-a-Box', one_liner: 'One-click self-host email server. Webmail, calendars, contacts. Ubuntu only.', highlight: 'Easiest to deploy', license: 'CC0' },
      { full_name: 'modoboa/modoboa', short_name: 'Modoboa', one_liner: 'Postfix + Dovecot with a beautiful admin UI. Multi-domain support.', highlight: 'Best admin UX', license: 'ISC' },
      { full_name: 'mailcow/mailcow-dockerized', short_name: 'Mailcow', one_liner: 'Docker-based mail server with SOGo webmail, anti-spam, push.', highlight: 'Most feature-complete', license: 'GPL-3.0' },
      { full_name: 'iredmail/iRedMail', short_name: 'iRedMail', one_liner: 'Battle-tested traditional Postfix/Dovecot stack with all tools pre-configured.', highlight: 'Most stable / mature', license: 'GPL-3.0' },
    ],
  },
  {
    slug: 'cloud-storage',
    display: 'Cloud storage',
    query: 'self-hosted cloud storage',
    monthly_searches: 4500,
    intro: 'Self-hosted cloud storage replaces Dropbox, Google Drive, OneDrive. Run on your own hardware, sync across devices, share with team — your data stays on your servers.',
    picks: [
      { full_name: 'nextcloud/server', short_name: 'Nextcloud', one_liner: 'Comprehensive suite: files, office docs, calendars, contacts, video chat.', highlight: 'Most complete suite', license: 'AGPL-3.0' },
      { full_name: 'seafile/seafile', short_name: 'Seafile', one_liner: 'Fast, lean file sync. Lighter than Nextcloud, just files + versioning.', highlight: 'Fastest sync', license: 'GPL-2.0' },
      { full_name: 'syncthing/syncthing', short_name: 'Syncthing', one_liner: 'P2P file sync, no central server. Devices sync directly.', highlight: 'No central server', license: 'MPL-2.0' },
      { full_name: 'minio/minio', short_name: 'MinIO', one_liner: 'S3-compatible object storage. Best for app backends, not personal sync.', highlight: 'S3 API for apps', license: 'AGPL-3.0' },
    ],
  },
  {
    slug: 'git',
    display: 'Git hosting',
    query: 'self-hosted git',
    monthly_searches: 2900,
    intro: 'Run your own git server with issues, PRs, releases, and CI. Open-source alternatives to GitHub for code sovereignty.',
    picks: [
      { full_name: 'go-gitea/gitea', short_name: 'Gitea', one_liner: 'Lightweight Go binary. Issues, PRs, wiki, actions, packages. Sips RAM.', highlight: 'Lightest weight', license: 'MIT' },
      { full_name: 'forgejo/forgejo', short_name: 'Forgejo', one_liner: 'Community-led Gitea fork. 99% feature-compatible.', highlight: 'Community-led', license: 'MIT' },
      { full_name: 'gitlab-org/gitlab', short_name: 'GitLab CE', one_liner: 'Full DevOps platform: git + CI/CD + registry + monitoring.', highlight: 'Full DevOps stack', license: 'MIT' },
    ],
  },
  {
    slug: 'notes',
    display: 'Notes',
    query: 'self-hosted notes',
    monthly_searches: 2400,
    intro: 'Notion, Evernote, Apple Notes all lock you in. Self-host your notes app: own the data, sync across devices, use whatever client you want.',
    picks: [
      { full_name: 'AppFlowy-IO/AppFlowy', short_name: 'AppFlowy', one_liner: 'Closest Notion clone. Block editor, databases, self-host with Docker.', highlight: 'Best Notion clone', license: 'AGPL-3.0' },
      { full_name: 'logseq/logseq', short_name: 'Logseq', one_liner: 'Roam-style PKM. Markdown files you own forever.', highlight: 'Best for PKM', license: 'AGPL-3.0' },
      { full_name: 'siyuan-note/siyuan', short_name: 'SiYuan', one_liner: 'Notion + Roam hybrid. Block editor + bidirectional links.', highlight: 'Most features', license: 'AGPL-3.0' },
    ],
  },
  {
    slug: 'chat',
    display: 'Team chat',
    query: 'self-hosted chat',
    monthly_searches: 2200,
    intro: 'Self-hosted team chat replaces Slack with full data ownership. Critical for compliance-heavy industries and privacy-first orgs.',
    picks: [
      { full_name: 'mattermost/mattermost', short_name: 'Mattermost', one_liner: 'Slack-clone for self-host. Channels, DMs, threads, integrations.', highlight: 'Closest Slack clone', license: 'MIT + Enterprise' },
      { full_name: 'RocketChat/Rocket.Chat', short_name: 'Rocket.Chat', one_liner: 'Team chat + customer support widget in one tool.', highlight: 'Internal + external chat', license: 'MIT' },
      { full_name: 'element-hq/element-web', short_name: 'Element (Matrix)', one_liner: 'Federated, end-to-end encrypted. Government-grade privacy.', highlight: 'E2EE + federated', license: 'AGPL-3.0' },
    ],
  },
  {
    slug: 'analytics',
    display: 'Analytics',
    query: 'self-hosted analytics',
    monthly_searches: 1800,
    intro: 'Privacy-first analytics you host yourself. No cookies, no GDPR cookie banner, no data sent to Google.',
    picks: [
      { full_name: 'plausible/analytics', short_name: 'Plausible', one_liner: 'Privacy-first, 1KB script, cookie-free. Self-host or paid cloud.', highlight: 'Best for marketing sites', license: 'AGPL-3.0' },
      { full_name: 'umami-software/umami', short_name: 'Umami', one_liner: 'Fully open Plausible alternative. Self-host for free.', highlight: 'Most permissive licensing', license: 'MIT' },
      { full_name: 'PostHog/posthog', short_name: 'PostHog', one_liner: 'Full product analytics: funnels, replay, feature flags.', highlight: 'SaaS-grade product analytics', license: 'MIT' },
      { full_name: 'matomo-org/matomo', short_name: 'Matomo', one_liner: 'The OG GA replacement. Goals, funnels, heatmaps included.', highlight: 'Closest GA feature parity', license: 'GPL-3.0' },
    ],
  },
  {
    slug: 'password-manager',
    display: 'Password manager',
    query: 'self-hosted password manager',
    monthly_searches: 1500,
    intro: 'Self-host your password vault. Audit the code, control the server, never worry about LastPass-style breaches.',
    picks: [
      { full_name: 'dani-garcia/vaultwarden', short_name: 'Vaultwarden', one_liner: 'Bitwarden-compatible Rust server. Runs on a Raspberry Pi.', highlight: 'Tiny resource use', license: 'AGPL-3.0' },
      { full_name: 'bitwarden/server', short_name: 'Bitwarden', one_liner: 'Official Bitwarden self-host. Heavier, more features.', highlight: 'Official Bitwarden', license: 'AGPL-3.0' },
    ],
  },
  {
    slug: 'automation',
    display: 'Automation',
    query: 'self-hosted automation',
    monthly_searches: 1100,
    intro: 'Self-host Zapier-style workflow automation. No per-run charges, unlimited steps, custom code nodes.',
    picks: [
      { full_name: 'n8n-io/n8n', short_name: 'n8n', one_liner: 'Zapier-killer with 400+ integrations and code/AI nodes.', highlight: 'Best feature set', license: 'Sustainable Use License' },
      { full_name: 'activepieces/activepieces', short_name: 'Activepieces', one_liner: 'Cleaner, simpler n8n alternative.', highlight: 'Easiest to start', license: 'MIT + Commons' },
      { full_name: 'huginn/huginn', short_name: 'Huginn', one_liner: 'Battle-tested OG. Less polished UI but fully MIT.', highlight: 'Fully MIT', license: 'MIT' },
    ],
  },
  {
    slug: 'video-conferencing',
    display: 'Video conferencing',
    query: 'self-hosted video conferencing',
    monthly_searches: 900,
    intro: 'Replace Zoom and Google Meet with self-hosted video conferencing. No call limits, no data harvesting, full sovereignty.',
    picks: [
      { full_name: 'jitsi/jitsi-meet', short_name: 'Jitsi Meet', one_liner: 'WebRTC-based, no account needed. Used by 8x8 enterprise.', highlight: 'Easiest to use', license: 'Apache 2.0' },
      { full_name: 'bigbluebutton/bigbluebutton', short_name: 'BigBlueButton', one_liner: 'Built for online classes. Whiteboard, polls, breakout rooms.', highlight: 'Best for education', license: 'LGPL-3.0' },
    ],
  },
  {
    slug: 'photo-storage',
    display: 'Photo storage',
    query: 'self-hosted photo storage',
    monthly_searches: 800,
    intro: 'Replace Google Photos / Apple Photos. Face recognition, location tagging, mobile auto-upload — all on your hardware.',
    picks: [
      { full_name: 'immich-app/immich', short_name: 'Immich', one_liner: 'Modern Google Photos clone. Best UX, AI face/object recognition.', highlight: 'Best UX in 2026', license: 'AGPL-3.0' },
      { full_name: 'photoprism/photoprism', short_name: 'PhotoPrism', one_liner: 'Mature photo library with AI classification.', highlight: 'Most mature', license: 'AGPL-3.0' },
    ],
  },
  {
    slug: 'cms',
    display: 'CMS',
    query: 'self-hosted cms',
    monthly_searches: 1300,
    intro: 'Self-host your content management system. No WordPress security nightmares, modern API-first headless CMS.',
    picks: [
      { full_name: 'payloadcms/payload', short_name: 'Payload', one_liner: 'TypeScript-first headless CMS with code-defined collections.', highlight: 'Best for TS teams', license: 'MIT' },
      { full_name: 'strapi/strapi', short_name: 'Strapi', one_liner: 'Most popular OSS CMS. Plugin marketplace, REST + GraphQL.', highlight: 'Largest ecosystem', license: 'SSPL + Enterprise' },
      { full_name: 'directus/directus', short_name: 'Directus', one_liner: 'Wraps any SQL DB as a CMS + auto-generated API.', highlight: 'Wraps existing DBs', license: 'BSL 1.1' },
    ],
  },
  {
    slug: 'dashboard',
    display: 'Dashboard / Admin panel',
    query: 'self-hosted dashboard',
    monthly_searches: 1300,
    intro: 'Self-hosted dashboards for monitoring infrastructure, business metrics, and admin panels for your data.',
    picks: [
      { full_name: 'grafana/grafana', short_name: 'Grafana', one_liner: 'Industry-standard observability dashboards.', highlight: 'Best for infra metrics', license: 'AGPL-3.0' },
      { full_name: 'apache/superset', short_name: 'Apache Superset', one_liner: 'BI dashboards over any SQL database.', highlight: 'Best for business intelligence', license: 'Apache 2.0' },
      { full_name: 'metabase/metabase', short_name: 'Metabase', one_liner: 'Easiest BI tool. Connect a DB, build dashboards in clicks.', highlight: 'Easiest BI setup', license: 'AGPL-3.0' },
    ],
  },
];

export function getSelfHostedBySlug(slug: string): SelfHostedPage | undefined {
  return SELF_HOSTED.find((s) => s.slug === slug);
}

// ─── MIGRATE ────────────────────────────────────────────────────────────
export interface MigratePage {
  slug: string;                  // "firebase-to-supabase"
  from: string;                  // "Firebase"
  to: string;                    // "Supabase"
  query: string;
  monthly_searches: number;
  why: string;                   // Why people migrate
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_estimate: string;
  steps: { title: string; body: string }[];
  gotchas: string[];
}

export const MIGRATIONS: MigratePage[] = [
  {
    slug: 'firebase-to-supabase',
    from: 'Firebase',
    to: 'Supabase',
    query: 'migrate from firebase to supabase',
    monthly_searches: 3200,
    why: 'Postgres > NoSQL for most apps, you want SQL queries + RLS, you want to escape Google\'s lock-in, you want a self-hosted option, you want lower costs at scale.',
    difficulty: 'Medium',
    time_estimate: '2-5 days for a typical app',
    steps: [
      { title: '1. Export Firestore data', body: 'Use `gcloud firestore export` to a Google Cloud Storage bucket. Download as JSON.' },
      { title: '2. Design your Postgres schema', body: 'Map Firestore collections → Postgres tables. Denormalize where Firestore relied on subcollections. Use Supabase\'s table editor or write SQL migrations.' },
      { title: '3. Bulk-import data', body: 'Convert JSON to CSV and use Supabase\'s import tool, or write a Node script using the Supabase JS client.' },
      { title: '4. Migrate auth users', body: 'Export Firebase Auth users via Firebase Admin SDK. Import into Supabase Auth using `auth.admin.createUser()` — preserve user IDs by reading from your migration map.' },
      { title: '5. Set up Row-Level Security policies', body: 'Replace Firestore security rules with Supabase RLS policies. Common pattern: `auth.uid() = user_id` on every public table.' },
      { title: '6. Replace Firebase SDK calls', body: 'Swap `firebase/firestore` for `@supabase/supabase-js`. Most CRUD operations map 1:1.' },
      { title: '7. Replace Firebase Functions', body: 'Move to Supabase Edge Functions (Deno) or Database Functions (PL/pgSQL) depending on the use case.' },
    ],
    gotchas: [
      'Firestore\'s offline support is unique — Supabase has no equivalent. Use a local cache layer (Dexie, Zustand persist) if you relied on this.',
      'Firestore charges per document read; Postgres charges by query complexity. Heavy real-time apps may see different cost profiles.',
      'Firebase Auth\'s phone auth requires reCAPTCHA setup on Supabase too.',
      'If you used Cloud Storage, migrate to Supabase Storage with the bulk upload script.',
    ],
  },
  {
    slug: 'airtable-to-nocodb',
    from: 'Airtable',
    to: 'NocoDB',
    query: 'migrate from airtable to nocodb',
    monthly_searches: 1500,
    why: 'Escape Airtable\'s per-user pricing, hit row/record limits, want to self-host, need to connect to existing SQL databases.',
    difficulty: 'Easy',
    time_estimate: '1-2 hours for a typical base',
    steps: [
      { title: '1. Install NocoDB', body: 'Run `docker run -d -p 8080:8080 -v "$PWD"/nocodb:/usr/app/data/ nocodb/nocodb:latest` on any VPS or your local machine.' },
      { title: '2. Use NocoDB\'s built-in Airtable import', body: 'In NocoDB UI, click "Create Project → Import from Airtable". Paste your Airtable API key + base ID. NocoDB pulls all tables, views, and data automatically.' },
      { title: '3. Verify views', body: 'Airtable Grid/Gallery/Kanban views all import. Re-create any formula columns that don\'t auto-convert.' },
      { title: '4. Update integrations', body: 'Replace Airtable API calls with NocoDB\'s REST API (mostly compatible).' },
    ],
    gotchas: [
      'Some Airtable field types (Linked Records with rollups) may need manual recreation.',
      'Airtable formulas use a different syntax than NocoDB; check formula columns post-import.',
      'Attachments are imported but stored locally (or in MinIO/S3 if configured).',
    ],
  },
  {
    slug: 'slack-to-mattermost',
    from: 'Slack',
    to: 'Mattermost',
    query: 'migrate from slack to mattermost',
    monthly_searches: 1800,
    why: 'Escape Slack\'s 90-day message retention on free plan, get full message history, self-host for compliance, avoid per-user fees.',
    difficulty: 'Easy',
    time_estimate: '4-8 hours',
    steps: [
      { title: '1. Export Slack workspace', body: 'In Slack: Settings → Import/Export → Export. Wait for the email with your full ZIP export.' },
      { title: '2. Install Mattermost', body: 'Run via Docker: `docker-compose up -d` using the official Mattermost compose file.' },
      { title: '3. Use Mattermost\'s built-in Slack importer', body: 'Mattermost ships with `mmctl import slack` — drop in your Slack ZIP. Channels, messages, users, attachments all transfer.' },
      { title: '4. Migrate integrations', body: 'Slack apps don\'t auto-port. Set up Mattermost webhooks/plugins for the integrations you actually use.' },
      { title: '5. Update DNS + invite users', body: 'Point a subdomain at Mattermost, send invite links to your team.' },
    ],
    gotchas: [
      'Threaded messages import correctly. Pinned messages may not.',
      'Slack workflows / apps don\'t auto-port — rebuild as Mattermost plugins.',
      'User profile photos transfer but you may need to re-upload some.',
    ],
  },
  {
    slug: 'zapier-to-n8n',
    from: 'Zapier',
    to: 'n8n',
    query: 'migrate from zapier to n8n',
    monthly_searches: 1200,
    why: 'Escape Zapier\'s per-task pricing, get unlimited steps, run automation locally, use code nodes for custom logic.',
    difficulty: 'Medium',
    time_estimate: '1-3 days depending on number of zaps',
    steps: [
      { title: '1. Self-host or use n8n cloud', body: 'Docker: `docker run -it --rm -p 5678:5678 n8nio/n8n`. Or sign up for n8n cloud.' },
      { title: '2. Inventory your zaps', body: 'Make a spreadsheet of every Zapier zap, what it does, frequency, and integrations used.' },
      { title: '3. Rebuild zap by zap', body: 'n8n has visual workflow editor like Zapier but more powerful. Most Zapier integrations have a direct n8n node equivalent.' },
      { title: '4. Test each workflow', body: 'Run each n8n workflow with test data. Compare to the Zapier zap output.' },
      { title: '5. Switch traffic gradually', body: 'Don\'t cut over all at once. Run n8n + Zapier in parallel for a week, verify n8n is working, then disable Zapier.' },
    ],
    gotchas: [
      'No automatic export from Zapier — every workflow is manually rebuilt.',
      'Some niche Zapier integrations don\'t exist in n8n yet. Use HTTP Request nodes as fallback.',
      'OAuth credentials must be re-authorized for each n8n node.',
    ],
  },
  {
    slug: 'calendly-to-cal-com',
    from: 'Calendly',
    to: 'Cal.com',
    query: 'migrate from calendly to cal.com',
    monthly_searches: 800,
    why: 'Escape Calendly\'s per-user pricing for teams, get more flexibility, brand fully, self-host option.',
    difficulty: 'Easy',
    time_estimate: '1-2 hours',
    steps: [
      { title: '1. Sign up for Cal.com cloud or self-host', body: 'Use cal.com (hosted free tier) or self-host with `git clone + pnpm install + pnpm dev`.' },
      { title: '2. Connect your calendar', body: 'Cal.com supports Google Calendar, Outlook, iCloud, CalDAV. Link your work calendar.' },
      { title: '3. Recreate event types', body: 'Manually create each Calendly event type in Cal.com. Same fields (duration, buffer, available hours).' },
      { title: '4. Set your booking URL', body: 'Update your email signature, LinkedIn, and any embedded widgets to use cal.com/yourname instead of calendly.com/yourname.' },
      { title: '5. Redirect old links (optional)', body: 'If you have many old Calendly links in the wild, set up a redirect via your domain.' },
    ],
    gotchas: [
      'No auto-import from Calendly — manually recreate event types.',
      'Calendly\'s "Routing Forms" are a paid feature; Cal.com has them in the free tier.',
      'Past bookings stay in Calendly; only future bookings move to Cal.com.',
    ],
  },
  {
    slug: 'mongodb-to-postgres',
    from: 'MongoDB',
    to: 'PostgreSQL',
    query: 'migrate from mongodb to postgres',
    monthly_searches: 2200,
    why: 'Escape MongoDB\'s licensing changes (SSPL), get true relational queries, schema enforcement, ACID transactions, lower hosting costs.',
    difficulty: 'Hard',
    time_estimate: '1-4 weeks for a non-trivial app',
    steps: [
      { title: '1. Export MongoDB collections', body: '`mongoexport --collection=X --out=X.json` for each collection.' },
      { title: '2. Design relational schema', body: 'Denormalize embedded documents into separate tables. Use foreign keys for relationships MongoDB stored implicitly.' },
      { title: '3. Use JSONB for true unstructured fields', body: 'Postgres `JSONB` columns handle MongoDB-like unstructured data with full indexing. Don\'t over-normalize what genuinely doesn\'t need it.' },
      { title: '4. Bulk import', body: 'Write a Node/Python script that reads MongoDB JSON exports and inserts into Postgres with proper FK resolution.' },
      { title: '5. Rewrite queries', body: 'MongoDB aggregation pipelines become SQL CTEs + window functions. This is the bulk of the work.' },
      { title: '6. Switch driver', body: 'Replace `mongoose`/`mongodb` with `pg`, `postgres.js`, or an ORM like Prisma/Drizzle.' },
    ],
    gotchas: [
      'MongoDB\'s `_id` ObjectIDs vs Postgres UUIDs — pick one convention.',
      'Aggregation pipelines are MongoDB\'s biggest win. SQL is more powerful but you\'ll write more code.',
      'Test query performance under load before cutover — JSONB indexing requires GIN indexes.',
      'If you used MongoDB Change Streams, you need Postgres LISTEN/NOTIFY or Debezium.',
    ],
  },
  {
    slug: 'mailchimp-to-listmonk',
    from: 'Mailchimp',
    to: 'Listmonk',
    query: 'migrate from mailchimp to listmonk',
    monthly_searches: 600,
    why: 'Cut email marketing costs by 95%. Listmonk + AWS SES costs ~$5/mo for 100k subscribers vs. Mailchimp\'s $300+.',
    difficulty: 'Medium',
    time_estimate: '4-8 hours',
    steps: [
      { title: '1. Export Mailchimp lists', body: 'Mailchimp → Audience → Export Audience. Download CSV with subscribers + tags.' },
      { title: '2. Install Listmonk', body: 'Single Go binary + Postgres. Run with Docker Compose for production.' },
      { title: '3. Import subscribers', body: 'Listmonk has a CSV importer. Map Mailchimp columns to Listmonk subscriber attributes.' },
      { title: '4. Set up SMTP/SES', body: 'Listmonk doesn\'t send email itself — point it at AWS SES, Mailgun, or Postmark. SES at ~$0.10/1000 emails is the cheapest.' },
      { title: '5. Verify domain + DKIM/SPF', body: 'Critical for deliverability. Use SES domain verification + add DKIM/SPF DNS records.' },
      { title: '6. Recreate campaigns/templates', body: 'Listmonk supports HTML, plain text, and Markdown. Templates are simpler than Mailchimp\'s WYSIWYG.' },
    ],
    gotchas: [
      'Mailchimp\'s engagement scores don\'t export. Start fresh.',
      'Automation workflows must be rebuilt in Listmonk (or via n8n).',
      'Deliverability requires proper SES warmup. Start with low volume and ramp up.',
    ],
  },
  {
    slug: 'prisma-to-drizzle',
    from: 'Prisma',
    to: 'Drizzle',
    query: 'migrate from prisma to drizzle',
    monthly_searches: 900,
    why: 'Drizzle has zero runtime overhead, works in edge environments (Cloudflare Workers, Vercel Edge), has SQL-first syntax. Better for serverless/edge apps.',
    difficulty: 'Medium',
    time_estimate: '1-2 days for a mid-size app',
    steps: [
      { title: '1. Install Drizzle', body: '`pnpm add drizzle-orm drizzle-kit` plus your DB driver (`postgres`, `mysql2`, `better-sqlite3`).' },
      { title: '2. Generate Drizzle schema from existing DB', body: '`drizzle-kit introspect` reads your existing Postgres/MySQL schema and generates Drizzle TS schema definitions.' },
      { title: '3. Replace Prisma client usage', body: 'Swap `prisma.user.findMany()` for `db.select().from(users)`. SQL-style, less magic.' },
      { title: '4. Migrate relations syntax', body: 'Prisma uses `include`; Drizzle uses explicit joins or `with` syntax. Rewrite query by query.' },
      { title: '5. Set up Drizzle migrations', body: 'Use `drizzle-kit generate` for migration files. Different style than Prisma migrate — explicit SQL.' },
      { title: '6. Remove Prisma + delete prisma/ folder', body: 'After all queries are migrated and tests pass, remove `@prisma/client` and the `prisma/` folder.' },
    ],
    gotchas: [
      'Prisma\'s `select` and `include` are convenient. Drizzle requires more explicit column lists.',
      'Drizzle doesn\'t have a Prisma-style "studio" — use Drizzle Studio (separate package) or a third-party GUI.',
      'TypeScript inference is great in both but works differently. Read Drizzle docs on type generation.',
    ],
  },
];

export function getMigrateBySlug(slug: string): MigratePage | undefined {
  return MIGRATIONS.find((m) => m.slug === slug);
}

// ─── FOR-AUDIENCE ───────────────────────────────────────────────────────
export interface ForAudiencePick {
  category: string;
  full_name: string;
  short_name: string;
  why: string;
}

export interface ForAudiencePage {
  slug: string;
  audience: string;             // "Startups", "Indie Hackers"
  query: string;
  monthly_searches: number;
  intro: string;
  picks: ForAudiencePick[];
}

export const FOR_AUDIENCE: ForAudiencePage[] = [
  {
    slug: 'startups',
    audience: 'Startups',
    query: 'open source tools for startups',
    monthly_searches: 4400,
    intro: 'The open-source stack for early-stage startups in 2026. Every tool below has a generous free tier or self-host option. You can run a full SaaS company on this stack for under $50/month until you hit real revenue.',
    picks: [
      { category: 'Backend', full_name: 'supabase/supabase', short_name: 'Supabase', why: 'Postgres + Auth + Storage. Free tier handles up to ~1000 users.' },
      { category: 'Frontend', full_name: 'vercel/next.js', short_name: 'Next.js', why: 'React framework with App Router. Vercel free tier covers most early-stage apps.' },
      { category: 'UI', full_name: 'shadcn-ui/ui', short_name: 'shadcn/ui', why: 'Copy-paste components. Own the code, no npm dependency to break.' },
      { category: 'CRM', full_name: 'twentyhq/twenty', short_name: 'Twenty', why: 'Modern OSS CRM. Self-host for $0/month vs Hubspot\'s $1500/year minimum.' },
      { category: 'Email marketing', full_name: 'knadh/listmonk', short_name: 'Listmonk', why: 'Self-hosted newsletter. ~$5/mo for 100k subscribers vs Mailchimp\'s $300+.' },
      { category: 'Analytics', full_name: 'plausible/analytics', short_name: 'Plausible', why: 'Privacy-first, cookie-free. $9/mo for the cloud (or self-host free).' },
      { category: 'Scheduling', full_name: 'calcom/cal.diy', short_name: 'Cal.com', why: 'Calendly replacement. Free for solo founders, OSS for teams.' },
      { category: 'Automation', full_name: 'n8n-io/n8n', short_name: 'n8n', why: 'Zapier replacement with code nodes. Self-host for unlimited workflows.' },
      { category: 'Team chat', full_name: 'mattermost/mattermost', short_name: 'Mattermost', why: 'Slack replacement with full message history (Slack free = 90 days only).' },
      { category: 'Docs/Wiki', full_name: 'outline/outline', short_name: 'Outline', why: 'Clean team wiki. Self-host or use the affordable cloud.' },
    ],
  },
  {
    slug: 'nonprofits',
    audience: 'Nonprofits',
    query: 'open source software for nonprofits',
    monthly_searches: 2900,
    intro: 'The open-source stack for nonprofits in 2026 — saves your donor money. Free + self-hostable picks for the systems every NGO needs: donor management, communications, finance, web presence.',
    picks: [
      { category: 'Donor management / CRM', full_name: 'civicrm/civicrm-core', short_name: 'CiviCRM', why: 'The dominant nonprofit CRM. Donor tracking, event management, advocacy campaigns. Battle-tested for 20 years.' },
      { category: 'Website / CMS', full_name: 'strapi/strapi', short_name: 'Strapi', why: 'Headless CMS for your public website. Easy admin UI for non-technical content editors.' },
      { category: 'Email marketing', full_name: 'knadh/listmonk', short_name: 'Listmonk', why: 'Self-hosted newsletter at fraction of Mailchimp cost.' },
      { category: 'File sharing', full_name: 'nextcloud/server', short_name: 'Nextcloud', why: 'Self-hosted Google Workspace equivalent. Cuts $20/user/month subscription costs.' },
      { category: 'Team chat', full_name: 'mattermost/mattermost', short_name: 'Mattermost', why: 'Free internal communication, full history retention.' },
      { category: 'Project management', full_name: 'makeplane/plane', short_name: 'Plane', why: 'Linear/Asana alternative. Track grant deliverables, campaigns.' },
      { category: 'Forms / Donations', full_name: 'formbricks/formbricks', short_name: 'Formbricks', why: 'OSS Typeform replacement. Donation forms, volunteer signups, surveys.' },
      { category: 'Analytics', full_name: 'umami-software/umami', short_name: 'Umami', why: 'Privacy-first analytics — important for donor trust.' },
    ],
  },
  {
    slug: 'indie-hackers',
    audience: 'Indie hackers',
    query: 'open source tools for indie hackers',
    monthly_searches: 700,
    intro: 'The bootstrapper\'s open-source stack — built solo, paid once, owned forever. Every tool below has been used by profitable indie SaaS founders to build $10k+/month businesses.',
    picks: [
      { category: 'Full-stack framework', full_name: 'vercel/next.js', short_name: 'Next.js', why: 'Ship full-stack SaaS in one repo. Most indie SaaS in 2026 runs on Next.js.' },
      { category: 'Backend', full_name: 'supabase/supabase', short_name: 'Supabase', why: 'Free until ~1000 paying users. Solo founder dream.' },
      { category: 'Auth', full_name: 'better-auth/better-auth', short_name: 'Better Auth', why: 'TypeSafe auth that just works. Modern API, framework-agnostic.' },
      { category: 'AI integration', full_name: 'vercel/ai', short_name: 'Vercel AI SDK', why: 'Streaming, structured outputs, tool calling. The right AI integration for ship-fast indie products.' },
      { category: 'Payments (India)', full_name: 'razorpay/razorpay-node', short_name: 'Razorpay', why: 'Best Indian payment processor. UPI + cards + subscriptions.' },
      { category: 'Email', full_name: 'resend/react-email', short_name: 'react-email', why: 'Beautiful transactional emails with JSX templates.' },
      { category: 'Analytics', full_name: 'plausible/analytics', short_name: 'Plausible', why: 'Privacy-first analytics. No cookie banner = better UX.' },
      { category: 'Newsletter', full_name: 'knadh/listmonk', short_name: 'Listmonk', why: 'Build your audience without per-subscriber fees.' },
      { category: 'Open-source curation', full_name: 'stackpicks-dev/stackpicks', short_name: 'StackPicks', why: 'Curated picks for everything else (yes, this site).' },
    ],
  },
  {
    slug: 'students',
    audience: 'Students',
    query: 'open source software for students',
    monthly_searches: 1500,
    intro: 'Free open-source tools every CS student should know in 2026. From building portfolio projects to landing your first job — these are the skills + tools that matter.',
    picks: [
      { category: 'Code editor', full_name: 'microsoft/vscode', short_name: 'VS Code', why: 'The default editor. Free, fast, has every extension you\'ll need.' },
      { category: 'Frontend framework', full_name: 'vercel/next.js', short_name: 'Next.js', why: 'Most in-demand React framework. Learn this for jobs.' },
      { category: 'Backend / Database', full_name: 'supabase/supabase', short_name: 'Supabase', why: 'Free tier perfect for portfolio projects. Learn Postgres + Auth in one tool.' },
      { category: 'UI', full_name: 'shadcn-ui/ui', short_name: 'shadcn/ui', why: 'Most popular React UI library in 2026. Looks good without design work.' },
      { category: 'AI', full_name: 'ollama/ollama', short_name: 'Ollama', why: 'Run LLMs on your laptop. Free, private, fast.' },
      { category: 'Note-taking', full_name: 'logseq/logseq', short_name: 'Logseq', why: 'Open-source Roam-style PKM. Use this for class notes.' },
      { category: 'Version control', full_name: 'gohugoio/hugo', short_name: 'Hugo', why: 'For a personal blog/portfolio. Static site = free hosting on GitHub Pages.' },
      { category: 'Deployment', full_name: 'coollabsio/coolify', short_name: 'Coolify', why: 'Self-hosted Vercel alternative. Learn DevOps by deploying your own projects.' },
    ],
  },
  {
    slug: 'small-business',
    audience: 'Small businesses',
    query: 'open source for small business',
    monthly_searches: 1800,
    intro: 'Run your small business on open-source software in 2026. CRM, email, accounting, scheduling — all the systems you need without monthly subscription fees that eat your margin.',
    picks: [
      { category: 'CRM', full_name: 'EspoCRM/EspoCRM', short_name: 'EspoCRM', why: 'Feature-complete CRM. Sales pipelines, customer database, automations.' },
      { category: 'Scheduling', full_name: 'calcom/cal.diy', short_name: 'Cal.com', why: 'Free Calendly. Embed booking widget on your website.' },
      { category: 'Email marketing', full_name: 'knadh/listmonk', short_name: 'Listmonk', why: 'Newsletter without Mailchimp fees. Pay for sending only.' },
      { category: 'Website', full_name: 'WordPress/WordPress', short_name: 'WordPress', why: 'Still dominant for small biz sites. 1000s of themes + plugins.' },
      { category: 'Invoicing', full_name: 'invoiceninja/invoices', short_name: 'Invoice Ninja', why: 'Send invoices, accept payments, track expenses. Free for solo, paid for teams.' },
      { category: 'Team chat', full_name: 'mattermost/mattermost', short_name: 'Mattermost', why: 'Free internal chat with full history.' },
      { category: 'File storage', full_name: 'nextcloud/server', short_name: 'Nextcloud', why: 'Self-host Dropbox/Google Drive equivalent.' },
      { category: 'Analytics', full_name: 'umami-software/umami', short_name: 'Umami', why: 'Privacy-first website analytics. No cookie banner.' },
    ],
  },
];

export function getForAudienceBySlug(slug: string): ForAudiencePage | undefined {
  return FOR_AUDIENCE.find((a) => a.slug === slug);
}
