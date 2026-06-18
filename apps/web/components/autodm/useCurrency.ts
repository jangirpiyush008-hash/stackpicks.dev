'use client';

/**
 * Detect the visitor's pricing currency. India → INR, everyone else → USD.
 *
 * Detection chain (most accurate first):
 *   1. localStorage manual override (set by the [$/₹] toggle on the pricing page)
 *   2. ipapi.co country lookup (VPN-aware — this is the source of truth)
 *   3. timezone + browser locale fallback (offline-safe)
 *
 * Module-level cache → at most one ipapi.co call per page load.
 * Exposes setCurrency() so the toggle persists the user's pick across visits.
 */

import { useEffect, useState } from 'react';

export type Currency = 'INR' | 'USD';

const STORAGE_KEY = 'autodm.currency';
let cached: Currency | null = null;

async function detect(): Promise<Currency> {
  if (cached) return cached;
  if (typeof window === 'undefined') return 'USD';

  // 1. Manual override — set by the toggle
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'INR' || stored === 'USD') { cached = stored; return cached; }
  } catch { /* localStorage blocked — continue */ }

  // 2. IP-based country lookup (VPN-aware)
  try {
    const res = await fetch('https://ipapi.co/country/', { cache: 'no-store' });
    if (res.ok) {
      const country = (await res.text()).trim().toUpperCase();
      cached = country === 'IN' ? 'INR' : 'USD';
      return cached;
    }
  } catch { /* fall through */ }

  // 3. Timezone + locale fallback
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') { cached = 'INR'; return cached; }
    const lang = navigator.language || '';
    if (lang.endsWith('-IN') || lang.startsWith('hi')) { cached = 'INR'; return cached; }
  } catch { /* ignore */ }

  cached = 'USD';
  return cached;
}

/** React hook — currency starts undefined, populates on mount. */
export function useCurrency(): {
  currency: Currency | null;
  setCurrency: (c: Currency) => void;
  ready: boolean;
} {
  const [currency, setLocal] = useState<Currency | null>(cached);

  useEffect(() => {
    if (cached) { setLocal(cached); return; }
    let alive = true;
    detect().then((c) => { if (alive) setLocal(c); });
    return () => { alive = false; };
  }, []);

  const setCurrency = (c: Currency) => {
    cached = c;
    setLocal(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
  };

  return { currency, setCurrency, ready: currency !== null };
}
