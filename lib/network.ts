import { headers } from 'next/headers'

/** Server-side testnet check (for server components & route handlers) */
export async function isTestnet(): Promise<boolean> {
  const h = await headers()
  return (h.get('host') ?? '').includes('testnet')
}

/** Returns "Base Sepolia" on testnet, "Base mainnet" otherwise (server-side) */
export async function getNetworkName(): Promise<string> {
  return (await isTestnet()) ? 'Base Sepolia' : 'Base mainnet'
}

/** Returns the block explorer TX URL for the current network (server-side) */
export async function getExplorerTxUrl(txHash: string): Promise<string> {
  return (await isTestnet())
    ? `https://sepolia.basescan.org/tx/${txHash}`
    : `https://basescan.org/tx/${txHash}`
}

/** Returns the block explorer URL for a contract/wallet address (server-side) */
export async function getExplorerAddressUrl(address: string): Promise<string> {
  return (await isTestnet())
    ? `https://sepolia.basescan.org/address/${address}`
    : `https://basescan.org/address/${address}`
}

/** Returns the current site origin, e.g. https://testnet.anchorregistry.com (server-side) */
export async function getSiteOrigin(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? 'anchorregistry.com'
  const proto = host.includes('localhost') ? 'http' : 'https'
  return `${proto}://${host}`
}
