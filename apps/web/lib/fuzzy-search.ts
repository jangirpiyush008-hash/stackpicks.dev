import { SEED_REPOS, ownerOf, nameOf } from './preview-source';
import { CATEGORIES } from './categories';
import { INTENT_GROUPS } from './intent-presets';

/**
 * Tiny Levenshtein distance — number of single-character edits to turn a into b.
 * Used to surface "did you mean…?" suggestions when the user's query returns 0 hits.
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : Math.min(prev + 1, dp[j] + 1, dp[j - 1] + 1);
      prev = tmp;
    }
  }
  return dp[b.length];
}

export interface Suggestion {
  label: string;           // human-readable
  query: string;           // value to route to /preview?q=
  kind: 'repo' | 'category' | 'intent';
  distance: number;
}

/**
 * For a no-match query, return up to N closest plausible terms.
 * Looks across repo names, owner/name slugs, category names, intent presets.
 */
export function suggestForQuery(rawQuery: string, max = 5): Suggestion[] {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return [];

  const seen = new Set<string>();
  const candidates: Suggestion[] = [];

  const consider = (label: string, query: string, kind: Suggestion['kind']) => {
    const key = `${kind}::${query}`;
    if (seen.has(key)) return;
    const cmp = label.toLowerCase();
    // Also accept partial substring matches as low-distance candidates
    const subDistance = cmp.includes(q) || q.includes(cmp) ? 0 : -1;
    const d = subDistance === 0 ? 0 : levenshtein(q, cmp);
    // Skip if too far for short queries (avoid garbage suggestions)
    const maxAllowed = Math.max(2, Math.floor(cmp.length / 2));
    if (d > maxAllowed && subDistance < 0) return;
    seen.add(key);
    candidates.push({ label, query, kind, distance: d });
  };

  for (const r of SEED_REPOS) {
    const name = nameOf(r);
    consider(name, name, 'repo');
    consider(r.full_name, r.full_name, 'repo');
    consider(ownerOf(r), ownerOf(r), 'repo');
  }

  for (const c of CATEGORIES) {
    consider(c.name, c.slug, 'category');
    consider(c.slug, c.slug, 'category');
  }

  for (const g of INTENT_GROUPS) {
    for (const item of g.items) {
      consider(item.label, item.query, 'intent');
    }
  }

  return candidates
    .sort((a, b) => a.distance - b.distance || a.label.length - b.label.length)
    .slice(0, max);
}
