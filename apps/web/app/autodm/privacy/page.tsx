// AutoDM Privacy Policy — lives at autodm.stackpicks.dev/privacy (middleware
// rewrites /privacy -> /autodm/privacy on the subdomain). Written to satisfy
// Meta's Instagram messaging-permission review: explicit about what Instagram
// data we touch, why, how it's stored, retention, and deletion.

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Privacy Policy — StackPicks AutoDM',
  description: 'How StackPicks AutoDM handles Instagram data, access tokens, comments, and direct messages — and how to delete your data.',
};

export default function AutoDmPrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/autodm" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">AutoDM Privacy Policy</h1>
        <p className="text-xs text-muted font-mono">Last updated: 18 June 2026</p>
      </header>
      <article className="legal-prose">
        <p>
          This Privacy Policy explains how <strong>StackPicks AutoDM</strong> (&ldquo;AutoDM&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;) — a product operated by Piyush Jangir, a sole
          proprietorship based in India — handles data when a creator connects their Instagram
          Professional account and uses AutoDM to reply to comments and send direct messages.
          Questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
        <p>
          AutoDM uses the Meta Instagram Graph API. Our use of information received from Meta APIs
          adheres to the <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer">Meta Platform Terms</a>{' '}
          and <a href="https://developers.facebook.com/devpolicy/" target="_blank" rel="noopener noreferrer">Developer Policies</a>,
          including the Limited Use requirements. We comply with India&apos;s Digital Personal Data
          Protection Act 2023 and, where applicable, the EU GDPR.
        </p>

        <h2>1. Instagram data we access</h2>
        <p>When you connect your Instagram Professional account through Meta&apos;s official OAuth flow, we access only what the bot needs to function:</p>
        <ul>
          <li><strong>Account profile</strong> — your Instagram business ID and username (to identify your account and prevent the bot from replying to itself).</li>
          <li><strong>Access token</strong> — a long-lived Instagram access token issued by Meta. It is <strong>encrypted at rest using AES-256-GCM</strong> and is never displayed, logged, or shared.</li>
          <li><strong>Comments &amp; Live comments</strong> — the text, comment ID, author username/ID, and parent media ID of comments on your posts, Reels, and Live broadcasts, so we can match your keyword rules.</li>
          <li><strong>Direct messages we send</strong> — the content of the auto-replies the bot sends on your behalf, plus delivery status and whether the recipient clicked your link.</li>
          <li><strong>Follower relationship</strong> — whether a commenter follows you, used only to choose follower vs non-follower reply copy.</li>
        </ul>
        <p>We do <strong>not</strong> access your followers list, your private inbox history with other people, your media library beyond comment metadata, or any data unrelated to running your rules.</p>

        <h2>2. Why we use it</h2>
        <ul>
          <li>To detect comments matching the keyword rules you create and send the DM you configured.</li>
          <li>To post the public comment reply you configured.</li>
          <li>To show you analytics (sent, clicked, click-through rate) and a contacts list of who you reached.</li>
          <li>To send an optional 4-hour follow-up to recipients who did not click your link.</li>
          <li>To keep your account safe (rate limits, spam-pattern checks, Meta error handling).</li>
        </ul>

        <h2>3. How we store and protect it</h2>
        <ul>
          <li>Data lives in a Supabase (PostgreSQL) database hosted in the Mumbai (ap-south-1) region, protected by row-level security so one creator can never read another&apos;s data.</li>
          <li>Instagram access tokens are encrypted with AES-256-GCM before storage. Encryption keys are held in server environment variables, never in the database.</li>
          <li>Comment and message text is stored only as long as needed for analytics and is truncated to what the feature requires.</li>
          <li>We never sell your data, never run ad pixels, and never build profiles of your audience.</li>
        </ul>

        <h2>4. Third parties we share with</h2>
        <p>We share the minimum necessary with infrastructure providers, each acting as a processor under contract:</p>
        <ul>
          <li><strong>Meta Platforms</strong> — to send comment replies and DMs via the Instagram Graph API.</li>
          <li><strong>Anthropic (Claude API)</strong> — to draft reply copy in your voice. Prompts contain your sample messages and a recipient&apos;s username; they are not used to train models.</li>
          <li><strong>Supabase</strong> — database and authentication hosting.</li>
          <li><strong>Razorpay</strong> — subscription billing. We never see your card or UPI details.</li>
          <li><strong>Resend</strong> — to email you weekly digests and connection-health alerts.</li>
        </ul>

        <h2>5. Data retention</h2>
        <ul>
          <li>Connection and rule data is kept while your account is active.</li>
          <li>Message and comment logs are retained for up to 12 months for analytics, then purged.</li>
          <li>When you disconnect Instagram or delete your account, your access token is deleted immediately and remaining data is removed within 30 days.</li>
        </ul>

        <h2>6. How to delete your data</h2>
        <p>You are in control and can remove your data at any time, three ways:</p>
        <ul>
          <li><strong>In AutoDM</strong> — disconnect your Instagram account from the dashboard. This deletes the stored token at once.</li>
          <li><strong>From Instagram</strong> — go to Instagram → Settings → Apps and websites → remove &ldquo;StackPicks AutoDM&rdquo;. Meta notifies us and we purge your data.</li>
          <li><strong>By email</strong> — write to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the subject &ldquo;Delete my data&rdquo;. We action it {CONTACT.responseTime}.</li>
        </ul>

        <h2>7. Your rights</h2>
        <p>You can request access to, correction of, or deletion of your personal data, and you can withdraw consent at any time by disconnecting. Contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> (grievance officer: Piyush Jangir).</p>

        <h2>8. Changes to this policy</h2>
        <p>If we materially change how we handle Instagram data, we will update this page and the &ldquo;last updated&rdquo; date, and notify connected creators by email.</p>

        <p className="text-sm text-muted">
          See also the <Link href="/terms">AutoDM Terms of Service</Link>.
        </p>
      </article>
    </div>
  );
}
