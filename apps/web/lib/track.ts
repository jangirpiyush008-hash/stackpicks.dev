/**
 * Analytics tracking helpers — wraps PostHog with type-safe events.
 *
 * Always import these instead of calling window.posthog directly.
 * They no-op gracefully if PostHog isn't loaded (dev mode, ad blockers).
 */

declare global {
  interface Window {
    posthog?: {
      identify: (id: string, props?: Record<string, unknown>) => void;
      capture: (event: string, props?: Record<string, unknown>) => void;
      reset: () => void;
      people: { set: (props: Record<string, unknown>) => void };
    };
  }
}

const safe = (fn: () => void) => {
  if (typeof window === 'undefined') return;
  if (!window.posthog) return;
  try {
    fn();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('[track]', err);
  }
};

/** Link the anonymous visitor to a real user account (call after sign-in). */
export function identifyUser(userId: string, props: { email?: string | null; name?: string | null; created_at?: string | null }) {
  safe(() => {
    window.posthog!.identify(userId, {
      email: props.email ?? undefined,
      name: props.name ?? undefined,
      $set_once: { signup_date: props.created_at ?? new Date().toISOString() },
    });
  });
}

/** Forget the user (call on sign-out so the next session starts anonymous). */
export function resetUser() {
  safe(() => {
    window.posthog!.reset();
  });
}

/** Track a custom event (preferred over inline window.posthog.capture). */
export function track(event: string, props?: Record<string, unknown>) {
  safe(() => {
    window.posthog!.capture(event, props);
  });
}

// ─── Pre-defined events (use these instead of free-form strings) ─────────

export const events = {
  signupStarted: (provider: 'email' | 'google' | 'github') =>
    track('signup_started', { provider }),

  signupCompleted: (userId: string, props: { email: string; provider: string }) =>
    track('signup_completed', { user_id: userId, ...props }),

  checkoutStarted: (currency: 'INR' | 'USD', amount: number, coupon?: string) =>
    track('checkout_started', { currency, amount, coupon: coupon ?? null }),

  paymentSuccess: (props: {
    amount: number;
    currency: 'INR' | 'USD';
    payment_id: string;
    order_id: string;
    coupon?: string | null;
  }) =>
    track('payment_success', {
      ...props,
      // Treat this as a "revenue" event so PostHog dashboards aggregate correctly
      $revenue: props.amount / 100, // paise → rupees / cents → dollars
    }),

  paymentFailed: (reason: string) =>
    track('payment_failed', { reason }),

  couponApplied: (code: string, discountType: string) =>
    track('coupon_applied', { code, discount_type: discountType }),

  repoSubmitted: (fullName: string) =>
    track('repo_submitted', { repo: fullName }),

  paywallHit: (page: string) =>
    track('paywall_hit', { page }),

  newsletterSignup: (source: 'popup' | 'footer') =>
    track('newsletter_signup', { source }),
};
