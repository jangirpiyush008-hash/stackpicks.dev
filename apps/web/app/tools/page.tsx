import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Code, Video, Image as ImageIcon, Mic, BookOpen, Box, Bot,
  ExternalLink, Sparkles, Timer, Zap, type LucideIcon,
} from 'lucide-react';
import { buildMeta, breadcrumbJsonLd, itemListJsonLd, faqJsonLd, speakableJsonLd } from '@stackpicks/core/seo';
import { SITE } from '@stackpicks/core/constants';
import { TOOLS_BY_USE_CASE, type ToolLicense } from '../../lib/tools-by-use-case';

export const revalidate = 86400;

export const metadata: Metadata = buildMeta({
  title: 'Best AI Tools by Use Case (2026) — Real Pricing + Limits',
  description: 'Honest 2026 AI tool guide: Claude Code, Cursor, Sora, Veo, Midjourney, Flux, ElevenLabs, Suno + 30 more. Each tool shows real pricing tiers, message/credit limits, reset periods (Claude 5hr), and what you actually ship at $0/$20/$100/$200.',
  path: '/tools',
});

const ICONS: Record<string, LucideIcon> = {
  'ai-for-code':    Code,
  'ai-for-video':   Video,
  'ai-for-images':  ImageIcon,
  'ai-for-audio':   Mic,
  'ai-for-writing': BookOpen,
  'ai-for-3d':      Box,
  'ai-agents':      Bot,
};

const LICENSE_BADGE: Record<ToolLicense, { bg: string; fg: string; label: string }> = {
  'open-source': { bg: 'bg-accent/15', fg: 'text-accent', label: 'Open-source' },
  'free':        { bg: 'bg-emerald-500/15', fg: 'text-emerald-300', label: 'Free' },
  'freemium':    { bg: 'bg-blue-500/15', fg: 'text-blue-300', label: 'Freemium' },
  'paid':        { bg: 'bg-fuchsia-500/15', fg: 'text-fuchsia-300', label: 'Paid' },
};

const TOOLS_FAQS = [
  {
    question: 'How many messages can I send on Claude Pro ($20/mo) in 2026?',
    answer: 'Claude Pro gives you roughly 45 messages every 5 hours on Sonnet 4.5 (Anthropic\'s usage limits as of May 2026). Realistically: 5–7 deep coding/writing conversations per day. Hit limits often → upgrade to Max 5x ($100/mo) for ~225 msgs/5hr, or Max 20x ($200/mo) for ~900 msgs/5hr.',
  },
  {
    question: 'Cursor vs Claude Code — which one ships an MVP faster?',
    answer: 'For most builders: Cursor Pro ($20/mo) — IDE polish + best Tab autocomplete. For terminal-native devs: Claude Code on a Max 5x ($100/mo) plan ships full apps in 1 week of evening sessions. Many pros run both.',
  },
  {
    question: 'How long does it take to build a SaaS with Claude Code on the $100 Max plan?',
    answer: 'Realistic: a Next.js + Supabase SaaS MVP in 1 week of focused evening sessions on Max 5x. The plan gives ~225 messages per 5-hour window — enough to run 2–3 long agentic coding sessions per day. The $200 Max 20x plan compresses that to 2–3 days for the same scope.',
  },
  {
    question: 'What\'s the cheapest way to generate AI video in 2026?',
    answer: 'Kling 2.5 ($10/mo Standard) gives ~60 short clips per month — 5–10× cheaper than Sora at comparable quality for most prompts. Hailuo and Veo 3 (bundled with Google AI Pro at $20/mo for 10 generations) are the next tier up. Use Sora 2 only when motion physics truly matters.',
  },
  {
    question: 'Midjourney vs Flux — which one should I pick in 2026?',
    answer: 'Midjourney v7 wins on aesthetic ceiling and Discord-free web app. Flux beats it on prompt adherence and photo realism, plus open weights for commercial integration. Both at ~$10–30/mo. Pick Midjourney if you\'re art-directing; Flux if you\'re embedding image gen in a product.',
  },
  {
    question: 'How many images can I generate on Midjourney Basic ($10/mo)?',
    answer: 'Roughly 200 images per month on Midjourney Basic — that\'s ~3.3 hours of "fast" generation time. Standard ($30/mo) gets you ~900 images. Pro ($60/mo) adds Stealth mode for private outputs and ~1,800 images. Mega ($120/mo) is studio-tier with 12 concurrent jobs.',
  },
  {
    question: 'What\'s the reset window for Claude\'s usage limits?',
    answer: 'Claude resets every 5 hours from your first message in a window. If you hit the limit at 2 pm, you\'re back at 7 pm. Plan accordingly — heavy users batch deep work into the first 90 minutes of a window then loop back at the next reset.',
  },
];

