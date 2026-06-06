/**
 * Voice-clone evaluation harness.
 *
 * The product's whole moat is "Claude clones your voice." Without a
 * measurement, that's marketing — and creators won't trust the bot
 * to send DMs unsupervised. This harness gives them (and us) a number.
 *
 * Approach: lexical fingerprint match.
 * For each creator we extract a voice fingerprint from their actual
 * past replies — top tokens, sentence length, emoji frequency, signature
 * phrases (bigrams), opener vocabulary. Then we generate sample DMs
 * with Claude using their voice style sheet, score each generated
 * sample against the fingerprint, and return a composite 0-100.
 *
 * This is NOT a semantic similarity score (those need embeddings +
 * costly inference). It's a behavioural fingerprint — does the
 * generated text *sound* like them by counted tokens, openers, length?
 * Good enough as a sanity gate before sending unsupervised.
 *
 * Run via /api/autodm/voice-eval (creator triggers from dashboard,
 * tenant-scoped). Surfaces the score, the matched signature phrases,
 * and the deltas (e.g. "Generated DMs avg 18 words; your real replies
 * avg 11 — too verbose").
 */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
  'i', 'you', 'we', 'they', 'he', 'she', 'it', 'me', 'my', 'your',
  'this', 'that', 'these', 'those', 'to', 'of', 'in', 'on', 'at',
  'for', 'with', 'by', 'from', 'as', 'be', 'so', 'do', 'does', 'did',
  'have', 'has', 'had', 'will', 'would', 'should', 'could', 'can',
]);

export interface VoiceFingerprint {
  sampleCount: number;
  avgWordCount: number;
  avgEmojiCount: number;
  signatureBigrams: string[];   // top non-stopword bigrams
  topTokens: string[];          // top 20 non-stopword unigrams
  topOpeners: string[];         // most-used first words ("hey", "yo")
  hasEmojis: boolean;
}

const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

export function buildFingerprint(samples: string[]): VoiceFingerprint {
  const clean = samples.map((s) => s.trim()).filter((s) => s.length > 3);
  if (!clean.length) {
    return {
      sampleCount: 0, avgWordCount: 0, avgEmojiCount: 0,
      signatureBigrams: [], topTokens: [], topOpeners: [], hasEmojis: false,
    };
  }

  let totalWords = 0, totalEmojis = 0;
  const tokenCounts = new Map<string, number>();
  const bigramCounts = new Map<string, number>();
  const openerCounts = new Map<string, number>();

  for (const s of clean) {
    const emojis = s.match(EMOJI_RE) ?? [];
    totalEmojis += emojis.length;

    const words = tokenize(s);
    totalWords += words.length;

    if (words.length > 0) {
      const opener = words[0].toLowerCase();
      openerCounts.set(opener, (openerCounts.get(opener) ?? 0) + 1);
    }

    for (const w of words) {
      const k = w.toLowerCase();
      if (STOP_WORDS.has(k) || k.length < 3) continue;
      tokenCounts.set(k, (tokenCounts.get(k) ?? 0) + 1);
    }
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i].toLowerCase();
      const b = words[i + 1].toLowerCase();
      if (STOP_WORDS.has(a) && STOP_WORDS.has(b)) continue;
      const bg = `${a} ${b}`;
      bigramCounts.set(bg, (bigramCounts.get(bg) ?? 0) + 1);
    }
  }

  return {
    sampleCount: clean.length,
    avgWordCount: totalWords / clean.length,
    avgEmojiCount: totalEmojis / clean.length,
    hasEmojis: totalEmojis > 0,
    topTokens: topN(tokenCounts, 20),
    signatureBigrams: topN(bigramCounts, 10).filter((b) => (bigramCounts.get(b) ?? 0) >= 2),
    topOpeners: topN(openerCounts, 5),
  };
}

export interface SampleScore {
  text: string;
  wordCount: number;
  emojiCount: number;
  matchedTokens: number;
  matchedBigrams: number;
  matchedOpener: boolean;
  score: number;             // 0-100
}

