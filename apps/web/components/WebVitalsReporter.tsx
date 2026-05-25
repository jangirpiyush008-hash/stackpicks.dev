'use client';

// Web Vitals reporter — Google ranks on real-user Core Web Vitals (CrUX data).
// We forward LCP/CLS/INP/FCP/TTFB to PostHog so we can see degradations BEFORE
// they show up in Search Console (which lags by ~28 days).
//
// Why PostHog and not GA: PostHog lets us group by page path + cohort, so we
// can spot which routes are slow. GA's vitals reporting is global-only.

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Don't fire in dev — keeps the dashboard clean.
    if (process.env.NODE_ENV !== 'production') return;

    if (typeof window === 'undefined' || !window.posthog) return;

    window.posthog.capture('web_vital', {
      metric_name: metric.name,                 // LCP, CLS, INP, FCP, TTFB
      metric_value: Math.round(metric.value),
      metric_rating: metric.rating,             // "good" | "needs-improvement" | "poor"
      metric_id: metric.id,
      metric_delta: Math.round(metric.delta),
      path: window.location.pathname,
    });
  });

  return null;
}
