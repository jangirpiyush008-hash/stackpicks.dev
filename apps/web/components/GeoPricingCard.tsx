'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, IndianRupee, DollarSign } from 'lucide-react';
import { CouponInput } from './CouponInput';

type Currency = 'INR' | 'USD';

let cached: Currency | null = null;

async function detectCurrency(): Promise<Currency> {
  if (cached) return cached;
  if (typeof window === 'undefined') return 'INR';
  try {
    const res = await fetch('https://ipapi.co/country/', { cache: 'no-store' });
    if (res.ok) {
      const country = (await res.text()).trim().toUpperCase();
      cached = country === 'IN' ? 'INR' : 'USD';
      return cached;
    }
  } catch {
    /* fall through */
  }
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

export function GeoPricingCard({
  inrDisplay,
  usdDisplay,
  features,
}: {
  inrDisplay: string;
  usdDisplay: string;
  features: string[];
}) {
  const [currency, setCurrency] = useState<Currency>('INR');
  useEffect(() => {
    detectCurrency().then(setCurrency);
  }, []);

  const isINR = currency === 'INR';

  return (
    <div className="relative rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-surface/40 to-transparent p-6 md:p-8 shadow-xl shadow-accent/10">
      <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-accent text-bg text-[10px] font-mono uppercase tracking-wider font-bold">
        Lifetime
      </div>
      <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Lifetime membership</div>
      <h2 className="text-2xl font-bold mb-2">Full directory access</h2>
      <p className="text-muted text-sm mb-6">Pay once. Full service for the lifetime of the platform.</p>

      <div className="mb-6">
        <div className="flex items-baseline gap-1 text-accent">
          {isINR ? <IndianRupee className="w-8 h-8" /> : <DollarSign className="w-8 h-8" />}
          <span className="text-5xl md:text-6xl font-bold tracking-tighter">
            {isINR ? inrDisplay : usdDisplay}
          </span>
        </div>
        <div className="text-xs text-muted mt-1.5">
          One-time payment · Lifetime access · Secure checkout
        </div>
      </div>

      <Link
        href="/contact"
        className="block text-center px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition"
      >
        Get lifetime access
      </Link>
      <p className="text-[11px] text-center text-muted mt-2">
        Razorpay secure checkout · 7-day full refund · GSTIN invoice on request
      </p>
      <p className="text-[11px] text-center text-muted/70 mt-1">
        Auto-priced for your region · Razorpay secure checkout
      </p>

      <CouponInput currency={currency} />

      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className={f === 'Everything in Free' ? 'text-muted' : 'text-text'}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
