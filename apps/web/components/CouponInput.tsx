'use client';

import { useState } from 'react';
import { Tag, Check, X, Loader2, ChevronDown } from 'lucide-react';

type Currency = 'INR' | 'USD';

interface ValidCoupon {
  code: string;
  base_label: string;
  discount_label: string;
  final_label: string;
  is_free: boolean;
}

export function CouponInput({ currency = 'INR' }: { currency?: Currency }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [coupon, setCoupon] = useState<ValidCoupon | null>(null);

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus('validating');
    setErrorMsg('');
    setCoupon(null);
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), currency }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        const msg: Record<string, string> = {
          not_found: 'Coupon code not found',
          inactive: 'This coupon is no longer active',
          expired: 'This coupon has expired',
          exhausted: 'This coupon has been fully redeemed',
          currency_mismatch: 'This coupon doesn\'t apply to your region',
          unavailable: 'Coupon system temporarily unavailable',
          invalid_code: 'Code must be at least 3 characters',
          server_error: 'Something went wrong — try again',
        };
        setErrorMsg(msg[body.error] ?? 'Invalid coupon');
        setStatus('invalid');
        return;
      }
      setCoupon(body.data);
      setStatus('valid');
    } catch {
      setErrorMsg('Network error — try again');
      setStatus('invalid');
    }
  };

  const reset = () => {
    setStatus('idle');
    setCoupon(null);
    setErrorMsg('');
    setCode('');
  };

  if (status === 'valid' && coupon) {
    return (
      <div className="rounded-xl border border-accent/40 bg-accent/5 p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent">
                Coupon applied
              </span>
              <span className="font-mono text-text font-bold">{coupon.code}</span>
            </div>
            <div className="mt-1 flex items-baseline flex-wrap gap-2 text-sm">
              <span className="line-through text-muted">{coupon.base_label}</span>
              <span className="text-accent font-bold text-lg">{coupon.final_label}</span>
              <span className="text-xs text-muted">
                {coupon.is_free ? '· Free pass — no payment needed' : `· You save ${coupon.discount_label}`}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-muted hover:text-text transition shrink-0"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition"
      >
        <Tag className="w-3 h-3" />
        Got a coupon code?
        <ChevronDown className="w-3 h-3" />
      </button>
    );
  }

  return (
    <form onSubmit={apply} className="mt-4 rounded-xl border border-border bg-bg/60 p-4">
      <label className="text-xs text-muted mb-2 flex items-center gap-1.5">
        <Tag className="w-3 h-3" />
        Coupon code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (status === 'invalid') setStatus('idle');
          }}
          placeholder="e.g. LAUNCH50"
          autoComplete="off"
          autoCapitalize="characters"
          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border focus:border-accent outline-none text-sm uppercase tracking-wider font-mono"
        />
        <button
          type="submit"
          disabled={status === 'validating' || !code.trim()}
          className="px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {status === 'validating' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Apply
        </button>
      </div>
      {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
      <button
        type="button"
        onClick={() => { setOpen(false); reset(); }}
        className="text-[11px] text-muted hover:text-text transition mt-3"
      >
        Cancel
      </button>
    </form>
  );
}
