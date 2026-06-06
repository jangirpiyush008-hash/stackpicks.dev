/**
 * Epsilon-greedy variant picker for DM A/B testing.
 *
 * Behaviour:
 *   • cold start (< MIN_SENDS_FOR_LEARNING total sends, or any variant
 *     has 0 sends): uniform random — pure exploration.
 *   • warm: with probability EPSILON, explore (random); otherwise
 *     exploit (pick the highest smoothed CTR).
 *
 * Smoothing: we use Laplace smoothing (add 1 click + 2 sent to every
 * variant's denominator) so:
 *   • a brand-new variant doesn't get permanently shut out by a 1-for-1
 *     winner that just got lucky
 *   • a 0-click 50-send variant isn't treated as identical to a never-
 *     tested variant
 *
 * This is the "exploit but keep checking" strategy. We do NOT do full
 * Thompson sampling — the variance machinery isn't worth it at the
 * volumes individual creators see.
 */

export const EPSILON = 0.20;                  // 20% exploration rate
export const MIN_SENDS_FOR_LEARNING = 30;     // below this, pure random
export const LAPLACE_K = 2;                   // virtual non-clicks per variant
export const LAPLACE_A = 1;                   // virtual clicks per variant

export interface VariantPerf {
  index: number;
  sent: number;
  clicks: number;
}

/**
 * Pick a variant index given the current rule's variant pool and the
 * per-variant performance so far.
 *
 * @param variantCount      number of variants in the rule (>=1)
 * @param perf              per-variant {sent, clicks} so far (sparse — missing
 *                          indices are treated as zero)
 * @param rand              optional rng for tests; defaults to Math.random
 */
export function pickVariant(
  variantCount: number,
  perf: VariantPerf[] | Record<number, { sent: number; clicks: number }>,
  rand: () => number = Math.random,
): number {
  if (variantCount <= 1) return 0;

  // Normalize perf into an array indexed 0..variantCount-1
  const arr = Array.from({ length: variantCount }, (_, i): VariantPerf => {
    if (Array.isArray(perf)) {
      const m = perf.find((p) => p.index === i);
      return { index: i, sent: m?.sent ?? 0, clicks: m?.clicks ?? 0 };
    }
    const m = perf[i];
    return { index: i, sent: m?.sent ?? 0, clicks: m?.clicks ?? 0 };
  });

  const totalSent = arr.reduce((s, v) => s + v.sent, 0);
  const anyUntested = arr.some((v) => v.sent === 0);

  // Cold-start: pure exploration until we have signal
  if (totalSent < MIN_SENDS_FOR_LEARNING || anyUntested) {
    return Math.floor(rand() * variantCount);
  }

  // Exploration sometimes — keeps a long-tail variant from being permanently abandoned
  if (rand() < EPSILON) {
    return Math.floor(rand() * variantCount);
  }

  // Exploit: pick highest smoothed CTR. Tie-break by lowest sent count
  // so under-explored options get a tilt in their favor.
  let bestIdx = 0;
  let bestCtr = -1;
  for (const v of arr) {
    const ctr = (v.clicks + LAPLACE_A) / (v.sent + LAPLACE_A + LAPLACE_K);
    if (ctr > bestCtr || (ctr === bestCtr && v.sent < arr[bestIdx].sent)) {
      bestIdx = v.index;
      bestCtr = ctr;
    }
  }
  return bestIdx;
}

/**
 * Compute a per-variant CTR table for surfacing in the UI. Includes a
 * winner-marker flag for the leader once it has enough data.
 */
export function variantLeaderboard(
  perfs: VariantPerf[],
): Array<VariantPerf & { ctr: number; smoothedCtr: number; isWinner: boolean }> {
  const total = perfs.reduce((s, v) => s + v.sent, 0);
  const rows = perfs.map((p) => ({
    ...p,
    ctr: p.sent ? p.clicks / p.sent : 0,
    smoothedCtr: (p.clicks + LAPLACE_A) / (p.sent + LAPLACE_A + LAPLACE_K),
    isWinner: false,
  }));
  if (total < MIN_SENDS_FOR_LEARNING) return rows;

  // Winner = highest smoothed CTR AND has at least 10 sends of its own
  const winner = rows
    .filter((r) => r.sent >= 10)
    .sort((a, b) => b.smoothedCtr - a.smoothedCtr)[0];
  if (winner) winner.isWinner = true;
  return rows;
}
