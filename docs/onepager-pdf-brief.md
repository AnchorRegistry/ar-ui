# Brief: One-pager PDF generator

## Goal

Build `https://anchorregistry.com/onepager.pdf` as a printable PDF version of the existing Next.js page at `app/onepager/page.tsx`. The HTML page is the single source of truth — the PDF should be the same content, the same design, just printable.

## What exists

The page lives at `app/onepager/page.tsx` and renders at `localhost:3000/onepager` in dev. It uses Tailwind config tokens defined in `tailwind.config.ts` (dark scheme: `bg #152038`, `surface #1C2B4A`, `gold #F59E0B`, `electric-blue #3B82F6`, `off-white #F0F4FF`, `muted-slate #7B93C4`, `border #2E4270`). Fonts are IBM Plex Sans and Plex Mono loaded via Google Fonts. Page is structured as a single `max-w-[960px]` article column.

## Approach: Playwright print-to-PDF

Use Playwright to render the existing page to PDF rather than reimplementing the layout in ReportLab or similar. Reasons: the HTML page is already the design source of truth; reimplementing the diagram + layout in PDF primitives means maintaining two parallel implementations that will drift; Playwright just prints what the browser sees.

If you find a real blocker that makes Playwright unworkable, surface it and propose the alternative — but the default is Playwright.

## Repo context — read these first

Before writing any code, read these to understand the existing structure:

