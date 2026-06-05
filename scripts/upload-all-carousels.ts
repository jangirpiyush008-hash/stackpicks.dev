/**
 * Bulk upload + flip all 9 remaining draft carousels to status='ready'.
 *
 * Maps slide directory → matching ig_queue draft topic. Renders captions
 * via core/instagram/captions, sets media_urls, status='ready'.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { generateCaption } from '../core/instagram/captions';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing env'); process.exit(1); }
const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

// Slide dir → ig_queue topic mapping
const JOBS: { slug: string; topic: string; displayTopic: string }[] = [
  { slug: '05-shadcn-ui',         topic: 'shadcn ui best react components',           displayTopic: 'shadcn/ui — copy-paste React components' },
  { slug: '06-meta-ads-mcp',      topic: 'meta ads mcp run ads via claude',           displayTopic: 'Meta Ads MCP — run ads from Claude' },
  { slug: '07-lovable-bolt',      topic: 'lovable bolt build full apps from prompt',  displayTopic: 'Lovable + Bolt — full apps from a prompt' },
  { slug: '08-gsap',              topic: 'gsap free scroll animations for the web',   displayTopic: 'GSAP — now 100% free' },
  { slug: '09-three-r3f',         topic: 'three js react three fiber 3d in browser',  displayTopic: 'Three.js + R3F — 3D in your React app' },
  { slug: '10-google-ads-mcp',    topic: 'google ads mcp run google ads via claude',  displayTopic: 'Google Ads MCP — Google ads via Claude' },
  { slug: '11-magic-aceternity',  topic: 'magic ui aceternity component eye candy',   displayTopic: 'Magic UI + Aceternity — eye-candy components' },
  { slug: '12-tremor-recharts',   topic: 'tremor recharts dashboards in minutes',     displayTopic: 'Tremor + Recharts — dashboards in minutes' },
  { slug: '13-webstudio',         topic: 'webstudio open source webflow alternative', displayTopic: 'Webstudio — open-source Webflow alternative' },
];

async function uploadOne(localPath: string, stamp: number): Promise<string> {
  const data = readFileSync(localPath);
  const key = `${stamp}-${localPath.split('/').pop()!.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const { error } = await supa.storage.from('ig-queue').upload(key, data, {
    contentType: 'image/png', upsert: false, cacheControl: '31536000',
  });
  if (error) throw new Error(`${localPath}: ${error.message}`);
  return supa.storage.from('ig-queue').getPublicUrl(key).data.publicUrl;
}

async function processOne(job: typeof JOBS[0]) {
  const dir = `apps/instagram/carousels/${job.slug}-slides`;
  const urls: string[] = [];
  let stamp = Date.now();
  for (let i = 1; i <= 7; i++) {
    const p = `${dir}/slide_${String(i).padStart(2, '0')}.png`;
    if (!existsSync(p)) throw new Error(`Missing slide: ${p}`);
    urls.push(await uploadOne(p, stamp++));
  }

  const { caption, hashtags } = generateCaption({ topic: job.displayTopic, postType: 'carousel' });

  const { data: existing, error: findErr } = await supa
    .from('ig_queue').select('id, scheduled_at')
    .eq('topic', job.topic).eq('status', 'draft').single();
  if (findErr || !existing) throw new Error(`No draft for '${job.topic}': ${findErr?.message}`);

  const { error: updErr } = await supa.from('ig_queue').update({
    media_urls: urls, caption, hashtags, status: 'ready',
  }).eq('id', existing.id);
  if (updErr) throw new Error(`Update ${job.topic}: ${updErr.message}`);

  return { id: existing.id, at: existing.scheduled_at };
}

async function main() {
  for (const job of JOBS) {
    process.stdout.write(`${job.slug.padEnd(28)} `);
    try {
      const r = await processOne(job);
      console.log(`✓ ${new Date(r.at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric' })}`);
    } catch (e) {
      console.log(`✗ ${(e as Error).message}`);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
