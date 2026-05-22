'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides its children whenever the current path starts with /admin —
 * wraps the public header + footer so the admin console renders chromeless.
 */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
