import { ImageResponse } from 'next/og';

// 180×180 Apple touch icon — used when an iOS user pins
// autodm.stackpicks.dev to their home screen. Same lime bubble as the
// favicon but larger, with a tiny "autodm" wordmark beneath.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#c6ff00',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 38,
          gap: 4,
        }}
      >
        <svg width="92" height="92" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            fill="#0a0a0a"
          />
        </svg>
        <div
          style={{
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: -0.6,
            color: '#0a0a0a',
            marginTop: 4,
          }}
        >
          autodm
        </div>
      </div>
    ),
    size,
  );
}
