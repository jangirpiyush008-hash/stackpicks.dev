'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, IndianRupee, DollarSign } from 'lucide-react';

type Currency = 'INR' | 'USD';

function detectCurrency(): Currency {
  if (typeof window === 'undefined') return 'INR';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
    const lang = navigator.language || '';
    if (lang.endsWith('-IN') || lang.startsWith('hi')) return 'INR';
    return 'USD';
  } catch {
    return 'INR';
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
    setCurrency(detectCurrency());
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

      {/* Geo-priced amount */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1 text-accent">
          {isINR ? <IndianRupee className="w-8 h-8" /> : <DollarSign className="w-8 h-8" />}
          <span className="text-5xl md:text-6xl font-bold tracking-tighter">
            {isINR ? inrDisplay : usdDisplay}
          </span>
        </div>
        <div className="text-xs text-muted mt-1.5">
          {isINR ? 'India · UPI / Cards / Netbanking via Razorpay' : 'International · Cards via Razorpay'}
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
      {/* Razorpay reviewers (and confused customers) always see the INR amount */}
      <p className="text-[11px] text-center text-muted/70 mt-1">
        Indian customers charged <strong className="text-text">{inrDisplay}</strong> in INR ·{' '}
        International charged <strong className="text-text">${usdDisplay}</strong> in USD
      </p>

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
