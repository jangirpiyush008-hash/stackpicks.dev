/**
 * Diagnostic — reruns step (a) of the IG carousel publish flow against the
 * first slide of a given queue row. Shows Meta's verbatim response so we
 * know exactly what's failing.
 *
 *   GET /api/admin/ig-publish-test?topic=mcp+2026-07-28+spec+drop
 *
 * Returns the raw Graph API response — no parsing, no abstraction.
 * Admin only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH = 'https://graph.facebook.com/v21.0';

export async function GET(req: NextRequest) {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });

  const topic = new URL(req.url).searchParams.get('topic');
  if (!topic) return NextResponse.json({ ok: false, error: 'topic required' }, { status: 400 });

  const supa = adminClient();
  const { data: row, error: rowErr } = await supa
    .from('ig_queue')
    .select('id, post_type, media_urls, caption')
    .eq('topic', topic)
    .single();
  if (rowErr || !row) return NextResponse.json({ ok: false, error: 'no row' }, { status: 404 });

  const firstUrl = (row.media_urls as string[])?.[0];
  if (!firstUrl) return NextResponse.json({ ok: false, error: 'no media_urls' }, { status: 400 });

  const token = process.env.META_LONG_TOKEN;
  const ig = process.env.IG_BUSINESS_ID;
  if (!token || !ig) {
    return NextResponse.json({ ok: false, error: 'env missing' }, { status: 500 });
  }

  // STEP 0 — Verify the image URL is publicly reachable (Meta has to fetch it)
  const imageProbe: Record<string, unknown> = { url: firstUrl };
  try {
    const probeRes = await fetch(firstUrl, { method: 'HEAD' });
    imageProbe.status = probeRes.status;
    imageProbe.ok = probeRes.ok;
    imageProbe.content_type = probeRes.headers.get('content-type');
    imageProbe.content_length = probeRes.headers.get('content-length');
  } catch (e) {
    imageProbe.fetch_error = (e as Error).message;
  }

  // STEP 1 — The exact call that's failing: create a carousel-item child container
  const params = new URLSearchParams({
    image_url: firstUrl,
    is_carousel_item: 'true',
    access_token: token,
  });
  const callResults: Record<string, unknown> = {};

  try {
    const res = await fetch(`${GRAPH}/${ig}/media`, { method: 'POST', body: params });
    const text = await res.text();
    callResults.step_a_carousel_child = {
      status: res.status,
      ok: res.ok,
      body: text.slice(0, 2000),
    };
  } catch (e) {
    callResults.step_a_carousel_child = { error: (e as Error).message };
  }

  // STEP 2 — Test a simple image post WITHOUT carousel-item flag (different code path)
  try {
    const simpleParams = new URLSearchParams({
      image_url: firstUrl,
      access_token: token,
    });
    const res = await fetch(`${GRAPH}/${ig}/media`, { method: 'POST', body: simpleParams });
    const text = await res.text();
    callResults.step_b_simple_image = {
      status: res.status,
      ok: res.ok,
      body: text.slice(0, 2000),
    };
  } catch (e) {
    callResults.step_b_simple_image = { error: (e as Error).message };
  }

  // STEP 3 — Read endpoint to confirm token works for READS (if reads ok but writes fail = permission issue)
  try {
    const res = await fetch(`${GRAPH}/${ig}?fields=id,username,media_count&access_token=${encodeURIComponent(token)}`);
    callResults.step_c_account_read = {
      status: res.status,
      ok: res.ok,
      body: (await res.text()).slice(0, 500),
    };
  } catch (e) {
    callResults.step_c_account_read = { error: (e as Error).message };
  }

  // STEP 4 — Token debug info from Meta
  try {
    const res = await fetch(`${GRAPH}/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(token)}`);
    callResults.step_d_token_debug = {
      status: res.status,
      body: (await res.text()).slice(0, 1500),
    };
  } catch (e) {
    callResults.step_d_token_debug = { error: (e as Error).message };
  }

  return NextResponse.json({
    ok: true,
    queue_row: { id: row.id, topic, post_type: row.post_type, slide_count: (row.media_urls as string[]).length },
    image_url_probe: imageProbe,
    api_calls: callResults,
  });
}
