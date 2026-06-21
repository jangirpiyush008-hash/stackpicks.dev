/**
 * One-off: publish the teaser-01-07 ig_queue row right now using the same
 * core module the cron uses. Bypasses cron-secret auth entirely.
 *
 *   pnpm tsx --env-file=apps/web/.env.local scripts/publish-teaser-now.ts
 */
import { createClient } from '@supabase/supabase-js';
import { publishToInstagram } from '../core/instagram/publish';

async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: row, error } = await supa
    .from('ig_queue')
    .select('*')
    .eq('topic', 'teaser-01-07')
    .eq('status', 'ready')
    .single();
  if (error || !row) { console.error('No teaser row found:', error?.message); process.exit(1); }
  console.log(`Found row ${row.id} · ${row.media_urls.length} slides · publishing now…`);

  await supa.from('ig_queue').update({ status: 'processing', attempts: (row.attempts ?? 0) + 1 }).eq('id', row.id);

  const res = await publishToInstagram({
    postType: row.post_type,
    mediaUrls: row.media_urls,
    coverUrl: row.cover_url ?? undefined,
    caption: row.caption,
    hashtags: row.hashtags ?? '',
  });

  if (res.ok) {
    await supa.from('ig_queue').update({
      status: 'posted', posted_at: new Date().toISOString(), ig_post_id: res.ig_post_id,
    }).eq('id', row.id);
    console.log('\n✓ POSTED');
    console.log('  ig_post_id:', res.ig_post_id);
  } else {
    await supa.from('ig_queue').update({
      status: (row.attempts ?? 0) >= 2 ? 'error' : 'ready', last_error: res.error,
    }).eq('id', row.id);
    console.log('\n✗ FAILED:', res.error);
    process.exit(1);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
