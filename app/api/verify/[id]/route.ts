import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// GET /api/verify/[id]
// Machine-readable verification endpoint.
// This is what anchorregistry.ai/AR-2026-K7X9M2P resolves to for AI agents.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiUrl = await getApiUrl()
  const fresh  = req.nextUrl.searchParams.get('fresh') === '1' ? '?fresh=1' : ''

  try {
    const res = await fetch(`${apiUrl}/verify/${id}${fresh}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ found: false, ar_id: id }, { status: 404 })
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ found: false, ar_id: id }, { status: 502 })
  }
}
