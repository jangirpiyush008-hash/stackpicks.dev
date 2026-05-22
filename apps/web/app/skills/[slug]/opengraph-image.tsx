import { ImageResponse } from 'next/og';
import { getSkillTrackBySlug } from '../../../lib/skill-tracks';

export const runtime = 'nodejs';
export const alt = 'Open-source skill track — StackPicks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const track = getSkillTrackBySlug(params.slug);
  const title = track?.title ?? 'Skill track';
  const repoCount = track?.repos.length ?? 0;
  const audience = track?.audience ?? '';

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
            bottom: -200,
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
            marginTop: 24,
            display: 'flex',
            fontSize: 20,
            color: '#c6ff00',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          SKILL TRACK · {audience.toUpperCase()}
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            fontSize: 80,
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
            fontSize: 26,
            color: '#aaa',
          }}
        >
          <strong style={{ color: '#c6ff00', marginRight: 12 }}>{repoCount}</strong>
          curated open-source tools for {audience.toLowerCase()}
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
            BY DISCIPLINE
          </span>
          <span>· the exact OSS toolkit pros use</span>
        </div>
      </div>
    ),
    size,
  );
}
