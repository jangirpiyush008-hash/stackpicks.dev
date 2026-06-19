'use client';

/**
 * Small disconnect button for the AutoDM dashboard. Hits
 * /api/autodm/disconnect to clear the active tenant's IG credentials
 * and reload, dropping the user back into the connect flow.
 *
 * Two-step confirmation since this is a destructive action — single
 * click shows the confirm state, second click commits.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';

export function DisconnectIgButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function disconnect() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3500); // auto-revert
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/autodm/disconnect', { method: 'POST' });
      const j = (await r.json()) as { ok: boolean; error?: string };
      if (j.ok) {
        router.refresh();
        // Push back to the connect page so the user sees the next-step UI
        window.location.href = '/autodm/connect';
      } else {
        alert(j.error || 'failed to disconnect');
        setBusy(false);
      }
    } catch (e) {
      alert((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <button
      onClick={disconnect}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-md border transition disabled:opacity-50 ${
        confirming
          ? 'border-rose-500/60 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20'
          : 'border-border text-muted hover:border-rose-500/40 hover:text-rose-300'
      }`}
      title="Disconnect this Instagram account from AutoDM"
    >
      {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
      {busy ? 'Disconnecting…' : confirming ? 'Click again to confirm' : 'Disconnect IG'}
    </button>
  );
}
