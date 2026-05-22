import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, CONTACT, ENTITY } from '@stackpicks/core/constants';
import { organizationJsonLd, websiteJsonLd } from '@stackpicks/core/seo';
import { Mail, Phone } from 'lucide-react';
import { HeaderSearchSlot } from '../components/HeaderSearchSlot';
import { HeaderNav } from '../components/HeaderNav';
import { HideOnAdmin } from '../components/HideOnAdmin';
import { NewsletterPopup } from '../components/NewsletterPopup';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Curated open-source dev tools, stacks & skill tracks`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: ENTITY.operator }],
  keywords: [
    'open source tools',
    'open source dev tools',
    'best open source libraries',
    'open source alternatives',
    'open source stack',
    'AI dev tools',
    'GitHub starred tools',
    'shadcn',
    'Next.js stack',
    'lifetime developer tools',
    'curated GitHub repos',
    'open source directory',
    'open source for builders',
    'Indian dev directory',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_IN',
    url: SITE.url,
  },
  twitter: { card: 'summary_large_image', site: SITE.twitter },
  alternates: { canonical: SITE.url },
  category: 'technology',
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Site-wide structured data — appears on every page, helps SERP sitelinks + brand */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <HideOnAdmin>
        <header className="border-b border-border sticky top-0 z-40 bg-bg/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 md:gap-4">
            <Link href="/preview" className="font-mono font-bold tracking-tight text-base md:text-lg shrink-0">
              stackpicks<span className="text-accent">.dev</span>
            </Link>
            <HeaderSearchSlot />
            <HeaderNav />
          </div>
        </header>
        </HideOnAdmin>

        <main className="flex-1">{children}</main>

        <HideOnAdmin>
        <footer className="border-t border-border mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* SEO link block — internal links from every page → boosts crawl + topical authority */}
            <div className="mb-10 pb-10 border-b border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
                <div>
                  <div className="font-mono uppercase tracking-wider text-text/80 mb-3">Popular categories</div>
                  <ul className="space-y-1.5">
                    <li><Link href="/category/ui-components" className="text-muted hover:text-accent transition">UI components</Link></li>
                    <li><Link href="/category/animation" className="text-muted hover:text-accent transition">Animation libraries</Link></li>
                    <li><Link href="/category/ai-tooling" className="text-muted hover:text-accent transition">AI tooling</Link></li>
                    <li><Link href="/category/authentication" className="text-muted hover:text-accent transition">Authentication</Link></li>
                    <li><Link href="/category/forms" className="text-muted hover:text-accent transition">Forms + validation</Link></li>
                    <li><Link href="/category/state-management" className="text-muted hover:text-accent transition">State management</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-mono uppercase tracking-wider text-text/80 mb-3">Stack bundles</div>
                  <ul className="space-y-1.5">
                    <li><Link href="/build/ship-a-saas" className="text-muted hover:text-accent transition">Ship a SaaS</Link></li>
                    <li><Link href="/build/ai-agent" className="text-muted hover:text-accent transition">AI agent stack</Link></li>
                    <li><Link href="/build/mobile-app" className="text-muted hover:text-accent transition">Mobile app stack</Link></li>
                    <li><Link href="/build/web-scraper" className="text-muted hover:text-accent transition">Web scraper</Link></li>
                    <li><Link href="/build/chrome-extension" className="text-muted hover:text-accent transition">Chrome extension</Link></li>
                    <li><Link href="/build/e-commerce" className="text-muted hover:text-accent transition">E-commerce</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-mono uppercase tracking-wider text-text/80 mb-3">Skill tracks</div>
                  <ul className="space-y-1.5">
                    <li><Link href="/skills/ai-ml" className="text-muted hover:text-accent transition">AI / ML toolkit</Link></li>
                    <li><Link href="/skills/marketing" className="text-muted hover:text-accent transition">Marketing OSS</Link></li>
                    <li><Link href="/skills/data-analytics" className="text-muted hover:text-accent transition">Data + analytics</Link></li>
                    <li><Link href="/skills/devops-infra" className="text-muted hover:text-accent transition">DevOps + infra</Link></li>
                    <li><Link href="/skills/automation" className="text-muted hover:text-accent transition">Automation</Link></li>
                    <li><Link href="/skills/founder-os" className="text-muted hover:text-accent transition">Founder OS</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-mono uppercase tracking-wider text-text/80 mb-3">Get started</div>
                  <ul className="space-y-1.5">
                    <li><Link href="/preview" className="text-muted hover:text-accent transition">Browse 100+ tools</Link></li>
                    <li><Link href="/blog" className="text-muted hover:text-accent transition">Blog · stack guides</Link></li>
                    <li><Link href="/alternatives" className="text-muted hover:text-accent transition">SaaS alternatives</Link></li>
                    <li><Link href="/best" className="text-muted hover:text-accent transition">Best-of rankings</Link></li>
                    <li><Link href="/github" className="text-muted hover:text-accent transition">Best GitHub repos</Link></li>
                    <li><Link href="/awesome" className="text-muted hover:text-accent transition">Awesome lists</Link></li>
                    <li><Link href="/self-hosted" className="text-muted hover:text-accent transition">Self-hosted</Link></li>
                    <li><Link href="/migrate" className="text-muted hover:text-accent transition">Migration guides</Link></li>
                    <li><Link href="/for" className="text-muted hover:text-accent transition">For your team</Link></li>
                    <li><Link href="/compare" className="text-muted hover:text-accent transition">Open-source comparisons</Link></li>
                    <li><Link href="/build" className="text-muted hover:text-accent transition">Pick a stack</Link></li>
                    <li><Link href="/skills" className="text-muted hover:text-accent transition">By discipline</Link></li>
                    <li><Link href="/how-to-use" className="text-muted hover:text-accent transition">AI agent setup</Link></li>
                    <li><Link href="/pricing" className="text-muted hover:text-accent transition">Pricing</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
              <div className="col-span-2 md:col-span-2">
                <div className="font-mono font-bold tracking-tight text-lg mb-2">
                  stackpicks<span className="text-accent">.dev</span>
                </div>
                <p className="text-sm text-muted max-w-xs leading-relaxed">
                  A paid digital directory service for software builders. Curated open-source
                  tools, analyst takes, ready-to-ship stack bundles.
                </p>
                <div className="mt-5 space-y-2 text-xs">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-2 text-muted hover:text-accent transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneE164}`}
                    className="flex items-center gap-2 text-muted hover:text-accent transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {CONTACT.phone}
                  </a>
                </div>
              </div>

              <FooterCol title="Product">
                <FooterLink href="/build">Bundles</FooterLink>
                <FooterLink href="/preview">Directory</FooterLink>
                <FooterLink href="/how-to-use">How it works</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </FooterCol>

              <FooterCol title="Company">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/security">Security</FooterLink>
                <FooterLink href="/category/ui-components">Categories</FooterLink>
              </FooterCol>

              <FooterCol title="Legal">
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/refund">Refunds</FooterLink>
                <FooterLink href="/shipping">Delivery</FooterLink>
                <FooterLink href="/international-payments">International payments</FooterLink>
              </FooterCol>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
              <div className="flex flex-col gap-1">
                <span>© {new Date().getFullYear()} {ENTITY.brand}. {ENTITY.fullDisclosure}</span>
                <span className="opacity-70">All payments processed securely by Razorpay (India) — PCI-DSS Level 1.</span>
              </div>
              <span className="font-mono">v0.1 · 100+ repos · 22 categories</span>
            </div>
          </div>
        </footer>
        </HideOnAdmin>

        {/* Newsletter signup — 30s delay + exit-intent triggered; hides on admin/auth */}
        <NewsletterPopup />
      </body>
    </html>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-text/80 mb-3">{title}</div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted hover:text-accent transition">
        {children}
      </Link>
    </li>
  );
}
