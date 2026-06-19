'use client';

/**
 * Bento-tile live chat demo for the AutoDM landing page.
 *
 * Renders a 3-message mock conversation. Content swaps based on the
 * visitor's currency (India → INR + Hinglish flavour + Delhi shipping;
 * everyone else → USD + clean English + generic shipping). The lime
 * bot bubble carries the AI reply; the dark bubbles are the recipient.
 *
 * Pre-resolution falls back to the USD variant so non-Indian visitors
 * never briefly see ₹.
 */

import { useCurrency } from './useCurrency';

type Turn = { role: 'user' | 'bot'; text: string };

const INDIA_TURNS: Turn[] = [
  { role: 'user', text: 'size?' },
  { role: 'bot',  text: 'M/L/XL in stock — ₹1,499. Ship to Delhi 3 days 🇮🇳' },
  { role: 'user', text: 'how to pay?' },
];

const WORLD_TURNS: Turn[] = [
  { role: 'user', text: 'do you ship to NYC?' },
  { role: 'bot',  text: 'Yes — M/L/XL in stock at $19. Ships in 3 days, free over $50.' },
  { role: 'user', text: 'got it' },
];

export function LiveDemoChat() {
  const { currency } = useCurrency();
  const turns = currency === 'INR' ? INDIA_TURNS : WORLD_TURNS;

  return (
    <div className="space-y-1.5">
      {turns.map((t, i) =>
        t.role === 'bot' ? (
          <div
            key={i}
            className="max-w-[92%] rounded-lg bg-accent text-bg px-2.5 py-1.5 text-[11px] font-medium leading-snug"
          >
            {t.text}
          </div>
        ) : (
          <div
            key={i}
            className="self-end ml-auto max-w-[80%] w-fit rounded-lg bg-bg border border-border px-2.5 py-1.5 text-[11px] text-text"
          >
            {t.text}
          </div>
        ),
      )}
    </div>
  );
}
