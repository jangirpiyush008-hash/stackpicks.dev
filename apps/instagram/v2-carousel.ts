/**
 * v2 carousel builder — config → HTML, new movie-poster design.
 *
 *   npx tsx apps/instagram/v2-carousel.ts apps/instagram/carousels/configs/15-claude-skills.json
 *
 * Output: apps/instagram/carousels/<slug>.html (viewer with 8 slides at 540×540)
 * Render to PNG with: npx tsx scripts/render-carousel.ts <html>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

export interface V2Config {
  slug: string;                    // e.g. "15-claude-skills"
  category: string;                // e.g. "ai · tools"
  hook: {
    eyebrow: string;               // tiny line above headline e.g. "what's new"
    headline: string;              // big punch e.g. "Claude Skills turn one prompt into an agent."
    sub?: string;                  // optional support line
  };
  cards: Array<{
    label: string;                 // tiny mono label e.g. "01 · what"
    title: string;                 // 1-line big claim
    body: string;                  // 2-3 line explanation
    metric?: string;               // optional callout number/quote
  }>;                              // 5 cards = slides 2-6
  take: {
    use_if: string;                // 1 sentence
    skip_if: string;               // 1 sentence
  };
  cta: {
    keyword: string;               // comment keyword for auto-DM, e.g. "SKILLS"
    link_text: string;             // visible URL on the slide e.g. "stackpicks.dev/blog/..."
    sub?: string;                  // optional "free for everyone" type line
  };
}

const CSS = `
  :root {
    --bg: #0a0a0a;
    --ink: #ffffff;
    --muted: #9a9a9a;
    --lime: #c6ff00;
    --lime-glow: rgba(198,255,0,0.18);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    background: #1a1a1a; color: var(--ink);
    font-family: 'Inter','Helvetica Neue',-apple-system,system-ui,sans-serif;
    -webkit-font-smoothing: antialiased; min-height: 100vh;
  }
  .page { display: flex; flex-direction: column; align-items: center; padding: 32px 16px 80px; gap: 12px; }
  .meta { color: #888; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px; font-weight: 500; }
  .deck { display: flex; flex-direction: column; gap: 32px; align-items: center; }
  .slide-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .slide-label { color: #999; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .slide {
    width: 540px; height: 540px; background: var(--bg); position: relative;
    overflow: hidden; border-radius: 12px;
    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.7);
  }
  .corners::before, .corners::after,
  .corners > .tl, .corners > .tr {
    content: ''; position: absolute; width: 18px; height: 18px;
    border-color: rgba(255,255,255,0.18); border-style: solid;
  }
  .corners::before { top: 20px; left: 20px;   border-width: 1px 0 0 1px; }
  .corners::after  { bottom: 20px; right: 20px; border-width: 0 1px 1px 0; }
  .corners > .tl   { top: 20px; right: 20px; border-width: 1px 1px 0 0; }
  .corners > .tr   { bottom: 20px; left: 20px;  border-width: 0 0 1px 1px; }
  .topmeta {
    position: absolute; top: 36px; left: 36px; right: 36px;
    display: flex; justify-content: space-between;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.24em; color: rgba(255,255,255,0.45);
    text-transform: uppercase; font-weight: 600;
  }
  .topmeta.dark { color: rgba(10,10,10,0.55); }
  .bottommeta {
    position: absolute; bottom: 36px; left: 36px; right: 36px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.24em; color: rgba(255,255,255,0.45);
    text-transform: uppercase; font-weight: 600;
  }
  .bottommeta.dark { color: rgba(10,10,10,0.55); }

  /* HOOK slide */
  .hook {
    background: radial-gradient(ellipse at 50% 38%, rgba(198,255,0,0.10) 0%, transparent 55%), var(--bg);
  }
  .hook .body {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    text-align: center; width: 86%;
  }
  .hook .eyebrow {
    color: var(--lime); font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; margin-bottom: 18px; font-weight: 700;
  }
  .hook .head {
    font-size: 44px; font-weight: 900; letter-spacing: -0.035em; line-height: 1.05; color: var(--ink);
  }
  .hook .head em { color: var(--lime); font-style: normal; text-shadow: 0 0 40px var(--lime-glow); }
  .hook .sub {
    margin-top: 22px; font-size: 14px; color: rgba(255,255,255,0.6);
    font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.18em; text-transform: uppercase;
  }

  /* CARD slide */
  .card {
    background: var(--bg);
  }
  .card .lbl {
    position: absolute; top: 76px; left: 48px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px; letter-spacing: 0.28em; color: var(--lime);
    text-transform: uppercase; font-weight: 700;
  }
  .card .body { position: absolute; top: 130px; left: 48px; right: 48px; bottom: 88px; display: flex; flex-direction: column; }
  .card .ttl {
    font-size: 32px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink); margin-bottom: 20px;
  }
  .card .ttl em { color: var(--lime); font-style: normal; }
  .card .desc {
    font-size: 16px; color: rgba(255,255,255,0.72); line-height: 1.5;
  }
  .card .metric {
    margin-top: auto; padding: 14px 16px;
    background: rgba(198,255,0,0.08);
    border-left: 3px solid var(--lime);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; color: var(--lime); letter-spacing: 0.04em;
  }

  /* TAKE slide */
  .take { background: var(--bg); }
  .take .lbl {
    position: absolute; top: 76px; left: 48px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px; letter-spacing: 0.28em; color: var(--lime);
    text-transform: uppercase; font-weight: 700;
  }
  .take .row { position: absolute; left: 48px; right: 48px; }
  .take .row.r1 { top: 132px; }
  .take .row.r2 { top: 312px; }
  .take .row .tag {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--lime); font-weight: 700; margin-bottom: 12px;
  }
  .take .row .tag.skip { color: #ff5a5a; }
  .take .row .txt {
    font-size: 22px; font-weight: 700; line-height: 1.25; color: var(--ink); letter-spacing: -0.015em;
  }

  /* CTA slide */
  .cta { background: var(--lime); color: #0a0a0a; }
  .cta .hint {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    text-align: center; width: 86%;
  }
  .cta .hint .word1 {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px; letter-spacing: 0.36em; text-transform: uppercase; color: rgba(10,10,10,0.7);
    font-weight: 700; margin-bottom: 18px;
  }
  .cta .hint .kw {
    display: inline-block; padding: 14px 28px;
    background: #0a0a0a; color: var(--lime);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 28px; font-weight: 800; letter-spacing: 0.06em;
    margin-bottom: 26px;
  }
  .cta .hint .head {
    font-size: 28px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.2; color: #0a0a0a;
  }
  .cta .hint .link {
    margin-top: 20px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; color: rgba(10,10,10,0.75); letter-spacing: 0.06em;
  }
  .cta .hint .sub {
    margin-top: 14px; font-size: 12px; color: rgba(10,10,10,0.55);
    font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.18em; text-transform: uppercase;
  }

  /* dev wrapper */
  .caption {
    margin-top: 40px; max-width: 540px; color: #d8d8d8;
    font-size: 14px; line-height: 1.55; background: #232323;
    padding: 18px 20px; border-radius: 10px; border: 1px solid #2f2f2f; width: 540px;
  }
  .caption .lbl {
    color: var(--lime); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 8px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 600;
  }
`;

function topmeta(post: string, cat: string, dark = false): string {
  return `<div class="topmeta${dark ? ' dark' : ''}"><span>${post}</span><span>${cat}</span></div>`;
}
function bottommeta(idx: number, total: number, right: string, dark = false): string {
  const pn = `${String(idx).padStart(2, '0')} · ${String(total).padStart(2, '0')}`;
  return `<div class="bottommeta${dark ? ' dark' : ''}"><span>${pn}</span><span>${right}</span></div>`;
}
function cornerSpans(): string {
  return `<span class="tl"></span><span class="tr"></span>`;
}

function renderHook(c: V2Config, idx: number, total: number, postLabel: string): string {
  return `
    <div class="slide-wrap">
      <div class="slide-label">${String(idx).padStart(2,'0')} / ${String(total).padStart(2,'0')} — hook</div>
      <div class="slide hook corners">
        ${cornerSpans()}
        ${topmeta(postLabel, c.category)}
        <div class="body">
          <div class="eyebrow">${c.hook.eyebrow}</div>
          <div class="head">${c.hook.headline}</div>
          ${c.hook.sub ? `<div class="sub">${c.hook.sub}</div>` : ''}
        </div>
        ${bottommeta(idx, total, 'swipe →')}
      </div>
    </div>`;
}

function renderCard(card: V2Config['cards'][number], i: number, total: number, postLabel: string, cat: string): string {
  return `
    <div class="slide-wrap">
      <div class="slide-label">${String(i).padStart(2,'0')} / ${String(total).padStart(2,'0')} — ${card.label.replace(/[^a-z0-9 · ]/gi,'')}</div>
      <div class="slide card corners">
        ${cornerSpans()}
        ${topmeta(postLabel, cat)}
        <div class="lbl">${card.label}</div>
        <div class="body">
          <div class="ttl">${card.title}</div>
          <div class="desc">${card.body}</div>
          ${card.metric ? `<div class="metric">${card.metric}</div>` : ''}
        </div>
        ${bottommeta(i, total, 'swipe →')}
      </div>
    </div>`;
}

function renderTake(c: V2Config, i: number, total: number, postLabel: string): string {
  return `
    <div class="slide-wrap">
      <div class="slide-label">${String(i).padStart(2,'0')} / ${String(total).padStart(2,'0')} — our take</div>
      <div class="slide take corners">
        ${cornerSpans()}
        ${topmeta(postLabel, c.category)}
        <div class="lbl">07 · honest take</div>
        <div class="row r1">
          <div class="tag">use this if</div>
          <div class="txt">${c.take.use_if}</div>
        </div>
        <div class="row r2">
          <div class="tag skip">skip if</div>
          <div class="txt">${c.take.skip_if}</div>
        </div>
        ${bottommeta(i, total, 'one more →')}
      </div>
    </div>`;
}

function renderCta(c: V2Config, i: number, total: number, postLabel: string): string {
  return `
    <div class="slide-wrap">
      <div class="slide-label">${String(i).padStart(2,'0')} / ${String(total).padStart(2,'0')} — CTA</div>
      <div class="slide cta corners">
        ${cornerSpans()}
        ${topmeta(postLabel, c.category, true)}
        <div class="hint">
          <div class="word1">comment this word</div>
          <div class="kw">${c.cta.keyword}</div>
          <div class="head">i'll DM you the link.</div>
          <div class="link">${c.cta.link_text}</div>
          ${c.cta.sub ? `<div class="sub">${c.cta.sub}</div>` : ''}
        </div>
        ${bottommeta(i, total, 'stackpicks', true)}
      </div>
    </div>`;
}

export function buildHtml(c: V2Config): string {
  const total = 1 + c.cards.length + 1 + 1; // hook + cards + take + cta
  const postLabel = `post · ${c.slug.split('-')[0]}`;
  let slides = '';
  let idx = 1;
  slides += renderHook(c, idx++, total, postLabel);
  for (const card of c.cards) slides += renderCard(card, idx++, total, postLabel, c.category);
  slides += renderTake(c, idx++, total, postLabel);
  slides += renderCta(c, idx++, total, postLabel);

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>StackPicks Carousel — ${c.slug}</title>
<style>${CSS}</style>
</head><body>
<div class="page">
  <div class="meta">${c.slug} · v2 movie-poster · ${total} slides</div>
  <div class="deck">${slides}</div>
  <div class="caption"><div class="lbl">cta keyword</div>${c.cta.keyword} → DM ${c.cta.link_text}</div>
</div>
</body></html>`;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx tsx apps/instagram/v2-carousel.ts <config.json>');
    process.exit(1);
  }
  const cfg: V2Config = JSON.parse(readFileSync(resolve(arg), 'utf-8'));
  const outDir = resolve('apps/instagram/carousels');
  const outPath = join(outDir, `${cfg.slug}.html`);
  writeFileSync(outPath, buildHtml(cfg));
  console.log(`Wrote ${outPath}`);
}

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
