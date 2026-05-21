import { LegalPage } from '../../components/LegalPage';
import { CONTACT } from '@stackpicks/core/constants';
import { Lock, Shield, ServerCog, KeyRound } from 'lucide-react';

export const metadata = {
  title: 'Security',
  description: 'How StackPicks protects your data, payments, and account — encryption, RLS, PCI scope, responsible disclosure.',
};

export default function SecurityPage() {
  return (
    <LegalPage title="Security" lastUpdated="21 May 2026">
      <p>
        Security on StackPicks is not a paragraph in the footer. It&apos;s a set of concrete
        controls baked into the stack from day one. This page documents the controls so you can
        decide whether to trust us with your data.
      </p>

      <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
        <Pillar icon={<Lock className="w-5 h-5" />} title="Transport security">
          All traffic served over <strong>HTTPS with TLS 1.3</strong>. HSTS preloaded.
          HTTP requests redirect to HTTPS. No mixed content.
        </Pillar>
        <Pillar icon={<Shield className="w-5 h-5" />} title="Database isolation">
          <strong>Row-Level Security</strong> enforced on every Postgres table. The
          public read scope is explicit. Service-role keys never leave the server.
        </Pillar>
        <Pillar icon={<ServerCog className="w-5 h-5" />} title="Payment scope">
          We are <strong>not PCI in scope</strong>. Card numbers, UPI handles, and
          bank details never touch our servers — they go directly to Razorpay
          (PCI-DSS Level 1).
        </Pillar>
        <Pillar icon={<KeyRound className="w-5 h-5" />} title="Secret management">
          Secrets stored only as encrypted environment variables. Never in code,
          never in git history, never logged. Service-role keys are short-lived
          when rotated.
        </Pillar>
      </div>

      <h2>1. Encryption</h2>
      <ul>
        <li><strong>In transit</strong> — TLS 1.3 for browser ↔ server, TLS 1.2+ for server ↔ Supabase ↔ Razorpay</li>
        <li><strong>At rest</strong> — Supabase Postgres uses AES-256 disk encryption; backups are encrypted</li>
        <li><strong>Webhooks</strong> — Razorpay payment events are verified by HMAC-SHA256 signature before any DB write</li>
      </ul>

      <h2>2. Authentication</h2>
      <ul>
        <li>Supabase Auth with secure session cookies (HttpOnly, Secure, SameSite=Lax)</li>
        <li>Passwords stored as bcrypt hashes — we never see your plaintext password</li>
        <li>Magic-link login available — no password to leak</li>
        <li>Sessions auto-refresh and rotate; rotation invalidates the prior token</li>
      </ul>

      <h2>3. Authorization (RLS)</h2>
      <p>
        Every table in our Postgres database has Row-Level Security enabled with explicit policies.
        The default in our system is &ldquo;deny&rdquo; — every read or write must match a policy.
      </p>
      <ul>
        <li>Public data (categories, published repos) — read-only, no writes from clients</li>
        <li>Owner-scoped data (sponsors, job posts) — only the owning user can read/write</li>
        <li>Premium-gated data — readable only while a premium subscription is active</li>
        <li>Sensitive tables (outbound clicks, newsletter subscribers) — service-role only, never exposed to the browser</li>
      </ul>

      <h2>4. Privacy controls in the analytics path</h2>
      <ul>
        <li><strong>No third-party advertising pixels</strong> — no Google Ads, no Meta pixel</li>
        <li><strong>Cookie-free analytics</strong> — Plausible aggregates without identifiers</li>
        <li><strong>IP hashing</strong> — outbound click tracking uses SHA-256 with a daily-rotating salt. The raw IP is never stored and the daily hash is uncorrelatable across days</li>
        <li><strong>Server logs retained 14 days</strong>, then purged</li>
      </ul>

      <h2>5. Payment security</h2>
      <ul>
        <li>All payments processed via <strong>Razorpay</strong>, PCI-DSS Level 1 certified</li>
        <li>Card numbers, UPI handles, and bank details are entered on Razorpay&apos;s domain — never on ours</li>
        <li>Razorpay payment signatures are verified <strong>server-side</strong> after every checkout</li>
        <li>Razorpay webhook signatures are verified before any database update — replay attacks fail</li>
        <li>We are not in PCI scope and do not store payment instruments</li>
      </ul>

      <h2>6. Hosting & infrastructure</h2>
      <ul>
        <li><strong>Database</strong> — Supabase, Mumbai region (ap-south-1), automated daily backups, point-in-time recovery on Pro tier</li>
        <li><strong>Application</strong> — Vercel / Railway, automatic patching, isolated runtime per request</li>
        <li><strong>DNS</strong> — secured with DNSSEC where the registrar supports it</li>
        <li><strong>Email</strong> — Resend, SPF / DKIM / DMARC configured for the sending domain</li>
      </ul>

      <h2>7. Dependency hygiene</h2>
      <ul>
        <li><code>pnpm audit</code> runs in CI on every push; high-severity vulnerabilities block merge</li>
        <li>Dependabot opens upgrade PRs for security updates within 24 hours</li>
        <li>The dependency surface is intentionally small — we evaluate every new package before adding it</li>
      </ul>

      <h2>8. Incident response</h2>
      <ul>
        <li>Suspected breach triggers immediate rotation of all service-role keys and session secrets</li>
        <li>Affected users are notified by email within <strong>72 hours</strong> of confirmation, per the DPDP Act</li>
        <li>A public post-mortem is published if user data was confirmed exposed</li>
      </ul>

      <h2>9. Responsible disclosure</h2>
      <p>
        Found a vulnerability? We&apos;d rather hear from you than from a third party. Email{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the subject <code>SECURITY:
        &lt;brief title&gt;</code>. Please include:
      </p>
      <ul>
        <li>A short description of the issue</li>
        <li>Steps to reproduce</li>
        <li>Impact assessment</li>
        <li>Your preferred name and contact for credit</li>
      </ul>
      <p>
        We commit to:
      </p>
      <ul>
        <li>Acknowledging your report within <strong>48 hours</strong></li>
        <li>Providing an initial assessment within <strong>5 business days</strong></li>
        <li>Crediting you publicly (with your consent) once the fix ships</li>
        <li>Not pursuing legal action against good-faith researchers</li>
      </ul>

      <h2>10. What you can do</h2>
      <ul>
        <li>Use a strong, unique password — or magic-link login</li>
        <li>Don&apos;t share credentials. We will never ask for your password by email or phone</li>
        <li>Verify payment confirmation emails come from <code>@razorpay.com</code> or our verified sending domain</li>
        <li>If anything looks off — unexpected invoice, weird email — email us first before clicking links</li>
      </ul>
    </LegalPage>
  );
}

function Pillar({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-2 text-accent mb-2">
        {icon}
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}
