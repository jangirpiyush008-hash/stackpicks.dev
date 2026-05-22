import { getSupabaseServer } from './supabase-server';

/**
 * Returns true if the signed-in user has an active lifetime membership.
 * RLS policy `premium_subs_select_own` lets a user read their own subscription row,
 * so the user-context client is sufficient — no service role needed.
 */
export async function getIsMember(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase
      .from('premium_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}
