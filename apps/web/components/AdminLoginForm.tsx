'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '../lib/supabase-browser';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [step, setStep] = useState<'idle' | 'auth' | 'verify' | 'granted'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    setErr('');
    setStep('auth');

    try {
      const supabase = getSupabaseBrowser();

      // 1) Authenticate via Supabase (same backend, different door)
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signErr) {
        setErr(`AUTH_FAIL: ${signErr.message}`);
        setStep('idle');
        setBusy(false);
        return;
      }

      // 2) Verify admin allowlist (server-side check via /api/me/membership has session)
      setStep('verify');
      const res = await fetch('/api/admin/whoami', { cache: 'no-store' });
      const body = await res.json();
      if (!body?.is_admin) {
        // Signed in but not admin — sign them back out and show clear error
        await supabase.auth.signOut();
        setErr('ACCESS_DENIED: account not authorized for admin console');
        setStep('idle');
        setBusy(false);
        return;
      }

      setStep('granted');
      setTimeout(() => router.push('/admin'), 800);
    } catch (e2) {
      setErr(e2 instanceof Error ? `SYSTEM_ERR: ${e2.message}` : 'SYSTEM_ERR: unknown');
      setStep('idle');
      setBusy(false);
    }
  };

  if (step === 'granted') {
    return (
      <div className="text-center py-4 text-accent">
        <pre className="text-[10px] leading-tight">
{`> AUTH_OK
> CLEARANCE: ROOT
> LOADING CONSOLE…`}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-1.5">
          <span className="text-accent">&gt;</span> operator_id
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          disabled={busy}
          placeholder="admin@stackpicks.dev"
          className="w-full px-3 py-2 bg-black/60 border border-accent/30 focus:border-accent text-accent placeholder-accent/30 text-sm font-mono outline-none rounded-sm disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-1.5">
          <span className="text-accent">&gt;</span> passphrase
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={busy}
          placeholder="••••••••••"
          className="w-full px-3 py-2 bg-black/60 border border-accent/30 focus:border-accent text-accent placeholder-accent/30 text-sm font-mono outline-none rounded-sm tracking-widest disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={busy || !email.trim() || !password}
        className="w-full py-2.5 bg-accent text-bg font-bold text-sm uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {step === 'auth' ? '> Authenticating…' :
         step === 'verify' ? '> Verifying Clearance…' :
         '> Initialize Session'}
      </button>

      {err && (
        <div className="p-2 border border-red-500/40 bg-red-500/10 rounded-sm">
          <pre className="text-[10px] text-red-300 whitespace-pre-wrap break-words">{err}</pre>
        </div>
      )}

      <div className="text-[10px] text-muted/60 leading-relaxed pt-2 border-t border-accent/10">
        <span className="text-accent/60">!</span> This is not the public sign-in page. Customer logins live at <span className="text-accent/70">/login</span>.
      </div>
    </form>
  );
}
