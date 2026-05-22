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

  // "Launch mode" — push everything important (used on launch day)
  const launchUrls = [
    ...defaultUrls,
    `${SITE.url}/about`,
    // All 13 stack bundles
    `${SITE.url}/build/ship-a-saas`,
    `${SITE.url}/build/mobile-app`,
    `${SITE.url}/build/ai-agent`,
    `${SITE.url}/build/marketing-website`,
    `${SITE.url}/build/internal-dashboard`,
    `${SITE.url}/build/chrome-extension`,
    `${SITE.url}/build/automation-workflow`,
    `${SITE.url}/build/marketing-stack`,
    `${SITE.url}/build/sales-crm-stack`,
    `${SITE.url}/build/e-commerce`,
    `${SITE.url}/build/developer-tools`,
    `${SITE.url}/build/content-platform`,
    `${SITE.url}/build/web-scraper`,
    // All 12 skill tracks
    `${SITE.url}/skills/marketing`,
    `${SITE.url}/skills/sales-outreach`,
    `${SITE.url}/skills/social-media`,
    `${SITE.url}/skills/linkedin-personal-brand`,
    `${SITE.url}/skills/ai-ml`,
    `${SITE.url}/skills/data-analytics`,
    `${SITE.url}/skills/devops-infra`,
    `${SITE.url}/skills/automation`,
    `${SITE.url}/skills/design`,
    `${SITE.url}/skills/mobile-dev`,
    `${SITE.url}/skills/backend-apis`,
    `${SITE.url}/skills/founder-os`,
  ];

  const url = new URL(req.url);
  const mode = url.searchParams.get('mode');
  const urls = body.urls?.length ? body.urls : mode === 'launch' ? launchUrls : defaultUrls;

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
