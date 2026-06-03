// Caption + hashtag generator for the IG auto-poster.
// Reads a "topic" key + post_type, returns a ready-to-publish caption and a
// rotated hashtag set. Templates intentionally short — 3-line hook structure
// that performs well on Reels.

export interface CaptionInput {
  topic: string;           // free-form, e.g. "what is stackpicks"
  postType: 'reel' | 'video' | 'image' | 'carousel';
  cta?: string;            // default: "stackpicks.dev (link in bio)"
  audience?: string;       // default: "developers"
}

export interface CaptionOutput {
  caption: string;
  hashtags: string;        // space-separated, no #
}

// ---------------------------------------------------------------------------
// Hashtag pools — rotated per-post so we don't look spammy
// ---------------------------------------------------------------------------
const HASHTAG_POOLS = {
  always_on: ['buildinpublic', 'opensource', 'devtools', 'indiehackers', 'ai'],
  niche_tech: ['vibecoding', 'claude', 'cursor', 'mcp', 'anthropic', 'chatgpt'],
  tool_specific: ['supabase', 'nextjs', 'vercel', 'figma', 'githubcopilot', 'typescript'],
  audience: ['softwareengineer', 'fullstack', '100daysofcode', 'saas', 'productivity', 'founder'],
  india: ['indianstartups', 'bengaluru', 'indiandevelopers', 'buildinindia'],
  brand: ['stackpicks'],
};

// Deterministic rotation — each topic gets a stable but varied set
function pickHashtags(seed: string): string {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = <T,>(arr: T[], n: number, offset: number): T[] => {
    const out: T[] = [];
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      out.push(arr[(hash + offset + i) % arr.length]);
    }
    return out;
  };
  const tags = [
    ...pick(HASHTAG_POOLS.always_on, 4, 0),
    ...pick(HASHTAG_POOLS.niche_tech, 3, hash),
    ...pick(HASHTAG_POOLS.tool_specific, 2, hash * 2),
    ...pick(HASHTAG_POOLS.audience, 2, hash * 3),
    ...pick(HASHTAG_POOLS.india, 1, hash * 4),
    ...HASHTAG_POOLS.brand,
  ];
  // Dedupe while preserving order
  return [...new Set(tags)].slice(0, 17).join(' ');
}

// ---------------------------------------------------------------------------
// Caption templates by post_type — focused, scroll-stopping
// ---------------------------------------------------------------------------
type Template = (topic: string, cta: string) => string;

const TEMPLATES: Record<string, Template[]> = {
  reel: [
    (t, cta) => `${capitalize(t)} — in 60 seconds.

If you're picking open-source dev tools by star count, you're going to pick the wrong one.

StackPicks has a one-paragraph "use this if / skip if" take on every repo. Written by a builder, not an AI.

165+ tools. No hype. No fake humility.

🔗 ${cta}`,

    (t, cta) => `Here's what nobody tells you about ${t}.

The "top 100 open-source X" lists are useless. They rank by stars. Stars ≠ fit.

I built StackPicks to fix that — every repo gets one honest take. What it's good at. The real tradeoff. When to skip it.

🔗 ${cta}`,

    (t, cta) => `${capitalize(t)} ⤵

165+ curated open-source dev tools. 89 MCP servers for Claude. 22 apps you can connect through one URL.

All in one place. All with honest takes.

🔗 ${cta}`,
  ],

  video: [
    (t, cta) => `${capitalize(t)}.

Watch how it works ↑

🔗 ${cta}`,
  ],

  carousel: [
    (t, cta) => `${capitalize(t)} — swipe ⤴

The open-source stack, curated by a builder. 165+ tools. Honest "use this if / skip if" takes on each.

🔗 ${cta}`,
  ],

  image: [
    (t, cta) => `${capitalize(t)}.

🔗 ${cta}`,
  ],
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function generateCaption(input: CaptionInput): CaptionOutput {
  const cta = input.cta || 'stackpicks.dev (link in bio)';
  const pool = TEMPLATES[input.postType] || TEMPLATES.image;
  // Pick template by stable hash of topic — same topic always gets same caption
  const idx = [...input.topic].reduce((a, c) => a + c.charCodeAt(0), 0) % pool.length;
  const caption = pool[idx](input.topic, cta);
  const hashtags = pickHashtags(input.topic + input.postType);
  return { caption, hashtags };
}
