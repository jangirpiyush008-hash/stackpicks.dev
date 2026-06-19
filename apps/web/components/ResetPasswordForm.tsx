'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { getSupabaseBrowser } from '../lib/supabase-browser';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error' | 'no-session'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Supabase puts the recovery session in cookies after the user clicks the email link.
  // If there's no active session here, the link was either expired or already used.
  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase.auth.getSession();
      if (!data.session) setStatus('no-session');
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Kill any other live sessions (stolen laptop, old phone). Failure
      // is non-fatal — the password change itself still succeeded.
      try {
        await fetch('/api/auth/invalidate-other-sessions', { method: 'POST' });
      } catch { /* swallow */ }
      setStatus('done');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update password');
      setStatus('error');
    }
  };

  if (status === 'no-session') {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-400/5 p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Reset link expired or invalid</h2>
        <p className="text-muted text-sm mb-4">
          This password-reset link is no longer valid. Reset links expire in 1 hour and only work
          once.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
          <Check className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-xl font-bold mb-2">Password updated</h2>
        <p className="text-muted text-sm">Redirecting you to your dashboard…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          New password
        </span>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </label>

      <label className="block">
        <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Confirm password
        </span>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
          className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition"
        />
      </label>

      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
        Set new password
      </button>
    </form>
  );
}
