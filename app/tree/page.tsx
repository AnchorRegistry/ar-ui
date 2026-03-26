'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { getNetworkNameClient } from '@/lib/network.client'
import Footer from '@/components/Footer'

const ROOT  = '#F59E0B'
const CHILD = '#4B5E8A'
const EDGE  = '#2E4270'
const PULSE = '#3B82F6'

const TYPE_COLORS: Record<string, string> = {
  RESEARCH: '#A855F7',
  POST:     '#EC4899',
  CODE:     '#3B82F6',
  MODEL:    '#F59E0B',
  AGENT:    '#EF4444',
  MEDIA:    '#14B8A6',
}

const CW = 190
const CH = 100

function NodeCard({
  x, y, arId, type, title, role, isRoot, isNew,
}: {
  x: number; y: number
  arId: string; type: string; title: string; role: string
  isRoot?: boolean; isNew?: boolean
}) {
  const top       = y - CH / 2
  const typeColor = TYPE_COLORS[type] ?? '#7B93C4'
  const pillW     = type.length * 7.8 + 18
  const borderCol = isNew ? PULSE : isRoot ? ROOT : EDGE
  const strokeW   = isNew || isRoot ? 2 : 1.2

  return (
    <g>
      {(isNew || isRoot) && (
        <rect x={x - CW / 2} y={top} width={CW} height={CH} rx="8"
          fill="none" stroke={isNew ? PULSE : ROOT} strokeWidth="10" strokeOpacity="0.1" />
      )}
      <rect x={x - CW / 2} y={top} width={CW} height={CH} rx="8"
        fill="#131f35" stroke={borderCol} strokeWidth={strokeW} />
      <rect x={x - pillW / 2} y={top + 11} width={pillW} height={18} rx="9"
        fill={typeColor + '20'} stroke={typeColor + '50'} strokeWidth="1" />
      <text x={x} y={top + 24} textAnchor="middle"
        fontFamily="monospace" fontSize="10" fill={typeColor} fontWeight="600" letterSpacing="0.05em">
        {type}
      </text>
      <text x={x} y={top + 46} textAnchor="middle"
        fontFamily="monospace" fontSize="11" fill="#7B93C4">
        {arId}
      </text>
      <text x={x} y={top + 64} textAnchor="middle"
        fontFamily="sans-serif" fontSize="12" fill="#E2E8F0" fontWeight="500">
        {title}
      </text>
      <text x={x} y={top + CH - 10} textAnchor="middle"
        fontFamily="monospace" fontSize="9"
        fill={isRoot ? ROOT + 'CC' : CHILD + 'BB'} letterSpacing="0.07em">
        {role}
      </text>
    </g>
  )
}

