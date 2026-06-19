/**
 * Server-only email validity check.
 *
 *   - Format check (RFC-ish regex — same one used everywhere else).
 *   - Disposable-domain blocklist — top ~80 throwaway providers that
 *     show up in spam-signup attacks. Not exhaustive but covers most
 *     traffic. Maintained inline so we don't need a dependency.
 *   - MX-record DNS lookup — if the domain has no mail server, no
 *     real email exists there. `khjdf.com` and friends fail this.
 *   - Common-typo fix-up — suggests `gmail.com` for `gmal.com`,
 *     `outlook.com` for `outlok.com`, etc. We only use this for the
 *     UI hint; we don't auto-correct.
 *
 * Used by /api/auth/validate-email before letting Supabase send a
 * confirmation email to nothingness.
 */

import { promises as dns } from 'node:dns';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', 'guerrillamail.com', 'guerrillamail.net',
  'mailinator.com', 'mailinator.net', 'maildrop.cc', 'temp-mail.org', 'tempmail.com',
  'tempmail.net', 'throwaway.email', 'throwawaymail.com', 'yopmail.com', 'getnada.com',
  'tempinbox.com', 'sharklasers.com', 'grr.la', 'pokemail.net', 'fakeinbox.com',
  'mintemail.com', 'mailcatch.com', 'tempinbox.com', 'spam4.me', 'trashmail.com',
  'tempemail.com', 'tempemail.net', 'discard.email', 'discardmail.com', 'spambog.com',
  'tempmailbox.com', 'mohmal.com', 'spamgourmet.com', 'mytemp.email', 'mailnesia.com',
  'wegwerfmail.de', 'tempr.email', 'fakemailgenerator.com', 'tempsky.com',
  '33mail.com', 'getairmail.com', 'mailtemp.in', 'jetable.org', 'instantemailaddress.com',
  'mailbox.org', // ← legit; keep example for the comment, REMOVE on production tweak
  'mail-temp.com', 'tempmail.dev', 'inboxbear.com', 'tempmail.ninja',
  'binkmail.com', 'temporarymail.com', 'minuteinbox.com', 'tmpmail.net',
  'dropmail.me', 'emltmp.com', 'fakemail.net', 'mailpoof.com', 'plextrum.com',
  'spambox.us', 'tempail.com', 'trbvm.com', 'wuwuwa.com', 'zetmail.com',
  'tempr.email', 'mvrht.com', 'mailpoof.com', 'snapmail.cc',
]);
// Quick sanity — drop the deliberate test entry so real users aren't blocked.
DISPOSABLE_DOMAINS.delete('mailbox.org');

const POPULAR_DOMAINS = [
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com',
  'protonmail.com', 'proton.me', 'live.com', 'me.com', 'aol.com',
];

export interface EmailValidationResult {
  ok: boolean;
  reason?: 'format' | 'disposable' | 'no_mx' | 'dns_error';
  suggestion?: string | null;     // typo hint, e.g. "gmail.com" for "gmal.com"
}

export async function validateEmail(rawEmail: string): Promise<EmailValidationResult> {
  const email = (rawEmail || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, reason: 'format' };

  const domain = email.split('@')[1];
  if (!domain) return { ok: false, reason: 'format' };

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, reason: 'disposable', suggestion: suggestPopular(domain) };
  }

  try {
    const mx = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('dns timeout')), 4000)),
    ]);
    if (!mx || mx.length === 0) {
      return { ok: false, reason: 'no_mx', suggestion: suggestPopular(domain) };
    }
  } catch {
    // ENOTFOUND, ENODATA, or timeout — treat all as "domain can't accept mail".
    return { ok: false, reason: 'no_mx', suggestion: suggestPopular(domain) };
  }

  return { ok: true };
}

/** Levenshtein distance ≤ 2 against the popular-domain list. */
function suggestPopular(domain: string): string | null {
  let best: { domain: string; dist: number } | null = null;
  for (const d of POPULAR_DOMAINS) {
    const dist = levenshtein(domain, d);
    if (dist <= 2 && (!best || dist < best.dist)) best = { domain: d, dist };
  }
  return best?.domain ?? null;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i] as number[]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
