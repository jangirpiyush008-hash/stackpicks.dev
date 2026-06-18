// AutoDM contact page — Razorpay + Google Ads compliance requires a clearly
// visible business contact surface. Mirrors the directory contact page but
// scoped to the AutoDM product.

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Clock, MapPin } from 'lucide-react';
import { CONTACT, ENTITY } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Contact us — StackPicks AutoDM',
  description: 'Reach the StackPicks AutoDM team for support, billing, partnerships, or data-deletion requests.',
};

export default function AutoDmContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Contact us</h1>
        <p className="text-muted">
          Direct lines. No ticket system. No chatbot pretending to be a human.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
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
            Support, billing, refund requests, sales / enterprise enquiries, partnerships, takedown notices.
          </p>
        </a>

        <a
          href={`tel:${CONTACT.phoneE164}`}
          className="group rounded-xl border border-border bg-surface/40 p-6 hover:border-accent transition"
        >
          <div className="flex items-center gap-2 text-muted mb-3 group-hover:text-accent transition">
            <Phone className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Phone · WhatsApp</span>
          </div>
          <div className="text-lg font-semibold text-text">{CONTACT.phone}</div>
          <p className="text-sm text-muted mt-2">
            Urgent only — payment failures, account lockout, suspected unauthorised access.
          </p>
        </a>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-wider">Hours</span>
          </div>
          <p className="text-sm text-text">{CONTACT.hours}</p>
          <p className="text-xs text-muted mt-1">Response time: {CONTACT.responseTime}.</p>
        </div>
        <div className="rounded-xl border border-border bg-surface/40 p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-wider">Operating entity</span>
          </div>
          <p className="text-sm text-text">StackPicks</p>
          <p className="text-xs text-muted mt-1">{ENTITY.form}, based in {ENTITY.jurisdiction}.</p>
        </div>
      </div>

      <article className="legal-prose">
        <h2>Best email subject lines (so we route faster)</h2>
        <ul>
          <li><strong>Billing</strong> — &ldquo;AutoDM billing — [Razorpay payment ID]&rdquo;</li>
          <li><strong>Refund</strong> — &ldquo;AutoDM refund request&rdquo; (see <Link href="/refund">refund policy</Link>)</li>
          <li><strong>Sales / Enterprise</strong> — &ldquo;AutoDM Enterprise enquiry&rdquo;</li>
          <li><strong>Bug or outage</strong> — &ldquo;AutoDM bug — [short description]&rdquo;</li>
          <li><strong>Data deletion</strong> — use the self-serve form at <Link href="/data-deletion">/data-deletion</Link>, or email &ldquo;AutoDM data deletion&rdquo;</li>
          <li><strong>Press / partnerships</strong> — &ldquo;AutoDM partnership&rdquo;</li>
        </ul>

        <h2>What we will not do</h2>
        <ul>
          <li>Send unsolicited sales emails after support requests.</li>
          <li>Ask for your Instagram password — AutoDM only uses Meta&apos;s official OAuth flow.</li>
          <li>Charge for &ldquo;onboarding&rdquo; or &ldquo;activation&rdquo; outside the published plan price.</li>
        </ul>

        <h2>Grievance officer</h2>
        <p>
          As required by the Information Technology Rules, 2021, AutoDM&apos;s grievance officer is
          <strong> {ENTITY.grievanceOfficer}</strong>, reachable at the same email and phone above.
          We acknowledge complaints within 24 hours and resolve them within 15 days.
        </p>
      </article>
    </div>
  );
}
