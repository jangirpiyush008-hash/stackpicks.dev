/**
 * POST /api/auth/invalidate-other-sessions
 *
 * Server-side admin call that signs the user out everywhere EXCEPT the
 * current request. Used right after a successful password change so any
 * other devices that had a live session (a stolen laptop, an old phone)
 * stop being authenticated immediately.
 *
 * Requires a live session — the user must call this from a browser they
 * just authenticated on. The admin client uses the service-role key to
 * issue `auth.admin.signOut(userId, 'others')`; the calling session is
 * NOT revoked.
 *
 * Audit-logged as 'sessions_invalidated'.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { writeAudit, clientIp } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  // signOut(userId, scope?) — scope='others' kills every refresh token
  // except the one tied to the current request's session.
  const { error } = await admin.auth.admin.signOut(user.id, 'others');
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  void writeAudit({
    userId: user.id,
    action: 'sessions_invalidated',
    ip: clientIp(req),
    userAgent: req.headers.get('user-agent'),
  });

  return NextResponse.json({ ok: true });
}
