'use client';

/**
 * Re-sync Instagram connection — re-asserts Meta webhook subscriptions
 * (comments, live_comments, messages, mentions) without a full reconnect.
 *
 * Use cases: backfill live_comments for older tenants, recover from a
 * silently-dropped Meta subscription. Calls POST /api/autodm/resubscribe.
 */

import { useState } from 'react';
import { RefreshCw, Loader2, Check, X } from 'lucide-react';

export function ResyncButton({ variant = 'subtle' }: { variant?: 'subtle' | 'accent' }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function go() {
    setState('busy');
    setMsg('');
    try {
      const res = await fetch('/api/autodm/resubscribe', { method: 'POST' });
      const j = await res.json();
      if (j.ok) setState('ok');
      else { setMsg((j.error || 'failed').slice(0, 80)); setState('err'); }
    } catch (e) {
      setMsg((e as Error).message.slice(0, 80)); setState('err');
    }
    setTimeout(() => setState('idle'), 4000);
  }

  const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition';
  const skin = variant === 'accent'
    ? 'bg-accent text-bg hover:bg-accent/90'
    : 'bg-bg-card border border-border text-muted hover:text-text';

  return (
    <button onClick={go} disabled={state === 'busy'} className={`${base} ${skin} disabled:opacity-50`}
      title={state === 'err' ? msg : 'Re-sync Instagram webhooks (adds Live comments, fixes dropped connections)'}>
      {state === 'busy' && <Loader2 className="w-3 h-3 animate-spin" />}
      {state === 'ok' && <Check className="w-3 h-3 text-emerald-500" />}
      {state === 'err' && <X className="w-3 h-3 text-rose-400" />}
      {state === 'idle' && <RefreshCw className="w-3 h-3" />}
      {state === 'ok' ? 'Synced' : state === 'err' ? 'Failed' : state === 'busy' ? 'Syncing…' : 'Re-sync connection'}
    </button>
  );
}
