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

          {/* Blog link — Meta IG automation + Private Reply API + ad MCPs */}
          <Link
            href="/autodm/blog"
            className="text-xs text-muted hover:text-text px-3 py-1.5 rounded-full transition hidden sm:inline-block"
          >
            Blog
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
        <div className="max-w-6xl mx-auto px-4 py-8 text-xs text-muted flex flex-wrap items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} StackPicks AutoDM ·{' '}
            <a href="/autodm/terms" className="hover:text-text">Terms</a> ·{' '}
            <a href="/autodm/privacy" className="hover:text-text">Privacy</a> ·{' '}
            <a href="/autodm/data-deletion" className="hover:text-text">Delete data</a>
          </div>
          <a
            href="https://stackpicks.dev"
            className="inline-flex items-center gap-1 hover:text-text"
            target="_blank" rel="noopener"
          >
            Powered by stackpicks.dev <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </>
  );
}
