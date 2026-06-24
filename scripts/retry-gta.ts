import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const caption = readFileSync('/tmp/gta-caption.txt', 'utf8').trimEnd();
  const at = new Date(Date.now() - 60 * 1000).toISOString();
  const { error } = await supa
    .from('ig_queue')
    .update({
      caption,
      hashtags: '',
      scheduled_at: at,
      status: 'ready',
      attempts: 0,
      last_error: null,
    })
    .eq('id', '789d8c6b-c21c-473d-b6ab-7f42849b085a');
  if (error) { console.error('fail:', error.message); process.exit(1); }
  console.log('✓ caption trimmed to 28 hashtags, status reset, scheduled', at);
  console.log('  caption length:', caption.length, 'chars');
}
main().catch((e) => { console.error(e); process.exit(1); });
