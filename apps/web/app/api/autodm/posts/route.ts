/**
 * List recent IG posts for the active tenant.
 *
 *   GET /api/autodm/posts
 *
 * Powers the "Pin to specific post" dropdown in the rule editor. We hit
 * graph.instagram.com/{ig-user-id}/media with the tenant's encrypted
 * token, decrypted at request time. Capped at 20 posts.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { decryptToken } from '@stackpicks/core/autodm/crypto';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH_IG = 'https://graph.instagram.com/v22.0';

interface MediaRow {
  id: string;
  caption?: string;
  media_type?: string;
  permalink?: string;
  timestamp?: string;
}

export async function GET() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant: tlite } = await getActiveTenant(admin, user.id, preferredId);
  if (!tlite) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  const { data: row } = await admin
    .from('autodm_tenants')
    .select('ig_business_id, ig_user_token_encrypted')
    .eq('id', tlite.id)
    .single();
  const t = row as { ig_business_id: string; ig_user_token_encrypted: string | null } | null;
  if (!t?.ig_user_token_encrypted) {
    return NextResponse.json({ ok: false, error: 'no_token' }, { status: 400 });
  }

  let token: string;
  try { token = decryptToken(t.ig_user_token_encrypted); }
  catch { return NextResponse.json({ ok: false, error: 'token_decrypt' }, { status: 500 }); }

  const res = await fetch(
    `${GRAPH_IG}/${t.ig_business_id}/media?fields=id,caption,media_type,permalink,timestamp&limit=20&access_token=${encodeURIComponent(token)}`,
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return NextResponse.json({ ok: false, error: `ig:${res.status}:${body.slice(0, 120)}` }, { status: 502 });
  }
  const j = (await res.json()) as { data?: MediaRow[] };
  const posts = (j.data ?? []).map((m) => ({
    id: m.id,
    caption: (m.caption ?? '').slice(0, 120),
    media_type: m.media_type ?? 'IMAGE',
    permalink: m.permalink,
    timestamp: m.timestamp,
  }));
  return NextResponse.json({ ok: true, posts });
}
