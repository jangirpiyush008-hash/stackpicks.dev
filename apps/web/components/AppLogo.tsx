'use client';

import { useState } from 'react';
import { domainFor } from '../lib/connect-domains';

/**
 * Real-logo resolver for the Connect catalog.
 *
 * Source order (auto-fails through on <img> error):
 *   1. logo.clearbit.com/{domain}             — clean SVG/PNG for major brands
 *   2. icons.duckduckgo.com/ip3/{domain}.ico  — broad coverage, no API key
 *   3. www.google.com/s2/favicons             — universal last resort
 *   4. Single-letter monogram on accent bg    — pure-CSS fallback
 *
 * No Next/Image: catalog has 672 apps, all on third-party CDNs that don't
 * play well with the optimizer. Plain <img> + native lazy-loading is best.
 */
interface Props {
  slug: string;
  name: string;
  size?: number; // pixels
  className?: string;
}

export function AppLogo({ slug, name, size = 40, className = '' }: Props) {
  const domain = domainFor(slug);
  const sources = [
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];

  const [idx, setIdx] = useState(0);
  const exhausted = idx >= sources.length;

  if (exhausted) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-accent/15 border border-accent/30 text-accent font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-label={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={sources[idx]}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
      className={`rounded-lg bg-white object-contain ${className}`}
      style={{ width: size, height: size, padding: size * 0.1 }}
    />
  );
}
