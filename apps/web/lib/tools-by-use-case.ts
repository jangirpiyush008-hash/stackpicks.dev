// /tools page data — AI tools by use case, with realistic pricing + output
// economics for each tier. Numbers are May 2026 snapshot, India-aware where
// pricing differs by region.
//
// The "what you can ship" column is the key differentiator vs other tool
// directories — it answers the question users actually have: "if I pay $20,
// how much can I actually do?"

export type ToolLicense = 'open-source' | 'freemium' | 'free' | 'paid';

export interface PricingTier {
  name: string;             // "Free" / "Pro $20" / "Max 5x $100"
  price: string;            // "$0" / "$20/mo" / "₹1,650/mo"
  limit: string;            // "30 msgs / 5 hr" / "500 reqs / mo"
  reset?: string;           // "5 hours" / "daily" / "monthly" — when limit resets
  output: string;           // "Ship a landing page in 5 hr · MVP in 2-3 weeks"
}

export interface AITool {
  name: string;
  url: string;
  license: ToolLicense;
  vendor: string;           // "Anthropic" / "OpenAI" / "OSS"
  take: string;             // 1-sentence opinionated take
  best_for: string;         // who this is best for
  github?: string;          // owner/repo if open-source
  tiers: PricingTier[];
}

export interface UseCaseSection {
  slug: string;
  title: string;
  intro: string;
  picks: AITool[];
}

