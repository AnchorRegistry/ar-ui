import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// POST /api/reserve?count=N
// Proxies to ar-api POST /registration/reserve
// Returns { ar_ids: string[] } — pre-generated AR-IDs for client-side
// tokenCommitment and treeId computation before Stripe payment.

export async function POST(req: NextRequest) {
  try {
    const { count = 1 } = await req.json().catch(() => ({}))
    const apiUrl = await getApiUrl()

    const res = await fetch(`${apiUrl}/registration/reserve?count=${count}`, {
      method: 'POST',
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ detail: data.detail ?? 'Reserve failed' }, { status: res.status })

    return NextResponse.json(data)
  } catch (err) {
    console.error('reserve error:', err)
    return NextResponse.json({ detail: 'Reserve failed' }, { status: 500 })
  }
}
