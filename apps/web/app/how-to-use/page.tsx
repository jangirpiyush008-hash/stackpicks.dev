import Link from 'next/link';
import { Bot } from 'lucide-react';
import { AgentTabs } from '../../components/AgentTabs';

export const metadata = {
  title: 'How to use these repos with an AI agent',
  description: 'Step-by-step install + usage for Claude Code, Cursor, Codex, Antigravity, VS Code, and Aider — Mac and Windows.',
};

export default function HowToUsePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/20 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 pt-12 md:pt-16 pb-10 md:pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Bot className="w-3.5 h-3.5 text-accent" />
            <span>6 AI agents · Mac + Windows · copy-paste commands</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            Wire StackPicks to your{' '}
            <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              AI agent.
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
            Install once, then point any agent at a bundle or an individual repo.
            The agent reads our curator takes and writes the integration.
          </p>
          <p className="text-sm text-muted mt-3">
            <Link href="/build" className="text-accent underline underline-offset-2">
              Open a bundle →
            </Link>
          </p>
        </div>
      </section>

      <AgentTabs />
    </div>
  );
}
