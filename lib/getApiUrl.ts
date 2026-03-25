import { headers } from 'next/headers'

export async function getApiUrl(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? ''
  if (host.includes('testnet')) {
    return 'https://ar-api-testnet-production.up.railway.app'
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
}
