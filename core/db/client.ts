/**
 * Supabase client factories.
 * - browserClient: for client components, uses anon key (RLS enforced).
 * - serverClient: for server components/route handlers with user session.
 * - adminClient: service role, bypasses RLS. USE ONLY IN: cron jobs, webhooks, admin tasks.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

let _browser: SupabaseClient | null = null;

export function browserClient(): SupabaseClient {
  if (_browser) return _browser;
  _browser = createClient(
    assertEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL),
    assertEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY),
    {
      auth: { persistSession: true, autoRefreshToken: true },
    }
  );
  return _browser;
}

/**
 * Server-side admin client. Bypasses RLS — never expose to browser.
 * Use only in: cron handlers, webhooks, server actions that need elevated access.
 */
export function adminClient(): SupabaseClient {
  return createClient(
    assertEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL),
    assertEnv('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
