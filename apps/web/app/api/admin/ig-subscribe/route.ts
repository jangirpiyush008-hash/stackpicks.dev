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

interface PageEntry {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
}

function env() {
  const token = process.env.META_LONG_TOKEN;
  const id = process.env.IG_BUSINESS_ID;
  if (!token || !id) {
    throw new Error('META_LONG_TOKEN or IG_BUSINESS_ID env missing in Railway');
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
    const linked = await findLinkedPage(token, id);
    if (!linked.page) {
      return NextResponse.json({
        ok: false,
        response: { error: { message: linked.error } },
        hint: 'The System User token must be able to list pages (pages_show_list scope) AND have access to the Page linked to the IG account. Add the Page as an asset of the System User in Business Settings.',
      }, { status: 500 });
    }
    // Subscribe the Page to the `instagram` webhook bundle (covers
    // comments/messages/mentions on the linked IG account).
    const url = `${GRAPH}/${linked.page.id}/subscribed_apps?subscribed_fields=instagram&access_token=${encodeURIComponent(linked.page.access_token)}`;
    const r = await fetch(url, { method: 'POST' });
    const json = await r.json();
    if (!r.ok) {
      return NextResponse.json({
        ok: false, status: r.status,
        page: { id: linked.page.id, name: linked.page.name },
        response: json,
        hint: 'Page may need to be re-linked to the IG account, or the token may not have manage_metadata-equivalent permission on this Page.',
      }, { status: 500 });
    }
    return NextResponse.json({ ok: true, page: { id: linked.page.id, name: linked.page.name }, response: json });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
