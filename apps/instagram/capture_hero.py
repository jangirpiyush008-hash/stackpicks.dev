"""
Capture a 1080x1350 hero PNG of a website via Playwright.
Usage:  python apps/instagram/capture_hero.py <url> <out.png>
"""
import asyncio, sys
from playwright.async_api import async_playwright

async def run(url: str, out_path: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1350}, device_scale_factor=1)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(4000)  # let fonts + hero animations settle
        except Exception as e:
            print(f"⚠️  load issue ({e}) — capturing what we have")
        await page.screenshot(path=out_path, type="png", clip={"x":0,"y":0,"width":1080,"height":1350})
        print(f"✓ {out_path}")
        await browser.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python capture_hero.py <url> <out.png>"); sys.exit(1)
    asyncio.run(run(sys.argv[1], sys.argv[2]))
