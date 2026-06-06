/**
 * Super-admin actions on a specific tenant.
 *
 *   PATCH /api/admin/autodm/tenant?id=<tenant_id>
 *     body: { action, plan_tier?, paused_until? }
 *     actions:
 *       resume                 — clear paused_until + paused_reason
 *       pause_24h              — set paused_until = now+24h
 *       recompute_caps         — recompute hourly/daily caps via warming logic
 *       override_plan_tier     — manual plan change (for support refunds, comps)
 *       reset_hourly_window    — delete tenant's autodm_dm_log 'sent' rows in
 *                                last 60 min (gives breathing room after rate-limit)
 *
 * Strict isAdmin() gate — same auth as other /api/admin/*.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../../lib/admin';
import { computeWarmingCaps } from '@stackpicks/core/autodm/spam-shield';
import type { PlanTier } from '@stackpicks/core/autodm/types';

export const runtime = 'nodejs';

const ALLOWED_TIERS: PlanTier[] = ['free', 'creator', 'pro', 'agency'];
const ALLOWED_ACTIONS = [
  'resume', 'pause_24h', 'recompute_caps', 'override_plan_tier', 'reset_hourly_window',
] as const;
type Action = typeof ALLOWED_ACTIONS[number];

export async function PATCH(req: NextRequest) {
  const adminCheck = await isAdmin();
  if (!adminCheck.ok) return NextResponse.json({ ok: false }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });

  const body = (await req.json()) as { action?: Action; plan_tier?: PlanTier };
  if (!body.action || !ALLOWED_ACTIONS.includes(body.action)) {
    return NextResponse.json({ ok: false, error: 'bad action' }, { status: 400 });
  }

  const admin = adminClient();
  const { data: tenant } = await admin
    .from('autodm_tenants')
    .select('id, plan_tier, created_at, account_warming_ends_at, ig_username')
    .eq('id', id).single();
  if (!tenant) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });

  switch (body.action) {
    case 'resume': {
      await admin.from('autodm_tenants').update({
        paused_until: null, paused_reason: null,
      }).eq('id', id);
      return NextResponse.json({ ok: true, by: adminCheck.email, action: 'resume' });
    }
    case 'pause_24h': {
      await admin.from('autodm_tenants').update({
        paused_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paused_reason: `Paused by admin (${adminCheck.email})`,
      }).eq('id', id);
      return NextResponse.json({ ok: true, by: adminCheck.email, action: 'pause_24h' });
    }
    case 'recompute_caps': {
      const caps = computeWarmingCaps({
        plan_tier: tenant.plan_tier as PlanTier,
        created_at: tenant.created_at as string,
        account_warming_ends_at: tenant.account_warming_ends_at as string | null,
      });
      await admin.from('autodm_tenants').update({
        hourly_cap: caps.hourly_cap, daily_cap: caps.daily_cap,
        ...(caps.warming_active ? {} : { account_warming_ends_at: null }),
      }).eq('id', id);
      return NextResponse.json({ ok: true, caps });
    }
    case 'override_plan_tier': {
      if (!body.plan_tier || !ALLOWED_TIERS.includes(body.plan_tier)) {
        return NextResponse.json({ ok: false, error: 'plan_tier required' }, { status: 400 });
      }
      const caps = computeWarmingCaps({
        plan_tier: body.plan_tier,
        created_at: tenant.created_at as string,
        account_warming_ends_at: tenant.account_warming_ends_at as string | null,
      });
      await admin.from('autodm_tenants').update({
        plan_tier: body.plan_tier,
        hourly_cap: caps.hourly_cap, daily_cap: caps.daily_cap,
      }).eq('id', id);
      return NextResponse.json({ ok: true, plan_tier: body.plan_tier, caps });
    }
    case 'reset_hourly_window': {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await admin.from('autodm_dm_log')
        .delete({ count: 'exact' })
        .eq('tenant_id', id)
        .eq('status', 'sent')
        .gte('created_at', hourAgo);
      return NextResponse.json({ ok: true, deleted: count ?? 0 });
    }
  }
}
