import { NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { getSupabaseServer } from '../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

/**
 * POST /api/connect/keys
 *
 * Mints a new `sp_live_…` API key for the signed-in user. Returns the raw key
 * EXACTLY ONCE. We only store its sha-256 hash. If the user loses it, they
 * have to mint a new one — same model as Stripe, GitHub PATs, etc.
 *
 * Auth: cookie session. Anon → 401.
 */
export async function POST() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  // 32 random bytes → 43-char URL-safe base64. With `sp_live_` prefix → 51 chars.
  const raw = randomBytes(32).toString('base64url');
  const key = `sp_live_${raw}`;
  const keyHash = createHash('sha256').update(key).digest('hex');
  const keyPrefix = key.slice(0, 12);

  const admin = adminClient();
  const { error } = await admin.from('stackpicks_api_keys').insert({
    user_id: user.id,
    name: 'Default',
    key_prefix: keyPrefix,
    key_hash: keyHash,
  });

  if (error) {
    console.error('[connect/keys] insert failed', error.message);
    return new NextResponse('failed to issue key', { status: 500 });
  }

  // Return ONCE. Client must persist it themselves.
  return NextResponse.json({ key, prefix: keyPrefix });
}

/**
 * DELETE /api/connect/keys?id=...
 * Revokes (soft-delete) the named key.
 */
export async function DELETE(req: Request) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return new NextResponse('missing id', { status: 400 });

  const admin = adminClient();
  const { error } = await admin
    .from('stackpicks_api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return new NextResponse('revoke failed', { status: 500 });
  return NextResponse.json({ ok: true });
}
