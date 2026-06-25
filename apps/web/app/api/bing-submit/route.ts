/**
 * Bing URL Submission API — direct submit to Bing's crawler queue.
 *
 * Stronger signal than IndexNow alone:
 *   - IndexNow tells "URL changed, please re-crawl" (passive)
 *   - URL Submission tells "URL is new/changed AND we want it indexed" (active)
 * Bing weights its own API submissions higher than IndexNow for ranking decay.
 *
 * Daily quota: 10,000 URLs (vs IndexNow's 10k/day too, but separate buckets).
 *
 * Setup (one-time):
 *   1. Bing Webmaster Tools → Settings → API Access → Generate API Key
 *   2. Set BING_WEBMASTER_API_KEY in Railway env
 *
 * Auth (this endpoint): requires CRON_SECRET bearer (same as /api/indexnow)
 * Body: { "urls": ["https://stackpicks.dev/blog/foo", ...] }
 *
 * Use it the moment you publish a new post — pair with the IndexNow ping for
 * belt-and-suspenders signal to Bing within minutes.
 *
 * Reference:
 *   https://learn.microsoft.com/en-us/bingwebmaster/getting-access
 *   https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOST = 'stackpicks.dev';

export async function POST(req: NextRequest) {
  // Auth — same as IndexNow endpoint so we don't burn the daily quota
  const auth = req.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BING_WEBMASTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      error: 'bing_api_key_missing',
      hint: 'Set BING_WEBMASTER_API_KEY in Railway. Get it from Bing Webmaster Tools → Settings → API Access.',
    }, { status: 503 });
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

  // Bing's batch endpoint accepts up to 500 URLs per call.
  if (urls.length > 500) {
    return NextResponse.json({ ok: false, error: 'batch_too_large', max: 500 }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          siteUrl: `https://${HOST}`,
          urlList: urls,
        }),
      },
    );

    // Bing returns `{ "d": null }` on success (quirky JSON-WCF format).
    // Failure: 4xx with an error body.
    const text = await res.text();
    let parsed: unknown;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text }; }

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submitted: urls.length,
      bing_response: parsed,
    }, { status: res.ok ? 200 : 502 });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: 'bing_unreachable',
      detail: err instanceof Error ? err.message : 'unknown',
    }, { status: 502 });
  }
}

// GET — quota check. Bing exposes a `GetUrlSubmissionQuota` endpoint that's
// useful for understanding daily/monthly limits.
export async function GET() {
  const apiKey = process.env.BING_WEBMASTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'bing_api_key_missing' }, { status: 503 });
  }
  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(`https://${HOST}`)}`,
      { cache: 'no-store' },
    );
    const json = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: res.ok, status: res.status, quota: json });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'unknown' }, { status: 500 });
  }
}
