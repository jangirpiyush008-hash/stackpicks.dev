/**
 * Shared utilities — INR formatting, IST timestamps, slugs, etc.
 */

/**
 * Format amount (in paise) as Indian Rupee with ₹ symbol and lakhs/crores grouping.
 * formatINR(29900) -> "₹299"
 * formatINR(250000) -> "₹2,500"
 * formatINR(10000000) -> "₹1,00,000"
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format a UTC timestamp as IST date+time for UI.
 */
export function formatIST(utc: string | Date, includeTime = false): string {
  const date = typeof utc === 'string' ? new Date(utc) : utc;
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

/**
 * "12.4k", "1.2M" formatting for star counts.
 */
export function formatStars(stars: number): string {
  if (stars < 1000) return String(stars);
  if (stars < 1_000_000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(stars / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

/**
 * "2 days ago", "3 weeks ago" — for "pushed_at" indicators.
 */
export function timeAgo(utc: string | Date): string {
  const date = typeof utc === 'string' ? new Date(utc) : utc;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

/**
 * Slug helper for collections, categories etc.
 */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/**
 * Hash IP for anonymized upvote tracking. Uses Web Crypto API (works in Edge runtime).
 */
export async function hashIP(ip: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${ip}|${salt}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Daily salt for IP hashing — rotates so we can't reconstruct user history across days.
 */
export function dailySalt(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().slice(0, 10);
}
