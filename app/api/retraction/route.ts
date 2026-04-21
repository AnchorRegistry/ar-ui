import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// POST /api/retraction
// Proxies to ar-api POST /registration/retraction.
//
// The RETRACTION anchor needs a NEW AR-ID of its own. This proxy reserves
// one automatically so the client-facing payload stays simple:
//
//   { target_ar_id, reason?, replaced_by?, token_commitment }
//
// token_commitment = "0x" + sha256(anchor_key + target_ar_id), computed
// client-side from the user-supplied anchor key.
//
// The $2 Stripe payment gate described in the Phase 9 spec is deferred —
// the API enforces ownership via the token commitment; price enforcement
// can be added API-side in a follow-up without changing the UI contract.

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json().catch(() => ({}))
    const apiUrl = await getApiUrl()

    const { target_ar_id, token_commitment } = body
    if (!target_ar_id || !token_commitment) {
      return NextResponse.json(
        { detail: 'target_ar_id and token_commitment are required' },
        { status: 400 },
      )
    }

    // Reserve a fresh AR-ID for the RETRACTION anchor itself.
    const reserveRes = await fetch(`${apiUrl}/registration/reserve?count=1`, {
      method: 'POST',
    })
    const reserveData = await reserveRes.json().catch(() => ({}))
    if (!reserveRes.ok || !Array.isArray(reserveData.ar_ids) || reserveData.ar_ids.length === 0) {
      return NextResponse.json(
        { detail: reserveData.detail ?? 'Failed to reserve AR-ID for retraction' },
        { status: reserveRes.status || 500 },
      )
    }
    const newArId: string = reserveData.ar_ids[0]

    const res = await fetch(`${apiUrl}/registration/retraction`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ar_id:            newArId,
        target_ar_id,
        reason:           body.reason ?? '',
        replaced_by:      body.replaced_by ?? '',
        token_commitment,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail ?? `Retraction failed (${res.status})` },
        { status: res.status },
      )
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('retraction proxy error:', err)
    return NextResponse.json({ detail: 'Retraction failed' }, { status: 500 })
  }
}
