'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { getSupabaseBrowser } from '../lib/supabase-browser';

interface Props {
  mode: 'login' | 'signup';
}

const GoogleG = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.1A6.99 6.99 0 0 1 5.46 12c0-.73.13-1.44.36-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const supabase = getSupabaseBrowser();

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        setStatus('sent');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const signInWithGoogle = async () => {
    setStatus('submitting');
    setErrorMsg('');
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // Will redirect to Google
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Google sign-in failed');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-muted text-sm">
          We sent a confirmation link to <span className="font-mono text-text">{email}</span>.
          Click it to activate your account, then come back here to sign in.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-text/95 text-bg font-medium hover:bg-text transition disabled:opacity-50"
      >
        <GoogleG />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs font-mono uppercase text-muted">or email</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={submitEmail} className="space-y-3">
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
        <label className="block">
          <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Password
          </span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
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

        {errorMsg && (
          <p className="text-xs text-red-400">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-xs text-muted mt-5">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-accent underline underline-offset-2">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to StackPicks?{' '}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-accent underline underline-offset-2">
              Create account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
