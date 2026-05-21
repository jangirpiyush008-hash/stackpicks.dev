import type { Metadata } from 'next';
import { SITE } from '@stackpicks/core/constants';
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
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-mono font-bold tracking-tight text-lg">
              stackpicks<span className="text-accent">.dev</span>
            </a>
            <nav className="flex items-center gap-6 text-sm text-muted">
              <a href="/category/ui-components" className="hover:text-text transition">Categories</a>
              <a href="/collections" className="hover:text-text transition">Collections</a>
              <a href="/jobs" className="hover:text-text transition">Jobs</a>
              <a href="/sponsor" className="hover:text-text transition">Sponsor</a>
              <a href="/premium" className="px-3 py-1.5 rounded bg-accent text-bg font-semibold hover:opacity-90 transition">
                Premium
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-muted flex justify-between">
            <span>© {new Date().getFullYear()} StackPicks. Built in India.</span>
            <div className="flex gap-4">
              <a href="/about" className="hover:text-text">About</a>
              <a href="/privacy" className="hover:text-text">Privacy</a>
              <a href="/terms" className="hover:text-text">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
