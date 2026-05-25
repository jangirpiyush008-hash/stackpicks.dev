import Link from 'next/link';
import {
  Megaphone, Handshake, Instagram, PenLine, Brain, BarChart3, Cloud, Workflow,
  Palette, Smartphone, Server, Rocket,
  ArrowRight, Sparkles, type LucideIcon,
} from 'lucide-react';
import { SKILL_TRACKS } from '../../lib/skill-tracks';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const metadata = buildMeta({
  title: '12 Skill Tracks — open-source toolkits by discipline',
  description: 'Curated open-source tools by discipline: marketing, sales outreach, social media, LinkedIn personal brand, AI/ML, data analytics, DevOps, automation, design, mobile, backend APIs, founder OS. The exact OSS pros actually use.',
  path: '/skills',
});

const ICONS: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  handshake: Handshake,
  instagram: Instagram,
  'pen-line': PenLine,
  brain: Brain,
  'bar-chart-3': BarChart3,
  cloud: Cloud,
  workflow: Workflow,
  palette: Palette,
  smartphone: Smartphone,
  server: Server,
  rocket: Rocket,
};

export default function SkillsIndexPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Skills', path: '/skills' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            SKILL_TRACKS.map((s) => ({ name: s.title, path: `/skills/${s.slug}` })),
            'Open-source skill tracks by discipline'
          )),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-accent/20 rounded-full blur-[140px]" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-14 md:pt-20 pb-10 md:pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{SKILL_TRACKS.length} skill tracks · OSS toolkits curated by discipline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-5">
            The tools{' '}
            <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              pros actually use.
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
            Each skill track is a personal toolkit — what marketers, SDRs, creators, AI engineers,
            and data folks reach for daily. Not "build a product", but "do this job better".
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SKILL_TRACKS.map((s) => {
            const Icon = ICONS[s.icon] ?? Brain;
            return (
              <Link
                key={s.slug}
                href={`/skills/${s.slug}`}
                className="group block rounded-2xl border border-border bg-surface/40 p-5 md:p-6 hover:border-accent/60 transition relative overflow-hidden"
              >
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${s.gradient} opacity-25 group-hover:opacity-40 transition`} />
                <div className="w-11 h-11 rounded-lg bg-bg/80 backdrop-blur border border-border flex items-center justify-center mb-4 group-hover:border-accent/50 transition">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition">{s.title}</h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-4">{s.pitch}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="text-xs text-muted font-mono">
                    {s.repos.length} tools
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
