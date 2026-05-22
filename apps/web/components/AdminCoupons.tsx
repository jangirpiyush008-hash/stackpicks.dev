'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Trash2, Power, Check, X } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  kind: 'percentage' | 'fixed_inr' | 'fixed_usd' | 'free';
  value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export function AdminCoupons({ initial }: { initial: Coupon[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [code, setCode] = useState('');
  const [kind, setKind] = useState<Coupon['kind']>('free');
  const [value, setValue] = useState(0);
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setCode(''); setKind('free'); setValue(0);
    setMaxUses(''); setExpiresAt(''); setDescription('');
    setErr('');
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          kind,
          value: Number(value) || 0,
          max_uses: maxUses ? Number(maxUses) : null,
          expires_at: expiresAt || null,
          description: description.trim() || null,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setErr(body.error || 'Create failed');
        setBusy(false);
        return;
      }
      reset();
      setShowForm(false);
      setBusy(false);
      router.refresh();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Network error');
      setBusy(false);
    }
  };

  const toggle = async (id: string, next: boolean) => {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: next }),
    });
    if (res.ok) router.refresh();
  };

  const remove = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}" permanently?`)) return;
    const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  const kindLabel = (c: Coupon) => {
    if (c.kind === 'free') return '100% off (free)';
    if (c.kind === 'percentage') return `${c.value}% off`;
    if (c.kind === 'fixed_inr') return `₹${Math.round(c.value / 100)} off (INR)`;
    return `$${(c.value / 100).toFixed(2)} off (USD)`;
  };

  return (
    <div>
      {/* Create button / form */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          New coupon
        </button>
      ) : (
        <form
          onSubmit={create}
          className="mb-4 p-5 rounded-2xl border border-accent/30 bg-accent/5 space-y-3"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Code">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="LAUNCH50"
                autoCapitalize="characters"
                className="w-full px-3 py-2 rounded bg-bg border border-border focus:border-accent outline-none text-sm font-mono uppercase tracking-wider"
              />
            </Field>
            <Field label="Type">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Coupon['kind'])}
                className="w-full px-3 py-2 rounded bg-bg border border-border focus:border-accent outline-none text-sm"
              >
                <option value="free">Free (100% off)</option>
                <option value="percentage">Percentage off (1–100)</option>
                <option value="fixed_inr">Fixed ₹ amount off (paise)</option>
                <option value="fixed_usd">Fixed $ amount off (cents)</option>
              </select>
            </Field>
            <Field label={
              kind === 'free' ? 'Value (ignored)'
              : kind === 'percentage' ? 'Value (1–100)'
              : kind === 'fixed_inr' ? 'Value (paise — 5000 = ₹50)'
              : 'Value (cents — 100 = $1)'
            }>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                disabled={kind === 'free'}
                placeholder="0"
                className="w-full px-3 py-2 rounded bg-bg border border-border focus:border-accent outline-none text-sm disabled:opacity-50"
              />
            </Field>
            <Field label="Max uses (blank = unlimited)">
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 rounded bg-bg border border-border focus:border-accent outline-none text-sm"
              />
            </Field>
            <Field label="Expires (blank = never)">
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 rounded bg-bg border border-border focus:border-accent outline-none text-sm"
              />
            </Field>
            <Field label="Internal note (optional)">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="For ProductHunt launch"
                className="w-full px-3 py-2 rounded bg-bg border border-border focus:border-accent outline-none text-sm"
              />
            </Field>
          </div>

          {err && <div className="text-xs text-red-400">{err}</div>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={busy || !code.trim()}
              className="px-4 py-2 rounded bg-accent text-bg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Create
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); reset(); }}
              className="px-4 py-2 rounded border border-border hover:border-accent text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="rounded-2xl border border-border bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1.2fr_1fr_0.8fr_120px] gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border bg-surface/60">
          <div>Code</div>
          <div>Type</div>
          <div>Usage</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {initial.length === 0 ? (
            <div className="px-4 py-10 text-center text-muted text-sm">
              No coupons yet. Click <strong>New coupon</strong> above.
            </div>
          ) : (
            initial.map((c) => (
              <div key={c.id} className="grid grid-cols-[1.2fr_1.2fr_1fr_0.8fr_120px] gap-3 px-4 py-3 items-center text-sm hover:bg-surface/40 transition">
                <div className="font-mono font-bold">{c.code}</div>
                <div className="text-muted">{kindLabel(c)}</div>
                <div className="text-muted text-xs">
                  {c.used_count} used{c.max_uses != null ? ` / ${c.max_uses}` : ' · unlimited'}
                  {c.expires_at && (
                    <div className="text-[10px] text-muted/60">exp: {new Date(c.expires_at).toLocaleDateString('en-IN')}</div>
                  )}
                </div>
                <div>
                  {c.is_active ? (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                      Off
                    </span>
                  )}
                </div>
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggle(c.id, !c.is_active)}
                    title={c.is_active ? 'Deactivate' : 'Activate'}
                    className="p-1.5 rounded border border-border hover:border-accent transition"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c.id, c.code)}
                    title="Delete"
                    className="p-1.5 rounded border border-red-500/30 text-red-300 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted font-mono block mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
