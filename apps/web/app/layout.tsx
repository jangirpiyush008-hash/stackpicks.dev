import type { Metadata } from 'next';
import { SITE } from '@stackpicks/core/constants';
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
            <a href="/preview" className="font-mono font-bold tracking-tight text-lg shrink-0">
              stackpicks<span className="text-accent">.dev</span>
            </a>
            <div className="flex-1 max-w-md">
              <RepoSearchBar compact />
            </div>
            <nav className="hidden md:flex items-center gap-5 text-sm text-muted shrink-0">
              <a href="/preview" className="hover:text-text transition">Browse</a>
              <a href="/category/ui-components" className="hover:text-text transition">Categories</a>
              <a href="/sponsor" className="hover:text-text transition">Sponsor</a>
              <a href="/premium" className="px-3 py-1.5 rounded bg-accent text-bg font-semibold hover:opacity-90 transition">
                Premium
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-muted flex justify-between flex-wrap gap-2">
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
