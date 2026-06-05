// Tenant token encryption — IG user tokens at rest.
// AES-256-GCM with a key from AUTODM_ENC_KEY env (base64, 32 bytes).
// Same approach as core/connect/encrypt.ts so we stay consistent.

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function key(): Buffer {
  const k = process.env.AUTODM_ENC_KEY;
  if (!k) throw new Error('AUTODM_ENC_KEY env not set');
  const buf = Buffer.from(k, 'base64');
  if (buf.length !== 32) throw new Error('AUTODM_ENC_KEY must decode to 32 bytes');
  return buf;
}

/** Encrypt a token. Returns base64(iv || authTag || ciphertext). */
export function encryptToken(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptToken(encrypted: string): string {
  const buf = Buffer.from(encrypted, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}
