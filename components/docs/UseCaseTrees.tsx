'use client'

// ─────────────────────────────────────────────────────────────────────────────
// UseCaseTrees.tsx
// Five provenance tree diagrams — one per vertical in docs/use-cases.
// Visual language matches the landing page ProvenanceTreeDiagram.
// Gold pulse on root node, dashed edges, type-coloured pills, AR-IDs.
// ─────────────────────────────────────────────────────────────────────────────

// Type colours matching verify page TYPE_COLORS
const TC: Record<string, string> = {
  CODE:     '#3B82F6',
  RESEARCH: '#A855F7',
  DATA:     '#14B8A6',
  MODEL:    '#F59E0B',
  AGENT:    '#EF4444',
  POST:     '#06B6D4',
  REPORT:   '#6366F1',
  NOTE:     '#9CA3AF',
  EVENT:    '#EAB308',
  RECEIPT:  '#F97316',
  SEAL:     '#10B981',
}

const GOLD  = '#F59E0B'
const EDGE  = '#2E4270'
const SLATE = '#7B93C4'
const NW    = 150   // node width
const NH    = 76    // node height

// ─── Shared animation styles (injected into each SVG) ────────────────────────

const SVG_STYLES = `
  @keyframes ar-pulse-ring  { 0% { r:28; opacity:.5 } 100% { r:52; opacity:0 } }
  @keyframes ar-pulse-ring2 { 0% { r:28; opacity:.3 } 100% { r:68; opacity:0 } }
  @keyframes ar-glow        { 0%,100%{opacity:.12}    50%{opacity:.30} }
  .ar-pulse-inner { animation: ar-pulse-ring  2.8s ease-out infinite; }
  .ar-pulse-outer { animation: ar-pulse-ring2 2.8s ease-out infinite .4s; }
  .ar-glow        { animation: ar-glow        2.8s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .ar-pulse-inner, .ar-pulse-outer, .ar-glow { animation: none; opacity: 0; }
  }
`

// ─── Sub-components ──────────────────────────────────────────────────────────

function Defs() {
  return (
    <defs>
      <marker id="arr" markerWidth={5} markerHeight={5} refX={2.5} refY={2.5} orient="auto">
        <path d="M0,0 L5,2.5 L0,5 Z" fill={EDGE} opacity={0.9} />
      </marker>
    </defs>
  )
}

function PulseRings({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={28} fill="none" stroke={GOLD} strokeWidth={1.5} className="ar-pulse-outer" />
      <circle cx={cx} cy={cy} r={28} fill="none" stroke={GOLD} strokeWidth={1}   className="ar-pulse-inner" />
    </>
  )
}

interface NodeProps {
  cx:     number
  cy:     number
  arId:   string
  type:   string
  title:  string
  sub:    string
  isRoot?: boolean
  faded?: boolean
}

function Node({ cx, cy, arId, type, title, sub, isRoot, faded }: NodeProps) {
  const color  = TC[type] ?? SLATE
  const pillW  = type.length * 7 + 16
  const x      = cx - NW / 2
  const y      = cy - NH / 2
  const op     = faded ? 0.7 : 1

  return (
    <g opacity={op}>
      {isRoot && (
        <rect x={x} y={y} width={NW} height={NH} rx={8}
          fill={GOLD} className="ar-glow" />
      )}
      <rect x={x} y={y} width={NW} height={NH} rx={8}
        fill="#131f35"
        stroke={isRoot ? GOLD : EDGE}
        strokeWidth={isRoot ? 1.5 : 1} />
      {/* Type pill */}
      <rect x={cx - pillW / 2} y={y + 8} width={pillW} height={15} rx={7}
        fill={color + '20'} stroke={color + '50'} strokeWidth={0.8} />
      <text x={cx} y={y + 18.5} textAnchor="middle"
        fontFamily="monospace" fontSize={7.5} fill={color}
        fontWeight={600} letterSpacing="0.04em">
        {type}
      </text>
      {/* AR-ID */}
      <text x={cx} y={y + 35} textAnchor="middle"
        fontFamily="monospace" fontSize={8} fill={SLATE}>
        {arId}
      </text>
      {/* Title */}
      <text x={cx} y={y + 51} textAnchor="middle"
        fontFamily="sans-serif" fontSize={9.5} fill="#E2E8F0" fontWeight={500}>
        {title}
      </text>
      {/* Sub / role */}
      <text x={cx} y={y + 65} textAnchor="middle"
        fontFamily="monospace" fontSize={7.5} letterSpacing="0.06em"
        fill={isRoot ? GOLD + 'CC' : EDGE + 'CC'}>
        {sub}
      </text>
    </g>
  )
}

