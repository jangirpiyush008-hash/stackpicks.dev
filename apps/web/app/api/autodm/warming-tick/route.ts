/**
 * Account-warming auto-ramp — runs on a daily cron.
 *
 * For every tenant whose computed caps differ from their stored caps,
 * write the new caps. Phases (defined in core/autodm/spam-shield.ts):
 *   Day 0-6:   30% of plan caps
 *   Day 7-13:  60% of plan caps
 *   Day 14-20: 100% of plan caps
 *   Day 21+:   plan caps, warming_active=false
 *
 * Auth: Bearer ${CRON_SECRET} (same secret as ig-publish cron).
 *
 * Suggested cron: every day at 00:30 IST.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { computeWarmingCaps } from '@stackpicks/core/autodm/spam-shield';
import type { PlanTier } from '@stackpicks/core/autodm/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supa = adminClient();
  const { data: tenants, error } = await supa
    .from('autodm_tenants')
    .select('id, plan_tier, created_at, account_warming_ends_at, hourly_cap, daily_cap')
    .eq('is_active', true);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const updates: { id: string; from: string; to: string }[] = [];
  let scanned = 0;

  for (const t of tenants ?? []) {
    scanned++;
    const planTier = t.plan_tier as PlanTier;
    const target = computeWarmingCaps({
      plan_tier: planTier,
      created_at: t.created_at as string,
      account_warming_ends_at: t.account_warming_ends_at as string | null,
    });

    if (target.hourly_cap === t.hourly_cap && target.daily_cap === t.daily_cap) continue;

    await supa.from('autodm_tenants').update({
      hourly_cap: target.hourly_cap,
      daily_cap:  target.daily_cap,
      // Clear warming end when phase 3 (100%) is reached
      ...(target.warming_active ? {} : { account_warming_ends_at: null }),
    }).eq('id', t.id as string);

    updates.push({
      id: t.id as string,
      from: `${t.hourly_cap}/hr · ${t.daily_cap}/day`,
      to:   `${target.hourly_cap}/hr · ${target.daily_cap}/day`,
    });
  }

  return NextResponse.json({ ok: true, scanned, updated: updates.length, updates });
}
