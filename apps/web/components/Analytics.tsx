import Script from 'next/script';

/**
 * Analytics — env-driven, supports multiple providers in parallel.
 *
 * Required env vars (set any combination in Railway):
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN     — e.g. "stackpicks.dev" (set when you sign up at plausible.io)
 *   NEXT_PUBLIC_POSTHOG_KEY          — phc_xxx... key from posthog.com
 *   NEXT_PUBLIC_POSTHOG_HOST         — e.g. "https://us.i.posthog.com" (optional, defaults to US)
 *   NEXT_PUBLIC_GA_ID                — G-XXXXX from Google Analytics
 *   NEXT_PUBLIC_UMAMI_SCRIPT         — e.g. "https://cloud.umami.is/script.js"
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID     — uuid from Umami dashboard
 *
 * No analytics fires in development (NODE_ENV !== production).
 */

export function Analytics() {
  // Don't fire in dev
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      {/* ──── Plausible ─────────────────────────────────────────────── */}
      {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.outbound-links.js"
          strategy="afterInteractive"
        />
      )}

      {/* ──── PostHog ───────────────────────────────────────────────── */}
      {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
              api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'}',
              person_profiles: 'identified_only',
              capture_pageview: true,
              capture_pageleave: true,
            });
          `}
        </Script>
      )}

      {/* ──── Google Analytics 4 ────────────────────────────────────── */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
              });
            `}
          </Script>
        </>
      )}

      {/* ──── Umami ─────────────────────────────────────────────────── */}
      {process.env.NEXT_PUBLIC_UMAMI_SCRIPT && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          defer
          src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
