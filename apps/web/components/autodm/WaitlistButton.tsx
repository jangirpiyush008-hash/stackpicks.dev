'use client';

/**
 * Waitlist signup button + dialog for the coming-soon pages.
 *
 * Clicking the button opens a small modal with an email input. POSTs to
 * /api/autodm/waitlist with { email, platform }. The 100-creator / 50%
 * discount hook lives inside the modal so the button itself stays clean.
 */

import { useState, useEffect, useRef } from 'react';
import { Rocket, X as CloseIcon, Loader2, Check, Sparkles } from 'lucide-react';

type Platform = 'linkedin' | 'x';

const PLATFORM_NAME: Record<Platform, string> = {
  linkedin: 'LinkedIn',
  x: 'X',
};

export function WaitlistButton({
  platform,
  variant = 'primary',
  label,
}: {
  platform: Platform;
  variant?: 'primary' | 'glow';
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const platformName = PLATFORM_NAME[platform];

  const baseClass =
    'inline-flex items-center gap-2 bg-accent text-bg font-semibold px-5 py-3 rounded-full hover:bg-accent/90 transition';
  const glow = variant === 'glow' ? ' shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)]' : '';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={baseClass + glow}
      >
        <Rocket className="w-4 h-4" />
        {label ?? 'Join the waitlist for early access'}
      </button>
      {open && (
        <WaitlistDialog
          platform={platform}
          platformName={platformName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function WaitlistDialog({
  platform,
  platformName,
  onClose,
}: {
  platform: Platform;
  platformName: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on open + close on Escape
  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await fetch('/api/autodm/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), platform }),
      });
      const j = (await r.json()) as { ok: boolean; error?: string };
      if (!j.ok) {
        if (j.error === 'invalid_email') setError('That email looks off.');
        else if (j.error === 'rate_limited') setError('Too many signups from this network. Try again in an hour.');
        else setError('Something went wrong. Try again.');
      } else {
        setDone(true);
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-bg shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7)] p-6 md:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-text hover:bg-surface transition"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {done ? (
          <SuccessPanel platformName={platformName} />
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-accent/40 bg-accent/5 text-[10px] font-mono uppercase tracking-wider text-accent mb-4">
              <Sparkles className="w-3 h-3" />
              Early access
            </div>
            <h2 id="waitlist-title" className="text-2xl font-bold tracking-tight mb-1.5 leading-snug">
              Join the AutoDM × {platformName} waitlist
            </h2>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              First 100 creators on the waitlist get{' '}
              <span className="text-accent font-semibold">50% off their first year</span> when{' '}
              {platformName} goes live. We&apos;ll email you the moment it ships.
            </p>

            <form onSubmit={submit} className="space-y-3">
              <input
                ref={inputRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface/40 focus:outline-none focus:border-accent text-sm"
                disabled={busy}
              />
              {error && <p className="text-xs text-rose-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent text-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding you…
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    Save my spot
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-muted text-center">
              No spam. We&apos;ll only email you about the {platformName} launch.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessPanel({ platformName }: { platformName: string }) {
  return (
    <div className="text-center py-3">
      <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
        <Check className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">You&apos;re in.</h2>
      <p className="text-sm text-muted leading-relaxed">
        We&apos;ll email you the day AutoDM × {platformName} goes live — and if you&apos;re in
        the first 100, your <span className="text-accent font-semibold">50% off code</span> will
        arrive at the same time.
      </p>
    </div>
  );
}
