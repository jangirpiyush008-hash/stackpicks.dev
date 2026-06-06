/**
 * AutoDM MCP API keys — issue + list + revoke. Tenant-scoped via auth.uid().
 *
 *   GET    /api/autodm/api-keys         → list keys (no plaintext, just prefix + label)
 *   POST   /api/autodm/api-keys         { label } → issue new key, return plaintext ONCE
 *   DELETE /api/autodm/api-keys?id=<id> → revoke (sets revoked_at)
 *
 * Plaintext format: sk_autodm_<32 random hex>. We store only sha256(key).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';

type Ctx =
  | { ok: false; error: 'auth' | 'no_tenant' }
  | { ok: true; tenantId: string; admin: ReturnType<typeof adminClient> };

async function getTenant(): Promise<Ctx> {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return { ok: false, error: 'auth' };
  const admin = adminClient();
  const { data } = await admin.from('autodm_tenants')
    .select('id').eq('owner_user_id', user.id).limit(1);
  const tenantId = data?.[0]?.id;
  if (!tenantId) return { ok: false, error: 'no_tenant' };
  return { ok: true, tenantId, admin };
}

export async function GET() {
  const ctx = await getTenant();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const { data, error } = await ctx.admin
    .from('autodm_api_keys')
    .select('id, label, prefix, last_used_at, created_at, revoked_at')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, keys: data });
}

export async function POST(req: NextRequest) {
  const ctx = await getTenant();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { label?: string };

  // Issue: sk_autodm_<32 hex>
  const random = randomBytes(16).toString('hex');
  const plaintext = `sk_autodm_${random}`;
  const hash = createHash('sha256').update(plaintext).digest('hex');
  const prefix = plaintext.slice(0, 16);  // sk_autodm_xxxxx — enough to identify

  const { data, error } = await ctx.admin.from('autodm_api_keys').insert({
    tenant_id: ctx.tenantId,
    label: body.label || 'Untitled',
    key_hash: hash,
    prefix,
  }).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Plaintext returned ONCE — never recoverable after this response.
  return NextResponse.json({
    ok: true,
    key: { id: data.id, label: data.label, prefix, plaintext, created_at: data.created_at },
  });
}

export async function DELETE(req: NextRequest) {
  const ctx = await getTenant();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const { error } = await ctx.admin.from('autodm_api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id).eq('tenant_id', ctx.tenantId);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
