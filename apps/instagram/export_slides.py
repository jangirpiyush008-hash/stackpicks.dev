"""
Export StackPicks Instagram carousels to 1080x1350 PNGs ready to post.

Usage:
    pip install playwright
    playwright install chromium
    python apps/instagram/export_slides.py apps/instagram/carousels/01-22-apps-one-mcp.html

Outputs PNGs into ./<carousel-name>-slides/ next to the HTML file.
"""

import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

VIEW_W = 420
VIEW_H = 525  # 4:5 aspect ratio at 420 wide
SCALE = 1080 / 420  # = 2.5714... — renders at IG-ready 1080x1350


async def export_slides(html_path: Path, total_slides: int = 7):
    out_dir = html_path.parent / (html_path.stem + "-slides")
    out_dir.mkdir(exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(
            viewport={"width": VIEW_W, "height": VIEW_H},
            device_scale_factor=SCALE,
        )

        # Load via file:// so fonts can fetch from Google
        await page.goto(f"file://{html_path.resolve()}", wait_until="networkidle")
        await page.wait_for_timeout(3000)  # Wait for Google Fonts to load

        # Strip the IG chrome and force the viewport to fill the page
        await page.evaluate(
            """() => {
                document.querySelectorAll('.ig-header,.ig-dots,.ig-actions,.ig-caption')
                    .forEach(el => el.style.display = 'none');
                const frame = document.querySelector('.ig-frame');
                frame.style.cssText = 'width:420px;height:525px;max-width:none;border-radius:0;box-shadow:none;overflow:hidden;margin:0;background:transparent;';
                const viewport = document.querySelector('.carousel-viewport');
                viewport.style.cssText = 'width:420px;height:525px;aspect-ratio:unset;overflow:hidden;cursor:default;position:relative;';
                document.body.style.cssText = 'padding:0;margin:0;display:block;overflow:hidden;background:transparent;';
                document.documentElement.style.cssText = 'padding:0;margin:0;overflow:hidden;background:transparent;';
            }"""
        )
        await page.wait_for_timeout(500)

        for i in range(total_slides):
            await page.evaluate(
                """(idx) => {
                    const track = document.querySelector('.carousel-track');
                    track.style.transition = 'none';
                    track.style.transform = 'translateX(' + (-idx * 420) + 'px)';
                }""",
                i,
            )
            await page.wait_for_timeout(400)
            out_path = out_dir / f"slide_{i + 1:02d}.png"
            await page.screenshot(
                path=str(out_path),
                clip={"x": 0, "y": 0, "width": VIEW_W, "height": VIEW_H},
            )
            print(f"  ✓ slide_{i + 1:02d}.png")

        await browser.close()

    print(f"\nDone — {total_slides} slides exported to:\n  {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python export_slides.py <path-to-carousel.html> [total_slides]")
        sys.exit(1)
    html = Path(sys.argv[1])
    if not html.exists():
        print(f"File not found: {html}")
        sys.exit(1)
    total = int(sys.argv[2]) if len(sys.argv) > 2 else 7
    asyncio.run(export_slides(html, total))
