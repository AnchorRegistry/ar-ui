import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// GET /[id]  — anchorregistry.ai/{id}
//
// Content negotiation:
//   Accept: application/json  → return /tree/{id} JSON subtree (machine path)
//   Accept: text/html         → redirect to anchorregistry.com/verify/{id} (human path)
//
// Named routes (/register, /verify, /tree, /docs, /api, /machine) take
// priority over this catch-all in Next.js — no conflict.

const VERIFY_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anchorregistry.com'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Only handle AR-ID patterns — let Next.js serve everything else (favicon.ico, etc.)
  if (!id.startsWith('AR-')) {
    return new NextResponse(null, { status: 404 })
  }

  const accept = req.headers.get('accept') ?? ''

  if (accept.includes('application/json')) {
    const apiUrl = await getApiUrl()
    try {
      const res = await fetch(`${apiUrl}/tree/${id}`, { cache: 'no-store' })
      const data = await res.json()
      return NextResponse.json(data, {
        status: res.ok ? 200 : res.status,
        headers: { 'Cache-Control': 'no-store' },
      })
    } catch {
      return NextResponse.json({ found: false, ar_id: id }, { status: 502 })
    }
  }

  // Browser or unspecified — redirect to human-readable verify page
  return NextResponse.redirect(`${VERIFY_BASE}/verify/${id}`, 302)
}
