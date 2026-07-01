// AutoDM blog post page — full GEO armor (quick_answer + FAQs + JSON-LD + dated)
// per CLAUDE.md mandatory post-write audit.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import {
  getAutoDmBlogPost, listAutoDmBlogPosts, faqJsonLd,
} from '@/lib/autodm-blog';
import { BlogContent } from '@/components/BlogContent';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return listAutoDmBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getAutoDmBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://autodm.stackpicks.dev/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
    },
  };
}

export default async function AutoDmBlogPost({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAutoDmBlogPost(slug);
  if (!post) notFound();

  const related = listAutoDmBlogPosts().filter((p) => p.slug !== slug).slice(0, 2);

  // Article + FAQPage JSON-LD for Google rich results + AI engine ingestion
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'StackPicks AutoDM', url: 'https://autodm.stackpicks.dev' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://autodm.stackpicks.dev/blog/${slug}` },
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(post) }} />

      {/* Back link */}
      <Link
        href="/autodm/blog"
        className="text-xs text-muted hover:text-text inline-flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-3 h-3" /> All posts
      </Link>

      {/* Meta strip */}
      <div className="flex items-center gap-2 mb-3 text-xs text-muted flex-wrap">
        <span className="font-mono uppercase tracking-widest text-accent">{post.category}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.reading_time} min</span>
        <span>·</span>
        <time dateTime={post.published_at}>
          {new Date(post.published_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
        {post.updated_at !== post.published_at && (
          <span className="text-accent">· updated {new Date(post.updated_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}</span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight">{post.title}</h1>
      <p className="mt-3 text-muted text-base leading-relaxed">{post.excerpt}</p>

      {/* Quick answer — front-loaded for AI engines */}
      <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-accent mb-1.5">
          Quick answer
        </div>
        <p className="text-sm leading-relaxed text-text">{post.quick_answer}</p>
      </div>

      {/* Body */}
      <article className="prose-blog mt-8">
        <BlogContent content={post.content} />
      </article>

      {/* FAQs — rendered AND surfaced via FAQPage JSON-LD */}
      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xl font-bold mb-5">Frequently asked</h2>
        <div className="space-y-3">
          {post.faqs.map((f, i) => (
            <details key={i} className="rounded-lg border border-border bg-bg-card/30 group">
              <summary className="cursor-pointer list-none p-4 font-medium text-sm flex items-center justify-between gap-3">
                {f.question}
                <span className="text-muted group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-muted leading-relaxed">{f.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Sources */}
      {post.sources.length > 0 && (
        <section className="mt-10">
          <h3 className="text-sm font-semibold mb-2">Sources</h3>
          <ul className="text-xs text-muted space-y-1">
            {post.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="hover:text-text" target="_blank" rel="noopener">→ {s.label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Internal-link bridge into the product */}
      <section className="mt-12 pt-8 border-t border-border">
        <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
          <div className="font-semibold">Stop debugging Meta's API. Start sending.</div>
          <p className="text-sm text-muted mt-2">
            StackPicks AutoDM ships with Private Reply, follower-aware bodies, account warming,
            and an AI conversation agent that replies to inbound DMs in your voice. 90-second setup. No browser bots.
          </p>
          <Link
            href="/autodm/connect"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-accent text-bg px-5 py-2.5 rounded-full hover:bg-accent/90 transition"
          >
            Connect Instagram <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold mb-3">More from the blog</h3>
          <div className="space-y-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/autodm/blog/${r.slug}`}
                className="block rounded-lg border border-border hover:border-accent/40 bg-bg-card/30 p-4 transition group"
              >
                <div className="text-sm font-medium group-hover:text-accent transition">{r.title}</div>
                <div className="text-xs text-muted mt-1 line-clamp-1">{r.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
