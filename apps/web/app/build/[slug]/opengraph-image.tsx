import { ImageResponse } from 'next/og';
import { getBundleBySlug } from '../../../lib/use-case-bundles';

export const runtime = 'nodejs';
export const alt = 'Open-source stack bundle — StackPicks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const bundle = getBundleBySlug(params.slug);
  const title = bundle?.title ?? 'Build with AI';
  const totalRepos = bundle?.sections.reduce((n, s) => n + s.repos.length, 0) ?? 0;
  const sectionCount = bundle?.sections.length ?? 0;

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
            left: -100,
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
            marginTop: 24,
            display: 'flex',
            fontSize: 20,
            color: '#c6ff00',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          OPEN-SOURCE STACK BUNDLE
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            fontSize: 84,
            fontWeight: 900,
            color: '#e8e8e8',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            maxWidth: 1050,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 28,
            display: 'flex',
            gap: 40,
            fontSize: 24,
            color: '#888',
          }}
        >
          <span><strong style={{ color: '#c6ff00' }}>{totalRepos}</strong> curated repos</span>
          <span><strong style={{ color: '#c6ff00' }}>{sectionCount}</strong> sections</span>
          <span>AI-agent ready</span>
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
            READY-TO-SHIP STACK
          </span>
          <span>· paste into your AI agent · build today</span>
        </div>
      </div>
    ),
    size,
  );
}
