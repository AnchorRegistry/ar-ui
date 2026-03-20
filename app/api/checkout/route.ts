import { NextRequest, NextResponse } from 'next/server'

// POST /api/checkout
// Proxies to ar-api POST /registration/pending.
//
// Three tiers: Proof ($5), Pair ($9), Tree ($12).
//   proof — single manifest, 1 anchor
//   pair  — 2 manifests, A→B
//   tree  — 3 manifests, A→B and A→C (branching from root)
//
// Proof sends flat manifest. Pair/Tree send { manifests: [...], tier }.
// ar-api wires parentHash server-side after payment — not user-entered.
// Stripe metadata: pending_id, manifest_hash (first), artifact_type (first).

const MULTI_TIERS = new Set(['pair', 'tree'])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const apiUrl = process.env.AR_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001'

    const isMulti = MULTI_TIERS.has(body.tier) && Array.isArray(body.manifests)

    if (isMulti) {
      for (let i = 0; i < body.manifests.length; i++) {
        const m = body.manifests[i]
        if (!m.manifestHash) return NextResponse.json({ detail: `Artifact ${i + 1}: manifestHash is required` }, { status: 400 })
        if (!m.artifactType) return NextResponse.json({ detail: `Artifact ${i + 1}: artifactType is required` }, { status: 400 })
        if (!m.title)        return NextResponse.json({ detail: `Artifact ${i + 1}: title is required` },       { status: 400 })
      }
    } else {
      if (!body.manifestHash) return NextResponse.json({ detail: 'manifestHash is required' }, { status: 400 })
      if (!body.artifactType) return NextResponse.json({ detail: 'artifactType is required' }, { status: 400 })
      if (!body.title)        return NextResponse.json({ detail: 'title is required' },        { status: 400 })
    }

    const mapManifest = (m: Record<string, unknown>) => ({
      manifest_hash:    m.manifestHash,
      artifact_type:    m.artifactType,
      title:            m.title            ?? '',
      author:           m.author           ?? '',
      descriptor:       m.descriptor       ?? '',
      parent_hash:      m.parentHash       ?? '',
      tier:             m.tier             ?? body.tier ?? 'proof',
      notes:            m.notes            ?? '',
      git_hash:         m.git_hash         ?? '',
      license:          m.license          ?? '',
      language:         m.language         ?? '',
      version:          m.version          ?? '',
      doi:              m.doi              ?? '',
      institution:      m.institution      ?? '',
      co_authors:       m.co_authors       ?? '',
      data_version:     m.data_version     ?? '',
      format:           m.format           ?? '',
      row_count:        m.row_count        ?? '',
      schema_url:       m.schema_url       ?? '',
      model_version:    m.model_version    ?? '',
      architecture:     m.architecture     ?? '',
      parameters:       m.parameters       ?? '',
      training_dataset: m.training_dataset ?? '',
      agent_version:    m.agent_version    ?? '',
      runtime:          m.runtime          ?? '',
      capabilities:     m.capabilities     ?? '',
      media_type:       m.media_type       ?? '',
      duration:         m.duration         ?? '',
      isrc:             m.isrc             ?? '',
      isbn:             m.isbn             ?? '',
      publisher:        m.publisher        ?? '',
      platform:         m.platform         ?? '',
      post_id:          m.post_id          ?? '',
      post_date:        m.post_date        ?? '',
      post_url:         m.post_url         ?? '',
      chain:            m.chain            ?? '',
      asset_type:       m.onchain_type     ?? '',
      contract_address: m.contract_address ?? '',
      tx_hash:          m.tx_hash          ?? '',
      token_id:         m.token_id         ?? '',
      block_number:     m.block_number     ?? '',
      receipt_type:     m.receipt_type     ?? '',
      merchant:         m.merchant         ?? '',
      amount:           m.amount           ?? '',
      currency:         m.currency         ?? '',
      order_id:         m.order_id         ?? '',
      receipt_url:      m.receipt_url      ?? '',
      doc_type:         m.document_type    ?? '',
      jurisdiction:     m.jurisdiction     ?? '',
      parties:          m.parties          ?? '',
      effective_date:   m.effective_date   ?? '',
      proof_type:       m.proof_type       ?? '',
      proof_system:     m.proof_system     ?? '',
      circuit_id:       m.circuit_id       ?? '',
      vkey_hash:        m.vkey_hash        ?? '',
      audit_firm:       m.audit_firm       ?? '',
      audit_scope:      m.audit_scope      ?? '',
      verifier_url:     m.verifier_url     ?? '',
      report_url:       m.report_url       ?? '',
      proof_hash:       m.proof_hash       ?? '',
      kind:             m.kind             ?? '',
      value:            m.value            ?? '',
      url:              m.url              ?? '',
      report_type:      m.report_type      ?? '',
      institution:      m.institution      ?? '',
      engagement:       m.engagement       ?? '',
      version:          m.version          ?? '',
      authors:          m.authors          ?? '',
      note_type:        m.note_type        ?? '',
      date:             m.date             ?? '',
      participants:     m.participants     ?? '',
    })

    const arApiPayload = isMulti
      ? { manifests: (body.manifests as Record<string, unknown>[]).map(mapManifest), tier: body.tier }
      : mapManifest(body as Record<string, unknown>)

    const res = await fetch(`${apiUrl}/registration/pending`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(arApiPayload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('ar-api error:', data)
      return NextResponse.json({ detail: data.detail ?? 'Registration failed' }, { status: res.status })
    }

    return NextResponse.json({ url: data.checkout_url })

  } catch (err) {
    console.error('Checkout route error:', err)
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 })
  }
}
