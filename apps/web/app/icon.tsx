import { ImageResponse } from 'next/og';

// 32×32 favicon — bold "S" + lime accent dot, matching the brand mark.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.05em',
          }}
        >
          <span style={{ color: '#e8e8e8', fontSize: 22 }}>S</span>
          <span style={{ color: '#c6ff00', fontSize: 28, lineHeight: 1, marginLeft: -2 }}>.</span>
        </div>
      </div>
    ),
    size,
  );
}
