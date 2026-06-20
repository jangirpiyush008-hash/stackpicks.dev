/**
 * One-off: delete the existing teaser ig_queue row, re-upload the freshly
 * rendered PNGs (slide 3 was edited — "save · the · date" instead of a day
 * count), insert a new row scheduled for tonight so it ships ASAP instead of
 * sitting until Tue 23 Jun.
 *
 *   pnpm tsx scripts/reschedule-teaser.ts
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const OLD_ID = '6dc20f6c-bd21-4f59-87ca-d15b02a248b4';
const TOPIC = 'teaser-01-07';
const CAPTION = "we made something. you're going to want this. 01·07·2026. 🟢";
// Next cron tick after 15 min — close enough to "tonight" without colliding
// with the 5-min future guard in nextOpenSlot.
const NEW_SCHEDULED_AT = new Date(Date.now() + 15 * 60 * 1000).toISOString();
const SLIDES = [
  'apps/instagram/carousels/14-teaser-slides/01.png',
  'apps/instagram/carousels/14-teaser-slides/02.png',
  'apps/instagram/carousels/14-teaser-slides/03.png',
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing supabase env');
  process.exit(1);
}
const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

async function uploadOne(localPath: string): Promise<string> {
  const data = readFileSync(localPath);
  const stamp = Date.now() + Math.floor(Math.random() * 1000);
  const key = `${stamp}-${basename(localPath)}`;
  const { error } = await supa.storage.from('ig-queue').upload(key, data, {
    contentType: 'image/png',
    upsert: false,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supa.storage.from('ig-queue').getPublicUrl(key).data.publicUrl;
}

async function main() {
  console.log(`Deleting old queue row ${OLD_ID}…`);
  const { error: delErr } = await supa.from('ig_queue').delete().eq('id', OLD_ID);
  if (delErr) console.warn(`(non-fatal) delete: ${delErr.message}`);

  console.log('Re-uploading 3 fresh PNGs…');
  const urls: string[] = [];
  for (const f of SLIDES) {
    const u = await uploadOne(f);
    console.log(`  ✓ ${basename(f)} → ${u}`);
    urls.push(u);
  }

  console.log(`Inserting new row, scheduled ${NEW_SCHEDULED_AT}…`);
  const { data, error } = await supa.from('ig_queue').insert({
    post_type: 'carousel',
    topic: TOPIC,
    media_urls: urls,
    caption: CAPTION,
    hashtags: '',
    scheduled_at: NEW_SCHEDULED_AT,
    status: 'ready',
  }).select('id').single();
  if (error) throw new Error(`Insert failed: ${error.message}`);

  console.log('\n✓ Re-queued');
  console.log(`  id:         ${data.id}`);
  console.log(`  scheduled:  ${new Date(NEW_SCHEDULED_AT).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`  caption:    ${CAPTION}`);
  console.log('\nNext cron run will pick it up.');
}

main().catch((e) => { console.error(e); process.exit(1); });