function Edge({ x1, y1, x2, y2, faded }: {
  x1: number; y1: number; x2: number; y2: number; faded?: boolean
}) {
  const fromY = y1 + NH / 2
  const toY   = y2 - NH / 2
  const midY  = (fromY + toY) / 2
  return (
    <path
      d={`M ${x1} ${fromY} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${toY}`}
      fill="none" stroke={EDGE} strokeWidth={1.5}
      strokeDasharray="5 4" opacity={faded ? 0.5 : 0.8}
      markerEnd="url(#arr)" />
  )
}

function TreeIdStrip({ vw, vy, label }: { vw: number; vy: number; label: string }) {
  return (
    <>
      <rect x={20} y={vy} width={vw - 40} height={22} rx={6} fill="#152038" opacity={0.7} />
      <text x={vw / 2} y={vy + 14} textAnchor="middle"
        fontFamily="monospace" fontSize={7.5} fill={SLATE} opacity={0.7}>
        {label}
      </text>
    </>
  )
}

function TreeWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#2E4270] bg-[#0d1829] p-4">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
        {label}
      </p>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL 1 — IP PROVENANCE
// CODE (root) → RESEARCH, POST
//               RESEARCH → MODEL
// ─────────────────────────────────────────────────────────────────────────────

export function IPProvenanceTree() {
  const VW = 520
  const VH = 440

  const root     = { cx: 260, cy: 70  }
  const research = { cx: 130, cy: 220 }
  const post     = { cx: 390, cy: 220 }
  const model    = { cx: 130, cy: 360 }

  return (
    <TreeWrapper label="IP Provenance · example tree">
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%">
        <style>{SVG_STYLES}</style>
        <Defs />

        <Edge x1={root.cx}     y1={root.cy}     x2={research.cx} y2={research.cy} />
        <Edge x1={root.cx}     y1={root.cy}     x2={post.cx}     y2={post.cy} />
        <Edge x1={research.cx} y1={research.cy} x2={model.cx}    y2={model.cy} faded />

        <PulseRings cx={root.cx} cy={root.cy} />

        <Node cx={root.cx}     cy={root.cy}     type="CODE"     isRoot
          arId="AR-2026-K7X9M2P" title="UniswapPy v1.0"       sub="root" />
        <Node cx={research.cx} cy={research.cy} type="RESEARCH"
          arId="AR-2026-N3P8Q1R" title="DeFi Whitepaper"       sub="child" />
        <Node cx={post.cx}     cy={post.cy}     type="POST"
          arId="AR-2026-W5T2X9Y" title="Launch announcement"   sub="child" />
        <Node cx={model.cx}    cy={model.cy}    type="MODEL"    faded
          arId="AR-2026-·······" title="DeFiMind v1"           sub="grandchild" />

        <TreeIdStrip vw={VW} vy={VH - 36}
          label="SPDX-Anchor: anchorregistry.ai/AR-2026-K7X9M2P · permanent prior art" />
      </svg>
    </TreeWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL 2 — AUDIT TRAIL
// REPORT (root) → NOTE, REPORT draft, EVENT
//                 REPORT draft → NOTE feedback
//                 EVENT → REPORT final
// ─────────────────────────────────────────────────────────────────────────────

export function AuditTrailTree() {
  const VW = 520
  const VH = 460

  const root   = { cx: 260, cy: 70  }
  const note1  = { cx: 100, cy: 220 }
  const draft  = { cx: 260, cy: 220 }
  const event  = { cx: 420, cy: 220 }
  const note2  = { cx: 260, cy: 360 }
  const final  = { cx: 420, cy: 360 }

  return (
    <TreeWrapper label="Audit Trail · example tree">
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%">
        <style>{SVG_STYLES}</style>
        <Defs />

        <Edge x1={root.cx}  y1={root.cy}  x2={note1.cx} y2={note1.cy} />
        <Edge x1={root.cx}  y1={root.cy}  x2={draft.cx} y2={draft.cy} />
        <Edge x1={root.cx}  y1={root.cy}  x2={event.cx} y2={event.cy} />
        <Edge x1={draft.cx} y1={draft.cy} x2={note2.cx} y2={note2.cy} faded />
        <Edge x1={event.cx} y1={event.cy} x2={final.cx} y2={final.cy} faded />

        <PulseRings cx={root.cx} cy={root.cy} />

        <Node cx={root.cx}  cy={root.cy}  type="REPORT" isRoot
          arId="AR-2026-K7X9M2P" title="ESG Assessment Q1"    sub="root · Hive Advisory" />
        <Node cx={note1.cx} cy={note1.cy} type="NOTE"
          arId="AR-2026-N3P8Q1R" title="Kickoff meeting"       sub="2026-01-15" />
        <Node cx={draft.cx} cy={draft.cy} type="REPORT"
          arId="AR-2026-W5T2X9Y" title="Draft assessment v1"   sub="version · draft" />
        <Node cx={event.cx} cy={event.cy} type="EVENT"
          arId="AR-2026-P9K4M7Q" title="Client sign-off"       sub="2026-03-10" />
        <Node cx={note2.cx} cy={note2.cy} type="NOTE"   faded
          arId="AR-2026-·······" title="Client feedback"       sub="correspondence" />
        <Node cx={final.cx} cy={final.cy} type="REPORT" faded
          arId="AR-2026-·······" title="Final delivered"       sub="version · final" />

        <TreeIdStrip vw={VW} vy={VH - 36}
          label="one treeId · one query · complete engagement history" />
      </svg>
    </TreeWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL 3 — AI COMPLIANCE
// DATA (root) → MODEL
//               MODEL → EVENT [MACHINE], AGENT
//                        AGENT → EVENT [AGENT]
// ─────────────────────────────────────────────────────────────────────────────

export function AIComplianceTree() {
  const VW = 520
  const VH = 450

  const root   = { cx: 260, cy: 70  }
  const model  = { cx: 260, cy: 210 }
  const evmach = { cx: 120, cy: 360 }
  const agent  = { cx: 390, cy: 360 }

  return (
    <TreeWrapper label="AI Compliance · example tree">
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%">
        <style>{SVG_STYLES}</style>
        <Defs />

        <Edge x1={root.cx}  y1={root.cy}  x2={model.cx}  y2={model.cy} />
        <Edge x1={model.cx} y1={model.cy} x2={evmach.cx} y2={evmach.cy} />
        <Edge x1={model.cx} y1={model.cy} x2={agent.cx}  y2={agent.cy} />

        <PulseRings cx={root.cx} cy={root.cy} />

        <Node cx={root.cx}   cy={root.cy}   type="DATA"  isRoot
          arId="AR-2026-K7X9M2P" title="Training dataset v2.1" sub="root" />
        <Node cx={model.cx}  cy={model.cy}  type="MODEL"
          arId="AR-2026-N3P8Q1R" title="DeFiMind v1.2"         sub="child" />
        <Node cx={evmach.cx} cy={evmach.cy} type="EVENT"
          arId="AR-2026-W5T2X9Y" title="Training run"          sub="executor · MACHINE" />
        <Node cx={agent.cx}  cy={agent.cy}  type="AGENT"
          arId="AR-2026-·······" title="DeFiMind agent v1.2"   sub="grandchild" />

        <TreeIdStrip vw={VW} vy={VH - 36}
          label="immutable proof · what model · what version · what action · when" />
      </svg>
    </TreeWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL 4 — SCIENTIFIC REPRODUCIBILITY
// RESEARCH (root) → DATA, CODE, RESEARCH (final paper)
// ─────────────────────────────────────────────────────────────────────────────

export function ScientificReproducibilityTree() {
  const VW = 520
  const VH = 340

  const root  = { cx: 260, cy: 70  }
  const data  = { cx: 100, cy: 230 }
  const code  = { cx: 260, cy: 230 }
  const paper = { cx: 420, cy: 230 }

  return (
    <TreeWrapper label="Scientific Reproducibility · example tree">
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%">
        <style>{SVG_STYLES}</style>
        <Defs />

        <Edge x1={root.cx} y1={root.cy} x2={data.cx}  y2={data.cy} />
        <Edge x1={root.cx} y1={root.cy} x2={code.cx}  y2={code.cy} />
        <Edge x1={root.cx} y1={root.cy} x2={paper.cx} y2={paper.cy} />

        <PulseRings cx={root.cx} cy={root.cy} />

        <Node cx={root.cx}  cy={root.cy}  type="RESEARCH" isRoot
          arId="AR-2026-K7X9M2P" title="Study protocol v1.0"  sub="root · pre-registration" />
        <Node cx={data.cx}  cy={data.cy}  type="DATA"
          arId="AR-2026-N3P8Q1R" title="Raw dataset"           sub="pre-analysis" />
        <Node cx={code.cx}  cy={code.cy}  type="CODE"
          arId="AR-2026-W5T2X9Y" title="Analysis scripts"      sub="v1.0" />
        <Node cx={paper.cx} cy={paper.cy} type="RESEARCH" faded
          arId="AR-2026-·······" title="Final paper"           sub="published" />

        <TreeIdStrip vw={VW} vy={VH - 36}
          label="hypothesis anchored before data collected · no p-hacking possible" />
      </svg>
    </TreeWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL 5 — TRANSACTION RECORDS
// REPORT (root) → RECEIPT ×2, NOTE, EVENT
// ─────────────────────────────────────────────────────────────────────────────

export function TransactionRecordsTree() {
  const VW = 520
  const VH = 340

  const root    = { cx: 260, cy: 70  }
  const rcpt1   = { cx: 80,  cy: 230 }
  const rcpt2   = { cx: 230, cy: 230 }
  const note    = { cx: 370, cy: 230 }
  const event   = { cx: 450, cy: 230 }

  return (
    <TreeWrapper label="Transaction Records · example tree">
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%">
        <style>{SVG_STYLES}</style>
        <Defs />

        <Edge x1={root.cx} y1={root.cy} x2={rcpt1.cx} y2={rcpt1.cy} />
        <Edge x1={root.cx} y1={root.cy} x2={rcpt2.cx} y2={rcpt2.cy} />
        <Edge x1={root.cx} y1={root.cy} x2={note.cx}  y2={note.cy} />
        <Edge x1={root.cx} y1={root.cy} x2={event.cx} y2={event.cy} />

        <PulseRings cx={root.cx} cy={root.cy} />

        <Node cx={root.cx}  cy={root.cy}  type="REPORT"  isRoot
          arId="AR-2026-K7X9M2P" title="Q1 2026 Expenses"     sub="root · batch" />
        <Node cx={rcpt1.cx} cy={rcpt1.cy} type="RECEIPT"
          arId="AR-2026-N3P8Q1R" title="Travel · Feb"          sub="PURCHASE · $2,340" />
        <Node cx={rcpt2.cx} cy={rcpt2.cy} type="RECEIPT"
          arId="AR-2026-W5T2X9Y" title="Software licences"     sub="PURCHASE · $890" />
        <Node cx={note.cx}  cy={note.cy}  type="NOTE"
          arId="AR-2026-P9K4M7Q" title="Expense policy v2.1"   sub="policy ref" />
        <Node cx={event.cx} cy={event.cy} type="EVENT"   faded
          arId="AR-2026-·······" title="CFO sign-off"          sub="2026-03-31" />

        <TreeIdStrip vw={VW} vy={VH - 36}
          label="one treeId covers the full accounting period · audit-ready instantly" />
      </svg>
    </TreeWrapper>
  )
}
