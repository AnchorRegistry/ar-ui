import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// POST /api/seal
// Proxies to ar-api POST /registration/seal so the browser stays on-origin
// and we don't depend on CORS allowing anchorregistry.ai → api.anchorregistry.ai.
//
// Expected body: { ar_id, reason?, new_tree_root?, token_commitment }
// where token_commitment = "0x" + keccak256(K_bytes ‖ ar_id_utf8),
// computed client-side from the user-supplied Anchor Key (K is the
// 0x-prefixed bytes32 decoded to 32 raw bytes; ar_id is UTF-8 bytes).
// Matches the construction in ar-ui/app/register/confirm/page.tsx
// and the paper spec (anchorregistry_gt.pdf §4.2).

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const apiUrl = await getApiUrl()

    const res = await fetch(`${apiUrl}/registration/seal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail ?? `Seal failed (${res.status})` },
        { status: res.status },
      )
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('seal proxy error:', err)
    return NextResponse.json({ detail: 'Seal failed' }, { status: 500 })
  }
}
