import { getSupabaseServer } from './supabase-server';

/**
 * Returns true if the signed-in user's email matches the ADMIN_EMAIL env var.
 * Used to gate /admin and all /api/admin/* routes.
 *
 * Set ADMIN_EMAIL=stackpicks.dev@gmail.com in Railway (and locally in .env.local).
 * Multiple admins: comma-separated list, e.g. "owner@a.com,partner@b.com".
 */
export async function isAdmin(): Promise<{ ok: boolean; email: string | null }> {
  try {
    const allowList = (process.env.ADMIN_EMAIL ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowList.length === 0) return { ok: false, email: null };

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return { ok: false, email: null };

    const userEmail = user.email.toLowerCase();
    return { ok: allowList.includes(userEmail), email: user.email };
  } catch {
    return { ok: false, email: null };
  }
}
