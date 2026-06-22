/**
 * Probe Meta directly for bulkloot_deals' subscription state.
 *   pnpm tsx --env-file=apps/web/.env.local scripts/probe-meta-subs.ts
 */
import { createClient } from '@supabase/supabase-js';
import { decryptToken } from '../core/autodm/crypto';

async function main() {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const TID = 'c0d24257-4e61-4892-8254-b3ab8f97766c';

  const { data: t } = await supa
    .from('autodm_tenants')
    .select('ig_business_id, ig_user_token_encrypted')
    .eq('id', TID)
    .single();
  if (!t?.ig_user_token_encrypted) { console.error('no token'); return; }

  const token = decryptToken(t.ig_user_token_encrypted as string);
  console.log('Token length:', token.length, 'prefix:', token.slice(0, 8) + '…');

  // 1) Who am I per Meta?
  const me = await fetch(`https://graph.instagram.com/v22.0/me?fields=id,username,account_type&access_token=${encodeURIComponent(token)}`).then(r => r.json());
  console.log('\n[/me]:', JSON.stringify(me, null, 2));

  // 2) Current subscriptions
  const subs = await fetch(`https://graph.instagram.com/v22.0/${t.ig_business_id}/subscribed_apps?access_token=${encodeURIComponent(token)}`).then(r => r.json());
  console.log('\n[GET /subscribed_apps]:', JSON.stringify(subs, null, 2));

  // 3) Try to subscribe now
  const sub = await fetch(`https://graph.instagram.com/v22.0/${t.ig_business_id}/subscribed_apps?subscribed_fields=comments,live_comments,messages,mentions&access_token=${encodeURIComponent(token)}`, { method: 'POST' });
  console.log('\n[POST /subscribed_apps] status:', sub.status);
  console.log('body:', await sub.text());
}
main().catch(e => { console.error(e); process.exit(1); });
