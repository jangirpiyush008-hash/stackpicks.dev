import { createClient } from '@supabase/supabase-js';

async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  // Move scheduled_at to 1 min in the past so the next cron tick at
  // /api/cron/ig-publish picks it up immediately.
  const at = new Date(Date.now() - 60 * 1000).toISOString();
  const { error } = await supa
    .from('ig_queue')
    .update({ scheduled_at: at, status: 'ready', attempts: 0, last_error: null })
    .eq('id', '789d8c6b-c21c-473d-b6ab-7f42849b085a');
  console.log(error ? 'fail: ' + error.message : '✓ moved to ' + at + ' — next cron ping will publish');
}
main().catch((e) => { console.error(e); process.exit(1); });
