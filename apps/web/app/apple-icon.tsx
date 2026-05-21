import { ImageResponse } from 'next/og';

// 180×180 Apple touch icon — bigger version of the favicon with brand wordmark.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 38,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontWeight: 900,
            letterSpacing: '-0.05em',
          }}
        >
          <span style={{ color: '#e8e8e8', fontSize: 96 }}>S</span>
          <span style={{ color: '#c6ff00', fontSize: 120, lineHeight: 1, marginLeft: -6 }}>.</span>
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#888',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          stackpicks
        </div>
      </div>
    ),
    size,
  );
}
