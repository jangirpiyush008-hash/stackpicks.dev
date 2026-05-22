import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@stackpicks/core/constants';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = '59ee40b112f6445c1121032b49fcf1d2';
const HOST = new URL(SITE.url).host;

/**
 * Push URLs to IndexNow (Bing + Yandex + Seznam + Naver).
 * Body: { urls?: string[] }  — if omitted, pushes the top-priority static paths.
 * Admin-gated to prevent abuse.
 */
export async function POST(req: NextRequest) {
  const gate = await isAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as { urls?: string[] };

  const defaultUrls = [
    SITE.url,
    `${SITE.url}/preview`,
    `${SITE.url}/build`,
    `${SITE.url}/skills`,
    `${SITE.url}/pricing`,
    `${SITE.url}/how-to-use`,
  ];

  const urls = body.urls?.length ? body.urls : defaultUrls;

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE.url}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log('[indexnow] status:', res.status, 'urls:', urls.length);
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      pushed: urls.length,
      response: text || null,
    });
  } catch (err) {
    console.error('[indexnow] error:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'fetch_failed' },
      { status: 500 }
    );
  }
}
