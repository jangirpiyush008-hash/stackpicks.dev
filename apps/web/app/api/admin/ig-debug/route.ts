/**
 * Diagnostic endpoint — reveals what Meta sees about our token + IG account.
 * Returns:
 *   - The IG_BUSINESS_ID env value (last 4 only)
 *   - Whether the token resolves at all + which scopes it has
 *   - Whether the IG account is reachable with this token
 *
 * Admin-only.
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH = 'https://graph.facebook.com/v21.0';

export async function GET() {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });

  const sysToken = process.env.META_LONG_TOKEN;
  const igToken = process.env.IG_USER_TOKEN;
  const token = igToken || sysToken;
  const id = process.env.IG_BUSINESS_ID;
  const out: Record<string, unknown> = {
    env: {
      META_LONG_TOKEN_set: !!sysToken,
      META_LONG_TOKEN_length: sysToken?.length ?? 0,
      META_LONG_TOKEN_first8: sysToken ? sysToken.slice(0, 8) : null,
      META_LONG_TOKEN_last4: sysToken ? sysToken.slice(-6) : null,
      IG_USER_TOKEN_set: !!igToken,
      IG_USER_TOKEN_length: igToken?.length ?? 0,
      IG_USER_TOKEN_first8: igToken ? igToken.slice(0, 8) : null,
      IG_USER_TOKEN_last4: igToken ? igToken.slice(-6) : null,
      IG_USER_TOKEN_has_whitespace: igToken ? /\s/.test(igToken) : null,
      preferring: igToken ? 'IG_USER_TOKEN' : 'META_LONG_TOKEN',
      IG_BUSINESS_ID: id || null,
    },
  };

  if (!token) return NextResponse.json({ ok: false, ...out, error: 'no token in env' });

  // 1. /me — who is this token?
  try {
    const r = await fetch(`${GRAPH}/me?fields=id,name&access_token=${encodeURIComponent(token)}`);
    out.me = await r.json();
  } catch (e) { out.me_error = (e as Error).message; }

  // 2. /debug_token — what scopes/permissions
  try {
    const r = await fetch(`${GRAPH}/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(token)}`);
    out.debug = await r.json();
  } catch (e) { out.debug_error = (e as Error).message; }

  // 3. IG business account — can we read it?
  if (id) {
    try {
      const r = await fetch(`${GRAPH}/${id}?fields=id,username,name&access_token=${encodeURIComponent(token)}`);
      out.ig_account = await r.json();
    } catch (e) { out.ig_account_error = (e as Error).message; }
  }

  // 4. subscribed_apps state
  if (id) {
    try {
      const r = await fetch(`${GRAPH}/${id}/subscribed_apps?access_token=${encodeURIComponent(token)}`);
      out.subscribed_apps = await r.json();
    } catch (e) { out.subscribed_apps_error = (e as Error).message; }
  }

  return NextResponse.json({ ok: true, ...out });
}
