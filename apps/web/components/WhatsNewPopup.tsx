'use client';

/**
 * WhatsNewPopup — surfaces the latest refresh/changelog to homepage visitors.
 *
 * Behavior:
 * - Bumps via REFRESH_ID — change the ID when shipping a new refresh and
 *   every visitor sees the toast once, even if they dismissed the previous one.
 * - Toast slides in bottom-right after 2.5s on /, /mcp, /connect.
 * - Dismiss persists per-REFRESH_ID in localStorage. ESC also closes.
 * - Links to the changelog blog post.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, X, ArrowRight } from 'lucide-react';

const REFRESH_ID = 'jun-2026-02';
const STORAGE_KEY = `sp_whatsnew_dismissed_${REFRESH_ID}`;
const SHOW_DELAY_MS = 2_500;

const CHANGELOG_HREF = '/blog/mcp-stateless-protocol-2026';

export function WhatsNewPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show on top-level discovery surfaces.
    const allowed = pathname === '/' || pathname === '/mcp' || pathname === '/connect';
    if (!allowed) return;

    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch { /* ignore */ }

    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* ignore */ }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 max-w-sm
                 rounded-2xl border border-accent/30 bg-surface/95 backdrop-blur-md
                 shadow-2xl shadow-accent/20
                 animate-sp-slide-in"
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 p-1.5 rounded-md text-muted hover:text-text hover:bg-bg/50 transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent/15 border border-accent/30">
            <Sparkles className="w-4 h-4 text-accent" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">Fresh on the blog</span>
            <span className="text-[10px] text-muted">June 18, 2026</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-text mb-2 leading-snug">
          MCP just went stateless — the 2026 spec, explained
        </h3>

        <p className="text-xs text-muted mb-4 leading-relaxed">
          No more session IDs or sticky load balancers. Plus June&apos;s launches —
          Claude Fable 5, GLM-5.2, Copilot usage billing — in one breakdown.
        </p>

        <div className="flex items-center justify-between gap-2">
          <Link
            href={CHANGELOG_HREF}
            onClick={dismiss}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium
                       px-3 py-2 rounded-md bg-accent text-bg hover:bg-accent/90 transition"
          >
            Read the breakdown
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={dismiss}
            className="text-xs text-muted hover:text-text px-2 py-2 transition"
          >
            Dismiss
          </button>
        </div>
      </div>

    </div>
  );
}
