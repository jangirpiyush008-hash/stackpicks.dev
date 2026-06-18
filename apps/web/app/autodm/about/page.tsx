// AutoDM about page. Google Ads compliance for billed services requires
// transparent "who is behind this business" content. Also useful for trust
// when creators are deciding whether to grant Instagram permissions.

import Link from 'next/link';
import { ArrowLeft, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { CONTACT, ENTITY } from '@stackpicks/core/constants';

export const metadata = {
  title: 'About — StackPicks AutoDM',
  description: 'Who builds and operates StackPicks AutoDM — and why we built an Instagram comment-to-DM tool for creators in India and beyond.',
};

export default function AutoDmAboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">About AutoDM</h1>
        <p className="text-muted">
          A small, focused tool that replies to every Instagram comment with a
          tailored DM — so creators don&apos;t lose leads at 2am.
        </p>
      </header>

      <article className="legal-prose">
        <h2>What AutoDM does</h2>
        <p>
          AutoDM listens for comments on your Instagram posts, Reels, and Lives. When a
          comment matches a rule you set (a keyword, a question, an intent), AutoDM
          replies in your voice — first as a comment reply, then as a direct message
          with the link or resource you promised. Four hours later, if the lead
          hasn&apos;t clicked, AutoDM sends one polite follow-up.
        </p>
        <p>
          Everything happens through Meta&apos;s official Instagram Graph API and the
          Private Replies API. No browser automation, no password sharing, no shadow
          accounts. We only access the permissions you authorize at sign-in.
        </p>

        <h2>Who builds it</h2>
        <p>
          AutoDM is built and operated by <strong>StackPicks</strong>, a {ENTITY.form} based in{' '}
          {ENTITY.jurisdiction}. The same team builds <a href="https://stackpicks.dev">StackPicks</a>,
          a curated directory of open-source developer tools. AutoDM is a focused product on the
          StackPicks platform aimed at creators and small businesses on Instagram.
        </p>
        <p>
          We are not a marketing agency, not a growth-hack shop, and not a third-party reseller.
          You pay us; we run the service; we answer the email. That&apos;s the whole company.
        </p>
        <p className="text-sm">
          Full operator details (legal entity, grievance officer) are listed on the{' '}
          <Link href="/contact">contact page</Link> as required by Indian e-commerce rules.
        </p>

        <div className="not-prose grid sm:grid-cols-3 gap-3 my-8">
          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <ShieldCheck className="w-5 h-5 text-accent mb-2" />
            <div className="text-sm font-semibold text-text mb-1">Meta-approved</div>
            <div className="text-xs text-muted">Built on the official Instagram Graph API. Reviewed under Meta&apos;s Business Login program.</div>
          </div>
          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <Zap className="w-5 h-5 text-accent mb-2" />
            <div className="text-sm font-semibold text-text mb-1">Sub-30s replies</div>
            <div className="text-xs text-muted">Comments are picked up via Meta webhooks; first DM goes out before the lead has scrolled past.</div>
          </div>
          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <MessageSquare className="w-5 h-5 text-accent mb-2" />
            <div className="text-sm font-semibold text-text mb-1">Your voice, not ours</div>
            <div className="text-xs text-muted">Rules are drafted with AI in your tone. You approve every template before it goes live.</div>
          </div>
        </div>

        <h2>Why we built this</h2>
        <p>
          Indian creators with 20k–500k followers were watching genuine leads bounce because
          they could not reply to every &ldquo;link please&rdquo; comment within an hour. Existing
          tools were either expensive Western SaaS billed in USD or DM blasters that risked
          getting accounts banned. AutoDM is the boring middle: small, in INR, Meta-approved,
          rate-limited to stay on the right side of Instagram&apos;s policies.
        </p>

        <h2>How we make money</h2>
        <p>
          Honest, boring subscription pricing in INR. See the <Link href="/pricing">pricing page</Link>.
          We do not sell ads, do not sell your data, and do not run an &ldquo;agency upsell&rdquo;.
          We have no investors and no quarterly growth targets — only direct paying customers
          and a refund policy that works.
        </p>

        <h2>What we will not do</h2>
        <ul>
          <li>Send DMs from your account without a rule you explicitly created.</li>
          <li>Touch any data outside what Meta&apos;s permissions explicitly grant us — see <Link href="/privacy">Privacy Policy</Link>.</li>
          <li>Lock you in. Cancel any time, export your contacts CSV, walk away.</li>
        </ul>

        <h2>Talk to us</h2>
        <p>
          Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br />
          Phone / WhatsApp: <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a><br />
          Hours: {CONTACT.hours}<br />
          Or read more on <Link href="/contact">the contact page</Link>.
        </p>
      </article>
    </div>
  );
}
