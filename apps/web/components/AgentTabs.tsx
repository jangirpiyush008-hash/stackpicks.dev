'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Apple, MonitorSmartphone, Lightbulb, ArrowRight, Github } from 'lucide-react';
import { AGENT_GUIDES, type AgentGuide } from '../lib/agent-guides';
import { CodeBlock } from './CodeBlock';

type OS = 'mac' | 'windows';

export function AgentTabs() {
  const [activeAgent, setActiveAgent] = useState<string>(AGENT_GUIDES[0].slug);
  const [os, setOs] = useState<OS>('mac');

  const agent = AGENT_GUIDES.find((a) => a.slug === activeAgent) ?? AGENT_GUIDES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Agent tabs */}
      <div className="rounded-2xl border border-border bg-surface/40 p-3 md:p-4 mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3 px-1">
          Pick your agent
        </div>
        <div className="flex flex-wrap gap-2">
          {AGENT_GUIDES.map((a) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => setActiveAgent(a.slug)}
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg transition border ${
                a.slug === activeAgent
                  ? 'bg-accent text-bg border-accent font-semibold'
                  : 'border-border text-muted hover:border-text hover:text-text'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active agent header */}
      <header className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-muted/70 mb-1">
          {agent.vendor}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{agent.name}</h2>
        <p className="text-muted leading-relaxed">{agent.blurb}</p>
      </header>

      {/* OS toggle */}
      <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-surface/40 mb-6">
        <OSButton active={os === 'mac'} onClick={() => setOs('mac')} icon={<Apple className="w-4 h-4" />}>
          macOS
        </OSButton>
        <OSButton active={os === 'windows'} onClick={() => setOs('windows')} icon={<MonitorSmartphone className="w-4 h-4" />}>
          Windows
        </OSButton>
      </div>

      {/* Install block */}
      <section className="mb-8 rounded-2xl border border-border bg-surface/30 p-5 md:p-6">
        <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">Install</div>
        <CodeBlock
          code={os === 'mac' ? agent.install.mac : agent.install.windows}
          label={os === 'mac' ? 'mac terminal' : 'powershell'}
        />
        {os === 'mac' && agent.install.macNote && (
          <p className="text-xs text-muted mt-2">{agent.install.macNote}</p>
        )}
        {os === 'windows' && agent.install.windowsNote && (
          <p className="text-xs text-muted mt-2">{agent.install.windowsNote}</p>
        )}
      </section>

      {/* Steps */}
      {agent.steps.map((step, i) => (
        <StepCard key={i} step={step} stepNum={i + 1} os={os} />
      ))}

      {/* Tip */}
      <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted leading-relaxed">{agent.tip}</p>
      </div>

      {/* Bottom CTAs */}
      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        <Link
          href="/build"
          className="rounded-xl border border-accent/40 bg-accent/5 p-5 hover:border-accent transition flex items-start gap-3"
        >
          <ArrowRight className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-text">Pick a bundle</div>
            <p className="text-sm text-muted">13 ready-made stacks for SaaS, mobile, AI, scraper, e-commerce.</p>
          </div>
        </Link>
        <Link
          href="/preview"
          className="rounded-xl border border-border bg-surface/40 p-5 hover:border-text/40 transition flex items-start gap-3"
        >
          <Github className="w-5 h-5 text-muted shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-text">Browse 100+ repos</div>
            <p className="text-sm text-muted">When you need a specific tool, not a whole stack.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function OSButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-4 py-2 rounded-md transition inline-flex items-center gap-2 ${
        active ? 'bg-accent text-bg font-semibold' : 'text-muted hover:text-text'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function StepCard({ step, stepNum, os }: { step: AgentGuide['steps'][number]; stepNum: number; os: OS }) {
  const cmd = step.command ? (os === 'mac' ? step.command.mac : step.command.windows) : step.commandSingle;
  return (
    <div className="mb-5 rounded-xl border border-border bg-surface/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">
          {stepNum}
        </span>
        <span className="font-semibold text-text">{step.title}</span>
      </div>
      <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{step.body}</p>
      {cmd && <CodeBlock code={cmd} label={step.commandLabel ?? 'terminal'} />}
    </div>
  );
}
