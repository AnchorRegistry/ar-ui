import { NextRequest, NextResponse } from 'next/server'

// GET /api/verify/[id]
// Machine-readable verification endpoint.
// This is what anchorregistry.ai/AR-2026-K7X9M2P resolves to for AI agents.

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

  try {
    const res = await fetch(`${apiUrl}/verify/${params.id}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ found: false, ar_id: params.id }, { status: 404 })
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return NextResponse.json({ found: false, ar_id: params.id }, { status: 502 })
  }
}
