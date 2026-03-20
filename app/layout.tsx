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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
