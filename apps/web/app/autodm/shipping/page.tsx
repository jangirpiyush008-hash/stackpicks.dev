// AutoDM service-delivery (a.k.a. "shipping") policy.
// Razorpay AND Google Ads (for any future paid acquisition) require an explicit
// page describing how a digital service is delivered. "Shipping" is the legacy
// label they use for e-comm — for SaaS we use "service delivery" semantically.

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Service Delivery Policy — StackPicks AutoDM',
  description: 'How StackPicks AutoDM provisions, activates, and delivers its Instagram comment-to-DM automation service after payment.',
};

export default function AutoDmShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Service Delivery Policy</h1>
        <p className="text-xs text-muted font-mono">Last updated: 18 June 2026</p>
      </header>

      <article className="legal-prose">
        <p>
          AutoDM is a <strong>digital SaaS service</strong>. There are no physical goods, no
          shipping address, and no courier involved. This page explains how the service is
          delivered, activated, and accessed after payment. It is published to meet Razorpay
          merchant requirements and Google Ads policy for billable digital services.
        </p>

        <h2>1. What you receive</h2>
        <ul>
          <li>Cloud access to <code>autodm.stackpicks.dev</code> — a multi-tenant web dashboard that connects to your Instagram Professional account via Meta&apos;s official Instagram Graph API.</li>
          <li>Capacity limits as published on the <Link href="/pricing">pricing page</Link> for the plan you purchased (DMs per hour, DMs per day, number of connected accounts).</li>
          <li>Email-based product support at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</li>
        </ul>

        <h2>2. When activation happens</h2>
        <ul>
          <li><strong>Free plan</strong> — activated immediately on email signup. No payment, no waiting period.</li>
          <li><strong>Paid plans (Creator / Pro / Agency)</strong> — activated within <strong>5 minutes</strong> of Razorpay confirming the first successful charge. Our webhook flips your account&apos;s plan tier as soon as the <code>subscription.charged</code> event fires.</li>
          <li><strong>Enterprise</strong> — activated within 1 business day of contract signature, once the first invoice payment clears.</li>
        </ul>

        <h2>3. Where to access the service</h2>
        <ul>
          <li>Web: <a href="https://autodm.stackpicks.dev">https://autodm.stackpicks.dev</a></li>
          <li>API (for tenants on Pro and above): documented inside the dashboard.</li>
          <li>No mobile app today. The dashboard is fully responsive on mobile browsers.</li>
        </ul>

        <h2>4. How long activation takes</h2>
        <table>
          <thead>
            <tr><th>Step</th><th>Typical time</th><th>Worst case</th></tr>
          </thead>
          <tbody>
            <tr><td>Free signup → dashboard open</td><td>Instant</td><td>1 minute</td></tr>
            <tr><td>Razorpay charge → plan upgrade visible</td><td>30 seconds</td><td>5 minutes</td></tr>
            <tr><td>Instagram OAuth connect → first rule live</td><td>2 minutes</td><td>10 minutes</td></tr>
            <tr><td>First comment → first auto-DM sent</td><td>5–30 seconds</td><td>2 minutes</td></tr>
          </tbody>
        </table>

        <h2>5. What can delay activation</h2>
        <ul>
          <li>Meta / Instagram Graph API outage or rate limit (outside our control).</li>
          <li>Your Instagram account is not switched to Professional / Business mode — required by Meta&apos;s API.</li>
          <li>Razorpay payment held for fraud review on your bank&apos;s side — usually resolves within an hour.</li>
          <li>You have not authorized the Meta Business Login scope <code>instagram_business_manage_messages</code> during OAuth.</li>
        </ul>

        <h2>6. Service availability</h2>
        <ul>
          <li>AutoDM targets <strong>99.5% monthly uptime</strong> excluding upstream provider outages (Meta, Razorpay, Supabase, Railway).</li>
          <li>Scheduled maintenance is announced via email at least 24 hours in advance, conducted Sunday 03:00–05:00 IST.</li>
          <li>If we fall below 72 consecutive hours of availability due to our fault, you may request a pro-rated refund (see <Link href="/refund">refund policy</Link> §4).</li>
        </ul>

        <h2>7. Geographic availability</h2>
        <p>
          AutoDM is available to creators and businesses globally, subject to Meta&apos;s
          country-level restrictions on Instagram messaging APIs. Billing is in INR via Razorpay;
          customers outside India are charged the INR price converted at Razorpay&apos;s rate at
          the time of each transaction.
        </p>

        <h2>8. Discontinuation</h2>
        <p>
          If we ever discontinue AutoDM, we give 30 days&apos; notice via email, stop all
          auto-renewals immediately, and refund the unused portion of any pre-paid annual
          (Enterprise) contract. You can export your contacts CSV from the dashboard at any time.
        </p>

        <h2>9. Contact for delivery issues</h2>
        <p>
          If activation did not happen within the windows above, email{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the subject &ldquo;AutoDM activation issue&rdquo;
          and your Razorpay payment ID. We respond {CONTACT.responseTime}.
        </p>
      </article>
    </div>
  );
}
