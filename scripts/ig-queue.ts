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
  caption?: string;      // override the auto-generated caption
  noHashtags?: boolean;  // skip hashtags entirely (teasers, brand drops)
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const files: string[] = [];
  const flags: Record<string, string> = {};
  const BOOL_FLAGS = new Set(['no-hashtags']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const name = a.slice(2);
      if (BOOL_FLAGS.has(name)) {
        flags[name] = '1';
      } else {
        flags[name] = argv[++i];
      }
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
    caption: flags.caption,
    noHashtags: 'no-hashtags' in flags,
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
 * Pick the next open slot — "Sustainable" cadence (5 posts/week, Mon-Fri).
 *
 *   Mon  09:30 IST  carousel/image
 *   Tue  20:00 IST  reel/video
 *   Wed  09:30 IST  carousel/image
 *   Thu  09:30 IST  carousel/image
 *   Fri  20:00 IST  reel/video
 *   Sat  (skip)
 *   Sun  (skip)
 *
 * If the requested post_type doesn't match the day's slot type, we still
 * fit it in but flip to the alternate slot time (so a reel queued on a
 * "carousel day" goes to 8 PM, and vice-versa).
 */
async function nextOpenSlot(postType: Args['type']): Promise<Date> {
  const { data: scheduled } = await supa
    .from('ig_queue')
    .select('scheduled_at')
    .in('status', ['ready', 'processing'])
    .order('scheduled_at', { ascending: true });
  const taken = new Set((scheduled ?? []).map((r) => new Date(r.scheduled_at).getTime()));

  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const isReelType = postType === 'reel' || postType === 'video';

  // Slot plan, keyed by JS getDay() — 0=Sun, 1=Mon, ..., 6=Sat
  // 'reel'      → 20:00 IST   |   'visual' → 09:30 IST   |   null = no post that day
  const SLOT_PLAN: Record<number, 'reel' | 'visual' | null> = {
    0: null,       // Sun
    1: 'visual',   // Mon — carousel
    2: 'reel',     // Tue — reel
    3: 'visual',   // Wed — image / carousel
    4: 'visual',   // Thu — carousel
    5: 'reel',     // Fri — reel
    6: null,       // Sat
  };

  const wantedSlotKind = isReelType ? 'reel' : 'visual';
  const now = new Date();

  for (let day = 0; day < 21; day++) {
    const candidate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
    const istDate = new Date(candidate.getTime() + IST_OFFSET);
    const dow = istDate.getUTCDay();
    const plan = SLOT_PLAN[dow];
    if (plan === null) continue; // weekend — skip

    // If today's planned kind matches what we want, use the matching time.
    // Otherwise we still post (queue doesn't have to align perfectly), but
    // we use the alternate slot time so day-of-week intent stays clean.
    const slotHourDecimal = plan === wantedSlotKind
      ? (plan === 'reel' ? 20 : 9.5)
      : (wantedSlotKind === 'reel' ? 20 : 9.5);

    const target = new Date(Date.UTC(
      istDate.getUTCFullYear(),
      istDate.getUTCMonth(),
      istDate.getUTCDate(),
      Math.floor(slotHourDecimal),
      (slotHourDecimal % 1) * 60,
      0
    ) - IST_OFFSET);

    if (target.getTime() < now.getTime() + 5 * 60 * 1000) continue;
    if (!taken.has(target.getTime())) return target;
  }
  throw new Error('No open slot in next 21 days — clear some queue first');
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
  // Caption / hashtags resolution:
  //   --caption "..."   → use as-is (teasers, brand drops, custom moments)
  //   --no-hashtags     → leave hashtags empty (algorithm-neutral, less spammy)
  //   default           → auto-generate from topic + type via core/instagram/captions
  let caption: string;
  let hashtags: string;
  if (args.caption) {
    caption = args.caption;
    hashtags = args.noHashtags ? '' : generateCaption({ topic: args.topic, postType: args.type, cta: args.cta }).hashtags;
  } else {
    const gen = generateCaption({ topic: args.topic, postType: args.type, cta: args.cta });
    caption = gen.caption;
    hashtags = args.noHashtags ? '' : gen.hashtags;
  }

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
