'use client';

/**
 * Voice match card — runs the lexical fingerprint eval and surfaces
 * a 0-100 score with grade, signature phrases, and improvement notes.
 *
 * Server endpoint: /api/autodm/voice-eval (tenant-scoped via cookie).
 * Cheap to run — no Anthropic calls, all string math. Creator can
 * re-check after editing templates and see the score move.
 *
 * Honesty: when fewer than 5 templates or 0 sent DMs exist, we surface
 * "not enough data yet" instead of inventing a score.
 */

import { useState } from 'react';
import { Sparkles, RefreshCw, Loader2, Quote } from 'lucide-react';

interface EvalResult {
  fingerprint: {
    sample_count: number;
    avg_word_count: number;
    avg_emoji_count: number;
    signature_phrases: string[];
    top_openers: string[];
  };
  summary: {
    overallScore: number;
    grade: 'excellent' | 'good' | 'okay' | 'weak' | 'no-data';
    notes: string[];
  };
  samples_scored: number;
  sample_breakdown: { text: string; wordCount: number; score: number }[];
}

export function VoiceMatchCard() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/autodm/voice-eval');
      const j = await res.json();
      if (j.ok) setResult(j as EvalResult);
      else setErr(j.error || 'eval failed');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-card/30 p-5 mb-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-mono uppercase tracking-widest text-muted">// voice match</h3>
          </div>
          <p className="text-sm text-text mt-1.5 max-w-md">
            Score how closely your bot&apos;s sent DMs match your historical voice — word length,
            signature phrases, emoji habits, openers. Pure analysis, no AI calls.
          </p>
        </div>
        <button
          onClick={run}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent text-bg hover:bg-accent/90 px-3.5 py-2 rounded-full disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {result ? 'Re-check' : 'Check voice match'}
        </button>
      </div>

      {err && (
        <div className="mt-4 text-xs text-rose-300 bg-rose-500/5 border border-rose-500/20 rounded px-3 py-2">
          {err}
        </div>
      )}

      {result && result.summary.grade === 'no-data' && (
        <div className="mt-4 text-xs text-muted bg-bg-card/40 border border-border rounded px-3 py-3">
          Not enough data yet. The bot needs to send some DMs first — come back after a few comments
          have triggered rules.
        </div>
      )}

      {result && result.summary.grade !== 'no-data' && (
        <div className="mt-4 space-y-4">
          {/* Score header */}
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-extrabold tabular-nums ${gradeColor(result.summary.grade)}`}>
              {result.summary.overallScore}
              <span className="text-xl text-muted/60">/100</span>
            </div>
            <div>
              <GradeBadge grade={result.summary.grade} />
              <div className="text-[10px] text-muted mt-1">
                Scored {result.samples_scored} sent DMs against {result.fingerprint.sample_count} voice samples
              </div>
            </div>
          </div>

          {/* Fingerprint summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-border bg-bg-card/40 p-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">avg words</div>
              <div className="text-lg font-bold mt-0.5">{result.fingerprint.avg_word_count}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg-card/40 p-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">avg emojis</div>
              <div className="text-lg font-bold mt-0.5">{result.fingerprint.avg_emoji_count}</div>
            </div>
          </div>

          {/* Signature phrases */}
          {result.fingerprint.signature_phrases.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5">
                // signature phrases
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.fingerprint.signature_phrases.slice(0, 8).map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono">
                    <Quote className="w-2.5 h-2.5" />{p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {result.summary.notes.length > 0 && (
            <ul className="text-xs text-muted space-y-1.5">
              {result.summary.notes.map((n, i) => (
                <li key={i} className="flex gap-2"><span className="text-accent">→</span>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function GradeBadge({ grade }: { grade: 'excellent' | 'good' | 'okay' | 'weak' }) {
  const label = { excellent: 'Excellent match', good: 'Good match', okay: 'Okay match', weak: 'Weak match' }[grade];
  const cls = {
    excellent: 'bg-accent/15 text-accent',
    good: 'bg-emerald-500/15 text-emerald-400',
    okay: 'bg-amber-500/15 text-amber-500',
    weak: 'bg-rose-500/15 text-rose-400',
  }[grade];
  return <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold ${cls}`}>{label}</span>;
}

function gradeColor(grade: 'excellent' | 'good' | 'okay' | 'weak' | 'no-data'): string {
  switch (grade) {
    case 'excellent': return 'text-accent';
    case 'good': return 'text-emerald-400';
    case 'okay': return 'text-amber-500';
    case 'weak': return 'text-rose-400';
    default: return 'text-muted';
  }
}
