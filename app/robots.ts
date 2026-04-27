import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/network'

/**
 * Robots policy for AnchorRegistry.
 *
 * AnchorRegistry is built to be discovered, read, and used by AI agents.
 * All public surfaces (verify pages, docs, OpenAPI, machine endpoint) are
 * explicitly opted in for the major AI crawlers. Host-aware via
 * getSiteOrigin() so the Sitemap directive resolves to the requesting host.
 *
 * Machine-readable index: /llms.txt
 * Agent flows:             /agents.json
 * OpenAPI spec:            https://api.anchorregistry.ai/openapi.json
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteOrigin()

  const aiCrawlers = [
    'GPTBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Google-Extended',
    'cohere-ai',
    'Bytespider',
    'CCBot',
    'Applebot-Extended',
    'Meta-ExternalAgent',
    'DuckAssistBot',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
      },
      {
        userAgent: aiCrawlers,
        allow:     '/',
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  }
}
