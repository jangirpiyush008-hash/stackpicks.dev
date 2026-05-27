'use client';

import { useState } from 'react';
import { RotateCcw, Trash2, Check } from 'lucide-react';

interface Props {
  id: string;
  provider: string;
  providerName: string;
  accountLabel: string;
  status: string;
  connectedAt: string;
  lastUsedAt: string | null;
}

/**
 * One row in /dashboard/connections. Self-contained — disconnect button
 * mutates server state and reloads. Keeps the parent server-component clean.
 */
export function ConnectionRow({
  provider,
  providerName,
  accountLabel,
  status,
  connectedAt,
  lastUsedAt,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function disconnect() {
    setBusy(true);
    try {
      await fetch(`/api/connect/${provider}/disconnect`, { method: 'POST' });
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  function reconnect() {
    window.location.href = `/api/connect/${provider}/start`;
  }

  return (
    <div className="rounded-xl border border-border bg-surface/30 p-4 flex items-center gap-4 flex-wrap">
      <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center font-bold">
        {providerName.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-[180px]">
        <div className="font-semibold text-sm">{providerName}</div>
        <div className="text-xs text-muted">{accountLabel}</div>
      </div>
      <div className="text-[10px] font-mono text-muted">
        <div>connected {timeAgo(connectedAt)}</div>
        {lastUsedAt && <div>last used {timeAgo(lastUsedAt)}</div>}
      </div>
      <div>
        {status === 'active' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" />
            Active
          </span>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
            {status}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reconnect}
          disabled={busy}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-border hover:border-accent/50 text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          Reconnect
        </button>
        <button
          type="button"
          onClick={() => (confirmDelete ? disconnect() : setConfirmDelete(true))}
          disabled={busy}
          className={`inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border text-xs transition ${
            confirmDelete
              ? 'border-red-500/60 bg-red-500/10 text-red-300'
              : 'border-border hover:border-red-500/40 text-muted hover:text-red-300'
          }`}
        >
          <Trash2 className="w-3 h-3" />
          {confirmDelete ? 'Confirm' : 'Disconnect'}
        </button>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
