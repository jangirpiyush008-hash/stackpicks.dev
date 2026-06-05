/**
 * Voice-clone research prototype — does Claude convincingly mimic a
 * creator's tone when given a sample of their public writing?
 *
 * No customer DMs needed. Uses publicly observable voice patterns from
 * different creator archetypes. Output is side-by-side:
 *   • Generic ManyChat template
 *   • Voice-cloned DM in that creator's style
 *
 * Decision gate for the Pro tier feature. Run:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/autodm-voice-clone-research.ts
 */

import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Missing ANTHROPIC_API_KEY env (Claude API key).');
  process.exit(1);
}
const claude = new Anthropic({ apiKey });

interface CreatorProfile {
  name: string;
  niche: string;
  voice_samples: string[];    // 5-10 lines they actually wrote / would write
  style_notes: string;        // free-text description (used by Claude alongside samples)
}

// Five archetypes covering most of the Indian creator economy
const CREATORS: CreatorProfile[] = [
  {
    name: 'Indian dev creator (Piyush)',
    niche: 'AI builders, dev tools, Indian creator economy',
    voice_samples: [
      'Building in public again — shadcn is the new React standard. Anyone still on MUI is lighting money on fire.',
      'Yaar this is straight up the easiest MCP I have ever set up. Free, official, zero JSON.',
      'Skip the framework wars. Just ship. Nobody on your launch day cares whether you used Next or Remix.',
      'Honest take: ManyChat is overpriced for what it does. I built ours in 14 days using Claude.',
      'No emojis in code. No "thrilled to announce". Just builds.',
    ],
    style_notes: 'Direct, casual, no buzzwords, occasional Hinglish ("yaar"), blunt opinions, no fake humility, short sentences, no emojis.',
  },
  {
    name: 'India beauty/lifestyle creator',
    niche: 'Beauty, skin, fashion, Hindi-mix audience',
    voice_samples: [
      'Heyy babes! 💄 So many of you asked about my lipstick — it\'s the Sugar Matte 04, link in bio rn 💕',
      'Okayyy so wedding season is HERE 🌟 dropped my saree picks today, swipe up 👆',
      'Itne sweet messages aaye guys 🥺 thank you so so much for the love on yesterday\'s reel ✨',
      'Quick GRWM coming today 🤍 wearing my fav drugstore foundation — comment FOUNDATION below for the link!',
    ],
    style_notes: 'Warm, emoji-heavy, Hinglish casual, exclamation marks, terms of endearment ("babes", "guys"), gentle direct CTAs.',
  },
  {
    name: 'Fitness coach (English-speaking, urban)',
    niche: 'Strength training, nutrition, men 25-40',
    voice_samples: [
      'Stop training to failure on every set. Most of your gains live in the 2-3 reps before failure.',
      'Bench plateau? 9/10 times it\'s your setup, not your weight. Arch, retract, leg drive. Fix that first.',
      'No more cardio bro-science. Walk 8k steps. Lift 4x/wk. Sleep 7+ hrs. Done.',
      'Comment PLAN below — I\'ll send my free 4-day split + my nutrition cheat sheet.',
    ],
    style_notes: 'Authoritative, short punchy sentences, gym-bro casual without being cringe, data-driven, no emojis except occasional 💪.',
  },
  {
    name: 'Food creator (vegetarian, Indian)',
    niche: 'Veg recipes, easy cooking, India',
    voice_samples: [
      'Aaj banaya — paneer butter masala in ONE pan, 25 minutes! Pure desi flavors, mess-free 🍅',
      'Guys swear ye recipe try karo aapko pasand aayegi. Comment PANEER for the full recipe in DM.',
      'No fancy ingredients. Sirf 5 cheezein chahiye. Result restaurant jaisa hai I promise.',
      'Made this twice this week already! My mother-in-law approved 😄 link in bio for the written recipe.',
    ],
    style_notes: 'Hinglish (mostly Hindi with English food terms), warm/family-oriented, food emoji, exclamations, third-person sometimes ("my mother-in-law"), simple CTAs.',
  },
  {
    name: 'SaaS founder (technical, US audience)',
    niche: 'Devtools, indie SaaS, technical writing',
    voice_samples: [
      'Spent 3 days debugging a 2-line race condition. The audacity of async/await.',
      'OSS is great until you maintain 8 repos and realise you\'re unpaid customer support.',
      'PostHog migration finally done. 40% drop in event volume. Most of our "analytics" was noise.',
      'Reply with REPO and I\'ll send the open-source template I just released.',
    ],
    style_notes: 'Dry, self-aware, technical references, occasional dark humor about engineering, no emojis, short paragraphs.',
  },
];

const TEST_COMMENT = 'Comment: "this looks amazing, where can I get the link?"';

async function generateDm(creator: CreatorProfile): Promise<string> {
  const prompt = `You are writing an Instagram DM reply on behalf of a creator. Their style and voice are described below — you MUST match it. The DM should feel like they typed it personally, not like a bot.

# Creator: ${creator.name}
# Niche: ${creator.niche}

# Style notes:
${creator.style_notes}

# Their actual past writing (these are their words — match the tone, length, vocabulary, emoji usage exactly):
${creator.voice_samples.map((s, i) => `${i + 1}. "${s}"`).join('\n')}

# Now write a SHORT DM (1-3 sentences) replying to this incoming comment:
${TEST_COMMENT}

Rules:
- Match the creator's tone EXACTLY (casual/professional, emoji use, Hinglish vs English, sentence length)
- Don't introduce phrases the creator wouldn't use
- Don't be generic ("Hi! Here is the link!" → bad)
- Sound like a real human reply, not a bot template
- One link placeholder allowed: <LINK> — we'll replace at send time

Output ONLY the DM body. No explanations, no quotes.`;

  const res = await claude.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = res.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}

const GENERIC = `Hi @user! 👋 Thanks so much for your comment! Here's the link you asked for: <LINK>. Let me know if you have any questions! 😊`;

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  AUTODM VOICE-CLONE — research prototype');
  console.log('  Each creator gets 1 generic ManyChat-style DM vs 1 voice-cloned DM');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const creator of CREATORS) {
    process.stdout.write(`▸ ${creator.name}\n`);
    process.stdout.write(`  niche: ${creator.niche}\n`);
    try {
      const cloned = await generateDm(creator);
      console.log('\n  GENERIC (what ManyChat sends):');
      console.log('  ' + GENERIC.replace(/\n/g, '\n  '));
      console.log('\n  VOICE-CLONED (StackPicks AutoDM):');
      console.log('  ' + cloned.replace(/\n/g, '\n  '));
    } catch (e) {
      console.log(`  ✗ failed: ${(e as Error).message}`);
    }
    console.log('\n' + '─'.repeat(63) + '\n');
  }

  console.log('Judge each pair: does the voice-cloned version sound like THAT specific');
  console.log('creator wrote it personally? If yes for 4+ out of 5 → ship the feature.');
  console.log('If unclear/robotic on 2+ → drop the Pro-tier price anchor on voice clone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
