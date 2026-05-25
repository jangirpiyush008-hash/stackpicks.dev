'use client';

// Anonymous upvote button — no login, no auth, IP-hashed dedup server-side.
//
// UX rules:
// - Optimistic: count bumps the moment the user clicks; we reconcile with the
//   server response after. No spinner — feels instant.
// - localStorage marks the repo as voted-today so a refresh doesn't re-show
//   the un-clicked state. Cleared automatically when the IST day rolls over.
// - If the server rejects (already voted today from another tab / device), we
//   trust the returned count and keep the "voted" visual state.

import { useEffect, useState } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

interface Props {
  repoId: string;
  initialCount: number;
  /** Compact card variant — small button, count inline. */
  compact?: boolean;
}

const VOTED_KEY = (repoId: string, daystamp: string) => `sp:vote:${daystamp}:${repoId}`;

function istDaystamp(): string {
  // Matches dailySalt() in core/utils — IST midnight rotation
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

export function UpvoteButton({ repoId, initialCount, compact = false }: Props) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [pending, setPending] = useState(false);

  // Hydrate "already voted today" state from localStorage on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = VOTED_KEY(repoId, istDaystamp());
      if (window.localStorage.getItem(key) === '1') setVoted(true);
    } catch { /* localStorage blocked — ignore */ }
  }, [repoId]);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (voted || pending) return;

    setPending(true);
    setVoted(true);
    setCount((c) => c + 1); // optimistic

    try {
      const res = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_id: repoId }),
      });
      const data = await res.json().catch(() => null);
      if (data && typeof data.count === 'number') {
        // Reconcile with server truth — handles the case where another tab
        // already voted today and our optimistic +1 was wrong.
        setCount(data.count);
      }
      try {
        window.localStorage.setItem(VOTED_KEY(repoId, istDaystamp()), '1');
      } catch { /* ignore */ }

      // Fire analytics if PostHog is loaded — we want to see upvote conversion.
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('repo_upvoted', { repo_id: repoId, count: data?.count ?? count + 1 });
      }
    } catch (err) {
      // Network error: revert optimistic state
      console.error('upvote failed:', err);
      setVoted(false);
      setCount((c) => Math.max(0, c - 1));
    } finally {
      setPending(false);
    }
  }

  const base = 'inline-flex items-center gap-1.5 font-mono transition border rounded-lg';
  const tone = voted
    ? 'border-accent/60 bg-accent/10 text-accent'
    : 'border-border bg-surface/40 text-muted hover:border-accent/60 hover:text-text';
  const size = compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={voted || pending}
      aria-pressed={voted}
      aria-label={voted ? `Upvoted — ${count} total` : `Upvote — ${count} total`}
      title={voted ? 'You upvoted this today' : 'Upvote this repo'}
      className={`${base} ${tone} ${size} ${voted ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {pending
        ? <Loader2 className={compact ? 'w-3 h-3 animate-spin' : 'w-3.5 h-3.5 animate-spin'} />
        : <ArrowUp className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{count}</span>
    </button>
  );
}
