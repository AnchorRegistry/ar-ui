const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface AnchorRecord {
  ar_id:            string
  manifest_hash:    string
  artifact_type:    string
  descriptor:       string
  registrant:       string
  parent_hash:      string | null
  tx_hash:          string
  block_number:     number
  block_timestamp:  string
  verify_url:       string
  machine_url:      string
  children:         string[] | null
  url?:             string
  git_hash?:        string
  license?:         string
  doi?:             string
}

export interface VerifyResponse {
  found:             boolean
  anchor:            AnchorRecord | null
  verified_on_chain: boolean
}

export async function verifyById(arId: string): Promise<VerifyResponse> {
  const res = await fetch(`${API_URL}/verify/${arId}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Verify failed: ${res.status}`)
  return res.json()
}

export async function verifyByHash(manifestHash: string): Promise<VerifyResponse> {
  const res = await fetch(`${API_URL}/verify/hash/${manifestHash}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Verify by hash failed: ${res.status}`)
  return res.json()
}

export async function getStatus() {
  const res = await fetch(`${API_URL}/status`, {
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`Status failed: ${res.status}`)
  return res.json()
}
