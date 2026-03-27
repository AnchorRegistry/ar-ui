import { headers } from 'next/headers'

export async function getApiUrl(): Promise<string> {
  // NEXT_PUBLIC_API_URL is set per-environment in Vercel and is the authoritative
  // signal for which backend to use. Fall back to host-sniffing only if not set.
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  const h = await headers()
  const host = h.get('host') ?? ''
  if (host.includes('testnet')) {
    return 'https://ar-api-testnet-production.up.railway.app'
  }
  return 'http://localhost:8000'
}
