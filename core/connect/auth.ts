// API key verification for the StackPicks MCP gateway.
//
// Flow:
//   1. MCP client sends `Authorization: Bearer sp_live_<random>`
//   2. We sha-256 the key, look up in stackpicks_api_keys table
//   3. If found + not revoked, return { userId, apiKeyId }
//   4. Async update last_used_at — don't block the request
//
// We never compare raw keys. The DB only stores hashes.

import { createHash } from 'crypto';
import { adminClient } from '../db';

export interface ApiKeyContext {
  userId: string;
  apiKeyId: string;
}

export async function verifyApiKey(rawKey: string): Promise<ApiKeyContext | null> {
  if (!rawKey.startsWith('sp_live_')) return null;
  const hash = createHash('sha256').update(rawKey).digest('hex');

  const admin = adminClient();
  const { data, error } = await admin
    .from('stackpicks_api_keys')
    .select('id, user_id, revoked_at')
    .eq('key_hash', hash)
    .maybeSingle();

  if (error || !data || data.revoked_at) return null;

  // Fire-and-forget — don't await. Worst case last_used_at is a few seconds stale.
  admin
    .from('stackpicks_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then(() => undefined, () => undefined);

  return { userId: data.user_id as string, apiKeyId: data.id as string };
}

/** Parses `Authorization: Bearer …` from a Headers object. */
export function bearerFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization') ?? req.headers.get('Authorization');
  if (!auth) return null;
  const m = /^Bearer\s+(.+)$/i.exec(auth.trim());
  return m ? m[1] : null;
}
