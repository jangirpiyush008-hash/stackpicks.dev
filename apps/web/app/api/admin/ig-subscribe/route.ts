/**
 * Subscribe our Meta App to receive Instagram webhooks for our IG account.
 *
 * IMPORTANT: in Meta's API, the /subscribed_apps endpoint lives on the
 * FACEBOOK PAGE that's linked to the IG Business Account — NOT on the IG
 * Business ID itself. So we have to:
 *   1. Use the System User token to call /me/accounts to find the Page(s)
 *   2. Match the Page whose instagram_business_account.id == IG_BUSINESS_ID
 *   3. POST /<PAGE_ID>/subscribed_apps using the PAGE's access token
 *      (each page has its own page-scoped token returned by /me/accounts)
 *
 * Admin-only. Idempotent — safe to call repeatedly.
 *
 * GET  → returns current subscription state of the linked Page
 * POST → subscribes the Page to the `instagram` webhook field
 */

import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH = 'https://graph.facebook.com/v21.0';
// IG Login API tokens (issued by 'API setup with Instagram login' flow) route
// through graph.instagram.com instead of graph.facebook.com — Meta returns
// "Cannot parse access token" if you hit the wrong host.
const GRAPH_IG = 'https://graph.instagram.com/v22.0';

interface PageEntry {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
}

function env() {
  // Prefer the IG-OAuth-issued user token if present (works for IG-direct
  // /subscribed_apps), fall back to the System User token for Page-route.
  const token = process.env.IG_USER_TOKEN || process.env.META_LONG_TOKEN;
  const id = process.env.IG_BUSINESS_ID;
  if (!token || !id) {
    throw new Error('IG_USER_TOKEN / META_LONG_TOKEN or IG_BUSINESS_ID env missing in Railway');
  }
  return { token, id };
}

/** Find the FB Page connected to our IG account. */
async function findLinkedPage(token: string, igId: string) {
  const res = await fetch(
    `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${encodeURIComponent(token)}`,
    { cache: 'no-store' },
  );
  const json = (await res.json()) as { data?: PageEntry[]; error?: { message?: string } };
  if (!res.ok) return { error: json?.error?.message || `HTTP ${res.status}`, pages: [] as PageEntry[] };
  const pages: PageEntry[] = json.data ?? [];
  const match = pages.find((p) => p.instagram_business_account?.id === igId);
  if (!match) {
    return {
      error: `No Page found linked to IG ${igId}. Available pages: ${pages.map((p) => p.name + ' (' + (p.instagram_business_account?.id ?? 'no-ig') + ')').join(', ') || 'none'}`,
      pages,
    };
  }
  return { page: match, pages };
}

export async function GET() {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const { token, id } = env();
    const linked = await findLinkedPage(token, id);
    if (!linked.page) {
      return NextResponse.json({ ok: false, response: { error: { message: linked.error } } });
    }
    const r = await fetch(
      `${GRAPH}/${linked.page.id}/subscribed_apps?access_token=${encodeURIComponent(linked.page.access_token)}`,
      { cache: 'no-store' },
    );
    const json = await r.json();
    return NextResponse.json({ ok: r.ok, page: { id: linked.page.id, name: linked.page.name }, response: json });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function POST() {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const { token, id } = env();

    // Modern IG Graph API: POST directly to the IG business account.
    // Even though GET on this edge errors ("nonexisting field"), POST is
    // the documented way to subscribe an IG Business Account in 2024+.
    const attempts: Array<{ url: string; status: number; body: unknown }> = [];

    // IG Login API path — graph.instagram.com host. Tokens from
    // "Generate token" on the IG product setup page route here.
    const igDirectUrl = `${GRAPH_IG}/${id}/subscribed_apps?subscribed_fields=comments,messages,message_reactions,mentions,live_comments&access_token=${encodeURIComponent(token)}`;
    const igRes = await fetch(igDirectUrl, { method: 'POST' });
    const igJson = await igRes.json().catch(() => ({}));
    attempts.push({ url: 'graph.instagram.com IG /subscribed_apps', status: igRes.status, body: igJson });
    if (igRes.ok && (igJson as { success?: boolean }).success !== false) {
      return NextResponse.json({ ok: true, target: 'ig_business_account', response: igJson });
    }

    // Fallback: try the linked Page with the Page-level field set.
    const linked = await findLinkedPage(token, id);
    if (!linked.page) {
      return NextResponse.json({
        ok: false,
        attempts,
        page_lookup_error: linked.error,
        hint: 'IG-direct subscribe failed AND no linked Page found. The System User needs the Page asset assigned (Business Settings → System Users → Add assets → Pages).',
      }, { status: 500 });
    }
    // Page-level webhook subscription. `feed` covers comments + posts on the
    // Page and its linked IG account — which is what we need for the
    // comment→DM flow. We deliberately skip messages/messaging_postbacks/
    // message_reactions because those need pages_messaging permission and
    // aren't required for comment-trigger DMs.
    const pageUrl = `${GRAPH}/${linked.page.id}/subscribed_apps?subscribed_fields=feed&access_token=${encodeURIComponent(linked.page.access_token)}`;
    const pageRes = await fetch(pageUrl, { method: 'POST' });
    const pageJson = await pageRes.json().catch(() => ({}));
    attempts.push({ url: 'Page /subscribed_apps', status: pageRes.status, body: pageJson });
    if (pageRes.ok) {
      return NextResponse.json({
        ok: true,
        target: 'page',
        page: { id: linked.page.id, name: linked.page.name },
        response: pageJson,
        attempts,
      });
    }

    return NextResponse.json({
      ok: false,
      attempts,
      hint: 'Both IG-direct and Page-route subscriptions failed. Likely cause: app is in Dev mode and the IG/Page is not added under App Roles → Roles → Add a Tester. Add @stackpicks.dev (or its FB admin) as a Tester and re-try.',
    }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
