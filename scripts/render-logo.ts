import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 300, height: 300 },
    deviceScaleFactor: 2, // 600×600 native — LinkedIn resamples cleanly
  });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL('/tmp/stackpicks-logo.html').toString(), { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/Users/piyushjangir/Downloads/stackpicks-logo.png', omitBackground: false });
  await browser.close();
  console.log('✓ wrote /Users/piyushjangir/Downloads/stackpicks-logo.png');
}
main().catch((e) => { console.error(e); process.exit(1); });
