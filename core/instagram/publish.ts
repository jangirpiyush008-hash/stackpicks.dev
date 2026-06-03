// IG Graph API publisher — wraps the 2-step container/publish flow for
// Reels, single videos, single images, and carousels.
//
// Env required (Railway):
//   META_LONG_TOKEN         long-lived Page/User token with instagram_basic
//                           + instagram_content_publish + pages_show_list
//   IG_BUSINESS_ID          numeric IG Business Account ID (we fetch it once
//                           and cache it — exposed via fetchIgBusinessId())
//
// Docs: https://developers.facebook.com/docs/instagram-platform/content-publishing

const GRAPH = 'https://graph.facebook.com/v21.0';

export type IgPostType = 'reel' | 'video' | 'image' | 'carousel';

interface PublishInput {
  postType: IgPostType;
  mediaUrls: string[];     // for reel/video/image: 1 url; for carousel: 2-10
  coverUrl?: string;       // optional Reel cover image
  caption: string;
  hashtags: string;        // space-separated, no #
}

interface PublishResult {
  ok: boolean;
  ig_creation_id?: string;
  ig_post_id?: string;
  error?: string;
}

function token(): string {
  const t = process.env.META_LONG_TOKEN;
  if (!t) throw new Error('META_LONG_TOKEN env not set');
  return t;
}

function igBusinessId(): string {
  const id = process.env.IG_BUSINESS_ID;
  if (!id) throw new Error('IG_BUSINESS_ID env not set — run fetchIgBusinessId() once and add to Railway env');
  return id;
}

async function graphPost(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const body = new URLSearchParams({ ...params, access_token: token() });
  const res = await fetch(`${GRAPH}${path}`, { method: 'POST', body });
  const text = await res.text();
  if (!res.ok) throw new Error(`Graph ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

async function graphGet(path: string, params: Record<string, string> = {}): Promise<Record<string, unknown>> {
  const qs = new URLSearchParams({ ...params, access_token: token() }).toString();
  const res = await fetch(`${GRAPH}${path}?${qs}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`Graph ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

/**
 * One-time helper — resolve the IG Business ID from your linked FB Page.
 * Run this once after first OAuth, then save the result to Railway as
 * IG_BUSINESS_ID. The cron uses the cached env value after that.
 */
export async function fetchIgBusinessId(): Promise<string> {
  // GET /me/accounts → list FB Pages
  const pages = (await graphGet('/me/accounts')) as { data?: Array<{ id: string; name: string }> };
  if (!pages.data?.length) throw new Error('No FB Pages accessible with this token');
  // Pick first page (assumes one page; if many, env override needed)
  const pageId = pages.data[0].id;
  // Get the IG account linked to that page
  const igLink = (await graphGet(`/${pageId}`, { fields: 'instagram_business_account' })) as {
    instagram_business_account?: { id: string };
  };
  if (!igLink.instagram_business_account?.id) {
    throw new Error(`Page ${pageId} (${pages.data[0].name}) has no linked Instagram Business account`);
  }
  return igLink.instagram_business_account.id;
}

/**
 * Poll a media container until Meta says it's FINISHED (or error out).
 */
async function waitForContainer(creationId: string, timeoutMs = 90_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const d = (await graphGet(`/${creationId}`, { fields: 'status_code' })) as { status_code?: string };
    if (d.status_code === 'FINISHED') return;
    if (d.status_code === 'ERROR' || d.status_code === 'EXPIRED') {
      throw new Error(`Container ${creationId} → ${d.status_code}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error(`Container ${creationId} timeout (still ${timeoutMs / 1000}s in IN_PROGRESS)`);
}

/**
 * Publish a Reel / video / image / carousel via Graph API.
 * Returns the final ig_post_id (the published media's id).
 */
export async function publishToInstagram(input: PublishInput): Promise<PublishResult> {
  try {
    const ig = igBusinessId();
    const fullCaption = (input.caption + (input.hashtags ? '\n\n' + input.hashtags.split(/\s+/).map((t) => '#' + t).join(' ') : '')).slice(0, 2200);

    let creationId: string;

    if (input.postType === 'reel') {
      const d = await graphPost(`/${ig}/media`, {
        media_type: 'REELS',
        video_url: input.mediaUrls[0],
        caption: fullCaption,
        ...(input.coverUrl ? { cover_url: input.coverUrl } : {}),
        share_to_feed: 'true',
      });
      creationId = d.id as string;
      await waitForContainer(creationId);
    } else if (input.postType === 'video') {
      // Single-video feed post (still uses REELS media_type post-2024; IG deprecated VIDEO)
      const d = await graphPost(`/${ig}/media`, {
        media_type: 'REELS',
        video_url: input.mediaUrls[0],
        caption: fullCaption,
        share_to_feed: 'true',
      });
      creationId = d.id as string;
      await waitForContainer(creationId);
    } else if (input.postType === 'image') {
      const d = await graphPost(`/${ig}/media`, {
        image_url: input.mediaUrls[0],
        caption: fullCaption,
      });
      creationId = d.id as string;
    } else if (input.postType === 'carousel') {
      // Each slide is its own container, then a final carousel container groups them
      const children: string[] = [];
      for (const url of input.mediaUrls) {
        const d = await graphPost(`/${ig}/media`, {
          image_url: url,
          is_carousel_item: 'true',
        });
        children.push(d.id as string);
      }
      const carousel = await graphPost(`/${ig}/media`, {
        media_type: 'CAROUSEL',
        children: children.join(','),
        caption: fullCaption,
      });
      creationId = carousel.id as string;
    } else {
      throw new Error(`Unsupported post_type: ${input.postType}`);
    }

    // Publish the container
    const pub = await graphPost(`/${ig}/media_publish`, { creation_id: creationId });
    return {
      ok: true,
      ig_creation_id: creationId,
      ig_post_id: pub.id as string,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
