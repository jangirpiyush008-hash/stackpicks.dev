'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, Github } from 'lucide-react';
import { getSupabaseBrowser } from '../lib/supabase-browser';

type OAuthProvider = 'google' | 'github';

// Always redirect back to the live site, regardless of where the user clicked.
// Removes any dependency on window.location.origin which can be localhost in dev.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stackpicks.dev';

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

// Same-origin safety check — accept only relative paths starting with a
// single forward slash. Rejects protocol-relative URLs (//evil.com),
// absolute URLs (https://...), and control-character smuggling. Mirrors
// lib/security.isSafeNextPath() server-side.
function safeNextClient(raw: string | null): string {
  if (!raw || typeof raw !== 'string' || raw.length > 1024) return '/dashboard';
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/dashboard';
  if (/[\x00-\x1f]/.test(raw)) return '/dashboard';
  return raw;
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextClient(searchParams.get('next'));

  // Return to the SAME host the user is logging in from (so signing in on
  // autodm.stackpicks.dev lands back on the subdomain, not the main site).
  // Falls back to SITE_URL during SSR. Requires this origin's /auth/callback
  // to be in Supabase's allowed redirect URLs.
  const authOrigin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength: 12+ chars OR (8+ with both letter and digit). Blocks
  // the obvious "password1" / "12345678" combos without making sane long
  // passphrases ("correct horse battery staple") require digits.
  function passwordOk(pw: string): { ok: boolean; reason?: string } {
    if (pw.length < 8) return { ok: false, reason: 'Use at least 8 characters.' };
    if (pw.length >= 12) return { ok: true };
    const hasLetter = /[A-Za-z]/.test(pw);
    const hasDigit  = /\d/.test(pw);
    if (!hasLetter || !hasDigit) {
      return { ok: false, reason: 'Use 12+ characters, or 8+ with both letters and a number.' };
    }
    // Reject the most-common leaked passwords. Tiny built-in list — full
    // 1k-list would bulk the bundle; this catches obvious junk.
    const common = new Set([
      'password', 'password1', 'password123', '12345678', 'qwerty123',
      'letmein123', 'admin1234', 'welcome123', 'iloveyou', 'monkey123',
    ]);
    if (common.has(pw.toLowerCase())) return { ok: false, reason: 'That password is on the leaked-list. Pick something else.' };
    return { ok: true };
  }

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const startedAt = Date.now();

    const supabase = getSupabaseBrowser();

    try {
      if (mode === 'signup') {
        const pw = passwordOk(password);
        if (!pw.ok) { setErrorMsg(pw.reason ?? 'Weak password.'); setStatus('error'); return; }

        // Pre-flight: check the email is real (format + non-disposable +
        // has an MX record). Stops spam-signups against khjdf.com / temp
        // mailers BEFORE we ask Supabase to send a confirmation email
        // to nothingness.
        try {
          const vRes = await fetch('/api/auth/validate-email', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const v = (await vRes.json()) as { ok: boolean; reason?: string; suggestion?: string | null };
          if (!v.ok) {
            const msg =
              v.reason === 'disposable' ? `Disposable email addresses aren't allowed${v.suggestion ? ` — did you mean ${v.suggestion}?` : ''}.`
              : v.reason === 'no_mx'    ? `That email domain doesn't accept mail${v.suggestion ? ` — did you mean ${v.suggestion}?` : ''}.`
              : v.reason === 'format'   ? 'That email looks malformed.'
              : v.reason === 'rate_limited' ? 'Too many attempts. Wait a minute and try again.'
              : 'We couldn\'t verify that email. Try a different one.';
            setErrorMsg(msg);
            setStatus('error');
            return;
          }
        } catch {
          // Network blip / endpoint down — let Supabase do its own check.
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${authOrigin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        setStatus('sent');
      } else {
        // Sign-in path: equalise response time + uniform error message so
        // an attacker can't tell from timing or wording whether the email
        // exists (account-enumeration defence).
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        // Ensure the operation always takes at least ~1.2s, regardless of
        // outcome — Supabase's failure path is faster than the success
        // path (no profile lookup) which leaks email existence otherwise.
        const elapsed = Date.now() - startedAt;
        if (elapsed < 1200) {
          await new Promise((r) => setTimeout(r, 1200 - elapsed));
        }
        if (error) {
          // Uniform error — never reveals whether email exists.
          setErrorMsg('Email or password is incorrect.');
          setStatus('error');
          return;
        }
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      // Map Supabase's verbose signup errors to short, non-leaky messages.
      const raw = err instanceof Error ? err.message : 'Something went wrong';
      const msg =
        /already registered/i.test(raw) ? 'If this email is eligible, a sign-up link is on its way. Check your inbox.'
        : /password/i.test(raw) ? 'Use a stronger password — 12+ chars, or 8+ with letters + a number.'
        : raw;
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const signInWithProvider = async (provider: OAuthProvider) => {
    setStatus('submitting');
    setErrorMsg('');
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${authOrigin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // Will redirect to provider
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : `${provider} sign-in failed`);
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
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => signInWithProvider('google')}
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-text/95 text-bg font-medium text-sm hover:bg-text transition disabled:opacity-50"
        >
          <GoogleG />
          <span className="hidden sm:inline">Google</span>
          <span className="sm:hidden">Google</span>
        </button>
        <button
          type="button"
          onClick={() => signInWithProvider('github')}
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border text-text font-medium text-sm hover:bg-bg/60 hover:border-text/40 transition disabled:opacity-50"
        >
          <Github className="w-4 h-4" />
          GitHub
        </button>
      </div>

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
          <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5 justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Password
            </span>
            {mode === 'login' && (
              <Link href="/forgot-password" className="text-xs text-muted hover:text-accent transition">
                Forgot?
              </Link>
            )}
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
