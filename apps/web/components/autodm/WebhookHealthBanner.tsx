// Webhook health banner — surfaces "Meta isn't delivering events" to
// creators BEFORE they notice DMs stop firing. Three tiers:
//   • fresh   (< 6h)      → no banner (silence = healthy)
//   • stale   (6-24h)     → amber: "Quiet zone — webhooks haven't pinged in Xh"
//   • critical(24h+)      → red: "Webhooks broken — reconnect now"
//
// 6h threshold is generous: a real-but-slow creator can go 6h between
// any comment/DM. Past 6h we say "quiet zone" (not broken) — only
// real concern at 24h+ (one full posting cycle missed).
//
// Server-rendered. No client interactivity needed beyond the reconnect
// link → /autodm/connect.

import Link from 'next/link';
import { AlertTriangle, Activity, ZapOff } from 'lucide-react';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function WebhookHealthBanner({
  lastWebhookReceivedAt,
  tenantCreatedAt,
}: {
  lastWebhookReceivedAt: string | null;
  tenantCreatedAt: string;
}) {
  const now = Date.now();
  // Brand-new tenant (just connected, no comments yet) — never show
  // an alert. Use createdAt as the baseline for the first 6h.
  const createdMs = +new Date(tenantCreatedAt);
  const isNewTenant = now - createdMs < SIX_HOURS_MS;
  if (isNewTenant && !lastWebhookReceivedAt) return null;

  if (!lastWebhookReceivedAt) {
    // No webhooks ever, and tenant has existed > 6h — that's a
    // configuration failure. Treat as critical.
    return <CriticalBanner ageHours={null} />;
  }

  const ageMs = now - +new Date(lastWebhookReceivedAt);
  if (ageMs < SIX_HOURS_MS) return null;

  const ageHours = Math.round(ageMs / (60 * 60 * 1000));
  if (ageMs < ONE_DAY_MS) return <StaleBanner ageHours={ageHours} />;
  return <CriticalBanner ageHours={ageHours} />;
}

function StaleBanner({ ageHours }: { ageHours: number }) {
  return (
    <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 flex items-start gap-3">
      <Activity className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <strong>Quiet zone.</strong>{' '}
        <span className="text-muted">
          Meta hasn&apos;t pinged us in {ageHours}h. Could just mean a slow day for
          comments — but if you&apos;re posting regularly and seeing nothing in <em>Recent activity</em> below,
          your token may have expired.{' '}
          <Link href="/autodm/connect" className="text-amber-400 hover:text-amber-300 underline">Re-check connection →</Link>
        </span>
      </div>
    </div>
  );
}

function CriticalBanner({ ageHours }: { ageHours: number | null }) {
  return (
    <div className="mb-6 rounded-2xl border-2 border-rose-500/50 bg-rose-500/10 p-5 flex items-start gap-3">
      <ZapOff className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <div className="font-semibold text-rose-300">
          <AlertTriangle className="inline w-4 h-4 mr-1" />
          Webhooks have stopped.
        </div>
        <div className="text-rose-200/80 mt-1.5 leading-relaxed">
          {ageHours
            ? <>No Meta events received in <strong>{ageHours}h</strong>. </>
            : <>We&apos;ve never received a webhook for this account. </>}
          That means new comments aren&apos;t triggering DMs. Most common cause: your
          Instagram access token expired or was revoked.
        </div>
        <Link
          href="/autodm/connect"
          className="mt-3 inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-500/90 text-white text-xs font-semibold px-3.5 py-2 rounded-full"
        >
          Reconnect Instagram now
        </Link>
      </div>
    </div>
  );
}
