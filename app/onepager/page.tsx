import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title:       'AnchorRegistry™ — One-pager',
  description: 'Provenance infrastructure for the agentic economy. Live on Base mainnet · MCP server · arXiv:2604.03434 · Listed on x402scan.',
  openGraph: {
    title:       'AnchorRegistry™ — Provenance infrastructure for the agentic economy.',
    description: 'On-chain provenance for creators and their agents. Live, formally proven, callable via MCP, listed on x402scan.',
    url:         'https://anchorregistry.com/onepager',
    siteName:    'AnchorRegistry',
    type:        'website',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Content — single source of truth for this page.
// Keep this in sync with the PDF generator (scripts/build_onepager_pdf.py).
// ─────────────────────────────────────────────────────────────────────────────

const GENESIS_AR_ID  = 'AR-2026-qnPOJ1z'
const GENESIS_URL    = `https://anchorregistry.ai/${GENESIS_AR_ID}`
const ARXIV_URL      = 'https://arxiv.org/abs/2604.03434'
const MCP_URL        = 'https://ar-mcp.defipy-devs.workers.dev/'
const X402SCAN_URL   = 'https://www.x402scan.com/server/c7c5463d-6fa1-413e-8844-fe05e7689119'
const BASESCAN_URL   = 'https://basescan.org/address/0x3ec509393425bcaa48224fb90c710e100ada1d2a'
const PYPI_URL       = 'https://pypi.org/project/anchorregistry/'

const VERTICALS = [
  {
    number:    '01',
    title:     'IP Provenance',
    one_liner: 'Permanent prior art for developers, researchers, creators.',
    types:     'CODE · RESEARCH · DATA · MODEL · AGENT · MEDIA · TEXT · POST',
  },
  {
    number:    '02',
    title:     'Audit Trail',
    one_liner: 'Independently verifiable engagement records for advisory and compliance firms.',
    types:     'REPORT · NOTE · EVENT',
  },
  {
    number:    '03',
    title:     'AI Compliance',
    one_liner: 'Immutable proof of what model, what data, what action, when.',
    types:     'MODEL · AGENT · DATA · EVENT',
  },
  {
    number:    '04',
    title:     'Scientific Reproducibility',
    one_liner: 'Hypotheses anchored before data. No p-hacking possible.',
    types:     'RESEARCH · DATA · CODE · EVENT',
  },
  {
    number:    '05',
    title:     'Transaction Records',
    one_liner: 'Audit-ready financial records, verifiable without AR.',
    types:     'RECEIPT · REPORT · NOTE · EVENT',
  },
]

const CREDIBILITY = [
  { text: 'Live on Base mainnet',  url: BASESCAN_URL },
  { text: 'MCP server live',       url: MCP_URL      },
  { text: 'arXiv:2604.03434',      url: ARXIV_URL    },
  { text: 'Listed on x402scan',    url: X402SCAN_URL },
]

// Placeholder AR-IDs for non-genesis nodes in the diagram. Swap these for
// real anchors from the genesis tree when convenient.
const AR_ID_CODE  = 'AR-2026-K7X9M2P'
const AR_ID_MODEL = 'AR-2026-N3P8Q1R'
const AR_ID_AGENT = 'AR-2026-W5T2X9Y'

// ─────────────────────────────────────────────────────────────────────────────
// Diagram — Trustless Provenance Trees, three-step tree growth
//
// Three steps, all solid edges. The genesis is gold; owner-attached children
// are electric blue. Each node carries a TYPE label and the full AR-ID
// stacked directly below it on the same side — reading top-down on every
// label stack is always TYPE → AR-ID. Step 3's children sit at symmetric
// 40%/60% column positions so the genesis-to-child edges have equal angles.
// ─────────────────────────────────────────────────────────────────────────────

const D_GOLD     = '#F59E0B'
const D_ELECTRIC = '#3B82F6'
const D_MUTED    = '#7B93C4'
const D_BORDER   = '#2E4270'
const D_SURFACE  = '#1C2B4A'
const D_OFFWHITE = '#F0F4FF'

function ProvenanceDiagram() {
  const W = 700, H = 210
  const COL_W = 220, COL_H = 145
  const GUTTER = 20
  const COL_X = (W - (3 * COL_W + 2 * GUTTER)) / 2

  const NODE_R = 13
  const INNER_R = 4

  type Role = 'genesis' | 'owner'
  type Corner = 'tl' | 'tr' | 'bl' | 'br'

  const fill: Record<Role, string> = {
    genesis: D_GOLD,
    owner:   D_ELECTRIC,
  }
  const stroke: Record<Role, string> = {
    genesis: D_GOLD,
    owner:   D_BORDER,
  }

  // Type label position. For top corners the type sits FURTHER from the
  // node (so the AR-ID can stack between type and node-top without crashing
  // the node circle). For bottom corners the type sits CLOSER to the node
  // (and the AR-ID stacks below it). Reading top-down on each label stack
  // is always TYPE → AR-ID.
  const cornerOffsets: Record<Corner, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
    tl: { dx: -18, dy: -22, anchor: 'end'   },
    tr: { dx:  18, dy: -22, anchor: 'start' },
    bl: { dx: -18, dy:  16, anchor: 'end'   },
    br: { dx:  18, dy:  16, anchor: 'start' },
  }

  // AR-ID is one line below the type label, same horizontal anchor.
  const arIdOffsets: Record<Corner, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
    tl: { dx: -18, dy: -10, anchor: 'end'   },
    tr: { dx:  18, dy: -10, anchor: 'start' },
    bl: { dx: -18, dy:  28, anchor: 'end'   },
    br: { dx:  18, dy:  28, anchor: 'start' },
  }

  const Node = ({ x, y, label, arId, role, corner = 'tr' }:
                { x: number; y: number; label: string; arId?: string; role: Role; corner?: Corner }) => {
    const o = cornerOffsets[corner]
    const a = arIdOffsets[corner]
    return (
      <g>
        <circle cx={x} cy={y} r={NODE_R} fill={D_SURFACE} stroke={stroke[role]} strokeWidth="1.2" />
        <circle cx={x} cy={y} r={INNER_R} fill={fill[role]} />
        <text x={x + o.dx} y={y + o.dy} textAnchor={o.anchor}
              fontSize="10" fontWeight="600" letterSpacing="0.6" fill={D_OFFWHITE}>
          {label}
        </text>
        {arId && (
          <text x={x + a.dx} y={y + a.dy} textAnchor={a.anchor}
                fontSize="7.5" fill={D_MUTED} fontFamily="'IBM Plex Mono', monospace">
            {arId}
          </text>
        )}
      </g>
    )
  }

  const Edge = ({ x1, y1, x2, y2 }:
                { x1: number; y1: number; x2: number; y2: number }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={D_MUTED} strokeWidth="1.2" opacity="0.5" />
  )

  const ColHeader = ({ i, num, label }: { i: number; num: string; label: string }) => {
    const cx = COL_X + i * (COL_W + GUTTER) + COL_W / 2
    return (
      <text x={cx} y={18} textAnchor="middle"
            fontSize="9" fontWeight="500" letterSpacing="1.4" fill={D_MUTED}>
        {num} &#160; {label}
      </text>
    )
  }

  const c = (i: number) => COL_X + i * (COL_W + GUTTER)
  const top = 36

  // Step 1 — solo genesis
  const s1_root = { x: c(0) + COL_W * 0.5, y: top + COL_H * 0.50 }

  // Step 2 — vertical chain. Root labels right, child labels left (mirror across spine).
  const s2_root = { x: c(1) + COL_W * 0.5, y: top + COL_H * 0.22 }
  const s2_code = { x: c(1) + COL_W * 0.5, y: top + COL_H * 0.78 }

  // Step 3 — branching tree. Root pushed down to 0.20 to clear column header.
  // Children placed symmetrically at 40%/60% so the genesis-to-child edges
  // form equal angles (instead of the previous asymmetric 30%/60% layout).
  const s3_root  = { x: c(2) + COL_W * 0.5,  y: top + COL_H * 0.20 }
  const s3_code  = { x: c(2) + COL_W * 0.40, y: top + COL_H * 0.60 }
  const s3_model = { x: c(2) + COL_W * 0.60, y: top + COL_H * 0.60 }
  const s3_agent = { x: c(2) + COL_W * 0.60, y: top + COL_H * 0.95 }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
         style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {[1, 2].map(i => {
        const x = COL_X + i * COL_W + (i - 0.5) * GUTTER
        return <line key={i} x1={x} y1="30" x2={x} y2={H - 12}
                     stroke={D_BORDER} strokeWidth="0.5" opacity="0.5" />
      })}

      <ColHeader i={0} num="01" label="GENESIS" />
      <ColHeader i={1} num="02" label="OWNER EXTENDS" />
      <ColHeader i={2} num="03" label="TREE GROWS" />

      {/* step 1 — solo genesis */}
      <Node {...s1_root} label="RESEARCH" arId={GENESIS_AR_ID} role="genesis" corner="tr" />

      {/* step 2 — chain */}
      <Edge x1={s2_root.x} y1={s2_root.y} x2={s2_code.x} y2={s2_code.y} />
      <Node {...s2_root} label="RESEARCH" arId={GENESIS_AR_ID} role="genesis" corner="tr" />
      <Node {...s2_code} label="CODE"     arId={AR_ID_CODE}    role="owner"   corner="bl" />

      {/* step 3 — branching tree, symmetric children */}
      <Edge x1={s3_root.x}  y1={s3_root.y}  x2={s3_code.x}  y2={s3_code.y} />
      <Edge x1={s3_root.x}  y1={s3_root.y}  x2={s3_model.x} y2={s3_model.y} />
      <Edge x1={s3_model.x} y1={s3_model.y} x2={s3_agent.x} y2={s3_agent.y} />
      <Node {...s3_root}  label="RESEARCH" arId={GENESIS_AR_ID} role="genesis" corner="tr" />
      <Node {...s3_code}  label="CODE"     arId={AR_ID_CODE}    role="owner"   corner="bl" />
      <Node {...s3_model} label="MODEL"    arId={AR_ID_MODEL}   role="owner"   corner="br" />
      <Node {...s3_agent} label="AGENT"    arId={AR_ID_AGENT}   role="owner"   corner="br" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// The page
