import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// GET /machine/[id]
// Always returns JSON — no content negotiation.
// This is the endpoint displayed on the verify page sidebar and embedded in
// README/paper footers as the DAPX-Anchor / SPDX-Anchor machine_url.
// AI agents and automated verifiers should call this directly.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiUrl = await getApiUrl()
  const maxDepth = req.nextUrl.searchParams.get('max_depth') ?? '10'

  try {
    const res = await fetch(`${apiUrl}/tree/${id}?max_depth=${maxDepth}`, {
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data, {
      status: res.ok ? 200 : res.status,
      headers: {
        'Cache-Control': 'no-store',
        'X-AnchorRegistry-Endpoint': 'machine',
      },
    })
  } catch {
    return NextResponse.json({ found: false, ar_id: id }, { status: 502 })
  }
}
