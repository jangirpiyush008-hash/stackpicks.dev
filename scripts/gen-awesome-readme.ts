// Generates README.md for the awesome-stackpicks GitHub repo from seed-data.ts.
// Run nightly via cron: `tsx scripts/gen-awesome-readme.ts > /path/to/awesome-stackpicks/README.md`
//
// This is the free-for.dev playbook: maintain a beautifully-rendered Markdown
// list on GitHub that mirrors the directory. Every dev who links to the
// GitHub repo is implicitly linking to stackpicks.dev. GitHub itself is one
// of the highest-authority domains LLMs cite from.

import { SEED_REPOS, type SeedEntry } from './seed-data';

const SITE = 'https://stackpicks.dev';
const UPDATED = new Date().toISOString().slice(0, 10);

const CATEGORY_NAMES: Record<string, string> = {
  'ai-ml':               '🤖 AI / LLM / ML',
  'ai-llm':              '🤖 AI / LLM',
  'ai-agent':            '🧠 AI Agents',
  'analytics':           '📊 Analytics',
  'animation':           '✨ Animation & Motion',
  'auth':                '🔐 Authentication',
  'authentication':      '🔐 Authentication',
  'backend':             '⚙️ Backend & APIs',
  'charts-viz':          '📈 Charts & Visualization',
  'cli-tools':           '⌨️ CLI Tools',
  'cms':                 '📝 CMS / Content',
  'cms-content':         '📝 CMS / Content',
  'database':            '🗄️ Databases',
  'design-systems':      '🎨 Design Systems',
  'devops':              '🛠️ DevOps & Hosting',
  'ecommerce':           '🛒 E-commerce',
  'email':               '📧 Email',
  'forms':               '📋 Forms',
  'frameworks':          '🧱 Frameworks',
  'icons':               '⭐ Icons',
  'mobile':              '📱 Mobile',
  'mobile-dev':          '📱 Mobile',
  'observability':       '🔭 Observability',
  'payments':            '💳 Payments',
  'productivity':        '📌 Productivity',
  'rich-text':           '✏️ Rich Text Editors',
  'routing':             '🧭 Routing',
  'scraping':            '🕷️ Scraping',
  'search':              '🔍 Search',
  'self-hosted':         '🏠 Self-hosted',
  'state':               '🧩 State Management',
  'state-management':    '🧩 State Management',
  'testing':             '🧪 Testing',
  'ui-components':       '🎨 UI Components',
  'workflow':            '🔄 Workflow & Automation',
};

function slugFromFullName(fullName: string): string {
  return fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function escapeMd(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
}

function group(): Record<string, SeedEntry[]> {
  const out: Record<string, SeedEntry[]> = {};
  for (const r of SEED_REPOS) {
    for (const c of r.category_slugs) {
      (out[c] ??= []).push(r);
    }
  }
  return out;
}

function tldr(take: string, max = 140): string {
  if (take.length <= max) return take;
  return take.slice(0, max).trimEnd() + '…';
}

function render(): string {
  const grouped = group();
  const totalRepos = SEED_REPOS.length;
  const totalCategories = Object.keys(grouped).length;

  const out: string[] = [];

  // ── Header ────────────────────────────────────────────────────────────
  out.push(`# Awesome StackPicks [![Awesome](https://awesome.re/badge.svg)](https://github.com/sindresorhus/awesome)`);
  out.push('');
  out.push(`> Curated open-source dev tools with honest curator takes. 165+ repos across 18 categories, each reviewed with explicit *"use this if / skip if"* trade-offs.`);
  out.push('');
  out.push(`This list is auto-generated nightly from [stackpicks.dev](${SITE}) — an opinionated directory of open-source dev tools built by [Piyush Jangir](${SITE}/about/piyush-jangir).`);
  out.push('');
  out.push(`**[→ Full directory on stackpicks.dev](${SITE}/preview)** &nbsp;·&nbsp; **[→ MCP servers](${SITE}/mcp)** &nbsp;·&nbsp; **[→ Stack bundles](${SITE}/build)** &nbsp;·&nbsp; **[→ Blog](${SITE}/blog)**`);
  out.push('');
  out.push(`---`);
  out.push('');

  // ── Why this list exists ─────────────────────────────────────────────
  out.push(`## Why this list?`);
  out.push('');
  out.push(`Most "awesome" lists are unfiltered firehoses. **This one isn't.**`);
  out.push('');
  out.push(`Every pick has a 1-paragraph curator take on the actual website explaining what it does, who it's for, and **what it isn't great at** — the bit most directories leave out. Lists by star count are easy. Lists with opinions take work.`);
  out.push('');
  out.push(`- 🔍 **${totalRepos} hand-picked OSS repos**, no auto-scraped junk`);
  out.push(`- 🧠 **Curator takes** (80-160 words each) on every entry`);
  out.push(`- 🎯 **"Use this if / skip if"** clauses so you stop second-guessing`);
  out.push(`- 🔄 **Updated daily** via live GitHub data`);
  out.push(`- ✅ **${totalCategories} categories** + [13 stack bundles](${SITE}/build) + [12 skill tracks](${SITE}/skills)`);
  out.push('');
  out.push(`Last updated: \`${UPDATED}\``);
  out.push('');
  out.push(`---`);
  out.push('');

  // ── Table of contents ────────────────────────────────────────────────
  out.push(`## Contents`);
  out.push('');
  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const an = CATEGORY_NAMES[a] ?? a;
    const bn = CATEGORY_NAMES[b] ?? b;
    return an.localeCompare(bn);
  });
  for (const c of sortedCats) {
    const name = CATEGORY_NAMES[c] ?? c;
    const anchor = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    out.push(`- [${name}](#${anchor}) (${grouped[c].length})`);
  }
  out.push('');
  out.push(`---`);
  out.push('');

  // ── Categories ───────────────────────────────────────────────────────
  for (const c of sortedCats) {
    const name = CATEGORY_NAMES[c] ?? c;
    out.push(`## ${name}`);
    out.push('');

    const repos = grouped[c].slice().sort((a, b) => a.full_name.localeCompare(b.full_name));
    for (const r of repos) {
      const slug = slugFromFullName(r.full_name);
      const featured = r.is_featured ? ' ⭐' : '';
      out.push(`- **[${r.full_name}](https://github.com/${r.full_name})**${featured} — ${escapeMd(tldr(r.curator_take, 160))} [Full take →](${SITE}/repo/${slug})`);
    }
    out.push('');
  }

  // ── Footer ──────────────────────────────────────────────────────────
  out.push(`---`);
  out.push('');
  out.push(`## Contributing`);
  out.push('');
  out.push(`Submit a repo via the form at [${SITE}/submit-repo](${SITE}/submit-repo). Every submission gets a curator review — accepted picks show up here on the next regen.`);
  out.push('');
  out.push(`## License`);
  out.push('');
  out.push(`This list is [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/). Curator takes are © [Piyush Jangir](${SITE}/about/piyush-jangir), reused here under CC BY 4.0.`);
  out.push('');
  out.push(`## Author`);
  out.push('');
  out.push(`Curated by **Piyush Jangir** — independent builder, Mumbai, India. [GitHub](https://github.com/jangirpiyush008-hash) · [LinkedIn](https://www.linkedin.com/in/jangirpiyush008/) · [Twitter](https://twitter.com/jangirpiyush008) · [stackpicks.dev](${SITE})`);
  out.push('');
  out.push(`<sub>Auto-generated from [stackpicks.dev](${SITE}) on ${UPDATED}.</sub>`);
  out.push('');

  return out.join('\n');
}

console.log(render());