function ExpandedAnchorCard({ cx }: { cx: number }) {
  const W         = 560
  const PAD       = 28
  const x         = cx - W / 2
  const typeColor = TYPE_COLORS.RESEARCH

  const fields: [string, string][] = [
    ['Title',       'Transformer v2 · Paper'    ],
    ['Author',      'Ian Moore'                 ],
    ['Descriptor',  'ICMOORE-2026-TRANSFORMER'  ],
    ['License',     'CC-BY-4.0'                 ],
    ['DOI',         '10.1234/transformer-v2'    ],
    ['URL',         'arxiv.org/abs/2026.00042'  ],
    ['Institution', 'MIT · Stanford'            ],
    ['Co-authors',  'J. Smith, A. Patel'        ],
  ]

  const notesLines = [
    'This paper introduces a novel transformer architecture optimized for long-context reasoning tasks.',
    'It was trained on a curated dataset of scientific literature and code spanning 12 domains.',
    'Intended for use as a foundation model — downstream users are encouraged to anchor derivative works.',
  ]

  const TOP           = 22
  const PILL_H        = 26
  const ARID_Y        = TOP + PILL_H + 20
  const SEP1_Y        = ARID_Y + 18
  const FIELD_START   = SEP1_Y + 16
  const ROW_H         = 22
  const NOTES_LABEL_Y = FIELD_START + fields.length * ROW_H + 10
  const NOTES_LINE_H  = 18
  const NOTES_LINE1_Y = NOTES_LABEL_Y + 18
  const SEP2_Y        = NOTES_LINE1_Y + notesLines.length * NOTES_LINE_H + 12
  const HASH_Y        = SEP2_Y + 18
  const ROLE_Y        = HASH_Y + 22
  const CARD_H        = ROLE_Y + 18
  const y             = 14
  const pillW         = 'RESEARCH'.length * 8.5 + 20

  return (
    <g>
      <rect x={x} y={y} width={W} height={CARD_H} rx="10"
        fill="none" stroke={ROOT} strokeWidth="12" strokeOpacity="0.07" />
      <rect x={x} y={y} width={W} height={CARD_H} rx="10"
        fill="#0d1829" stroke={ROOT} strokeWidth="2" />
      <rect x={cx - pillW / 2} y={y + TOP - 12} width={pillW} height={PILL_H} rx="13"
        fill={typeColor + '20'} stroke={typeColor + '50'} strokeWidth="1" />
      <text x={cx} y={y + TOP + 6} textAnchor="middle"
        fontFamily="monospace" fontSize="12" fill={typeColor} fontWeight="700" letterSpacing="0.07em">
        RESEARCH
      </text>
      <text x={cx} y={y + ARID_Y} textAnchor="middle"
        fontFamily="monospace" fontSize="14" fill="#7B93C4" letterSpacing="0.03em">
        AR-2026-K7X9M2P
      </text>
      <line x1={x + PAD} y1={y + SEP1_Y} x2={x + W - PAD} y2={y + SEP1_Y}
        stroke={EDGE} strokeWidth="1" />
      {fields.map(([label, value], i) => {
        const fy = y + FIELD_START + i * ROW_H
        return (
          <g key={label}>
            <text x={x + PAD} y={fy}
              fontFamily="monospace" fontSize="10" fill="#4B5E8A" letterSpacing="0.05em">
              {label.toUpperCase()}
            </text>
            <text x={x + W - PAD} y={fy} textAnchor="end"
              fontFamily="sans-serif" fontSize="11.5" fill="#CBD5E1">
              {value}
            </text>
          </g>
        )
      })}
      <text x={x + PAD} y={y + NOTES_LABEL_Y}
        fontFamily="monospace" fontSize="10" fill="#3B82F6" letterSpacing="0.05em">
        AUTHOR NOTES
      </text>
      <rect x={x + PAD + 110} y={y + NOTES_LABEL_Y - 12} width={60} height={14} rx="7"
        fill="#3B82F620" stroke="#3B82F650" strokeWidth="0.8" />
      <text x={x + PAD + 140} y={y + NOTES_LABEL_Y - 2} textAnchor="middle"
        fontFamily="monospace" fontSize="8.5" fill="#3B82F6" letterSpacing="0.03em">
        off-chain
      </text>
      {notesLines.map((line, i) => (
        <text key={i}
          x={x + PAD} y={y + NOTES_LINE1_Y + i * NOTES_LINE_H}
          fontFamily="sans-serif" fontSize="11" fill="#3B82F6CC" fontStyle="italic">
          {line}
        </text>
      ))}
      <line x1={x + PAD} y1={y + SEP2_Y} x2={x + W - PAD} y2={y + SEP2_Y}
        stroke={EDGE} strokeWidth="1" />
      <text x={cx} y={y + HASH_Y} textAnchor="middle"
        fontFamily="monospace" fontSize="10" fill="#4B5E8A" letterSpacing="0.02em">
        sha256:a3f8c2e1b9d4f7a2c6e3b1d8f5a9c2e4b7d1f3a6c9e2b5d8...
      </text>
      <text x={cx} y={y + ROLE_Y} textAnchor="middle"
        fontFamily="monospace" fontSize="11" fill={ROOT + 'CC'} letterSpacing="0.09em">
        root
      </text>
    </g>
  )
}

