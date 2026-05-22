'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Loader2 } from 'lucide-react';

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  is_member: boolean;
  plan_id: string | null;
  razorpay_payment_id: string | null;
  amount_inr: number | null;
  member_since: string | null;
}

export function AdminUserRow({ row }: { row: UserRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const run = async (action: 'grant' | 'revoke') => {
    const word = action === 'grant' ? 'GRANT lifetime access' : 'REVOKE lifetime access';
    if (!confirm(`${word} for ${row.email}?`)) return;
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: row.id }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setErr(body.error || 'Failed');
        setBusy(false);
        return;
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Network error');
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_120px_120px_180px] gap-3 px-4 py-3 items-center hover:bg-surface/40 transition">
      <div className="min-w-0">
        <div className="font-mono text-sm truncate">{row.email}</div>
        <div className="text-[10px] text-muted/60 font-mono truncate">{row.id}</div>
        {row.razorpay_payment_id && (
          <div className="text-[10px] text-muted/60 font-mono truncate mt-0.5">
            {row.razorpay_payment_id}{row.amount_inr ? ` · ₹${Math.round(row.amount_inr / 100)}` : ''}
          </div>
        )}
      </div>

      <div>
        {row.is_member ? (
          <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-1 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Lifetime
          </span>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-1 rounded-full">
            Free
          </span>
        )}
      </div>

      <div className="text-xs text-muted font-mono">
        {new Date(row.created_at).toLocaleDateString('en-IN')}
      </div>

      <div className="flex justify-end gap-2">
        {row.is_member ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run('revoke')}
            className="px-3 py-1.5 rounded text-xs border border-red-500/40 text-red-300 hover:bg-red-500/10 transition disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
            Revoke
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => run('grant')}
            className="px-3 py-1.5 rounded text-xs bg-accent text-bg font-semibold hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Grant lifetime
          </button>
        )}
      </div>

      {err && <div className="col-span-4 text-xs text-red-400 -mt-1">{err}</div>}
    </div>
  );
}