export default function ToolsPage() {
  const totalTools = TOOLS_BY_USE_CASE.reduce((n, s) => n + s.picks.length, 0);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'AI Tools by Use Case', path: '/tools' },
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
          __html: JSON.stringify(speakableJsonLd({
            url: `${SITE.url}/tools`,
            cssSelectors: ['h1', '.faq-answer'],
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            TOOLS_BY_USE_CASE.map((s) => ({ name: s.title, path: `/tools#${s.slug}` })),
            'Best AI tools by use case 2026'
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 text-[10px] font-mono uppercase tracking-wider text-accent mb-4">
            <Sparkles className="w-3 h-3" />
            Updated May 2026 · {totalTools} AI tools · realistic pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Best AI Tools by Use Case
          </h1>
          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            Honest 2026 picks for code, video, image, audio, 3D, and agents — with the answer
            to the question every list dodges: <strong className="text-text">how much you actually
            ship at $20 vs $100 vs $200</strong>. Real message limits, reset windows, output volume.
          </p>
        </header>

        {/* TOC */}
        <nav className="mb-10 p-5 rounded-2xl border border-border bg-surface/30">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">Jump to</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {TOOLS_BY_USE_CASE.map((s) => {
              const Icon = ICONS[s.slug] ?? Sparkles;
              return (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent hover:border-accent/40 hover:bg-accent/5 transition"
                >
                  <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{s.title.replace(/^AI for /i, '').replace(/^AI /i, '')} ({s.picks.length})</span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Sections */}
        {TOOLS_BY_USE_CASE.map((section) => {
          const Icon = ICONS[section.slug] ?? Sparkles;
          return (
            <section key={section.slug} id={section.slug} className="mb-16 scroll-mt-20">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-accent">
                <Icon className="w-3.5 h-3.5" />
                {section.title}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{section.title}</h2>
              <p className="text-muted mb-8 leading-relaxed max-w-3xl">{section.intro}</p>

              <div className="space-y-5">
                {section.picks.map((tool) => {
                  const badge = LICENSE_BADGE[tool.license];
                  return (
                    <article key={tool.name} className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 hover:border-accent/40 transition">
                      {/* Tool header */}
                      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-xl leading-tight">{tool.name}</h3>
                            <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${badge.bg} ${badge.fg}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] font-mono text-muted">· {tool.vendor}</span>
                          </div>
                          <p className="text-sm text-text leading-relaxed mb-2">{tool.take}</p>
                          <p className="text-xs text-muted italic leading-relaxed mb-3">
                            → Best for: {tool.best_for}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs shrink-0">
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Site
                          </a>
                          {tool.github && (
                            <a
                              href={`https://github.com/${tool.github}`}
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

                      {/* Pricing tiers table */}
                      <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                        <table className="w-full text-sm min-w-[640px]">
                          <thead>
                            <tr className="text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
                              <th className="text-left py-2 pr-3 font-medium">Tier</th>
                              <th className="text-left py-2 pr-3 font-medium">Price</th>
                              <th className="text-left py-2 pr-3 font-medium">Limit</th>
                              <th className="text-left py-2 pr-3 font-medium">
                                <Timer className="w-3 h-3 inline -mt-0.5 mr-0.5" />
                                Reset
                              </th>
                              <th className="text-left py-2 pr-3 font-medium">What you ship</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tool.tiers.map((tier, i) => {
                              const isFree = tier.price === '$0';
                              return (
                                <tr key={tier.name} className={`border-b border-border/40 last:border-0 ${i === 0 ? '' : ''}`}>
                                  <td className="py-2.5 pr-3 align-top">
                                    <span className="font-semibold text-text">{tier.name}</span>
                                  </td>
                                  <td className="py-2.5 pr-3 align-top">
                                    <span className={`font-mono text-xs ${isFree ? 'text-emerald-300' : 'text-accent'}`}>
                                      {tier.price}
                                    </span>
                                  </td>
                                  <td className="py-2.5 pr-3 align-top text-xs text-muted">{tier.limit}</td>
                                  <td className="py-2.5 pr-3 align-top text-xs text-muted/80 font-mono">{tier.reset ?? '—'}</td>
                                  <td className="py-2.5 pr-3 align-top text-xs text-text/90 leading-relaxed">{tier.output}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </article>
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
                <p className="faq-answer mt-3 text-sm text-muted leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <section className="mt-12 p-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-accent">
            <Zap className="w-3 h-3" />
            Want the open-source builder stack?
          </div>
          <h2 className="text-xl font-bold mb-2">165+ OSS dev tools with curator takes</h2>
          <p className="text-sm text-muted mb-4 max-w-xl">
            This page is the AI-tools layer. The StackPicks directory adds the open-source
            stack underneath — Next.js, Supabase, Razorpay, shadcn, and 161 more, each with
            an honest "use this if / skip if" take.
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
