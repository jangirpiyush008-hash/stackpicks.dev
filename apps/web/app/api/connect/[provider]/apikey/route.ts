import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getAppBySlug } from '../../../../../lib/connect-apps';
import { isApiKeyProvider, API_KEY_HINTS } from '@stackpicks/core/connect/providers';
import { encryptSecret, last4 } from '@stackpicks/core/connect/crypto';
import { isConnectLaunched } from '../../../../../lib/connect-roadmap';
import { isAdmin } from '../../../../../lib/admin';

/**
 * POST /api/connect/[provider]/apikey   { key: string }
 * Stores the user's API key for an API-key provider (Firecrawl, etc.),
 * encrypted at rest. Never returns the key. Gated like OAuth connect.
 *
 * DELETE /api/connect/[provider]/apikey  — revokes it.
 */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const app = getAppBySlug(provider);
  if (!app) return new NextResponse('unknown provider', { status: 404 });
  if (!isApiKeyProvider(provider)) {
    return NextResponse.json({ ok: false, error: 'not an API-key provider' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  // Launch gate — admins bypass.
  if (!isConnectLaunched() && !(await isAdmin()).ok) {
    return NextResponse.json({ ok: false, error: 'coming_soon' }, { status: 403 });
  }

  let body: { key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  const apiKey = body.key?.trim();
  if (!apiKey) return NextResponse.json({ ok: false, error: 'missing key' }, { status: 400 });

  // Light prefix validation if we know the expected shape.
  const hint = API_KEY_HINTS[provider];
  if (hint?.prefix && !apiKey.startsWith(hint.prefix)) {
    return NextResponse.json(
      { ok: false, error: `Expected a ${hint.label} (starts with "${hint.prefix}").` },
      { status: 400 },
    );
  }

  let cipher: string;
  try {
    cipher = encryptSecret(apiKey);
  } catch (err) {
    console.error('[apikey] encrypt failed', err);
    return NextResponse.json({ ok: false, error: 'server not configured for key storage' }, { status: 500 });
  }

  const admin = adminClient();
  const { error } = await admin.from('api_key_connections').upsert(
    {
      user_id: user.id,
      provider,
      key_cipher: cipher,
      key_last4: last4(apiKey),
      status: 'active',
    },
    { onConflict: 'user_id,provider' },
  );
  if (error) {
    console.error('[apikey] upsert failed', error.message);
    return NextResponse.json({ ok: false, error: 'could not save key' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  const admin = adminClient();
  await admin
    .from('api_key_connections')
    .update({ status: 'revoked' })
    .eq('user_id', user.id)
    .eq('provider', provider);
  return NextResponse.json({ ok: true });
}
