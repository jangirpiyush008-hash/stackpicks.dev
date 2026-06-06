/**
 * Per-variant performance for a rule.
 *
 *   GET /api/autodm/rules/{ruleId}/variants
 *
 * Returns the variant leaderboard the analytics + rules editor surfaces.
 * Caller must own the rule (verified by joining through autodm_tenants).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { variantLeaderboard, type VariantPerf } from '@stackpicks/core/autodm/ab-test';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> },
) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const { ruleId } = await params;
  const admin = adminClient();

  // Authorize: rule must belong to a tenant owned by user
  const { data: rule } = await admin
    .from('autodm_rules')
    .select('id, tenant_id, dm_template, dm_template_variants, autodm_tenants!inner(owner_user_id)')
    .eq('id', ruleId)
    .single();
  if (!rule) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  // The joined relation comes back as an array OR object depending on
  // pg_meta; normalize and check ownership.
  const tenantRel = rule.autodm_tenants as unknown as { owner_user_id: string } | { owner_user_id: string }[];
  const ownerId = Array.isArray(tenantRel) ? tenantRel[0]?.owner_user_id : tenantRel?.owner_user_id;
  if (ownerId !== user.id) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const variants = rule.dm_template_variants && rule.dm_template_variants.length > 0
    ? (rule.dm_template_variants as string[])
    : [rule.dm_template as string];

  // Aggregate last 30 days
  const monthAgo = new Date(Date.now() - 30 * 86400_000).toISOString();
  const { data: logs } = await admin
    .from('autodm_dm_log')
    .select('body_variant_index, click_count')
    .eq('rule_id', ruleId)
    .eq('status', 'sent')
    .gt('created_at', monthAgo)
    .limit(3000);

  const perfMap: Record<number, VariantPerf> = {};
  for (let i = 0; i < variants.length; i++) perfMap[i] = { index: i, sent: 0, clicks: 0 };
  for (const r of logs ?? []) {
    const i = (r.body_variant_index as number | null) ?? 0;
    if (!perfMap[i]) perfMap[i] = { index: i, sent: 0, clicks: 0 };
    perfMap[i].sent++;
    const c = (r.click_count as number | null) ?? 0;
    if (c > 0) perfMap[i].clicks++;
  }
  const board = variantLeaderboard(Object.values(perfMap));

  return NextResponse.json({
    ok: true,
    variants: variants.map((text, i) => ({
      index: i,
      text,
      ...board.find((b) => b.index === i),
    })),
  });
}
