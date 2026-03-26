import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getNetworkName } from '@/lib/network'

export const metadata: Metadata = {
  title: 'AnchorRegistry™ — Anchor your work on-chain.',
}

const STEPS = [
  {
    num:   '01',
    title: 'Artifact type',
    body:  'Twenty-two types across seven groups — code, research, data, models, reports, notes, events, receipts, and more.',
  },
  {
    num:   '02',
    title: 'Fill the manifest',
    body:  'Title, author, descriptor and type-specific fields. Everything becomes your permanent public fingerprint.',
  },
  {
    num:   '03',
    title: 'Anchor Key',
    body:  'Your self-custodied private key. Controls your entire provenance tree. Save it — it cannot be recovered.',
  },
  {
    num:   '04',
    title: 'Author notes',
    body:  'Off-chain description rendered on your verify card. Public and editable after anchoring.',
  },
]

const STATS = [
  { value: 'From $5', label: 'Per Anchor'       },
  { value: 'Forever', label: 'Record Lifetime'  },
  { value: 'Base L2', label: 'Ethereum Mainnet' },
  { value: '21',      label: 'Artifact Types'   },
]

const ROOT  = '#F59E0B'
const CHILD = '#4B5E8A'
const EDGE  = '#2E4270'

function ProofSVG() {
  return (
    <svg viewBox="0 0 24 12" width="24" height="12">
      <circle cx="12" cy="6" r="4" fill={ROOT} />
    </svg>
  )
}

function PairSVG() {
  return (
    <svg viewBox="0 0 60 12" width="60" height="12">
      <circle cx="6"  cy="6" r="4" fill={ROOT} />
      <line x1="10" y1="6" x2="46" y2="6" stroke={EDGE} strokeWidth="1.5" />
      <circle cx="50" cy="6" r="4" fill={CHILD} />
    </svg>
  )
}

function TreeSVG() {
  return (
    <svg viewBox="0 0 60 36" width="60" height="36">
      <circle cx="30" cy="6"  r="4" fill={ROOT} />
      <line x1="27" y1="9" x2="9"  y2="27" stroke={EDGE} strokeWidth="1.5" />
      <line x1="33" y1="9" x2="51" y2="27" stroke={EDGE} strokeWidth="1.5" />
      <circle cx="6"  cy="30" r="4" fill={CHILD} />
      <circle cx="54" cy="30" r="4" fill={CHILD} />
    </svg>
  )
}

