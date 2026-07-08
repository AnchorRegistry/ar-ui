import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title:       'AnchorRegistry™ — Anchor your work on-chain.',
  description: 'Register any digital artifact and receive permanent, verifiable, on-chain proof of authorship. One payment. No expiry. Verifiable by any human or AI, forever.',
  openGraph: {
    title:       'AnchorRegistry™ — Prove you made it first.',
    description: 'Immutable provenance infrastructure for the AI era.',
    url:         'https://anchorregistry.com',
    siteName:    'AnchorRegistry',
    type:        'website',
  },
  twitter: {
    card:    'summary_large_image',
    site:    '@anchorregistry',
    creator: '@ic3moore',
  },
  metadataBase: new URL('https://anchorregistry.com'),
}

// Schema.org JSON-LD for entity resolution and AI canonicality.
// Binds the AnchorRegistry domain, the company, and the operator together
// with sameAs links across the project's public surfaces (parallel .ai
// domain, X profile, the foundational arXiv paper, the PyPI package).
//
// Mirrors the same pattern used on echoledger.ai (Organization + Person in a
// shared @graph). The Person here is the same individual (Ian Moore), and
// his external sameAs profiles (GitHub, arXiv author, Medium, X) are listed
// identically across both sites — that's how search/AI systems reconcile
// the two organizations as run by the same founder.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph':   [
    {
      '@type':      'Organization',
      '@id':        'https://anchorregistry.com/#organization',
      name:         'AnchorRegistry',
      url:          'https://anchorregistry.com',
      description:
        'Provenance infrastructure for the agentic economy. Register any digital artifact and receive permanent, verifiable, on-chain proof of authorship. One payment. No expiry. Verifiable by any human or AI, forever.',
      founder: { '@id': 'https://anchorregistry.com/#person' },
      sameAs: [
        'https://anchorregistry.ai',
        'https://x.com/anchorregistry',
        'https://arxiv.org/abs/2604.03434',
        'https://pypi.org/project/anchorregistry/',
      ],
    },
    {
      '@type':   'Person',
      '@id':     'https://anchorregistry.com/#person',
      name:      'Ian Moore',
      jobTitle:  'Founder, AnchorRegistry',
      affiliation: { '@id': 'https://anchorregistry.com/#organization' },
      sameAs: [
        'https://github.com/defipy-devs',
        'https://defipy.org',
        'https://arxiv.org/a/moore_i_1',
        'https://medium.com/@ic3moore',
        'https://x.com/ic3moore',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
