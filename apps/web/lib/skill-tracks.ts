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
      { full_name: 'medusajs/medusa',          subcategory: 'Commerce',             why: 'If your marketing is for an e-commerce brand: headless commerce you actually own.' },
      { full_name: 'metabase/metabase',        subcategory: 'Marketing reporting',  why: 'Build dashboards for your CMO/board in 30 minutes. Connects to Postgres directly.' },
      { full_name: 'usefathom/fathom-analytics',subcategory: 'Privacy analytics',    why: 'Privacy-first alternative to Plausible/Umami. Cleaner UI, faster JS payload.' },
      { full_name: 'rallly/rallly',            subcategory: 'Scheduling polls',     why: 'When2Meet replacement — find a time across team for content shoots, sponsor calls.' },
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
      { full_name: 'e2b-dev/E2B',                    subcategory: 'Code sandbox',     why: 'Sandboxed code execution for AI agents. The 2026 default for "AI runs code" workflows.' },
      { full_name: 'lobehub/lobe-chat',              subcategory: 'Premium LLM UI',   why: 'Beautiful, polished ChatGPT clone with plugins, agents, knowledge base.' },
      { full_name: 'Mintplex-Labs/anything-llm',     subcategory: 'RAG app builder',  why: 'No-code RAG app builder. Upload docs, chat with them. 1k+ stars/week.' },
      { full_name: 'cline/cline',                    subcategory: 'AI coding agent',  why: 'VS Code extension that codes for you. The OSS Cursor alternative — exploded 2024.' },
      { full_name: 'block/goose',                    subcategory: 'Local AI agent',   why: 'Open-source on-machine AI agent from Block. Free Claude Code alternative.' },
      { full_name: 'OpenInterpreter/open-interpreter', subcategory: 'Agent on your PC', why: 'ChatGPT that runs code on your laptop. Older but still useful for personal use.' },
      { full_name: 'Aider-AI/aider',                 subcategory: 'AI coding (CLI)',    why: 'Terminal AI pair programmer. Works with any LLM. Git-native — every edit becomes a commit.' },
      { full_name: 'stanfordnlp/dspy',               subcategory: 'Prompt programming', why: 'Stanford framework — program LLMs, don\'t prompt them. Optimises prompts automatically.' },
      { full_name: 'mastra-ai/mastra',               subcategory: 'JS agent framework', why: 'TypeScript-native AI framework — agents, workflows, memory, RAG, evals all in TS.' },
      { full_name: 'BerriAI/litellm',                subcategory: 'LLM proxy',          why: 'One SDK for 100+ LLM providers. Cost tracking + rate limits + caching built in.' },
      { full_name: 'comfyanonymous/ComfyUI',         subcategory: 'AI image gen',       why: 'Node-based Stable Diffusion. Industry standard for serious AI image work.' },
      { full_name: 'black-forest-labs/flux',         subcategory: 'AI image gen',       why: 'Midjourney-quality image model, open weights. Hottest model release of 2024.' },
      { full_name: 'pipecat-ai/pipecat',             subcategory: 'Voice AI',           why: 'Open-source voice AI orchestration. Build phone agents + voice assistants.' },
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
      { full_name: 'tobymao/sqlglot',            subcategory: 'SQL toolkit',      why: 'Parse/transpile SQL across 20+ dialects. Hot in 2025 for data engineering tooling.' },
      { full_name: 'mode-analytics/dbt-rpc',     subcategory: 'dbt server',      why: 'Spin dbt up as a server. Useful when your dbt graph gets serious.' },
      { full_name: 'turbot/steampipe',           subcategory: 'SQL over APIs',    why: 'Query AWS / GCP / GitHub etc. with SQL. Wild for security + ops teams.' },
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
      { full_name: 'Dokploy/dokploy',        subcategory: 'PaaS (new 2025)',           why: 'Newer Coolify alternative. Cleaner UI, better Docker Compose support.' },
      { full_name: 'beszel-co/beszel',       subcategory: 'Server monitoring',         why: 'Lightweight server monitoring + Docker stats. The Uptime Kuma sibling.' },
      { full_name: 'henrygd/beszel',         subcategory: 'Server monitoring',         why: 'Same as above — listed under maintainer for searchability.' },
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
      { full_name: 'ToolJet/ToolJet',             subcategory: 'No-code internal apps', why: 'Open-source Retool. Build internal admin apps with drag-and-drop + JS.' },
      { full_name: 'appsmithorg/appsmith',        subcategory: 'No-code internal apps', why: 'Retool/ToolJet alternative. Polished UI, deep integrations, used by Twitter.' },
      { full_name: 'illa-family/illa-builder',    subcategory: 'No-code AI apps',  why: 'Newer ToolJet — AI-first builder. Drag-drop LLM workflows next to forms.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // NEW TRACK — Design Skills
  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'design',
    title: 'Design & Visual Skills',
    pitch: 'Figma alternatives, illustration tools, 3D, icon libraries — the modern designer\'s OSS arsenal.',
    description:
      'Tools real designers use in 2026 — from Figma alternatives that don\'t lock your file to vector + raster + 3D + icon libraries. Most are free; pro features cost nothing more than your time to learn them.',
    icon: 'palette',
    gradient: 'from-fuchsia-500/50 via-purple-500/30 to-indigo-500/20',
    audience: 'UI/UX designers, brand designers, illustrators, dev-designers',
    keywords: ['design', 'ui', 'figma', 'illustration', 'icons', '3d'],
    repos: [
      { full_name: 'penpot/penpot',                subcategory: 'Figma alternative',  why: 'Self-hostable Figma. The serious OSS design tool — used by orgs that don\'t want vendor lock.' },
      { full_name: 'excalidraw/excalidraw',        subcategory: 'Sketching',          why: 'Hand-drawn whiteboarding. Best for wireframes, IG carousels, conference talk visuals.' },
      { full_name: 'tldraw/tldraw',                subcategory: 'Whiteboard',         why: 'Modern Excalidraw alternative. More polished, embeddable as a library.' },
      { full_name: 'KDE/krita',                    subcategory: 'Digital painting',   why: 'Best-in-class brush engine. The free Photoshop for digital artists.' },
      { full_name: 'GNOME/gimp',                   subcategory: 'Raster editor',      why: 'Free Photoshop alternative. Lighter than Krita for quick edits + screenshots.' },
      { full_name: 'inkscape/inkscape',            subcategory: 'Vector editor',      why: 'Free Adobe Illustrator. Used by logo designers + technical illustrators worldwide.' },
      { full_name: 'blender/blender',              subcategory: '3D + motion',        why: 'Free 3D suite that rivals Maya/Cinema 4D. Powers Pixar-quality shorts on YouTube.' },
      { full_name: 'lucide-icons/lucide',          subcategory: 'Icon library',       why: '1500+ icons, tree-shakable, fits any aesthetic. The 2026 default for new projects.' },
      { full_name: 'tabler/tabler-icons',          subcategory: 'Icon library',       why: '4500+ icons, more variation than Lucide. Pair with shadcn for dashboards.' },
      { full_name: 'phosphor-icons/core',          subcategory: 'Icon library',       why: 'Multi-weight icons (thin, regular, bold, fill). Great for brand systems.' },
      { full_name: 'meodai/poline',                subcategory: 'Color systems',      why: 'Generate color palettes by interpolating along curves. The 2024 darling tool.' },
      { full_name: 'shadcn-ui/ui',                 subcategory: 'UI components',      why: 'Copy-paste design system primitives. Where the design world is gravitating in 2026.' },
      { full_name: 'magicuidesign/magicui',        subcategory: 'Animated components',why: 'Beautiful animated React components. Drop in for marketing sites.' },
      { full_name: 'codingstella/aceternity-ui',   subcategory: 'UI animations',      why: 'Aceternity UI — viral on Twitter for stunning hero animations.' },
      { full_name: 'fonts-foundry/fontsource',     subcategory: 'Fonts',              why: 'Self-host Google Fonts via npm. No third-party requests, faster Lighthouse.' },
      { full_name: 'thumbhash/thumbhash',          subcategory: 'Image placeholders', why: 'Tiny image placeholders better than BlurHash. ~30 bytes per image.' },
      { full_name: 'lovell/sharp',                 subcategory: 'Image processing',   why: 'The Node image library. Resize, format-convert, optimise — under every CMS.' },
      { full_name: 'mozilla/pdf.js',               subcategory: 'PDF viewer/render',  why: 'Embed PDFs in your site without iframes. Mozilla\'s mature library.' },
      { full_name: 'photopea/photopea',            subcategory: 'Photoshop in browser', why: 'Full PSD support. Photoshop in your browser, free. Used by millions of designers.' },
      { full_name: 'DavidHDev/react-bits',         subcategory: 'Animated components', why: 'Aceternity-style animated React components. Premium look for landing pages.' },
      { full_name: 'origin-space/origin-ui',       subcategory: 'UI components',       why: 'shadcn-style components with 300+ pieces. Most-loved new UI library of 2026.' },
      { full_name: 'saadeghi/daisyui',             subcategory: 'Tailwind UI',         why: 'Tailwind component classes — no JS. Add `btn btn-primary` and you have a button.' },
      { full_name: 'mrdoob/three.js',              subcategory: '3D for web',          why: 'The 3D library powering most browser 3D experiences. 105k stars.' },
      { full_name: 'pmndrs/react-three-fiber',     subcategory: '3D for React',        why: 'Declarative 3D in React — `<mesh>` syntax for Three.js scenes.' },
      { full_name: 'rive-app/rive-runtime',        subcategory: 'Interactive animations', why: 'After Effects killer — design + ship interactive animations to any platform.' },
      { full_name: 'theatre-js/theatre',           subcategory: 'Animation editor',    why: 'Keyframe + scrub editor for the web. Powers high-end web design studios.' },
      { full_name: 'darkroomengineering/lenis',    subcategory: 'Smooth scroll',       why: 'The smooth-scroll library every Awwwards-winning site uses in 2026.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // NEW TRACK — Mobile Dev Skills
  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'mobile-dev',
    title: 'Mobile Dev Skills',
    pitch: 'React Native + Expo + Flutter + native — the modern mobile builder\'s toolkit.',
    description:
      'Everything a 2026 mobile builder uses to ship iOS + Android apps. The Expo + RN ecosystem dominates indie/startup work; Flutter for pixel-perfect cross-platform; native for pro workflows.',
    icon: 'smartphone',
    gradient: 'from-violet-500/50 via-blue-500/30 to-cyan-500/20',
    audience: 'Mobile devs, indie founders shipping apps, RN engineers',
    keywords: ['mobile', 'ios', 'android', 'react-native', 'flutter', 'expo'],
    repos: [
      { full_name: 'expo/expo',                                  subcategory: 'Core platform',     why: 'OTA updates, EAS Build, push, file system — RN without the platform pain. The default.' },
      { full_name: 'facebook/react-native',                      subcategory: 'Core platform',     why: 'Under Expo. New Architecture (Hermes + Fabric + TurboModules) is the 2026 baseline.' },
      { full_name: 'flutter/flutter',                            subcategory: 'Cross-platform',    why: 'Google\'s framework. Pixel-perfect on both platforms. Tougher hiring market than RN.' },
      { full_name: 'tauri-apps/tauri',                           subcategory: 'Cross-platform v2', why: 'Tauri 2 ships desktop + iOS + Android from one Rust+JS codebase. The 2025 dark horse.' },
      { full_name: 'ionic-team/capacitor',                       subcategory: 'Hybrid',            why: 'Native iOS+Android wrapper for your existing web app. Pragmatic for solo founders.' },
      { full_name: 'tamagui/tamagui',                            subcategory: 'UI library',        why: 'Universal RN + web components with a compiler. Heavier setup but extreme runtime perf.' },
      { full_name: 'nativewind/nativewind',                      subcategory: 'UI library',        why: 'Tailwind for React Native. Same className API as your web. Easiest cross-platform DX.' },
      { full_name: 'gluestack-ui/gluestack-ui',                  subcategory: 'UI library',        why: 'Modern RN+web component library. Newer than Tamagui, simpler API.' },
      { full_name: 'software-mansion/react-native-reanimated',   subcategory: 'Animation',         why: '60fps animations on the UI thread. Mandatory for production-feel apps.' },
      { full_name: 'software-mansion/react-native-gesture-handler', subcategory: 'Gestures',       why: 'Native gesture system. Pair with Reanimated for swipeable lists, pull-to-refresh.' },
      { full_name: 'shopify/restyle',                            subcategory: 'Theming',           why: 'Shopify\'s type-safe theming library for RN. Used by serious commerce apps.' },
      { full_name: 'mrousavy/react-native-mmkv',                 subcategory: 'Storage',           why: 'Fastest mobile key-value store. Replaces AsyncStorage everywhere — 30x faster.' },
      { full_name: 'OP-Engineering/op-sqlite',                   subcategory: 'Database',          why: 'Fastest SQLite library for RN. Pair with Drizzle for type-safe queries.' },
      { full_name: 'react-navigation/react-navigation',          subcategory: 'Navigation',        why: 'The default RN navigation. Stacks, tabs, drawers — solved.' },
      { full_name: 'mobile-dev-inc/maestro',                     subcategory: 'E2E testing',       why: 'The 2025 default for mobile E2E. YAML scripts, less brittle than Detox.' },
      { full_name: 'wix/Detox',                                  subcategory: 'E2E testing',       why: 'Older Maestro alternative. Still widely used in established RN codebases.' },
      { full_name: 'fastlane/fastlane',                          subcategory: 'CI/CD',             why: 'Automate iOS + Android releases. Used by 80% of native + RN teams.' },
      { full_name: 'react-native-community/cli',                 subcategory: 'Tooling',           why: 'RN CLI when you eject from Expo. Required reading for native module work.' },
      { full_name: 'gorhom/react-native-bottom-sheet',           subcategory: 'UI primitives',     why: 'The bottom sheet every RN app uses. Performant, gesture-perfect.' },
      { full_name: 'Shopify/react-native-skia',                  subcategory: 'Graphics',          why: 'High-perf 2D graphics for RN. Powers modern RN animation work + charts.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // NEW TRACK — Backend & API Skills
  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'backend-apis',
    title: 'Backend & API Skills',
    pitch: 'Node, Go, Rust, Python frameworks — and the database/queue/realtime stack around them.',
    description:
      'Backend tools the 2026 builder reaches for. Hono and Bun are eating Express\'s share; FastAPI dominates Python; Axum and Loco are the hot Rust frameworks. The ORM + DB landscape has fully shifted to type-safe SQL.',
    icon: 'server',
    gradient: 'from-slate-400/50 via-zinc-500/30 to-stone-500/20',
    audience: 'Backend devs, API designers, full-stack engineers',
    keywords: ['backend', 'api', 'node', 'go', 'rust', 'python', 'orm'],
    repos: [
      { full_name: 'honojs/hono',                  subcategory: 'Node framework',   why: 'Edge-first, ultra-fast web framework. Eating Express\'s share in 2025-26.' },
      { full_name: 'fastify/fastify',              subcategory: 'Node framework',   why: 'Faster Express alternative for serious Node servers. Plugin ecosystem is mature.' },
      { full_name: 'oven-sh/bun',                  subcategory: 'JS runtime',       why: 'Faster Node + ships a bundler + test runner + package manager. Drop-in for many cases.' },
      { full_name: 'denoland/deno',                subcategory: 'JS runtime',       why: 'Secure-by-default TS runtime. Deno 2 (2024) added Node compatibility — viable again.' },
      { full_name: 'tiangolo/fastapi',             subcategory: 'Python framework', why: 'The Python API framework. Type hints + Pydantic + async = the modern default.' },
      { full_name: 'django/django',                subcategory: 'Python framework', why: 'Old reliable. Still dominant for full-stack Python apps with admin UI.' },
      { full_name: 'litestar-org/litestar',        subcategory: 'Python framework', why: 'FastAPI alternative — more performant, better DX for serious apps.' },
      { full_name: 'gofiber/fiber',                subcategory: 'Go framework',     why: 'Express-style Go framework. The friendliest start in Go web dev.' },
      { full_name: 'gin-gonic/gin',                subcategory: 'Go framework',     why: 'Mature Go web framework. Used widely in production at scale.' },
      { full_name: 'encoredev/encore',             subcategory: 'Go framework',     why: 'Go framework that gives you a managed cloud as a side-effect. Hot in 2025.' },
      { full_name: 'tokio-rs/axum',                subcategory: 'Rust framework',   why: 'Hyper + Tower-based Rust web framework. The 2026 Rust default.' },
      { full_name: 'loco-rs/loco',                 subcategory: 'Rust framework',   why: 'Rails-for-Rust. Migrations, ORM, mailer all in one. Surprisingly easy.' },
      { full_name: 'drizzle-team/drizzle-orm',     subcategory: 'TS ORM',           why: 'SQL-first TypeScript ORM. The 2026 default — Prisma is losing share.' },
      { full_name: 'prisma/prisma',                subcategory: 'TS ORM',           why: 'Schema-first ORM. Used by big teams, slowing in indie space.' },
      { full_name: 'kysely-org/kysely',            subcategory: 'TS query builder', why: 'Type-safe SQL without an ORM. The "I want raw SQL but typed" choice.' },
      { full_name: 'pocketbase/pocketbase',        subcategory: 'BaaS-in-a-binary', why: 'Single-file Go backend — auth + DB + storage + realtime. SQLite under the hood.' },
      { full_name: 'surrealdb/surrealdb',          subcategory: 'New DB',           why: 'Multi-model DB (document + graph + relational) in Rust. Trendy 2024-25.' },
      { full_name: 'neondatabase/neon',            subcategory: 'Serverless Postgres',why: 'Branchable Postgres. Spin up per-PR DBs in seconds. Eating Supabase\'s data layer share.' },
      { full_name: 'hoppscotch/hoppscotch',        subcategory: 'API testing',      why: 'Open-source Postman. Fast, free, self-hostable. Mandatory for API work.' },
      { full_name: 'bufbuild/buf',                 subcategory: 'gRPC tooling',     why: 'The protobuf + gRPC toolchain. Used by Connect-RPC, Cloud Run, all serious gRPC.' },
      { full_name: 'partykit/partykit',            subcategory: 'Realtime',         why: 'Multiplayer / realtime built on Cloudflare. Easier than Socket.IO at scale.' },
      { full_name: 'tigerbeetle/tigerbeetle',      subcategory: 'Financial DB',     why: 'Purpose-built double-entry DB for finance. 1000x faster than Postgres for ledgers.' },
      { full_name: 'elysiajs/elysia',              subcategory: 'Bun framework',    why: 'Bun-native framework with insane TS inference. Routes auto-infer client types.' },
      { full_name: 'livekit/livekit',              subcategory: 'WebRTC realtime',  why: 'Open-source WebRTC infrastructure. Powers OpenAI Realtime + thousands of voice apps.' },
      { full_name: 'inngest/inngest',              subcategory: 'Durable workflows',why: 'Type-safe durable functions. Replaces Bull/BullMQ + retry logic. The 2026 TS queue.' },
      { full_name: 'triggerdotdev/trigger.dev',    subcategory: 'Workflow engine',  why: 'Inngest alternative with the best debug timeline UI in the space.' },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // NEW TRACK — Indie Hacker / Founder OS
  // ───────────────────────────────────────────────────────────────────
  {
    slug: 'founder-os',
    title: 'Indie Hacker / Founder OS',
    pitch: 'Run your one-person business on open source — billing, support, ops, docs, all yours.',
    description:
      'Stop paying $50/mo for every SaaS to run your business. Self-host the operational layer: invoicing, CRM, project mgmt, knowledge base, status pages, customer chat. The infra a solo operator actually needs in 2026.',
    icon: 'rocket',
    gradient: 'from-amber-400/50 via-orange-500/30 to-red-500/20',
    audience: 'Solo founders, bootstrapped operators, agency owners',
    keywords: ['founder', 'indie', 'operations', 'pm', 'knowledge', 'support'],
    repos: [
      { full_name: 'invoiceplane/invoiceplane',         subcategory: 'Invoicing',        why: 'Self-hosted invoicing for solo consultants. Saves the $30/mo FreshBooks bill.' },
      { full_name: 'crater-invoice/crater',             subcategory: 'Invoicing',        why: 'Beautiful self-hosted invoicing. Laravel + Vue, modern UI vs InvoicePlane.' },
      { full_name: 'twentyhq/twenty',                   subcategory: 'CRM',              why: 'The hottest OSS CRM. Tracks customers, deals, support touches.' },
      { full_name: 'documenso/documenso',               subcategory: 'Contracts',        why: 'Self-hosted DocuSign. Send and sign contracts with your own branding.' },
      { full_name: 'calcom/cal.com',                    subcategory: 'Scheduling',       why: 'Calendly alternative. Embed booking on your site, never share a Calendly link again.' },
      { full_name: 'chatwoot/chatwoot',                 subcategory: 'Customer support', why: 'Intercom alternative. Email, chat, FB, WhatsApp — all unified into one inbox.' },
      { full_name: 'papermerge/papermerge-core',        subcategory: 'Document mgmt',    why: 'Self-host your PDFs, receipts, invoices. OCR + full-text search.' },
      { full_name: 'paperless-ngx/paperless-ngx',       subcategory: 'Document mgmt',    why: 'Even better Papermerge alternative. The "office paper killer" indie hackers love.' },
      { full_name: 'outline/outline',                   subcategory: 'Wiki / knowledge', why: 'Notion-style wiki. Block editor, share with team or public. Self-host.' },
      { full_name: 'BookStackApp/BookStack',            subcategory: 'Wiki',             why: 'Simpler Outline alternative. Tree-structured docs, perfect for SOPs + procedures.' },
      { full_name: 'leantime/leantime',                 subcategory: 'Project mgmt',     why: 'Project mgmt for solo founders. Goals, sprints, time tracking in one tool.' },
      { full_name: 'go-vikunja/vikunja',                subcategory: 'Task mgmt',        why: 'Self-hosted Todoist + Trello. Lists, boards, gantt, integrates with Cal.com.' },
      { full_name: 'focalboard/focalboard',             subcategory: 'Project mgmt',     why: 'Notion/Trello hybrid. Was acquired by Mattermost but still actively developed.' },
      { full_name: 'plane-org/plane',                   subcategory: 'Project mgmt',     why: 'Linear/Jira alternative. Hot in 2024-25, great for product roadmaps.' },
      { full_name: 'kimai/kimai',                       subcategory: 'Time tracking',    why: 'Self-host time tracking. Invoice based on hours, freelancer essential.' },
      { full_name: 'statusnook/statusnook',             subcategory: 'Status page',      why: 'Self-host your status page. Subscribers get notified on incidents.' },
      { full_name: 'cachethq/cachet',                   subcategory: 'Status page',      why: 'Older but stable. Open-source Statuspage.io alternative.' },
      { full_name: 'plausible/analytics',               subcategory: 'Analytics',        why: 'Privacy-first analytics. Lightweight, GDPR-safe, the founder default.' },
      { full_name: 'PostHog/posthog',                   subcategory: 'Product analytics',why: 'When Plausible isn\'t enough — funnels, session replay, feature flags.' },
      { full_name: 'razorpay/razorpay-node',            subcategory: 'Payments (India)', why: 'Razorpay SDK. UPI + cards + subscriptions for Indian founders.' },
    ],
  },
];

export function getSkillTrackBySlug(slug: string): SkillTrack | undefined {
  return SKILL_TRACKS.find((s) => s.slug === slug);
}
