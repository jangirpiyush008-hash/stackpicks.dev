'use client';

import { useEffect } from 'react';

// Global outbound-link UTM stamper. Mounts once in root layout. Catches every
// click on any <a target="_blank"> or any anchor pointing at an external
// origin, and rewrites the href at click time to include utm_source + medium +
// campaign + content.
//
// Why a click handler instead of rendering UTM in the HTML directly?
// 1. Zero markup changes — works on every existing <a> tag site-wide.
// 2. Clean URLs in the rendered HTML (AI crawlers + Google Search Console
//    don't see ugly tracking URLs on the page — better for SEO).
// 3. New pages and blog posts get UTM automatically without touching code.
//
// What this does NOT do:
// - Doesn't add UTM if the URL already has utm_source (respects partner
//   attribution).
// - Doesn't stamp same-origin links (no point — we're already on the site).
// - Doesn't override the /go/* proxy (those handle their own UTM server-side).

const HOST_SELF = 'stackpicks.dev';

function shouldStamp(url: URL, host: string): boolean {
  // Skip same-origin
  if (url.host === host) return false;
  // Skip our own /go proxy paths even if they're absolute (just in case)
  if (url.pathname.startsWith('/go/')) return false;
  // Skip non-http schemes (mailto:, tel:, javascript:, magnet:, data:)
  if (!/^https?:$/.test(url.protocol)) return false;
  // Respect existing partner attribution
  if (url.searchParams.has('utm_source')) return false;
  return true;
}

function deriveCampaign(pathname: string): string {
  // Page-level campaign for analytics granularity. Maps current page to a
  // campaign label so destination sites can see WHICH page sent the click.
  if (pathname.startsWith('/blog'))     return 'blog';
  if (pathname.startsWith('/mcp'))      return 'mcp-directory';
  if (pathname.startsWith('/tools'))    return 'tools-directory';
  if (pathname.startsWith('/build'))    return 'bundle';
  if (pathname.startsWith('/skills'))   return 'skill-track';
  if (pathname.startsWith('/repo'))     return 'repo-detail';
  if (pathname.startsWith('/preview'))  return 'preview-gallery';
  if (pathname.startsWith('/category')) return 'category';
  if (pathname.startsWith('/compare'))  return 'compare';
  if (pathname.startsWith('/best'))     return 'best-of';
  if (pathname.startsWith('/alternatives')) return 'alternatives';
  if (pathname === '/' || pathname === '') return 'homepage';
  return 'site';
}

export function UtmOutboundHandler() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Only left-click without modifier keys — preserves middle-click "open in new tab" etc.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Walk up to find the anchor — handles cases where a child element was clicked
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      let url: URL;
      try { url = new URL(anchor.href, window.location.href); } catch { return; }

      if (!shouldStamp(url, window.location.host)) return;

      const campaign = deriveCampaign(window.location.pathname);

      url.searchParams.set('utm_source', HOST_SELF);
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', campaign);
      // utm_content = where on this page the link was — defaults to anchor's
      // visible text trimmed to 50 chars (cleaner than passing whole URLs).
      const labelText = (anchor.textContent ?? '').trim().slice(0, 50).replace(/\s+/g, '-').toLowerCase();
      if (labelText) url.searchParams.set('utm_content', labelText);

      // Rewrite href — works for both same-tab and target=_blank clicks.
      // The browser uses the freshly-mutated href when it navigates.
      anchor.href = url.toString();
    }

    document.addEventListener('click', onClick, { capture: true });
    // Also handle auxclick (middle-click) so opening in a new tab also gets UTM
    document.addEventListener('auxclick', onClick as EventListener, { capture: true });

    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('auxclick', onClick as EventListener, { capture: true });
    };
  }, []);

  return null;
}
