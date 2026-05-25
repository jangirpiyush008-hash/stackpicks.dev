import Link from 'next/link';
import { Bot } from 'lucide-react';
import { AgentTabs } from '../../components/AgentTabs';
import { SITE } from '@stackpicks/core/constants';

export const metadata = {
  title: 'How to use these repos with an AI agent',
  description: 'Step-by-step install + usage for Claude Code, Cursor, Codex, Antigravity, VS Code, and Aider — Mac and Windows.',
};

// HowTo JSON-LD — wins the HowTo SERP feature on Google + gets cited by AI
// Overviews / ChatGPT when users ask "how do I use OSS repos with my AI agent".
const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to wire a StackPicks repo bundle to an AI coding agent',
  description: 'Install an AI coding agent (Cursor, Cline, Claude Code, Aider, or VS Code Copilot), open a StackPicks bundle, paste the install commands, and let the agent write the integration code.',
  totalTime: 'PT10M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  tool: [
    { '@type': 'HowToTool', name: 'Cursor IDE' },
    { '@type': 'HowToTool', name: 'Claude Code CLI' },
    { '@type': 'HowToTool', name: 'Cline (VS Code extension)' },
    { '@type': 'HowToTool', name: 'Aider CLI' },
  ],
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Pick your AI coding agent', text: 'Choose Cursor, Claude Code, Cline, Aider, or VS Code Copilot. Cursor is best for most builders; Cline is the best free option.', url: `${SITE.url}/how-to-use#agent` },
    { '@type': 'HowToStep', position: 2, name: 'Install the agent', text: 'Follow the OS-specific install command (Mac or Windows). Copy-paste from the OS toggle on this page.', url: `${SITE.url}/how-to-use#install` },
    { '@type': 'HowToStep', position: 3, name: 'Open a StackPicks bundle', text: 'Visit /build and open the bundle that matches what you are shipping — Ship a SaaS, Build a Mobile App, AI Agent, Scraper, Dashboard, Marketing Site, and more.', url: `${SITE.url}/build` },
    { '@type': 'HowToStep', position: 4, name: 'Feed the bundle to your agent', text: 'Paste the curator takes + install commands as context. The agent reads the bundle and writes the integration code, install steps, and config.', url: `${SITE.url}/how-to-use#feed` },
    { '@type': 'HowToStep', position: 5, name: 'Ship the product', text: 'Review the generated code, run the install commands, deploy. With this workflow, MVPs ship in 48 hours instead of weeks.', url: `${SITE.url}/how-to-use#ship` },
  ],
};

export default function HowToUsePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }}
      />
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
