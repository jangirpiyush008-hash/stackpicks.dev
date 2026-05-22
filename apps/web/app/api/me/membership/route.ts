import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Returns the signed-in user's membership status.
 * Uses the user-context client for auth (reads session cookies),
 * then the service-role client to read premium_subscriptions —
 * bypasses any RLS edge case so paid users are never falsely shown as free.
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: true, signed_in: false, is_member: false });
    }

    const admin = adminClient();
    const { data: sub } = await admin
      .from('premium_subscriptions')
      .select('id, plan_id, status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      signed_in: true,
      is_member: !!sub,
      plan_id: sub?.plan_id ?? null,
    });
  } catch (err) {
    console.error('[api/me/membership] error:', err);
    return NextResponse.json(
      { ok: false, error: 'membership_check_failed', is_member: false },
      { status: 500 }
    );
  }
}
