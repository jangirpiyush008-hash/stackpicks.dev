import { ImageResponse } from 'next/og';

// 1200×630 OG image — shown when autodm.stackpicks.dev links are pasted
// in Twitter/X, LinkedIn, WhatsApp, iMessage, Slack, etc.
//
// next/og notes:
//  - Every div MUST have explicit display: 'flex' (or 'none') — defaults
//    to block which next/og rejects with "Expected <div> to have explicit
//    'display: flex' or 'display: none'".
//  - The default bundled font doesn't support ₹ — use "Rs" instead.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'StackPicks AutoDM — auto-DM that closes, not just sends.';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: 64,
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top — brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#c6ff00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                fill="#0a0a0a"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>
              stackpicks
              <span style={{ display: 'flex', color: '#c6ff00' }}>.dev</span>
            </div>
            <div style={{ display: 'flex', fontSize: 16, color: '#888' }}>/ autodm</div>
          </div>
        </div>

        {/* Center — pitch */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            Auto-DM that
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1,
              color: '#c6ff00',
            }}
          >
            closes.
          </div>
        </div>

        {/* Bottom — proof bar (₹ replaced with Rs — next/og default font lacks ₹) */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 18,
            color: '#bbb',
            paddingTop: 24,
            borderTop: '1px solid #222',
          }}
        >
          <span style={{ display: 'flex' }}>90-second AI setup</span>
          <span style={{ display: 'flex', color: '#444' }}>·</span>
          <span style={{ display: 'flex' }}>Voice-cloned DMs</span>
          <span style={{ display: 'flex', color: '#444' }}>·</span>
          <span style={{ display: 'flex' }}>Follow-up agent</span>
          <span style={{ display: 'flex', color: '#444' }}>·</span>
          <span style={{ display: 'flex' }}>From Rs 499/mo</span>
        </div>
      </div>
    ),
    size,
  );
}
