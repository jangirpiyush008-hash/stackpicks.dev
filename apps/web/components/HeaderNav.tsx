'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { UserMenu } from './UserMenu';

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
            <div className="mt-2 pt-2 border-t border-border">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
