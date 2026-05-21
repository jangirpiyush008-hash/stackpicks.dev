import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { SITE, CONTACT } from '@stackpicks/core/constants';
import { Mail, Phone } from 'lucide-react';
import { RepoSearchBar } from '../components/RepoSearchBar';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Curated open-source dev tools`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', site: SITE.twitter },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <header className="border-b border-border sticky top-0 z-40 bg-bg/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/preview" className="font-mono font-bold tracking-tight text-lg shrink-0">
              stackpicks<span className="text-accent">.dev</span>
            </Link>
            <div className="flex-1 max-w-md">
              <RepoSearchBar compact />
            </div>
            <nav className="hidden md:flex items-center gap-5 text-sm text-muted shrink-0">
              <Link href="/preview" className="hover:text-text transition">Browse</Link>
              <Link href="/pricing" className="hover:text-text transition">Pricing</Link>
              <Link href="/about" className="hover:text-text transition">About</Link>
              <Link
                href="/pricing"
                className="px-3 py-1.5 rounded bg-accent text-bg font-semibold hover:opacity-90 transition"
              >
                Lifetime ₹99
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
              <div className="col-span-2 md:col-span-2">
                <div className="font-mono font-bold tracking-tight text-lg mb-2">
                  stackpicks<span className="text-accent">.dev</span>
                </div>
                <p className="text-sm text-muted max-w-xs leading-relaxed">
                  Opinionated open-source curation for builders. One paragraph per repo, every
                  curator take honest.
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
                <FooterLink href="/preview">Directory</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href={'/category/ui-components' as Route}>Categories</FooterLink>
                <FooterLink href="/contact">Sponsor</FooterLink>
              </FooterCol>

              <FooterCol title="Company">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/security">Security</FooterLink>
              </FooterCol>

              <FooterCol title="Legal">
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/refund">Refunds</FooterLink>
              </FooterCol>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
              <span>© {new Date().getFullYear()} {SITE.name}. Built in India. Payments by Razorpay.</span>
              <span className="font-mono">v0.1 · 100+ repos · 22 categories</span>
            </div>
          </div>
        </footer>
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

function FooterLink({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted hover:text-accent transition">
        {children}
      </Link>
    </li>
  );
}
