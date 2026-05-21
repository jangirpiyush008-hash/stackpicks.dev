import Link from 'next/link';
import {
  Apple, MonitorSmartphone, Terminal, Sparkles, Box, FlaskConical, Bot,
  Lightbulb, ArrowRight, Github, ExternalLink,
} from 'lucide-react';
import { CodeBlock } from '../../components/CodeBlock';

export const metadata = {
  title: 'How to use these repos with an AI agent',
  description: 'Step-by-step install + usage for Claude Code, Cursor, Codex, Antigravity, VS Code, and Aider — on Mac and Windows.',
};

export default function HowToUsePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/20 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Bot className="w-3.5 h-3.5 text-accent" />
            <span>6 AI agents · Mac + Windows · copy-paste commands</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            Wire StackPicks to your{' '}
            <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              AI agent.
            </span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Install once, then point any agent at a <Link href="/build" className="text-accent underline underline-offset-2">bundle</Link> or an individual repo. The agent reads our curator takes and writes the integration.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* TOC */}
        <nav className="rounded-2xl border border-border bg-surface/40 p-5 mb-12 not-prose">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Table of contents</div>
          <ol className="grid sm:grid-cols-2 gap-2 text-sm">
            <TocLink href="#prereqs" label="0 · Prerequisites (Mac + Windows)" />
            <TocLink href="#claude-code" label="1 · Claude Code" />
            <TocLink href="#cursor" label="2 · Cursor" />
            <TocLink href="#codex" label="3 · OpenAI Codex" />
            <TocLink href="#antigravity" label="4 · Google Antigravity" />
            <TocLink href="#vscode" label="5 · VS Code + extensions" />
            <TocLink href="#aider" label="6 · Aider (terminal)" />
            <TocLink href="#how-to-feed" label="7 · How to feed repos to an agent" />
            <TocLink href="#workflow" label="8 · A real end-to-end flow" />
          </ol>
        </nav>

        {/* ─────────────── 0. Prereqs ─────────────── */}
        <Section id="prereqs" eyebrow="00 · Setup" title="Prerequisites (one-time)">
          <p>You need three things on either OS: <strong>Node.js 20+</strong>, <strong>git</strong>, and a terminal. The
          install commands below are copy-paste-safe.</p>

          <Os name="Mac (with Homebrew)" icon={<Apple className="w-4 h-4" />}>
            <CodeBlock
              label="terminal"
              code={`# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then:
brew install node@20 git pnpm`}
            />
          </Os>

          <Os name="Windows (PowerShell, run as admin)" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <CodeBlock
              label="powershell"
              code={`# Install winget if missing (Windows 11 has it by default)
winget install --id OpenJS.NodeJS.LTS
winget install --id Git.Git
winget install --id pnpm.pnpm`}
            />
            <p className="text-sm mt-2">
              <strong>Tip:</strong> on Windows, prefer <strong>WSL 2 + Ubuntu</strong> for a smoother dev
              loop. Then follow the Mac instructions inside WSL.
            </p>
            <CodeBlock
              label="powershell (one-time)"
              code={`wsl --install -d Ubuntu`}
            />
          </Os>

          <p className="text-sm">Verify after installing:</p>
          <CodeBlock
            label="any shell"
            code={`node -v   # should print v20.x
git --version
pnpm -v`}
          />
        </Section>

        {/* ─────────────── 1. Claude Code ─────────────── */}
        <Section
          id="claude-code"
          eyebrow="01 · Anthropic"
          title="Claude Code"
          subtitle="Terminal-first agent from Anthropic. Best at large-codebase reasoning and end-to-end tasks."
        >
          <Os name="Mac install" icon={<Apple className="w-4 h-4" />}>
            <CodeBlock
              label="terminal"
              code={`curl -fsSL https://claude.ai/install.sh | bash

# OR via npm:
npm install -g @anthropic-ai/claude-code

# Then:
claude --version`}
            />
          </Os>
          <Os name="Windows install" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <CodeBlock
              label="powershell"
              code={`# Recommended path: install in WSL Ubuntu (see step 0)
# Then in WSL:
curl -fsSL https://claude.ai/install.sh | bash

# Native Windows (PowerShell):
npm install -g @anthropic-ai/claude-code`}
            />
          </Os>

          <Step n={1} title="Authenticate">
            <CodeBlock label="terminal" code={`claude    # opens a browser to log in once, then keeps the session`} />
          </Step>

          <Step n={2} title="Open a project">
            <CodeBlock label="terminal" code={`cd ~/projects/my-saas
claude`} />
            <p>The terminal becomes an interactive agent. It reads files, runs commands, edits code.</p>
          </Step>

          <Step n={3} title="Point it at a StackPicks bundle">
            <p>Inside the Claude prompt, paste:</p>
            <CodeBlock label="claude prompt" code={`I'm building a SaaS. Use this bundle as the source of truth for the stack:
https://stackpicksdev-production.up.railway.app/build/ship-a-saas

Set up Next.js 15 + shadcn/ui + better-auth + Supabase + Razorpay following the bundle order.
Stop and confirm with me after each layer.`} />
          </Step>

          <Tip>
            Claude Code respects <code>CLAUDE.md</code> in the project root. Drop a one-page rules file
            (we keep one in the StackPicks repo). It will use the rules on every task.
          </Tip>
        </Section>

        {/* ─────────────── 2. Cursor ─────────────── */}
        <Section
          id="cursor"
          eyebrow="02 · Anysphere"
          title="Cursor"
          subtitle="VS Code-forked IDE with an AI panel. Best when you want a GUI and inline Tab autocomplete."
        >
          <Os name="Mac install" icon={<Apple className="w-4 h-4" />}>
            <CodeBlock label="terminal" code={`brew install --cask cursor`} />
            <p className="text-sm">Or download the <code>.dmg</code> from cursor.com.</p>
          </Os>
          <Os name="Windows install" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <CodeBlock label="powershell" code={`winget install --id Anysphere.Cursor`} />
          </Os>

          <Step n={1} title="Sign in + pick model">
            <p>Open Cursor → settings → sign in. Pick <strong>claude-sonnet-4.5</strong> or <strong>gpt-5</strong> as the default model.</p>
          </Step>

          <Step n={2} title="Open the project">
            <CodeBlock label="terminal" code={`cd ~/projects/my-saas
cursor .`} />
          </Step>

          <Step n={3} title="Use @docs to add a StackPicks repo">
            <p>Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs font-mono">⌘L</kbd> (Mac) or
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs font-mono ml-1">Ctrl+L</kbd> (Windows)
            to open the chat. Then:</p>
            <CodeBlock label="cursor chat" code={`@docs Add docs for shadcn-ui/ui (https://ui.shadcn.com)
@docs Add docs for Razorpay (https://razorpay.com/docs)

Now scaffold a Next.js app, install shadcn, wire Razorpay checkout per the docs above.`} />
          </Step>

          <Tip>
            Cursor reads <code>.cursor/rules</code> directory. Create <code>.cursor/rules/stack.md</code>
            with your stack rules so every chat starts with context.
          </Tip>
        </Section>

        {/* ─────────────── 3. Codex ─────────────── */}
        <Section
          id="codex"
          eyebrow="03 · OpenAI"
          title="OpenAI Codex"
          subtitle="Browser-based agent that does long-running tasks on a virtual machine. Best for parallel work — fire off 10 PRs at once."
        >
          <Os name="Mac install" icon={<Apple className="w-4 h-4" />}>
            <p className="text-sm">Codex is mainly cloud-based — no install needed. Go to chatgpt.com/codex.</p>
            <p className="text-sm">For local CLI access:</p>
            <CodeBlock label="terminal" code={`npm install -g @openai/codex-cli
codex login`} />
          </Os>
          <Os name="Windows install" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <CodeBlock label="powershell" code={`npm install -g @openai/codex-cli
codex login`} />
          </Os>

          <Step n={1} title="Connect your GitHub repo">
            <p>On chatgpt.com/codex, click <strong>Settings → GitHub</strong> and authorize Codex on the
            repos you want it to act on.</p>
          </Step>

          <Step n={2} title="Send a task with the bundle URL">
            <CodeBlock label="codex prompt" code={`Repo: jangirpiyush008-hash/my-saas
Branch: feat/payments

Task:
Implement Razorpay subscription checkout. Reference the bundle:
https://stackpicksdev-production.up.railway.app/build/ship-a-saas

Use core/razorpay/ for the order + verification logic.
Open a PR when done.`} />
          </Step>

          <Tip>
            Codex shines for parallel work — open 5 tasks at once. Each gets its own sandboxed VM and
            opens a separate PR. Great for tedious refactors.
          </Tip>
        </Section>

        {/* ─────────────── 4. Antigravity ─────────────── */}
        <Section
          id="antigravity"
          eyebrow="04 · Google"
          title="Google Antigravity"
          subtitle="Agentic IDE from Google built around Gemini 3. Treats the IDE as a control surface for autonomous agents that drive editor, terminal, and browser."
        >
          <Os name="Mac install" icon={<Apple className="w-4 h-4" />}>
            <CodeBlock label="terminal" code={`# Download the macOS build from antigravity.google
# Or via Homebrew once the cask lands:
brew install --cask google-antigravity`} />
          </Os>
          <Os name="Windows install" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <p className="text-sm">Download the <code>.exe</code> installer from antigravity.google.
            Once installed, sign in with your Google account.</p>
          </Os>

          <Step n={1} title="Open the Manager view">
            <p>Antigravity has two surfaces: the IDE (familiar VS Code shell) and the <strong>Manager</strong>
            (where agents are dispatched, monitored, and review your work). Start in Manager.</p>
          </Step>

          <Step n={2} title="Spawn an agent against a bundle">
            <p>In Manager, create a new task:</p>
            <CodeBlock label="antigravity task" code={`Build the auth layer for my SaaS.

Reference stack:
https://stackpicksdev-production.up.railway.app/build/ship-a-saas

Specifically use: better-auth/better-auth + supabase/supabase.
Open the browser tab on http://localhost:3000 to verify signup flow.`} />
          </Step>

          <Tip>
            Antigravity agents can drive the browser — they will literally click through your signup form
            and report what broke. Useful for end-to-end visual debugging.
          </Tip>
        </Section>

        {/* ─────────────── 5. VS Code ─────────────── */}
        <Section
          id="vscode"
          eyebrow="05 · Microsoft"
          title="VS Code + AI extensions"
          subtitle="The classic. Pair it with Copilot, Cline, or Continue for AI workflows."
        >
          <Os name="Mac install" icon={<Apple className="w-4 h-4" />}>
            <CodeBlock label="terminal" code={`brew install --cask visual-studio-code`} />
          </Os>
          <Os name="Windows install" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <CodeBlock label="powershell" code={`winget install --id Microsoft.VisualStudioCode`} />
          </Os>

          <Step n={1} title="Pick an AI extension">
            <p>Three solid choices, ranked by use case:</p>
            <ul>
              <li><strong>GitHub Copilot</strong> — best inline autocomplete, $10/mo</li>
              <li><strong>Cline</strong> — agentic, free + BYO API key, opens terminals and runs tools</li>
              <li><strong>Continue</strong> — open-source alternative, BYO model</li>
            </ul>
            <CodeBlock label="vscode (cmd palette)" code={`> Extensions: Install Extensions
# Search and install:
GitHub Copilot
Cline
Continue`} />
          </Step>

          <Step n={2} title="Wire a StackPicks bundle via Cline">
            <p>Open Cline (left sidebar) and paste:</p>
            <CodeBlock label="cline prompt" code={`Read https://stackpicksdev-production.up.railway.app/build/ai-agent

Scaffold a Next.js project, install pgvector locally via Docker, install Ollama,
and create a /chat route that retrieves from pgvector and streams from Ollama.`} />
          </Step>

          <Tip>
            VS Code + Cline is the cheapest agentic stack — no IDE license fee, just LLM API costs.
          </Tip>
        </Section>

        {/* ─────────────── 6. Aider ─────────────── */}
        <Section
          id="aider"
          eyebrow="06 · Aider"
          title="Aider"
          subtitle="Terminal AI pair-programmer. Edits files, commits to git automatically. Lightweight, model-agnostic."
        >
          <Os name="Mac install" icon={<Apple className="w-4 h-4" />}>
            <CodeBlock label="terminal" code={`brew install aider

# Or via pip:
python -m pip install aider-chat`} />
          </Os>
          <Os name="Windows install" icon={<MonitorSmartphone className="w-4 h-4" />}>
            <CodeBlock label="powershell" code={`python -m pip install aider-chat`} />
          </Os>

          <Step n={1} title="Set your API key">
            <CodeBlock label="any shell" code={`# Anthropic:
export ANTHROPIC_API_KEY=sk-ant-...

# Or OpenAI:
export OPENAI_API_KEY=sk-...`} />
          </Step>

          <Step n={2} title="Launch in a project">
            <CodeBlock label="terminal" code={`cd ~/projects/my-saas
aider --model sonnet  # or --model gpt-5`} />
          </Step>

          <Step n={3} title="Add files + describe the task">
            <CodeBlock label="aider prompt" code={`/add app/layout.tsx app/page.tsx

Use https://stackpicksdev-production.up.railway.app/build/ship-a-saas
as the canonical stack reference. Add a hero, pricing, and auth modal
using shadcn/ui + better-auth.`} />
          </Step>

          <Tip>Aider auto-commits after every change with a sensible message. Great for solo work and clean git history.</Tip>
        </Section>

        {/* ─────────────── 7. How to feed ─────────────── */}
        <Section
          id="how-to-feed"
          eyebrow="07 · Pattern"
          title="How to feed StackPicks repos to any agent"
        >
          <p>Three patterns that work in every agent above:</p>
          <h3>Pattern A — paste a bundle URL</h3>
          <CodeBlock
            label="any agent"
            code={`Reference stack: https://stackpicksdev-production.up.railway.app/build/ship-a-saas
Implement the framework + UI + auth layers in that order.`}
          />
          <p>The agent fetches the URL, reads the curator takes, picks the right repos. Works for any of the {' '}
            <Link href="/build" className="text-accent underline underline-offset-2">12 bundles</Link>.</p>

          <h3>Pattern B — paste a single repo URL with the take</h3>
          <CodeBlock
            label="any agent"
            code={`Use shadcn-ui/ui — see https://stackpicksdev-production.up.railway.app/preview/shadcn-ui/ui

Install via npx shadcn@latest init.
Add components: button, card, dialog, form, input.`}
          />

          <h3>Pattern C — clone & let the agent read locally</h3>
          <CodeBlock
            label="terminal"
            code={`# Some bundles include self-hosted tools (Supabase, Medusa, Payload).
# Clone them so your agent can read source directly:
git clone https://github.com/supabase/supabase ~/refs/supabase
git clone https://github.com/medusajs/medusa ~/refs/medusa

# Then in your agent:
# "Read ~/refs/supabase/apps/docs to understand the Auth API,
#  then implement auth in this project."`}
          />
        </Section>

        {/* ─────────────── 8. Real flow ─────────────── */}
        <Section
          id="workflow"
          eyebrow="08 · End-to-end"
          title="A real day-of-shipping flow"
        >
          <ol>
            <li>
              <strong>Pick a bundle.</strong> Visit <Link href="/build" className="text-accent underline underline-offset-2">/build</Link>,
              open the one closest to what you&apos;re shipping (say, <em>Ship a SaaS</em>).
            </li>
            <li>
              <strong>Scaffold the project shell.</strong> In your terminal:
              <CodeBlock
                label="terminal"
                code={`pnpm create next-app@latest my-saas --typescript --tailwind --app
cd my-saas
git init && git add -A && git commit -m "Initial scaffold"`}
              />
            </li>
            <li>
              <strong>Drop a CLAUDE.md / .cursor/rules / agents-md.</strong> Paste the bundle URL at the top so the agent
              always has stack context.
            </li>
            <li>
              <strong>Launch your agent of choice</strong> (sections 1-6 above) and ask it to implement layer 01 of the bundle.
              Verify it works locally before moving to layer 02.
            </li>
            <li>
              <strong>One layer at a time.</strong> Framework + UI → Auth → DB → Forms → Payments → Email. Resist the urge to
              install everything before the first <code>git commit</code>.
            </li>
            <li>
              <strong>Commit per layer.</strong> Easier rollback when one layer goes sideways.
            </li>
            <li>
              <strong>Ship to Railway / Vercel.</strong> Set the env vars, push the branch, smoke-test the live URL.
            </li>
          </ol>

          <div className="not-prose mt-8 grid sm:grid-cols-2 gap-3">
            <Link
              href="/build"
              className="rounded-xl border border-accent/40 bg-accent/5 p-5 hover:border-accent transition flex items-start gap-3"
            >
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-text">Pick a bundle</div>
                <p className="text-sm text-muted">12 ready-made stacks for SaaS, mobile, AI, dashboards, e-commerce.</p>
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
        </Section>
      </div>
    </div>
  );
}

/* ───── building blocks ───── */

function TocLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a href={href} className="text-muted hover:text-accent transition inline-flex items-center gap-1">
        {label}
      </a>
    </li>
  );
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <div className="text-xs font-mono uppercase tracking-wider text-muted/70 mb-1">{eyebrow}</div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h2>
      {subtitle && <p className="text-muted mb-6">{subtitle}</p>}
      <div className="legal-prose">{children}</div>
    </section>
  );
}

function Os({
  name,
  icon,
  children,
}: {
  name: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="my-5 rounded-xl border border-border bg-surface/40 p-4 not-prose">
      <div className="flex items-center gap-2 text-sm font-semibold text-text mb-2">
        {icon}
        <span>{name}</span>
      </div>
      <div className="legal-prose text-sm">{children}</div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-border bg-bg/40 p-5 not-prose">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">
          {n}
        </span>
        <span className="font-semibold text-text">{title}</span>
      </div>
      <div className="legal-prose text-sm">{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-accent/30 bg-accent/5 p-4 not-prose flex gap-3">
      <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
      <div className="legal-prose text-sm">{children}</div>
    </div>
  );
}
