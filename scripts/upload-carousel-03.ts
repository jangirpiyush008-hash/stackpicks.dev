/**
 * One-off: upload carousel #03 slides → ig-queue bucket, then flip
 * the existing 'mcp 2.0 spec drop' draft row to status='ready' with
 * the new media_urls and an updated caption/hashtags.
 *
 * Run:  npx tsx scripts/upload-carousel-03.ts
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { generateCaption } from '../core/instagram/captions';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing env vars'); process.exit(1);
}
const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

const SLIDE_DIR = 'apps/instagram/carousels/03-mcp-spec-2026-rc-slides';
const TOPIC = 'mcp 2.0 spec drop'; // matches existing draft row
const NEW_TOPIC = 'mcp 2026-07-28 spec drop';

async function uploadOne(localPath: string): Promise<string> {
  const data = readFileSync(localPath);
  const stamp = Date.now();
  const key = `${stamp}-${basename(localPath).replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const { error } = await supa.storage.from('ig-queue').upload(key, data, {
    contentType: 'image/png',
    upsert: false,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`Upload failed for ${localPath}: ${error.message}`);
  const { data: pub } = supa.storage.from('ig-queue').getPublicUrl(key);
  return pub.publicUrl;
}

async function main() {
  console.log('Uploading 7 slides to Supabase Storage…');
  const slidePaths = Array.from({ length: 7 }, (_, i) =>
    `${SLIDE_DIR}/slide_${String(i + 1).padStart(2, '0')}.png`,
  );
  const mediaUrls: string[] = [];
  for (const p of slidePaths) {
    const url = await uploadOne(p);
    console.log(`  ✓ ${basename(p)}`);
    mediaUrls.push(url);
    // tiny stagger so timestamps are unique
    await new Promise((r) => setTimeout(r, 20));
  }

  const { caption, hashtags } = generateCaption({
    topic: NEW_TOPIC,
    postType: 'carousel',
  });

  // Find the existing draft row
  const { data: existing, error: findErr } = await supa
    .from('ig_queue')
    .select('id, scheduled_at')
    .eq('topic', TOPIC)
    .eq('status', 'draft')
    .single();
  if (findErr || !existing) {
    throw new Error(`Couldn't find draft row for topic '${TOPIC}': ${findErr?.message}`);
  }

  const { error: updErr } = await supa
    .from('ig_queue')
    .update({
      topic: NEW_TOPIC,
      media_urls: mediaUrls,
      caption,
      hashtags,
      status: 'ready',
    })
    .eq('id', existing.id);
  if (updErr) throw new Error(`Update failed: ${updErr.message}`);

  console.log('\n✓ Queued for publish');
  console.log(`  id:        ${existing.id}`);
  console.log(`  topic:     ${NEW_TOPIC}`);
  console.log(`  scheduled: ${new Date(existing.scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`  slides:    ${mediaUrls.length}`);
  console.log(`  caption:   ${caption.split('\n')[0]}…`);
  console.log('\nManage at: /admin/instagram');
}

main().catch((e) => { console.error(e); process.exit(1); });
