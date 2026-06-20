/**
 * One-off: 11 carousels were queued with only 7 slides because the batch
 * script under-counted by 1. The 8th slide (CTA) exists on disk and in the
 * rendered HTML — just never uploaded. This appends the missing 08.png to
 * each existing ig_queue row.
 */
import { readFileSync, existsSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SLUGS = [
  '15-claude-skills',
  '16-gpt5-codex-cloud',
  '17-higgsfield-sora',
  '18-motion-primitives',
  '19-v0-vs-lovable',
  '25-prelaunch-teaser',
  'launch-autodm',
  '20-cursor-windsurf-claude',
  '21-tailwind-shadcn',
  '22-three-r3f',
  '23-notion-claude-chatgpt',
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supa = createClient(SUPABASE_URL!, SERVICE_ROLE!);

async function upload(localPath: string): Promise<string> {
  const data = readFileSync(localPath);
  const stamp = Date.now() + Math.floor(Math.random() * 1000);
  const key = `${stamp}-${basename(localPath)}`;
  const { error } = await supa.storage.from('ig-queue').upload(key, data, {
    contentType: 'image/png', upsert: false, cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);
  return supa.storage.from('ig-queue').getPublicUrl(key).data.publicUrl;
}

async function main() {
  for (const slug of SLUGS) {
    const slidesDir = resolve('apps/instagram/carousels', `${slug}-slides`);
    const ctaPath = join(slidesDir, '08.png');
    if (!existsSync(ctaPath)) { console.log(`  ⊘ ${slug}: 08.png missing`); continue; }

    const { data: row } = await supa
      .from('ig_queue')
      .select('id, media_urls')
      .eq('topic', slug)
      .eq('status', 'ready')
      .single();
    if (!row) { console.log(`  ⊘ ${slug}: no queue row`); continue; }
    const urls: string[] = row.media_urls as string[];
    if (urls.length >= 8) { console.log(`  ⊘ ${slug}: already has 8 slides`); continue; }

    const ctaUrl = await upload(ctaPath);
    const newUrls = [...urls, ctaUrl];
    const { error } = await supa
      .from('ig_queue')
      .update({ media_urls: newUrls })
      .eq('id', row.id);
    if (error) { console.log(`  ✗ ${slug}: ${error.message}`); continue; }
    console.log(`  ✓ ${slug}: appended 08.png (${newUrls.length} slides total)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
