import { LegalPage } from '../../components/LegalPage';
import { CONTACT, ENTITY } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Delivery & Service Activation Policy',
  description: 'How StackPicks delivers premium access — instant, digital, no shipping required.',
};

export default function ShippingPage() {
  return (
    <LegalPage title="Delivery & Service Activation" lastUpdated="21 May 2026">
      <p>
        {ENTITY.brand} is a <strong>fully digital subscription service</strong>. We deliver access
        to an online directory — not physical goods. There is no shipping, no logistics, no
        courier involvement. This page exists to satisfy payment-processor and Indian e-commerce
        disclosure requirements.
      </p>

      <h2>1. What gets delivered</h2>
      <ul>
        <li><strong>Lifetime membership (₹99 / $2.99 one-time)</strong> — instant activation of your account, unlocking the full directory service: every analyst take, every ready-to-ship stack bundle, weekly long-form analyses.</li>
        <li><strong>Sponsored placements</strong> — activation of your slot on the dates you specified at checkout.</li>
        <li><strong>Job posts</strong> — listing goes live on the directory immediately after successful payment.</li>
      </ul>

      <h2>2. Activation timeline</h2>
      <ul>
        <li><strong>Lifetime membership:</strong> Activated within <strong>1 minute</strong> of successful Razorpay payment. Login URL + onboarding email is sent immediately.</li>
        <li><strong>Sponsored placements:</strong> Activated within <strong>1 hour</strong> after payment, pending review of the creative assets supplied.</li>
        <li><strong>Job posts:</strong> Live within <strong>15 minutes</strong> of payment.</li>
      </ul>
      <p>
        Activation is fully automated. You will also receive a confirmation email from{' '}
        <code>{CONTACT.email}</code> (or our verified Resend sending domain) with your invoice and
        access details.
      </p>

      <h2>3. If activation fails or is delayed</h2>
      <p>
        Payment processed but service not activated within the stated window? Email{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with your <strong>Razorpay
        payment ID</strong> (begins with <code>pay_</code>). We resolve within{' '}
        <strong>{CONTACT.responseTime}</strong>. If you don&apos;t hear back, full refund per the{' '}
        <a href="/refund">Refund Policy</a>.
      </p>

      <h2>4. No physical shipping</h2>
      <p>
        {ENTITY.brand} does not ship any physical goods. No address is collected at checkout
        beyond what Razorpay requires for billing. No courier, no tracking, no customs.
      </p>

      <h2>5. Service availability</h2>
      <p>
        The Service is available 24×7 over the public internet. Planned maintenance, when needed,
        is announced at least 24 hours in advance via the newsletter and a banner on the site.
        Unplanned outages are reported on the same channels and trigger refund clauses per the{' '}
        <a href="/refund">Refund Policy</a> when they exceed 30 consecutive days.
      </p>

      <h2>6. Geographic coverage</h2>
      <p>
        The directory is accessible globally. Pricing is currency-localised: <strong>₹99 (INR)</strong>{' '}
        for Indian customers via Razorpay (UPI / cards / netbanking), and <strong>$2.99 (USD)</strong>{' '}
        for international customers via Razorpay&apos;s international card acquiring. Some regions
        may be unavailable due to Indian export-control law — email us if Razorpay declines your
        country and we&apos;ll advise.
      </p>

      <h2>7. Contact</h2>
      <p>
        Delivery / activation issues: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{' '}
        <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>
      </p>
    </LegalPage>
  );
}
