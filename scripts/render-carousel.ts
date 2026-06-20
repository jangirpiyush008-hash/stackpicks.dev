/**
 * CLI — render carousel slides from an HTML file to 1080×1080 PNGs.
 *
 *   npx tsx scripts/render-carousel.ts apps/instagram/carousels/14-teaser.html
 *
 * Behavior:
 *   - Opens the HTML file in headless Chromium
 *   - Finds every element matching `.slide` (the per-slide containers in the
 *     existing carousel templates)
 *   - Screenshots each one at 2x device-scale → exports 1080×1080 PNGs
 *     (assumes each .slide is 540×540 in the source HTML)
 *   - Saves to <htmlDir>/<basename-without-ext>-slides/01.png, 02.png, …
 *
 * One-time setup (already done):
 *   pnpm add -D -w playwright
 *   npx playwright install chromium
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx tsx scripts/render-carousel.ts <path/to/carousel.html>');
    process.exit(1);
  }
  const htmlPath = resolve(arg);
  if (!existsSync(htmlPath)) {
    console.error(`File not found: ${htmlPath}`);
    process.exit(1);
  }

  const slug = basename(htmlPath).replace(/\.html?$/, '');
  const outDir = join(dirname(htmlPath), `${slug}-slides`);
  mkdirSync(outDir, { recursive: true });

  console.log(`Rendering ${slug} → ${outDir}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: 2, // 540×540 slide → 1080×1080 PNG
  });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(htmlPath).toString(), { waitUntil: 'networkidle' });
  // Pause animations so the screenshot is deterministic
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });

  const slides = await page.locator('.slide').all();
  if (slides.length === 0) {
    throw new Error('No .slide elements found in HTML');
  }
  console.log(`Found ${slides.length} slide(s)`);

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const outPath = join(outDir, `${num}.png`);
    await slides[i].screenshot({ path: outPath, omitBackground: false });
    console.log(`  ✓ ${num}.png`);
  }

  await browser.close();
  console.log(`\nDone. ${slides.length} PNG(s) in ${outDir}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
