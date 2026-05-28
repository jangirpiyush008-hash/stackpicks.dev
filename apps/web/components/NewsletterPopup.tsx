'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mail, X, Check, Sparkles } from 'lucide-react';
import { events } from '../lib/track';

const STORAGE_KEY = 'sp_newsletter_popup_dismissed';
const SHOW_DELAY_MS = 30_000; // 30s after page load OR exit-intent — whichever fires first

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    // Don't show on admin pages, auth flows, payment success
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') || pathname?.startsWith('/reset-') ||
        pathname?.startsWith('/forgot-') || pathname === '/dashboard') return;

    // Don't show if previously dismissed in last 7 days
    try {
      const ts = localStorage.getItem(STORAGE_KEY);
      if (ts && Date.now() - Number(ts) < 7 * 24 * 60 * 60 * 1000) return;
    } catch {/* ignore */}

    let timer: ReturnType<typeof setTimeout> | null = null;
    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    };

    // Timer trigger
    timer = setTimeout(trigger, SHOW_DELAY_MS);

    // Exit-intent trigger (mouse leaves top of viewport)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [pathname]);

  // Dismiss via ESC key when popup is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {/* ignore */}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error || 'Could not subscribe — try again');
        setStatus('error');
        return;
      }
      setStatus('done');
      events.newsletterSignup('popup');
      // Auto-close after 4 sec
      setTimeout(dismiss, 4000);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Network error');
      setStatus('error');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        // Click outside the dialog dismisses
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
        className="relative w-full max-w-md rounded-2xl border border-accent/40 bg-bg shadow-2xl shadow-accent/10 overflow-hidden"
      >
        {/* Close — bigger, more obvious */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close newsletter popup"
          className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-surface/80 hover:bg-red-500/20 text-muted hover:text-red-300 transition flex items-center justify-center border border-border hover:border-red-500/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lime accent glow */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 md:p-8">
          {status === 'done' ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">You're in.</h3>
              <p className="text-sm text-muted">
                First curator drop hits your inbox Sunday. No spam, ever.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent">
                  Weekly curator drop
                </span>
              </div>

              <h3 id="newsletter-title" className="text-2xl font-bold mb-2 tracking-tight">
                Get the one OSS tool worth your weekend.
              </h3>
              <p className="text-sm text-muted mb-5 leading-relaxed">
                Every Sunday: one curated open-source tool with the honest take you can't get from
                star counts or auto-generated listicles. ~2 min read.
              </p>

              <form onSubmit={submit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'sending'}
                    placeholder="you@yourdomain.com"
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-surface border border-border focus:border-accent outline-none text-sm transition disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending' || !email.trim()}
                  className="w-full py-3 rounded-lg bg-accent text-bg font-bold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Subscribing…' : 'Get the curator drop'}
                </button>

                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}

                <p className="text-[10px] text-muted/70 text-center">
                  Free · No spam · Unsubscribe anytime · One email every Sunday
                </p>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="text-xs text-muted hover:text-text underline underline-offset-2 transition"
                  >
                    Maybe later
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
