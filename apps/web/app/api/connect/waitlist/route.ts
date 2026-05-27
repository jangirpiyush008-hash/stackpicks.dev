import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getAppBySlug } from '../../../../lib/connect-apps';

/**
 * POST /api/connect/waitlist  { provider: string }
 *
 * User clicks "Notify me" on a 'soon' app. We record demand so we can wire
 * the most-requested providers next. Anon users are allowed — we just store
 * with user_id = null. Email capture happens elsewhere (newsletter).
 */
export async function POST(req: Request) {
  let payload: { provider?: string };
  try {
    payload = await req.json();
  } catch {
    return new NextResponse('bad json', { status: 400 });
  }
  const provider = payload.provider?.trim();
  if (!provider || !getAppBySlug(provider)) {
    return new NextResponse('unknown provider', { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = adminClient();
  await admin
    .from('mcp_waitlist')
    .upsert(
      { user_id: user?.id ?? null, provider },
      { onConflict: 'user_id,provider' },
    );

  return NextResponse.json({ ok: true });
}
