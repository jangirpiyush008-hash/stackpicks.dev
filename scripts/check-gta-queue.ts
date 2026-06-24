import { createClient } from '@supabase/supabase-js';

async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await supa
    .from('ig_queue')
    .select('id, topic, status, scheduled_at, posted_at, attempts, last_error, ig_post_id, media_urls')
    .eq('id', '789d8c6b-c21c-473d-b6ab-7f42849b085a')
    .single();
  console.log(JSON.stringify({
    ...data,
    media_count: data?.media_urls?.length,
    media_urls: undefined,
  }, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