const TIERS = [
  {
    value:    'proof',
    label:    'Proof',
    price:    '$5',
    anchors:  '1 anchor',
    body:     'Single artifact anchored on {network}. SHA-256 hash, permanent AR-ID, verify URL.',
    icon:     <ProofSVG />,
    featured: true,
    cta:      'Register →',
  },
  {
    value:    'pair',
    label:    'Pair',
    price:    '$9',
    anchors:  '2 anchors · A→B',
    body:     'Two artifacts linked in a provenance chain. A is the root — share one link to resolve both.',
    icon:     <PairSVG />,
    featured: false,
    cta:      'Register pair →',
  },
  {
    value:    'tree',
    label:    'Tree',
    price:    '$12',
    anchors:  '3 anchors · A→B, A→C',
    body:     'One root artifact with two children. Share the root AR-ID to resolve the full provenance tree.',
    icon:     <TreeSVG />,
    featured: false,
    cta:      'Register tree →',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// ProvenanceTreeDiagram
// ─────────────────────────────────────────────────────────────────────────────

function ProvenanceTreeDiagram({ network }: { network: string }) {
  const nodes = {
    root:  { x: 160, y: 72  },
    left:  { x: 68,  y: 218 },
    right: { x: 252, y: 218 },
  }

  const W = 158
  const H = 84

  const NodeCard = ({
    x, y, arId, type, title, role, typeColor, isRoot,
  }: {
    x: number; y: number
    arId: string; type: string; title: string; role: string
    typeColor: string; isRoot?: boolean
  }) => {
    const top    = y - H / 2
    const typeY  = top + 18
    const arIdY  = top + 36
    const titleY = top + 52
    const roleY  = top + H - 8
    const pillW  = type.length * 6.8 + 14

    return (
      <g>
        <rect x={x - W / 2} y={top} width={W} height={H} rx="6"
          fill="#131f35" stroke={isRoot ? ROOT : EDGE} strokeWidth={isRoot ? 1.5 : 1} />
        {isRoot && (
          <rect x={x - W / 2} y={top} width={W} height={H} rx="6"
            fill="none" stroke={ROOT} strokeWidth="8" strokeOpacity="0.07" />
        )}
        <rect x={x - pillW / 2} y={typeY - 9} width={pillW} height={16} rx="8"
          fill={typeColor + '20'} stroke={typeColor + '50'} strokeWidth="0.8" />
        <text x={x} y={typeY + 3.5} textAnchor="middle"
          fontFamily="monospace" fontSize="8.5" fill={typeColor} fontWeight="600" letterSpacing="0.04em">
          {type}
        </text>
        <text x={x} y={arIdY} textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#7B93C4">
          {arId}
        </text>
        <text x={x} y={titleY} textAnchor="middle"
          fontFamily="sans-serif" fontSize="10" fill="#E2E8F0" fontWeight="500">
          {title}
        </text>
        <text x={x} y={roleY} textAnchor="middle" fontFamily="monospace" fontSize="8"
          fill={isRoot ? ROOT + 'CC' : CHILD + 'CC'} letterSpacing="0.06em">
          {role}
        </text>
      </g>
    )
  }

  const edgePath = (from: {x:number;y:number}, to: {x:number;y:number}) => {
    const fy = from.y + H / 2
    const ty = to.y   - H / 2
    const my = (fy + ty) / 2
    return `M ${from.x} ${fy} C ${from.x} ${my}, ${to.x} ${my}, ${to.x} ${ty}`
  }

  return (
    <div className="rounded-lg border border-[#2E4270] bg-[#0d1829] p-6">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
        Example · Tree tier
      </p>
      <p className="mb-4 text-[12px] text-muted-slate/60">
        One payment anchors the full provenance tree
      </p>
      <svg viewBox="0 0 320 305" width="100%">
        <defs>
          <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill={EDGE} fillOpacity="0.7" />
          </marker>
        </defs>
        <path d={edgePath(nodes.root, nodes.left)} fill="none" stroke={EDGE}
          strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)" opacity="0.7" />
        <path d={edgePath(nodes.root, nodes.right)} fill="none" stroke={EDGE}
          strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)" opacity="0.7" />
        <NodeCard x={nodes.root.x} y={nodes.root.y} arId="AR-2026-K7X9M2P"
          type="RESEARCH" title="Transformer v2 · Paper" role="root" typeColor="#A855F7" isRoot />
        <NodeCard x={nodes.left.x} y={nodes.left.y} arId="AR-2026-N3P8Q1R"
          type="DATA" title="Training Dataset" role="child" typeColor="#14B8A6" />
        <NodeCard x={nodes.right.x} y={nodes.right.y} arId="AR-2026-W5T2X9Y"
          type="MODEL" title="Transformer v2" role="child" typeColor="#F59E0B" />
        <text x="160" y="292" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill="#4B5E8A">
          share AR-2026-K7X9M2P · resolves full tree
        </text>
      </svg>
      <div className="mt-3 flex items-center gap-4 border-t border-[#2E4270] pt-3 font-mono text-[9px] text-muted-slate">
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 8 8" width="8" height="8"><circle cx="4" cy="4" r="4" fill={ROOT} /></svg>
          root
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 8 8" width="8" height="8"><circle cx="4" cy="4" r="4" fill={CHILD} /></svg>
          child
        </span>
        <span className="ml-auto opacity-50">{network} · permanent</span>
      </div>
    </div>
  )
}

