/**
 * Voice-clone evaluation endpoint.
 *
 *   GET /api/autodm/voice-eval
 *
 * For the active tenant:
 *   1. Pull last 50 DM_logs that were sent (these are AI-rendered DMs in
 *      the creator's voice).
 *   2. Pull the creator's voice samples from autodm_rules.dm_template
 *      (these are the templates the creator either wrote or approved —
 *      our best stand-in for "what the creator sounds like").
 *   3. Build a fingerprint from the templates, score each sent DM, and
 *      summarise.
 *
 * Returns: overall score 0-100, grade, per-sample breakdown, notes.
 *
 * Cheap — runs entirely server-side, no Anthropic calls. Pure analysis.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';
import {
  buildFingerprint,
  scoreSample,
  summariseEval,
} from '@stackpicks/core/autodm/voice-clone-eval';

export const runtime = 'nodejs';

export async function GET() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant } = await getActiveTenant(admin, user.id, preferredId);
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  // Voice samples = templates the creator wrote / approved
  const { data: rules } = await admin
    .from('autodm_rules')
    .select('dm_template, dm_template_variants')
    .eq('tenant_id', tenant.id);
  const voiceSamples: string[] = [];
  for (const r of rules ?? []) {
    if (r.dm_template) voiceSamples.push(r.dm_template as string);
    const variants = r.dm_template_variants as string[] | null;
    if (Array.isArray(variants)) voiceSamples.push(...variants);
  }

  // Generated samples = recent sent DMs (sent_body is what actually went out)
  const { data: logs } = await admin
    .from('autodm_dm_log')
    .select('sent_body')
    .eq('tenant_id', tenant.id as string)
    .eq('status', 'sent')
    .not('sent_body', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);

  const fp = buildFingerprint(voiceSamples);
  const generated = (logs ?? [])
    .map((l) => (l.sent_body as string | null) ?? '')
    .filter((s) => s.length > 0);
  const scored = generated.slice(0, 20).map((t) => scoreSample(t, fp));
  const summary = summariseEval(scored, fp);

  return NextResponse.json({
    ok: true,
    fingerprint: {
      sample_count: fp.sampleCount,
      avg_word_count: Math.round(fp.avgWordCount * 10) / 10,
      avg_emoji_count: Math.round(fp.avgEmojiCount * 10) / 10,
      signature_phrases: fp.signatureBigrams,
      top_openers: fp.topOpeners,
    },
    summary,
    samples_scored: scored.length,
    sample_breakdown: scored.slice(0, 5),  // first 5 for UI surface
  });
}
