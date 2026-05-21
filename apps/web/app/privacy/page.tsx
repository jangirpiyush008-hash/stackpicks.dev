import { LegalPage } from '../../components/LegalPage';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How StackPicks handles personal data, cookies, analytics, and your rights under DPDP and GDPR.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="21 May 2026">
      <p>
        This Privacy Policy explains what data StackPicks (&ldquo;we&rdquo;, &ldquo;the
        directory&rdquo;) collects when you use the site, why we collect it, who we share it with,
        and how you can control it. It is written in plain language. If anything is unclear, email{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>
      <p>
        We comply with India&apos;s Digital Personal Data Protection Act 2023 (DPDP Act) and, where
        applicable, the EU General Data Protection Regulation (GDPR).
      </p>

      <h2>1. What data we collect</h2>
      <h3>1.1 Information you provide directly</h3>
      <ul>
        <li><strong>Email address</strong> — when you subscribe to the newsletter or create an account</li>
        <li><strong>Account details</strong> — name, company, phone, GSTIN (for Indian business customers buying sponsorships)</li>
        <li><strong>Payment metadata</strong> — Razorpay transaction IDs, billing address. We do <strong>not</strong> store card numbers, UPI handles, or bank details — those are held by Razorpay</li>
      </ul>
      <h3>1.2 Information we collect automatically</h3>
      <ul>
        <li><strong>Anonymised analytics</strong> — page views, referrers, user-agent strings via Plausible (no cookies, no fingerprinting, no IP storage)</li>
        <li><strong>Outbound click hashes</strong> — when you click a repo link, we record a SHA-256 hash of your IP combined with a daily-rotating salt. The raw IP is never stored. The hash cannot be reversed and resets every 24 hours, so we can&apos;t reconstruct your browsing history across days</li>
        <li><strong>Server logs</strong> — minimal HTTP request logs retained for 14 days for security and debugging</li>
      </ul>

      <h2>2. Why we collect it</h2>
      <ul>
        <li>To deliver the service (show the directory, accept payments, send the newsletter)</li>
        <li>To improve curation quality (aggregate click data tells us which takes are useful)</li>
        <li>To prevent abuse (rate-limiting, fraud detection)</li>
        <li>To meet legal and tax obligations (invoicing, GST records)</li>
      </ul>

      <h2>3. What we don&apos;t do</h2>
      <ul>
        <li>We do not sell personal data to advertisers, brokers, or third parties</li>
        <li>We do not use behavioural ad networks (no Google Ads pixel, no Facebook pixel)</li>
        <li>We do not run cross-site tracking</li>
        <li>We do not maintain shadow profiles of non-users</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        We use the minimum cookies necessary to operate the site:
      </p>
      <ul>
        <li><strong>Session cookies</strong> — for logged-in users only, expire on logout</li>
        <li><strong>CSRF tokens</strong> — for payment and form submissions, expire on submit</li>
      </ul>
      <p>
        We do <strong>not</strong> set advertising, marketing, or analytics cookies. Plausible
        operates cookie-free. No cookie banner is needed because we don&apos;t set any optional
        cookies. If you don&apos;t want even the essential cookies, your browser&apos;s privacy
        mode will block them — the site still works.
      </p>

      <h2>5. Third-party services we use</h2>
      <p>Each handles your data under its own privacy policy:</p>
      <ul>
        <li><strong>Razorpay</strong> — payment processing (PCI-DSS Level 1 certified)</li>
        <li><strong>Supabase</strong> — database hosting (Mumbai region, SOC 2 Type 2)</li>
        <li><strong>Vercel / Railway</strong> — application hosting</li>
        <li><strong>Resend</strong> — transactional + newsletter email delivery</li>
        <li><strong>Plausible</strong> — privacy-friendly analytics (no cookies, no PII)</li>
        <li><strong>GitHub</strong> — public repo data only, no user-identifying queries</li>
      </ul>

      <h2>6. Data retention</h2>
      <ul>
        <li>Account data — kept while the account is active, deleted 90 days after deletion request</li>
        <li>Payment records — kept for 7 years to meet Indian tax law</li>
        <li>Newsletter subscriptions — kept until you unsubscribe (one click in every email)</li>
        <li>Outbound click hashes — aggregated and rotated daily, raw entries purged after 30 days</li>
        <li>Server logs — 14 days</li>
      </ul>

      <h2>7. Your rights</h2>
      <p>Under the DPDP Act (India) and GDPR (EU) you have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Correct</strong> inaccurate data</li>
        <li><strong>Delete</strong> your account and all associated data</li>
        <li><strong>Export</strong> your data in a portable format (JSON)</li>
        <li><strong>Withdraw consent</strong> for any optional processing</li>
        <li><strong>Lodge a complaint</strong> with the Data Protection Board of India or your local supervisory authority</li>
      </ul>
      <p>
        Exercise any of these by emailing <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{' '}
        with the subject &ldquo;Data request&rdquo;. We respond within 30 days.
      </p>

      <h2>8. Data transfers outside India</h2>
      <p>
        Some service providers (Resend, Plausible, Vercel) operate servers outside India. Where
        this happens, we ensure equivalent safeguards via the provider&apos;s standard contractual
        clauses. Supabase data is stored in the Mumbai (ap-south-1) region.
      </p>

      <h2>9. Children</h2>
      <p>
        The service is not directed at children under 18. We do not knowingly collect data from
        anyone under 18. If you believe a child has provided personal data, email us and we&apos;ll
        delete it.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We update this policy when our practices change. Material changes will be announced via
        the newsletter and a banner on the site for at least 14 days. The &ldquo;last
        updated&rdquo; date at the top reflects the latest revision.
      </p>

      <h2>11. Contact</h2>
      <p>
        Grievance Officer / Data Protection Officer: reachable at{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>.
      </p>
    </LegalPage>
  );
}
