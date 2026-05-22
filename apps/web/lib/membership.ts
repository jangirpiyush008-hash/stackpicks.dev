import { getSupabaseServer } from './supabase-server';
import { adminClient } from '@stackpicks/core/db';

/**
 * Returns true if the signed-in user has an active lifetime membership.
 *
 * Reads auth via the user-context client (which reads session cookies),
 * then queries premium_subscriptions via the SERVICE-ROLE client.
 * This bypasses RLS edge cases — paid users are never falsely shown as free.
 */
export async function getIsMember(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const admin = adminClient();
    const { data } = await admin
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
