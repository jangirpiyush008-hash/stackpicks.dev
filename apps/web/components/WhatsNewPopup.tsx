'use client';

/**
 * What's New popup — bottom-left toast that auto-fires when we ship updates.
 *
 * Source of truth: apps/web/lib/whats-new.ts (UPDATES array). Every entry
 * gets shown ONCE per visitor (dismissal stored per-id in localStorage),
 * except pinned entries which always show until that browser dismisses.
 *
 * Lifecycle on each page load:
 *   1. Pick the newest UPDATES item the visitor hasn't dismissed.
 *   2. After 2.5s, slide in from bottom-left.
 *   3. Auto-hide after 8s. Hover pauses the timer.
 *   4. Dismiss / click / Esc → permanent for that id.
 *
 * Surfaces: only top-level discovery pages (/, /mcp, /connect, /tools,
 * /skills). Not shown on dashboard, admin, auth flows, or per-repo
 * pages — those need their own focus.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { getLatestUpdates, type WhatsNewItem } from '@/lib/whats-new';

const SEEN_KEY_PREFIX = 'sp_whatsnew_dismissed_';
const APPEAR_AFTER_MS = 2_500;
const AUTO_HIDE_AFTER_MS = 8_000;

// Only fire on top-level discovery surfaces. Adding /whats-new explicitly
// excluded — the user is already AT the changelog, no need to nag them.
const ALLOWED_PATHS = new Set(['/', '/mcp', '/connect', '/tools', '/skills', '/blog']);

export function WhatsNewPopup() {
  const pathname = usePathname();
  const [item, setItem] = useState<WhatsNewItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  // Pick the freshest item the visitor hasn't seen yet.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!ALLOWED_PATHS.has(pathname ?? '')) return;
    for (const c of getLatestUpdates(8)) {
      let seen: string | null = null;
      try { seen = localStorage.getItem(SEEN_KEY_PREFIX + c.id); } catch { /* ignore */ }
      // Pinned entries shadow the seen flag for one show per session — major
      // launches shouldn't be missed by repeat visitors.
      if (!seen) { setItem(c); break; }
    }
  }, [pathname]);

  // Slide in after a beat so we don't compete with first paint.
  useEffect(() => {
    if (!item) return;
    const t = setTimeout(() => setVisible(true), APPEAR_AFTER_MS);
    return () => clearTimeout(t);
  }, [item]);

  // Auto-hide after AUTO_HIDE_AFTER_MS unless the visitor is hovering.
  useEffect(() => {
    if (!visible || paused) return;
    const t = setTimeout(() => setVisible(false), AUTO_HIDE_AFTER_MS);
    return () => clearTimeout(t);
  }, [visible, paused]);

  // Esc closes too.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  function dismiss(): void {
    if (item) {
      try { localStorage.setItem(SEEN_KEY_PREFIX + item.id, String(Date.now())); } catch { /* ignore */ }
    }
    setVisible(false);
  }

  if (!item) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`
        fixed z-40 bottom-4 left-4
        max-w-[320px] sm:max-w-[360px]
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}
      `}
    >
      <div className="rounded-2xl border border-accent/40 bg-surface/95 backdrop-blur-md shadow-2xl shadow-accent/10 p-4 relative">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 p-1.5 rounded-md text-muted hover:text-text hover:bg-bg/50 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent/15 border border-accent/30">
            <Sparkles className="w-4 h-4 text-accent" />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent">What's new</span>
            <span className="text-[10px] text-muted">
              {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}
            </span>
          </div>
        </div>

        <Link href={item.href} onClick={dismiss} className="block group">
          <h3 className="text-sm font-bold leading-snug text-text group-hover:text-accent transition pr-4">
            {item.title}
          </h3>
          <p className="text-xs text-muted mt-1.5 leading-relaxed line-clamp-3">
            {item.summary}
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-mono text-accent">
            {item.cta ?? 'See what changed'}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        <Link
          href="/whats-new"
          onClick={dismiss}
          className="block mt-2 pt-2 border-t border-border/30 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-accent transition"
        >
          See all updates →
        </Link>
      </div>
    </div>
  );
}
