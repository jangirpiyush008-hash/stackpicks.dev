'use client';

import { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseBrowser } from '../lib/supabase-browser';

// Always reset-password back on the live site.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stackpicks.dev';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/reset-password`,
      });
      if (error) throw error;
      setStatus('sent');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not send reset link');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
          <Check className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-xl font-bold mb-2">Reset link sent</h2>
        <p className="text-muted text-sm mb-4">
          We emailed a password reset link to{' '}
          <span className="font-mono text-text">{email}</span>. Click it to set a new password —
          the link expires in 1 hour.
        </p>
        <p className="text-xs text-muted">
          Didn&apos;t get it? Check spam, or{' '}
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-accent underline underline-offset-2"
          >
            try a different email
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@startup.com"
          autoComplete="email"
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
        Send reset link
      </button>

      <p className="text-center text-xs text-muted pt-2">
        Remembered it?{' '}
        <Link href="/login" className="text-accent underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}
