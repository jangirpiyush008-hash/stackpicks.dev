import { LegalPage } from '../../components/LegalPage';
import { Sparkles, Compass, Hammer, ScrollText } from 'lucide-react';
import { ENTITY, CONTACT, SITE } from '@stackpicks/core/constants';
import { breadcrumbJsonLd } from '@stackpicks/core/seo';

export const metadata = {
  title: 'About — a curated directory service for builders',
  description: 'StackPicks is a professional directory service for software builders. Paid lifetime membership unlocks curated open-source tools, analyst-grade takes, and ship-ready stack bundles.',
  alternates: { canonical: `${SITE.url}/about` },
};

// AboutPage schema — explicitly tells Google this is the brand's About page,
// which feeds knowledge-panel + brand SERP elements.
const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `About — ${SITE.name}`,
  url: `${SITE.url}/about`,
  description: 'StackPicks is a paid digital directory service for software builders. Curated open-source tools with honest takes, plus ship-ready stack bundles.',
  mainEntity: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    foundingDate: '2026-05',
    founder: { '@type': 'Person', name: ENTITY.operator, url: `${SITE.url}/about/piyush-jangir` },
    description: SITE.description,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ])),
        }}
      />
    <LegalPage title="A directory service built by builders, for builders." lastUpdated="21 May 2026">
      <p className="text-lg leading-relaxed text-text">
        Every dev tools list on the internet sorts by GitHub stars. We don&apos;t. We surface what
        you should actually ship with — and back it with an analyst&apos;s take.
      </p>

      <h2>What StackPicks is</h2>
      <p>
        StackPicks is a <strong>paid digital directory service</strong> for software builders.
        Members pay a one-time lifetime fee and get curated coverage of every open-source tool
        worth using, plus ready-to-ship stack bundles for every common project type, plus
        step-by-step integration guides for AI coding agents.
      </p>
      <p>
        Most dev directories are scraping operations — bots pull repository metadata, sort by
        popularity, slap on some Tailwind, and call it a product. You learn a tool has 30k stars.
        You don&apos;t learn whether you should use it. StackPicks does that second part —
        that&apos;s the service we charge for.
      </p>

      <h2>What members get</h2>
      <ul>
        <li><strong>100+ curated tool listings</strong> across 22 stack categories — UI, auth, payments, AI, scraping, animation, and the boring middleware no one writes about</li>
        <li><strong>13 ready-to-ship stack bundles</strong> for SaaS, mobile, AI agent, scraper, e-commerce, internal dashboard, content platform, automation, and more</li>
        <li><strong>The &ldquo;use this if&rdquo; clause</strong> on every tool — applied judgment, not generic praise</li>
        <li><strong>The &ldquo;skip if&rdquo; clause</strong>, because half of engineering is knowing what to leave out</li>
        <li><strong>Step-by-step AI-agent integration guides</strong> — how to feed each tool to Claude Code, Cursor, Codex on Mac + Windows</li>
        <li><strong>Live, nightly-refreshed GitHub data</strong> so the directory never goes stale</li>
        <li><strong>Members-only Discord</strong>, priority support, and weekly long-form analyses</li>
      </ul>

      <h2>What you won&apos;t find</h2>
      <ul>
        <li>SEO-stuffed comparison tables written by someone who&apos;s never opened the docs</li>
        <li>&ldquo;Top 10&rdquo; clickbait recycled from last year&apos;s rankings</li>
        <li>Sponsored placements pretending to be neutral picks (sponsored slots are clearly labelled)</li>
        <li>Vague praise like &ldquo;robust&rdquo; or &ldquo;scalable&rdquo; without a concrete trade-off</li>
        <li>A pop-up newsletter modal that follows you down the scroll</li>
      </ul>

      <h2>Who this service is for</h2>
      <p>
        Solo builders, indie hackers, agency engineers, and tech leads who want a vetted answer
        instead of a Reddit thread. If you spend a Saturday evaluating five state-management
        libraries before realising you should have just used the boring one — StackPicks gives
        you the answer up front. The membership pays for itself the first time it saves you a
        bad architectural choice.
      </p>

      <h2>The India context</h2>
      <p>
        We&apos;re built in India and we don&apos;t hide it. Pricing is in INR. Payments run on
        Razorpay because Stripe still doesn&apos;t serve Indian businesses cleanly. The Mumbai
        edge serves Indian readers in milliseconds. When a tool plays well with the Indian stack —
        Razorpay, UPI, GSTIN, IST timestamps — we say so. That doesn&apos;t mean we exclude the
        rest of the world; it just means we don&apos;t pretend US-only assumptions are universal.
      </p>

      <h2>How the service is funded</h2>
      <p>
        Five revenue rails, all labelled, none cloaked:
      </p>
      <ol>
        <li><strong>Lifetime membership</strong> — ₹99 (or $2.99 intl) one-time, lifetime access to the full directory, all bundles, and weekly long-form analyses. The primary revenue line.</li>
        <li><strong>Sponsored listings</strong> — labelled clearly, never replace an honest take</li>
        <li><strong>Affiliate links</strong> — only where the tool is one we&apos;d recommend anyway</li>
        <li><strong>Newsletter sponsorships</strong> — manual, clearly disclosed</li>
        <li><strong>Job board</strong> — flat fee per listing, no exclusivity, no spam</li>
      </ol>
      <p>
        A free sample tier stays free forever — six tool listings per category are enough to judge
        the curation quality. Paid membership funds the deeper editorial work and keeps the open
        content honest.
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
    </>
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
