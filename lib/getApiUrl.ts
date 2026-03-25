import { headers } from 'next/headers'

export async function getApiUrl(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? ''
  if (host.includes('testnet')) {
    return 'https://api.testnet.anchorregistry.ai'
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
}
