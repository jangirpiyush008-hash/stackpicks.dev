import { LegalPage } from '../../components/LegalPage';
import { CONTACT } from '@stackpicks/core/constants';
import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Contact us',
  description: 'Reach the StackPicks team. Email, phone, response times — no contact-form gauntlet.',
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact us" lastUpdated="21 May 2026">
      <p className="text-lg text-text">
        Direct lines. No support ticket system. No chat-bot pretending to be a human.
      </p>

      <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
        <a
          href={`mailto:${CONTACT.email}`}
          className="group rounded-xl border border-border bg-surface/40 p-6 hover:border-accent transition"
        >
          <div className="flex items-center gap-2 text-muted mb-3 group-hover:text-accent transition">
            <Mail className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Email</span>
          </div>
          <div className="text-lg font-semibold text-text break-all">{CONTACT.email}</div>
          <p className="text-sm text-muted mt-2">
            For: questions, corrections, sponsor enquiries, refund requests, partnerships, takedown notices.
          </p>
        </a>

        <a
          href={`tel:${CONTACT.phoneE164}`}
          className="group rounded-xl border border-border bg-surface/40 p-6 hover:border-accent transition"
        >
          <div className="flex items-center gap-2 text-muted mb-3 group-hover:text-accent transition">
            <Phone className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Phone</span>
          </div>
          <div className="text-lg font-semibold text-text">{CONTACT.phone}</div>
          <p className="text-sm text-muted mt-2">
            Voice or WhatsApp. For urgent issues — billing, payment failure, account access.
          </p>
        </a>
      </div>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        <div className="rounded-xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-wider">Hours</span>
          </div>
          <p className="text-sm text-text">{CONTACT.hours}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <MessageCircle className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-wider">Response time</span>
          </div>
          <p className="text-sm text-text">We reply {CONTACT.responseTime}.</p>
        </div>
      </div>

      <h2>Before you write — quick links</h2>
      <ul>
        <li><strong>Refund request</strong> — see the <a href="/refund">refund policy</a> and email with your Razorpay payment ID</li>
        <li><strong>Sponsor a category or homepage slot</strong> — email with the category and your company name; we&apos;ll send the spec</li>
        <li><strong>Correction on a curator take</strong> — paste the repo slug and a one-line reason; we re-verify within 48 hours</li>
        <li><strong>Takedown / DMCA</strong> — email with the URL and the legal basis; we respond within 5 business days</li>
        <li><strong>Press / interview / podcast</strong> — email with the publication and your deadline</li>
      </ul>

      <h2>Where we operate</h2>
      <p>
        StackPicks is operated from India. All transactions are billed in Indian Rupees (INR) for
        domestic customers via Razorpay. International customers can pay via the USD equivalent at
        checkout. GSTIN invoices are available on request for Indian business customers.
      </p>

      <h2>What we don&apos;t do over phone or email</h2>
      <ul>
        <li>Share user data, payment details, or account credentials</li>
        <li>Process payments outside Razorpay (we will never ask for card numbers on a call)</li>
        <li>Offer paid SEO bumps for sponsored repos — Google policy violation, and bad faith</li>
      </ul>
    </LegalPage>
  );
}
