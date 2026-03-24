import { NextRequest, NextResponse } from 'next/server'

// GET /api/registration-status?session_id=cs_xxx
// Polls ar-api for the registration status of a Stripe session.
// Returns { status: 'pending' | 'confirmed' | 'failed', ar_id?: string }

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ detail: 'session_id required' }, { status: 400 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

  try {
    const res = await fetch(`${apiUrl}/registration/status/${sessionId}`, {
      next: { revalidate: 0 },  // never cache — always fresh
    })

    if (!res.ok) {
      return NextResponse.json({ status: 'pending' })
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch {
    // ar-api unreachable — return pending so client keeps polling
    return NextResponse.json({ status: 'pending' })
  }
}
