import { LegalPage } from '../../components/LegalPage';
import { Sparkles, Compass, Hammer, ScrollText } from 'lucide-react';

export const metadata = {
  title: 'About — why this directory exists',
  description: 'The story behind StackPicks: opinionated open-source curation for builders who are tired of GitHub trending pages.',
};

export default function AboutPage() {
  return (
    <LegalPage title="A directory built by builders, for builders." lastUpdated="21 May 2026">
      <p className="text-lg leading-relaxed text-text">
        Every dev tools list on the internet sorts by GitHub stars. We don&apos;t.
      </p>

      <h2>The honest reason this exists</h2>
      <p>
        Most directories are scraping operations. Bots pull repository metadata, sort by popularity,
        slap on some Tailwind, and call it a product. The information density is high but the
        signal-to-noise ratio is brutal. You learn that a tool has 30k stars. You don&apos;t learn
        whether you should use it.
      </p>
      <p>
        StackPicks is the directory we wished existed when we were shipping our first SaaS at 2 AM
        and Stack Overflow had run out of opinions. Every entry here has been read, used, broken,
        and given a take. Some takes are short. Some are blunt. All of them tell you what we&apos;d
        actually do — not what gets us affiliate commissions.
      </p>

      <h2>What you&apos;ll find here</h2>
      <ul>
        <li><strong>104+ curated repos</strong> across 22 categories — UI, auth, payments, AI, animation, the boring middleware no one writes about</li>
        <li><strong>A &ldquo;use this if&rdquo; clause</strong> on every entry, so you can match a tool to a real situation</li>
        <li><strong>A &ldquo;skip if&rdquo; clause</strong>, because half of good engineering is knowing what to leave out</li>
        <li><strong>Categories that match how builders actually search</strong> — not how Google indexes them</li>
        <li><strong>Live GitHub data</strong>, refreshed nightly, so stars and last-push dates are never stale</li>
      </ul>

      <h2>What you won&apos;t find</h2>
      <ul>
        <li>SEO-stuffed comparison tables written by someone who&apos;s never opened the docs</li>
        <li>&ldquo;Top 10&rdquo; clickbait recycled from last year&apos;s rankings</li>
        <li>Sponsored placements pretending to be neutral picks (sponsored slots are clearly labelled)</li>
        <li>Vague praise like &ldquo;robust&rdquo; or &ldquo;scalable&rdquo; without a concrete trade-off</li>
        <li>A pop-up newsletter modal that follows you down the scroll</li>
      </ul>

      <h2>Who we&apos;re for</h2>
      <p>
        Solo builders, indie hackers, weekend hackers, agency engineers, and anyone who has ever
        spent a Saturday evaluating five state management libraries before realising they should
        have just used the boring one. If you&apos;re building something — whether it&apos;s a SaaS,
        a side project, a portfolio app, or a tool only your team will ever see — this directory
        is calibrated for you.
      </p>

      <h2>The India context</h2>
      <p>
        We&apos;re built in India and we don&apos;t hide it. Pricing is in INR. Payments run on
        Razorpay because Stripe still doesn&apos;t serve Indian businesses cleanly. The Mumbai
        edge serves Indian readers in milliseconds. When a tool plays well with the Indian stack —
        Razorpay, UPI, GSTIN, IST timestamps — we say so. That doesn&apos;t mean we exclude the
        rest of the world; it just means we don&apos;t pretend US-only assumptions are universal.
      </p>

      <h2>How we make money</h2>
      <p>
        Five rails, all labelled, none cloaked:
      </p>
      <ol>
        <li><strong>Sponsored listings</strong> — labelled clearly, never replace an honest take</li>
        <li><strong>Affiliate links</strong> — only where the tool is one we&apos;d recommend anyway</li>
        <li><strong>Premium membership</strong> — ₹99 one-time, lifetime access, deeper collections + weekly newsletter</li>
        <li><strong>Newsletter sponsorships</strong> — manual, clearly disclosed</li>
        <li><strong>Job board</strong> — flat fee, no exclusivity, no spam</li>
      </ol>
      <p>
        Every monetisation line is wired so we can keep the directory free for readers. If the
        directory ever stops being honest, we&apos;ve lost the only moat that matters.
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
        Questions, corrections, a take you disagree with? The <a href="/contact">contact page</a>
        {' '}has the real email and phone. We read every message.
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
