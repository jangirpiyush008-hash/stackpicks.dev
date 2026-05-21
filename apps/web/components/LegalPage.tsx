import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/preview"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to directory
      </Link>
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-xs text-muted font-mono">Last updated: {lastUpdated}</p>
      </header>
      <article className="legal-prose">{children}</article>
    </div>
  );
}
