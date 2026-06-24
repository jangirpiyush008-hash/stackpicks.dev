import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // 1. Upload the MP4
  const buf = readFileSync('/tmp/gta-reel.mp4');
  const key = `${Date.now()}-gta-vi-launch-reel.mp4`;
  const up = await supa.storage.from('ig-queue').upload(key, buf, {
    contentType: 'video/mp4',
    upsert: false,
    cacheControl: '31536000',
  });
  if (up.error) { console.error('upload failed:', up.error.message); process.exit(1); }
  const mp4Url = supa.storage.from('ig-queue').getPublicUrl(key).data.publicUrl;
  console.log('✓ uploaded reel:', mp4Url);

  // 2. Use the existing first carousel slide as the reel cover
  const slideBuf = readFileSync('apps/instagram/carousels/24-gta-vi-launch-slides/01.png');
  const coverKey = `${Date.now()}-gta-vi-launch-cover.png`;
  const coverUp = await supa.storage.from('ig-queue').upload(coverKey, slideBuf, {
    contentType: 'image/png', upsert: false, cacheControl: '31536000',
  });
  const coverUrl = coverUp.error ? undefined : supa.storage.from('ig-queue').getPublicUrl(coverKey).data.publicUrl;
  if (coverUrl) console.log('✓ uploaded cover:', coverUrl);

  // 3. Read the trimmed caption (already 28 hashtags)
  const caption = readFileSync('/tmp/gta-caption.txt', 'utf8').trimEnd();

  // 4. Update the existing queue row IN PLACE — change post_type from
  //    carousel to reel, swap media_urls to the single MP4 URL,
  //    add cover_url, reset status, fire on next cron tick.
  const at = new Date(Date.now() - 60 * 1000).toISOString();
  const { error } = await supa
    .from('ig_queue')
    .update({
      post_type: 'reel',
      media_urls: [mp4Url],
      cover_url: coverUrl,
      caption,
      hashtags: '',
      scheduled_at: at,
      status: 'ready',
      attempts: 0,
      last_error: null,
      posted_at: null,
      ig_post_id: null,
    })
    .eq('id', '789d8c6b-c21c-473d-b6ab-7f42849b085a');
  if (error) { console.error('update failed:', error.message); process.exit(1); }
  console.log('\n✓ Queue row swapped: carousel → reel');
  console.log('  scheduled:', at);
  console.log('  Now hit cron-job.org → Test run to publish');
}
main().catch((e) => { console.error(e); process.exit(1); });
