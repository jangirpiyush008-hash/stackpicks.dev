'use client';

import { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export function ResendVerificationButton({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function resend() {
    setErr(null);
    setBusy(true);
    try {
      const supa = getSupabaseBrowser();
      const { error } = await supa.auth.resend({ type: 'signup', email });
      if (error) setErr(error.message);
      else setSent(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  if (sent) {
    return (
      <span className="inline-flex items-center gap-2 bg-accent/15 text-accent border border-accent/40 font-semibold px-5 py-2.5 rounded-full text-sm">
        <Check className="w-4 h-4" />
        Verification email sent
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={resend}
        disabled={busy || !email}
        className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-5 py-2.5 rounded-full hover:bg-accent/90 transition disabled:opacity-50 text-sm"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        {busy ? 'Sending…' : 'Resend verification email'}
      </button>
      {err && <p className="text-[11px] text-rose-400">{err}</p>}
    </div>
  );
}