// ─────────────────────────────────────────────────────────────────────────────

export default function OnepagerPage() {
  return (
    <main className="min-h-screen bg-bg text-off-white">
      {/* Page is a single fixed-letter container so HTML and PDF agree on geometry */}
      <article className="mx-auto flex min-h-screen max-w-[960px] flex-col px-12 py-12">

        {/* ── Header ───────────────────────────────────────────── */}
        <header className="mb-8 flex items-baseline justify-between border-b border-[#2E4270] pb-6">
          <div className="flex items-baseline gap-2">
            <Image src="/anchor.png" alt="" width={28} height={28}
                   className="translate-y-[6px]" />
            <span className="text-[26px] font-semibold tracking-tight">
              <span className="text-off-white">Anchor</span>
              <span className="text-electric-blue">Registry</span>
              <span className="ml-0.5 align-super text-[10px] font-normal text-muted-slate">™</span>
            </span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-slate">
            One-pager · April 2026
          </p>
        </header>

        {/* ── Tagline ──────────────────────────────────────────── */}
        <section className="mb-8">
          <h1 className="mb-3 text-[32px] font-semibold leading-[1.15] tracking-tight">
            The open provenance layer for the{' '}
            <span className="text-gold">agentic economy.</span>
          </h1>
          <p className="text-[14px] leading-[1.55] text-muted-slate">
            On-chain provenance infrastructure where creators, auditors, researchers, and AI
            systems register linked digital artifacts and receive permanent cryptographic proof
            of existence and authorship. Two payment rails — Stripe for humans, x402 for agents.
            One ledger.
          </p>
        </section>

        {/* ── Trustless Provenance Trees — section heading + arXiv badge ── */}
        <div className="mb-3 flex items-baseline justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Trustless Provenance Trees
          </p>
          <Link href={ARXIV_URL} target="_blank" rel="noopener"
                className="group inline-flex items-center gap-1 font-mono text-[10px] text-muted-slate transition-colors hover:text-electric-blue">
            arXiv:2604.03434
            <span className="transition-colors group-hover:text-electric-blue">↗</span>
          </Link>
        </div>

        {/* ── Hero diagram ─────────────────────────────────────── */}
        <section className="mb-3 rounded-lg border border-[#2E4270] bg-surface px-6 py-4">
          <ProvenanceDiagram />
        </section>

        {/* ── Genesis caption ──────────────────────────────────── */}
        <p className="mb-7 text-center font-mono text-[10.5px] text-muted-slate">
          Genesis anchor:{' '}
          <Link href={GENESIS_URL} className="text-electric-blue hover:underline">
            {GENESIS_AR_ID}
          </Link>{' '}
          <span className="italic">— the registry, in its own registry.</span>
        </p>

        {/* ── Not your keys, not your trees ────────────────────── */}
        <section className="mb-9 rounded-lg border border-[#2E4270] bg-surface px-6 py-5">
          <h2 className="mb-2 text-[20px] font-semibold tracking-tight text-gold">
            Not your keys, not your trees.
          </h2>
          <p className="mb-2.5 font-mono text-[12.5px] tracking-tight text-off-white/90">
            The anchor is the account. The key is the credential. The tree is the ledger.
          </p>
          <p className="text-[13px] leading-[1.55] text-muted-slate">
            No user table, no OAuth, no KYC. An agent purchases an ACCOUNT anchor via x402
            and receives the only credential it will ever need — identity, API key, billing
            account, and prepaid capacity collapsed into a single on-chain primitive. Self-custody
            is structural, not policy: the tree ID is{' '}
            <span className="font-mono text-electric-blue">keccak256(K ‖ rootArId)</span>{' '}
            and K never leaves the user.
          </p>
        </section>

        {/* ── Five verticals ───────────────────────────────────── */}
        <section className="mb-9">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
            Five verticals · twenty-four anchor types · one registry
          </p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#2E4270] bg-[#2E4270] sm:grid-cols-5">
            {VERTICALS.map(v => (
              <div key={v.number} className="bg-surface px-4 py-4">
                <div className="mb-2 font-mono text-[10px] tracking-[0.05em] text-gold">{v.number}</div>
                <div className="mb-1.5 text-[12.5px] font-medium leading-[1.25] text-off-white">
                  {v.title}
                </div>
                <p className="mb-2.5 text-[10.5px] leading-[1.4] text-muted-slate">
                  {v.one_liner}
                </p>
                <p className="font-mono text-[8.5px] leading-[1.35] text-muted-slate/70 break-words">
                  {v.types}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why now / x402 ───────────────────────────────────── */}
        <section className="mb-7">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
            Why now
          </p>
          <p className="text-[13px] leading-[1.6] text-off-white/85">
            April 2026 — the x402 Foundation launched under the Linux Foundation, with
            Google, Microsoft, AWS, Coinbase, Stripe, and Anthropic as members. Hundreds of
            agentic services are live. None have a verifiable provenance layer.{' '}
            <span className="text-off-white">AnchorRegistry is that layer</span> —
            listed on x402scan, callable via MCP, live on Base mainnet today.
          </p>
        </section>

        {/* ── Credibility row ──────────────────────────────────── */}
        <section className="mb-9">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#2E4270] bg-[#2E4270] sm:grid-cols-4">
            {CREDIBILITY.map(c => (
              <Link key={c.text} href={c.url} target="_blank" rel="noopener"
                    className="group flex items-center gap-2 bg-surface px-4 py-3.5 transition-colors hover:bg-[#243456]">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="text-[11.5px] font-medium text-off-white group-hover:text-electric-blue">
                  {c.text}
                </span>
                <span className="ml-auto text-muted-slate transition-colors group-hover:text-electric-blue">↗</span>
              </Link>
            ))}
          </div>
          <p className="mt-3 font-mono text-[9.5px] text-muted-slate">
            USPTO Provisional #64/009,841 (filed March 18, 2026)  ·{' '}
            <Link href={PYPI_URL} target="_blank" rel="noopener" className="hover:text-electric-blue">
              pip install anchorregistry
            </Link>
          </p>
        </section>

        {/* ── Founder ──────────────────────────────────────────── */}
        <section className="mb-7 border-t border-[#2E4270] pt-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
            Founder
          </p>
          <p className="text-[13px] leading-[1.6] text-off-white/85">
            <span className="font-semibold text-off-white">Ian Moore</span>, PhD Applied Mathematics.
            Founder, AnchorRegistry. Former Chief Data Scientist at Syscoin. Designed the ACCOUNT
            anchor architecture using Trustless Provenance Trees — a single on-chain primitive
            that collapses identity, credential, billing, lineage and capacity into one.
            Maintainer of{' '}
            <Link href="https://pypi.org/project/defipy/" target="_blank" rel="noopener"
                  className="text-electric-blue hover:underline">defipy</Link>{' '}
            (50,000+ downloads).
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted-slate">
            <Link href="mailto:imoore@anchorregistry.com" className="hover:text-electric-blue">
              imoore@anchorregistry.com
            </Link>
          </p>
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="mt-auto border-t border-[#2E4270] pt-5 text-[10.5px] text-muted-slate">
          <div className="flex items-baseline justify-between">
            <span>Operated by DeFiMind Inc., incorporated in Canada.</span>
            <span className="italic">The registry AIs trust.</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between font-mono text-[10px]">
            <span>
              <Link href="https://anchorregistry.com" className="hover:text-electric-blue">
                anchorregistry.com
              </Link>
              {' · '}
              <Link href="https://anchorregistry.ai" className="hover:text-electric-blue">
                anchorregistry.ai
              </Link>
            </span>
            <span className="text-muted-slate/60">v1 · April 2026</span>
          </div>
        </footer>

      </article>
    </main>
  )
}
