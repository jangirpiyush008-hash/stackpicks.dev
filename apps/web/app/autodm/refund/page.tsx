// AutoDM refund + cancellation policy.
// Razorpay requires this page to exist and be linked from checkout. Google
// Ads policy also requires a visible refund/cancellation policy for billed
// services. Tone matches autodm/privacy + autodm/terms.

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Refund & Cancellation Policy — StackPicks AutoDM',
  description: 'How StackPicks AutoDM handles refunds, cancellations, and chargebacks for monthly subscription plans.',
};

export default function AutoDmRefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Refund & Cancellation Policy</h1>
        <p className="text-xs text-muted font-mono">Last updated: 18 June 2026</p>
      </header>

      <article className="legal-prose">
        <p>
          This page explains how and when <strong>StackPicks AutoDM</strong>
          (&ldquo;AutoDM&rdquo;, &ldquo;we&rdquo;) refunds or cancels paid plans.
          AutoDM is a monthly subscription service operated by Piyush Jangir, a
          sole proprietorship based in India. The policy is written to meet
          Razorpay&apos;s merchant guidelines and India&apos;s Consumer Protection
          (E-Commerce) Rules, 2020.
        </p>

        <h2>1. Subscription cadence</h2>
        <ul>
          <li>All paid plans (Creator, Pro, Agency) bill <strong>monthly</strong>, in advance, via Razorpay.</li>
          <li>Enterprise contracts bill annually with terms agreed in writing.</li>
          <li>Razorpay charges the card / UPI Autopay / eMandate on the same calendar date every month until you cancel.</li>
        </ul>

        <h2>2. Cancellation — how and when</h2>
        <ul>
          <li>Cancel any time from your <Link href="/dashboard">dashboard</Link> → <em>Billing</em> → <em>Cancel subscription</em>.</li>
          <li>You can also email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we will cancel within one business day.</li>
          <li>Cancelling stops the <strong>next</strong> auto-debit. You keep paid features for the remainder of the cycle you already paid for.</li>
          <li>No partial refund is issued for the current cycle once it has started — you continue to use the service until the period ends.</li>
        </ul>

        <h2>3. 7-day satisfaction refund</h2>
        <ul>
          <li>If AutoDM does not work for you within the <strong>first 7 days</strong> of your first paid charge, email us within that window and we refund the most recent payment in full.</li>
          <li>This applies only to your first paid month per account. Subsequent renewals are non-refundable except in cases of service failure (see §4).</li>
          <li>Refunds are processed to the original payment method via Razorpay. Bank-side settlement typically takes 5–7 business days.</li>
        </ul>

        <h2>4. Service failure</h2>
        <ul>
          <li>If AutoDM is unavailable for more than <strong>72 consecutive hours</strong> due to our fault (not an upstream Meta / Instagram outage), you may request a pro-rated refund for the affected billing cycle.</li>
          <li>If Meta revokes our app permissions and we cannot restore them within 14 days, all affected subscribers receive a pro-rated refund.</li>
          <li>Outages caused by Meta API rate limits, IG account suspensions you triggered, or third-party service downtime (Razorpay, Resend, Supabase, Railway) are not eligible — those are outside our control.</li>
        </ul>

        <h2>5. Accidental duplicate payments</h2>
        <p>
          If Razorpay charges your account twice for the same billing cycle, email us and we refund the duplicate immediately, before the standard processing queue. Forward the duplicate Razorpay payment ID (begins with <code>pay_</code>).
        </p>

        <h2>6. What is NOT refundable</h2>
        <ul>
          <li>Subscription months billed before a cancellation request.</li>
          <li>Plans on accounts terminated for Terms violations (spam, scraping, automation abuse, Meta Platform Policy violations).</li>
          <li>Currency conversion losses on international payments — Razorpay&apos;s rate at the time of the original charge is final.</li>
          <li>Months during which you successfully sent at least one DM, beyond the 7-day satisfaction window.</li>
        </ul>

        <h2>7. Chargebacks</h2>
        <p>
          Please email us before raising a bank chargeback. Direct chargebacks bypass our refund process, cost both parties Razorpay&apos;s dispute fee (typically ₹100+), and slow resolution to weeks rather than days. We always try to resolve in good faith first.
        </p>

        <h2>8. GST and invoices</h2>
        <ul>
          <li>Indian customers with a GSTIN on file receive a tax invoice for every charge. When we issue a refund, we also issue a corresponding credit note.</li>
          <li>Retain both the invoice and credit note for your input-tax-credit records.</li>
        </ul>

        <h2>9. How to request a refund</h2>
        <ol>
          <li>Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the subject &ldquo;AutoDM refund request&rdquo;.</li>
          <li>Include the Razorpay payment ID (begins with <code>pay_</code>) and the email on the AutoDM account.</li>
          <li>Briefly state the reason — required for any refund beyond the 7-day window.</li>
          <li>We acknowledge within <strong>{CONTACT.responseTime}</strong>.</li>
          <li>Approved refunds are initiated within <strong>5 business days</strong>. Razorpay then takes 5–7 business days to credit the original payment method.</li>
        </ol>

        <h2>10. Contact</h2>
        <p>
          Refund or cancellation queries:{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> · <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>
          <br />
          Response: <strong>{CONTACT.responseTime}</strong>. Hours: <strong>{CONTACT.hours}</strong>.
        </p>
      </article>
    </div>
  );
}
