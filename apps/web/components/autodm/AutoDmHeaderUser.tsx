'use client';

/**
 * Auth-aware bit of the AutoDM header.
 *
 *   Logged out → "Sign in" button (lime, primary)
 *   Logged in  → user email dot + dropdown with Dashboard / Inbox /
 *                Switch to StackPicks / Sign out
 *
 * Uses getSupabaseBrowser() — the wrapped client that scopes cookies to
 * `.stackpicks.dev` so logging out clears the session across both
 * subdomains. The previous version used the raw @supabase/supabase-js
 * client whose default cookie domain didn't match — sign-out silently
 * no-op'd and the dropdown re-rendered as if still signed in.
 */

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Inbox, LogOut, ChevronDown, ArrowUpRight, Shield } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export function AutoDmHeaderUser({ isAuthed, email }: { isAuthed: boolean; email: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  async function signOut() {
    setBusy(true);
    try {
      const supa = getSupabaseBrowser();
      await supa.auth.signOut();
      // Hard navigate to /autodm so server-rendered header re-reads the
      // (now-empty) session cookie. router.refresh() alone leaves stale
      // SSR auth state on first paint.
      window.location.href = '/autodm';
    } catch {
      setBusy(false);
    }
  }

  if (!isAuthed) {
    return (
      <Link
        href="/login?next=/autodm/dashboard"
        className="inline-flex items-center gap-1 text-xs font-semibold bg-accent text-bg px-4 py-1.5 rounded-full hover:bg-accent/90 transition"
      >
        Sign in
      </Link>
    );
  }

  const initial = (email?.[0] || '?').toUpperCase();
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border border-border hover:border-muted transition"
      >
        <span className="w-5 h-5 rounded-full bg-accent text-bg font-bold flex items-center justify-center text-[10px]">
          {initial}
        </span>
        <ChevronDown className="w-3 h-3 text-muted" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-bg border border-border rounded-lg shadow-lg z-10 min-w-[220px] py-1">
          {email && (
            <div className="px-3 py-2 text-[10px] text-muted font-mono border-b border-border/60 truncate">{email}</div>
          )}
          <Link
            href="/autodm/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-bg-card transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-muted" /> AutoDM dashboard
          </Link>
          <Link
            href="/autodm/inbox"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-bg-card transition"
          >
            <Inbox className="w-3.5 h-3.5 text-muted" /> Inbox
          </Link>
          <a
            href="https://stackpicks.dev/profile/security"
            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-bg-card transition"
          >
            <Shield className="w-3.5 h-3.5 text-muted" /> Security &amp; 2FA
          </a>
          <div className="my-1 border-t border-border/60" />
          {/* Cross-product switcher — single login, two dashboards */}
          <a
            href="https://stackpicks.dev/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-bg-card transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
            <span>Switch to StackPicks</span>
          </a>
          <div className="my-1 border-t border-border/60" />
          <button
            onClick={signOut}
            disabled={busy}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-bg-card transition text-left disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5 text-muted" />
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