function Edge({ x1, y1, x2, y2, isNew }: {
  x1: number; y1: number; x2: number; y2: number; isNew?: boolean
}) {
  const fy = y1 + CH / 2
  const ty = y2 - CH / 2
  const my = (fy + ty) / 2
  const d  = `M ${x1} ${fy} C ${x1} ${my}, ${x2} ${my}, ${x2} ${ty}`
  return (
    <path d={d} fill="none"
      stroke={isNew ? PULSE : EDGE}
      strokeWidth={isNew ? 2 : 1.5}
      strokeDasharray="5 4"
      opacity={isNew ? 0.95 : 0.65}
      markerEnd="url(#arr)"
    />
  )
}

const POS = {
  research: { x: 480, y:  80 },
  post:     { x: 220, y: 240 },
  code:     { x: 680, y: 240 },
  media:    { x: 340, y: 400 },
  model:    { x: 560, y: 400 },
  agent:    { x: 780, y: 400 },
}

const NODES = {
  research: { arId: 'AR-2026-K7X9M2P', type: 'RESEARCH', title: 'Transformer v2 · Paper',  role: 'root',  isRoot: true },
  post:     { arId: 'AR-2026-P4R8T1N', type: 'POST',     title: 'X/Twitter Post of Paper',  role: 'child'              },
  code:     { arId: 'AR-2026-C2X5Q9Y', type: 'CODE',     title: 'transformer-v2 · GitHub',  role: 'child'              },
  media:    { arId: 'AR-2026-V5H2J8R', type: 'MEDIA',    title: 'YouTube Video - Concept',  role: 'child'              },
  model:    { arId: 'AR-2026-M7L3W6K', type: 'MODEL',    title: 'Transformer v2 Weights',   role: 'child'              },
  agent:    { arId: 'AR-2026-A9F1B4D', type: 'AGENT',    title: 'ResearchBot v1',           role: 'child'              },
}

type NodeKey = keyof typeof NODES

const EDGES = {
  researchToPost: { x1: POS.research.x, y1: POS.research.y, x2: POS.post.x,  y2: POS.post.y  },
  researchToCode: { x1: POS.research.x, y1: POS.research.y, x2: POS.code.x,  y2: POS.code.y  },
  codeToMedia:    { x1: POS.code.x,     y1: POS.code.y,     x2: POS.media.x, y2: POS.media.y },
  codeToModel:    { x1: POS.code.x,     y1: POS.code.y,     x2: POS.model.x, y2: POS.model.y },
  codeToAgent:    { x1: POS.code.x,     y1: POS.code.y,     x2: POS.agent.x, y2: POS.agent.y },
}

type EdgeKey = keyof typeof EDGES

interface Act {
  step:        number
  tier:        string
  tierPrice:   string
  tierColor:   string
  who:         string
  headline:    string
  body:        string
  newNodes:    NodeKey[]
  newEdges:    EdgeKey[]
  allNodes:    NodeKey[]
  allEdges:    EdgeKey[]
  entryPoint?: string
  entryNote?:  string
}

const ACTS: Act[] = [
  {
    step: 1, tier: 'Anchor', tierPrice: '$5', tierColor: ROOT, who: 'You',
    headline: 'Drop your anchor',
    body: 'You publish your research paper and register it on-chain. One artifact, one payment, one permanent AR-ID. The root anchor is yours — timestamped, immutable, and publicly verifiable forever.',
    newNodes: ['research'], newEdges: [],
    allNodes: ['research'], allEdges: [],
  },
  {
    step: 2, tier: 'Tree', tierPrice: '$12', tierColor: ROOT, who: 'You',
    headline: 'Announce it. Ship the code.',
    body: 'You post the announcement thread and release the implementation. One Tree payment registers both, linked back to the paper. Your root AR-ID now resolves the announcement and the code — all yours, all traceable.',
    newNodes: ['post', 'code'], newEdges: ['researchToPost', 'researchToCode'],
    allNodes: ['research', 'post', 'code'],
    allEdges: ['researchToPost', 'researchToCode'],
  },
  {
    step: 3, tier: 'Pair', tierPrice: '$9', tierColor: '#7B93C4', who: 'A collaborator',
    headline: 'Others declare their lineage.',
    body: 'A collaborator trains a model on your code and builds an agent from it. They register both and declare your code as their parent — that declaration is theirs to make. The registry records it. Your root anchor is unchanged.',
    newNodes: ['model', 'agent'], newEdges: ['codeToModel', 'codeToAgent'],
    allNodes: ['research', 'post', 'code', 'model', 'agent'],
    allEdges: ['researchToPost', 'researchToCode', 'codeToModel', 'codeToAgent'],
  },
  {
    step: 4, tier: 'Anchor', tierPrice: '$5', tierColor: '#EC4899', who: 'Another collaborator',
    headline: 'The record grows on its own.',
    body: "A second collaborator makes a concept video based on the code and anchors it, declaring the GitHub repo as their parent. They wrote their own provenance — you didn't need to approve it. Like a citation. The tree is a public record, not a managed collaboration. Permissions are coming in V2.",
    newNodes: ['media'], newEdges: ['codeToMedia'],
    allNodes: ['research', 'post', 'code', 'model', 'agent', 'media'],
    allEdges: ['researchToPost', 'researchToCode', 'codeToModel', 'codeToAgent', 'codeToMedia'],
    entryPoint: 'AR-2026-K7X9M2P',
    entryNote: 'Share this AR-ID — it resolves everything rooted here. Every artifact, every contributor, every timestamp. Permanently.',
  },
]

