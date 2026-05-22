import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Rocket, Smartphone, Brain, Globe, LayoutDashboard, Chrome, Workflow,
  Megaphone, Handshake, ShoppingBag, Terminal, PenLine, ArrowLeft, ArrowRight,
  Sparkles, Github, Check, Clock, Layers, type LucideIcon,
} from 'lucide-react';
import { USE_CASE_BUNDLES, getBundleBySlug } from '../../../lib/use-case-bundles';
import { getSeedByFullName } from '../../../lib/preview-source';
import { UnlockCTA } from '../../../components/UnlockCTA';
import { getIsMember } from '../../../lib/membership';

// Free preview: show the first N sections in full. The rest is gated behind membership.
const FREE_SECTION_LIMIT = 3;

// Force dynamic rendering on each request — Railway's prerender step was emitting
// 404 stubs for these pages in production. Server-side rendering on demand works fine.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  smartphone: Smartphone,
  brain: Brain,
  globe: Globe,
  'layout-dashboard': LayoutDashboard,
  chrome: Chrome,
  workflow: Workflow,
  megaphone: Megaphone,
  handshake: Handshake,
  'shopping-bag': ShoppingBag,
  terminal: Terminal,
  'pen-line': PenLine,
};

const DIFFICULTY_LABEL = {
  weekend: 'A weekend',
  'two-weeks': 'About 2 weeks',
  'one-month': 'About 1 month',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBundleBySlug(slug);
  if (!b) return {};
  return {
    title: `${b.title} — bundle of ${b.sections.reduce((n, s) => n + s.repos.length, 0)} repos`,
    description: b.description,
  };
}

export default async function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) notFound();

  const Icon = ICONS[bundle.icon] ?? Rocket;
  const totalRepos = bundle.sections.reduce((n, s) => n + s.repos.length, 0);
  const isMember = await getIsMember();
  const visibleSections = isMember ? bundle.sections : bundle.sections.slice(0, FREE_SECTION_LIMIT);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${bundle.gradient} opacity-30`} />
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-14">
          <Link
            href="/build"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All bundles
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-bg/80 backdrop-blur border border-border flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-2">{bundle.title}</h1>
              <p className="text-base md:text-lg text-muted leading-relaxed">{bundle.description}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <Stat icon={<Github className="w-4 h-4" />} label="Repos" value={String(totalRepos)} />
            <Stat icon={<Layers className="w-4 h-4" />} label="Layers" value={String(bundle.sections.length)} />
            <Stat icon={<Clock className="w-4 h-4" />} label="Build time" value={DIFFICULTY_LABEL[bundle.difficulty]} />
            <Stat icon={<Sparkles className="w-4 h-4" />} label="Outcome" value="See below" />
          </div>

          {/* Outcome */}
          <div className="mt-6 p-5 rounded-xl border border-accent/30 bg-accent/5">
            <div className="text-xs font-mono uppercase tracking-wider text-accent mb-1">You will ship</div>
            <p className="text-text">{bundle.outcome}</p>
          </div>

          {/* CTA row */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/how-to-use"
              className="px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition inline-flex items-center gap-2"
            >
              How to feed this to your AI agent
              <ArrowRight className="w-4 h-4" />
            </Link>
            <CopyShellButton bundleSlug={bundle.slug} />
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {visibleSections.map((section, i) => (
          <section key={section.title}>
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-[11px] font-mono text-muted/60">0{i + 1}</span>
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <span className="text-xs text-muted ml-auto">{section.repos.length} {section.repos.length === 1 ? 'repo' : 'repos'}</span>
            </div>
            {section.repos.length === 0 ? (
              <p className="text-sm text-muted italic">More additions coming to this layer.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {section.repos.map((r) => (
                  <RepoCard key={r.full_name} fullName={r.full_name} reason={r.reason} />
                ))}
              </div>
            )}
          </section>
        ))}

        {!isMember && bundle.sections.length > FREE_SECTION_LIMIT && (
          <LockedSectionsPreview
            lockedSections={bundle.sections.slice(FREE_SECTION_LIMIT)}
            totalLockedRepos={bundle.sections
              .slice(FREE_SECTION_LIMIT)
              .reduce((sum, s) => sum + s.repos.length, 0)}
          />
        )}
      </div>

      {/* Build with AI — universal guide */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-surface/40 to-transparent p-6 md:p-7">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">
            How to build {bundle.title.toLowerCase()} with AI
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">The 4-step AI workflow</h2>
          <p className="text-muted leading-relaxed mb-6">
            The AI agents are good at code. They&apos;re bad at deciding what stack to use. This
            bundle does the second part. You bring the agent.
          </p>
          <ol className="space-y-4">
            <AiStep n={1} title="Ideate with ChatGPT or Claude.ai (web)">
              Paste your idea: <em>&ldquo;I&apos;m building {bundle.title.toLowerCase()}. Help me
              sharpen the product spec — features, edge cases, MVP scope.&rdquo;</em> Iterate for 10-15
              minutes until you have a clear one-page brief.
            </AiStep>
            <AiStep n={2} title="Pick your coding agent">
              For this kind of bundle, we recommend <strong className="text-accent">Claude Code</strong>
              {' '}— Sonnet 4.6/4.7 handles full-stack multi-file reasoning best.{' '}
              <Link href="/how-to-use" className="text-accent underline underline-offset-2">
                See the install guide →
              </Link>{' '}
              Cursor and Codex are also great; pick the one you already pay for.
            </AiStep>
            <AiStep n={3} title="Feed this bundle to the agent">
              Open Claude Code / Cursor / Codex in an empty folder, then paste:
              <pre className="mt-3 px-4 py-3 rounded-lg bg-bg/70 border border-border text-[12px] font-mono leading-relaxed overflow-x-auto text-text whitespace-pre">
{`I'm building ${bundle.title.toLowerCase()}. Use this bundle as the source of truth for the stack:
https://stackpicks.dev/build/${bundle.slug}