- `app/onepager/page.tsx` — the page being printed (what's being rendered)
- `app/globals.css` — where any new `@media print` styles go
- `tailwind.config.ts` — color tokens being referenced
- `package.json` — existing scripts and structure
- `next.config.ts` — Next.js config; relevant if static export or output mode is involved
- `.gitignore` — confirm whether `public/onepager.pdf` should be committed or ignored (relevant to the build-time vs manual-regen decision)
- Check whether there's a `vercel.json` or any deployment config that affects build steps
- `.claude/` — any existing project conventions for Claude Code in this repo

If there's an existing Python toolchain in the repo (like the `ar-python` repo at `~/repos/ar-python`), align with whatever pattern it uses — virtualenv, requirements.txt, pyproject. If there isn't one, set up something minimal: a `requirements.txt` with pinned `playwright==<latest stable>` is fine.

## Deliverable

A script at `scripts/build_onepager_pdf.py` that:

1. Starts the Next.js dev or production server (or assumes one is already running on `localhost:3000` — your call which is cleaner)
2. Navigates to `/onepager`
3. Waits for fonts and any dynamic content to fully load (this matters — IBM Plex via Google Fonts can lag)
4. Renders to PDF as US Letter, with `print_background: true` so the dark theme survives
5. Writes output to `public/onepager.pdf`

The script should be runnable as `python scripts/build_onepager_pdf.py` and produce a usable PDF. Add a corresponding entry to `package.json` scripts (e.g. `npm run build:pdf`).

For orchestration (start server → wait for ready → run script → kill server), the cleanest pattern is a short shell script (`scripts/build-pdf.sh`) that does the orchestration, with `npm run build:pdf` calling the shell script. Or use `start-server-and-test` from npm which is purpose-built for this exact pattern. Don't try to cram orchestration into raw npm script chains — they tend to get fragile.

## `@media print` styles

The page will likely need a few print-only CSS adjustments. Add these to `app/globals.css`. The HTML page should still look identical at screen — `@media print` only.

To save iteration time, the print stylesheet should at minimum include:

```css
@media print {
  @page {
    size: letter;
    margin: 0;
  }

  html, body {
    background: #152038 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Force background colors and images to print on all elements */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

The `print-color-adjust: exact` directives are the magic that prevents Chrome from stripping the dark background. Without these, the PDF will print white-on-white in places and look broken.

Other things to handle in `@media print`:
- Lock the page to letter dimensions and prevent any overflow onto a second page
- Ensure links print as electric blue (not the default browser blue)
- Hide anything interactive-only (hover states, etc.)

## Hyperlinks must be clickable

The PDF needs working hyperlinks. The page has these external links that must resolve:

- arXiv: `https://arxiv.org/abs/2604.03434`
- BaseScan contract: `https://basescan.org/address/0x3ec509393425bcaa48224fb90c710e100ada1d2a`
- MCP server: `https://ar-mcp.defipy-devs.workers.dev/`
- x402scan listing: `https://www.x402scan.com/server/c7c5463d-6fa1-413e-8844-fe05e7689119`
- PyPI: `https://pypi.org/project/anchorregistry/`
- Genesis anchor: `https://anchorregistry.ai/AR-2026-qnPOJ1z`
- defipy: `https://pypi.org/project/defipy/`
- Email: `mailto:imoore@anchorregistry.com`
- Domains in footer: `https://anchorregistry.com`, `https://anchorregistry.ai`

Playwright preserves `<a href>` as clickable annotations in the PDF by default. Verify after rendering by opening the PDF and clicking each link.

## Avoid this failure mode

Playwright's `page.pdf()` does NOT wait for web fonts by default. If you call it too early, the PDF will render with system fallback fonts and look wrong — but only subtly wrong, in a way that's easy to miss. Two safeguards:

1. Before calling `page.pdf()`, await `document.fonts.ready` via `page.evaluate("document.fonts.ready")`
2. Optionally also wait for `networkidle` to be sure Google Fonts CSS has fully loaded

If the PDF comes out looking *almost right but the type weight feels off*, this is likely the cause.

## Diagram-specific check

The provenance diagram is an inline SVG inside the React component (not an `<img>`, not a `<canvas>`). This matters because:

- SVG renders cleanly to PDF at any zoom — that's good
- But the SVG references `fontFamily: "'IBM Plex Sans', sans-serif"` inline, so the printed PDF needs Plex actually loaded at print time, not just the fallback. If the PDF prints with the system sans-serif fallback, the diagram labels will look subtly wrong. Verify Plex is rendering in the diagram specifically, not just the body text.
- The SVG colors are hardcoded hex values (not Tailwind tokens), so they should survive `@media print` regardless of background-color stripping. Worth confirming.

## Genesis caption is centered

The genesis caption (`Genesis anchor: AR-2026-qnPOJ1z — the registry, in its own registry.`) is `text-center` in the HTML. Make sure that survives the print rendering — some browsers strip text-align in print stylesheets unless explicitly set.

## Build pipeline

Once the script works, wire it into Vercel's build so the PDF gets generated as part of `npm run build` and `public/onepager.pdf` lands in the deployment. Two ways:

- Add a `prebuild` or `postbuild` script in `package.json` (build-time generation, always in sync with the page, but adds Chromium to the build environment)
- Or run the PDF build step manually and commit `public/onepager.pdf` to the repo (smaller build, but you have to remember to regenerate)

Surface the question explicitly and let me decide. If you're confident about Vercel's environment supporting Playwright, go ahead with build-time. If there's any concern about build complexity or duration, manual-regen is fine.

## Verification

When you think it's working, render the PDF and verify:

1. Single letter page (no overflow to page 2)
2. All section content present and in the same order as the HTML
3. The three-step provenance diagram renders correctly with all node labels and AR-IDs visible
4. Dark background prints (not stripped to white)
5. All hyperlinks are clickable and resolve to the right URLs
6. Fonts are IBM Plex (not browser fallback)
7. Colors match the HTML (gold, electric blue, off-white)

Open the PDF and check each of these manually before declaring done.

## Concrete success criterion

The PDF is "done" when:

1. Running `npm run build:pdf` produces `public/onepager.pdf` from a clean state in under 30 seconds
2. The PDF looks indistinguishable from a Cmd+P print of `localhost:3000/onepager` in Chrome (modulo the `@media print` improvements)
3. Visiting `https://anchorregistry.com/onepager.pdf` after deploy returns the file with a `Content-Type: application/pdf` header
4. Clicking any link in the PDF opens the correct URL in the user's browser

## Things worth flagging if they come up

- If Vercel's build environment struggles with Playwright/Chromium, the manual-regen + commit approach is a fine fallback — surface it
- If the dev server takes too long to compile during the script run, switching to `next build && next start` (production server) might be faster than `next dev`
- If the page is rendering slightly differently in print than on screen (other than the intended `@media print` adjustments), that's a real bug — surface it before working around it
- The `mb-9` between sections may print taller than ideal — small spacing tweaks via `@media print` are fine

## What's not in scope

- Don't touch `app/onepager/page.tsx` content. Layout/styling tweaks via `@media print` are fine, content edits are not.
- Don't add a runtime API route that generates PDFs on demand — build-time is correct here.
- Don't reimplement the diagram in ReportLab/Pillow/SVG primitives. The whole point is to print the HTML.

## Process notes

Don't generate code until you've read the existing files listed above and confirmed the project structure. If anything's surprising or contradicts the brief, surface it before writing — the brief was written without full visibility into every file.

Try the simplest possible version first — get *any* PDF rendering, then iterate. Don't try to nail the print stylesheet, the build wiring, and the Vercel deployment all in one pass. Build-render-look-fix-render is the fastest loop.
