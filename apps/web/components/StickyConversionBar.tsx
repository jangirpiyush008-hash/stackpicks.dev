'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { GeoPrice } from './GeoPrice';

/**
 * Sticky bottom conversion bar — appears after 30% scroll on SEO/free pages.
 * Dismissible (state stored in localStorage per session). Hidden for members
 * (parent passes isMember=true). Mobile-prioritized but works on desktop too.
 *
 * Goal: a second chance to convert readers who skim past the inline CTAs.
 */

interface Props {
  isMember?: boolean;
  /** Source tag for analytics — appended as ?from= on /pricing link. */
  source?: string;
}

const DISMISS_KEY = 'sp_sticky_cta_dismissed_until';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function StickyConversionBar({ isMember = false, source = 'sticky' }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isMember) return;

    // Check if user dismissed it recently
    try {
      const dismissedUntil = parseInt(localStorage.getItem(DISMISS_KEY) ?? '0', 10);
      if (dismissedUntil > Date.now()) {
        setDismissed(true);
        return;
      }
    } catch {
      /* localStorage blocked — show anyway */
    }

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      // Show after 30% scroll
      if (scrolled / totalHeight > 0.3) {
        setVisible(true);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMember]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DURATION_MS));
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  if (isMember || dismissed || !visible) return null;

  const pricingHref = `/pricing?from=${source}`;

  return (
    <div
      role="region"
      aria-label="Lifetime access offer"
      className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
    >
      <div className="mx-auto max-w-3xl m-3 md:m-4">
        <div className="relative pointer-events-auto rounded-2xl border-2 border-accent/40 bg-zinc-950/95 backdrop-blur-xl shadow-[0_-8px_40px_-8px_rgba(0,0,0,0.6)] px-4 py-3 md:px-5 md:py-4 flex items-center gap-3 flex-wrap">
          {/* Subtle accent glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/[0.04] to-transparent pointer-events-none" />

          <div className="relative flex-1 min-w-[200px]">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent mb-0.5">
              Curated open-source · honest takes
            </div>
            <div className="text-sm md:text-base font-semibold text-text leading-tight">
              <GeoPrice prefix="Lifetime access for " suffix=". Pay once, use forever." />
            </div>
          </div>

          <Link
            href={pricingHref}
            className="relative inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-accent text-bg font-bold text-sm hover:opacity-90 transition whitespace-nowrap shrink-0"
          >
            Get it
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss for 7 days"
            className="relative shrink-0 w-7 h-7 rounded-full hover:bg-white/10 transition flex items-center justify-center text-muted hover:text-text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
