// Railway cron: every 30 min. Picks ig_queue rows where status='ready' AND
// scheduled_at <= now(), publishes via Graph API, updates status.
//
// Auth: Bearer ${CRON_SECRET}. Same pattern as /api/cron/scrape-github.

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { publishToInstagram } from '@stackpicks/core/instagram/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min — covers Meta's container processing time

const MAX_ATTEMPTS = 3;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supa = adminClient();
  // Pick at most 3 due rows per run — IG rate-limits to 25 posts/24h, but
  // we want to spread posts naturally so 3 per 30-min cron is plenty.
  const { data: due, error } = await supa
    .from('ig_queue')
    .select('*')
    .eq('status', 'ready')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(3);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!due?.length) return NextResponse.json({ ok: true, processed: 0, message: 'nothing due' });

  const results: Array<Record<string, unknown>> = [];

  for (const row of due) {
    // Mark processing to avoid double-publish if cron overlaps
    await supa.from('ig_queue').update({ status: 'processing', attempts: row.attempts + 1 }).eq('id', row.id);

    const res = await publishToInstagram({
      postType: row.post_type,
      mediaUrls: row.media_urls,
      coverUrl: row.cover_url ?? undefined,
      caption: row.caption,
      hashtags: row.hashtags ?? '',
    });

    if (res.ok) {
      await supa.from('ig_queue').update({
        status: 'posted',
        posted_at: new Date().toISOString(),
        ig_creation_id: res.ig_creation_id,
        ig_post_id: res.ig_post_id,
        last_error: null,
      }).eq('id', row.id);
      results.push({ id: row.id, status: 'posted', ig_post_id: res.ig_post_id });
    } else {
      const reschedule = row.attempts + 1 < MAX_ATTEMPTS;
      await supa.from('ig_queue').update({
        status: reschedule ? 'ready' : 'error',
        last_error: res.error?.slice(0, 1000),
        last_error_at: new Date().toISOString(),
        // Back off 30 min per attempt
        scheduled_at: reschedule
          ? new Date(Date.now() + 30 * 60 * 1000 * (row.attempts + 1)).toISOString()
          : row.scheduled_at,
      }).eq('id', row.id);
      results.push({ id: row.id, status: reschedule ? 'retry' : 'error', error: res.error });
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
