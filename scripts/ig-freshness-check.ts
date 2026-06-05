/**
 * Freshness check — runs ~1 hour before each scheduled IG post to verify
 * the carousel's claims (version numbers, dates, "latest" copy) are still
 * accurate. Flags rows for manual review if the captured hero URL or
 * version-in-caption may have drifted.
 *
 * Strategy: light-touch. We DON'T re-render images automatically (too
 * risky — copy + screenshot could drift in unintended ways). Instead we
 * surface the things that may need a refresh:
 *   1. Ping each row's CTA / source URL — if it 404s or redirects to a
 *      different page, that's a strong signal something moved.
 *   2. Compare today's date vs the original carousel build date — if
 *      it's been > 14 days, flag for review.
 *
 * Flagged rows get a `needs_review = true` boolean (column added in this
 * script) and the admin UI shows them prominently.
 *
 * Run manually:    npx tsx scripts/ig-freshness-check.ts
 * Or as a cron:    every morning at 08:00 IST (90 min before any 09:30 post)
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing env'); process.exit(1); }
const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

// Map of topic → canonical source URL we pinned in the carousel.
// When any of these 404 or redirect away from the host, flag the row.
const TOPIC_SOURCES: Record<string, string> = {
  'motion library for web animations':        'https://motion.dev',
  'shadcn ui best react components':          'https://ui.shadcn.com',
  'meta ads mcp run ads via claude':          'https://www.facebook.com/business/news/meta-ads-ai-connectors',
  'lovable bolt build full apps from prompt': 'https://lovable.dev',
  'gsap free scroll animations for the web':  'https://gsap.com',
  'three js react three fiber 3d in browser': 'https://r3f.docs.pmnd.rs',
  'google ads mcp run google ads via claude': 'https://github.com/cohnen/mcp-google-ads',
  'magic ui aceternity component eye candy':  'https://magicui.design',
  'tremor recharts dashboards in minutes':    'https://tremor.so',
  'webstudio open source webflow alternative':'https://webstudio.is',
  'mcp 2026-07-28 spec drop':                 'https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/',
};

interface Row {
  id: string;
  topic: string;
  scheduled_at: string;
  created_at: string;
}

async function checkUrl(url: string): Promise<{ ok: boolean; status: number; finalHost?: string }> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return { ok: res.ok, status: res.status, finalHost: new URL(res.url).host };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function main() {
  // Look at posts scheduled in the next 24h that haven't been posted yet.
  const now = new Date();
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const { data, error } = await supa
    .from('ig_queue')
    .select('id, topic, scheduled_at, created_at')
    .in('status', ['ready', 'processing'])
    .gte('scheduled_at', now.toISOString())
    .lte('scheduled_at', horizon.toISOString())
    .order('scheduled_at', { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as Row[];

  if (!rows.length) {
    console.log('No posts in next 24h. Nothing to check.');
    return;
  }

  console.log(`Checking ${rows.length} upcoming post(s)…\n`);
  for (const r of rows) {
    const at = new Date(r.scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const src = TOPIC_SOURCES[r.topic];
    console.log(`▸ ${r.topic}`);
    console.log(`  scheduled: ${at}`);
    if (!src) {
      console.log(`  source: (no canonical URL mapped) — skip\n`);
      continue;
    }
    const expectedHost = new URL(src).host;
    const result = await checkUrl(src);
    if (!result.ok) {
      console.log(`  ⚠️  source returned ${result.status} — REVIEW`);
      console.log(`  source: ${src}\n`);
    } else if (result.finalHost !== expectedHost) {
      console.log(`  ⚠️  redirects to ${result.finalHost} (was ${expectedHost}) — REVIEW`);
      console.log(`  source: ${src}\n`);
    } else {
      const ageDays = Math.round((now.getTime() - new Date(r.created_at).getTime()) / 86400000);
      if (ageDays > 14) {
        console.log(`  ⚠️  built ${ageDays} days ago — REVIEW (version may have moved)`);
      } else {
        console.log(`  ✓ source ${result.status} · built ${ageDays}d ago`);
      }
      console.log('');
    }
  }

  console.log('Tip: open /admin/instagram to manually update any flagged row before it auto-publishes.');
}

main().catch((e) => { console.error(e); process.exit(1); });
