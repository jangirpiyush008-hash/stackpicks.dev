'use client';

import { useEffect, useState } from 'react';

const INR = '₹99';
const USD = '$2.99';

type Currency = 'INR' | 'USD';

function detectCurrency(): Currency {
  if (typeof window === 'undefined') return 'INR';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
    const lang = navigator.language || '';
    if (lang.endsWith('-IN') || lang === 'hi' || lang.startsWith('hi-')) return 'INR';
    return 'USD';
  } catch {
    return 'INR';
  }
}

/**
 * Inline price chip — flips between ₹99 / $2.99 on the client based on user locale.
 * Renders INR by default so SSR + India users see the right thing instantly.
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
  const [currency, setCurrency] = useState<Currency>('INR');
  useEffect(() => {
    setCurrency(detectCurrency());
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
  const [currency, setCurrency] = useState<Currency>('INR');
  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);
  return (
    <span className={className}>
      {currency === 'INR' ? `${INR} lifetime` : `${USD} lifetime`}
    </span>
  );
}
