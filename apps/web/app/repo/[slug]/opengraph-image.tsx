import { ImageResponse } from 'next/og';
import { adminClient, getRepoBySlug } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const alt = 'Repo review — StackPicks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const supabase = adminClient();
  const repo = await getRepoBySlug(supabase, params.slug);

  const name = repo?.name ?? params.slug;
  const owner = repo?.owner ?? '';
  const language = repo?.language ?? '';
  const stars = repo?.stars ?? 0;
  const take = (repo?.curator_take ?? '').slice(0, 160).trim();

  const formatStars = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

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
            background: 'radial-gradient(ellipse, rgba(198,255,0,0.15), transparent 70%)',
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
            fontSize: 18,
            color: '#c6ff00',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          OPEN-SOURCE REVIEW
        </div>

        <div
          style={{
            marginTop: 28,
            display: 'flex',
            flexDirection: 'column',
            fontSize: 22,
            color: '#888',
            fontFamily: 'monospace',
          }}
        >
          {owner}
        </div>

        <div
          style={{
            marginTop: 4,
            display: 'flex',
            fontSize: 84,
            fontWeight: 900,
            color: '#e8e8e8',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            maxWidth: 1050,
          }}
        >
          {name}
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            gap: 32,
            fontSize: 22,
            color: '#888',
            alignItems: 'center',
          }}
        >
          <span><strong style={{ color: '#c6ff00' }}>★ {formatStars(stars)}</strong></span>
          {language && <span>{language}</span>}
        </div>

        {take && (
          <div
            style={{
              marginTop: 32,
              display: 'flex',
              fontSize: 22,
              color: '#bbb',
              lineHeight: 1.4,
              maxWidth: 1050,
            }}
          >
            “{take}{take.length >= 160 ? '…' : ''}”
          </div>
        )}

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
            CURATOR TAKE
          </span>
          <span>· honest pros · skip clauses · alternatives</span>
        </div>
      </div>
    ),
    size,
  );
}
