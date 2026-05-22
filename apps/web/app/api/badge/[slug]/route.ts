import { NextRequest, NextResponse } from 'next/server';
import { adminClient, getRepoBySlug } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cache aggressively — badge content rarely changes; 24h CDN cache
const CACHE_HEADERS = {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
};

/**
 * SVG badge that OSS maintainers can embed in their README:
 *   ![Featured on StackPicks](https://stackpicks.dev/api/badge/<slug>)
 *
 * Every embed = a backlink + brand impression.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;

  const supabase = adminClient();
  const repo = await getRepoBySlug(supabase, slug).catch(() => null);

  // Fall back gracefully if repo not found — still serve a badge
  const label = 'Featured on';
  const value = 'StackPicks';
  const verb = repo?.is_featured ? '★ Featured on' : 'Listed on';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="28" viewBox="0 0 180 28">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a0a"/>
      <stop offset="1" stop-color="#000"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c6ff00"/>
      <stop offset="1" stop-color="#a8e000"/>
    </linearGradient>
  </defs>
  <rect width="180" height="28" rx="6" fill="url(#grad)"/>
  <rect x="0" y="0" width="76" height="28" rx="6" fill="url(#accent)"/>
  <rect x="68" y="0" width="8" height="28" fill="url(#accent)"/>
  <text x="38" y="18" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#0a0a0a" text-anchor="middle">${verb.replace('★ ', '')}</text>
  <text x="128" y="18" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#e8e8e8" text-anchor="middle">stackpicks.dev</text>
</svg>`;

  return new NextResponse(svg, { headers: CACHE_HEADERS });
}
