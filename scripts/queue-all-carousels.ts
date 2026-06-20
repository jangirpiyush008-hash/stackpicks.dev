/**
 * Batch: for every v2 config in apps/instagram/carousels/configs/, build the
 * HTML, render the 8 PNGs, upload them to Supabase, and insert an ig_queue
 * row scheduled at the given timestamp.
 *
 *   pnpm tsx --env-file=apps/web/.env.local scripts/queue-all-carousels.ts
 *
 * Edit SCHEDULE below to change dates.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { execSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { buildHtml, type V2Config } from '../apps/instagram/v2-carousel';

// slug → { at: ISO UTC, caption, keyword }
const SCHEDULE: Record<string, { at: string; caption: string; keyword: string }> = {
  '15-claude-skills': {
    at: '2026-06-21T04:00:00.000Z', // Sun 21 Jun 09:30 IST
    caption: "Claude Skills turn one good prompt into a real, reusable agent — folder in, agent out. Comment SKILLS for the full breakdown. 🟢",
    keyword: 'SKILLS',
  },
  '16-gpt5-codex-cloud': {
    at: '2026-06-23T04:00:00.000Z', // Tue 23 Jun 09:30 IST
    caption: "GPT-5 Pro + Codex Cloud = delegate coding work, close laptop, come back to PRs. Comment GPT5 for pricing + honest take. 🟢",
    keyword: 'GPT5',
  },
  '17-higgsfield-sora': {
    at: '2026-06-25T04:00:00.000Z', // Thu 25 Jun 09:30 IST
    caption: "Sora 2 prompts that don't suck — start in Higgsfield, finish in Sora. Comment SORA for the full prompt formula. 🟢",
    keyword: 'SORA',
  },
  '18-motion-primitives': {
    at: '2026-06-27T04:00:00.000Z', // Sat 27 Jun 09:30 IST
    caption: "Two new component libs that make shadcn feel static — Motion-Primitives + Eldora UI. Comment MOTION for the curated list. 🟢",
    keyword: 'MOTION',
  },
  '19-v0-vs-lovable': {
    at: '2026-06-29T04:00:00.000Z', // Mon 29 Jun 09:30 IST
    caption: "v0 = Vercel polish. Lovable = full-stack speed. We tested both. Comment BUILDERS for the head-to-head. 🟢",
    keyword: 'BUILDERS',
  },
  '25-prelaunch-teaser': {
    at: '2026-06-30T04:00:00.000Z', // Tue 30 Jun 09:30 IST
    caption: "tomorrow. 🟢",
    keyword: '',
  },
  'launch-autodm': {
    at: '2026-07-01T04:00:00.000Z', // Wed 01 Jul 09:30 IST — LAUNCH
    caption: "we made StackPicks AutoDM. your IG comments → real DMs, on autopilot. 60-second setup. starts ₹499 / $15. comment AUTODM. 🟢",
    keyword: 'AUTODM',
  },
  '20-cursor-windsurf-claude': {
    at: '2026-07-03T04:00:00.000Z', // Fri 03 Jul 09:30 IST
    caption: "Cursor 2 vs Windsurf vs Claude Code — three AI IDEs, three personalities. Comment IDE for the side-by-side benchmark. 🟢",
    keyword: 'IDE',
  },
  '21-tailwind-shadcn': {
    at: '2026-07-05T04:00:00.000Z', // Sun 05 Jul 09:30 IST
    caption: "Tailwind v4 + shadcn registry just made design systems shippable in 5 lines. Comment SHADCN for the curated UI list. 🟢",
    keyword: 'SHADCN',
  },
  '22-three-r3f': {
    at: '2026-07-07T04:00:00.000Z', // Tue 07 Jul 09:30 IST
    caption: "Three.js Shading Language + R3F + postprocessing v7 = the new 3D web stack. Comment THREE for every curated 3D lib. 🟢",
    keyword: 'THREE',
  },
  '23-notion-claude-chatgpt': {
    at: '2026-07-09T04:00:00.000Z', // Thu 09 Jul 09:30 IST
    caption: "Notion AI 3 · Claude Connectors · ChatGPT Apps — three surfaces, same idea. Comment MCP for the 50+ MCP server directory. 🟢",
    keyword: 'MCP',
  },
};

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
  const configsDir = resolve('apps/instagram/carousels/configs');
  const carouselsDir = resolve('apps/instagram/carousels');

  // Check what's already queued so we don't double-queue on re-run
  const { data: existing } = await supa
    .from('ig_queue')
    .select('topic, scheduled_at, status')
    .in('status', ['ready', 'processing', 'posted']);
  const takenTopics = new Set((existing ?? []).map((r) => r.topic));

  const slugs = Object.keys(SCHEDULE);
  console.log(`Processing ${slugs.length} carousels…\n`);

  for (const slug of slugs) {
    const cfgPath = join(configsDir, `${slug}.json`);
    if (!existsSync(cfgPath)) {
      console.log(`  ⊘ ${slug}: config missing — skipping`);
      continue;
    }
    if (takenTopics.has(slug)) {
      console.log(`  ⊘ ${slug}: already in queue — skipping`);
      continue;
    }

    const cfg: V2Config = JSON.parse(readFileSync(cfgPath, 'utf-8'));

    // 1) build HTML
    const htmlPath = join(carouselsDir, `${cfg.slug}.html`);
    writeFileSync(htmlPath, buildHtml(cfg));

    // 2) render PNGs
    execSync(`npx tsx scripts/render-carousel.ts "${htmlPath}"`, { stdio: 'pipe' });

    // 3) upload PNGs
    const slidesDir = join(carouselsDir, `${cfg.slug}-slides`);
    const total = cfg.cards.length + 3; // hook + cards + take + cta
    const urls: string[] = [];
    for (let i = 1; i <= total; i++) {
      const num = String(i).padStart(2, '0');
      const url = await uploadOne(join(slidesDir, `${num}.png`));
      urls.push(url);
    }

    // 4) insert queue row
    const sched = SCHEDULE[slug];
    const { error } = await supa.from('ig_queue').insert({
      post_type: 'carousel',
      topic: slug,
      media_urls: urls,
      caption: sched.caption,
      hashtags: '',
      scheduled_at: sched.at,
      status: 'ready',
    });
    if (error) {
      console.log(`  ✗ ${slug}: insert failed — ${error.message}`);
      continue;
    }

    console.log(`  ✓ ${slug} → ${new Date(sched.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST (${total} slides)`);
  }

  console.log('\nDone. View at /admin/instagram');
}

main().catch((e) => { console.error(e); process.exit(1); });
