import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, CONTACT, ENTITY } from '@stackpicks/core/constants';
import { Mail, Phone } from 'lucide-react';
import { HeaderSearchSlot } from '../components/HeaderSearchSlot';
import { HeaderNav } from '../components/HeaderNav';
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
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 md:gap-4">
            <Link href="/preview" className="font-mono font-bold tracking-tight text-base md:text-lg shrink-0">
              stackpicks<span className="text-accent">.dev</span>
            </Link>
            <HeaderSearchSlot />
            <HeaderNav />
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
