/**
 * AutoDM click tracker — redirects to the original CTA URL while
 * recording the click on the originating dm_log row.
 *
 *   GET https://autodm.stackpicks.dev/c/<shortId>
 *
 * The middleware rewrites autodm.stackpicks.dev/* → /autodm/*
 * internally, so this Next.js route file lives at /autodm/c/[shortId]
 * but is reached at the bare path /c/<shortId> on the AutoDM subdomain.
 *
 * Effects:
 *   • increments click_count
 *   • sets clicked_at the first time, last_clicked_at on every click
 *   • 302 redirects to original_cta_url (or the AutoDM landing if missing)
 *
 * Intentionally cheap — no auth, no shared cache; this URL is in DMs
 * and may be hit hundreds of times per recipient.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> },
) {
  const { shortId } = await params;
  if (!shortId || shortId.length < 6) {
    return NextResponse.redirect(new URL('/autodm', _req.url));
  }

  const supa = adminClient();
  const { data: row } = await supa
    .from('autodm_dm_log')
    .select('id, original_cta_url, click_count, clicked_at')
    .eq('short_id', shortId)
    .single();

  if (!row) {
    // Stale or revoked link — send them to the AutoDM landing instead of 404
    return NextResponse.redirect(new URL('/autodm', _req.url));
  }

  // Record the click. We DON'T await this — we want the redirect to be
  // instant. Supabase fire-and-forget is fine on a non-critical path.
  const now = new Date().toISOString();
  void supa.from('autodm_dm_log').update({
    click_count: (row.click_count ?? 0) + 1,
    last_clicked_at: now,
    clicked_at: row.clicked_at ?? now,
  }).eq('id', row.id);

  const destination = (row.original_cta_url as string) || autodmOrigin();
  return NextResponse.redirect(destination, { status: 302 });
}
