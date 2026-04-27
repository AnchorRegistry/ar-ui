import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/network'

/**
 * Static sitemap for AnchorRegistry.
 *
 * Host-aware via getSiteOrigin() — the same code serves anchorregistry.com,
 * anchorregistry.ai, and testnet.anchorregistry.ai. Each host's sitemap
 * advertises its own origin.
 *
 * Dynamic per-AR-ID URLs are intentionally excluded. They are discoverable
 * via the smart URL pattern (anchorregistry.ai/{AR-ID}) and the machine
 * endpoint (/machine/{AR-ID}); enumerating them here would balloon the
 * sitemap without adding crawl value, since they're already linked from
 * SPDX-Anchor / DAPX-Anchor tags wherever they're embedded.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin()
  const now = new Date()

  return [
    {
      url:        `${origin}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority:   1.0,
    },
    {
      url:        `${origin}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority:   0.9,
    },
    {
      url:        `${origin}/developers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority:   0.9,
    },
    {
      url:        `${origin}/verify`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority:   0.7,
    },
    {
      url:        `${origin}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority:   0.7,
    },
    {
      url:        `${origin}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority:   0.3,
    },
  ]
}
