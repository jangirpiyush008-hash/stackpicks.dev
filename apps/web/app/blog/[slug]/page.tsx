import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import { getBlogPostBySlug, BLOG_POSTS, getAllBlogSlugs } from '../../../lib/blog';
import { BlogContent } from '../../../components/BlogContent';
import { AuthorByline, QuickAnswer } from '../../../components/AuthorByline';
import { buildMeta, breadcrumbJsonLd, faqJsonLd, speakableJsonLd } from '@stackpicks/core/seo';
import { SITE } from '@stackpicks/core/constants';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return buildMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  // Article JSON-LD — eligible for Google's Article rich result
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE.url}/blog/${slug}/opengraph-image`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author,
      url: SITE.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${slug}` },
  };

  // Related posts (same category)
  const related = BLOG_POSTS
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.category, path: '/blog' },
            { name: post.title, path: `/blog/${slug}` },
          ])),
        }}
      />
      {post.faqs && post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(post.faqs)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(speakableJsonLd({
            url: `${SITE.url}/blog/${slug}`,
            cssSelectors: ['h1', '.quick-answer', '.faq-answer'],
          })),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All posts
        </Link>

        <header className="mb-10 pb-6 border-b border-border">
          {/* Hero image — dynamic, auto-generated per post via opengraph-image.tsx */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/blog/${slug}/opengraph-image`}
            alt={post.title}
            width={1200}
            height={630}
            loading="eager"
            className="w-full h-auto rounded-2xl border border-border mb-8"
          />

          <div className="flex items-baseline gap-3 mb-3 text-[10px] font-mono uppercase tracking-wider text-muted flex-wrap">
            <span className="text-accent">{post.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <AuthorByline
          author={post.author}
          publishedAt={post.published_at}
          updatedAt={post.updated_at}
          readingTime={post.reading_time}
        />

        {post.quick_answer && (
          <QuickAnswer>{post.quick_answer}</QuickAnswer>
        )}

        <BlogContent content={post.content} />

        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {post.faqs.map((faq) => (
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
        )}

        <section className="mt-16 mb-8 p-6 md:p-8 rounded-2xl border border-accent/40 bg-accent/5 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Want the full curated stack?
          </h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            StackPicks lifetime members get 100+ open-source tools with curator takes,
            13 ready-to-ship stack bundles, and 12 skill tracks. ₹99 lifetime.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition"
          >
            See pricing
          </Link>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">More in {post.category}</h2>
            <div className="space-y-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block p-4 rounded-lg border border-border hover:border-accent transition"
                >
                  <div className="font-bold mb-1">{p.title}</div>
                  <p className="text-xs text-muted line-clamp-1">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