Brief from my product spec:
[paste your brief from step 1]

Follow the bundle order strictly:
${bundle.sections.slice(0, 4).map((s, i) => `  ${i + 1}. ${s.title}`).join('\n')}
  ...

Stop and confirm with me after each layer.`}
              </pre>
            </AiStep>
            <AiStep n={4} title="Wire one layer at a time, commit between each">
              Don&apos;t let the agent install everything before the first <code>git commit</code>.
              One layer = one commit. Catches drift early, easy rollback.
            </AiStep>
          </ol>
        </div>
      </section>

      {/* Next steps */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-7">
          <h2 className="text-xl font-bold mb-3">Beyond the bundle</h2>
          <ol className="space-y-3 text-sm">
            <Step n={1}>
              <strong>Ship the boring version first.</strong> The bundle above is the maximalist list.
              For an MVP, start with 60% of these and add the rest when real users ask.
            </Step>
            <Step n={2}>
              <strong>Deploy early.</strong> Push to Railway / Vercel after layer 02 (auth) — not after
              layer 09. Production breaks differently than localhost.
            </Step>
            <Step n={3}>
              <strong>Read CLAUDE.md / .cursor/rules in this repo</strong> for the project conventions
              your AI agent should follow.
            </Step>
            <Step n={4}>
              <strong>Iterate on the take.</strong> If a repo here doesn&apos;t fit your specific use case,
              tell us — <Link href="/contact" className="text-accent underline underline-offset-2">contact</Link>
              {' '}— and we&apos;ll add a better one within 60 minutes.
            </Step>
          </ol>
        </div>
      </section>
    </div>
  );
}

function LockedSectionsPreview({
  lockedSections,
  totalLockedRepos,
}: {
  lockedSections: { title: string; repos: { full_name: string }[] }[];
  totalLockedRepos: number;
}) {
  return (
    <section className="relative">
      {/* Teaser: section titles + repo count, but no detail */}
      <div className="rounded-2xl border border-dashed border-border bg-surface/20 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/60 to-bg pointer-events-none" />
        <div className="relative">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
            {lockedSections.length} more layers · {totalLockedRepos} more repos · members only
          </div>
          <ul className="space-y-2 mb-6 select-none">
            {lockedSections.map((s) => (
              <li key={s.title} className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                <span className="text-muted line-through opacity-50">{s.title}</span>
                <span className="text-[10px] font-mono text-muted/40 ml-auto">
                  {s.repos.length} {s.repos.length === 1 ? 'repo' : 'repos'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <UnlockCTA totalLocked={totalLockedRepos} context="gallery" />
    </section>
  );
}

function AiStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-7 h-7 rounded-full bg-accent text-bg text-xs flex items-center justify-center font-bold shrink-0">
        {n}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-text mb-1.5">{title}</div>
        <div className="text-sm text-muted leading-relaxed">{children}</div>
      </div>
    </li>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg/60 backdrop-blur p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
        {icon}
        {label}
      </div>
      <div className="text-base font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold shrink-0">
        {n}
      </span>
      <span className="text-muted leading-relaxed pt-0.5">{children}</span>
    </li>
  );
}

function RepoCard({ fullName, reason }: { fullName: string; reason: string }) {
  const [owner, name] = fullName.split('/');
  const seed = getSeedByFullName(fullName);
  return (
    <Link
      href={`/preview/${owner}/${name}`}
      className="group block rounded-xl border border-border bg-surface/40 p-5 hover:border-accent/60 transition relative"
    >
      <div className="flex items-start gap-3 mb-3">
        <img
          src={`https://avatars.githubusercontent.com/${owner}`}
          alt=""
          width={36}
          height={36}
          className="rounded-md border border-border bg-surface shrink-0"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[11px] text-muted truncate">{owner}</div>
          <div className="font-bold text-base leading-tight group-hover:text-accent transition truncate">{name}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0" />
      </div>
      <div className="flex items-start gap-2 mb-3">
        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-text leading-relaxed">{reason}</p>
      </div>
      {seed && (
        <p className="text-[11px] text-muted line-clamp-2 pt-3 border-t border-border/60 italic">
          {seed.curator_take.slice(0, 140)}…
        </p>
      )}
    </Link>
  );
}

function CopyShellButton({ bundleSlug: _ }: { bundleSlug: string }) {
  return (
    <Link
      href="/preview"
      className="px-4 py-2 rounded-lg border border-border bg-surface/40 hover:border-text/50 transition text-sm inline-flex items-center gap-2"
    >
      Browse the full directory
    </Link>
  );
}