export default async function Home() {
  const network = await getNetworkName()
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="px-8 pb-[72px] pt-20">
          <div className="mx-auto max-w-[960px]">
            <p className="animate-fade-up mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-slate"
              style={{ animationDelay: '0.05s' }}>
              Immutable Provenance Infrastructure
            </p>
            <h1 className="animate-fade-up mb-5 max-w-[580px] text-[52px] font-semibold leading-[1.08] tracking-tight text-off-white"
              style={{ animationDelay: '0.12s' }}>
              Anchor your work<br />
              <span className="text-gold">on-chain.</span>
            </h1>
            <p className="animate-fade-up mb-9 max-w-[420px] text-[17px] font-light leading-[1.65] text-muted-slate"
              style={{ animationDelay: '0.2s' }}>
              Anchor and network your work to everything. Code, research,
              models, reports, notes, receipts — twenty-two types, one registry.
              Permanent proof of existence and lineage, verifiable by anyone, forever.
            </p>
            <div className="animate-fade-up flex items-center gap-3" style={{ animationDelay: '0.28s' }}>
              <Link href="/register"
                className="inline-flex items-center gap-1.5 rounded bg-gold px-5 py-2.5 text-[14px] font-semibold text-deep-navy transition-all hover:bg-[#FBBF24] active:scale-[0.98]">
                Register →
              </Link>
              <Link href="/verify"
                className="inline-flex items-center rounded border border-[#2E4270] px-5 py-2.5 text-[14px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white">
                Verify an AR-ID
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────── */}
        <div className="border-b border-t border-[#2E4270]">
          <div className="mx-auto max-w-[960px] px-8">
            <div className="grid grid-cols-4">
              {STATS.map((s, i) => (
                <div key={i} className={`py-7 text-center ${i < 3 ? 'border-r border-[#2E4270]' : ''}`}>
                  <div className="mb-1 text-[24px] font-semibold tracking-tight">{s.value}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Anchoring ────────────────────────────────────────────── */}
        <section id="four-steps" className="px-8 py-20">
          <div className="mx-auto max-w-[960px]">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Anchoring
            </p>
            <h2 className="mb-8 text-[28px] font-semibold tracking-tight text-off-white">
              Permanent proof in minutes
            </h2>
            <div className="grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-[#2E4270] bg-[#2E4270]">
              {STEPS.map((s) => (
                <div key={s.num} className="bg-surface px-5 py-6">
                  <div className="mb-3.5 font-mono text-[11px] tracking-[0.05em] text-gold">{s.num}</div>
                  <div className="mb-2 text-[14px] font-medium text-off-white">{s.title}</div>
                  <p className="text-[13px] leading-[1.55] text-muted-slate">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Verify demo ──────────────────────────────────────────── */}
        <section className="px-8 pb-20">
          <div className="mx-auto max-w-[960px]">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              What verification looks like
            </p>
            <div className="grid grid-cols-2 items-start gap-8">
              <div className="rounded-lg border border-[#2E4270] bg-surface p-6">
                <div className="mb-2 font-mono text-[11px] text-muted-slate">AR-2026-0000001</div>
                <div className="mb-1.5 text-[18px] font-semibold">AnchorRegistry Smart Contract v1</div>
                <div className="mb-4 text-[13px] text-muted-slate">
                  Ian Moore · March 24, 2026 · Sepolia · block 10,514,012
                </div>
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-electric-blue/25 bg-electric-blue/10 px-2.5 py-1 font-mono text-[11px] text-electric-blue">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
                  Verified on-chain
                </div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                  SHA-256 Manifest Hash
                </div>
                <div className="break-all font-mono text-[11px] leading-relaxed text-muted-slate">
                  a3f8c2e1b9d4f7a2c6e3b1d8f5a9c2e4b7d1f3a6c9e2b5d8f1a4c7e0b3d6f9a2
                </div>
              </div>
              <div className="pt-2">
                <p className="mb-5 text-[15px] leading-[1.65] text-muted-slate">
                  Every registered artifact gets a permanent verify URL. Embed it
                  anywhere — a README, paper footer, model card. Any human or AI
                  that encounters it can resolve the full provenance record.
                </p>
                <div className="mb-3 rounded-md border border-[#2E4270] bg-surface px-4 py-3.5">
                  <div className="mb-1 font-mono text-[12px] text-muted-slate"># README</div>
                  <div className="font-mono text-[12px] text-electric-blue">
                    SPDX-Anchor: <a href="https://anchorregistry.ai/AR-2026-0000001" target="_blank" rel="noopener noreferrer" className="underline decoration-electric-blue/40 hover:decoration-electric-blue transition-colors">anchorregistry.ai/AR-2026-0000001</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border border-[#2E4270] bg-surface px-4 py-3.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/15">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-gold">Anchored</div>
                    <div className="font-mono text-[11px] text-muted-slate">
                      anchorregistry.ai/AR-2026-0000001
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quote strip ──────────────────────────────────────────── */}
        <div className="border-b border-t border-[#2E4270] py-12">
          <div className="mx-auto max-w-[960px] px-8">
            <div className="grid grid-cols-2 divide-x divide-[#2E4270]">
              <div className="px-12 text-center">
                <p className="text-[17px] leading-[1.6] text-muted-slate">
                  The AI that recommended adding provenance tags to your README<br />
                  becomes a user of the registry.
                </p>
              </div>
              <div className="px-12 text-center">
                <p className="font-mono text-[20px] font-medium text-off-white">
                  Not your keys,
                </p>
                <p className="font-mono text-[20px] font-medium text-gold">
                  not your trees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <section id="pricing" className="px-8 py-20">
          <div className="mx-auto max-w-[960px]">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Pricing
            </p>
            <h2 className="mb-2 text-[28px] font-semibold tracking-tight text-off-white">
              Simple, permanent, no surprises
            </h2>
            <p className="mb-8 text-[15px] text-muted-slate">
              Build your provenance tree one anchor at a time, or register a linked set in one payment.
            </p>

            <div className="grid grid-cols-[1fr_340px] items-start gap-8">
              <div className="space-y-3">
                {TIERS.map(t => (
                  <div key={t.value}
                    className={`flex items-center gap-5 rounded-lg border bg-surface p-5 ${
                      t.featured ? 'border-electric-blue' : 'border-[#2E4270]'
                    }`}>
                    <div className="flex w-[72px] shrink-0 items-center justify-center rounded border border-[#2E4270] bg-[#152038] px-3 py-2.5">
                      {t.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-0.5 flex items-baseline gap-2">
                        <span className="text-[18px] font-semibold text-off-white">{t.price}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">{t.label}</span>
                        <span className="font-mono text-[10px] text-muted-slate/50">{t.anchors}</span>
                      </div>
                      <p className="text-[13px] leading-snug text-muted-slate">{t.body.replace('{network}', network)}</p>
                    </div>
                    <Link href={`/register?tier=${t.value}`}
                      className={`shrink-0 rounded px-4 py-2 text-[13px] font-medium transition-all whitespace-nowrap ${
                        t.featured
                          ? 'border border-electric-blue bg-electric-blue text-off-white hover:bg-blue-600'
                          : 'border border-[#2E4270] text-muted-slate hover:border-muted-slate hover:text-off-white'
                      }`}>
                      {t.cta}
                    </Link>
                  </div>
                ))}
                <div className="flex items-center gap-5 pt-1 font-mono text-[10px] text-muted-slate">
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 8 8" width="8" height="8"><circle cx="4" cy="4" r="4" fill={ROOT} /></svg>
                    root artifact — share this AR-ID
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 8 8" width="8" height="8"><circle cx="4" cy="4" r="4" fill={CHILD} /></svg>
                    child artifact
                  </span>
                </div>
              </div>
              <div className="sticky top-20">
                <ProvenanceTreeDiagram network={network} />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
