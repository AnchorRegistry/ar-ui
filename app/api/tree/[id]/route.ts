import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/getApiUrl'

// GET /api/tree/[id]
// Proxies to ar-api GET /tree/{ar_id}.
// Returns full subtree as a flat BFS-sorted node array.

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
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json({ found: false, ar_id: id }, { status: 502 })
  }
}
