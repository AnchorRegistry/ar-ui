import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// POST /api/seal
// Proxies to ar-api POST /registration/seal so the browser stays on-origin
// and we don't depend on CORS allowing anchorregistry.ai → api.anchorregistry.ai.
//
// Expected body: { ar_id, reason?, new_tree_root?, token_commitment }
// where token_commitment = "0x" + sha256(anchor_key + ar_id), computed
// client-side from the user-supplied anchor key.

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
