// IndexNow ping — POST a list of URLs and Bing + Yandex + Seznam crawl them
// within minutes instead of waiting for the next sitemap crawl. Free standard,
// no per-call limit beyond rate limiting (~10k URLs/day).
//
// Use it whenever:
// 1. You publish a new blog post  → ping the post URL + the blog index
// 2. You add new repos to seed-data → ping the new /repo/[slug] URLs + sitemap
// 3. You launch a new section → ping the new page + homepage
//
// Auth: requires the CRON_SECRET bearer token (same one cron-job.org uses).
// Body shape: { "urls": ["https://stackpicks.dev/blog/foo", "..."] }

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOST = 'stackpicks.dev';
const KEY = '5d1326d82b244cdbbf058e0512b00bf9';
const KEY_URL = `https://${HOST}/${KEY}.txt`;

export async function POST(req: NextRequest) {
  // Optional auth — set the same CRON_SECRET as the cron endpoint so randos
  // can't spam IndexNow on our behalf and burn our rate limit.
  const auth = req.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { urls?: string[] };
  try {
    body = (await req.json()) as { urls?: string[] };
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const urls = (body.urls ?? []).filter((u) => typeof u === 'string' && u.startsWith(`https://${HOST}/`));
  if (urls.length === 0) {
    return NextResponse.json({ ok: false, error: 'no_valid_urls' }, { status: 400 });
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_URL,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    // IndexNow returns 200 (OK), 202 (Accepted), or 4xx with details
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submitted: urls.length,
      indexnow_status: res.statusText,
    }, { status: res.ok ? 200 : 502 });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: 'indexnow_unreachable',
      detail: err instanceof Error ? err.message : 'unknown',
    }, { status: 502 });
  }
}

// GET — quick health check that proves the key file is reachable from the
// crawler's perspective. Useful for debugging "why isn't IndexNow finding my key".
export async function GET() {
  try {
    const r = await fetch(KEY_URL, { cache: 'no-store' });
    const body = await r.text();
    return NextResponse.json({
      ok: r.ok,
      key_url: KEY_URL,
      key_file_status: r.status,
      key_file_content: body.trim(),
      key_matches_expected: body.trim() === KEY,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'unknown' }, { status: 500 });
  }
}