function TreeSVG({ act }: { act: Act }) {
  const isStep1 = act.step === 1
  return (
    <svg viewBox={isStep1 ? '0 0 960 480' : '0 0 960 520'} width="100%">
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={EDGE} fillOpacity="0.65" />
        </marker>
      </defs>
      {isStep1 ? (
        <ExpandedAnchorCard cx={480} />
      ) : (
        <>
          {act.allEdges.filter(k => !act.newEdges.includes(k)).map(k => <Edge key={k} {...EDGES[k]} />)}
          {act.newEdges.map(k => <Edge key={k} {...EDGES[k]} isNew />)}
          {act.allNodes.filter(k => !act.newNodes.includes(k)).map(k => (
            <NodeCard key={k} {...POS[k]} {...NODES[k]} />
          ))}
          {act.newNodes.map(k => (
            <NodeCard key={k} {...POS[k]} {...NODES[k]} isNew />
          ))}
          {act.entryPoint && (
            <g>
              <rect x="300" y="472" width="360" height="34" rx="6"
                fill={ROOT + '15'} stroke={ROOT + '40'} strokeWidth="1.2" />
              <text x="480" y="494" textAnchor="middle"
                fontFamily="monospace" fontSize="12" fill={ROOT} letterSpacing="0.03em">
                share {act.entryPoint} · resolves full tree
              </text>
            </g>
          )}
        </>
      )}
    </svg>
  )
}

function ProgressDots({ current, total, onChange }: {
  current: number; total: number; onChange: (i: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onChange(i)}
          className={`rounded-full transition-all ${
            i === current ? 'h-2.5 w-8 bg-gold' : 'h-2.5 w-2.5 bg-[#2E4270] hover:bg-muted-slate'
          }`}
          aria-label={`Step ${i + 1}`}
        />
      ))}
    </div>
  )
}

