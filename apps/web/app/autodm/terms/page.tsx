// AutoDM Terms of Service — lives at autodm.stackpicks.dev/terms (middleware
// rewrites /terms -> /autodm/terms on the subdomain).

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Terms of Service — StackPicks AutoDM',
  description: 'The terms governing your use of StackPicks AutoDM, the Instagram comment-to-DM automation product.',
};

export default function AutoDmTermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/autodm" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">AutoDM Terms of Service</h1>
        <p className="text-xs text-muted font-mono">Last updated: 18 June 2026</p>
      </header>
      <article className="legal-prose">
        <p>
          These Terms govern your use of <strong>StackPicks AutoDM</strong> (&ldquo;AutoDM&rdquo;,
          &ldquo;the Service&rdquo;), an Instagram comment-to-DM automation tool operated by
          Piyush Jangir, a sole proprietorship based in India. By connecting your Instagram account
          you agree to these Terms. Questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>

        <h2>1. What the Service does</h2>
        <p>
          AutoDM watches comments on your Instagram posts, Reels, and Live broadcasts. When a comment
          matches a keyword rule you create, AutoDM sends a direct message and/or a public reply on
          your behalf, using Meta&apos;s official Instagram Graph API. You define the rules, the
          message content, and the links sent.
        </p>

        <h2>2. Eligibility and account</h2>
        <ul>
          <li>You must own or be authorised to manage the Instagram Professional (Business or Creator) account you connect.</li>
          <li>You must be at least 18 years old and able to enter a binding contract.</li>
          <li>You are responsible for the rules you configure and the messages they send.</li>
        </ul>

        <h2>3. Acceptable use</h2>
        <p>You agree <strong>not</strong> to use AutoDM to:</p>
        <ul>
          <li>Send spam, bulk unsolicited messages, or content that violates the{' '}
            <a href="https://help.instagram.com/581066165581870" target="_blank" rel="noopener noreferrer">Instagram Community Guidelines</a>{' '}
            or <a href="https://www.facebook.com/legal/terms" target="_blank" rel="noopener noreferrer">Meta Terms</a>.</li>
          <li>Distribute illegal, deceptive, harmful, hateful, or infringing content.</li>
          <li>Impersonate others or misrepresent your offer.</li>
          <li>Circumvent Instagram&apos;s rate limits or automation policies.</li>
        </ul>
        <p>
          AutoDM includes safeguards (rate limits, account warming, spam-pattern checks) to protect
          your account, but <strong>you remain responsible</strong> for complying with Meta&apos;s
          policies. We may suspend any account that abuses the Service.
        </p>

        <h2>4. Plans, billing, and cancellation</h2>
        <ul>
          <li>Paid plans are billed monthly in INR via Razorpay. Prices are shown on the pricing section of the landing page.</li>
          <li>You can cancel anytime from your dashboard. Cancellation takes effect at the end of the current billing cycle; you keep access until then.</li>
          <li>Because the Service is delivered continuously, we do not provide pro-rated refunds for partial periods unless required by law. See the <a href="https://stackpicks.dev/refund" target="_blank" rel="noopener noreferrer">refund policy</a>.</li>
        </ul>

        <h2>5. Your content and Meta&apos;s role</h2>
        <p>
          You retain ownership of your messages, links, and brand. AutoDM acts only on the rules you
          set. Instagram and Meta are independent platforms; we are not affiliated with, endorsed by,
          or operated by Meta. Your use of Instagram is also governed by Meta&apos;s own terms.
        </p>

        <h2>6. Availability and disclaimer</h2>
        <p>
          The Service depends on the Meta Instagram Graph API, which can change or impose limits
          outside our control. We provide the Service &ldquo;as is&rdquo; and do not guarantee specific
          delivery rates, click-through rates, or uninterrupted operation. To the maximum extent
          permitted by law, our liability is limited to the fees you paid in the preceding three months.
        </p>

        <h2>7. Termination</h2>
        <p>
          You may stop using AutoDM and disconnect at any time. We may suspend or terminate access for
          breach of these Terms or Meta&apos;s policies. On termination we delete your access token
          immediately and remaining data per our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>8. Governing law</h2>
        <p>
          These Terms are governed by the laws of India. Disputes are subject to the courts of the
          operator&apos;s jurisdiction in India.
        </p>

        <h2>9. Contact</h2>
        <p>
          Operator: Piyush Jangir (sole proprietorship), India. Email{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> — we respond {CONTACT.responseTime}.
        </p>

        <p className="text-sm text-muted">
          See also the <Link href="/privacy">AutoDM Privacy Policy</Link>.
        </p>
      </article>
    </div>
  );
}
