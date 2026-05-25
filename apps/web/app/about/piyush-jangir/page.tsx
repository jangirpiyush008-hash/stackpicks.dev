import Link from 'next/link';
import type { Metadata } from 'next';
import { Github, Linkedin, Mail, Twitter, Briefcase, MapPin, BadgeCheck } from 'lucide-react';
import { buildMeta, breadcrumbJsonLd } from '@stackpicks/core/seo';
import { SITE } from '@stackpicks/core/constants';
import { BLOG_POSTS } from '../../../lib/blog';

export const metadata: Metadata = buildMeta({
  title: 'Piyush Jangir — Founder of StackPicks · Builder · Curator',
  description: 'Piyush Jangir is the founder of StackPicks — an opinionated directory of open-source dev tools. Self-taught builder shipping products and curator content since 2019. Based in Mumbai, India.',
  path: '/about/piyush-jangir',
});

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Piyush Jangir',
  url: `${SITE.url}/about/piyush-jangir`,
  image: 'https://github.com/jangirpiyush008-hash.png',
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'StackPicks',
    url: SITE.url,
  },
  sameAs: [
    'https://github.com/jangirpiyush008-hash',
    'https://www.linkedin.com/in/jangirpiyush008/',
    'https://stackpicks.dev',
  ],
  knowsAbout: [
    'Open-source software',
    'Next.js',
    'Supabase',
    'Razorpay',
    'TypeScript',
    'Model Context Protocol (MCP)',
    'AI coding tools',
    'Indie SaaS',
  ],
  alumniOf: 'Self-taught',
  nationality: { '@type': 'Country', name: 'India' },
  workLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' } },
  founder: { '@type': 'Organization', name: 'StackPicks', url: SITE.url },
};

export default function PiyushAboutPage() {
  // Show the most-read blog posts authored by Piyush
  const articles = BLOG_POSTS
    .slice()
    .sort((a, b) => b.monthly_searches - a.monthly_searches)
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Piyush Jangir', path: '/about/piyush-jangir' },
          ])),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-start gap-5 mb-6">
            <img
              src="https://github.com/jangirpiyush008-hash.png?size=160"
              alt="Piyush Jangir"
              width={96}
              height={96}
              className="rounded-full border-2 border-accent/40 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Piyush Jangir</h1>
                <BadgeCheck className="w-5 h-5 text-accent" />
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Founder of <Link href="/" className="text-accent hover:underline">StackPicks</Link> · Self-taught builder shipping products since 2019.
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted font-mono">
                <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> Builder &amp; curator</span>
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Mumbai, IN</span>
              </div>
            </div>
          </div>

          {/* Social links — sameAs targets for schema.org/Person */}
          <div className="flex flex-wrap gap-2">
            <a href="https://github.com/jangirpiyush008-hash" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface/40 hover:border-accent text-sm transition">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/jangirpiyush008/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface/40 hover:border-accent text-sm transition">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a href="https://twitter.com/jangirpiyush008" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface/40 hover:border-accent text-sm transition">
              <Twitter className="w-3.5 h-3.5" /> X / Twitter
            </a>
            <a href="mailto:stackpicks.dev@gmail.com" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface/40 hover:border-accent text-sm transition">
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          </div>
        </header>

        {/* Bio — long form, gives Google + AI engines explicit context for E-E-A-T */}
        <section className="prose-stackpicks max-w-none space-y-5 text-text leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight">About</h2>
          <p>
            I'm Piyush Jangir — a self-taught builder from Mumbai, India. I've been
            shipping products since 2019 across marketing, indie SaaS, and
            developer tooling.
          </p>
          <p>
            I founded <Link href="/" className="text-accent hover:underline">StackPicks</Link> in 2026
            — an opinionated directory of open-source dev tools with honest
            curator takes. The site indexes 165+ repos and 89 MCP servers, all
            reviewed personally with explicit "use this if / skip if" trade-offs.
          </p>
          <p>
            My day job is in growth and affiliate marketing for an Indian D2C platform
            — the experience of running paid + organic campaigns at scale informs
            how I think about builder products and SaaS economics.
          </p>

          <h2 className="text-2xl font-bold tracking-tight mt-10">What I write about</h2>
          <p>
            Opinionated takes on the open-source ecosystem, mostly for builders
            shipping production products in 2026. Topics include:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted">
            <li>AI coding tools (Cursor, Cline, Aider) and which to pick when</li>
            <li>Model Context Protocol (MCP) — what it is, which servers matter</li>
            <li>Open-source SaaS stacks built around Next.js + Supabase + Razorpay</li>
            <li>The honest cost comparison of self-hosting vs SaaS for Indian startups</li>
            <li>UI library trade-offs — shadcn vs Mantine vs MUI vs Radix</li>
          </ul>

          <h2 className="text-2xl font-bold tracking-tight mt-10">My editorial voice (the rules)</h2>
          <p>
            Curator takes follow strict editorial rules so the directory reads like
            one voice, not auto-generated SEO spam:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted">
            <li>No buzzwords (no "synergy", "10x", "growth hack", "disrupt", "leverage" as a verb).</li>
            <li>80–160 words per take. Brevity over completeness.</li>
            <li>Show specific trade-offs, not just praise.</li>
            <li>India-first context where it matters — Razorpay over Stripe for INR, Mumbai region defaults.</li>
            <li>No emoji in code or professional content.</li>
          </ul>
        </section>

        {/* Articles */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-5">Articles I've written</h2>
          <div className="space-y-3">
            {articles.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block p-4 rounded-lg border border-border hover:border-accent transition"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-1">{p.category}</div>
                <div className="font-semibold text-text mb-1">{p.title}</div>
                <div className="text-xs text-muted line-clamp-2">{p.excerpt}</div>
              </Link>
            ))}
          </div>
          <div className="mt-5 text-sm">
            <Link href="/blog" className="text-accent hover:underline">All posts →</Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-12 p-6 rounded-2xl border border-border bg-surface/30 text-center">
          <h2 className="text-xl font-bold mb-1">Want to get in touch?</h2>
          <p className="text-sm text-muted mb-4">
            Newsletter sponsorship, repo submissions, or just want to chat about open-source — drop an email.
          </p>
          <a href="mailto:stackpicks.dev@gmail.com" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition">
            <Mail className="w-4 h-4" />
            stackpicks.dev@gmail.com
          </a>
        </section>
      </div>
    </>
  );
}
