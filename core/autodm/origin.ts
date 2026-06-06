/**
 * Canonical AutoDM origin resolver.
 *
 * AutoDM lives on its own subdomain (autodm.stackpicks.dev), separate
 * from the main StackPicks directory. Every URL that the AutoDM product
 * generates — OAuth redirect URIs, click-tracker short links, fallback
 * CTAs, email links — must use THIS origin, not the main site URL.
 *
 * Env precedence:
 *   1. AUTODM_ORIGIN          (canonical)
 *   2. AUTODM_TRACKER_ORIGIN  (legacy alias; kept for back-compat)
 *   3. https://autodm.stackpicks.dev (hard default)
 *
 * The OAuth redirect URI you whitelist in the Meta App console MUST
 * exactly match `${autodmOrigin()}/api/autodm/oauth/callback` —
 * keep that in sync if you ever flip this env var.
 */

export function autodmOrigin(): string {
  return (
    process.env.AUTODM_ORIGIN ||
    process.env.AUTODM_TRACKER_ORIGIN ||
    'https://autodm.stackpicks.dev'
  ).replace(/\/+$/, '');
}
