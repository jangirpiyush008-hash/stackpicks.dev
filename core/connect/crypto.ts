// AES-256-GCM symmetric encryption for stored API keys (api_key_connections).
// The key derives from CONNECT_ENC_KEY (any sufficiently random env string) via
// sha-256 → 32 bytes. Format: base64(iv).base64(authTag).base64(ciphertext).
//
// This protects keys at rest in our DB. Only the server (service role) can
// decrypt; the raw key is never returned to the client.

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

function key(): Buffer {
  const raw = process.env.CONNECT_ENC_KEY;
  if (!raw || raw.trim().length < 16) {
    throw new Error('CONNECT_ENC_KEY is missing or too short (set a 32+ char random string).');
  }
  return createHash('sha256').update(raw.trim()).digest(); // 32 bytes
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64'), tag.toString('base64'), ct.toString('base64')].join('.');
}

export function decryptSecret(blob: string): string {
  const [ivB, tagB, ctB] = blob.split('.');
  if (!ivB || !tagB || !ctB) throw new Error('Malformed ciphertext.');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivB, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(ctB, 'base64')), decipher.final()]).toString('utf8');
}

/** Last 4 chars for non-secret display ("…a1b2"). */
export function last4(s: string): string {
  return s.length <= 4 ? s : s.slice(-4);
}
