/**
 * Spam-shield linter endpoint.
 *
 *   POST /api/autodm/lint
 *     { dm_template, dm_template_variants?, cta_url?,
 *       comment_reply?, comment_reply_follower? }
 *
 * Returns: { ok: true, findings: LintFinding[] }
 *
 * Stateless — no auth needed beyond the public app. Anyone can lint a
 * draft. Used by the dashboard RulesEditor while the creator types.
 */

import { NextRequest, NextResponse } from 'next/server';
import { lintRule } from '@stackpicks/core/autodm/spam-shield';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const findings = lintRule({
    dm_template: String(body.dm_template ?? ''),
    dm_template_variants: Array.isArray(body.dm_template_variants)
      ? (body.dm_template_variants as string[])
      : null,
    cta_url: (body.cta_url as string) ?? null,
    comment_reply: (body.comment_reply as string) ?? null,
    comment_reply_follower: (body.comment_reply_follower as string) ?? null,
  });
  return NextResponse.json({ ok: true, findings });
}
