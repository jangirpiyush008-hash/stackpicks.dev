/**
 * "Open-source alternative to X" pages — the highest-volume keyword class
 * we don't currently target. Each page captures specific "open source alternative to <SaaS>" queries.
 *
 * Each alternative is inline-defined here so we don't need to seed all the new repos
 * into the main DB — these pages can stand alone.
 */

export interface OssPick {
  full_name: string;             // e.g. "n8n-io/n8n"
  short_name: string;            // Display name
  curator_take: string;          // 80-160 words
  use_this_if: string;
  skip_if: string;
  homepage?: string;
  license?: string;
  stars_approx?: number;         // For social proof — approximate ok
  self_hosted: boolean;
}

export interface AlternativePage {
  slug: string;                  // URL slug, e.g. "notion"
  saas_name: string;             // Display name of the SaaS being replaced
  query: string;                 // Target search query
  monthly_searches: number;      // Estimated
  category: string;              // Grouping
  saas_blurb: string;            // 1-2 sentence description of what the SaaS is + why people want OSS
  picks: OssPick[];              // 3-5 OSS alternatives, ordered best to worst
}

export const ALTERNATIVES: AlternativePage[] = [
  // ─── HIGHEST VOLUME ────────────────────────────────────────────────
  {
    slug: 'chatgpt',
    saas_name: 'ChatGPT',
    query: 'open source alternative to chatgpt',
    monthly_searches: 8100,
    category: 'AI',
    saas_blurb: 'ChatGPT is OpenAI\'s consumer chatbot. People want open-source alternatives for privacy, offline use, custom fine-tuning, and to avoid the $20/mo subscription.',
    picks: [
      {
        full_name: 'ollama/ollama',
        short_name: 'Ollama',
        curator_take: 'Ollama is the easiest way to run Llama 3.3, Qwen 2.5, DeepSeek-R1, Mistral, and 100+ other models locally. One install, one command (`ollama run llama3.3`), works on Mac/Linux/Windows. Pairs with any chat UI (OpenWebUI is the most popular). For privacy-sensitive work or building products that need local inference, this is the foundation.',
        use_this_if: 'You want fully local LLM inference, you need privacy guarantees, or you want to avoid API costs while developing AI products.',
        skip_if: 'You need GPT-4-class reasoning on consumer hardware — open models are getting closer but still trail proprietary frontier models on hard reasoning tasks.',
        license: 'MIT',
        stars_approx: 110000,
        self_hosted: true,
      },
      {
        full_name: 'open-webui/open-webui',
        short_name: 'OpenWebUI',
        curator_take: 'OpenWebUI gives you a ChatGPT-clone interface that runs against your local Ollama instance (or any OpenAI-compatible endpoint). Multi-user, RAG over documents, model switcher, conversation history. Self-host with Docker in 5 minutes. Combined with Ollama, this is the full ChatGPT replacement stack.',
        use_this_if: 'You\'re running Ollama and want a beautiful UI instead of the CLI. Or you want to give your team a private ChatGPT-like experience.',
        skip_if: 'You only need a single-user setup — the Ollama desktop apps are simpler.',
        license: 'MIT',
        stars_approx: 65000,
        self_hosted: true,
      },
      {
        full_name: 'huggingface/transformers',
        short_name: 'Hugging Face Transformers',
        curator_take: 'The Python library that runs every modern open-source LLM. Lower-level than Ollama — you load models manually, manage GPU memory yourself. Pick this if you\'re building a custom AI product, fine-tuning models, or running production inference at scale.',
        use_this_if: 'You\'re building production AI products, doing research, or need fine-tuning capabilities.',
        skip_if: 'You just want to chat with an LLM — Ollama is simpler.',
        license: 'Apache 2.0',
        stars_approx: 135000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'notion',
    saas_name: 'Notion',
    query: 'open source alternative to notion',
    monthly_searches: 6600,
    category: 'Productivity',
    saas_blurb: 'Notion is the leading "all-in-one workspace" — docs, wikis, databases, projects. People want OSS alternatives for self-hosting, privacy, no vendor lock-in, and to escape the $10/user/month team plans.',
    picks: [
      {
        full_name: 'AppFlowy-IO/AppFlowy',
        short_name: 'AppFlowy',
        curator_take: 'AppFlowy is the closest Notion clone in 2026 — same block-based editor, same database views, same drag-and-drop. Built in Rust + Flutter so it\'s fast on every platform. Cloud and self-host both supported. The team has been shipping aggressively for 3 years; this is the OSS Notion of choice.',
        use_this_if: 'You want a near 1:1 Notion replacement with self-hosting and AI features baked in.',
        skip_if: 'Your team is deeply embedded in Notion templates and integrations — migration is real work.',
        license: 'AGPL-3.0',
        stars_approx: 60000,
        self_hosted: true,
      },
      {
        full_name: 'toeverything/AFFiNE',
        short_name: 'AFFiNE',
        curator_take: 'AFFiNE merges Notion\'s block editor with Miro\'s infinite canvas. Same page can be a doc, a table, or a whiteboard. Local-first by default, sync via your own backend. Best for design + dev teams who want both linear docs and visual workspaces in one tool.',
        use_this_if: 'You need both Notion-style docs AND Miro-style whiteboards in one tool.',
        skip_if: 'You only need docs/databases — AppFlowy is simpler.',
        license: 'MIT',
        stars_approx: 45000,
        self_hosted: true,
      },
      {
        full_name: 'logseq/logseq',
        short_name: 'Logseq',
        curator_take: 'Logseq is the Roam Research / Obsidian-style outliner — markdown files, bidirectional links, daily journaling, graph view. Not a Notion clone but the right pick if your primary use is personal knowledge management (PKM) over team databases.',
        use_this_if: 'You want personal knowledge management with markdown files you own.',
        skip_if: 'You need team databases and structured project tracking.',
        license: 'AGPL-3.0',
        stars_approx: 35000,
        self_hosted: true,
      },
      {
        full_name: 'outline/outline',
        short_name: 'Outline',
        curator_take: 'Outline is the team wiki / docs replacement — clean Markdown editor, hierarchical organization, slash commands. No database views (unlike Notion). Best for documentation-heavy teams who don\'t need Notion\'s database features.',
        use_this_if: 'Your team needs a clean wiki/docs tool without the database complexity.',
        skip_if: 'You need database views — pick AppFlowy.',
        license: 'BSL 1.1',
        stars_approx: 30000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'figma',
    saas_name: 'Figma',
    query: 'open source alternative to figma',
    monthly_searches: 5400,
    category: 'Design',
    saas_blurb: 'Figma is the dominant collaborative design tool. After Adobe\'s attempted acquisition, many teams want OSS alternatives for self-hosting, file portability, and to avoid future pricing changes.',
    picks: [
      {
        full_name: 'penpot/penpot',
        short_name: 'Penpot',
        curator_take: 'Penpot is the only serious open-source Figma alternative in 2026. Full vector editing, components, prototyping, design system support, real-time collaboration. Self-hostable with Docker. SVG-native files (Figma uses a proprietary format). Used by Mozilla, Wikipedia, and other public-sector teams that need OSS by mandate.',
        use_this_if: 'You need real-time collaborative design with SVG-native portability, especially if you\'re in public sector / EU GDPR-sensitive industry.',
        skip_if: 'Your team has 6+ years of Figma muscle memory — migration is months of work.',
        license: 'MPL-2.0',
        stars_approx: 36000,
        self_hosted: true,
      },
      {
        full_name: 'excalidraw/excalidraw',
        short_name: 'Excalidraw',
        curator_take: 'Excalidraw is hand-drawn-style whiteboarding — not a Figma replacement but the right tool for design sketches, architecture diagrams, and quick ideation. End-to-end encrypted rooms. Beloved by engineers for "back of napkin" diagrams.',
        use_this_if: 'You need quick sketches, system diagrams, or whiteboarding (not pixel-perfect mockups).',
        skip_if: 'You need component-based design with design tokens — pick Penpot.',
        license: 'MIT',
        stars_approx: 90000,
        self_hosted: true,
      },
      {
        full_name: 'tldraw/tldraw',
        short_name: 'tldraw',
        curator_take: 'tldraw is a modern, polished whiteboard with AI-powered features (sketch-to-app). Library you can embed in your own product. Same niche as Excalidraw but with a more "designer-friendly" feel and better extensibility.',
        use_this_if: 'You want to embed whiteboarding in your own SaaS product.',
        skip_if: 'You need a standalone tool — Excalidraw is simpler.',
        license: 'MIT (with restrictions)',
        stars_approx: 36000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'airtable',
    saas_name: 'Airtable',
    query: 'open source alternative to airtable',
    monthly_searches: 4500,
    category: 'No-code databases',
    saas_blurb: 'Airtable popularized spreadsheet-database hybrids. Open-source alternatives exist for self-hosting, removing per-user pricing, and avoiding the workflow lock-in.',
    picks: [
      {
        full_name: 'nocodb/nocodb',
        short_name: 'NocoDB',
        curator_take: 'NocoDB is the closest Airtable clone. Connects to MySQL/Postgres/SQLite/MSSQL/Snowflake — turns any database into an Airtable-like UI with grid/gallery/kanban/form views, automations, and API access. Self-host with Docker. The smartest pick if you have existing relational data you want to make spreadsheet-accessible.',
        use_this_if: 'You have existing SQL data you want to expose to non-technical users as Airtable-style views.',
        skip_if: 'You\'re starting from scratch with no existing DB — Baserow is simpler.',
        license: 'AGPL-3.0',
        stars_approx: 55000,
        self_hosted: true,
      },
      {
        full_name: 'bram2w/baserow',
        short_name: 'Baserow',
        curator_take: 'Baserow is the prettiest no-code database — Airtable-style UI with formulas, links between tables, automations, and a strong free SaaS tier (plus full self-host). Best DX for non-technical users.',
        use_this_if: 'Your team includes non-developers who need to manage data without SQL.',
        skip_if: 'You need to wrap an existing database — pick NocoDB.',
        license: 'MIT',
        stars_approx: 18000,
        self_hosted: true,
      },
      {
        full_name: 'directus/directus',
        short_name: 'Directus',
        curator_take: 'Directus wraps any SQL database as a flexible no-code admin + REST/GraphQL API. More backend-y than Airtable — but if you need a CMS + a no-code DB UI in one tool, this is the pick.',
        use_this_if: 'You need a CMS-like layer over your existing database plus an API to query it.',
        skip_if: 'You want spreadsheet aesthetics — NocoDB or Baserow.',
        license: 'BSL 1.1',
        stars_approx: 30000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'slack',
    saas_name: 'Slack',
    query: 'open source alternative to slack',
    monthly_searches: 3300,
    category: 'Team chat',
    saas_blurb: 'Slack is the team chat default. OSS alternatives matter for self-hosting (privacy/compliance), avoiding per-user pricing, and keeping data on-prem in regulated industries.',
    picks: [
      {
        full_name: 'mattermost/mattermost',
        short_name: 'Mattermost',
        curator_take: 'Mattermost is the closest Slack clone — channels, DMs, threads, integrations, mobile apps. Used by DoD, EU Parliament, regulated enterprises. Self-host in Docker, K8s-ready. Enterprise SSO/SAML/LDAP in the free version.',
        use_this_if: 'You need a Slack replacement for compliance/sovereignty reasons. Or you want to own your team\'s data.',
        skip_if: 'Your team is small and Slack free tier works fine — self-hosting has real overhead.',
        license: 'MIT + Enterprise modules',
        stars_approx: 30000,
        self_hosted: true,
      },
      {
        full_name: 'RocketChat/Rocket.Chat',
        short_name: 'Rocket.Chat',
        curator_take: 'Rocket.Chat is similar to Mattermost but adds live chat / customer support widgets (so you can talk to customers AND internal team in one tool). Strong for hybrid use cases. More feature-rich but heavier.',
        use_this_if: 'You need internal team chat + external customer support chat in one tool.',
        skip_if: 'You only need internal team chat — Mattermost is leaner.',
        license: 'MIT',
        stars_approx: 41000,
        self_hosted: true,
      },
      {
        full_name: 'element-hq/element-web',
        short_name: 'Element (Matrix)',
        curator_take: 'Element is the reference client for the Matrix protocol — federated, end-to-end encrypted by default, used by the French government and many security-sensitive orgs. Different paradigm (federated like email, not centralized like Slack).',
        use_this_if: 'You need end-to-end encryption + federation across orgs (not just internal teams).',
        skip_if: 'You want Slack-clone simplicity — Mattermost is closer to that.',
        license: 'AGPL-3.0',
        stars_approx: 11000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'zapier',
    saas_name: 'Zapier',
    query: 'open source alternative to zapier',
    monthly_searches: 2900,
    category: 'Automation',
    saas_blurb: 'Zapier popularized "if-this-then-that" automation between SaaS apps. OSS alternatives let you self-host, avoid per-run pricing, and use unlimited steps.',
    picks: [
      {
        full_name: 'n8n-io/n8n',
        short_name: 'n8n',
        curator_take: 'n8n is the dominant Zapier alternative. 400+ integrations, visual node editor, code nodes (JS/Python), AI nodes (LangChain, OpenAI), self-host with Docker. Strong commercial support + cloud option. The clear pick for serious automation.',
        use_this_if: 'You need a powerful Zapier replacement with code-level flexibility and AI integration.',
        skip_if: 'You only need 2-3 simple automations — Zapier free tier is easier.',
        license: 'Sustainable Use License',
        stars_approx: 75000,
        self_hosted: true,
      },
      {
        full_name: 'activepieces/activepieces',
        short_name: 'Activepieces',
        curator_take: 'Activepieces is the cleaner, simpler n8n. Lighter UI, easier to self-host, growing integration library. Best for teams that want n8n\'s feel but with less complexity.',
        use_this_if: 'You want a simpler, prettier n8n. Or you\'re on the fence between n8n and Make.',
        skip_if: 'You need maximum integration coverage — n8n still leads on count.',
        license: 'MIT + Commons Clause',
        stars_approx: 12000,
        self_hosted: true,
      },
      {
        full_name: 'huginn/huginn',
        short_name: 'Huginn',
        curator_take: 'Huginn is the OG (started in 2013). Less polished UI than n8n but battle-tested, no licensing weirdness, fully open-source. Best for developers who want raw flexibility over UI polish.',
        use_this_if: 'You want a 100%-open-source-no-commercial-strings automation tool.',
        skip_if: 'You want a modern UI — n8n is way prettier.',
        license: 'MIT',
        stars_approx: 45000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'discord',
    saas_name: 'Discord',
    query: 'open source alternative to discord',
    monthly_searches: 2400,
    category: 'Community chat',
    saas_blurb: 'Discord dominates community chat but locks you in. OSS alternatives matter for community ownership, no ads/data harvesting, and self-hosting for privacy-sensitive groups.',
    picks: [
      {
        full_name: 'revoltchat/revolt',
        short_name: 'Revolt',
        curator_take: 'Revolt is the closest Discord clone — voice channels, custom emoji, bots, mobile apps. Modern UI, actively developed, fully open-source. Self-host or use the hosted instance.',
        use_this_if: 'You want Discord features for your community without the corporate ownership.',
        skip_if: 'Your community is already on Discord — migration is brutal for established communities.',
        license: 'AGPL-3.0',
        stars_approx: 5500,
        self_hosted: true,
      },
      {
        full_name: 'element-hq/element-web',
        short_name: 'Element (Matrix)',
        curator_take: 'Federated, encrypted alternative. Different model than Discord (rooms, not servers) but the right pick for privacy-first communities and organizations that need E2EE.',
        use_this_if: 'You need end-to-end encryption or federation across orgs.',
        skip_if: 'Your community wants Discord-clone UX — Revolt is closer.',
        license: 'AGPL-3.0',
        stars_approx: 11000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'canva',
    saas_name: 'Canva',
    query: 'open source alternative to canva',
    monthly_searches: 2200,
    category: 'Design',
    saas_blurb: 'Canva is the dominant easy-design tool for non-designers (social posts, presentations, marketing materials). OSS alternatives are scarce but exist.',
    picks: [
      {
        full_name: 'penpot/penpot',
        short_name: 'Penpot',
        curator_take: 'Penpot leans more designer/Figma than Canva — but it includes templates, libraries, and is more capable than Canva for serious design work. If your team has any design literacy, Penpot is better. If they\'re marketers who want drag-and-drop posters, Penpot is overkill.',
        use_this_if: 'Your team includes designers who currently use Canva because it\'s easy.',
        skip_if: 'You need a true Canva-clone with social-media-post templates and zero design knowledge.',
        license: 'MPL-2.0',
        stars_approx: 36000,
        self_hosted: true,
      },
      {
        full_name: 'photopea/photopea-source',
        short_name: 'Photopea',
        curator_take: 'Photopea is the open-source Photoshop in your browser. Different niche than Canva but works for raster image editing. Best for editing photos, adding text, creating raster graphics — not template-based design.',
        use_this_if: 'You need Photoshop-style image editing in the browser without paying Adobe.',
        skip_if: 'You need template-based marketing design — Penpot is closer.',
        license: 'Various',
        stars_approx: 7500,
        self_hosted: false,
      },
    ],
  },

  {
    slug: 'github',
    saas_name: 'GitHub',
    query: 'open source alternative to github',
    monthly_searches: 2000,
    category: 'Code hosting',
    saas_blurb: 'GitHub is owned by Microsoft. Open-source alternatives exist for self-hosting your code (sovereignty, privacy) and to avoid MS lock-in.',
    picks: [
      {
        full_name: 'go-gitea/gitea',
        short_name: 'Gitea',
        curator_take: 'Gitea is the lightweight self-host GitHub clone. Issues, PRs, wiki, releases, packages, actions. Single Go binary, runs anywhere, sips RAM. The dominant pick for personal/team self-hosted git.',
        use_this_if: 'You want a self-hosted GitHub for your team without the resource overhead of GitLab.',
        skip_if: 'You need CI/CD at GitLab\'s scale or built-in DevSecOps features.',
        license: 'MIT',
        stars_approx: 47000,
        self_hosted: true,
      },
      {
        full_name: 'forgejo/forgejo',
        short_name: 'Forgejo',
        curator_take: 'Forgejo is the community fork of Gitea (forked over governance concerns). 99% feature-compatible. Pick Forgejo if you care about the more open governance model; pick Gitea if you want the larger ecosystem.',
        use_this_if: 'You care about transparent, community-led governance for your self-hosted git.',
        skip_if: 'You want the larger ecosystem — Gitea has more plugins/themes.',
        license: 'MIT',
        stars_approx: 4000,
        self_hosted: true,
      },
      {
        full_name: 'gitlab-org/gitlab',
        short_name: 'GitLab CE',
        curator_take: 'GitLab Community Edition is the heaviest pick — full DevOps platform with CI/CD, container registry, security scanning, monitoring. Run it if you need the whole stack; otherwise it\'s overkill.',
        use_this_if: 'You need GitLab\'s full DevOps suite (CI/CD, registries, monitoring) and have ops capacity to run it.',
        skip_if: 'You just need git hosting — Gitea is 100× lighter.',
        license: 'MIT',
        stars_approx: 24000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'typeform',
    saas_name: 'Typeform',
    query: 'open source alternative to typeform',
    monthly_searches: 1800,
    category: 'Forms / Surveys',
    saas_blurb: 'Typeform makes beautiful conversational forms. OSS alternatives let you self-host (no per-response pricing), keep response data private, and brand fully.',
    picks: [
      {
        full_name: 'formbricks/formbricks',
        short_name: 'Formbricks',
        curator_take: 'Formbricks is the modern OSS Typeform — beautiful forms, conditional logic, embeds, in-app surveys, NPS, response analytics. Self-host with Docker or use cloud. Best DX of any OSS form builder in 2026.',
        use_this_if: 'You need beautiful self-hosted forms with full analytics and no response limits.',
        skip_if: 'You just need a 5-question contact form — Tally\'s free tier is simpler.',
        license: 'AGPL-3.0',
        stars_approx: 9000,
        self_hosted: true,
      },
      {
        full_name: 'documenso/documenso',
        short_name: 'Documenso',
        curator_take: 'Not a form tool exactly — Documenso is the open-source DocuSign for digital signatures. Mentioned here because Typeform users often graduate to needing signatures (NDAs, contracts) and Documenso pairs perfectly.',
        use_this_if: 'Your forms collect signatures — Typeform doesn\'t do this well.',
        skip_if: 'You just need basic forms — Formbricks is the answer.',
        license: 'AGPL-3.0',
        stars_approx: 9000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'dropbox',
    saas_name: 'Dropbox',
    query: 'open source alternative to dropbox',
    monthly_searches: 1500,
    category: 'File sync / storage',
    saas_blurb: 'Dropbox/Google Drive/OneDrive all dominate file sync. OSS alternatives let you keep your files on your own servers — critical for privacy, EU GDPR, sovereignty.',
    picks: [
      {
        full_name: 'nextcloud/server',
        short_name: 'Nextcloud',
        curator_take: 'Nextcloud is the comprehensive self-hosted suite — files, calendars, contacts, video chat, office suite (with Collabora/OnlyOffice), photos, all on your own server. Used by EU governments. The dominant OSS pick.',
        use_this_if: 'You want a comprehensive self-hosted productivity suite that replaces Dropbox + Google Workspace.',
        skip_if: 'You only need file sync without the office/calendar bloat.',
        license: 'AGPL-3.0',
        stars_approx: 28000,
        self_hosted: true,
      },
      {
        full_name: 'syncthing/syncthing',
        short_name: 'Syncthing',
        curator_take: 'Syncthing is peer-to-peer file sync. No central server, no cloud — devices sync directly. Best for personal sync between your own devices (laptop ↔ desktop ↔ phone).',
        use_this_if: 'You want device-to-device sync without any cloud middleman.',
        skip_if: 'You need shared team folders or web access — Nextcloud is the answer.',
        license: 'MPL-2.0',
        stars_approx: 65000,
        self_hosted: true,
      },
      {
        full_name: 'seafile/seafile',
        short_name: 'Seafile',
        curator_take: 'Seafile is faster and lighter than Nextcloud — pure file sync without the office-suite bloat. Better for teams that just need shared folders + version history.',
        use_this_if: 'You want fast, lean self-hosted file sync without the kitchen-sink approach.',
        skip_if: 'You need calendars, office docs, video chat too — Nextcloud is more complete.',
        license: 'GPL-2.0',
        stars_approx: 12500,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'mailchimp',
    saas_name: 'Mailchimp',
    query: 'open source alternative to mailchimp',
    monthly_searches: 1500,
    category: 'Email marketing',
    saas_blurb: 'Mailchimp is the popular email marketing tool. OSS alternatives let you self-host and pay only for sending infrastructure (e.g. SES at ~$0.10 per 1000 emails) instead of per-subscriber.',
    picks: [
      {
        full_name: 'knadh/listmonk',
        short_name: 'Listmonk',
        curator_take: 'Listmonk is the dominant OSS email marketing tool. Newsletters, campaigns, segmentation, list management, analytics. Single Go binary + Postgres. Pair with AWS SES or Mailgun for sending. Costs ~$5/mo for 100k subscribers vs. Mailchimp\'s $300+.',
        use_this_if: 'You have 1k+ subscribers and want to escape per-subscriber pricing.',
        skip_if: 'You\'re under 500 subscribers — Mailchimp free tier is easier.',
        license: 'AGPL-3.0',
        stars_approx: 17000,
        self_hosted: true,
      },
      {
        full_name: 'keila-io/keila',
        short_name: 'Keila',
        curator_take: 'Keila is the newer, Elixir-based alternative to Listmonk. Cleaner UI, simpler setup. Smaller community but actively developed.',
        use_this_if: 'You prefer a cleaner UI and don\'t need Listmonk\'s breadth of features.',
        skip_if: 'You need a battle-tested tool with bigger community — Listmonk is more mature.',
        license: 'AGPL-3.0',
        stars_approx: 1200,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'calendly',
    saas_name: 'Calendly',
    query: 'open source alternative to calendly',
    monthly_searches: 900,
    category: 'Scheduling',
    saas_blurb: 'Calendly is the dominant scheduling tool. Open-source alternatives let you self-host, brand fully, and skip per-user pricing.',
    picks: [
      {
        full_name: 'calcom/cal.diy',
        short_name: 'Cal.com',
        curator_take: 'Cal.com is the Calendly killer. Open-source, self-host or use the cloud (free tier). All features Calendly has, plus team scheduling, workflows, payments, routing forms. Built on Next.js + Postgres. The dominant pick.',
        use_this_if: 'You want Calendly\'s functionality with full ownership and no per-user pricing.',
        skip_if: 'You only need solo scheduling and don\'t want to self-host — Cal.com\'s cloud free tier is the move.',
        license: 'AGPL-3.0',
        stars_approx: 35000,
        self_hosted: true,
      },
    ],
  },

  {
    slug: 'google-analytics',
    saas_name: 'Google Analytics',
    query: 'open source alternative to google analytics',
    monthly_searches: 4400,
    category: 'Analytics',
    saas_blurb: 'Google Analytics is free but invasive (tracks users with cookies, requires GDPR cookie banner, slows your site). OSS alternatives are privacy-first, GDPR-safe, and faster.',
    picks: [
      {
        full_name: 'plausible/analytics',
        short_name: 'Plausible',
        curator_take: 'Plausible is the privacy-first, cookie-free analytics that GDPR/DPDP-conscious sites use. 1KB script, no cookies, no consent banner needed. Self-host (free) or cloud ($9/mo). The default pick for new sites in 2026.',
        use_this_if: 'You want simple, fast, GDPR-safe analytics with no cookie banner.',
        skip_if: 'You need session replay, funnels, or product analytics — PostHog is the answer.',
        license: 'AGPL-3.0',
        stars_approx: 21500,
        self_hosted: true,
      },
      {
        full_name: 'umami-software/umami',
        short_name: 'Umami',
        curator_take: 'Umami is fully OSS Plausible — same privacy-first model, but completely free if you self-host. Slightly less polished UI but battle-tested. The pick if you want zero recurring cost.',
        use_this_if: 'You want Plausible-style analytics but fully self-hosted for free.',
        skip_if: 'You want managed cloud — Plausible\'s cloud is worth $9/mo for the convenience.',
        license: 'MIT',
        stars_approx: 26000,
        self_hosted: true,
      },
      {
        full_name: 'PostHog/posthog',
        short_name: 'PostHog',
        curator_take: 'PostHog is full product analytics — page views, funnels, retention, session replay, feature flags, A/B testing, in-app surveys, error tracking. Way more than GA. Self-host or use the very generous cloud free tier.',
        use_this_if: 'You\'re building a SaaS and need product analytics (not just marketing site stats).',
        skip_if: 'You only need page-view counting — PostHog is overkill.',
        license: 'MIT',
        stars_approx: 23000,
        self_hosted: true,
      },
    ],
  },
];

export function getAlternativePageBySlug(slug: string): AlternativePage | undefined {
  return ALTERNATIVES.find((a) => a.slug === slug);
}

export function getAllAlternativeSlugs(): string[] {
  return ALTERNATIVES.map((a) => a.slug);
}
