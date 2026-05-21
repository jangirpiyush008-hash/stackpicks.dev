/**
 * Skill tracks — toolkits for specific roles/disciplines.
 * Unlike bundles (build a product), skills are personal arsenals
 * (tools YOU use to do marketing / sales / video / etc.).
 *
 * Each track shows the first 6 repos free; the rest are paywalled.
 */

export interface SkillRepo {
  full_name: string;
  why: string;             // 1-line "why a marketer/SDR/creator uses this"
  subcategory: string;     // grouping inside the track
}

export interface SkillTrack {
  slug: string;
  title: string;
  pitch: string;
  description: string;
  icon: string;            // lucide icon name
  gradient: string;        // tailwind gradient
  audience: string;        // who this is for
  repos: SkillRepo[];
  keywords: string[];
}

export const SKILL_TRACKS: SkillTrack[] = [
  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'marketing',
    title: 'Marketing Skills',
    pitch: 'The marketer\'s open-source toolkit — own your stack, not vendor invoices.',
    description:
      'Email, analytics, A/B testing, content publishing, lead capture — the boring middleware every marketer needs. Self-host the parts that matter, pay only for the rest.',
    icon: 'megaphone',
    gradient: 'from-pink-500/50 via-rose-400/30 to-amber-400/20',
    audience: 'Solo marketers, founders, growth engineers',
    keywords: ['marketing', 'email', 'analytics', 'content', 'cms', 'lead-gen'],
    repos: [
      { full_name: 'knadh/listmonk',           subcategory: 'Email & newsletters',  why: 'Self-hosted newsletter platform. Single Go binary on a ₹500 VPS sends 10k emails/day.' },
      { full_name: 'plausible/analytics',      subcategory: 'Analytics',            why: 'Privacy-first page-view analytics. Cookie-free, GDPR-safe out of the box.' },
      { full_name: 'PostHog/posthog',          subcategory: 'Analytics',            why: 'Funnels + session replay + feature flags. Self-host or use cloud.' },
      { full_name: 'umami-software/umami',     subcategory: 'Analytics',            why: 'Plausible alternative — self-host on the same VPS as Listmonk for ₹0 marginal cost.' },
      { full_name: 'mautic/mautic',            subcategory: 'Marketing automation', why: 'Self-hosted drip campaigns + lead scoring. HubSpot alternative if you own your data.' },
      { full_name: 'formbricks/formbricks',    subcategory: 'Forms & surveys',      why: 'Open-source Typeform — embed surveys, collect NPS, micro-feedback on any page.' },
      { full_name: 'TryGhost/Ghost',           subcategory: 'Content + memberships', why: 'Newsletter + blog + paid membership. The Substack alternative most pros use.' },
      { full_name: 'payloadcms/payload',       subcategory: 'CMS',                  why: 'Modern TS-native CMS for landing + blog content. Editors love it, devs control it.' },
      { full_name: 'directus/directus',        subcategory: 'CMS',                  why: 'Postgres-backed headless CMS with a friendly admin UI for non-devs.' },
      { full_name: 'growthbook/growthbook',    subcategory: 'A/B testing',          why: 'Open-source A/B testing — own your experiments instead of paying Optimizely.' },
      { full_name: 'Unleash/unleash',          subcategory: 'Feature flags',        why: 'Feature flag platform. Roll out tests gradually. Used by enterprise + startups.' },
      { full_name: 'novuhq/novu',              subcategory: 'Notifications',        why: 'Multi-channel notifications — email, push, SMS, in-app — through one API.' },
      { full_name: 'maizzle/maizzle',          subcategory: 'Email design',         why: 'Tailwind for transactional email. Design with utility classes, ship MJML output.' },
      { full_name: 'resend/react-email',       subcategory: 'Email components',     why: 'Author transactional emails in React. Pair with Resend cloud or self-host the renderer.' },
      { full_name: 'meilisearch/meilisearch',  subcategory: 'On-site search',       why: 'Typo-tolerant search for your blog / docs. ms-level response, free self-host.' },
      { full_name: 'rocketseat/rocketsearch',  subcategory: 'SEO',                  why: 'Internal-link suggestion tool for SEO content. Niche but solid.' },
      { full_name: 'medusajs/medusa',          subcategory: 'Commerce',             why: 'If your marketing is for an e-commerce brand: headless commerce you actually own.' },
      { full_name: 'pirsch-analytics/pirsch',  subcategory: 'Analytics (Go-native)',why: 'Faster + lighter than Plausible. Single Go binary, similar privacy posture.' },
      { full_name: 'metabase/metabase',        subcategory: 'Marketing reporting',  why: 'Build dashboards for your CMO/board in 30 minutes. Connects to Postgres directly.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'sales-outreach',
    title: 'Sales & Outreach Skills',
    pitch: 'The SDR\'s OSS arsenal — CRM, scheduling, sequencing, lead capture.',
    description:
      'Replace HubSpot/Pipedrive/Calendly with open-source tools you own. Built for solo founders and bootstrapped sales teams who don\'t want to pay $80/seat/month.',
    icon: 'handshake',
    gradient: 'from-orange-500/50 via-red-500/30 to-pink-500/20',
    audience: 'Founders, SDRs, AEs, bootstrapped sales teams',
    keywords: ['sales', 'crm', 'outreach', 'scheduling', 'leads', 'pipeline'],
    repos: [
      { full_name: 'twentyhq/twenty',          subcategory: 'CRM',              why: 'Modern open-source CRM. Salesforce/HubSpot alternative built in TS. Hot in 2025.' },
      { full_name: 'frappe/erpnext',           subcategory: 'CRM + ERP',        why: 'Full ERP if you want CRM + inventory + invoicing under one roof.' },
      { full_name: 'civicrm/civicrm',          subcategory: 'CRM',              why: 'Mature CRM, especially good for non-profits and member-driven businesses.' },
      { full_name: 'calcom/cal.com',           subcategory: 'Scheduling',       why: 'Open-source Calendly. Self-host, white-label, embed in your site.' },
      { full_name: 'chatwoot/chatwoot',        subcategory: 'Live chat',        why: 'Intercom alternative — live chat, helpdesk, lead capture all in one.' },
      { full_name: 'formbricks/formbricks',    subcategory: 'Lead capture',     why: 'Embed lead forms anywhere. Conditional logic, integrations, your data.' },
      { full_name: 'knadh/listmonk',           subcategory: 'Cold email',       why: 'Run cold outreach sequences from your own infra. Comply with anti-spam law.' },
      { full_name: 'inngest/inngest',          subcategory: 'Sequence runner',  why: 'Schedule + retry cold-email cadences reliably. Better than CRON jobs.' },
      { full_name: 'twilio/twilio-node',       subcategory: 'Voice + SMS',      why: 'Click-to-call, SMS sequences, voicemail drop. The dial-tone of sales tooling.' },
      { full_name: 'clauderic/dnd-kit',        subcategory: 'Pipeline UI',      why: 'Build your own kanban pipeline. Smoother than HubSpot\'s drag-and-drop.' },
      { full_name: 'mautic/mautic',            subcategory: 'Marketing × sales', why: 'Lead scoring + nurture sequences before handing off to your CRM.' },
      { full_name: 'resend/react-email',       subcategory: 'Email templates',  why: 'Branded sales emails authored in React. Looks like a human wrote them.' },
      { full_name: 'PostHog/posthog',          subcategory: 'Product-led sales',why: 'Detect which trial users are activated → trigger sales outreach automatically.' },
      { full_name: 'metabase/metabase',        subcategory: 'Sales reporting',  why: 'Pipeline dashboards, win-rate charts, MRR breakdowns — built in an afternoon.' },
      { full_name: 'documenso/documenso',      subcategory: 'Contracts',        why: 'Open-source DocuSign. Send + sign contracts from your own infra.' },
      { full_name: 'react-hook-form/react-hook-form', subcategory: 'Lead forms', why: 'Best React form library — public lead-gen forms with zero magic.' },
      { full_name: 'colinhacks/zod',           subcategory: 'Lead validation',  why: 'Validate lead email + phone server-side before saving. Catches bots early.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'social-media',
    title: 'Social Media & Instagram',
    pitch: 'Scheduling, video, image, captions — the creator\'s OSS toolkit.',
    description:
      'The tools real content creators use behind the scenes: scheduling across platforms, video editing, AI image/video, transcription, image manipulation. All open-source so your content isn\'t hostage to one vendor.',
    icon: 'instagram',
    gradient: 'from-fuchsia-500/50 via-pink-400/30 to-orange-400/20',
    audience: 'Creators, IG growth marketers, video editors',
    keywords: ['social', 'instagram', 'reels', 'video', 'captions', 'creator'],
    repos: [
      { full_name: 'gitroomhq/postiz-app',     subcategory: 'Multi-platform scheduler', why: 'Buffer / Hootsuite alternative — schedule to IG, X, LinkedIn, TikTok, YT. Self-host.' },
      { full_name: 'inovua-systems/mixpost',   subcategory: 'Scheduler',                 why: 'PHP-based scheduler. Lighter than Postiz, good for small creators.' },
      { full_name: 'openai/whisper',           subcategory: 'Transcription',             why: 'Transcribe Reels/podcasts/YT in 99 languages. Pair with caption tools for shorts.' },
      { full_name: 'ggerganov/whisper.cpp',    subcategory: 'Transcription (fast)',      why: 'C++ port of Whisper — runs 10x faster on your laptop, no Python needed.' },
      { full_name: 'm-bain/whisperX',          subcategory: 'Word-level subtitles',      why: 'Whisper + word-level timestamps + speaker diarization. Mandatory for shorts captions.' },
      { full_name: 'FFmpeg/FFmpeg',            subcategory: 'Video editing',             why: 'Cut, merge, transcode, watermark, subtitle. Every video tool calls FFmpeg under the hood.' },
      { full_name: 'KDE/krita',                subcategory: 'Image editing',             why: 'Open-source Photoshop for IG carousels + thumbnails. Brush engine is best-in-class.' },
      { full_name: 'GNOME/gimp',               subcategory: 'Image editing',             why: 'The classic free Photoshop alternative. Lighter than Krita for quick edits.' },
      { full_name: 'instaloader/instaloader', subcategory: 'IG analytics + scraping',    why: 'Download IG posts/Stories/Reels by username. Audit competitors, archive your own content.' },
      { full_name: 'subzeroid/instagrapi',     subcategory: 'IG private API',            why: 'Programmatic IG actions — likes, follows, DMs, post — for automation (use carefully).' },
      { full_name: 'comfyanonymous/ComfyUI',   subcategory: 'AI image generation',       why: 'Stable Diffusion + Flux workflow editor. Generate IG-ready visuals in minutes.' },
      { full_name: 'lllyasviel/Fooocus',       subcategory: 'AI image generation',       why: 'Easier than ComfyUI for posters / IG quote cards. One-click image quality.' },
      { full_name: 'AUTOMATIC1111/stable-diffusion-webui', subcategory: 'AI image gen',  why: 'The classic web UI for Stable Diffusion. Tons of plugins for creator workflows.' },
      { full_name: 'OpenTalker/SadTalker',     subcategory: 'Talking-face video',        why: 'Animate a photo to lip-sync audio. Cheap HeyGen alternative for shorts.' },
      { full_name: 'Wav2Lip/Wav2Lip',          subcategory: 'Lip sync',                  why: 'Make existing video footage lip-sync new audio (for dubs + localised content).' },
      { full_name: 'excalidraw/excalidraw',    subcategory: 'IG carousel design',        why: 'Sketch-style IG carousels — that hand-drawn aesthetic that goes viral.' },
      { full_name: 'jgraph/drawio',            subcategory: 'Diagrams for posts',        why: 'Clean diagrams for LinkedIn/IG infographic posts. Free, no watermark.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'linkedin-personal-brand',
    title: 'LinkedIn & Personal Brand',
    pitch: 'Long-form writing, blog hosting, podcast tools, content distribution.',
    description:
      'The toolkit for builders who post to grow. Blog, newsletter, podcast, repurpose, schedule — all self-controllable. Less brand risk, more leverage.',
    icon: 'pen-line',
    gradient: 'from-blue-500/50 via-indigo-500/30 to-violet-500/20',
    audience: 'Indie founders, devs growing in public, consultants',
    keywords: ['linkedin', 'personal brand', 'blog', 'newsletter', 'content', 'podcast'],
    repos: [
      { full_name: 'gitroomhq/postiz-app',  subcategory: 'Cross-poster',         why: 'Write once, post to LinkedIn + X + threads. Cuts your distribution time by 5x.' },
      { full_name: 'TryGhost/Ghost',         subcategory: 'Blog + newsletter',    why: 'Your owned home — newsletter + blog + paid membership in one self-hostable tool.' },
      { full_name: 'withastro/astro',        subcategory: 'Marketing site',       why: 'Static-first site for your personal brand. 100/100 Lighthouse, instant ranking.' },
      { full_name: 'shuding/nextra',         subcategory: 'Docs/blog (Next.js)',  why: 'Beautiful Next.js docs + blog framework. The pgpdoc-style site in a weekend.' },
      { full_name: 'getzola/zola',           subcategory: 'Static site',          why: 'Single-binary Rust static site generator. Faster than Hugo, simpler than Astro.' },
      { full_name: 'openai/whisper',         subcategory: 'Podcast transcription',why: 'Turn podcast audio into a blog post. Massive SEO + repurposing leverage.' },
      { full_name: 'audacity/audacity',      subcategory: 'Podcast editing',      why: 'Free podcast audio editor. Cut, normalize, denoise, export.' },
      { full_name: 'ardour/ardour',          subcategory: 'Pro podcast editing',  why: 'Pro-grade DAW for serious podcasters. Free, no subscription. Mac/Win/Linux.' },
      { full_name: 'orgs/typst',             subcategory: 'Writing engine',       why: 'LaTeX alternative — write reports, slides, articles with modern syntax.' },
      { full_name: 'jgm/pandoc',             subcategory: 'Format conversion',    why: 'Convert between Markdown, Word, PDF, EPUB, HTML. The universal writer\'s tool.' },
      { full_name: 'logseq/logseq',          subcategory: 'Note-taking + drafts', why: 'Open-source Roam/Notion for personal knowledge + content drafts.' },
      { full_name: 'siyuan-note/siyuan',     subcategory: 'Note-taking',          why: 'Block-based personal KB with paid sync (own your data, sync optional).' },
      { full_name: 'AppFlowy-IO/AppFlowy',   subcategory: 'Notion alternative',   why: 'Modern Notion alternative. Pages, docs, tables — all self-hostable.' },
      { full_name: 'plausible/analytics',    subcategory: 'Blog analytics',       why: 'Privacy-first analytics for your personal site. No cookies, no banner needed.' },
      { full_name: 'getumbrel/llama-gpt',    subcategory: 'AI drafting',          why: 'Run a local ChatGPT for drafting LinkedIn posts. Privacy + no API costs.' },
      { full_name: 'open-webui/open-webui',  subcategory: 'AI writing UI',        why: 'Frontend for Ollama / local LLMs. Cleaner UI for content drafting.' },
      { full_name: 'rocketseat/rocketseat',  subcategory: 'Personal docs',        why: 'Inspiration for documenting your personal brand journey + courses.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'ai-ml',
    title: 'AI & ML Engineering',
    pitch: 'Local LLMs, agent frameworks, fine-tuning, RAG, vector search — the 2026 default kit.',
    description:
      'Tools the practising AI engineer reaches for daily. Run models locally, build agents, fine-tune on your data, observe LLM calls, ship to production.',
    icon: 'brain',
    gradient: 'from-emerald-400/50 via-cyan-500/30 to-blue-500/20',
    audience: 'AI engineers, ML researchers, agent builders',
    keywords: ['ai', 'ml', 'llm', 'rag', 'agent', 'embeddings'],
    repos: [
      { full_name: 'ollama/ollama',                  subcategory: 'Local LLM runtime', why: 'Run Llama 3, Qwen, Mistral on your laptop. One curl install. The default in 2026.' },
      { full_name: 'open-webui/open-webui',          subcategory: 'Local ChatGPT UI',  why: 'ChatGPT clone for your Ollama. Plugins, RAG, multi-model. Self-host in a Docker.' },
      { full_name: 'ggerganov/llama.cpp',            subcategory: 'LLM inference',     why: 'C++ inference for Llama-family models. Runs on CPU + Apple Silicon at speed.' },
      { full_name: 'vllm-project/vllm',              subcategory: 'Production serving',why: 'High-throughput LLM serving. PagedAttention makes it 10x faster than HF Transformers.' },
      { full_name: 'huggingface/transformers',       subcategory: 'Model library',     why: 'The transformers library — 100k+ models, classic Python API. Mandatory in ML.' },
      { full_name: 'langchain-ai/langchain',         subcategory: 'Agent framework',   why: 'Chains, agents, tools, retrievers. Verbose but ubiquitous — every recruiter recognises it.' },
      { full_name: 'run-llama/llama_index',          subcategory: 'RAG framework',     why: 'Better than Langchain for pure RAG. Indexes, query engines, retrievers all first-class.' },
      { full_name: 'crewAIInc/crewAI',               subcategory: 'Multi-agent',       why: 'Orchestrate multiple AI agents with roles + tasks. Hottest framework in late 2024.' },
      { full_name: 'pydantic/pydantic-ai',           subcategory: 'Typed agent',       why: 'Type-safe Python agents. Smaller surface area than Langchain, easier to maintain.' },
      { full_name: 'pgvector/pgvector',              subcategory: 'Vector storage',    why: 'Postgres extension for vectors. If you have Postgres, you don\'t need Pinecone.' },
      { full_name: 'chroma-core/chroma',             subcategory: 'Vector storage',    why: 'Embedded vector DB — easiest first vector DB for prototypes.' },
      { full_name: 'qdrant/qdrant',                  subcategory: 'Vector storage',    why: 'Rust-based vector DB. Production-grade alternative to Pinecone, self-hostable.' },
      { full_name: 'weaviate/weaviate',              subcategory: 'Vector storage',    why: 'Hybrid search (vector + keyword) out of the box. Module-rich pipelines.' },
      { full_name: 'mendableai/firecrawl',           subcategory: 'Data ingestion',    why: 'Scrape websites into LLM-ready markdown. The data engine for RAG.' },
      { full_name: 'unclecode/crawl4ai',             subcategory: 'Data ingestion',    why: 'Python alt with embedded LLM extraction. Strong schema-typed output.' },
      { full_name: 'langfuse/langfuse',              subcategory: 'Observability',     why: 'Trace LLM calls, monitor costs, debug prompts. The Sentry for AI apps.' },
      { full_name: 'Helicone/helicone',              subcategory: 'Observability',     why: 'Drop-in proxy — log every OpenAI call without code changes.' },
      { full_name: 'axolotl-ai-cloud/axolotl',       subcategory: 'Fine-tuning',       why: 'YAML-driven fine-tuning. The friendliest way to train a custom LLM on your data.' },
      { full_name: 'vercel/ai',                      subcategory: 'AI SDK',            why: 'Stream LLM responses in React. Drop-in chat UI components.' },
      { full_name: 'OpenInterpreter/open-interpreter', subcategory: 'Agent on your PC', why: 'ChatGPT that runs code on your laptop. Dangerous but powerful — control your machine via natural language.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'data-analytics',
    title: 'Data & Analytics',
    pitch: 'BI dashboards, OLAP DBs, dataframes, ETL — the data team\'s OSS stack.',
    description:
      'What modern data teams (or solo data-curious founders) actually use. Replace Tableau + Snowflake + Fivetran with open-source equivalents that scale to billions of rows.',
    icon: 'bar-chart-3',
    gradient: 'from-yellow-400/50 via-amber-500/30 to-orange-500/20',
    audience: 'Data engineers, analysts, founders running BI themselves',
    keywords: ['data', 'analytics', 'bi', 'sql', 'dashboards', 'etl'],
    repos: [
      { full_name: 'metabase/metabase',          subcategory: 'BI dashboards',    why: 'Easiest open-source BI tool. Connect to Postgres, build dashboards in 30 min.' },
      { full_name: 'apache/superset',            subcategory: 'BI dashboards',    why: 'Heavier Metabase alternative used at Airbnb/Lyft. More dashboarding power.' },
      { full_name: 'lightdash/lightdash',        subcategory: 'BI on dbt',        why: 'Modern BI built on top of dbt models. Great for analytics engineering teams.' },
      { full_name: 'evidence-dev/evidence',      subcategory: 'Code-first reports',why: 'Reports written in Markdown + SQL. Git-friendly, no clicking through admin UIs.' },
      { full_name: 'duckdb/duckdb',              subcategory: 'OLAP DB',          why: 'In-process columnar DB. SQLite for analytics — query Parquet files instantly.' },
      { full_name: 'ClickHouse/ClickHouse',      subcategory: 'OLAP DB',          why: 'Production-grade columnar DB. Powers ad-tech, observability — fast on billions of rows.' },
      { full_name: 'pola-rs/polars',             subcategory: 'Dataframes',       why: 'Rust-powered Pandas alternative. 10-100x faster on real-world workloads.' },
      { full_name: 'pandas-dev/pandas',          subcategory: 'Dataframes',       why: 'The Python data classic. Slower than Polars but every tutorial uses it.' },
      { full_name: 'dbt-labs/dbt-core',          subcategory: 'Transformations',  why: 'SQL-based data transformations + lineage. The modern data stack default.' },
      { full_name: 'dagster-io/dagster',         subcategory: 'Orchestration',    why: 'Modern data orchestration with type-safe assets. The Airflow-killer for new builds.' },
      { full_name: 'PrefectHQ/prefect',          subcategory: 'Orchestration',    why: 'Python-native workflow orchestration. Cleaner DX than Airflow.' },
      { full_name: 'apache/airflow',             subcategory: 'Orchestration',    why: 'The classic. Still dominant in enterprise. Heavy but battle-tested.' },
      { full_name: 'airbytehq/airbyte',          subcategory: 'ELT',              why: 'Fivetran alternative — 300+ source connectors. Replace expensive ELT SaaS.' },
      { full_name: 'jupyter/jupyter',            subcategory: 'Notebooks',        why: 'The standard Python notebook. Used by every data scientist ever.' },
      { full_name: 'marimo-team/marimo',         subcategory: 'Reactive notebooks',why: 'Reactive Jupyter — cells update automatically. The modern notebook successor.' },
      { full_name: 'streamlit/streamlit',        subcategory: 'Data apps',        why: 'Build internal data apps in pure Python. Show stakeholders results, not screenshots.' },
      { full_name: 'gradio-app/gradio',          subcategory: 'ML demos',         why: 'Streamlit alternative — used by HuggingFace + every ML demo on the internet.' },
      { full_name: 'apache/arrow',               subcategory: 'In-memory format', why: 'Columnar in-memory standard. Polars / DuckDB / pandas 2.0 all use it underneath.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'devops-infra',
    title: 'DevOps & Self-Hosting',
    pitch: 'Deploy your own apps without paying Vercel — the indie sysadmin\'s OSS toolkit.',
    description:
      'Take back hosting costs. Deploy production-grade apps on a ₹500/mo VPS using open-source tooling that rivals Heroku/Render/Vercel for serious workloads.',
    icon: 'cloud',
    gradient: 'from-violet-500/50 via-indigo-500/30 to-blue-500/20',
    audience: 'Indie devs, self-hosters, infra-curious founders',
    keywords: ['devops', 'self-host', 'docker', 'deploy', 'observability'],
    repos: [
      { full_name: 'coollabsio/coolify',     subcategory: 'PaaS (self-host Heroku)', why: 'Heroku/Vercel alternative you self-host. One-click deploy GitHub repos.' },
      { full_name: 'caprover/caprover',      subcategory: 'PaaS',                     why: 'Lighter Coolify alternative. Easier to install, great for solo devs.' },
      { full_name: 'dokku/dokku',            subcategory: 'PaaS',                     why: 'The OG mini-Heroku. Single VPS, git push deploy. Battle-tested for 10+ years.' },
      { full_name: 'caddyserver/caddy',      subcategory: 'Web server',               why: 'Auto-HTTPS web server. Replaces nginx + Certbot with one binary + 5-line config.' },
      { full_name: 'traefik/traefik',        subcategory: 'Reverse proxy',            why: 'Container-aware reverse proxy with auto-discovery. Mandatory for Docker deployments.' },
      { full_name: 'docker/compose',         subcategory: 'Containers',               why: 'Multi-container orchestration on a single host. Where every self-host journey starts.' },
      { full_name: 'k3s-io/k3s',             subcategory: 'Lightweight Kubernetes',   why: 'Production Kubernetes that fits on a Raspberry Pi. The serious self-host path.' },
      { full_name: 'portainer/portainer',    subcategory: 'Docker UI',                why: 'Web UI for managing Docker + Kubernetes. Easier than the CLI for occasional ops.' },
      { full_name: 'louislam/uptime-kuma',   subcategory: 'Monitoring',               why: 'Self-hosted uptime monitor. Pings your services + Slack/Discord/Telegram alerts.' },
      { full_name: 'grafana/grafana',        subcategory: 'Observability dashboards', why: 'Dashboards for metrics + logs + traces. The visualization standard.' },
      { full_name: 'prometheus/prometheus',  subcategory: 'Metrics',                   why: 'Time-series DB + metrics scraper. The metrics half of modern observability.' },
      { full_name: 'grafana/loki',           subcategory: 'Logs',                      why: 'Log aggregation with Grafana queries. Way cheaper than Datadog or Sumo.' },
      { full_name: 'getsentry/sentry',       subcategory: 'Error tracking',            why: 'Self-host Sentry for error monitoring. The Bugsnag/Rollbar alternative.' },
      { full_name: 'OpenTofu/opentofu',      subcategory: 'IaC',                       why: 'Terraform fork (open source, OpenTF Foundation). Manage infra as code.' },
      { full_name: 'hashicorp/nomad',        subcategory: 'Orchestrator',              why: 'Lighter than Kubernetes for non-K8s workloads. HashiCorp\'s scheduler.' },
      { full_name: 'restic/restic',          subcategory: 'Backups',                   why: 'Encrypted, deduplicated backups to any S3-compatible store. The CLI you trust your data with.' },
      { full_name: 'kopia/kopia',            subcategory: 'Backups',                   why: 'Restic alternative with a GUI. For backup workflows you set and forget.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'automation',
    title: 'Automation & No-Code',
    pitch: 'Connect APIs, automate workflows, run cron jobs — the IFTTT alternative.',
    description:
      'Open-source automation platforms. Self-host Zapier/Make/n8n-style workflows. The arsenal of a solo operator running multiple side projects.',
    icon: 'workflow',
    gradient: 'from-cyan-400/50 via-teal-500/30 to-emerald-500/20',
    audience: 'Solo operators, no-code builders, ops engineers',
    keywords: ['automation', 'workflow', 'zapier', 'cron', 'webhooks'],
    repos: [
      { full_name: 'n8n-io/n8n',                  subcategory: 'Workflow builder', why: 'Self-hosted Zapier. 600+ integrations, visual workflow editor. The default.' },
      { full_name: 'activepieces/activepieces',   subcategory: 'Workflow builder', why: 'Modern n8n alternative — friendlier UI, AI-built pieces, TypeScript-native.' },
      { full_name: 'huginn/huginn',               subcategory: 'Workflow builder', why: 'OG IFTTT alternative. Ruby-based, deeply hackable for agents that watch the web.' },
      { full_name: 'windmill-labs/windmill',      subcategory: 'Workflow engine',  why: 'Run Python/TypeScript scripts as cron jobs + UI forms. Production-grade.' },
      { full_name: 'kestra-io/kestra',            subcategory: 'Workflow engine',  why: 'YAML-driven orchestration with a polished UI. Better for declarative pipelines.' },
      { full_name: 'inngest/inngest',             subcategory: 'Background jobs',  why: 'Modern job runner — durable execution, fan-out, scheduled jobs as TS functions.' },
      { full_name: 'triggerdotdev/trigger.dev',   subcategory: 'Background jobs',  why: 'Background jobs as TS functions. Self-host or use their cloud.' },
      { full_name: 'taskforcesh/bullmq',          subcategory: 'Queue',            why: 'Redis-based queue for Node. Battle-tested at scale, simpler than full job runners.' },
      { full_name: 'graphile/worker',             subcategory: 'PG queue',         why: 'Job queue inside Postgres. No Redis to operate. Great for solo founders.' },
      { full_name: 'timgit/pg-boss',              subcategory: 'PG queue',         why: 'Alternative Postgres queue with retry + scheduling semantics.' },
      { full_name: 'temporalio/temporal',         subcategory: 'Durable workflows', why: 'Long-running workflows with state machines. Heavy but bulletproof at scale.' },
      { full_name: 'apache/airflow',              subcategory: 'Pipeline',         why: 'Classic Python DAG-based pipeline tool. Still dominant in data orchestration.' },
      { full_name: 'PrefectHQ/prefect',           subcategory: 'Pipeline',         why: 'Modern alternative to Airflow with cleaner DX.' },
      { full_name: 'dagster-io/dagster',          subcategory: 'Pipeline',         why: 'Data-asset-first orchestration. Type-safe + observability built in.' },
      { full_name: 'novuhq/novu',                 subcategory: 'Notification',     why: 'Trigger emails/SMS/push from your automations through one API.' },
      { full_name: 'twilio/twilio-node',          subcategory: 'SMS/voice',        why: 'Programmable phone — text yourself when a workflow alerts.' },
      { full_name: 'slackapi/node-slack-sdk',     subcategory: 'Notification',     why: 'Post automation results to your Slack. The team-comms half of automations.' },
    ],
  },
];

export function getSkillTrackBySlug(slug: string): SkillTrack | undefined {
  return SKILL_TRACKS.find((s) => s.slug === slug);
}
