'use client';

/**
 * TOTP MFA enrollment + management for StackPicks accounts.
 *
 * Flow:
 *   1. Page loads → list factors. If a verified TOTP factor exists, show
 *      "MFA enabled" + Disable button.
 *   2. Otherwise, show "Enable 2FA" → calls auth.mfa.enroll() →
 *      we render the QR code + ask user to type their first 6-digit code.
 *   3. User submits code → auth.mfa.challenge() + verify() → factor
 *      becomes 'verified'. We refresh the list.
 *
 * Backed by Supabase MFA (RFC 6238 TOTP, Google Authenticator / Authy
 * compatible). No client-side secret storage; Supabase keeps the encrypted
 * shared secret bound to the user.
 */

import { useEffect, useState } from 'react';
import { Loader2, Shield, ShieldCheck, X as CloseIcon, Check } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Factor = { id: string; status: 'verified' | 'unverified'; friendly_name?: string | null };

export function Mfa() {
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const supa = getSupabaseBrowser();
      const { data } = await supa.auth.mfa.listFactors();
      const totp = (data?.totp ?? []) as Factor[];
      setFactors(totp);
    } finally { setLoading(false); }
  }

  useEffect(() => { void refresh(); }, []);

  async function startEnroll() {
    setErr(null); setBusy(true);
    try {
      const supa = getSupabaseBrowser();
      const { data, error } = await supa.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator (TOTP)',
      });
      if (error) throw error;
      setQr(data.totp.qr_code);
      setSecret(data.totp.secret);
      setPendingFactorId(data.id);
      setEnrollOpen(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingFactorId || code.length !== 6) return;
    setErr(null); setBusy(true);
    try {
      const supa = getSupabaseBrowser();
      const { data: challenge, error: chErr } = await supa.auth.mfa.challenge({ factorId: pendingFactorId });
      if (chErr) throw chErr;
      const { error: vErr } = await supa.auth.mfa.verify({
        factorId: pendingFactorId,
        challengeId: challenge.id,
        code,
      });
      if (vErr) throw vErr;
      setEnrollOpen(false);
      setQr(null); setSecret(null); setPendingFactorId(null); setCode('');
      void refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function disableFactor(factorId: string) {
    if (!confirm('Disable 2FA on this account? You\'ll only have password login afterward.')) return;
    setBusy(true);
    try {
      const supa = getSupabaseBrowser();
      const { error } = await supa.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      void refresh();
    } catch (e) {
      alert((e as Error).message);
    } finally { setBusy(false); }
  }

  if (loading) {
    return <div className="text-sm text-muted">Loading 2FA status…</div>;
  }

  const verified = factors.filter((f) => f.status === 'verified');

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-2 mb-3">
        {verified.length ? <ShieldCheck className="w-4 h-4 text-accent" /> : <Shield className="w-4 h-4 text-muted" />}
        <div className="font-semibold">Two-factor authentication</div>
        {verified.length > 0 && (
          <span className="text-[10px] font-mono uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full">Active</span>
        )}
      </div>
      <p className="text-xs text-muted leading-relaxed mb-4">
        Add a one-time code from your authenticator app on top of your password.
        Compatible with Google Authenticator, Authy, 1Password, Raycast, etc.
      </p>

      {verified.length === 0 && (
        <button
          type="button"
          onClick={startEnroll}
          disabled={busy}
          className="inline-flex items-center gap-1.5 bg-accent text-bg font-semibold px-4 py-2 rounded-md text-xs hover:bg-accent/90 disabled:opacity-50 transition"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Enable 2FA
        </button>
      )}

      {verified.length > 0 && (
        <div className="space-y-2">
          {verified.map((f) => (
            <div key={f.id} className="flex items-center justify-between text-xs">
              <span className="text-text">{f.friendly_name || 'Authenticator'}</span>
              <button
                type="button"
                onClick={() => disableFactor(f.id)}
                disabled={busy}
                className="text-rose-400 hover:text-rose-300 disabled:opacity-50"
              >
                Disable
              </button>
            </div>
          ))}
        </div>
      )}

      {err && !enrollOpen && <p className="mt-2 text-xs text-rose-400">{err}</p>}

      {/* Enrollment modal */}
      {enrollOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEnrollOpen(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-bg shadow-2xl p-6">
            <button
              type="button"
              onClick={() => setEnrollOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-text"
              aria-label="Close"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold mb-2">Scan the QR code</h3>
            <p className="text-xs text-muted mb-4">
              Open your authenticator app (Google Authenticator, Authy, 1Password)
              and scan this code. Then type the 6-digit code it shows to confirm.
            </p>
            {qr && (
              <div className="bg-white p-3 rounded-lg mb-3 inline-block">
                {/* qr is a data: URL */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="TOTP QR code" width={180} height={180} />
              </div>
            )}
            {secret && (
              <p className="text-[11px] text-muted font-mono break-all mb-4">
                Can&apos;t scan? Enter this key manually: <span className="text-text">{secret}</span>
              </p>
            )}
            <form onSubmit={verifyCode} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                autoFocus
                className="w-full px-3 py-2 rounded-md border border-border bg-surface/40 focus:outline-none focus:border-accent text-sm font-mono tracking-widest text-center"
              />
              {err && <p className="text-xs text-rose-400">{err}</p>}
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent text-bg font-semibold px-4 py-2 rounded-md text-sm disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Verify &amp; activate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
