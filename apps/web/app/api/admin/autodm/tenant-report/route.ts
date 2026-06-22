/**
 * Per-tenant data export — admin only.
 *
 *   GET /api/admin/autodm/tenant-report?tenant_id=<uuid>&format=csv|json
 *
 * Returns a complete report of one tenant (creator) — every legally-storable
 * field plus aggregate DM stats and the full DM log. Used to satisfy:
 *   - DPDP Section 11 (data subject access requests from creators)
 *   - Support tickets ("what does the platform know about me?")
 *   - Compliance audits
 *
 * COMPLIANCE GUARDRAILS:
 *   - Commenter PII (recipient @handles) is included because creators have a
 *     legitimate need to know who they DM'd. NOT exportable to ads or
 *     third parties (admin-only endpoint).
 *   - Encrypted token field (ig_user_token_encrypted) is REDACTED — admins
 *     never see plaintext tokens; only the prefix is shown.
 *   - The endpoint writes to autodm_audit_log on every call so we can prove
 *     who exported what and when (DPDP audit trail requirement).
 */
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { adminClient } from '@stackpicks/core/db';
import { writeAudit } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const check = await isAdmin();
  if (!check.ok) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const tenantId = url.searchParams.get('tenant_id');
  const format = (url.searchParams.get('format') || 'json').toLowerCase();
  if (!tenantId) return NextResponse.json({ ok: false, error: 'tenant_id required' }, { status: 400 });
  if (format !== 'csv' && format !== 'json') {
    return NextResponse.json({ ok: false, error: 'format must be csv or json' }, { status: 400 });
  }

  const admin = adminClient();
  const { data: tenant } = await admin
    .from('autodm_tenants')
    .select('*')
    .eq('id', tenantId)
    .single();
  if (!tenant) return NextResponse.json({ ok: false, error: 'tenant_not_found' }, { status: 404 });

  // Owner email (best-effort)
  let ownerEmail: string | null = null;
  try {
    const { data: u } = await admin.auth.admin.getUserById((tenant as Record<string, unknown>).owner_user_id as string);
    ownerEmail = u?.user?.email ?? null;
  } catch { /* non-fatal */ }

  const { data: rules } = await admin
    .from('autodm_rules')
    .select('id, label, keyword, dm_template, cta_url, cta_label, is_active, follow_nudge, daily_cap_per_recipient, ai_personality_hint, created_at, updated_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  const { data: dms } = await admin
    .from('autodm_dm_log')
    .select('id, rule_id, trigger_event, trigger_post_id, ig_username, status, error, sent_body, click_count, clicked_at, reply_status, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(5000); // Generous cap — exporting > 5k rows is unusual; CSV may exceed 5MB

  // Redact the encrypted token field — never expose even to admins.
  const t = tenant as Record<string, unknown>;
  const redacted = { ...t };
  if (redacted.ig_user_token_encrypted) {
    const enc = String(redacted.ig_user_token_encrypted);
    redacted.ig_user_token_encrypted = `(redacted · ${enc.length} bytes · prefix:${enc.slice(0, 8)}…)`;
  }

  // Audit log — DPDP requires we record every export so creators can later
  // ask "who has accessed my data?"
  void writeAudit({
    userId: check.email ?? 'admin',
    action: 'tenant_report_export',
    targetId: tenantId,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: req.headers.get('user-agent') ?? null,
    meta: { format, target_type: 'autodm_tenant', dm_count: dms?.length ?? 0, rule_count: rules?.length ?? 0 },
  });

  const report = {
    generated_at: new Date().toISOString(),
    generated_by: check.email ?? '(admin)',
    tenant: { ...redacted, owner_email: ownerEmail },
    rules: rules ?? [],
    dm_log: dms ?? [],
    counts: {
      rules_total: rules?.length ?? 0,
      rules_active: (rules ?? []).filter((r) => r.is_active).length,
      dms_total: dms?.length ?? 0,
      dms_sent: (dms ?? []).filter((d) => d.status === 'sent').length,
      dms_failed: (dms ?? []).filter((d) => d.status === 'failed' || d.status === 'error').length,
      dms_clicked: (dms ?? []).filter((d) => (d.click_count ?? 0) > 0).length,
    },
    privacy_notice: {
      meta_terms: 'Meta Platform Terms §4.b — recipient data must not be aggregated for use outside the immediate purpose.',
      india_dpdp: 'India DPDP Act §11 — data subject access. This export satisfies that right.',
      ads_use_prohibition: 'Recipient @handles in this export MUST NOT be used for ad targeting, audience-list building, or any purpose other than tenant support.',
    },
  };

  if (format === 'json') {
    return NextResponse.json(report, {
      headers: {
        'content-disposition': `attachment; filename="autodm-tenant-${tenantId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  }

  // CSV — flatten as several sections. CSV consumers (Excel / Sheets) handle
  // multi-section files via blank-line separators.
  const lines: string[] = [];
  lines.push('# AutoDM tenant report');
  lines.push(`# generated_at,${report.generated_at}`);
  lines.push(`# generated_by,${csv(report.generated_by)}`);
  lines.push('');
  lines.push('## tenant');
  for (const [k, v] of Object.entries(report.tenant)) lines.push(`${k},${csv(v)}`);
  lines.push('');
  lines.push('## counts');
  for (const [k, v] of Object.entries(report.counts)) lines.push(`${k},${v}`);
  lines.push('');
  lines.push('## rules');
  if (rules && rules.length) {
    const keys = Object.keys(rules[0]);
    lines.push(keys.join(','));
    for (const r of rules) lines.push(keys.map((k) => csv((r as Record<string, unknown>)[k])).join(','));
  }
  lines.push('');
  lines.push('## dm_log');
  if (dms && dms.length) {
    const keys = Object.keys(dms[0]);
    lines.push(keys.join(','));
    for (const d of dms) lines.push(keys.map((k) => csv((d as Record<string, unknown>)[k])).join(','));
  }
  lines.push('');
  lines.push('# privacy_notice');
  for (const [k, v] of Object.entries(report.privacy_notice)) lines.push(`# ${k},${csv(v)}`);

  return new NextResponse(lines.join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="autodm-tenant-${tenantId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function csv(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
