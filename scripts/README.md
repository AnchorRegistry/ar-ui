# scripts

## `build-pdf.sh` — onepager PDF generator

Renders [`/onepager`](../app/onepager/page.tsx) to `public/onepager.pdf` via
Playwright's print-to-PDF, so the file is served at
`https://anchorregistry.com/onepager.pdf`.

### One-time setup

```bash
pip install -r requirements.txt
playwright install chromium
```

### Build

```bash
npm run build:pdf
```

If a dev server is already running on `localhost:3000` the script reuses it;
otherwise it starts `next dev`, waits for the port, renders, and tears it down.

### Workflow

The PDF is committed to `public/onepager.pdf`. After editing the page, run
`npm run build:pdf` and commit the updated PDF alongside the page change so
the deployed file stays in sync. Build-time generation on Vercel is not wired
up (Chromium in the build env is risky); revisit if manual regen becomes
annoying.

### Env vars

- `PORT` — port to start `next dev` on. Default `3000`. Override if 3000 is
  already in use: `PORT=3100 npm run build:pdf`.
- `AR_BASE_URL` — server to render from. Defaults to `http://localhost:$PORT`.
  Override to point at a server you're running yourself.
- `AR_PDF_OUT` — output path. Default `public/onepager.pdf`.
- `AR_READY_TIMEOUT` — seconds to wait for `next dev` to come up. Default `90`.
- `PYTHON` — python interpreter to invoke. Default `python3`. Override if
  `pip` installed to a different interpreter than your shell's `python3`
  (e.g. `PYTHON=python3.11`).
