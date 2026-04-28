"""Render anchorregistry.com/onepager to public/onepager.pdf via Playwright.

Assumes a Next.js server is already serving the page at AR_BASE_URL (default
http://localhost:3000). Orchestration of starting/stopping that server lives
in scripts/build-pdf.sh.

Run directly:
    python scripts/build_onepager_pdf.py

Or via the npm wrapper:
    npm run build:pdf
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("AR_BASE_URL", "http://localhost:3000")
OUT_PATH = Path(os.environ.get("AR_PDF_OUT", "public/onepager.pdf"))
PAGE_PATH = "/onepager"


def render() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # 816x1056 is US Letter at 96 DPI; matches @page size: letter.
        context = browser.new_context(viewport={"width": 816, "height": 1056})
        page = context.new_page()

        url = f"{BASE_URL}{PAGE_PATH}"
        print(f"navigating: {url}", flush=True)
        page.goto(url, wait_until="networkidle", timeout=60_000)

        # Critical: page.pdf() does NOT wait for web fonts. Without this the
        # PDF prints with system fallbacks and looks subtly wrong.
        # Google Fonts loads each weight lazily; we force-request every
        # weight the page declares so Chromium has them all in hand before
        # render. document.fonts.ready alone is not enough — it resolves
        # against the *currently scheduled* face set, which may not include
        # weights that haven't been touched by layout yet.
        page.evaluate(
            """async () => {
                await document.fonts.ready;
                const fams = [
                    ["IBM Plex Sans", [300, 400, 500, 600]],
                    ["IBM Plex Mono", [400, 500]],
                ];
                const loads = [];
                for (const [family, weights] of fams) {
                    for (const w of weights) {
                        loads.push(document.fonts.load(`${w} 16px '${family}'`));
                    }
                }
                await Promise.all(loads);
                await document.fonts.ready;
            }"""
        )

        page.emulate_media(media="print")

        # The page intentionally targets 960px width and uses generous mb-*
        # spacing for screen. Even with @media print tightening the content
        # is a hair taller than US Letter; a small scale buys us a single
        # page without distorting the design.
        page.pdf(
            path=str(OUT_PATH),
            format="Letter",
            print_background=True,
            prefer_css_page_size=True,
            scale=0.85,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )

        browser.close()

    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"wrote: {OUT_PATH} ({size_kb:.1f} KB)", flush=True)


if __name__ == "__main__":
    try:
        render()
    except Exception as e:
        print(f"build_onepager_pdf failed: {e}", file=sys.stderr)
        sys.exit(1)
