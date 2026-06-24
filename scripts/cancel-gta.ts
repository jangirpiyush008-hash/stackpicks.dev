import { createClient } from '@supabase/supabase-js';
async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  // 'cancelled' isn't a valid status — use 'error' with maxed attempts so
  // the cron picker never retries. The cron only selects rows with
  // status='ready', so anything else is safe.
  const { error } = await supa.from('ig_queue').update({
    status: 'error',
    attempts: 99,
    last_error: 'cancelled by admin — posting manually from IG app',
  }).eq('id', '789d8c6b-c21c-473d-b6ab-7f42849b085a');
  console.log(error ? 'fail: ' + error.message : '✓ queue row cancelled — will not auto-publish');
}
main().catch((e) => { console.error(e); process.exit(1); });
