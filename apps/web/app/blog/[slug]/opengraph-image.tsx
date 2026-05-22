import { ImageResponse } from 'next/og';
import { getBlogPostBySlug } from '../../../lib/blog';

export const runtime = 'nodejs';
export const alt = 'Blog post — StackPicks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  const title = post?.title ?? 'StackPicks Blog';
  const category = post?.category ?? 'Open Source';
  const readingTime = post?.reading_time ?? 8;

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
            width: 900,
            height: 700,
            background: 'radial-gradient(ellipse, rgba(198,255,0,0.18), transparent 70%)',
            display: 'flex',
          }}
        />

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

        <div
          style={{
            marginTop: 30,
            display: 'flex',
            fontSize: 18,
            color: '#c6ff00',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          BLOG · {category}
        </div>

        <div
          style={{
            marginTop: 32,
            display: 'flex',
            fontSize: title.length > 60 ? 60 : 72,
            fontWeight: 900,
            color: '#e8e8e8',
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            maxWidth: 1050,
          }}
        >
          {title.length > 90 ? title.slice(0, 87) + '…' : title}
        </div>

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
            {readingTime} MIN READ
          </span>
          <span>· by Piyush Jangir · 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