export default function TreePage() {
  const [step, setStep] = useState(0)
  const act     = ACTS[step]
  const isLast  = step === ACTS.length - 1
  const isFirst = step === 0

  return (
    <>
      <Nav />
      <main className="px-8 py-16">
        <div className="mx-auto max-w-[960px]">

          <div className="mb-10">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-slate">
              Provenance Trees
            </p>
            <h1 className="mb-4 text-[44px] font-semibold leading-[1.08] tracking-tight text-off-white">
              One AR-ID resolves{' '}
              <span className="text-gold">everything.</span>
            </h1>
            <p className="max-w-[600px] text-[16px] font-light leading-[1.75] text-muted-slate">
              Your root anchor is yours. Machines can scrape it. Humans can share it.
              Anyone can cite it — like a paper, like a repo, like an X post.
            </p>
            <button
              onClick={() => setStep(ACTS.length - 1)}
              className="mt-4 font-mono text-[11px] text-muted-slate/60 underline underline-offset-4 hover:text-muted-slate transition-colors"
            >
              Skip to full tree →
            </button>
          </div>

          {/* Narrative panel — TOP */}
          <div className="mb-6 rounded-xl border border-[#2E4270] bg-surface p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-slate">
                  Step {act.step} of {ACTS.length}
                </span>
                <ProgressDots current={step} total={ACTS.length} onChange={setStep} />
                <span className="rounded-full border px-3 py-1 font-mono text-[12px] font-medium"
                  style={{
                    color:           act.tierColor,
                    borderColor:     act.tierColor + '50',
                    backgroundColor: act.tierColor + '15',
                  }}>
                  {act.tier} · {act.tierPrice}
                </span>
                <span className="font-mono text-[12px] text-muted-slate">{act.who}</span>
              </div>
              <div className="flex items-center gap-3">
                {!isFirst && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="rounded border border-[#2E4270] px-5 py-2.5 text-[14px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white">
                    ← Back
                  </button>
                )}
                {!isLast ? (
                  <button onClick={() => setStep(s => s + 1)}
                    className="rounded bg-gold px-6 py-2.5 text-[14px] font-semibold text-deep-navy transition-all hover:bg-[#FBBF24] active:scale-[0.98]">
                    Next →
                  </button>
                ) : (
                  <Link href="/register?tier=proof"
                    className="rounded bg-gold px-6 py-2.5 text-[14px] font-semibold text-deep-navy transition-all hover:bg-[#FBBF24] active:scale-[0.98]">
                    Drop your anchor →
                  </Link>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-[26px] font-semibold tracking-tight text-off-white">
                {act.headline}
              </h2>
              <p className="max-w-[640px] text-[15px] leading-[1.7] text-muted-slate">
                {act.body}
              </p>
            </div>

            <div className="flex items-start gap-6">
              {act.newNodes.length > 0 && (
                <div className="rounded-lg border border-electric-blue/20 bg-electric-blue/5 px-5 py-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-electric-blue">
                    Anchored this step
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {act.newNodes.map(k => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="rounded px-2 py-0.5 font-mono text-[10px] font-semibold"
                          style={{
                            color:           TYPE_COLORS[NODES[k].type] ?? '#7B93C4',
                            backgroundColor: (TYPE_COLORS[NODES[k].type] ?? '#7B93C4') + '20',
                          }}>
                          {NODES[k].type}
                        </span>
                        <span className="font-mono text-[12px] text-muted-slate">{NODES[k].arId}</span>
                        <span className="text-[13px] text-off-white">{NODES[k].title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {act.entryPoint && (
                <div className="flex-1 rounded-lg border border-gold/30 bg-gold/10 px-5 py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
                    One link. Everything.
                  </p>
                  <p className="mb-1 font-mono text-[14px] text-gold">{act.entryPoint}</p>
                  <p className="text-[13px] leading-snug text-muted-slate">{act.entryNote}</p>
                </div>
              )}
              <p className="ml-auto self-end font-mono text-[11px] text-muted-slate/50">
                {act.allNodes.length} artifact{act.allNodes.length !== 1 ? 's' : ''} anchored
                {act.allNodes.length > 1 ? ` · ${act.allEdges.length} link${act.allEdges.length !== 1 ? 's' : ''}` : ''}
                {` · ${getNetworkNameClient()}`}
              </p>
            </div>
          </div>

          {/* SVG diagram — BOTTOM */}
          <div className="rounded-xl border border-[#2E4270] bg-[#0d1829] p-8">
            <TreeSVG act={act} />
          </div>

          <div className="mt-8 flex items-center gap-8 border-t border-[#2E4270] pt-8 font-mono text-[12px] text-muted-slate">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 10 10" width="10" height="10"><circle cx="5" cy="5" r="5" fill={ROOT} /></svg>
              root artifact — yours
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 10 10" width="10" height="10"><circle cx="5" cy="5" r="5" fill={CHILD} /></svg>
              child — declared by its author
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 10 10" width="10" height="10"><circle cx="5" cy="5" r="5" fill={PULSE} /></svg>
              new this step
            </span>
            <span className="ml-auto text-muted-slate/40">
              Permissionless in V1 · permissions coming in V2
            </span>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
