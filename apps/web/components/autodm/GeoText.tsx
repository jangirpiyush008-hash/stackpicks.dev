'use client';

/**
 * Tiny client island for geo-swapping a single line of copy without
 * converting an entire server-rendered page to a client component.
 *
 * Usage from a server component:
 *   <GeoText india="UPI Autopay + GST invoice" world="Razorpay subscription" />
 *
 * Renders the global ("world") string on first paint and swaps to the
 * India copy once useCurrency() resolves the visitor as Indian. The
 * one-paint flicker is acceptable because non-Indian visitors never
 * see the India copy, which is what we want.
 */

import { useCurrency } from './useCurrency';

export function GeoText({
  india,
  world,
}: {
  india: React.ReactNode;
  world: React.ReactNode;
}) {
  const { currency } = useCurrency();
  return <>{currency === 'INR' ? india : world}</>;
}
