import { NextRequest, NextResponse } from 'next/server'

// POST /api/checkout
// Creates a Stripe Checkout session and returns the redirect URL.
// The manifest hash and artifact metadata are stored in Stripe session
// metadata — the webhook in ar-api reads these to trigger on-chain registration.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      manifestHash,
      artifactType,
      title,
      author,
      license,
      url,
      descriptor,
      parentHash,
      fileName,
      fileSize,
    } = body

    // Validate required fields
    if (!manifestHash) return NextResponse.json({ detail: 'manifestHash is required' }, { status: 400 })
    if (!artifactType)  return NextResponse.json({ detail: 'artifactType is required' },  { status: 400 })
    if (!title)         return NextResponse.json({ detail: 'title is required' },          { status: 400 })
    if (!author)        return NextResponse.json({ detail: 'author is required' },         { status: 400 })

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not set')
      return NextResponse.json({ detail: 'Payment not configured' }, { status: 500 })
    }

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anchorregistry.com'

    // Build Stripe Checkout session via REST API (no SDK dependency)
    const params = new URLSearchParams({
      'mode':                                    'payment',
      'success_url':                             `${origin}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url':                              `${origin}/register`,
      'line_items[0][price_data][currency]':     'usd',
      'line_items[0][price_data][unit_amount]':  '500',  // $5.00 in cents
      'line_items[0][price_data][product_data][name]': `AnchorRegistry — ${title}`,
      'line_items[0][price_data][product_data][description]': `Permanent on-chain provenance anchor · ${artifactType} · ${author}`,
      'line_items[0][quantity]':                 '1',
      // Metadata — read by ar-api Stripe webhook to trigger registration
      'metadata[manifest_hash]':   manifestHash,
      'metadata[artifact_type]':   artifactType,
      'metadata[title]':           title,
      'metadata[author]':          author,
      'metadata[license]':         license       ?? '',
      'metadata[url]':             url           ?? '',
      'metadata[descriptor]':      descriptor    ?? '',
      'metadata[parent_hash]':     parentHash    ?? '',
      'metadata[file_name]':       fileName      ?? '',
      'metadata[file_size]':       String(fileSize ?? ''),
    })

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const session = await stripeRes.json()

    if (!stripeRes.ok) {
      console.error('Stripe error:', session)
      return NextResponse.json(
        { detail: session.error?.message ?? 'Stripe session creation failed' },
        { status: 502 }
      )
    }

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('Checkout route error:', err)
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 })
  }
}
