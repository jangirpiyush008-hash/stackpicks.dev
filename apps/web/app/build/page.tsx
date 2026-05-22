import Link from 'next/link';
import {
  Rocket, Smartphone, Brain, Globe, LayoutDashboard, Chrome, Workflow,
  Megaphone, Handshake, ShoppingBag, Terminal, PenLine, ArrowRight, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { USE_CASE_BUNDLES } from '../../lib/use-case-bundles';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

// Force dynamic rendering — avoid Railway prerender 404 caused by the very large
// bundles file. Re-evaluate making this static once Next.js 15.6+ ships.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = buildMeta({
  title: 'Build with AI — 13 ready-to-ship open-source stack bundles',
  description: 'Curated full-stack bundles for builders: SaaS, mobile, AI agent, web scraper, Chrome extension, e-commerce, marketing site, internal dashboard + more. Every repo you need, hand-picked for AI agents.',
  path: '/build',
});

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
  'two-weeks': '~2 weeks',
  'one-month': '~1 month',
};

export default function BuildIndexPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Build with AI', path: '/build' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            USE_CASE_BUNDLES.map((b) => ({ name: b.title, path: `/build/${b.slug}` })),
            'Open-source stack bundles for builders'
          )),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 left-1/3 w-[700px] h-[600px] bg-accent/20 rounded-full blur-[140px]" />
          <div className="absolute top-32 right-0 w-[500px] h-[500px] bg-fuchsia-500/15 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-12 md:pt-20 pb-10 md:pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{USE_CASE_BUNDLES.length} stacks · point your AI agent at any of them</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-5">
            What are you{' '}
            <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              building today?
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
            Each bundle is a full stack — UI, auth, DB, payments, the boring middleware. Open one,
            feed every repo to Claude Code / Cursor / Codex, and ship the thing.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link href="/how-to-use" className="px-4 py-2 rounded-lg border border-border bg-surface/40 hover:border-accent hover:text-accent transition">
              How to use these with an AI agent →
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of bundles */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {USE_CASE_BUNDLES.map((b) => {
            const Icon = ICONS[b.icon] ?? Rocket;
            const repoCount = b.sections.reduce((n, s) => n + s.repos.length, 0);
            return (
              <Link
                key={b.slug}
                href={`/build/${b.slug}`}
                className="group block rounded-2xl border border-border bg-surface/40 p-6 hover:border-accent/60 transition relative overflow-hidden"
              >
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${b.gradient} opacity-25 group-hover:opacity-40 transition`} />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-bg/80 backdrop-blur border border-border flex items-center justify-center group-hover:border-accent/50 transition">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-bg/60 backdrop-blur px-2 py-0.5 rounded-full border border-border">
                    {DIFFICULTY_LABEL[b.difficulty]}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition">{b.title}</h2>
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{b.pitch}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="text-xs text-muted font-mono">
                    {repoCount} repos · {b.sections.length} layers
                  </span>
                  <span className="text-xs text-muted group-hover:text-accent transition flex items-center gap-1">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
