# StackPicks Instagram Carousels

Self-contained, swipeable HTML carousels designed for **@stackpicks.dev**. Each one exports to 7 × 1080×1350 PNGs ready to upload to Instagram.

## Brand system (locked)
- Primary: `#c6ff00` (electric lime)
- Light: `#daff5e` · Dark: `#8ab300`
- Light bg: `#F5F7F0` · Dark bg: `#0F1108`
- Fonts: **Space Grotesk** (heading + body)
- Logo: `StackPicks` wordmark
- Tone: direct, no buzzwords, honest tradeoffs

## Preview a carousel locally

Open the HTML file in any browser. It renders inside an Instagram frame and you can click/drag to swipe between slides.

```bash
open apps/instagram/carousels/01-22-apps-one-mcp.html
```

## Export slides to PNGs (post to Instagram)

One-time setup:

```bash
pip install playwright
playwright install chromium
```

Export:

```bash
python apps/instagram/export_slides.py apps/instagram/carousels/01-22-apps-one-mcp.html
```

PNGs land in `apps/instagram/carousels/01-22-apps-one-mcp-slides/` as `slide_01.png` through `slide_07.png`. Upload them in order in Instagram's carousel post creator.

## Carousels

| # | File | Topic | Use as |
|---|------|-------|--------|
| 0 | `00-what-is-stackpicks.html` | **Intro:** What is StackPicks? | **Pinned post** — first thing visitors see |
| 1 | `01-22-apps-one-mcp.html` | 22 apps. 1 MCP. Zero setup. | Product pitch (Connect) |
| 2 | (next) | ChatGPT Ads just launched — 7 things to know | News hook |
| 3 | (next) | Connect Google Ads to Claude in 20 min | How-to |

## How to add a new carousel

1. Copy an existing HTML file, rename, change slug.
2. Edit the 7 slides — keep the structure (light → dark → gradient → light → dark → light → gradient).
3. Run the export script.

## Caption template

Each carousel HTML includes a draft caption in the `.ig-caption` block. Copy it as your Instagram post caption.
