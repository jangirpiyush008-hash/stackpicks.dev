/**
 * Server-only security helpers shared across auth-sensitive routes.
 *
 *   - rateLimit(): in-process token bucket keyed by IP+route, returns
 *     { ok, remaining }. Survives until the process restarts (good enough
 *     for brute-force protection on a single Railway instance).
 *   - hashIp(): SHA-256-truncated IP hash for audit/rate-limit keys —
 *     never store raw IPs.
 *   - signState() / verifyState(): HMAC-signed payload with timestamp.
 *     Used to make OAuth state values that can't be replayed past TTL.
 *   - isSafeNextPath(): validates `?next=` redirects are same-origin paths.
 *   - writeAudit(): append a row to autodm_audit_log via service role.
 */

import crypto from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';

// ────────────────────────────────────────────────────────────────────
// IP hashing
// ────────────────────────────────────────────────────────────────────

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export function clientIp(req: Request): string | null {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null
  );
}

// ────────────────────────────────────────────────────────────────────
// In-memory rate limiter
// ────────────────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Sliding-window counter. `windowMs` resets after first hit; up to `max`
 *  hits per window allowed. Returns { ok, remaining, resetAt }. */
export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: max - 1, resetAt: fresh.resetAt };
  }
  b.count += 1;
  if (b.count > max) return { ok: false, remaining: 0, resetAt: b.resetAt };
  return { ok: true, remaining: max - b.count, resetAt: b.resetAt };
}

// ────────────────────────────────────────────────────────────────────
// Signed state (OAuth replay protection)
// ────────────────────────────────────────────────────────────────────

const STATE_SECRET = process.env.STATE_SIGNING_SECRET || process.env.CRON_SECRET || 'dev-only';
const STATE_TTL_MS = 10 * 60 * 1000; // 10 min

/** Build `${payload}.${ts}.${hmac}` — payload is whatever caller wants
 *  to round-trip, ts is server-issued, hmac binds them. */
export function signState(payload: string): string {
  const ts = Date.now().toString();
  const body = `${encodeURIComponent(payload)}.${ts}`;
  const hmac = crypto.createHmac('sha256', STATE_SECRET).update(body).digest('hex').slice(0, 24);
  return `${body}.${hmac}`;
}

/** Returns the payload string if the state was issued by us and is
 *  within TTL. Returns null on any mismatch. */
export function verifyState(state: string | null | undefined): string | null {
  if (!state) return null;
  const parts = state.split('.');
  if (parts.length !== 3) return null;
  const [encPayload, ts, hmac] = parts;
  const body = `${encPayload}.${ts}`;
  const expected = crypto.createHmac('sha256', STATE_SECRET).update(body).digest('hex').slice(0, 24);
  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return null;
  const issued = Number(ts);
  if (!Number.isFinite(issued)) return null;
  if (Date.now() - issued > STATE_TTL_MS) return null;
  try { return decodeURIComponent(encPayload); } catch { return null; }
}

// ────────────────────────────────────────────────────────────────────
// Open-redirect-safe next paths
// ────────────────────────────────────────────────────────────────────

/** True if `next` is a same-origin path safe to redirect to.
 *  Allows: `/`, `/dashboard`, `/autodm/connect?x=1`.
 *  Rejects: `//evil.com`, `https://evil.com`, `javascript:`, etc. */
export function isSafeNextPath(next: unknown): boolean {
  if (typeof next !== 'string') return false;
  if (next.length === 0 || next.length > 1024) return false;
  if (!next.startsWith('/')) return false;
  if (next.startsWith('//')) return false;       // protocol-relative
  if (next.startsWith('/\\')) return false;       // back-slash trick
  // No control chars
  if (/[\x00-\x1f]/.test(next)) return false;
  return true;
}

export function safeNext(next: unknown, fallback: string = '/dashboard'): string {
  return isSafeNextPath(next) ? (next as string) : fallback;
}

// ────────────────────────────────────────────────────────────────────
// Audit log
// ────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  userId: string | null;
  action: string;
  targetId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  meta?: Record<string, unknown>;
}

/** Best-effort: writes to autodm_audit_log but never throws into the
 *  caller — security logging should never break the actual user flow. */
export async function writeAudit(entry: AuditEntry): Promise<void> {
  try {
    const admin = adminClient();
    await admin.from('autodm_audit_log').insert({
      user_id: entry.userId,
      action: entry.action,
      target_id: entry.targetId ?? null,
      ip_hash: hashIp(entry.ip),
      user_agent: entry.userAgent?.slice(0, 300) ?? null,
      meta: entry.meta ?? null,
    });
  } catch (e) {
    console.error('[audit] failed to record', entry.action, (e as Error).message);
  }
}
