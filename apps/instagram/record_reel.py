"""
Record an animated HTML Reel to MP4 (1080×1920, 9:16, Instagram-ready).

Pipeline:
  1. Playwright headless Chromium opens the HTML at 1080×1920 viewport
  2. Records webm video while the CSS animation plays
  3. ffmpeg converts webm → mp4 (H.264) and mixes in an ambient music bed
     synthesised on the fly (royalty-free; swap in IG's licensed music when
     uploading).

Usage:
    pip install playwright
    playwright install chromium
    python apps/instagram/record_reel.py <reel.html> [seconds] [--silent]

--silent flag skips the music bed (use this if you'll add IG music after upload).
"""

import asyncio
import shutil
import subprocess
import sys
from pathlib import Path
from playwright.async_api import async_playwright

# IG Reels target — 9:16 vertical
W, H = 1080, 1920
FPS = 30
DEFAULT_SECONDS = 18


async def record(html_path: Path, seconds: int) -> Path:
    raw_dir = html_path.parent / (html_path.stem + "-raw")
    raw_dir.mkdir(exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(
            viewport={"width": W, "height": H},
            device_scale_factor=1,
            record_video_dir=str(raw_dir),
            record_video_size={"width": W, "height": H},
        )
        page = await ctx.new_page()
        await page.goto(f"file://{html_path.resolve()}", wait_until="networkidle")

        # Fonts settle, then sit for the animation duration + tail
        await page.wait_for_timeout(2_500)
        await page.wait_for_timeout(seconds * 1000 + 800)

        await ctx.close()
        await browser.close()

    webms = list(raw_dir.glob("*.webm"))
    if not webms:
        raise RuntimeError("Playwright produced no .webm file")
    return webms[0]


def to_mp4(webm: Path, out_mp4: Path, seconds: int, silent: bool):
    """
    Convert webm to MP4. If silent=False, mix in an ambient synth bed:
    a slow C-minor chord pad (130Hz + 195Hz + 233Hz sine waves) faded in/out.
    """
    base_cmd = [
        "ffmpeg", "-y",
        "-i", str(webm),
    ]

    if silent:
        audio_input = ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100"]
        audio_filter = []
    else:
        # 3-note chord: C (130.81 Hz) + Eb (155.56 Hz) + G (196 Hz)
        # Volume kept low (-22 dB) so it sits under spoken-word or IG music if user adds it.
        fade_out_start = max(0, seconds - 1)
        audio_input = [
            "-f", "lavfi",
            "-i", (
                f"sine=frequency=130.81:duration={seconds}[a1];"
                f"sine=frequency=155.56:duration={seconds}[a2];"
                f"sine=frequency=196.00:duration={seconds}[a3];"
                f"[a1][a2][a3]amix=inputs=3:duration=longest,"
                f"afade=t=in:st=0:d=1.5,"
                f"afade=t=out:st={fade_out_start}:d=1.0,"
                f"volume=-22dB"
            ),
        ]
        audio_filter = []

    cmd = base_cmd + audio_input + [
        "-shortest",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "slow",
        "-crf", "20",
        "-r", str(FPS),
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        str(out_mp4),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


async def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    silent = "--silent" in flags

    if not args:
        print("Usage: python record_reel.py <reel.html> [seconds] [--silent]")
        sys.exit(1)
    html = Path(args[0])
    if not html.exists():
        print(f"Not found: {html}")
        sys.exit(1)
    seconds = int(args[1]) if len(args) > 1 else DEFAULT_SECONDS

    print(f"Recording {seconds}s at {W}×{H} @ {FPS}fps  (audio: {'silent' if silent else 'ambient music bed'})")
    webm = await record(html, seconds)
    print(f"  raw: {webm.name}")

    out_mp4 = html.parent / (html.stem + ".mp4")
    print(f"Encoding mp4 …")
    to_mp4(webm, out_mp4, seconds, silent)

    shutil.rmtree(webm.parent, ignore_errors=True)
    size_mb = out_mp4.stat().st_size / 1_048_576
    print(f"\n✓ Done — {out_mp4} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    asyncio.run(main())
