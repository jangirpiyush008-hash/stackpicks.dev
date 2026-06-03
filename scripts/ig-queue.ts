/**
 * CLI — add a video/image to the Instagram auto-posting queue.
 *
 *   pnpm ig-queue path/to/video.mp4 --topic "what is stackpicks" --type reel
 *   pnpm ig-queue slide1.png slide2.png slide3.png --topic "22 apps" --type carousel
 *
 * Flags:
 *   --topic    short topic key (used by caption generator)
 *   --type     reel | video | image | carousel  (default: reel)
 *   --at       ISO timestamp to schedule (default: next open slot)
 *   --cta      override CTA in caption (default: "stackpicks.dev (link in bio)")
 *   --cover    cover image path (Reels only, optional)
 *
 * What it does:
 *   1. Uploads each file to the `ig-queue` Supabase Storage bucket
 *   2. Generates caption + hashtags via core/instagram/captions
 *   3. Picks next open scheduled_at slot (or honors --at)
 *   4. Inserts row in ig_queue table — cron picks it up at scheduled_at
 */

import { readFileSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { generateCaption } from '../core/instagram/captions';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env');
  process.exit(1);
}
const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

interface Args {
  files: string[];
  topic: string;
  type: 'reel' | 'video' | 'image' | 'carousel';
  at?: string;
  cta?: string;
  cover?: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const files: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      flags[a.slice(2)] = argv[++i];
    } else {
      files.push(a);
    }
  }
  if (!files.length) {
    console.error('Usage: pnpm ig-queue <file…> --topic "…" --type reel|video|image|carousel [--at ISO] [--cta …] [--cover path]');
    process.exit(1);
  }
  return {
    files,
    topic: flags.topic || files[0].split('/').pop()!.replace(/\.[^.]+$/, ''),
    type: (flags.type as Args['type']) || 'reel',
    at: flags.at,
    cta: flags.cta,
    cover: flags.cover,
  };
}

function mimeFor(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.mov') return 'video/quicktime';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  throw new Error(`Unsupported file extension: ${ext}`);
}

async function uploadOne(localPath: string): Promise<string> {
  const data = readFileSync(localPath);
  const stamp = Date.now();
  const key = `${stamp}-${basename(localPath).replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const { error } = await supa.storage.from('ig-queue').upload(key, data, {
    contentType: mimeFor(localPath),
    upsert: false,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`Upload failed for ${localPath}: ${error.message}`);
  const { data: pub } = supa.storage.from('ig-queue').getPublicUrl(key);
  return pub.publicUrl;
}

/**
 * Pick the next open slot. Two slots per day:
 *  - 09:30 IST (carousels / images)
 *  - 20:00 IST (reels / videos)
 * Scans existing scheduled rows and returns the first slot in the next 14
 * days that isn't taken.
 */
async function nextOpenSlot(postType: Args['type']): Promise<Date> {
  const { data: scheduled } = await supa
    .from('ig_queue')
    .select('scheduled_at')
    .in('status', ['ready', 'processing'])
    .order('scheduled_at', { ascending: true });
  const taken = new Set((scheduled ?? []).map((r) => new Date(r.scheduled_at).getTime()));

  // IST is UTC+5:30
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const reelSlot = postType === 'reel' || postType === 'video' ? 20 : 9.5; // hour (decimal for 9:30)
  const now = new Date();
  for (let day = 0; day < 14; day++) {
    const istNow = new Date(now.getTime() + IST_OFFSET);
    const target = new Date(Date.UTC(
      istNow.getUTCFullYear(),
      istNow.getUTCMonth(),
      istNow.getUTCDate() + day,
      Math.floor(reelSlot),
      (reelSlot % 1) * 60,
      0
    ) - IST_OFFSET);
    if (target.getTime() < now.getTime() + 5 * 60 * 1000) continue; // skip past
    if (!taken.has(target.getTime())) return target;
  }
  throw new Error('No open slot in next 14 days — clear some queue first');
}

async function main() {
  const args = parseArgs();
  console.log(`Queueing ${args.files.length} file(s) as ${args.type} · topic: "${args.topic}"`);

  console.log('Uploading to Supabase Storage…');
  const mediaUrls: string[] = [];
  for (const f of args.files) {
    const size = statSync(f).size;
    if (size > 100 * 1024 * 1024) throw new Error(`${f}: ${(size / 1e6).toFixed(1)}MB exceeds IG 100MB limit`);
    const url = await uploadOne(f);
    console.log(`  ✓ ${basename(f)} → ${url}`);
    mediaUrls.push(url);
  }

  const coverUrl = args.cover ? await uploadOne(args.cover) : undefined;
  if (coverUrl) console.log(`  ✓ cover → ${coverUrl}`);

  const scheduledAt = args.at ? new Date(args.at) : await nextOpenSlot(args.type);
  const { caption, hashtags } = generateCaption({
    topic: args.topic,
    postType: args.type,
    cta: args.cta,
  });

  const { data, error } = await supa.from('ig_queue').insert({
    post_type: args.type,
    topic: args.topic,
    media_urls: mediaUrls,
    cover_url: coverUrl,
    caption,
    hashtags,
    scheduled_at: scheduledAt.toISOString(),
    status: 'ready',
  }).select('id').single();
  if (error) throw new Error(`DB insert failed: ${error.message}`);

  console.log('\n✓ Queued');
  console.log(`  id:         ${data.id}`);
  console.log(`  scheduled:  ${scheduledAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`  caption:    ${caption.split('\n')[0]}…`);
  console.log(`  hashtags:   ${hashtags.split(' ').slice(0, 5).map((t) => '#' + t).join(' ')}…`);
  console.log('\nManage at: /admin/instagram');
}

main().catch((e) => { console.error(e); process.exit(1); });
