import { ImageResponse } from 'next/og';

// 32×32 favicon — lime message-bubble mark for AutoDM, distinct from the
// main StackPicks "S" favicon. Next.js auto-uses this for any /autodm/*
// route, AND for the autodm.stackpicks.dev subdomain pages (since they
// route through /autodm internally).
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#c6ff00',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
        }}
      >
        {/* Chat bubble glyph, dark on lime */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            fill="#0a0a0a"
          />
        </svg>
      </div>
    ),
    size,
  );
}
