# ar-web — AnchorRegistry Frontend

> Immutable provenance infrastructure for the AI era.

Next.js 14 frontend for AnchorRegistry. App Router, TypeScript, Tailwind CSS. Deployed to Vercel.

**BUSL-1.1**

> Patent pending — USPTO Provisional Application #64/009,841, filed March 18, 2026.

**SPDX-Anchor: [anchorregistry.ai/AR-2026-0000001](https://anchorregistry.ai/AR-2026-0000001)**

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | File drop, manifest, Stripe Checkout |
| `/register/success` | Post-payment confirmation, polls for AR-ID |
| `/verify` | AR-ID lookup input |
| `/verify/[id]` | Full anchor record + ArtifactTree |

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
│   ├── globals.css                     # tokens, reset, animations
│   ├── layout.tsx                      # root layout, metadata
│   ├── page.tsx                        # / landing
│   ├── register/
│   │   ├── page.tsx                    # /register — file drop + manifest + pay
│   │   └── success/
│   │       ├── page.tsx                # /register/success — shell + suspense
│   │       └── SuccessContent.tsx      # polls for AR-ID, confirmed state
│   ├── verify/
│   │   ├── page.tsx                    # /verify — AR-ID input
│   │   └── [id]/
│   │       ├── page.tsx                # /verify/:id — anchor record
│   │       └── ArtifactTree.tsx        # IP lineage tree component
│   └── api/
│       ├── checkout/
│       │   └── route.ts                # POST — creates Stripe Checkout session
│       ├── registration-status/
│       │   └── route.ts                # GET — polls ar-api for AR-ID confirmation
│       └── verify/
│           └── [id]/
│               └── route.ts            # GET — machine-readable JSON verify endpoint
├── components/
│   ├── Nav.tsx                         # sticky nav, mobile menu
│   └── Footer.tsx                      # footer
├── lib/
│   └── api.ts                          # fetch wrapper for ar-api
├── next.config.ts                      # API rewrite proxy to ar-api
├── tailwind.config.ts                  # brand color tokens
└── .env.local.example
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=https://anchorregistry.com
```

## Registration Flow

```
User drops file → SHA-256 in browser (file never uploaded)
  → fills manifest → Pay $5
  → /api/checkout/route.ts → Stripe Checkout session
  → Stripe redirect → payment complete
  → Stripe webhook → ar-api → on-chain → Supabase
  → /register/success → polls /api/registration-status
  → AR-ID confirmed → copy URL → share
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
