'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { getSupabaseBrowser } from '../lib/supabase-browser';

interface NavLink { href: string; label: string; authOnly?: boolean }

const LINKS: NavLink[] = [
  { href: '/build', label: 'Build' },
  { href: '/skills', label: 'Skills' },
  { href: '/tools', label: 'Tools' },
  // /mcp is the master landing page for the two-product story: StackPicks
  // Connect (one unified MCP) AND the 89-server directory. Public — anyone
  // can browse. Login only kicks in when they actually connect an app.
  { href: '/mcp', label: 'MCP' },
  { href: '/preview', label: 'Browse' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
];

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const pathname = usePathname();

  // Auth subscription — gates the MCP nav item. We initialise to null so
  // the first paint hides auth-only links; once Supabase resolves we
  // flip in either direction. Avoids the brief flash where MCP shows for
  // anonymous visitors during hydration.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const visibleLinks = LINKS.filter((l) => !l.authOnly || isAuthed);

  // Auto-close the mobile sheet whenever the route changes —
  // catches Sign-in clicks (in UserMenu) + any other future child links.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center gap-5 text-sm text-muted shrink-0">
        {visibleLinks.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-text transition">
            {l.label}
          </Link>
        ))}
        <UserMenu />
      </nav>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden p-2 -mr-2 text-muted hover:text-text transition shrink-0"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden fixed inset-x-0 top-[57px] z-30 border-b border-border bg-bg/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {visibleLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-text/90 hover:text-accent transition py-1.5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
