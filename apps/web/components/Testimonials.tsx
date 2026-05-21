import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../lib/testimonials';

export function Testimonials() {
  return (
    <section className="py-12 md:py-16 border-t border-border">
      <header className="text-center max-w-2xl mx-auto mb-10 md:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-4">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span>What members say</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">
          Sharp takes, real wins.
        </h2>
        <p className="text-muted">
          Members from across India and the world ship with StackPicks. Here&apos;s what they
          tell us in the Discord.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} delay={i * 0.05} />
        ))}
      </div>

      <p className="text-center text-xs text-muted mt-10 px-4">
        Joined by builders from {' '}
        <span className="text-text">Bengaluru</span>, <span className="text-text">Mumbai</span>,{' '}
        <span className="text-text">Gurgaon</span>, <span className="text-text">Hyderabad</span>,{' '}
        <span className="text-text">Delhi</span>, <span className="text-text">San Francisco</span>,{' '}
        <span className="text-text">Berlin</span>, <span className="text-text">Dublin</span>,{' '}
        <span className="text-text">Mexico City</span>, and 30+ more cities.
      </p>
    </section>
  );
}

function TestimonialCard({ t, delay }: { t: typeof TESTIMONIALS[number]; delay: number }) {
  return (
    <article
      className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 hover:border-text/30 transition relative"
      style={{ animationDelay: `${delay}s` }}
    >
      <Quote className="absolute top-4 right-4 w-5 h-5 text-accent/30" />
      <p className="text-sm md:text-[15px] text-text/90 leading-relaxed mb-5 pr-6">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-bg font-bold text-sm shrink-0`}
        >
          {t.initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{t.name}</div>
          <div className="text-xs text-muted truncate">
            {t.role} · <span className="font-mono">{t.location}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
