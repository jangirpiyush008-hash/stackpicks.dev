/**
 * Upload Motion carousel slides → ig-queue bucket, flip the Mon Jun 8
 * draft row to status='ready' with the new media_urls.
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { generateCaption } from '../core/instagram/captions';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing env'); process.exit(1); }
const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

const SLIDE_DIR = 'apps/instagram/carousels/04-motion-animations-slides';
const TARGET_TOPIC = 'motion library for web animations';

async function uploadOne(localPath: string): Promise<string> {
  const data = readFileSync(localPath);
  const key = `${Date.now()}-${basename(localPath).replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const { error } = await supa.storage.from('ig-queue').upload(key, data, {
    contentType: 'image/png', upsert: false, cacheControl: '31536000',
  });
  if (error) throw new Error(`Upload failed for ${localPath}: ${error.message}`);
  return supa.storage.from('ig-queue').getPublicUrl(key).data.publicUrl;
}

async function main() {
  const mediaUrls: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const p = `${SLIDE_DIR}/slide_${String(i).padStart(2, '0')}.png`;
    const url = await uploadOne(p);
    console.log(`  ✓ slide_${String(i).padStart(2, '0')}.png`);
    mediaUrls.push(url);
    await new Promise((r) => setTimeout(r, 30));
  }

  const { caption, hashtags } = generateCaption({
    topic: 'Motion — production-grade React animation', postType: 'carousel',
  });

  const { data: existing, error: findErr } = await supa
    .from('ig_queue').select('id, scheduled_at')
    .eq('topic', TARGET_TOPIC).eq('status', 'draft').single();
  if (findErr || !existing) throw new Error(`No draft row for '${TARGET_TOPIC}': ${findErr?.message}`);

  const { error } = await supa.from('ig_queue').update({
    media_urls: mediaUrls, caption, hashtags, status: 'ready',
  }).eq('id', existing.id);
  if (error) throw new Error(`Update failed: ${error.message}`);

  console.log(`\n✓ Queued. id=${existing.id} · ${new Date(existing.scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`  slide1: ${mediaUrls[0]}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
