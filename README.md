# ar-web — AnchorRegistry Frontend

> Immutable provenance infrastructure for the AI era.

Next.js 14 frontend for AnchorRegistry. Three pages, App Router, TypeScript, Tailwind CSS. Deployed to Vercel.

**Private repository — BUSL-1.1**

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | File drop, manifest, Stripe payment |
| `/verify` | AR-ID lookup input |
| `/verify/[id]` | Full anchor record + IP lineage tree |

## Quick Start

```bash
cp .env.local.example .env.local
# fill in .env.local

npm install
npm run dev
```

Site at `http://localhost:3000`

## Structure

```
ar-web/
├── app/
│   ├── globals.css           # tokens, reset, animations
│   ├── layout.tsx            # root layout, metadata
│   ├── page.tsx              # / landing
│   ├── register/
│   │   └── page.tsx          # /register
│   └── verify/
│       ├── page.tsx          # /verify
│       └── [id]/
│           └── page.tsx      # /verify/:id
├── components/
│   ├── Nav.tsx               # sticky nav, mobile menu
│   └── Footer.tsx            # footer
├── lib/
│   └── api.ts                # fetch wrapper for ar-api
├── next.config.ts            # API rewrite proxy
├── tailwind.config.ts        # brand color tokens
└── .env.local.example
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Deployment

Deployed to Vercel. Connect the `ar-web` repo and set environment variables in the Vercel dashboard.

```bash
# preview
vercel

# production
vercel --prod
```

## Brand

| Token | Value |
|-------|-------|
| Background | `#152038` |
| Surface | `#1C2B4A` |
| Border | `#2E4270` |
| Gold | `#F59E0B` |
| Electric Blue | `#3B82F6` |
| Text | `#F0F4FF` |
| Muted | `#7B93C4` |

Fonts: IBM Plex Sans + IBM Plex Mono

---

## License

BUSL-1.1 — Change Date: March 12, 2028 — Change License: Apache-2.0

© 2026 Ian Moore (icmoore). All rights reserved until the Change Date.

---

*AnchorRegistry™ · anchorregistry.com · anchorregistry.ai · @anchorregistry*
