import { ImageResponse } from 'next/og';
import { getComparisonBySlug } from '../../../lib/comparisons';

export const runtime = 'nodejs';
export const alt = 'Open-source comparison — StackPicks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const comparison = getComparisonBySlug(params.slug);
  const aName = comparison?.a_full.split('/')[1] ?? '???';
  const bName = comparison?.b_full.split('/')[1] ?? '???';
  const category = comparison?.category ?? 'Open Source';

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
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -100,
            width: 800,
            height: 600,
            background: 'radial-gradient(ellipse, rgba(198,255,0,0.18), transparent 70%)',
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

        {/* Category chip */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            fontSize: 20,
            color: '#c6ff00',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {category} · OPEN-SOURCE COMPARISON
        </div>

        {/* The VS */}
        <div
          style={{
            marginTop: 50,
            display: 'flex',
            flexDirection: 'column',
            fontSize: 96,
            fontWeight: 900,
            color: '#e8e8e8',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          <div style={{ display: 'flex' }}>{aName}</div>
          <div style={{ display: 'flex', color: '#666', fontSize: 56, margin: '12px 0' }}>vs</div>
          <div style={{ display: 'flex' }}>{bName}</div>
        </div>

        {/* Footer */}
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
          <span style={{ background: '#c6ff00', color: '#0a0a0a', padding: '6px 14px', borderRadius: 999, fontWeight: 800 }}>
            HONEST COMPARISON
          </span>
          <span>· curator take · pros · cons · pick one</span>
        </div>
      </div>
    ),
    size,
  );
}
