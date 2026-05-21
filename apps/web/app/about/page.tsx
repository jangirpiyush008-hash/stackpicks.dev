import { LegalPage } from '../../components/LegalPage';
import { Sparkles, Compass, Hammer, ScrollText } from 'lucide-react';
import { ENTITY, CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'About — an educational directory for builders',
  description: 'StackPicks is a learning resource for software builders: curated open-source tools, honest takes on each, and step-by-step build-with-AI guides.',
};

export default function AboutPage() {
  return (
    <LegalPage title="A learning resource built by builders, for builders." lastUpdated="21 May 2026">
      <p className="text-lg leading-relaxed text-text">
        Every dev tools list on the internet sorts by GitHub stars. We don&apos;t. We teach you
        what to ship with — and why.
      </p>

      <h2>What StackPicks is</h2>
      <p>
        StackPicks is an <strong>educational platform for software builders</strong>. It teaches
        you which open-source tools to use for each part of your stack, when to use them, when to
        skip them, and exactly how to wire them together with an AI coding agent. Think of it as
        a curriculum disguised as a directory.
      </p>
      <p>
        Most dev directories are scraping operations. Bots pull repository metadata, sort by
        popularity, slap on some Tailwind, and call it a product. You learn a tool has 30k stars.
        You don&apos;t learn whether you should use it. We do the second part — that&apos;s the
        education.
      </p>

      <h2>What you&apos;ll learn here</h2>
      <ul>
        <li><strong>100+ curated lessons</strong> — one per open-source tool, across 22 stack categories (UI, auth, payments, AI, scraping, animation, and more)</li>
        <li><strong>13 build-with-AI guides</strong> — full-stack curriculum for shipping a SaaS, a mobile app, an AI agent, a scraper, an e-commerce store, an internal dashboard, and more</li>
        <li><strong>The &ldquo;use this if&rdquo; clause</strong> on every tool — applied judgment, the part textbooks skip</li>
        <li><strong>The &ldquo;skip if&rdquo; clause</strong>, because half of engineering education is learning what to leave out</li>
        <li><strong>Step-by-step AI-agent integration guides</strong> — how to feed each tool to Claude Code, Cursor, Codex, and others on Mac + Windows</li>
        <li><strong>Live, nightly-refreshed data</strong> so the curriculum never goes stale</li>
      </ul>

      <h2>What you won&apos;t find</h2>
      <ul>
        <li>SEO-stuffed comparison tables written by someone who&apos;s never opened the docs</li>
        <li>&ldquo;Top 10&rdquo; clickbait recycled from last year&apos;s rankings</li>
        <li>Sponsored placements pretending to be neutral picks (sponsored slots are clearly labelled)</li>
        <li>Vague praise like &ldquo;robust&rdquo; or &ldquo;scalable&rdquo; without a concrete trade-off</li>
        <li>A pop-up newsletter modal that follows you down the scroll</li>
      </ul>

      <h2>Who this is for</h2>
      <p>
        Self-taught developers, indie hackers, weekend builders, bootcamp grads, agency engineers,
        and anyone who has ever spent a Saturday evaluating five state-management libraries before
        realising they should have just used the boring one. If you&apos;re actively learning to
        ship — whether it&apos;s a SaaS, a side project, a portfolio app, or your first paid
        product — StackPicks is the syllabus that catches you up faster than any blog.
      </p>

      <h2>The India context</h2>
      <p>
        We&apos;re built in India and we don&apos;t hide it. Pricing is in INR. Payments run on
        Razorpay because Stripe still doesn&apos;t serve Indian businesses cleanly. The Mumbai
        edge serves Indian readers in milliseconds. When a tool plays well with the Indian stack —
        Razorpay, UPI, GSTIN, IST timestamps — we say so. That doesn&apos;t mean we exclude the
        rest of the world; it just means we don&apos;t pretend US-only assumptions are universal.
      </p>

      <h2>How the education is funded</h2>
      <p>
        Five revenue rails, all labelled, none cloaked:
      </p>
      <ol>
        <li><strong>Premium membership</strong> — ₹99 (or $2.99 intl) one-time, lifetime learning access. Unlocks the full curriculum, the deeper write-ups, and weekly long-form lessons.</li>
        <li><strong>Sponsored listings</strong> — labelled clearly, never replace an honest take</li>
        <li><strong>Affiliate links</strong> — only where the tool is one we&apos;d teach anyway</li>
        <li><strong>Newsletter sponsorships</strong> — manual, clearly disclosed</li>
        <li><strong>Job board</strong> — flat fee, no exclusivity, no spam</li>
      </ol>
      <p>
        The free tier stays free forever — a sample lesson per category is enough to evaluate the
        teaching style. Premium funds the deeper editorial work and keeps the open content honest.
      </p>

      <h2>The principles</h2>
      <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
        <Principle icon={<Compass className="w-5 h-5" />} title="Opinion over neutrality">
          Neutral takes are useless. Builders don&apos;t need another data dump — they need a
          recommendation with a clear &ldquo;but&rdquo;.
        </Principle>
        <Principle icon={<Hammer className="w-5 h-5" />} title="Ship before write">
          We don&apos;t list tools we haven&apos;t at least tried. If a take feels theoretical,
          it&apos;s probably wrong and we&apos;ll rewrite it.
        </Principle>
        <Principle icon={<ScrollText className="w-5 h-5" />} title="Trade-offs over hype">
          Every entry surfaces what&apos;s not great about the tool. If a take has no downside
          section, it&apos;s a sponsored pitch — and we mark those.
        </Principle>
        <Principle icon={<Sparkles className="w-5 h-5" />} title="Boring tech wins">
          The best stack is usually the dullest one. We bias toward boring-but-correct over
          novel-but-rough. New things have to earn their slot.
        </Principle>
      </div>

      <h2>What&apos;s next</h2>
      <p>
        The directory is the foundation. A weekly Sunday newsletter is next, then comparison
        deep-dives, then a job board for builder-shaped roles, then probably a mobile app once
        web traffic justifies it. Every step is calibrated to traffic, not to vibes — we&apos;d
        rather ship one good thing late than three thin things on time.
      </p>

      <p className="mt-10 text-sm">
        Questions, corrections, a take you disagree with? The <a href="/contact">contact page</a> has the real email and phone. We read every message.
      </p>

      <h2>Who runs this</h2>
      <p className="text-sm">
        {ENTITY.brand} is operated as a <strong>{ENTITY.form}</strong> by{' '}
        <strong>{ENTITY.operator}</strong>, based in {ENTITY.jurisdiction}. Customer support and
        legal contact: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{' '}
        <a href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</a>. All payments are processed in
        INR (or USD for international customers) via <strong>Razorpay</strong> — a PCI-DSS Level 1
        certified Indian payment processor.
      </p>
    </LegalPage>
  );
}

function Principle({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-2 text-accent mb-2">
        {icon}
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}
