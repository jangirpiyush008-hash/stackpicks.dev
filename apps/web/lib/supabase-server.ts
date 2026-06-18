import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Share the auth session across stackpicks.dev AND all subdomains
// (autodm.stackpicks.dev, etc.) so a single login works everywhere —
// each app just renders its own dashboard. Host-only on localhost.
export const SHARED_COOKIE_DOMAIN =
  process.env.NODE_ENV === 'production' ? '.stackpicks.dev' : undefined;

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                ...(SHARED_COOKIE_DOMAIN ? { domain: SHARED_COOKIE_DOMAIN } : {}),
              });
            });
          } catch {
            // Server Component context — can't set cookies here. That's fine —
            // session refresh is handled in middleware.
          }
        },
      },
    }
  );
}
