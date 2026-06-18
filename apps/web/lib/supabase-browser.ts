'use client';

import { createBrowserClient } from '@supabase/ssr';

// Share the session across stackpicks.dev + subdomains so one login works
// everywhere. Derived from the current hostname so localhost stays host-only.
function sharedCookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.location.hostname.endsWith('stackpicks.dev') ? '.stackpicks.dev' : undefined;
}

export function getSupabaseBrowser() {
  const domain = sharedCookieDomain();
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    domain ? { cookieOptions: { domain } } : undefined,
  );
}
