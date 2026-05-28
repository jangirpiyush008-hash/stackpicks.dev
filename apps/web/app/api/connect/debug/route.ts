import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase-server';
import { createConnectSession } from '@stackpicks/core/nango/client';
import { SITE } from '@stackpicks/core/constants';

/**
 * GET /api/connect/debug
 *
 * Temporary diagnostic — shows whether NANGO_SECRET_KEY is set and what
 * Nango's /integrations endpoint returns with it. Lets us see if the key
 * actually sees the `github` integration. Login-gated. Delete after Phase 1.
 */
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  const host = (process.env.NANGO_HOST || 'https://api.nango.dev').trim().replace(/\/$/, '');
  const secret = process.env.NANGO_SECRET_KEY?.trim();

  const diag: Record<string, unknown> = {
    nango_host: host,
    secret_set: !!secret,
    secret_prefix: secret ? `${secret.slice(0, 8)}…` : null,
    secret_length: secret?.length ?? 0,
  };

  if (secret) {
    // List integrations the key can see.
    try {
      const res = await fetch(`${host}/integrations`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      diag.integrations_status = res.status;
      const body = await res.text();
      try {
        diag.integrations = JSON.parse(body);
      } catch {
        diag.integrations_raw = body.slice(0, 1500);
      }
    } catch (e) {
      diag.integrations_error = String(e);
    }

    // Also try the exact connect-session call that's failing.
    try {
      const res = await fetch(`${host}/connect/sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          end_user: { id: user.id, email: user.email ?? undefined },
          allowed_integrations: ['github'],
        }),
      });
      diag.session_status = res.status;
      const body = await res.text();
      try {
        diag.session_response = JSON.parse(body);
      } catch {
        diag.session_raw = body.slice(0, 1500);
      }
    } catch (e) {
      diag.session_error = String(e);
    }

    // Now call the EXACT function the /connect/[provider]/start route uses,
    // so we test the real deployed code path (not an inline copy).
    try {
      const real = await createConnectSession({
        provider: 'github',
        endUserId: user.id,
        endUserEmail: user.email ?? undefined,
        redirectUri: `${SITE.url}/api/connect/github/callback`,
      });
      diag.real_createConnectSession = { ok: true, url: real.url };
    } catch (e) {
      diag.real_createConnectSession = { ok: false, error: String(e) };
    }
  }

  return NextResponse.json(diag, { headers: { 'Cache-Control': 'no-store' } });
}
