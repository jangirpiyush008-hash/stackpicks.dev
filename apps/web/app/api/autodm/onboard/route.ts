/**
 * AI onboarding endpoint — fires once per tenant on first dashboard view
 * (or via "Re-run onboarding" button). Generates 5 draft rules in the
 * creator's voice, saved as is_active=false so they can review/approve.
 *
 * Idempotent: if any rules exist for this tenant, returns those without
 * re-running. Force re-run with ?force=1.
 *
 * NOTE: This is a slow route (Claude + multiple Graph API calls). Returns
 * synchronously for now; move to a background job once we hit scale.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { decryptToken } from '@stackpicks/core/autodm/crypto';
import { fetchCreatorSnapshot, generateStarterRules } from '@stackpicks/core/autodm/ai-onboarding';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants')
    .select('id, ig_business_id, ig_username, ig_user_token_encrypted')
    .eq('owner_user_id', user.id).limit(1);
  const tenant = tenants?.[0];
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });
  if (!tenant.ig_user_token_encrypted) return NextResponse.json({ ok: false, error: 'no_token' }, { status: 400 });

  const force = new URL(req.url).searchParams.get('force') === '1';

  // Idempotency: skip if tenant already has rules and not forcing
  if (!force) {
    const { count } = await admin.from('autodm_rules')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id);
    if ((count ?? 0) > 0) {
      return NextResponse.json({ ok: true, skipped: 'already_onboarded' });
    }
  }

  let pageToken: string;
  try { pageToken = decryptToken(tenant.ig_user_token_encrypted); }
  catch { return NextResponse.json({ ok: false, error: 'decrypt' }, { status: 500 }); }

  let snapshot;
  try {
    snapshot = await fetchCreatorSnapshot(tenant.ig_business_id, pageToken);
  } catch (e) {
    return NextResponse.json({ ok: false, error: `graph_fetch:${(e as Error).message}` }, { status: 500 });
  }

  let drafts;
  try {
    drafts = await generateStarterRules({
      igUsername: tenant.ig_username || 'creator',
      captions: snapshot.captions,
      comments: snapshot.comments,
      fallbackCtaUrl: 'https://stackpicks.dev',
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: `claude:${(e as Error).message}` }, { status: 500 });
  }

  // Insert as is_active=false — creator approves on dashboard
  const rows = drafts.map((d) => ({
    tenant_id: tenant.id,
    label: d.label,
    keyword: d.keyword,
    dm_template: d.dm_template,
    comment_reply: d.comment_reply,
    comment_reply_follower: d.comment_reply_follower,
    ai_personality_hint: d.ai_personality_hint ?? null,
    cta_url: null,                  // creator fills CTA URL per-rule
    cta_label: null,
    follow_nudge: false,
    daily_cap_per_recipient: 1,
    is_active: false,
    use_ai_generation: false,
  }));
  const { data: inserted, error: insErr } = await admin
    .from('autodm_rules').insert(rows).select();
  if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    rules_created: inserted?.length ?? 0,
    sample_comments_seen: snapshot.comments.length,
    posts_scanned: snapshot.captions.length,
  });
}