export const TOOLS_BY_USE_CASE: UseCaseSection[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // AI FOR CODE
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-for-code',
    title: 'AI for code',
    intro: 'Coding assistants ranked by what you actually ship at each price tier. Claude Sonnet 4.5 is the consensus best coding model in 2026 — picks below differ on UX, not brains.',
    picks: [
      {
        name: 'Claude Code',
        url: 'https://www.anthropic.com/claude-code',
        license: 'paid',
        vendor: 'Anthropic',
        take: 'CLI-first agentic coding assistant. Runs in your terminal, edits files, runs commands, opens PRs. Same brain as the chat app but agentic.',
        best_for: 'Terminal-native devs who want a real agent, not autocomplete.',
        tiers: [
          { name: 'Pro',     price: '$20/mo',  limit: '~45 messages / 5 hr',    reset: '5 hours', output: '1–2 short PRs per session. Landing page in 2 sessions. ~5 hrs/day max.' },
          { name: 'Max 5x',  price: '$100/mo', limit: '~225 messages / 5 hr',   reset: '5 hours', output: 'Full Next.js + Supabase app in 1 week of evening sessions. ~25 hrs/day agent runtime.' },
          { name: 'Max 20x', price: '$200/mo', limit: '~900 messages / 5 hr',   reset: '5 hours', output: 'Ship a full SaaS MVP in 2–3 days. Run 4+ agents in parallel. Pro-dev tier.' },
        ],
      },
      {
        name: 'Cursor',
        url: 'https://cursor.com',
        license: 'paid',
        vendor: 'Anysphere',
        take: 'VS Code fork with deep AI integration. Best Tab autocomplete in the industry + agent mode for multi-file edits.',
        best_for: 'Most devs who want polish + speed in one IDE.',
        tiers: [
          { name: 'Hobby',     price: '$0',      limit: '50 fast requests, 14-day trial',           reset: 'monthly', output: 'Try Cursor for 2 weeks. Decide if it sticks.' },
          { name: 'Pro',       price: '$20/mo',  limit: '500 fast + unlimited slow requests',       reset: 'monthly', output: 'Full MVP in 1 week. Sweet spot for solo devs.' },
          { name: 'Business',  price: '$40/user/mo', limit: '500 fast + privacy mode + team admin', reset: 'monthly', output: 'Same as Pro + SOC2 + team billing. Skip unless you have 3+ devs.' },
          { name: 'Ultra',     price: '$200/mo', limit: '20× Pro limits + early access models',     reset: 'monthly', output: 'Heavy agent mode all day. Multiple parallel codebases.' },
        ],
      },
      {
        name: 'Cline',
        url: 'https://cline.bot',
        license: 'open-source',
        github: 'cline/cline',
        vendor: 'OSS',
        take: 'Free + open-source VS Code extension. Most agentic of the lot — can read whole codebases, run commands, plan multi-step changes.',
        best_for: 'Free-software-purists + power users who want to swap models freely.',
        tiers: [
          { name: 'BYO API',  price: '~$10–30/mo', limit: 'Pay per Anthropic/OpenAI token',   reset: 'none',    output: 'Claude Sonnet 4.5 via API → ~5–10 hrs/day coding for $30/mo.' },
          { name: 'OpenRouter', price: '$5–50/mo', limit: 'Pay per token across 100+ models', reset: 'none',    output: 'Mix cheap + premium models — DeepSeek for grunt work, Claude for hard problems.' },
        ],
      },
      {
        name: 'Aider',
        url: 'https://aider.chat',
        license: 'open-source',
        github: 'Aider-AI/aider',
        vendor: 'OSS',
        take: 'Terminal-first AI pair programmer. Auto-commits to git after each edit so you can roll back. Best UX for diff-driven workflows.',
        best_for: 'Terminal devs who already live in tmux + vim.',
        tiers: [
          { name: 'BYO API', price: '~$10–30/mo', limit: 'Per Anthropic/OpenAI/local LLM token', reset: 'none', output: 'Same code output as Cursor but in your terminal. ~$0.50–$2 per feature.' },
          { name: 'Local LLM', price: '$0',       limit: 'Free if you have a GPU',               reset: 'none', output: 'Run Qwen-Coder or DeepSeek locally. Free but slower + weaker.' },
        ],
      },
      {
        name: 'GitHub Copilot',
        url: 'https://github.com/features/copilot',
        license: 'paid',
        vendor: 'GitHub / Microsoft',
        take: 'The original autocomplete. Now bundles GPT-4o + Claude Sonnet 4 chat. Most integrated VS Code experience because Microsoft makes both.',
        best_for: 'VS Code loyalists + enterprise teams with GitHub already paid for.',
        tiers: [
          { name: 'Free',  price: '$0',     limit: '2,000 completions + 50 chats / month',     reset: 'monthly', output: 'Side-project autocomplete only. No agent mode.' },
          { name: 'Pro',   price: '$10/mo', limit: 'Unlimited completions + chat (GPT-4o)',     reset: 'monthly', output: '~Full-time daily autocomplete + chat. No premium models.' },
          { name: 'Pro+',  price: '$39/mo', limit: 'Includes Claude Sonnet 4 + GPT-5 + agents', reset: 'monthly', output: 'Pro Cline-like agent mode inside VS Code. Solid choice if already on GitHub.' },
        ],
      },
      {
        name: 'Codex CLI',
        url: 'https://github.com/openai/codex',
        license: 'open-source',
        github: 'openai/codex',
        vendor: 'OpenAI',
        take: 'OpenAI\'s answer to Claude Code. Free CLI, BYO API key. Powered by o1 / GPT-5-codex models.',
        best_for: 'OpenAI-stack devs who want CLI-first agent + GPT models.',
        tiers: [
          { name: 'BYO OpenAI', price: '~$10–40/mo', limit: 'Per API token usage',          reset: 'none',    output: '~5 hrs/day on GPT-5 ≈ $25/mo. Cheaper than Plus subscription for heavy users.' },
          { name: 'ChatGPT Plus', price: '$20/mo',  limit: '~150 requests / 5 hr (codex)', reset: '5 hours', output: 'Light coding tasks. Better used in chat for plans, Codex for execution.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AI FOR VIDEO
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-for-video',
    title: 'AI for video',
    intro: 'Text-to-video models in May 2026. Sora and Veo lead on motion + prompt adherence; Kling and Hailuo are 5–10× cheaper for similar quality.',
    picks: [
      {
        name: 'Sora 2',
        url: 'https://openai.com/sora',
        license: 'paid',
        vendor: 'OpenAI',
        take: 'Best motion + physics in 2026. 1080p, 10-sec clips, native audio. Pricier than Veo but better on complex scenes.',
        best_for: 'Filmmakers + creators who need cinema-grade output.',
        tiers: [
          { name: 'ChatGPT Plus',  price: '$20/mo',  limit: '~50 videos / mo (720p, 5 sec)',   reset: 'monthly', output: '50 short clips = a YouTube short series. ~1 hr of generated content.' },
          { name: 'ChatGPT Pro',   price: '$200/mo', limit: '~500 videos / mo (1080p, 20 sec)', reset: 'monthly', output: 'Daily YouTube channel volume. ~3 hrs of generated content/month.' },
        ],
      },
      {
        name: 'Veo 3',
        url: 'https://deepmind.google/technologies/veo',
        license: 'paid',
        vendor: 'Google DeepMind',
        take: 'Cheapest cinema-grade text-to-video in 2026. Native audio, 4K output on Ultra tier. Bundled with Gemini Advanced.',
        best_for: 'Creators on Google Workspace + Gemini already.',
        tiers: [
          { name: 'AI Pro',    price: '$19.99/mo', limit: '10 Veo 3 generations + 100 Veo 3 Fast', reset: 'monthly', output: '10 hero shots + 100 quick drafts. Enough for a content week.' },
          { name: 'AI Ultra',  price: '$249.99/mo', limit: '125 Veo 3 + 4K output + 30-min clips', reset: 'monthly', output: 'Pro-tier output. Daily long-form video viable.' },
        ],
      },
      {
        name: 'Runway Gen-4',
        url: 'https://runwayml.com',
        license: 'paid',
        vendor: 'Runway',
        take: 'Industry-favorite for filmmakers. Reference images, motion brush, full pro editor. Pricing in credits.',
        best_for: 'Pros who want control over camera moves, references, and post.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '125 credits (~3 short clips)',         reset: 'one-time', output: 'Try it. Outputs include watermark.' },
          { name: 'Standard', price: '$15/mo', limit: '625 credits/mo (~10 min of video)',    reset: 'monthly',  output: 'Solo creator. ~3–5 short clips per day, no watermark.' },
          { name: 'Pro',      price: '$35/mo', limit: '2,250 credits/mo (~36 min of video)',  reset: 'monthly',  output: 'Multiple projects, advanced features (lip-sync, motion brush).' },
          { name: 'Unlimited',price: '$95/mo', limit: 'Unlimited Standard generations',       reset: 'none',     output: 'Run it all day in "Explore" mode. Highest tier for power users.' },
        ],
      },
      {
        name: 'Kling 2.5',
        url: 'https://klingai.com',
        license: 'paid',
        vendor: 'Kuaishou (China)',
        take: '5–10× cheaper than Sora with surprisingly comparable output. The price-performance king.',
        best_for: 'High-volume creators on a budget. Social media output.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '66 credits/day (~6 short clips)',     reset: 'daily',   output: 'Steady stream of free 5-sec clips daily.' },
          { name: 'Standard', price: '$10/mo', limit: '660 credits/mo + watermark removed',  reset: 'monthly', output: '~60 clips/month. Side hustle volume.' },
          { name: 'Pro',      price: '$35/mo', limit: '3,000 credits + 1080p',               reset: 'monthly', output: 'Full-time creator volume. ~5 mins/day generated.' },
        ],
      },
      {
        name: 'Hailuo',
        url: 'https://hailuoai.video',
        license: 'paid',
        vendor: 'MiniMax (China)',
        take: 'Best free tier in the category. Strong on character consistency + camera control.',
        best_for: 'Story-driven creators making short narratives.',
        tiers: [
          { name: 'Free',         price: '$0',     limit: '~3 videos/day',           reset: 'daily',   output: 'Casual experimentation. Quick test ideas.' },
          { name: 'Standard',     price: '$10/mo', limit: '~1,000 credits/mo',       reset: 'monthly', output: 'Solid solo-creator tier.' },
          { name: 'Unlimited',    price: '$95/mo', limit: 'Unlimited generation queue', reset: 'none', output: 'High-volume daily production.' },
        ],
      },
      {
        name: 'Remotion',
        url: 'https://www.remotion.dev',
        license: 'open-source',
        github: 'remotion-dev/remotion',
        vendor: 'OSS',
        take: 'Programmatic video — write videos in React. Not "AI", but the only tool here that fits in a CI pipeline for data-driven video at scale.',
        best_for: 'Devs automating personalized video output.',
        tiers: [
          { name: 'OSS',           price: '$0',                  limit: 'Self-host, run on your own machine', reset: 'none', output: 'Unlimited videos if you have the compute. Pay for AWS/render time only.' },
          { name: 'Remotion Pro',  price: '€10/mo (~$11)',       limit: 'Commercial license for >3 devs',     reset: 'none', output: 'License + Lambda render infra.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AI FOR IMAGES
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-for-images',
    title: 'AI for images',
    intro: 'Text-to-image and editing. Midjourney still wins on aesthetic ceiling; Flux beats it on prompt adherence + photo realism; Ideogram beats both on text inside images.',
    picks: [
      {
        name: 'Midjourney v7',
        url: 'https://www.midjourney.com',
        license: 'paid',
        vendor: 'Midjourney',
        take: 'Highest aesthetic ceiling in the category. Web app now (Discord retired). The default for creative directors.',
        best_for: 'Designers + art-direction-heavy work.',
        tiers: [
          { name: 'Basic',    price: '$10/mo',  limit: '~200 images / mo (3.3 hr fast time)',    reset: 'monthly', output: 'Hobbyist. Side project visuals.' },
          { name: 'Standard', price: '$30/mo',  limit: '~900 images / mo (15 hr fast)',          reset: 'monthly', output: 'Daily creator. ~30 images/day.' },
          { name: 'Pro',      price: '$60/mo',  limit: '~1,800 images + Stealth mode',           reset: 'monthly', output: 'Designer / agency. Private outputs.' },
          { name: 'Mega',     price: '$120/mo', limit: '~3,600 images / mo + 12 concurrent jobs',reset: 'monthly', output: 'Studio volume. Multiple parallel batches.' },
        ],
      },
      {
        name: 'Flux Pro',
        url: 'https://blackforestlabs.ai',
        license: 'open-source',
        github: 'black-forest-labs/flux',
        vendor: 'Black Forest Labs',
        take: 'Best open-source image model in 2026. Beats Midjourney on prompt adherence + photo realism. Open weights, commercial use allowed.',
        best_for: 'Devs integrating image gen into a product.',
        tiers: [
          { name: 'OSS (self-host)', price: '$0', limit: 'Unlimited if you have a GPU', reset: 'none', output: 'Free locally. Slow on CPU; instant on RTX 4090.' },
          { name: 'fal.ai',  price: '$0.05/image avg', limit: 'Pay per generation', reset: 'none', output: 'Fastest hosted Flux. ~$50/mo = 1,000 images.' },
          { name: 'Replicate', price: '$0.04/image', limit: 'Pay per generation', reset: 'none', output: 'Cheap, slightly slower. Best for batch jobs.' },
        ],
      },
      {
        name: 'Ideogram 3.0',
        url: 'https://ideogram.ai',
        license: 'paid',
        vendor: 'Ideogram',
        take: 'Best-in-class for typography inside images. Marketing posters, logos, billboard mockups — Ideogram renders text accurately when others fail.',
        best_for: 'Marketers + designers making layouts with text.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '10 images / day',         reset: 'daily',   output: 'Try it. Watermark on some outputs.' },
          { name: 'Basic',    price: '$7/mo',  limit: '400 priority images / mo',reset: 'monthly', output: 'Personal projects.' },
          { name: 'Plus',     price: '$16/mo', limit: '1,000 priority + Magic Prompt', reset: 'monthly', output: 'Designer day-job tier.' },
          { name: 'Pro',      price: '$48/mo', limit: '4,000 priority + API access',  reset: 'monthly', output: 'Agency / API integration.' },
        ],
      },
      {
        name: 'ComfyUI',
        url: 'https://github.com/Comfy-Org/ComfyUI',
        license: 'open-source',
        github: 'Comfy-Org/ComfyUI',
        vendor: 'OSS',
        take: 'Node-based Stable Diffusion + Flux workflow editor. Steep curve, infinite ceiling. Industry standard for serious AI image work.',
        best_for: 'Power users running complex multi-stage pipelines.',
        tiers: [
          { name: 'Self-host', price: '$0',           limit: 'Unlimited (your GPU)', reset: 'none', output: 'Run locally on Mac/PC. Free forever.' },
          { name: 'RunComfy',  price: '~$0.30/hr',    limit: 'Hosted cloud GPU',     reset: 'none', output: '~$20/mo for a few hours/day. Easier than self-host.' },
        ],
      },
      {
        name: 'Recraft v3',
        url: 'https://www.recraft.ai',
        license: 'paid',
        vendor: 'Recraft',
        take: 'Best for branded vector + SVG output. Generates logos, icons, marketing illustrations with consistent style.',
        best_for: 'Brand designers + marketing teams needing on-brand assets.',
        tiers: [
          { name: 'Free',  price: '$0',     limit: '50 credits / day',        reset: 'daily',   output: 'Try it for a small project.' },
          { name: 'Basic', price: '$12/mo', limit: '1,000 credits / mo',      reset: 'monthly', output: '~100 vector illustrations / mo.' },
          { name: 'Advanced', price: '$49/mo', limit: '5,000 credits + API', reset: 'monthly', output: 'Agency tier with style consistency.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AI FOR AUDIO + VOICE
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-for-audio',
    title: 'AI for audio + voice',
    intro: 'Text-to-speech, voice cloning, music. ElevenLabs is best-in-class for voice; Suno owns music generation.',
    picks: [
      {
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io',
        license: 'paid',
        vendor: 'ElevenLabs',
        take: 'Best TTS + voice cloning in 2026. 32 languages, real-time API, voice library. The bar everyone else benchmarks against.',
        best_for: 'Anyone needing pro voiceover, dubbing, or character voices.',
        tiers: [
          { name: 'Free',      price: '$0',     limit: '10,000 chars / mo (~10 min audio)', reset: 'monthly', output: 'Demo videos, side project narration.' },
          { name: 'Starter',   price: '$5/mo',  limit: '30,000 chars / mo (~30 min)',       reset: 'monthly', output: 'Weekly podcast intro / outro.' },
          { name: 'Creator',   price: '$22/mo', limit: '100,000 chars + voice cloning',     reset: 'monthly', output: 'Full podcast at ~1.5 hrs / mo, your cloned voice.' },
          { name: 'Pro',       price: '$99/mo', limit: '500,000 chars + commercial license',reset: 'monthly', output: '~8 hrs / mo of audio. YouTube channel volume.' },
          { name: 'Scale',     price: '$330/mo',limit: '2M chars + API priority',           reset: 'monthly', output: 'Audiobook publisher tier.' },
        ],
      },
      {
        name: 'Suno v4.5',
        url: 'https://suno.com',
        license: 'paid',
        vendor: 'Suno',
        take: 'Best AI music generation. Full songs with lyrics, vocals, instruments — under 30 seconds per track.',
        best_for: 'Creators needing royalty-free background music or full songs.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '10 songs / day (50 credits)',    reset: 'daily',   output: '~5 mins of music / day for free.' },
          { name: 'Pro',      price: '$10/mo', limit: '500 songs / mo (2,500 credits)', reset: 'monthly', output: '~4 hrs of music / mo. Podcast theme + transitions covered.' },
          { name: 'Premier',  price: '$30/mo', limit: '2,000 songs / mo + commercial',  reset: 'monthly', output: 'Full music library for a YouTube channel.' },
        ],
      },
      {
        name: 'Udio',
        url: 'https://www.udio.com',
        license: 'paid',
        vendor: 'Udio',
        take: 'Best vocal quality in the category. Stronger on classical, jazz, and acoustic genres than Suno.',
        best_for: 'Musicians who want AI-assisted writing for specific genres.',
        tiers: [
          { name: 'Free',      price: '$0',     limit: '10 songs / day',     reset: 'daily',   output: 'Try the vocal quality vs Suno.' },
          { name: 'Standard',  price: '$10/mo', limit: '1,200 credits / mo', reset: 'monthly', output: '~150 songs / mo.' },
          { name: 'Pro',       price: '$30/mo', limit: '5,000 credits + commercial', reset: 'monthly', output: 'Album-volume output.' },
        ],
      },
      {
        name: 'Whisper (OpenAI)',
        url: 'https://github.com/openai/whisper',
        license: 'open-source',
        github: 'openai/whisper',
        vendor: 'OpenAI',
        take: 'Open-source speech-to-text. 99 languages. Free to self-host; cheap via OpenAI API.',
        best_for: 'Devs adding transcription to a product.',
        tiers: [
          { name: 'OSS',        price: '$0',         limit: 'Self-host, unlimited',          reset: 'none', output: 'Free on any modern laptop. Real-time on M2+.' },
          { name: 'OpenAI API', price: '$0.006/min', limit: 'Pay per minute transcribed',    reset: 'none', output: '~$3.60/hr → 100 hrs of transcription costs $36.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AI FOR WRITING + RESEARCH
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-for-writing',
    title: 'AI for writing + research',
    intro: 'General-purpose AI for thinking, writing, research. ChatGPT and Claude are 1a + 1b; Perplexity is the citation-grounded search alternative.',
    picks: [
      {
        name: 'Claude (chat)',
        url: 'https://claude.ai',
        license: 'paid',
        vendor: 'Anthropic',
        take: 'Best writing partner in 2026. Sonnet 4.5 + Opus 4.5 both available. Strong reasoning + minimal sycophancy.',
        best_for: 'Writers, founders, analysts thinking out loud.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '~30 messages / 5 hr (Sonnet)',     reset: '5 hours', output: 'Casual use. Hits limit if you go deep.' },
          { name: 'Pro',      price: '$20/mo', limit: '~45 msgs / 5 hr + Opus access',    reset: '5 hours', output: '5–7 long conversations / day. Solo founder tier.' },
          { name: 'Max 5x',   price: '$100/mo', limit: '~225 msgs / 5 hr + projects',     reset: '5 hours', output: 'All-day knowledge work. Heavy research sessions.' },
          { name: 'Max 20x',  price: '$200/mo', limit: '~900 msgs / 5 hr',                reset: '5 hours', output: 'Professional researcher / analyst tier.' },
        ],
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        license: 'paid',
        vendor: 'OpenAI',
        take: 'Largest user base. GPT-5 + Sora + Codex all bundled. Best ecosystem; some say Claude wins on raw text quality.',
        best_for: 'Most general users + anyone wanting voice + Sora in one app.',
        tiers: [
          { name: 'Free',  price: '$0',     limit: 'GPT-5-mini + limited GPT-5',     reset: '3 hours', output: '~20 GPT-5 messages / 3 hrs. Decent free tier.' },
          { name: 'Plus',  price: '$20/mo', limit: '~150 GPT-5 msgs / 3 hr + Sora 50/mo', reset: '3 hours', output: 'Solo creator / dev. Most common paid tier.' },
          { name: 'Pro',   price: '$200/mo',limit: 'Unlimited GPT-5 + Sora 500/mo + o1-pro', reset: 'none', output: 'No-limits pro tier. Worth it only for heavy use.' },
        ],
      },
      {
        name: 'Gemini',
        url: 'https://gemini.google.com',
        license: 'paid',
        vendor: 'Google',
        take: '2-million-token context window is unmatched. Best for "feed me this entire codebase / book" tasks. Bundled with Veo + Workspace.',
        best_for: 'Long-context tasks; Google Workspace users.',
        tiers: [
          { name: 'Free',   price: '$0',         limit: 'Gemini 2.5 Flash, light usage',         reset: 'daily',   output: 'Decent free tier. Daily quick answers.' },
          { name: 'AI Pro', price: '$19.99/mo',  limit: 'Gemini 2.5 Pro + Veo 3 (10/mo)',         reset: 'monthly', output: 'Long-context work + 10 hero videos.' },
          { name: 'AI Ultra', price: '$249.99/mo', limit: 'Deep Research + Veo 3 (125/mo) + 4K',  reset: 'monthly', output: 'Enterprise research workflow.' },
        ],
      },
      {
        name: 'Perplexity',
        url: 'https://perplexity.ai',
        license: 'paid',
        vendor: 'Perplexity',
        take: 'Search engine + AI hybrid. Every answer cites sources. The only one that\'s actually trustworthy for real-time info.',
        best_for: 'Researchers, journalists, anyone fact-checking AI output.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '5 Pro searches / day',                   reset: 'daily',   output: 'Quick fact lookups.' },
          { name: 'Pro',      price: '$20/mo', limit: '600 Pro searches / day + API',           reset: 'daily',   output: 'Daily research workflow. Newsroom volume.' },
          { name: 'Enterprise', price: 'Custom', limit: 'Unlimited + SOC2 + team',              reset: 'none',    output: 'Embed in product for users.' },
        ],
      },
      {
        name: 'NotebookLM',
        url: 'https://notebooklm.google.com',
        license: 'free',
        vendor: 'Google',
        take: 'Turn any set of documents into an AI notebook with cited Q&A + audio overview podcast. Free, and actually useful.',
        best_for: 'Students, researchers, anyone learning from a stack of PDFs.',
        tiers: [
          { name: 'Free',     price: '$0',         limit: '100 notebooks, 50 sources each',  reset: 'none',    output: 'Replaces hours of reading. Everyone should try once.' },
          { name: 'Plus',     price: '$19.99/mo',  limit: '500 notebooks + chat customization', reset: 'monthly', output: 'Heavy researcher tier.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AI FOR 3D
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-for-3d',
    title: 'AI for 3D',
    intro: 'Text-to-3D and image-to-3D. Still rougher than 2D image gen but workable for game prototypes + product visualization.',
    picks: [
      {
        name: 'Luma AI',
        url: 'https://lumalabs.ai',
        license: 'paid',
        vendor: 'Luma',
        take: 'Best NeRF + Gaussian Splatting on phone-captured video. Turn a real object scan into a 3D model in 2 minutes.',
        best_for: 'Real-world 3D capture (products, locations, vehicles).',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '30 captures total',           reset: 'one-time', output: 'Try it for a small batch.' },
          { name: 'Lite',     price: '$9.99/mo', limit: '100 captures / mo',         reset: 'monthly',  output: 'Product photographer tier.' },
          { name: 'Standard', price: '$29.99/mo', limit: '300 captures / mo',        reset: 'monthly',  output: 'Agency / studio volume.' },
        ],
      },
      {
        name: 'Meshy',
        url: 'https://www.meshy.ai',
        license: 'paid',
        vendor: 'Meshy',
        take: 'Text-to-3D + image-to-3D with usable topology. Best for game-engine import (Unity / Unreal).',
        best_for: 'Game devs prototyping props + characters.',
        tiers: [
          { name: 'Free',  price: '$0',     limit: '200 credits / mo (~10 models)',  reset: 'monthly', output: 'Indie prototyping.' },
          { name: 'Pro',   price: '$20/mo', limit: '1,000 credits + commercial',     reset: 'monthly', output: '~50 game-ready props / mo.' },
          { name: 'Max',   price: '$60/mo', limit: '4,000 credits + priority queue', reset: 'monthly', output: 'Studio tier.' },
        ],
      },
      {
        name: 'Tripo 3D',
        url: 'https://www.tripo3d.ai',
        license: 'paid',
        vendor: 'Tripo (Stability AI partnership)',
        take: 'Fastest text-to-3D in 2026. PBR materials, animation rigging built-in.',
        best_for: 'Quick prototyping with usable PBR output.',
        tiers: [
          { name: 'Free',     price: '$0',     limit: '600 credits / mo',          reset: 'monthly', output: 'Try the API quality.' },
          { name: 'Plus',     price: '$20/mo', limit: '3,200 credits + animation', reset: 'monthly', output: 'Indie game dev tier.' },
          { name: 'Pro',      price: '$50/mo', limit: '8,000 credits + commercial', reset: 'monthly', output: 'Studio output.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AI AGENT FRAMEWORKS
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-agents',
    title: 'AI agent frameworks',
    intro: 'Building autonomous agents into a product? These are the frameworks. Most are free (open-source) — the cost is the LLM API spend.',
    picks: [
      {
        name: 'LangGraph',
        url: 'https://www.langchain.com/langgraph',
        license: 'open-source',
        github: 'langchain-ai/langgraph',
        vendor: 'LangChain',
        take: 'Most production-ready agent framework in 2026. State machine model handles complex multi-step workflows cleanly.',
        best_for: 'Devs shipping production agents with multi-step state.',
        tiers: [
          { name: 'OSS',           price: '$0',          limit: 'Self-host, pay only LLM API costs',     reset: 'none', output: 'Run anywhere. ~$50–500/mo in LLM costs depending on agent volume.' },
          { name: 'LangSmith Plus', price: '$39/mo + usage', limit: 'Hosted observability + 10k traces/mo', reset: 'monthly', output: 'Add tracing/evals to your agent.' },
        ],
      },
      {
        name: 'CrewAI',
        url: 'https://www.crewai.com',
        license: 'open-source',
        github: 'crewAIInc/crewAI',
        vendor: 'CrewAI',
        take: 'Best for role-based multi-agent setups (planner → executor → reviewer). Cleanest API of the multi-agent options.',
        best_for: 'Multi-agent collaboration with clear roles.',
        tiers: [
          { name: 'OSS',      price: '$0',          limit: 'Self-host + LLM API costs',  reset: 'none',    output: 'Free framework. Pay for LLM tokens only.' },
          { name: 'Enterprise', price: 'Custom',    limit: 'Hosted + SOC2 + SSO',        reset: 'none',    output: 'For teams shipping agents to enterprise customers.' },
        ],
      },
      {
        name: 'Mastra',
        url: 'https://mastra.ai',
        license: 'open-source',
        github: 'mastra-ai/mastra',
        vendor: 'Mastra',
        take: 'TypeScript-first agent framework. Ships fast for JS teams already on Next.js. Built on Vercel AI SDK underneath.',
        best_for: 'JS teams who refuse to learn Python for agents.',
        tiers: [
          { name: 'OSS',     price: '$0',           limit: 'Self-host + LLM API costs',   reset: 'none',    output: 'TS-native agent dev with native types end-to-end.' },
          { name: 'Cloud',   price: 'Beta (waitlist)', limit: 'Hosted agent runtime + observability', reset: 'monthly', output: 'Skip ops, focus on agent logic.' },
        ],
      },
      {
        name: 'AutoGen',
        url: 'https://microsoft.github.io/autogen',
        license: 'open-source',
        github: 'microsoft/autogen',
        vendor: 'Microsoft',
        take: 'Conversational multi-agent framework. Strong on research / experimentation; less polished than CrewAI for prod.',
        best_for: 'AI researchers + advanced multi-agent experiments.',
        tiers: [
          { name: 'OSS', price: '$0', limit: 'Self-host + LLM API costs', reset: 'none', output: 'Research-grade multi-agent simulations.' },
        ],
      },
    ],
  },
];

export function getUseCaseBySlug(slug: string): UseCaseSection | undefined {
  return TOOLS_BY_USE_CASE.find((s) => s.slug === slug);
}
