/** Client-side testnet check */
export function isTestnetClient(): boolean {
  return typeof window !== 'undefined' && window.location.host.includes('testnet')
}

/** Client-side network name */
export function getNetworkNameClient(): string {
  return isTestnetClient() ? 'Base Sepolia' : 'Base mainnet'
}
