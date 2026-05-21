import { ImageResponse } from 'next/og';

// 1200×630 OG image — shown when stackpicks.dev is shared on Twitter, LinkedIn,
// Slack, WhatsApp, etc. Generated dynamically; no external image asset needed.
export const alt = 'StackPicks — the curated directory service for software builders';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
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
        {/* Subtle glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -100,
            width: 800,
            height: 600,
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
            fontSize: 56,
            color: '#e8e8e8',
          }}
        >
          stackpicks
          <span style={{ color: '#c6ff00' }}>.dev</span>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 80,
            fontSize: 88,
            fontWeight: 800,
            color: '#e8e8e8',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>The curated stack,</span>
          <span style={{ color: '#c6ff00' }}>built by builders.</span>
        </div>

        {/* Subhead */}
        <div
          style={{
            marginTop: 30,
            fontSize: 26,
            color: '#888',
            maxWidth: 900,
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          100+ open-source tools with honest takes · 13 ready-to-ship stack bundles · AI-agent integration guides
        </div>

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
          <span style={{ background: '#c6ff00', color: '#0a0a0a', padding: '6px 14px', borderRadius: 999, fontWeight: 800 }}>
            LIFETIME ACCESS
          </span>
          <span>· pay once · use forever</span>
        </div>
      </div>
    ),
    size,
  );
}
