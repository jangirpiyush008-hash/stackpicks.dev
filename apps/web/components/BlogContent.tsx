/**
 * Lightweight markdown-ish renderer for blog posts.
 * Avoids the bundle weight of full markdown parsers — we control the input.
 */
import Link from 'next/link';

export function BlogContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  // Parse inline markdown: **bold**, [text](url), `code`
  const renderInline = (text: string, baseKey: number): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let partKey = 0;

    while (remaining.length > 0) {
      // Link [text](url)
      const linkMatch = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)/s);
      if (linkMatch) {
        if (linkMatch[1]) parts.push(<span key={`${baseKey}-${partKey++}`}>{linkMatch[1]}</span>);
        const isInternal = linkMatch[3].startsWith('/');
        if (isInternal) {
          parts.push(
            <Link
              key={`${baseKey}-${partKey++}`}
              href={linkMatch[3]}
              className="text-accent hover:underline"
            >
              {linkMatch[2]}
            </Link>
          );
        } else {
          parts.push(
            <a
              key={`${baseKey}-${partKey++}`}
              href={linkMatch[3]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {linkMatch[2]}
            </a>
          );
        }
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Bold **text**
      const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*/s);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(<span key={`${baseKey}-${partKey++}`}>{boldMatch[1]}</span>);
        parts.push(<strong key={`${baseKey}-${partKey++}`} className="font-bold text-text">{boldMatch[2]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Inline code `text`
      const codeMatch = remaining.match(/^(.*?)`([^`]+)`/s);
      if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={`${baseKey}-${partKey++}`}>{codeMatch[1]}</span>);
        parts.push(
          <code key={`${baseKey}-${partKey++}`} className="px-1.5 py-0.5 rounded bg-surface text-accent font-mono text-[0.9em]">
            {codeMatch[2]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // No more matches — push remainder
      parts.push(<span key={`${baseKey}-${partKey++}`}>{remaining}</span>);
      remaining = '';
    }

    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl md:text-3xl font-bold mt-12 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Table (starts with |)
    if (line.startsWith('|') && lines[i + 1]?.startsWith('|') && lines[i + 1]?.includes('---')) {
      const headerCells = line.split('|').filter((c) => c.trim()).map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').filter((c) => c.trim()).map((c) => c.trim()));
        i++;
      }
      elements.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                {headerCells.map((h, j) => (
                  <th key={j} className="text-left py-2 px-3 font-mono uppercase tracking-wider text-xs text-muted">
                    {renderInline(h, j)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-b border-border/50">
                  {r.map((c, ci) => (
                    <td key={ci} className="py-2 px-3 align-top">
                      {renderInline(c, ci)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Code block ```
    if (line.startsWith('```')) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={key++} className="my-6 p-4 rounded-lg bg-surface/60 border border-border overflow-x-auto text-sm font-mono leading-relaxed">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // List item
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 space-y-1.5 list-disc list-outside pl-6">
          {items.map((it, j) => (
            <li key={j} className="text-text leading-relaxed">{renderInline(it, j)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="my-4 space-y-1.5 list-decimal list-outside pl-6">
          {items.map((it, j) => (
            <li key={j} className="text-text leading-relaxed">{renderInline(it, j)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="my-4 text-text leading-relaxed">
        {renderInline(line, key)}
      </p>
    );
    i++;
  }

  return <article className="prose-content">{elements}</article>;
}
