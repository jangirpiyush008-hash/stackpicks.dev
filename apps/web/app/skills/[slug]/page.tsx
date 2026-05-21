import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Megaphone, Handshake, Instagram, PenLine, Brain, BarChart3, Cloud, Workflow,
  Palette, Smartphone, Server, Rocket,
  ArrowLeft, ArrowRight, Sparkles, Check, type LucideIcon,
} from 'lucide-react';
import { SKILL_TRACKS, getSkillTrackBySlug } from '../../../lib/skill-tracks';
import { getSeedByFullName } from '../../../lib/preview-source';
import { UnlockCTA } from '../../../components/UnlockCTA';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Free preview: first N tools render fully. The rest sit behind the paywall.
const FREE_TOOL_LIMIT = 6;

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSkillTrackBySlug(slug);
  if (!s) return {};
  return {
    title: `${s.title} — ${s.repos.length} OSS tools curated`,
    description: s.description,
  };
}

export default async function SkillTrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getSkillTrackBySlug(slug);
  if (!track) notFound();

  const Icon = ICONS[track.icon] ?? Brain;
  const visible = track.repos.slice(0, FREE_TOOL_LIMIT);
  const lockedCount = Math.max(0, track.repos.length - FREE_TOOL_LIMIT);
  const lockedSubcategories = Array.from(
    new Set(track.repos.slice(FREE_TOOL_LIMIT).map((r) => r.subcategory))
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${track.gradient} opacity-30 pointer-events-none`} />
        <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-10 md:pb-14">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All skill tracks
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-bg/80 backdrop-blur border border-border flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-3">
                {track.title}
              </h1>
              <p className="text-base md:text-lg text-muted leading-relaxed">{track.description}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-muted">
              For: {track.audience}
            </span>
            <span className="px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-muted">
              {track.repos.length} tools · {FREE_TOOL_LIMIT} free preview
            </span>
          </div>
        </div>
      </section>

      {/* Free preview tools */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Top {FREE_TOOL_LIMIT} tools — free preview</h2>
          <span className="text-xs text-muted ml-auto">
            {lockedCount > 0 && `${lockedCount} more locked`}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((r) => (
            <ToolCard key={r.full_name} repo={r} />
          ))}
        </div>

        {/* Locked teaser */}
        {lockedCount > 0 && (
          <div className="mt-12">
            <div className="rounded-2xl border border-dashed border-border bg-surface/20 p-6 md:p-8 mb-6">
              <div className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
                {lockedCount} more curated tools across these layers · members only
              </div>
              <ul className="grid sm:grid-cols-2 gap-2 select-none">
                {lockedSubcategories.map((cat) => (
                  <li key={cat} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                    <span className="text-muted line-through opacity-50">{cat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <UnlockCTA totalLocked={lockedCount} context="gallery" />
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCard({ repo }: { repo: typeof SKILL_TRACKS[number]['repos'][number] }) {
  const [owner, name] = repo.full_name.split('/');
  const seed = getSeedByFullName(repo.full_name);

  return (
    <Link
      href={`/preview/${owner}/${name}`}
      className="group block rounded-xl border border-border bg-surface/40 p-5 hover:border-accent/60 transition"
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
          <div className="font-bold text-base leading-tight group-hover:text-accent transition truncate">
            {name}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0" />
      </div>
      <div className="flex items-start gap-2 mb-3">
        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-text leading-relaxed">{repo.why}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted/70">
          {repo.subcategory}
        </span>
        {seed && (
          <span className="text-[10px] font-mono text-accent inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Has curator take
          </span>
        )}
      </div>
    </Link>
  );
}
