'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { GeoPrice } from './GeoPrice';

const LINKS = [
  { href: '/build', label: 'Build' },
  { href: '/skills', label: 'Skills' },
  { href: '/preview', label: 'Browse' },
  { href: '/how-to-use', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
];

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center gap-5 text-sm text-muted shrink-0">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-text transition">
            {l.label}
          </Link>
        ))}
        <Link href="/login" className="hover:text-text transition">
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-3 py-1.5 rounded bg-accent text-bg font-semibold hover:opacity-90 transition whitespace-nowrap"
        >
          Get <GeoPrice />
        </Link>
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
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-text/90 hover:text-accent transition py-1.5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-base text-text/90 hover:text-accent transition py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-lg bg-accent text-bg font-semibold text-center hover:opacity-90 transition"
            >
              Get lifetime — <GeoPrice />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
