import { LegalPage } from '../../components/LegalPage';
import { CONTACT, ENTITY } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of StackPicks — the directory, the newsletter, the premium membership, sponsored listings, and the job board.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="21 May 2026">
      <p>
        These Terms govern your access to and use of <strong>{ENTITY.brand}</strong>{' '}
        (&ldquo;the Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). The Service is operated as
        a <strong>{ENTITY.form}</strong> by <strong>{ENTITY.operator}</strong>, based in {ENTITY.jurisdiction}.
        By using the Service you agree to these Terms. If you don&apos;t agree, please stop using
        the Service.
      </p>

      <h2>1. Who can use the Service</h2>
      <ul>
        <li>You must be 18 years or older</li>
        <li>You must have the legal capacity to enter into a binding contract in your jurisdiction</li>
        <li>You must not be barred from using the Service under applicable Indian or international law</li>
      </ul>

      <h2>2. The directory content</h2>
      <p>
        The directory is editorial content. Curator takes, &ldquo;use this if&rdquo; clauses, and
        &ldquo;skip if&rdquo; clauses are <strong>opinions</strong>, not professional advice. We
        believe them at the time of writing, but software changes and so do our opinions. Always
        verify a tool&apos;s suitability for your specific use case before committing to it in
        production.
      </p>
      <p>
        Repository metadata (stars, forks, license, etc.) is sourced from GitHub and may be up to
        24 hours stale. We are not responsible for inaccuracies in GitHub&apos;s data.
      </p>

      <h2>3. Accounts</h2>
      <ul>
        <li>You are responsible for safeguarding your login credentials</li>
        <li>You must notify us immediately of any unauthorised access — <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
        <li>One account per person unless you have an explicit business agreement</li>
        <li>You may delete your account at any time — see <a href="/privacy">Privacy Policy</a></li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Scrape the site at a rate that degrades service for other users</li>
        <li>Reverse-engineer, decompile, or otherwise extract source code</li>
        <li>Resell or republish curator takes without explicit written permission</li>
        <li>Use the Service to distribute malware, spam, or unlawful content</li>
        <li>Attempt to bypass paywalls, rate limits, or security controls</li>
        <li>Impersonate any person or misrepresent your affiliation with any organisation</li>
      </ul>

      <h2>5. Premium membership</h2>
      <ul>
        <li>Pricing is <strong>₹99 (INR)</strong> for India or <strong>$2.99 (USD)</strong> internationally — single one-time payment</li>
        <li>All Indian transactions are processed in INR via <strong>Razorpay</strong>; international transactions in USD via the same Razorpay merchant account where supported</li>
        <li>Payment is one-time and grants <strong>lifetime access</strong> to premium content as it exists today and in the future</li>
        <li>&ldquo;Lifetime&rdquo; means the operational life of the Service. If we cease operations, we will provide at least 30 days&apos; notice and a data export</li>
        <li>Refunds are governed by the <a href="/refund">Refund Policy</a></li>
        <li>You may not share premium credentials. Detected abuse will result in cancellation without refund</li>
      </ul>

      <h2>6. Sponsored listings</h2>
      <ul>
        <li>Sponsored slots are clearly labelled and never displace honest editorial takes</li>
        <li>Sponsors may not buy positive curator takes — we write what we think regardless of payment</li>
        <li>Sponsorship invoices are issued via Razorpay; GSTIN invoicing is available for Indian business customers</li>
        <li>Minimum sponsorship term is 1 month; cancellation policy applies as published at time of purchase</li>
        <li>We reserve the right to refuse any sponsorship that conflicts with our editorial standards</li>
      </ul>

      <h2>7. User-submitted content</h2>
      <p>
        When you submit content (newsletter signup, corrections, comments, job posts), you grant us
        a non-exclusive, royalty-free, worldwide licence to use, store, display, and reproduce that
        content for the purpose of operating and improving the Service. You retain ownership.
      </p>

      <h2>8. Intellectual property</h2>
      <ul>
        <li>Curator takes, editorial content, and the site design are © StackPicks</li>
        <li>The directory format and category taxonomy are © StackPicks</li>
        <li>Repository metadata is owned by GitHub Inc. and its respective project maintainers</li>
        <li>Open-source tools listed here remain governed by their own licences (visible on each repo page)</li>
      </ul>

      <h2>9. Disclaimers</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
        kind, express or implied. We do not warrant that:
      </p>
      <ul>
        <li>The Service will be uninterrupted, secure, or error-free</li>
        <li>Curator takes will be accurate, current, or suitable for your purpose</li>
        <li>Any tool listed will work as described by its maintainers</li>
        <li>Outbound links will lead to safe, legal, or operational destinations</li>
      </ul>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our aggregate liability for any claim arising from
        your use of the Service is limited to the amount you paid us in the 12 months preceding the
        claim, or ₹5,000, whichever is greater. We are not liable for indirect, incidental,
        consequential, or punitive damages.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless StackPicks, its operators, and contributors from
        any claims arising out of (a) your use of the Service, (b) your violation of these Terms,
        or (c) your violation of any third-party rights.
      </p>

      <h2>12. Termination</h2>
      <p>
        We may suspend or terminate your access for breach of these Terms, suspected fraud, or any
        activity that risks the integrity of the Service. Premium members may receive a pro-rated
        refund at our discretion if termination is not due to their fault.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms. Material changes will be announced 30 days in advance via the
        newsletter and a site banner. Continued use after the change date constitutes acceptance.
      </p>

      <h2>14. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute will be subject to the
        exclusive jurisdiction of the courts at Gurgaon, Haryana, India.
      </p>

      <h2>15. Contact</h2>
      <p>
        For any question about these Terms: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>,{' '}
        <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>.
      </p>
    </LegalPage>
  );
}
