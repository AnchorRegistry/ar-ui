async function getApiUrl(): Promise<string> {
  let host = ''
  if (typeof window !== 'undefined') {
    host = window.location.host
  } else {
    try {
      const { headers } = await import('next/headers')
      const h = await headers()
      host = h.get('host') ?? ''
    } catch {}
  }
  if (host.includes('testnet')) {
    return 'https://ar-api-testnet-production.up.railway.app'
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
}

export interface AnchorRecord {
  ar_id:            string
  manifest_hash:    string
  artifact_type:    string
  descriptor:       string
  registrant:       string
  parent_hash:      string | null
  parent_type:      string | null
  parent_title?:    string
  depth:            number
  title?:           string
  tx_hash:          string
  block_number:     number
  block_timestamp:  string
  verify_url:       string
  machine_url:      string
  children:         { ar_id: string; artifact_type: string; depth: number; title?: string }[] | null
  url?:             string
  git_hash?:        string
  license?:         string
  doi?:             string
  text_type?:       string
  description?:     string
  file_manifest_hash?: string
  media_type?:      string
  platform?:        string
  institution?:     string
  co_authors?:      string
  data_version?:    string
  format?:          string
  row_count?:       string
  schema_url?:      string
  model_version?:   string
  architecture?:    string
  parameters?:      string
  training_dataset?: string
  agent_version?:   string
  runtime?:         string
  capabilities?:    string
  duration?:        string
  isrc?:            string
  isbn?:            string
  publisher?:       string
  post_id?:         string
  post_date?:       string
  chain_id?:        string
  asset_type?:      string
  contract_address?: string
  token_id?:        string
  block_num?:       string
  report_type?:     string
  client?:          string
  engagement?:      string
  authors?:         string
  note_type?:       string
  date?:            string
  participants?:    string
  executor?:        string
  event_type?:      string
  event_date?:      string
  location?:        string
  orchestrator?:    string
  receipt_type?:    string
  merchant?:        string
  amount?:          string
  currency?:        string
  order_id?:        string
  doc_type?:        string
  jurisdiction?:    string
  parties?:         string
  effective_date?:  string
  entity_type?:     string
  entity_domain?:   string
  verification_method?: string
  verification_proof?:  string
  canonical_url?:   string
  document_hash?:   string
  proof_type?:      string
  proof_system?:    string
  circuit_id?:      string
  vkey_hash?:       string
  audit_firm?:      string
  audit_scope?:     string
  verifier_url?:    string
  report_url?:      string
  proof_hash?:      string
  reason?:          string
  replaced_by?:     string
  review_type?:     string
  evidence_url?:    string
  review_ar_id?:    string
  finding_url?:     string
  evidence?:        string
  affirmed_by?:     string
  capacity?:        string
  kind?:            string
  value?:           string
}

export interface VerifyResponse {
  found:             boolean
  anchor:            AnchorRecord | null
  verified_on_chain: boolean
}

export async function verifyById(arId: string): Promise<VerifyResponse> {
  const res = await fetch(`${await getApiUrl()}/verify/${arId}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Verify failed: ${res.status}`)
  return res.json()
}

export async function verifyByHash(manifestHash: string): Promise<VerifyResponse> {
  const res = await fetch(`${await getApiUrl()}/verify/hash/${manifestHash}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Verify by hash failed: ${res.status}`)
  return res.json()
}

export async function getStatus() {
  const res = await fetch(`${await getApiUrl()}/status`, {
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`Status failed: ${res.status}`)
  return res.json()
}
