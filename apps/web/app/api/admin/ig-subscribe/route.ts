/**
 * One-shot: subscribe our Meta App to the IG Business Account's webhooks.
 *
 * Configuring the webhook URL + fields in the Meta dashboard is only step 1.
 * Until we POST /<IG_BUSINESS_ID>/subscribed_apps with subscribed_fields,
 * Meta won't actually deliver events to our URL.
 *
 * Admin-only. Idempotent — safe to call repeatedly.
 *
 * GET  → returns current subscription state
 * POST → subscribes (or re-subscribes) the app to the comments field
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH = 'https://graph.facebook.com/v21.0';

function env() {
  const token = process.env.META_LONG_TOKEN;
  const id = process.env.IG_BUSINESS_ID;
  if (!token || !id) {
    throw new Error('META_LONG_TOKEN or IG_BUSINESS_ID env missing in Railway');
  }
  return { token, id };
}

export async function GET() {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const { token, id } = env();
    const res = await fetch(
      `${GRAPH}/${id}/subscribed_apps?access_token=${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    );
    const json = await res.json();
    return NextResponse.json({ ok: res.ok, status: res.status, response: json });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function POST() {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const { token, id } = env();
    const url = `${GRAPH}/${id}/subscribed_apps?subscribed_fields=comments&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({
        ok: false, status: res.status, response: json,
        hint: 'Most common: missing instagram_manage_comments permission on the token, or app in Dev mode without the test IG account assigned.',
      }, { status: 500 });
    }
    return NextResponse.json({ ok: true, response: json });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
