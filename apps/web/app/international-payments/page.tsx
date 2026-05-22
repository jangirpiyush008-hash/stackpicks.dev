import Link from 'next/link';
import { LegalPage } from '../../components/LegalPage';
import { CONTACT, ENTITY } from '@stackpicks/core/constants';

export const metadata = {
  title: 'International Payments Policy',
  description: 'How StackPicks accepts payments from outside India — currencies, FX, taxes, FEMA / RBI compliance, restricted regions, and cross-border refunds.',
};

export default function InternationalPaymentsPage() {
  return (
    <LegalPage title="International Payments Policy" lastUpdated="21 May 2026">
      <p>
        This page covers how <strong>{ENTITY.brand}</strong> accepts payments from customers
        outside India. It supplements the <Link href="/terms">Terms of Service</Link>,{' '}
        <Link href="/refund">Refund Policy</Link>, and{' '}
        <Link href="/shipping">Delivery Policy</Link>. We comply with Indian foreign-exchange
        law (FEMA, 1999), RBI cross-border digital payments guidelines, and the relevant
        OECD / G20 digital service tax norms.
      </p>

      <h2>1. Service & price (international customers)</h2>
      <ul>
        <li><strong>Service:</strong> lifetime membership to the {ENTITY.brand} directory — same product as Indian customers receive</li>
        <li><strong>Price:</strong> <strong>$2.99 USD</strong>, one-time payment</li>
        <li><strong>Acceptance methods:</strong> international credit and debit cards (Visa, MasterCard, AMEX) processed through Razorpay&apos;s international card acquiring</li>
        <li><strong>Settlement currency:</strong> all proceeds settle to {ENTITY.brand}&apos;s Indian bank account in INR after Razorpay&apos;s FX conversion</li>
        <li><strong>Customer billing:</strong> your card statement shows the USD charge plus any cross-border fee your bank applies. We do not add a surcharge ourselves</li>
      </ul>

      <h2>2. Currency conversion & FX rate</h2>
      <p>
        We display prices in USD for clarity. Razorpay performs the USD→INR conversion at the
        prevailing wholesale rate at transaction time plus their published conversion margin.
        We do not control or mark up this rate. The rate at purchase is the rate used for any
        future refund — see § 6 below.
      </p>

      <h2>3. FEMA / RBI compliance</h2>
      <p>
        Inward remittances from international customers are received against{' '}
        <strong>RBI Purpose Code P0807</strong> (Other Information Services — subscriptions to
        online publications and databases). This is the standard purpose code for paid digital
        directory services.
      </p>
      <ul>
        <li>{ENTITY.brand} is operated by <strong>{ENTITY.operator}</strong> as a <strong>{ENTITY.form}</strong> in <strong>{ENTITY.jurisdiction}</strong></li>
        <li>All cross-border receipts are routed through Razorpay, an RBI-authorised payment aggregator</li>
        <li>FIRC (Foreign Inward Remittance Certificate) documentation is handled by Razorpay and shared with us for tax filing</li>
        <li>We file annual GST returns under the LUT scheme for export of services where applicable</li>
      </ul>

      <h2>4. Taxes</h2>
      <ul>
        <li><strong>For Indian customers:</strong> GST is collected at applicable rates; an Indian GSTIN can be added at checkout for B2B invoices</li>
        <li><strong>For international customers:</strong> StackPicks does not collect local taxes (VAT / GST / sales tax) in your jurisdiction. You are responsible for any reverse-charge or self-assessment your country requires</li>
        <li><strong>Indian export classification:</strong> sales to international customers are treated as export of digital services under Section 2(6) of the IGST Act (where the place of supply is outside India and consideration is received in foreign currency)</li>
      </ul>

      <h2>5. Restricted countries</h2>
      <p>
        We do not accept payments from countries currently subject to Indian RBI sanctions or
        Indian export-control law, including but not limited to:
      </p>
      <ul>
        <li>Countries on the Indian Ministry of External Affairs travel-restricted list</li>
        <li>Countries on the FATF black/grey list where Indian banks block remittances</li>
        <li>Specific jurisdictions where Razorpay&apos;s international acquiring is unavailable (most cards from these regions are declined at checkout)</li>
      </ul>
      <p>
        If your card is declined and you believe it is in error, email{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. We can advise alternative payment
        routes (PayPal-as-MoR, USDC, manual invoice) in some cases.
      </p>

      <h2>6. Cross-border refunds</h2>
      <ul>
        <li><strong>Cooling-off period:</strong> identical to Indian customers — full refund within 7 days of purchase, no questions asked</li>
        <li><strong>Currency:</strong> refunds are issued in the original transaction currency (USD) at the FX rate Razorpay used at purchase. You will not be reimbursed for FX-rate shifts between purchase and refund</li>
        <li><strong>Settlement time:</strong> 7-15 business days for international cards (your card-issuing bank&apos;s timing — out of our control)</li>
        <li><strong>Cross-border fees:</strong> some banks charge a non-refundable cross-border or FX-conversion fee at the original transaction. Razorpay refunds the principal; your bank&apos;s ancillary fees remain at your bank&apos;s discretion</li>
        <li><strong>Process:</strong> email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with your Razorpay payment ID (begins with <code>pay_</code>) and the email used at checkout</li>
      </ul>

      <h2>7. Chargebacks & disputes</h2>
      <p>
        Please contact us first before initiating a bank-level chargeback. Direct chargebacks
        cost both parties Razorpay&apos;s dispute fee, slow resolution, and may flag your card
        with your bank. We will always attempt resolution in good faith. Razorpay&apos;s dispute
        process applies as a backstop if direct contact fails.
      </p>

      <h2>8. Data residency</h2>
      <ul>
        <li>Account + activity data: stored in <strong>India (ap-south-1, Mumbai)</strong> on Supabase infrastructure</li>
        <li>Payment data: held by Razorpay (PCI-DSS Level 1, India-headquartered). We never store card numbers</li>
        <li>Server logs / email metadata: minimal retention, see <Link href="/privacy">Privacy Policy</Link></li>
      </ul>

      <h2>9. Service availability for international customers</h2>
      <ul>
        <li>Service is delivered over the public internet — accessible globally subject to local laws</li>
        <li>English-language only — we do not currently localise the directory into other languages</li>
        <li>Customer support is responsive to UTC business hours (10:00–18:00 IST = 04:30–12:30 UTC) — see <Link href="/contact">Contact</Link></li>
      </ul>

      <h2>10. Governing law</h2>
      <p>
        Notwithstanding international payment processing, the contract between you and{' '}
        {ENTITY.brand} is governed by the laws of India. Any dispute is subject to the
        exclusive jurisdiction of the courts at Gurgaon, Haryana, India — see{' '}
        <Link href="/terms">Terms § 14</Link> for the full clause.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We update this policy when our practices change or when RBI / FEMA requirements evolve.
        Material changes are announced 30 days in advance via the newsletter and a banner on
        the site. The &ldquo;last updated&rdquo; date at the top reflects the latest revision.
      </p>

      <h2>12. Contact</h2>
      <p>
        International payment queries: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{' '}
        <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>
        <br />
        Response time: {CONTACT.responseTime}. Operating hours: {CONTACT.hours}.
      </p>
    </LegalPage>
  );
}
