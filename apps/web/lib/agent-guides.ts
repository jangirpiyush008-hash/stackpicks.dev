/**
 * AI agent install + usage guides — one per agent.
 * Rendered by the tabbed /how-to-use page with Mac/Windows toggle.
 */

export interface OSCommand {
  mac: string;
  windows: string;
  windowsNote?: string;
  macNote?: string;
}

export interface AgentStep {
  title: string;
  body: string;            // markdown-lite paragraph
  command?: OSCommand;     // optional shell snippet (or single string)
  commandSingle?: string;  // when same on both OSes
  commandLabel?: string;
}

export interface AgentGuide {
  slug: string;
  name: string;
  vendor: string;
  blurb: string;
  install: OSCommand;
  steps: AgentStep[];
  tip: string;
}

export const AGENT_GUIDES: AgentGuide[] = [
  {
    slug: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    blurb: 'Terminal-first agent from Anthropic. Best at large-codebase reasoning and end-to-end tasks. Our recommended pick for stackpicks bundles.',
    install: {
      mac: `# One-line installer:
curl -fsSL https://claude.ai/install.sh | bash

# Or via npm:
npm install -g @anthropic-ai/claude-code

# Verify:
claude --version`,
      windows: `# Recommended: install in WSL Ubuntu first
wsl --install -d Ubuntu

# Then inside WSL:
curl -fsSL https://claude.ai/install.sh | bash

# Native Windows (PowerShell, admin):
npm install -g @anthropic-ai/claude-code`,
      macNote: 'Homebrew users: Anthropic ships a one-line installer that handles permissions.',
      windowsNote: 'Strongly recommend WSL 2 — native Windows works but file system perf is slower.',
    },
    steps: [
      {
        title: 'Authenticate',
        body: 'Opens a browser to log in once, then keeps the session.',
        commandSingle: 'claude',
        commandLabel: 'terminal',
      },
      {
        title: 'Open a project',
        body: 'The terminal becomes an interactive agent. It reads files, runs commands, edits code.',
        commandSingle: 'cd ~/projects/my-saas\nclaude',
        commandLabel: 'terminal',
      },
      {
        title: 'Point it at a StackPicks bundle',
        body: 'Inside the Claude prompt, paste:',
        commandSingle: `I'm building a SaaS. Use this bundle as the source of truth for the stack:
https://stackpicks.dev/build/ship-a-saas

Set up Next.js 15 + shadcn/ui + better-auth + Supabase + Razorpay following the bundle order.
Stop and confirm with me after each layer.`,
        commandLabel: 'claude prompt',
      },
    ],
    tip: 'Claude Code respects a CLAUDE.md in the project root. Drop a one-page rules file (the StackPicks repo has one as reference). It will use the rules on every task.',
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    vendor: 'Anysphere',
    blurb: 'VS Code-forked IDE with an AI panel. Best when you want a GUI and inline Tab autocomplete.',
    install: {
      mac: `brew install --cask cursor

# Or download the .dmg from cursor.com`,
      windows: `winget install --id Anysphere.Cursor

# Or download the installer from cursor.com`,
    },
    steps: [
      {
        title: 'Sign in + pick model',
        body: 'Open Cursor → settings → sign in. Pick claude-sonnet-4.5 or gpt-5 as the default.',
      },
      {
        title: 'Open the project',
        body: 'From your terminal:',
        command: {
          mac: 'cd ~/projects/my-saas\ncursor .',
          windows: 'cd C:\\projects\\my-saas\ncursor .',
        },
        commandLabel: 'terminal',
      },
      {
        title: 'Use @docs to add a StackPicks repo',
        body: 'Press ⌘L (Mac) or Ctrl+L (Windows) to open the chat panel. Then paste:',
        commandSingle: `@docs Add docs for shadcn-ui/ui (https://ui.shadcn.com)
@docs Add docs for Razorpay (https://razorpay.com/docs)

Now scaffold a Next.js app, install shadcn, wire Razorpay checkout per the docs above.`,
        commandLabel: 'cursor chat',
      },
    ],
    tip: 'Cursor reads .cursor/rules directory. Create .cursor/rules/stack.md with your stack rules so every chat starts with context.',
  },
  {
    slug: 'codex',
    name: 'OpenAI Codex',
    vendor: 'OpenAI',
    blurb: 'Browser-based agent that runs long tasks on a virtual machine. Best for parallel work — fire off 10 PRs at once.',
    install: {
      mac: `# Mostly cloud-based — visit chatgpt.com/codex
# For local CLI:
npm install -g @openai/codex-cli
codex login`,
      windows: `# Mostly cloud-based — visit chatgpt.com/codex
# For local CLI (PowerShell):
npm install -g @openai/codex-cli
codex login`,
    },
    steps: [
      {
        title: 'Connect your GitHub repo',
        body: 'On chatgpt.com/codex, click Settings → GitHub and authorize Codex on the repos you want it to act on.',
      },
      {
        title: 'Send a task with the bundle URL',
        body: 'Codex tasks run in cloud sandboxes and open PRs when done.',
        commandSingle: `Repo: jangirpiyush008-hash/my-saas
Branch: feat/payments

Task:
Implement Razorpay subscription checkout. Reference the bundle:
https://stackpicks.dev/build/ship-a-saas

Use core/razorpay/ for the order + verification logic.
Open a PR when done.`,
        commandLabel: 'codex prompt',
      },
    ],
    tip: 'Codex shines for parallel work — open 5 tasks at once. Each gets its own sandboxed VM and opens a separate PR. Great for tedious refactors.',
  },
  {
    slug: 'antigravity',
    name: 'Google Antigravity',
    vendor: 'Google',
    blurb: 'Agentic IDE from Google built around Gemini 3. Treats the IDE as a control surface for autonomous agents that drive editor, terminal, and browser.',
    install: {
      mac: `# Download the macOS build from antigravity.google
# Or via Homebrew once the cask lands:
brew install --cask google-antigravity`,
      windows: `# Download the .exe installer from antigravity.google
# Then sign in with your Google account.`,
    },
    steps: [
      {
        title: 'Open the Manager view',
        body: 'Antigravity has two surfaces — the IDE (familiar VS Code shell) and the Manager (where agents are dispatched, monitored, and review your work). Start in Manager.',
      },
      {
        title: 'Spawn an agent against a bundle',
        body: 'In Manager, create a new task:',
        commandSingle: `Build the auth layer for my SaaS.

Reference stack:
https://stackpicks.dev/build/ship-a-saas

Specifically use: better-auth/better-auth + supabase/supabase.
Open the browser tab on http://localhost:3000 to verify signup flow.`,
        commandLabel: 'antigravity task',
      },
    ],
    tip: 'Antigravity agents can drive the browser — they will literally click through your signup form and report what broke. Useful for end-to-end visual debugging.',
  },
  {
    slug: 'vscode',
    name: 'VS Code + extensions',
    vendor: 'Microsoft',
    blurb: 'The classic. Pair it with Copilot, Cline, or Continue for AI workflows.',
    install: {
      mac: 'brew install --cask visual-studio-code',
      windows: 'winget install --id Microsoft.VisualStudioCode',
    },
    steps: [
      {
        title: 'Pick an AI extension',
        body: `Three solid choices:
• GitHub Copilot — best inline autocomplete, $10/mo
• Cline — agentic, free + BYO API key, opens terminals and runs tools
• Continue — open-source alternative, BYO model`,
        commandSingle: `> Extensions: Install Extensions
# Search and install:
GitHub Copilot
Cline
Continue`,
        commandLabel: 'vscode command palette',
      },
      {
        title: 'Wire a StackPicks bundle via Cline',
        body: 'Open Cline (left sidebar) and paste:',
        commandSingle: `Read https://stackpicks.dev/build/ai-agent

Scaffold a Next.js project, install pgvector locally via Docker, install Ollama,
and create a /chat route that retrieves from pgvector and streams from Ollama.`,
        commandLabel: 'cline prompt',
      },
    ],
    tip: 'VS Code + Cline is the cheapest agentic stack — no IDE license fee, just LLM API costs.',
  },
  {
    slug: 'aider',
    name: 'Aider',
    vendor: 'Aider',
    blurb: 'Terminal AI pair-programmer. Edits files, commits to git automatically. Lightweight, model-agnostic.',
    install: {
      mac: `brew install aider

# Or via pip:
python -m pip install aider-chat`,
      windows: 'python -m pip install aider-chat',
    },
    steps: [
      {
        title: 'Set your API key',
        body: 'Anthropic or OpenAI key works.',
        command: {
          mac: 'export ANTHROPIC_API_KEY=sk-ant-...\n# or:\nexport OPENAI_API_KEY=sk-...',
          windows: 'setx ANTHROPIC_API_KEY "sk-ant-..."\n# or:\nsetx OPENAI_API_KEY "sk-..."',
        },
        commandLabel: 'terminal',
      },
      {
        title: 'Launch in a project',
        body: 'Aider auto-detects git and commits each change.',
        command: {
          mac: 'cd ~/projects/my-saas\naider --model sonnet',
          windows: 'cd C:\\projects\\my-saas\naider --model sonnet',
        },
        commandLabel: 'terminal',
      },
      {
        title: 'Add files + describe the task',
        body: 'Inside the aider prompt:',
        commandSingle: `/add app/layout.tsx app/page.tsx

Use https://stackpicks.dev/build/ship-a-saas as the canonical stack reference.
Add a hero, pricing, and auth modal using shadcn/ui + better-auth.`,
        commandLabel: 'aider prompt',
      },
    ],
    tip: 'Aider auto-commits after every change with a sensible message. Great for solo work and clean git history.',
  },
];

export function getAgentBySlug(slug: string): AgentGuide | undefined {
  return AGENT_GUIDES.find((a) => a.slug === slug);
}
