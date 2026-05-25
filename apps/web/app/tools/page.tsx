import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Video, Image as ImageIcon, Mic, Box, Palette, Monitor, BookOpen, Sparkles,
  ExternalLink, type LucideIcon,
} from 'lucide-react';
import { buildMeta, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from '@stackpicks/core/seo';
import { TOOLS_BY_USE_CASE, type ToolLicense } from '../../lib/tools-by-use-case';

export const revalidate = 86400;

export const metadata: Metadata = buildMeta({
  title: 'Best Tools by Use Case (2026) — Curated picks for video, photo, audio, 3D, design + more',
  description: 'Opinionated tool picks for builders + creators in 2026. Best for video editing, photo, audio, 3D animation, design, screen recording, note-taking. Open-source picks flagged. Honest 1-sentence takes.',
  path: '/tools',
});

const ICONS: Record<string, LucideIcon> = {
  'video-editing':       Video,
  'photo-editing':       ImageIcon,
  'ai-image-generation': Sparkles,
  'audio-podcasting':    Mic,
  '3d-animation':        Box,
  'design-prototyping':  Palette,
  'screen-recording':    Monitor,
  'note-taking':         BookOpen,
};

const LICENSE_BADGE: Record<ToolLicense, { bg: string; fg: string; label: string }> = {
  'open-source': { bg: 'bg-accent/15', fg: 'text-accent', label: 'Open-source' },
  'free':        { bg: 'bg-emerald-500/15', fg: 'text-emerald-300', label: 'Free' },
  'freemium':    { bg: 'bg-blue-500/15', fg: 'text-blue-300', label: 'Freemium' },
  'paid':        { bg: 'bg-fuchsia-500/15', fg: 'text-fuchsia-300', label: 'Paid' },
};

// FAQ — gets cited by AI Overviews when users ask "best tool for X"
const TOOLS_FAQS = [
  {
    question: 'What is the best free video editor in 2026?',
    answer: 'DaVinci Resolve — professional-grade, used in Hollywood productions, completely free. Kdenlive is the best open-source choice if you prefer pure-OSS. CapCut wins for short-form social video on mobile.',
  },
  {
    question: 'What is the best open-source Photoshop alternative?',
    answer: 'Photopea (browser-based) is the closest 1:1 Photoshop replacement and reads .psd files. GIMP is the desktop OSS choice. Krita beats both for digital painting + illustration. Affinity Photo is the best one-time-purchase option if you want to skip Adobe entirely.',
  },
  {
    question: 'Best free AI image generator?',
    answer: 'ComfyUI for power users running complex workflows locally. Fooocus for one-click great defaults. Flux is the best open-source model in 2026 (beats SDXL). Midjourney still has the highest aesthetic ceiling if you accept a $10/mo subscription.',
  },
  {
    question: 'Best open-source 3D / animation tool?',
    answer: 'Blender — free, professional, used in feature films. There is no reason to pay for Maya in 2026 unless a studio mandates it. For web 3D, Three.js + React Three Fiber are the canonical picks.',
  },
  {
    question: 'Is Figma still the best design tool in 2026?',
    answer: 'Yes for collaboration — Figma free tier covers most solo + small team work. Penpot is the actual open-source Figma alternative and is self-hostable. Inkscape covers vector / illustration work without Adobe.',
  },
];

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Tools by Use Case', path: '/tools' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(TOOLS_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            TOOLS_BY_USE_CASE.map((s) => ({ name: s.title, path: `/tools#${s.slug}` })),
            'Best tools by use case 2026'
          )),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 text-[10px] font-mono uppercase tracking-wider text-accent mb-4">
            <Sparkles className="w-3 h-3" />
            Updated May 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Best Tools by Use Case
          </h1>
          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            Opinionated picks for creators + builders. We skip the auto-generated
            "top 50" lists and tell you which one to actually pick.
            Open-source flagged where it matters; paid tools listed honestly
            where they win.
          </p>
        </header>

        {/* TOC */}
        <nav className="mb-10 p-5 rounded-2xl border border-border bg-surface/30">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">Jump to</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {TOOLS_BY_USE_CASE.map((s) => {
              const Icon = ICONS[s.slug] ?? Sparkles;
              return (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent hover:border-accent/40 hover:bg-accent/5 transition"
                >
                  <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{s.title.replace(/^Best for /, '')}</span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Sections */}
        {TOOLS_BY_USE_CASE.map((section) => {
          const Icon = ICONS[section.slug] ?? Sparkles;
          return (
            <section key={section.slug} id={section.slug} className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-accent">
                <Icon className="w-3.5 h-3.5" />
                {section.title.replace(/^Best for /, '')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{section.title}</h2>
              <p className="text-muted mb-6 leading-relaxed">{section.intro}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {section.picks.map((pick) => {
                  const badge = LICENSE_BADGE[pick.license];
                  return (
                    <div key={pick.name} className="rounded-xl border border-border bg-surface/40 p-5 hover:border-accent/40 transition flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg leading-tight">{pick.name}</h3>
                            <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${badge.bg} ${badge.fg}`}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-muted mt-1">
                            {pick.os.join(' · ')}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-text leading-relaxed mb-2">{pick.take}</p>
                      <p className="text-xs text-muted italic leading-relaxed mb-4">
                        → Best for: {pick.best_for}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-3 text-xs">
                        <a
                          href={pick.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit site
                        </a>
                        {pick.github && (
                          <a
                            href={`https://github.com/${pick.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-muted hover:text-accent transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* FAQ */}
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {TOOLS_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border bg-surface/30 p-5 open:border-accent/40"
              >
                <summary className="cursor-pointer font-semibold text-text list-none flex items-start justify-between gap-3">
                  <span>{faq.question}</span>
                  <span className="text-accent text-xl leading-none group-open:rotate-45 transition shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <section className="mt-12 p-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
          <h2 className="text-xl font-bold mb-2">Want the full open-source builder stack?</h2>
          <p className="text-sm text-muted mb-4 max-w-xl">
            This page covers creative tools. The full StackPicks directory adds 165+ open-source
            dev tools — UI, backend, DB, auth, payments — each with a curator take and "use this if / skip if".
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition">
              See pricing
            </Link>
            <Link href="/preview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-accent text-sm text-muted hover:text-text transition">
              Browse free samples
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
