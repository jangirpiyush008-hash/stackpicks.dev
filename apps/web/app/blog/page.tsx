import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../../lib/blog';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Blog — open-source picks, honest takes, stack guides',
  description: 'Long-form analyses of open-source dev tools. Comparison guides, stack recommendations, AI agent frameworks, and curator picks. Written for builders shipping in 2026.',
  path: '/blog',
});

export default function BlogIndex() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => (a.published_at < b.published_at ? 1 : -1)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
            'StackPicks blog — open-source stack guides',
          )),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span>The StackPicks blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Honest takes on open-source tools.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Long-form analyses, stack guides, and comparison deep-dives. No SEO listicles.
            Each post is hand-written by a curator who's actually shipped with these tools.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-6">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group overflow-hidden"
            >
              {/* Thumbnail — auto-generated per post */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/blog/${post.slug}/opengraph-image`}
                alt={post.title}
                width={1200}
                height={630}
                loading="lazy"
                className="w-full h-auto border-b border-border"
              />
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-muted flex-wrap">
                  <span className="text-accent">{post.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.reading_time} min
                  </span>
                  <span>·</span>
                  <span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition tracking-tight leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-accent">
                  Read post
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted mt-12 text-center">
          More long-form drops weekly. Lifetime members get them first via the Sunday newsletter.
        </p>
      </div>
    </>
  );
}
