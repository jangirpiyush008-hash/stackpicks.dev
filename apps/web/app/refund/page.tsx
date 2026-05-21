import { LegalPage } from '../../components/LegalPage';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'When and how StackPicks issues refunds for premium memberships, sponsored listings, and job posts.',
};

export default function RefundPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" lastUpdated="21 May 2026">
      <p>
        This page explains when and how we process refunds and cancellations for paid features on
        StackPicks. The policy meets Razorpay&apos;s merchant requirements and Indian consumer
        protection norms.
      </p>

      <h2>1. Premium learning access (₹99 / $2.99 one-time)</h2>
      <ul>
        <li><strong>Cooling-off period</strong> — full refund within <strong>7 days</strong> of payment, no questions asked. Applies even after you&apos;ve accessed the educational content.</li>
        <li><strong>After 7 days</strong> — non-refundable, because the membership is a one-time payment for lifetime learning access and the educational content has been delivered</li>
        <li><strong>Service failure</strong> — if the Service is unavailable for more than 30 consecutive days due to our fault, you may request a full refund regardless of purchase date</li>
        <li><strong>Accidental duplicate payment</strong> — refunded fully within 7 business days of being reported</li>
      </ul>
      <p>
        Refunds are processed back to the original payment method via Razorpay. Bank-side
        settlement typically takes 5-7 business days.
      </p>

      <h2>2. Sponsored listings</h2>
      <ul>
        <li><strong>Cancellation before activation</strong> — full refund if cancelled before the listing goes live</li>
        <li><strong>Cancellation after activation</strong> — pro-rated refund for unused days. A 10% administrative fee applies to recover Razorpay processing costs</li>
        <li><strong>Minimum commitment</strong> — first month is non-refundable to discourage placement gaming</li>
        <li><strong>Editorial removal</strong> — if we remove a sponsored listing for policy violation, no refund</li>
        <li><strong>Editorial removal by mistake</strong> — full refund of the affected period</li>
      </ul>

      <h2>3. Newsletter sponsorships</h2>
      <ul>
        <li><strong>Before send</strong> — full refund up to 48 hours before scheduled send</li>
        <li><strong>After send</strong> — non-refundable; the impression has been delivered</li>
        <li><strong>Send failure</strong> — full refund or free re-send at sponsor&apos;s choice</li>
      </ul>

      <h2>4. Job posts</h2>
      <ul>
        <li><strong>Within 24 hours</strong> of listing going live — full refund</li>
        <li><strong>After 24 hours</strong> — non-refundable, but you may transfer the unused listing to a different role within the same 30-day window at no cost</li>
        <li><strong>Listing rejected for policy violation</strong> — refund minus 10% admin fee</li>
      </ul>

      <h2>5. How to request a refund</h2>
      <ol>
        <li>Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with subject &ldquo;Refund request&rdquo;</li>
        <li>Include your <strong>Razorpay payment ID</strong> (begins with <code>pay_</code>) and the email used at checkout</li>
        <li>Briefly describe the reason — required for cancellations after the cooling-off period</li>
        <li>We acknowledge within <strong>48 hours</strong> on business days</li>
        <li>Approved refunds are initiated within <strong>5 business days</strong></li>
      </ol>

      <h2>6. What is not refundable</h2>
      <ul>
        <li>Accounts terminated for Terms violations (spam, scraping abuse, fraud, harassment)</li>
        <li>Sponsored listings that have already accrued impressions/clicks (pro-rated, see section 2)</li>
        <li>Premium subscriptions beyond the 7-day cooling-off window</li>
        <li>Currency conversion losses on international payments (Razorpay&apos;s rate at purchase is final)</li>
      </ul>

      <h2>7. Chargebacks</h2>
      <p>
        Please contact us before initiating a bank chargeback. Direct chargebacks bypass our refund
        process, cost both parties Razorpay&apos;s dispute fee, and slow resolution. We will always
        try to resolve in good faith first.
      </p>

      <h2>8. GST treatment</h2>
      <p>
        For Indian business customers with a GSTIN on file, refunds are processed against the
        original tax invoice and a credit note is issued. Please retain both for your tax records.
      </p>

      <h2>9. Contact</h2>
      <p>
        Refund queries: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{' '}
        <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>
        <br />
        Response time: <strong>{CONTACT.responseTime}</strong>. Operating hours: <strong>{CONTACT.hours}</strong>.
      </p>
    </LegalPage>
  );
}
