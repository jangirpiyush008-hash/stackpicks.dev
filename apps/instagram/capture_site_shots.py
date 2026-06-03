"""
Capture real stackpicks.dev page screenshots (mobile viewport) for use as
embedded backgrounds in the Instagram Reel. Saves PNGs into apps/instagram/reels/.
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "reels"
OUT.mkdir(exist_ok=True)

PAGES = [
    ("https://stackpicks.dev",          "site-home.png",     1200),  # scroll y after load
    ("https://stackpicks.dev/preview",  "site-directory.png", 600),
]

# Mobile-ish viewport — tall, narrow — matches the responsive site's mobile layout
VW, VH = 420, 900

async def capture():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=2)
        page = await ctx.new_page()
        for url, fname, scroll_y in PAGES:
            print(f"  fetching {url} …")
            try:
                await page.goto(url, wait_until="networkidle", timeout=20_000)
                await page.wait_for_timeout(2_000)
                if scroll_y:
                    await page.evaluate(f"window.scrollTo({{top: {scroll_y}, behavior: 'instant'}})")
                    await page.wait_for_timeout(800)
                await page.screenshot(path=str(OUT / fname), full_page=False)
                print(f"    ✓ {fname}")
            except Exception as e:
                print(f"    ✗ {url} failed: {e}")
        await b.close()

asyncio.run(capture())
