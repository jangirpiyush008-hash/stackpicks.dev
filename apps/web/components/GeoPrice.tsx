'use client';

import { useEffect, useState } from 'react';

const INR = '₹99';
const USD = '$2.99';

type Currency = 'INR' | 'USD' | null;

let cached: Currency = null; // module-level cache so we hit the API at most once per session

async function detectCurrency(): Promise<Currency> {
  if (cached) return cached;
  if (typeof window === 'undefined') return 'INR';

  // Strategy 1: IP-based country lookup (VPN-aware — this is the source of truth).
  try {
    const res = await fetch('https://ipapi.co/country/', { cache: 'no-store' });
    if (res.ok) {
      const country = (await res.text()).trim().toUpperCase();
      cached = country === 'IN' ? 'INR' : 'USD';
      return cached;
    }
  } catch {
    /* network error — fall through */
  }

  // Strategy 2: fallback to timezone + browser locale (less accurate but works offline)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
      cached = 'INR';
      return cached;
    }
    const lang = navigator.language || '';
    if (lang.endsWith('-IN') || lang.startsWith('hi')) {
      cached = 'INR';
      return cached;
    }
    cached = 'USD';
    return cached;
  } catch {
    cached = 'INR';
    return cached;
  }
}

/**
 * Inline price chip — flips between ₹99 / $2.99 on the client based on user's real
 * IP location. Renders INR by default during SSR + first paint so India users see
 * the right thing instantly, then re-renders if the IP says otherwise.
 */
export function GeoPrice({
  className,
  prefix,
  suffix,
}: {
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  useEffect(() => {
    detectCurrency().then((c) => {
      if (c) setCurrency(c);
    });
  }, []);
  const price = currency === 'INR' ? INR : USD;
  return (
    <span className={className}>
      {prefix}
      {price}
      {suffix}
    </span>
  );
}

export function GeoPriceFull({ className }: { className?: string }) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  useEffect(() => {
    detectCurrency().then((c) => {
      if (c) setCurrency(c);
    });
  }, []);
  return (
    <span className={className}>
      {currency === 'INR' ? `${INR} lifetime` : `${USD} lifetime`}
    </span>
  );
}
