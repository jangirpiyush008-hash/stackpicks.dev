'use client';

/**
 * Account switcher pill — drops a dropdown of all tenants this owner
 * has connected, lets them swap the active one, and offers "Connect
 * another" when there's headroom in their plan's IG slots.
 *
 * Renders nothing if the owner has only 1 tenant — no point of UI
 * clutter for Free / Creator users.
 *
 * Switching POSTs /api/autodm/active-tenant which sets the cookie,
 * then we hard-reload so every server component re-reads from scratch.
 */

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, ChevronDown, Plus, Check, Loader2 } from 'lucide-react';

interface TenantOpt {
  id: string;
  ig_username: string | null;
  plan_tier: string;
  is_active: boolean;
}

export function TenantSwitcher({
  active,
  all,
  canAddMore,
  capInfo,
}: {
  active: TenantOpt;
  all: TenantOpt[];
  canAddMore: boolean;
  capInfo: { used: number; allowed: number; plan: string };
}) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (all.length <= 1 && !canAddMore) return null;

  async function pick(id: string) {
    if (id === active.id) { setOpen(false); return; }
    setSwitching(id);
    try {
      const res = await fetch('/api/autodm/active-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: id }),
      });
      if (res.ok) {
        window.location.href = '/autodm/dashboard';
      } else {
        setSwitching(null);
      }
    } catch {
      setSwitching(null);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition bg-bg-card border border-border hover:border-accent/40"
      >
        <Instagram className="w-3 h-3 text-accent" />
        @{active.ig_username || 'creator'}
        <ChevronDown className={`w-3 h-3 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-border bg-bg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-bg-card/30">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted">// IG accounts</div>
            <div className="text-xs text-text mt-0.5">
              {capInfo.used}/{capInfo.allowed} used on <span className="capitalize">{capInfo.plan}</span> plan
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {all.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                disabled={!!switching}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-bg-card/50 transition ${
                  t.id === active.id ? 'bg-accent/5' : ''
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">@{t.ig_username || 'unnamed'}</div>
                  <div className="text-[10px] text-muted capitalize">
                    {t.plan_tier}{!t.is_active && ' · paused'}
                  </div>
                </div>
                {switching === t.id ? (
                  <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                ) : t.id === active.id ? (
                  <Check className="w-3.5 h-3.5 text-accent" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="border-t border-border">
            {canAddMore ? (
              <Link
                href="/autodm/connect"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-accent hover:bg-accent/5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Connect another Instagram
              </Link>
            ) : (
              <div className="px-3 py-2.5 text-xs text-muted">
                You&apos;ve used all {capInfo.allowed} IG slots.{' '}
                <Link href="/autodm/dashboard#plan" className="text-accent hover:underline">Upgrade →</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
