// AutoDM Data Deletion instructions — autodm.stackpicks.dev/data-deletion.
// This is the human-readable "Data Deletion Instructions URL" Meta accepts
// in App Settings. The machine callback lives at /api/autodm/data-deletion.

import Link from 'next/link';
import { ArrowLeft, Trash2, Instagram, Mail } from 'lucide-react';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Delete Your Data — StackPicks AutoDM',
  description: 'How to delete all your StackPicks AutoDM data and revoke Instagram access.',
};

export default function AutoDmDataDeletionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/autodm" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Delete your data</h1>
        <p className="text-xs text-muted font-mono">Last updated: 18 June 2026</p>
      </header>
      <article className="legal-prose">
        <p>
          You can delete all your StackPicks AutoDM data and revoke our access to your Instagram
          account at any time. Any of the three methods below fully removes your data. Your encrypted
          Instagram access token is deleted <strong>immediately</strong>; remaining analytics logs are
          purged within 30 days.
        </p>

        <h2><Trash2 className="inline w-5 h-5 mr-1 -mt-1" /> Option 1 — From your dashboard (instant)</h2>
        <ol>
          <li>Sign in at <Link href="/dashboard">autodm.stackpicks.dev/dashboard</Link>.</li>
          <li>Open the connected account and choose <strong>Disconnect Instagram</strong>.</li>
          <li>Your token is deleted at once and the bot stops immediately.</li>
        </ol>

        <h2><Instagram className="inline w-5 h-5 mr-1 -mt-1" /> Option 2 — From Instagram</h2>
        <ol>
          <li>Open Instagram → <strong>Settings → Apps and websites</strong>.</li>
          <li>Remove <strong>StackPicks AutoDM</strong>.</li>
          <li>Instagram notifies us automatically and we delete your data — you can confirm the status via the link Meta shows you.</li>
        </ol>

        <h2><Mail className="inline w-5 h-5 mr-1 -mt-1" /> Option 3 — By email</h2>
        <ol>
          <li>Email <a href={`mailto:${CONTACT.email}?subject=Delete my data`}>{CONTACT.email}</a> with subject <strong>&ldquo;Delete my data&rdquo;</strong>.</li>
          <li>Tell us your Instagram handle so we can locate the account.</li>
          <li>We action it {CONTACT.responseTime}.</li>
        </ol>

        <h2>What gets deleted</h2>
        <ul>
          <li>Your encrypted Instagram access token (immediately)</li>
          <li>Your rules, contacts, message logs, and analytics</li>
          <li>Your account&apos;s connection record</li>
        </ul>
        <p>
          We never keep a copy after deletion. For full detail on what we store and why, see the{' '}
          <Link href="/privacy">AutoDM Privacy Policy</Link>.
        </p>
      </article>
    </div>
  );
}
