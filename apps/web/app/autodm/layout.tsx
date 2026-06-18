// Dedicated AutoDM layout — chromeless from the main site.
// Wraps all /autodm/* pages with an AutoDM-specific minimal header.
//
// The root layout hides its own main header + footer on /autodm (via
// components/HideOnAdmin.tsx), so this layout is the ONLY chrome the
// user sees on autodm.stackpicks.dev — the product feels standalone.

import Link from 'next/link';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase-server';
import { AutoDmHeaderUser } from '@/components/autodm/AutoDmHeaderUser';

export default async function AutoDmLayout({ children }: { children: React.ReactNode }) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Brand — links to landing on the SAME (sub)domain */}
          <Link href="/autodm" className="inline-flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono font-bold tracking-tight text-sm md:text-base">
              stackpicks<span className="text-accent">.dev</span>
              <span className="text-muted font-normal ml-1.5 text-xs hidden sm:inline">/ autodm</span>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Top-nav links — kept terse so the auth chip stays visible on mobile */}
          <Link
            href="/autodm/pricing"
            className="text-xs text-muted hover:text-text px-3 py-1.5 rounded-full transition hidden sm:inline-block"
          >
            Pricing
          </Link>
          <Link
            href="/autodm/blog"
            className="text-xs text-muted hover:text-text px-3 py-1.5 rounded-full transition hidden md:inline-block"
          >
            Blog
          </Link>
          <Link
            href="/autodm/contact"
            className="text-xs text-muted hover:text-text px-3 py-1.5 rounded-full transition hidden md:inline-block"
          >
            Contact
          </Link>

          {/* "Visit StackPicks" CTA — cross-link to the directory */}
          <a
            href="https://stackpicks.dev"
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex items-center gap-1 text-xs text-muted hover:text-text px-3 py-1.5 rounded-full border border-border transition"
          >
            Visit StackPicks <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Auth-aware actions: sign-in if anonymous, dashboard link + sign-out if logged in */}
          <AutoDmHeaderUser
            isAuthed={!!user}
            email={user?.email ?? null}
          />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-xs text-muted">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="text-text font-semibold mb-2">Product</div>
              <ul className="space-y-1.5">
                <li><Link href="/autodm" className="hover:text-text">How it works</Link></li>
                <li><Link href="/autodm/pricing" className="hover:text-text">Pricing</Link></li>
                <li><Link href="/autodm/dashboard" className="hover:text-text">Dashboard</Link></li>
                <li><Link href="/autodm/blog" className="hover:text-text">Blog</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-text font-semibold mb-2">Company</div>
              <ul className="space-y-1.5">
                <li><Link href="/autodm/about" className="hover:text-text">About</Link></li>
                <li><Link href="/autodm/contact" className="hover:text-text">Contact</Link></li>
                <li>
                  <a href="https://stackpicks.dev" target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-text">
                    StackPicks directory <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-text font-semibold mb-2">Legal</div>
              <ul className="space-y-1.5">
                <li><Link href="/autodm/terms" className="hover:text-text">Terms</Link></li>
                <li><Link href="/autodm/privacy" className="hover:text-text">Privacy</Link></li>
                <li><Link href="/autodm/refund" className="hover:text-text">Refund & cancellation</Link></li>
                <li><Link href="/autodm/shipping" className="hover:text-text">Service delivery</Link></li>
                <li><Link href="/autodm/data-deletion" className="hover:text-text">Delete data</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-text font-semibold mb-2">Support</div>
              <ul className="space-y-1.5">
                <li><a href="mailto:stackpicks.dev@gmail.com" className="hover:text-text break-all">stackpicks.dev@gmail.com</a></li>
                <li><a href="tel:+919667879848" className="hover:text-text">+91 96678 79848</a></li>
                <li className="text-muted/70">Mon–Fri, 10:00–18:00 IST</li>
              </ul>
            </div>
          </div>
          <div className="pt-5 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <div>© {new Date().getFullYear()} StackPicks AutoDM · Built in India 🇮🇳</div>
            <a
              href="https://stackpicks.dev"
              className="inline-flex items-center gap-1 hover:text-text"
              target="_blank" rel="noopener"
            >
              Powered by stackpicks.dev <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