export function scoreSample(text: string, fp: VoiceFingerprint): SampleScore {
  const words = tokenize(text);
  const lower = words.map((w) => w.toLowerCase());
  const emojiCount = (text.match(EMOJI_RE) ?? []).length;

  const tokenSet = new Set(fp.topTokens);
  const matchedTokens = lower.filter((w) => tokenSet.has(w)).length;

  let matchedBigrams = 0;
  for (let i = 0; i < lower.length - 1; i++) {
    if (fp.signatureBigrams.includes(`${lower[i]} ${lower[i + 1]}`)) matchedBigrams++;
  }

  const matchedOpener = lower.length > 0 && fp.topOpeners.includes(lower[0]);

  // Length penalty: any sample that's >2× or <0.5× the creator's avg
  // word count loses up to 30 points. Linear inside the band.
  const lenDelta = fp.avgWordCount > 0
    ? Math.abs(words.length - fp.avgWordCount) / fp.avgWordCount
    : 0;
  const lenScore = Math.max(0, 30 - Math.min(30, lenDelta * 30));

  // Emoji match: 0 / 1 / 2 emojis when creator uses them, similar
  // count when they don't. Worth 20 points.
  let emojiScore = 0;
  if (fp.hasEmojis && emojiCount > 0) emojiScore = 20;
  else if (!fp.hasEmojis && emojiCount === 0) emojiScore = 20;
  else if (fp.hasEmojis && emojiCount === 0) emojiScore = 6;
  else emojiScore = 6; // creator-clean + AI added emoji

  // Vocabulary alignment: capped contributions
  const tokenScore = Math.min(25, matchedTokens * 5);
  const bigramScore = Math.min(15, matchedBigrams * 8);
  const openerScore = matchedOpener ? 10 : 0;

  const total = Math.round(lenScore + emojiScore + tokenScore + bigramScore + openerScore);
  return {
    text,
    wordCount: words.length,
    emojiCount,
    matchedTokens,
    matchedBigrams,
    matchedOpener,
    score: Math.min(100, total),
  };
}

export function summariseEval(samples: SampleScore[], fp: VoiceFingerprint) {
  if (samples.length === 0) {
    return {
      overallScore: 0,
      grade: 'no-data' as const,
      notes: ['No generated samples to score.'],
    };
  }
  const overall = Math.round(samples.reduce((s, x) => s + x.score, 0) / samples.length);
  const avgGen = samples.reduce((s, x) => s + x.wordCount, 0) / samples.length;

  const notes: string[] = [];
  if (fp.sampleCount < 5) {
    notes.push(`Only ${fp.sampleCount} historical replies analysed — fingerprint is weak. Score will improve as the bot collects more reply data.`);
  }
  if (avgGen > fp.avgWordCount * 1.5 && fp.avgWordCount > 4) {
    notes.push(`Generated DMs avg ${Math.round(avgGen)} words; your real replies avg ${Math.round(fp.avgWordCount)}. Too verbose — consider editing rule templates shorter.`);
  } else if (avgGen < fp.avgWordCount * 0.6) {
    notes.push(`Generated DMs avg ${Math.round(avgGen)} words; your real replies avg ${Math.round(fp.avgWordCount)}. Possibly too terse for your style.`);
  }
  if (fp.hasEmojis && samples.every((s) => s.emojiCount === 0)) {
    notes.push('Your historical replies use emojis but the generated samples don\'t. Add an emoji to your DM template.');
  }
  if (!fp.hasEmojis && samples.some((s) => s.emojiCount > 0)) {
    notes.push('Generated samples added emojis, but your real replies don\'t use them. Remove emojis from rule templates.');
  }
  if (notes.length === 0) {
    notes.push('Voice match looks solid. The bot speaks like you.');
  }

  const grade: 'excellent' | 'good' | 'okay' | 'weak' =
    overall >= 80 ? 'excellent' :
    overall >= 65 ? 'good' :
    overall >= 50 ? 'okay' : 'weak';

  return { overallScore: overall, grade, notes };
}

// ── helpers ──────────────────────────────────────────────────────────

function tokenize(s: string): string[] {
  return s
    .replace(EMOJI_RE, ' ')
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function topN(counts: Map<string, number>, n: number): string[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}
