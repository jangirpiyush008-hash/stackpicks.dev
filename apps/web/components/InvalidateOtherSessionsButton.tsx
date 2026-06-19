'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

export function InvalidateOtherSessionsButton() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    if (!confirm('Sign out everywhere else? This will end any other live sessions immediately.')) return;
    setErr(null); setBusy(true);
    try {
      const r = await fetch('/api/auth/invalidate-other-sessions', { method: 'POST' });
      const j = (await r.json()) as { ok: boolean; error?: string };
      if (j.ok) setDone(true);
      else setErr(j.error || 'failed');
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-accent">
        <Check className="w-3.5 h-3.5" />
        Other sessions ended.
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="inline-flex items-center gap-1.5 border border-border text-text font-medium px-3 py-1.5 rounded-md text-xs hover:border-rose-500/40 hover:text-rose-300 transition disabled:opacity-50"
      >
        {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Sign out everywhere else
      </button>
      {err && <p className="text-[11px] text-rose-400">{err}</p>}
    </div>
  );
}
