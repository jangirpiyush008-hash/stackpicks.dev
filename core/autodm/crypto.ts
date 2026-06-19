// Tenant token encryption — IG user tokens at rest.
// AES-256-GCM. Supports multiple key versions so we can rotate without
// downtime: encrypts with the newest key (v1 unless AUTODM_ENC_KEY_V2 is
// set, then v2), decrypts with whichever key the ciphertext is tagged with.
//
// Wire format (base64-encoded):
//   v1 (legacy, current rows): iv(12) || tag(16) || ciphertext
//   v2+:                       0xFF || version(1) || iv(12) || tag(16) || ct
//
// 0xFF as the first byte is unambiguous because base64-decoded IV first
// bytes from the legacy format are uniform random — the chance of collision
// with the marker is 1/256, and even then we fall back to legacy decode if
// the version byte doesn't match a known key.

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const VERSION_MARKER = 0xff;

function loadKey(envName: string): Buffer | null {
  const k = process.env[envName];
  if (!k) return null;
  const buf = Buffer.from(k, 'base64');
  if (buf.length !== 32) throw new Error(`${envName} must decode to 32 bytes`);
  return buf;
}

interface KeySlot { version: number; key: Buffer }

function activeKey(): KeySlot {
  const v2 = loadKey('AUTODM_ENC_KEY_V2');
  if (v2) return { version: 2, key: v2 };
  const v1 = loadKey('AUTODM_ENC_KEY');
  if (v1) return { version: 1, key: v1 };
  throw new Error('AUTODM_ENC_KEY env not set');
}

function decryptKey(version: number): Buffer {
  const env = version === 1 ? 'AUTODM_ENC_KEY' : `AUTODM_ENC_KEY_V${version}`;
  const k = loadKey(env);
  if (!k) throw new Error(`No key for version v${version} (set ${env} to decrypt)`);
  return k;
}

/** Encrypt a token. Output is base64; format depends on active key version. */
export function encryptToken(plaintext: string): string {
  const { version, key } = activeKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  if (version === 1) {
    // Legacy format — keep emitting it as long as v1 is the active key,
    // so existing decrypters in this same release still work.
    return Buffer.concat([iv, tag, ct]).toString('base64');
  }
  return Buffer.concat([Buffer.from([VERSION_MARKER, version]), iv, tag, ct]).toString('base64');
}

export function decryptToken(encrypted: string): string {
  const buf = Buffer.from(encrypted, 'base64');
  // Versioned ciphertexts start with 0xFF followed by a version byte.
  if (buf.length >= 30 && buf[0] === VERSION_MARKER) {
    const version = buf[1];
    const iv = buf.subarray(2, 14);
    const tag = buf.subarray(14, 30);
    const ct = buf.subarray(30);
    const key = decryptKey(version);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
  }
  // Legacy v1 format: iv(12) || tag(16) || ct
  const key = decryptKey(1);
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}
