import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

async function main() {
  const c = readFileSync('/tmp/gta-caption.txt', 'utf8');
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await supa
    .from('ig_queue')
    .update({ caption: c, hashtags: '' })
    .eq('id', '789d8c6b-c21c-473d-b6ab-7f42849b085a');
  console.log(error ? 'fail: ' + error.message : '✓ caption fixed. length: ' + c.length);
}
main().catch((e) => { console.error(e); process.exit(1); });
