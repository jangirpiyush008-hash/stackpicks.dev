/**
 * Active-tenant resolver — shared across server pages, API routes, and
 * the dashboard switcher.
 *
 * A creator can own multiple autodm_tenants rows (Pro = 3 IGs, Agency =
 * 25). Without this helper every page hardcoded `tenants[0]` and the
 * paid IG slots were unreachable.
 *
 * Resolution order:
 *   1. autodm_active_tenant cookie value, IF that tenant_id belongs
 *      to the authenticated user (defence against cookie spoofing).
 *   2. Most-recently-created tenant owned by the user.
 *   3. null → caller should redirect to /connect.
 *
 * Cookie lifetime: 60 days, HTTP-only, same-site=lax. Set by the
 * switcher route; never trusted blindly — every read validates
 * ownership against the DB.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const ACTIVE_TENANT_COOKIE = 'autodm_active_tenant';
export const ACTIVE_TENANT_COOKIE_MAX_AGE = 60 * 24 * 60 * 60; // 60 days

interface TenantLite {
  id: string;
  ig_username: string | null;
  ig_business_id: string;
  plan_tier: string;
  is_active: boolean;
}

/**
 * Resolve the active tenant for this user. If `preferredId` is provided
 * (typically from cookies().get(ACTIVE_TENANT_COOKIE)) we honour it
 * after verifying ownership; otherwise fall back to most-recent.
 */
export async function getActiveTenant(
  supabase: SupabaseClient,
  userId: string,
  preferredId: string | null,
): Promise<{ tenant: TenantLite | null; all: TenantLite[] }> {
  const { data } = await supabase
    .from('autodm_tenants')
    .select('id, ig_username, ig_business_id, plan_tier, is_active')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: false });

  const all = (data ?? []) as TenantLite[];
  if (!all.length) return { tenant: null, all: [] };

  if (preferredId) {
    const match = all.find((t) => t.id === preferredId);
    if (match) return { tenant: match, all };
    // Cookie pointed at a tenant they no longer own (or never did) —
    // silently fall through to most-recent. The caller can re-set the
    // cookie if they want.
  }

  return { tenant: all[0], all };
}
