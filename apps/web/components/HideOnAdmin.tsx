'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides its children whenever the current path starts with /admin
 * or /autodm — wraps the public header + footer so the admin console
 * AND the AutoDM standalone surface both render with no main-site chrome.
 *
 * /autodm has its own dedicated layout (apps/web/app/autodm/layout.tsx)
 * with a minimal header + sign-in button — visually it's a separate product.
 */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  if (pathname?.startsWith('/autodm')) return null;
  return <>{children}</>;
}
