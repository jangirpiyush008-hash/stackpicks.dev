// /api/og — query-driven OG image generator. Default fallback for every page
// that doesn't have a dedicated opengraph-image.tsx file.
//
// Usage:
//   /api/og?title=Best%20open-source%20alternatives&kicker=ALTERNATIVES&subtitle=...
//
// Why per-page OG matters for SEO/social: unique, keyword-stuffed preview cards
// lift click-through on X / LinkedIn / Slack / WhatsApp unfurls by 2-4x vs. a
// shared default image. The page title becomes visible to the user before they
// click — a free CTR multiplier across every share.

import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// Truncate cleanly at word boundary.
function trim(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + '…';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title    = trim(searchParams.get('title')    ?? 'StackPicks',     90);
  const subtitle = trim(searchParams.get('subtitle') ?? '',               180);
  const kicker   = (searchParams.get('kicker')      ?? 'STACKPICKS').toUpperCase().slice(0, 40);
  const badge    = (searchParams.get('badge')       ?? 'CURATED').toUpperCase().slice(0, 24);
  const footer   = trim(searchParams.get('footer')   ?? '· 165+ open-source repos · honest takes', 80);

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 72,
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -100,
            width: 900,
            height: 700,
            background: 'radial-gradient(ellipse, rgba(198,255,0,0.15), transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            fontSize: 40,
            color: '#888',
          }}
        >
          stackpicks<span style={{ color: '#c6ff00' }}>.dev</span>
        </div>

        {/* Kicker */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            fontSize: 18,
            color: '#c6ff00',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
          }}
        >
          {kicker}
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            fontSize: title.length > 60 ? 60 : title.length > 40 ? 74 : 88,
            fontWeight: 900,
            color: '#e8e8e8',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            maxWidth: 1050,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              fontSize: 24,
              color: '#bbb',
              lineHeight: 1.4,
              maxWidth: 1050,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Footer chip */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 72,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            fontSize: 18,
            color: '#888',
            fontFamily: 'monospace',
          }}
        >
          <span
            style={{
              background: '#c6ff00',
              color: '#0a0a0a',
              padding: '6px 14px',
              borderRadius: 999,
              fontWeight: 800,
            }}
          >
            {badge}
          </span>
          <span>{footer}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
