'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import { getNetworkNameClient } from '@/lib/network.client'
import Footer from '@/components/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// Tier icon components
// Gold (#F59E0B) = root node  ·  Slate (#4B5E8A) = child node
// ─────────────────────────────────────────────────────────────────────────────

const ROOT  = '#F59E0B'   // gold  — the anchor everything else hangs from
const CHILD = '#4B5E8A'   // slate — descendant nodes
const EDGE  = '#2E4270'   // dark blue — connecting lines

function ProofIcon() {
  return (
    <svg viewBox="0 0 24 12" className="h-4 w-6">
      <circle cx="12" cy="6" r="4" fill={ROOT} />
    </svg>
  )
}

function PairIcon() {
  return (
    <svg viewBox="0 0 60 12" className="h-4 w-14">
      <circle cx="6"  cy="6" r="4" fill={ROOT} />
      <line x1="10" y1="6" x2="46" y2="6" stroke={EDGE} strokeWidth="1.5" />
      <circle cx="50" cy="6" r="4" fill={CHILD} />
    </svg>
  )
}

function TreeIcon() {
  return (
    <svg viewBox="0 0 60 36" className="h-9 w-14">
      <circle cx="30" cy="6"  r="4" fill={ROOT} />
      <line x1="27" y1="9" x2="9"  y2="27" stroke={EDGE} strokeWidth="1.5" />
      <line x1="33" y1="9" x2="51" y2="27" stroke={EDGE} strokeWidth="1.5" />
      <circle cx="6"  cy="30" r="4" fill={CHILD} />
      <circle cx="54" cy="30" r="4" fill={CHILD} />
    </svg>
  )
}

const TIER_ICONS: Record<string, React.ReactNode> = {
  proof: <ProofIcon />,
  pair:  <PairIcon />,
  tree:  <TreeIcon />,
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ARTIFACT_TYPES = [
  { value: 'CODE',      label: 'Code',      desc: 'Repos, packages, scripts'      },
  { value: 'RESEARCH',  label: 'Research',  desc: 'Papers, preprints, theses'     },
  { value: 'DATA',      label: 'Data',      desc: 'Datasets, benchmarks'          },
  { value: 'MODEL',     label: 'Model',     desc: 'AI models, weights'            },
  { value: 'AGENT',     label: 'Agent',     desc: 'AI agents, bots'               },
  { value: 'MEDIA',     label: 'Media',     desc: 'Video, audio, images'          },
  { value: 'TEXT',      label: 'Text',      desc: 'Blogs, books, essays'          },
  { value: 'POST',      label: 'Post',      desc: 'Tweets, social content'        },
  { value: 'ONCHAIN',   label: 'On-Chain',  desc: 'Addresses, NFTs, contracts'    },
  { value: 'REPORT',    label: 'Report',    desc: 'Consulting, compliance, ESG, audits' },
  { value: 'NOTE',      label: 'Note',      desc: 'Memos, meeting notes, correspondence' },
  { value: 'EVENT',     label: 'Event',     desc: 'Human events · machine runs · agent tasks' },
  { value: 'RECEIPT',   label: 'Receipt',   desc: 'Purchase, medical, financial'  },
  { value: 'OTHER',     label: 'Other',     desc: 'Everything else'               },
  // LEGAL (13), ENTITY (14), PROOF (15) — suppressed at launch, no operators added
  // Reintroduced in V2-V4 with dedicated operator gates and verification infrastructure
]

const LICENSES = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BUSL-1.1', 'CC-BY-4.0',
  'CC-BY-SA-4.0', 'CC0-1.0', 'Proprietary', 'Other',
]

// Three tiers — Proof, Pair, Tree.
// Chain (A→B→C) is two Pairs stacked — users build longer chains incrementally.
const TIERS = [
  {
    value:   'proof',
    label:   'Proof',
    price:   '$5',
    anchors: 1,
    desc:    '1 anchor',
    detail:  'Single artifact — paper, model, repo, post, or anything else.',
  },
  {
    value:   'pair',
    label:   'Pair',
    price:   '$9',
    anchors: 2,
    desc:    '2 anchors · chained',
    detail:  'Two artifacts linked as a provenance chain, A→B, where A is the root.',
  },
  {
    value:   'tree',
    label:   'Tree',
    price:   '$12',
    anchors: 3,
    desc:    '3 anchors · branching',
    detail:  'One root artifact A with two children B and C. A→B and A→C.',
  },
]

// Descriptor bar text
const TIER_DESCRIPTION: Record<string, React.ReactNode> = {
  pair: <>Two artifacts linked as a provenance chain, <span className="text-gold">A</span>→B, where <span className="text-gold">A</span> is the root. Share <span className="text-gold">A</span> to resolve the full chain.</>,
  tree: <>One root artifact <span className="text-gold">A</span> with two children B and C. <span className="text-gold">A</span>→B and <span className="text-gold">A</span>→C. Share <span className="text-gold">A</span> to resolve the full tree.</>,
}

const TAB_LABELS: Record<string, string[]> = {
  proof: ['Artifact 1'],
  pair:  ['Artifact 1 · root', 'Artifact 2 · child of 1'],
  tree:  ['Artifact 1 · root', 'Artifact 2 · branch', 'Artifact 3 · branch'],
}

const PARENT_HINT: Record<string, string[]> = {
  proof: [''],
  pair:  ['', 'Auto-set to Artifact 1'],
  tree:  ['', 'Auto-set to Artifact 1', 'Auto-set to Artifact 1'],
}

type TierValue    = 'proof' | 'pair' | 'tree'

interface TreeCredentials {
  parentArId:  string
  anchorKey:   string
  confirmed:   boolean
  confirming:  boolean
  parentTitle: string
  error:       string
}

interface FieldDef {
  key:         string
  label:       string
  placeholder: string
  required?:   boolean
  type?:       'text' | 'select' | 'license'
  options?:    string[]
  mono?:       boolean
  span?:       'full' | 'half'
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT executor config — labels, placeholders, and eventType options by executor
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_BY_EXECUTOR: Record<string, {
  eventTypeOptions:        string[]
  locationLabel:           string
  locationPlaceholder:     string
  orchestratorLabel:       string
  orchestratorPlaceholder: string
  urlLabel:                string
  eventDatePlaceholder:    string
}> = {
  HUMAN: {
    eventTypeOptions:        ['CONFERENCE', 'LAUNCH', 'GOVERNANCE', 'MILESTONE', 'COMPETITION', 'OTHER'],
    locationLabel:           'Location',
    locationPlaceholder:     'e.g. San Francisco, CA or online',
    orchestratorLabel:       'Organizer',
    orchestratorPlaceholder: 'e.g. Ethereum Foundation, Ian Moore',
    urlLabel:                'Event URL',
    eventDatePlaceholder:    'e.g. 2026-03-16',
  },
  MACHINE: {
    eventTypeOptions:        ['TRAIN', 'DEPLOY', 'BUILD', 'TEST', 'EVALUATE', 'PIPELINE', 'INFERENCE', 'OTHER'],
    locationLabel:           'Environment',
    locationPlaceholder:     'e.g. GitHub Actions, Railway, AWS us-east-1',
    orchestratorLabel:       'Orchestrator',
    orchestratorPlaceholder: 'e.g. cron, Airflow, GitHub Actions',
    urlLabel:                'Run Logs / Job URL',
    eventDatePlaceholder:    'e.g. 2026-03-19T14:23:00Z',
  },
  AGENT: {
    eventTypeOptions:        ['TRAIN', 'DEPLOY', 'INFER', 'EVALUATE', 'TASK', 'PIPELINE', 'OTHER'],
    locationLabel:           'Environment',
    locationPlaceholder:     'e.g. Railway prod, AWS us-east-1',
    orchestratorLabel:       'Orchestrator',
    orchestratorPlaceholder: 'e.g. DeFiMind v1.2, LangChain agent',
    urlLabel:                'Run Logs / Job URL',
    eventDatePlaceholder:    'e.g. 2026-03-19T17:00:00Z',
  },
}

const TYPE_FIELDS: Record<string, FieldDef[]> = {
  CODE: [
    { key: 'license',  label: 'License',        placeholder: '', type: 'license' },
    { key: 'url',      label: 'URL',             placeholder: 'https://github.com/...', mono: true },
    { key: 'git_hash', label: 'Git Commit Hash', placeholder: 'e.g. a1b2c3d4e5f6...', mono: true },
    { key: 'language', label: 'Language',        placeholder: 'e.g. Python, TypeScript' },
    { key: 'version',  label: 'Version',         placeholder: 'e.g. v1.0.0' },
  ],
  RESEARCH: [
    { key: 'license',     label: 'License',     placeholder: '', type: 'license' },
    { key: 'url',         label: 'URL',         placeholder: 'https://arxiv.org/...', mono: true },
    { key: 'doi',         label: 'DOI',         placeholder: 'e.g. 10.1234/example', mono: true },
    { key: 'institution', label: 'Institution', placeholder: 'e.g. MIT, Stanford' },
    { key: 'co_authors',  label: 'Co-authors',  placeholder: 'e.g. Jane Smith, John Doe', span: 'full' },
  ],
  DATA: [
    { key: 'license',    label: 'License',    placeholder: '', type: 'license' },
    { key: 'url',        label: 'URL',        placeholder: 'https://...', mono: true },
    { key: 'format',     label: 'Format',     placeholder: 'e.g. CSV, Parquet, JSON' },
    { key: 'row_count',  label: 'Row Count',  placeholder: 'e.g. 1,000,000' },
    { key: 'schema_url', label: 'Schema URL', placeholder: 'https://...', mono: true, span: 'full' },
  ],
  MODEL: [
    { key: 'license',          label: 'License',          placeholder: '', type: 'license' },
    { key: 'url',              label: 'URL',              placeholder: 'https://huggingface.co/...', mono: true },
    { key: 'architecture',     label: 'Architecture',     placeholder: 'e.g. Transformer, CNN' },
    { key: 'parameters',       label: 'Parameters',       placeholder: 'e.g. 7B, 70B' },
    { key: 'training_dataset', label: 'Training Dataset', placeholder: 'e.g. CommonCrawl', span: 'full' },
  ],
  AGENT: [
    { key: 'license',      label: 'License',      placeholder: '', type: 'license' },
    { key: 'url',          label: 'URL',          placeholder: 'https://...', mono: true },
    { key: 'runtime',      label: 'Runtime',      placeholder: 'e.g. Python 3.11, Node 20' },
    { key: 'version',      label: 'Version',      placeholder: 'e.g. v1.0.0' },
    { key: 'capabilities', label: 'Capabilities', placeholder: 'e.g. web search, code execution', span: 'full' },
  ],
  MEDIA: [
    { key: 'license',  label: 'License',     placeholder: '', type: 'license' },
    { key: 'url',      label: 'Media URL',   placeholder: 'https://...', mono: true },
    { key: 'format',   label: 'Format',      placeholder: 'e.g. MP4, PNG, MP3' },
    { key: 'duration', label: 'Duration',    placeholder: 'e.g. 3:45 or 1920x1080' },
    { key: 'isrc',     label: 'ISRC / ISAN', placeholder: 'e.g. USRC17607839', mono: true },
  ],
  TEXT: [
    { key: 'license',   label: 'License',   placeholder: '', type: 'license' },
    { key: 'url',       label: 'URL',       placeholder: 'https://...', mono: true },
    { key: 'isbn',      label: 'ISBN',      placeholder: 'e.g. 978-3-16-148410-0', mono: true },
    { key: 'publisher', label: 'Publisher', placeholder: 'e.g. O\'Reilly Media' },
    { key: 'language',  label: 'Language',  placeholder: 'e.g. English, French' },
  ],
  POST: [
    { key: 'platform',  label: 'Platform',  placeholder: 'e.g. Twitter, LinkedIn, Farcaster' },
    { key: 'post_id',   label: 'Post ID',   placeholder: 'e.g. 1234567890', mono: true },
    { key: 'post_date', label: 'Post Date', placeholder: 'e.g. 2026-03-16' },
    { key: 'post_url',  label: 'Post URL',  placeholder: 'https://x.com/...', mono: true, span: 'full' },
  ],
  ONCHAIN: [
    { key: 'chain',            label: 'Chain',            placeholder: 'e.g. Ethereum, Base, Polygon, Solana' },
    { key: 'onchain_type',     label: 'Type',             placeholder: '', type: 'select',
      options: ['Contract', 'NFT', 'Token', 'Wallet', 'Transaction', 'Other'] },
    { key: 'contract_address', label: 'Contract Address', placeholder: '0x...', mono: true, span: 'full' },
    { key: 'tx_hash',          label: 'Transaction Hash', placeholder: '0x...', mono: true, span: 'full' },
    { key: 'token_id',         label: 'Token ID',         placeholder: 'e.g. 1234 (for NFTs)', mono: true },
    { key: 'block_number',     label: 'Block Number',     placeholder: 'e.g. 22041887', mono: true },
  ],
  // EVENT: keys listed here for buildPayload — rendered via custom executor-aware UI
  EVENT: [
    { key: 'executor',     label: 'Executor',     placeholder: '' },  // handled by executor toggle
    { key: 'event_type',   label: 'Event Type',   placeholder: '', type: 'select', options: [] },
    { key: 'event_date',   label: 'Event Date',   placeholder: '', mono: true },
    { key: 'location',     label: 'Location',     placeholder: '' },
    { key: 'orchestrator', label: 'Orchestrator', placeholder: '' },
    { key: 'url',          label: 'URL',          placeholder: '', mono: true, span: 'full' },
  ],
  RECEIPT: [
    { key: 'receipt_type', label: 'Receipt Type', placeholder: '', type: 'select',
      options: ['PURCHASE', 'MEDICAL', 'FINANCIAL', 'GOVERNMENT', 'EVENT', 'SERVICE'] },
    { key: 'merchant',    label: 'Merchant',    placeholder: 'e.g. Wayfair, Apple, Shopify' },
    { key: 'amount',      label: 'Amount',      placeholder: 'e.g. 1299.99', mono: true },
    { key: 'currency',    label: 'Currency',    placeholder: 'e.g. USD, CAD, EUR', mono: true },
    { key: 'order_id',    label: 'Order ID',    placeholder: 'e.g. ORD-2026-XK9M', mono: true },
    { key: 'platform',    label: 'Platform',    placeholder: 'e.g. shopify, stripe, square', mono: true },
    { key: 'receipt_url', label: 'Receipt URL', placeholder: 'https://...', mono: true, span: 'full' },
  ],
  LEGAL: [
    { key: 'document_type',  label: 'Document Type', placeholder: 'e.g. NDA, Patent, Contract' },
    { key: 'jurisdiction',   label: 'Jurisdiction',  placeholder: 'e.g. Delaware, UK, Canada' },
    { key: 'effective_date', label: 'Effective Date', placeholder: 'e.g. 2026-03-16' },
    { key: 'parties',        label: 'Parties',        placeholder: 'e.g. Acme Corp, Ian Moore', span: 'full' },
  ],
  ENTITY: [
    { key: 'entity_type',  label: 'Entity Type',         placeholder: 'e.g. Person, Company, DAO' },
    { key: 'jurisdiction', label: 'Jurisdiction',        placeholder: 'e.g. Delaware, Canada' },
    { key: 'reg_number',   label: 'Registration Number', placeholder: 'e.g. 12345678', mono: true },
  ],
  PROOF: [
    { key: 'proof_type',   label: 'Proof Type',          placeholder: '', type: 'select',
      options: ['Zero Knowledge', 'Formal Verification', 'Security Audit', 'Mathematical', 'Other'] },
    { key: 'proof_system', label: 'Proof System / Tool',
      placeholder: 'e.g. Groth16, PLONK, STARKs, Coq, Lean4, Isabelle, Halo2' },
    { key: 'circuit_id',   label: 'Circuit ID',          placeholder: 'e.g. circuit-v1-sha256', mono: true },
    { key: 'vkey_hash',    label: 'Verification Key Hash', placeholder: '0x...', mono: true },
    { key: 'audit_firm',   label: 'Audit Firm',          placeholder: 'e.g. Trail of Bits, OpenZeppelin' },
    { key: 'audit_scope',  label: 'Audit Scope',         placeholder: 'e.g. Contracts v1.0–v1.3', span: 'full' },
    { key: 'verifier_url', label: 'Verifier URL',        placeholder: 'https://...', mono: true, span: 'full' },
    { key: 'report_url',   label: 'Report / Paper URL',  placeholder: 'https://...', mono: true, span: 'full' },
  ],
  REPORT: [
    { key: 'report_type',  label: 'Report Type', placeholder: '', type: 'select',
      options: ['CONSULTING', 'FINANCIAL', 'COMPLIANCE', 'ESG', 'TECHNICAL', 'AUDIT', 'OTHER'] },
    { key: 'institution',  label: 'Institution',  placeholder: 'e.g. Hive Advisory Inc.' },
    { key: 'engagement',   label: 'Engagement',   placeholder: 'e.g. Q1-2026-ESG', mono: true },
    { key: 'version',      label: 'Version',      placeholder: 'e.g. v1.0, draft, final' },
    { key: 'authors',      label: 'Authors',      placeholder: 'e.g. Stefan P., Ian Moore', span: 'full' },
    { key: 'url',          label: 'URL',          placeholder: 'https://...', mono: true, span: 'full' },
  ],
  NOTE: [
    { key: 'note_type',    label: 'Note Type', placeholder: '', type: 'select',
      options: ['MEMO', 'MEETING', 'CORRESPONDENCE', 'OBSERVATION', 'FIELD', 'OTHER'] },
    { key: 'date',         label: 'Date',         placeholder: 'e.g. 2026-03-20', mono: true },
    { key: 'participants', label: 'Participants',  placeholder: 'e.g. Stefan P., Ian Moore', span: 'full' },
    { key: 'url',          label: 'URL',          placeholder: 'https://...', mono: true, span: 'full' },
  ],
  OTHER: [],
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  artifactType: string
  title:        string
  author:       string
  descriptor:   string
  parentHash:   string
  [key: string]: string
}

interface ManifestState {
  form:         FormState
  registeredAt: string  // ISO 8601 timestamp — Supabase record only, not part of hash
  tokenId:      string  // generated UUID — user's ownership credential, baked into manifestHash
  hash:         string
  notes:        string
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function sha256String(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str)
  const h   = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('')
}


// Canonical string — sha256(artifactType|title|author|descriptor|...typeFields|tokenId)
// tokenId is a UUID generated client-side at form init.
// Binding tokenId to manifest fields means the same token on two different artifacts
// produces two different hashes — the token is cryptographically bound to this artifact.
function buildCanonical(form: FormState, seed: string): string {
  return [
    form.artifactType,
    form.title,
    form.author,
    form.descriptor,
    ...(TYPE_FIELDS[form.artifactType] ?? []).map(f => form[f.key] ?? ''),
    seed,
  ].join('|')
}

function emptyForm(artifactType = 'CODE'): FormState {
  return { artifactType, title: '', author: '', descriptor: '', parentHash: '' }
}

function emptyManifest(artifactType = 'CODE'): ManifestState {
  return {
    form:         emptyForm(artifactType),
    registeredAt: new Date().toISOString(),
    tokenId:      '',  // populated client-side via useEffect — avoids SSR/client hydration mismatch
    hash:         '',
    notes:        '',
  }
}

function tierAnchorCount(tier: TierValue): number {
  return { proof: 1, pair: 2, tree: 3 }[tier]
}

// ─────────────────────────────────────────────────────────────────────────────
// ManifestForm
// ─────────────────────────────────────────────────────────────────────────────

interface ManifestFormProps {
  state:            ManifestState
  onChange:         (next: ManifestState) => void
  parentHint:       string
  isAutoParent:     boolean
  anchorKeyEmail?:  string
  onEmailChange?:   (email: string) => void
  tree?:            TreeCredentials
  onTree?:          (t: TreeCredentials) => void
  onConfirmTree?:   () => void
  custodyConfirmed?: boolean
  onCustodyChange?:  (v: boolean) => void
  keySent?:          boolean
  onKeySent?:        (v: boolean) => void
  onNewKey?:         () => void
}

function ManifestForm({ state, onChange, parentHint, isAutoParent, anchorKeyEmail, onEmailChange, tree, onTree, onConfirmTree, custodyConfirmed, onCustodyChange, keySent, onKeySent, onNewKey }: ManifestFormProps) {
  const { form, tokenId, hash, notes } = state

  const [extendOpen, setExtendOpen] = useState(false)

  const patch     = (p: Partial<ManifestState>) => onChange({ ...state, ...p })
  const patchForm = (p: Partial<FormState>)     => patch({ form: { ...form, ...(p as FormState) } })

  const handleTypeChange = (type: string) => {
    const oldFields = TYPE_FIELDS[form.artifactType] ?? []
    const newForm   = { ...form, artifactType: type }
    oldFields.forEach(f => { delete (newForm as Record<string, string>)[f.key] })
    if (type === 'EVENT') (newForm as Record<string, string>).executor = 'HUMAN'
    patch({ form: newForm as FormState })
  }

  const setField = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      patchForm({ [key]: e.target.value })

  // Recompute hash whenever form fields or tokenId change
  const tokenCanonical = useMemo(() => buildCanonical(form, tokenId), [form, tokenId])

  useEffect(() => {
    if (!tokenId) return
    if (!form.title) { if (hash) patch({ hash: '' }); return }
    sha256String(tokenCanonical).then(h => {
      if (hash !== h) onChange({ ...state, hash: h })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenCanonical])

  const selectedType = ARTIFACT_TYPES.find(t => t.value === form.artifactType)
  const typeFields   = TYPE_FIELDS[form.artifactType] ?? []

  const cls     = 'w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue'
  const clsMono = 'w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 font-mono text-[13px] text-off-white placeholder-muted-slate/30 outline-none transition-colors focus:border-electric-blue'
  const clsLbl  = 'mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate'

  return (
    <div className="space-y-8">

      {/* 01 — Artifact type */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-gold">01</span>
          <span className="text-[14px] font-medium text-off-white">Artifact type</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ARTIFACT_TYPES.map(t => (
            <button key={t.value} onClick={() => handleTypeChange(t.value)}
              className={`rounded border px-3 py-2.5 text-left transition-all ${
                form.artifactType === t.value
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-[#2E4270] text-muted-slate hover:border-muted-slate hover:text-off-white'
              }`}>
              <div className="text-[13px] font-medium">{t.label}</div>
              <div className="text-[11px] opacity-70">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 02 — Manifest */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-gold">02</span>
          <span className="text-[14px] font-medium text-off-white">
            Fill the manifest
            <span className="ml-2 font-mono text-[10px] text-muted-slate normal-case tracking-normal">
              — {selectedType?.label}
            </span>
          </span>
        </div>
        <div className="mb-4 flex items-start gap-2.5 rounded border border-[#2E4270] bg-[#152038] px-3 py-2.5">
          <span className="mt-0.5 text-[13px]">🔓</span>
          <p className="font-mono text-[11px] leading-relaxed text-muted-slate">
            All manifest fields are <span className="text-off-white">permanently public</span> on the blockchain. Do not enter private or sensitive information.
          </p>
        </div>

        {/* Extend tree — only shown on root tab when tree props provided */}
        {onTree && (
          <div className="mb-4">
            <button
              onClick={() => {
                if (tree?.confirmed) {
                  onTree?.({ parentArId: '', anchorKey: '', confirmed: false, confirming: false, parentTitle: '', error: '' })
                } else {
                  setExtendOpen(v => !v)
                }
              }}
              className="flex items-center gap-2 font-mono text-[11px] text-muted-slate/60 transition-colors hover:text-muted-slate"
            >
              <span>{tree?.confirmed || extendOpen ? '▾' : '▸'}</span>
              {tree?.confirmed
                ? <span>Extending <span className="text-off-white">{tree.parentArId}</span> · <span className="text-gold">✓ Ownership confirmed</span></span>
                : <span className="text-off-white">Extending an existing tree? Enter parent AR-ID + anchor key</span>}
            </button>

            {extendOpen && !tree?.confirmed && (
              <div className="mt-3 rounded-lg border border-[#2E4270] bg-[#0C2340] p-4">
                <p className="mb-3 font-mono text-[11px] text-muted-slate">
                  Prove you own the parent. Your anchor key never leaves your browser.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">Parent AR-ID</label>
                    <input type="text" placeholder="AR-2026-K7X9M2P"
                      value={tree?.parentArId ?? ''}
                      onChange={e => onTree?.({ ...tree!, parentArId: e.target.value, error: '' })}
                      className="w-full rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[13px] text-off-white placeholder-muted-slate/30 outline-none transition-colors focus:border-electric-blue" />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">Anchor Key</label>
                    <input type="text" placeholder="550e8400-e29b-41d4-…"
                      value={tree?.anchorKey ?? ''}
                      onChange={e => onTree?.({ ...tree!, anchorKey: e.target.value, error: '' })}
                      className="w-full rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[13px] text-off-white placeholder-muted-slate/30 outline-none transition-colors focus:border-electric-blue" />
                  </div>
                </div>
                {tree?.error && (
                  <div className="mt-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-400">
                    {tree.error}
                  </div>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={onConfirmTree}
                    disabled={!tree?.parentArId?.trim() || !tree?.anchorKey?.trim() || tree?.confirming}
                    className={`rounded px-4 py-2 font-mono text-[12px] font-medium transition-all ${
                      tree?.parentArId?.trim() && tree?.anchorKey?.trim() && !tree?.confirming
                        ? 'bg-electric-blue text-off-white hover:bg-blue-600'
                        : 'cursor-not-allowed bg-electric-blue/30 text-off-white/50'
                    }`}
                  >
                    {tree?.confirming ? 'Verifying…' : 'Confirm ownership →'}
                  </button>
                </div>
              </div>
            )}

            {tree?.confirmed && (
              <div className="mt-2 flex items-center justify-between rounded border border-gold/20 bg-gold/5 px-3 py-2">
                <div className="font-mono text-[11px] text-muted-slate">
                  Parent: <span className="text-off-white">{tree.parentArId}</span>
                  <span className="ml-2 text-muted-slate/50">· {tree.parentTitle}</span>
                </div>
                <button
                  onClick={() => onTree?.({ parentArId: '', anchorKey: '', confirmed: false, confirming: false, parentTitle: '', error: '' })}
                  className="font-mono text-[10px] text-muted-slate/50 transition-colors hover:text-muted-slate"
                >Change</button>
              </div>
            )}
          </div>
        )}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={clsLbl}>Title <span className="text-gold">*</span></label>
              <input type="text" placeholder="e.g. UniswapPy v1.0"
                value={form.title} onChange={setField('title')} className={cls} />
            </div>
            <div>
              <label className={clsLbl}>Author <span className="text-muted-slate/50">(optional)</span></label>
              <input type="text" placeholder="e.g. Ian Moore or anonymous"
                value={form.author} onChange={setField('author')} className={cls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={clsLbl}>Descriptor <span className="text-muted-slate/50">(optional)</span></label>
              <input type="text" placeholder="e.g. ICMOORE-2026-UNISWAPPY"
                value={form.descriptor} onChange={setField('descriptor')} className={cls} />
            </div>
            <div>
              <label className={clsLbl}>
                Parent AR-ID
                {isAutoParent
                  ? <span className="ml-1 font-mono text-[10px] normal-case tracking-normal text-gold/70"> — {parentHint}</span>
                  : <span className="text-muted-slate/50"> (optional)</span>}
              </label>
              <input type="text"
                placeholder={isAutoParent ? parentHint : 'AR-2026-K7X9M2P'}
                value={tree?.confirmed ? tree.parentArId : form.parentHash}
                onChange={setField('parentHash')}
                readOnly={isAutoParent || tree?.confirmed}
                className={`${clsMono} ${isAutoParent || tree?.confirmed ? 'opacity-40 cursor-not-allowed' : ''}`} />
            </div>
          </div>

          {typeFields.length > 0 && (
            <div className="border-t border-[#2E4270] pt-3">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
                {selectedType?.label} fields
              </p>

              {/* ONCHAIN info banner */}
              {form.artifactType === 'ONCHAIN' && (
                <div className="mb-3 flex items-start gap-2 rounded border border-[#2E4270] bg-[#152038] px-3 py-2">
                  <span className="mt-0.5 font-mono text-[11px] text-muted-slate">ℹ</span>
                  <p className="font-mono text-[11px] text-muted-slate">
                    Provide a <span className="text-off-white">contract address</span> or a <span className="text-off-white">transaction hash</span> — or both.
                  </p>
                </div>
              )}

              {/* EVENT executor toggle */}
              {form.artifactType === 'EVENT' && (() => {
                const exec    = (form.executor || 'HUMAN') as 'HUMAN' | 'MACHINE' | 'AGENT'
                const execCfg = EVENT_BY_EXECUTOR[exec]
                const EXECUTORS: { value: string; label: string; hint: string }[] = [
                  { value: 'HUMAN',   label: 'Human',   hint: 'Conference, launch, governance vote, milestone' },
                  { value: 'MACHINE', label: 'Machine', hint: 'Training run, deployment, pipeline, build' },
                  { value: 'AGENT',   label: 'Agent',   hint: 'Agent-driven task, inference, evaluation' },
                ]
                return (
                  <div className="mb-4">
                    <label className={clsLbl}>Executor</label>
                    <div className="mb-1.5 flex gap-1 rounded-lg border border-[#2E4270] bg-[#152038] p-1">
                      {EXECUTORS.map(e => (
                        <button key={e.value}
                          onClick={() => patchForm({ executor: e.value, event_type: '' })}
                          className={`flex-1 rounded py-1.5 text-[12px] font-medium transition-all ${
                            exec === e.value
                              ? 'bg-surface text-off-white'
                              : 'text-muted-slate hover:text-off-white'
                          }`}>
                          {e.label}
                        </button>
                      ))}
                    </div>
                    <p className="font-mono text-[10px] text-muted-slate/60">
                      {EXECUTORS.find(e => e.value === exec)?.hint}
                    </p>

                    {/* EVENT fields — executor-aware */}
                    <div className="mt-3 grid grid-cols-2 gap-3">

                      {/* Event Type */}
                      <div>
                        <label className={clsLbl}>Event Type <span className="text-muted-slate/50">(optional)</span></label>
                        <select value={form.event_type ?? ''}
                          onChange={setField('event_type')} className={cls}>
                          <option value="">Select type…</option>
                          {execCfg.eventTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>

                      {/* Event Date */}
                      <div>
                        <label className={clsLbl}>Event Date <span className="text-muted-slate/50">(optional)</span></label>
                        <input type="text" placeholder={execCfg.eventDatePlaceholder}
                          value={form.event_date ?? ''} onChange={setField('event_date')}
                          className={clsMono} />
                      </div>

                      {/* Location / Environment */}
                      <div>
                        <label className={clsLbl}>{execCfg.locationLabel} <span className="text-muted-slate/50">(optional)</span></label>
                        <input type="text" placeholder={execCfg.locationPlaceholder}
                          value={form.location ?? ''} onChange={setField('location')}
                          className={cls} />
                      </div>

                      {/* Organizer / Orchestrator */}
                      <div>
                        <label className={clsLbl}>{execCfg.orchestratorLabel} <span className="text-muted-slate/50">(optional)</span></label>
                        <input type="text" placeholder={execCfg.orchestratorPlaceholder}
                          value={form.orchestrator ?? ''} onChange={setField('orchestrator')}
                          className={cls} />
                      </div>

                      {/* URL */}
                      <div className="col-span-2">
                        <label className={clsLbl}>{execCfg.urlLabel} <span className="text-muted-slate/50">(optional)</span></label>
                        <input type="text" placeholder="https://..."
                          value={form.url ?? ''} onChange={setField('url')}
                          className={clsMono} />
                      </div>

                    </div>
                  </div>
                )
              })()}

              {/* Generic fields — all types except EVENT (handled above) */}
              {form.artifactType !== 'EVENT' && (
                <div className="grid grid-cols-2 gap-3">
                  {typeFields.map(f => (
                    <div key={f.key} className={f.span === 'full' ? 'col-span-2' : ''}>
                      <label className={clsLbl}>
                        {f.label}
                        {f.required ? <span className="text-gold"> *</span> : <span className="text-muted-slate/50"> (optional)</span>}
                      </label>
                      {f.type === 'license' ? (
                        <select value={form[f.key] ?? 'MIT'} onChange={setField(f.key)} className={cls}>
                          {LICENSES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      ) : f.type === 'select' ? (
                        <select value={form[f.key] ?? ''} onChange={setField(f.key)} className={cls}>
                          <option value="">Select type…</option>
                          {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type="text" placeholder={f.placeholder}
                          value={form[f.key] ?? ''} onChange={setField(f.key)}
                          className={f.mono ? clsMono : cls} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 03 — Anchor Key */}
      <div className={tree?.confirmed ? 'opacity-40 pointer-events-none select-none' : ''}>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-gold">03</span>
          <span className="text-[14px] font-medium text-off-white">Anchor Key</span>
          {tree?.confirmed && (
            <span className="rounded-full border border-[#2E4270] px-2.5 py-0.5 font-mono text-[10px] text-muted-slate">
              root key · use to extend further
            </span>
          )}
        </div>
        <div className="rounded-lg border border-gold/30 bg-gold/5 p-5">
          <p className="mb-3 font-mono text-[11px] text-muted-slate">
            Your anchor key is your private key. Save it — it cannot be recovered if lost.
          </p>
          <div className="flex items-center gap-2 rounded border border-[#2E4270] bg-bg px-3 py-2.5">
            <span className="flex-1 break-all font-mono text-[12px] text-gold">
              {tokenId || <span className="text-muted-slate/30">Generating…</span>}
            </span>
            {tokenId && (
              <>
                <button
                  onClick={() => navigator.clipboard.writeText(tokenId)}
                  className="shrink-0 rounded border border-[#2E4270] px-2 py-1 font-mono text-[10px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
                >Copy</button>
                <button
                  onClick={() => onNewKey?.()}
                  className={`shrink-0 rounded border px-2 py-1 font-mono text-[10px] transition-all ${
                    keySent
                      ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                      : 'border-[#2E4270] text-muted-slate hover:border-muted-slate hover:text-off-white'
                  }`}
                >{keySent ? 'New ⚠' : 'New'}</button>
              </>
            )}
          </div>
          <div className="mt-3 break-all rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[11px] leading-relaxed text-muted-slate">
            {hash
              ? <><span className="text-muted-slate/50">sha256:</span>{hash}</>
              : <span className="text-muted-slate/30">Fill in a title in step 02 to generate hash…</span>}
          </div>
          {onEmailChange && (
            <div className="mt-4">
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                Email to yourself <span className="text-muted-slate/50 normal-case tracking-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={anchorKeyEmail ?? ''}
                  onChange={e => onEmailChange(e.target.value)}
                  className="min-w-0 flex-1 rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue"
                />
                <a
                  href={anchorKeyEmail?.trim() && tokenId
                    ? `mailto:${encodeURIComponent(anchorKeyEmail.trim())}?subject=${encodeURIComponent('AnchorRegistry — Anchor Key Backup')}&body=${encodeURIComponent(
                        'Save this before you pay.\n\nAnchor Key:\n' + tokenId + '\n\nThis key proves ownership of your anchor tree. Save it somewhere safe — AnchorRegistry cannot recover it.\n\nNot your keys, not your trees.\n\n—\nAnchorRegistry™\nanchorregistry.com'
                      )}`
                    : undefined}
                  onClick={e => {
                    if (!anchorKeyEmail?.trim() || !tokenId) { e.preventDefault(); return }
                    onKeySent?.(true)
                  }}
                  className={`shrink-0 rounded border px-3 py-2.5 font-mono text-[12px] font-medium transition-all ${
                    keySent
                      ? 'border-green-500/40 bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20'
                      : anchorKeyEmail?.trim() && tokenId
                        ? 'border-electric-blue/40 bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20 cursor-pointer'
                        : 'border-[#2E4270] text-muted-slate/30 cursor-not-allowed'
                  }`}
                >
                  {keySent ? '✓ Sent' : 'Send →'}
                </a>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-muted-slate/50">
                Opens your email client with the key pre-filled. Confirm receipt before paying.
              </p>
            </div>
          )}

          {/* Custody confirmation — only shown on root tab */}
          {onCustodyChange && (
            <label className={`mt-5 flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 transition-all ${
              custodyConfirmed
                ? 'border-gold/40 bg-gold/5'
                : 'border-[#2E4270] hover:border-muted-slate/50'
            }`}>
              <input
                type="checkbox"
                checked={custodyConfirmed ?? false}
                onChange={e => onCustodyChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#F59E0B]"
              />
              <span className="font-mono text-[11px] leading-relaxed text-muted-slate">
                I have saved my anchor key and understand it{' '}
                <span className="text-off-white">cannot be recovered</span>{' '}
                if lost. Not your key, not your tree.
              </span>
            </label>
          )}
        </div>
      </div>

      {/* 04 — Author notes */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-gold">04</span>
          <span className="text-[14px] font-medium text-off-white">Author notes</span>
          <span className="rounded-full border border-electric-blue/30 bg-electric-blue/10 px-2 py-0.5 font-mono text-[10px] text-electric-blue">off-chain</span>
        </div>
        <div className="mb-3 flex items-start gap-2.5 rounded border border-electric-blue/20 bg-electric-blue/5 px-3 py-2.5">
          <span className="mt-0.5 text-[13px]">✏️</span>
          <p className="font-mono text-[11px] leading-relaxed text-muted-slate">
            Stored <span className="text-off-white">off-chain</span>, rendered on your verify card.{' '}
            <span className="text-off-white">Public and editable</span> after anchoring.
          </p>
        </div>
        <textarea rows={5} value={notes} onChange={e => patch({ notes: e.target.value })}
          placeholder={`Describe this artifact in your own words. What does it do? Why does it matter?\n\nThis is your opportunity to speak directly to anyone who verifies this anchor.`}
          className="w-full resize-none rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] leading-relaxed text-off-white placeholder-muted-slate/40 outline-none transition-colors focus:border-electric-blue" />
        <div className="mt-1.5 flex justify-between">
          <p className="font-mono text-[10px] text-muted-slate/60">Visible on verify card · Editable after anchoring · Not hashed</p>
          <p className={`font-mono text-[10px] ${notes.length > 1800 ? 'text-gold' : 'text-muted-slate/60'}`}>
            {notes.length} / 2000
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PreviewCard
// ─────────────────────────────────────────────────────────────────────────────

function PreviewCard({ state, label, active, onClick }: {
  state:    ManifestState
  label:    string
  active?:  boolean
  onClick?: () => void
}) {
  const { form, hash } = state
  const selectedType = ARTIFACT_TYPES.find(t => t.value === form.artifactType)
  const done = !!(hash && form.title)
  return (
    <button onClick={onClick} className={`w-full rounded-lg border p-4 text-left transition-all ${
      active  ? 'border-gold/40 bg-gold/5'
      : done  ? 'border-[#2E4270] bg-surface hover:border-muted-slate'
      :         'border-[#2E4270] bg-surface opacity-50 hover:opacity-70'
    }`}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">{label}</span>
        {done && <span className="font-mono text-[10px] text-gold">✓ ready</span>}
      </div>
      <div className="mb-1 text-[14px] font-semibold text-off-white">
        {form.title || <span className="text-muted-slate/40">Untitled</span>}
      </div>
      <div className="mb-2">
        <span className="rounded-full border border-[#2E4270] px-2 py-0.5 font-mono text-[10px] text-muted-slate">
          {selectedType?.label ?? 'CODE'}
        </span>
      </div>
      {hash
        ? <div className="font-mono text-[10px] text-muted-slate/60">{hash.slice(0, 20)}…</div>
        : <div className="font-mono text-[10px] text-muted-slate/30">No hash yet</div>}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// StructureDiagram — descriptor bar SVG, same colors as tier icons
// ─────────────────────────────────────────────────────────────────────────────

function StructureDiagram({ tier }: { tier: TierValue }) {
  if (tier === 'proof') return null

  if (tier === 'pair') return (
    <svg viewBox="0 0 60 12" className="h-4 w-14 shrink-0">
      <circle cx="6"  cy="6" r="4" fill={ROOT} />
      <line x1="10" y1="6" x2="46" y2="6" stroke={EDGE} strokeWidth="1.5" />
      <circle cx="50" cy="6" r="4" fill={CHILD} />
    </svg>
  )

  return (
    <svg viewBox="0 0 60 36" className="h-9 w-14 shrink-0">
      <circle cx="30" cy="6"  r="4" fill={ROOT} />
      <line x1="27" y1="9" x2="9"  y2="27" stroke={EDGE} strokeWidth="1.5" />
      <line x1="33" y1="9" x2="51" y2="27" stroke={EDGE} strokeWidth="1.5" />
      <circle cx="6"  cy="30" r="4" fill={CHILD} />
      <circle cx="54" cy="30" r="4" fill={CHILD} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

function RegisterPageInner() {
  const searchParams = useSearchParams()
  const [tier, setTier]             = useState<TierValue>('proof')
  const [activeTab, setActiveTab]   = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [anchorKeyEmail, setAnchorKeyEmail]       = useState('')
  const [custodyConfirmed, setCustodyConfirmed] = useState(false)
  const [keySent, setKeySent]                   = useState(false)
  const [tree, setTree]             = useState<TreeCredentials>({
    parentArId: '', anchorKey: '', confirmed: false,
    confirming: false, parentTitle: '', error: '',
  })

  const confirmTree = async () => {
    if (!tree.parentArId.trim() || !tree.anchorKey.trim()) return
    setTree(t => ({ ...t, confirming: true, error: '' }))
    try {
      // Fetch parent manifest fresh from DB (bypass Redis) — must reflect
      // latest stored type_fields for correct hash reconstruction.
      const res  = await fetch(`/api/verify/${tree.parentArId.trim()}?fresh=1`)
      if (!res.ok) throw new Error('AR-ID not found')
      const resp = await res.json()
      const data = resp.anchor ?? resp

      // Reconstruct canonical string from parent fields and provided anchor key
      const fields = [
        data.artifact_type, data.title ?? '', data.author ?? '',
        data.descriptor ?? '',
        ...(data.type_fields ?? []).map((v: string) => v ?? ''),
        tree.anchorKey.trim(),
      ].join('|')

      const buf  = new TextEncoder().encode(fields)
      const h    = await crypto.subtle.digest('SHA-256', buf)
      const hash = Array.from(new Uint8Array(h))
        .map(b => b.toString(16).padStart(2, '0')).join('')

      if (hash !== data.manifest_hash) {
        setTree(t => ({ ...t, confirming: false, error: 'Anchor key does not match this AR-ID. Check both and try again.' }))
        return
      }

      setTree(t => ({ ...t, confirming: false, confirmed: true, parentTitle: data.title ?? '' }))
      // Wire parent into root manifest and propagate anchor key as tokenId —
      // one key unlocks extension privileges anywhere downstream of the root
      setManifests(prev => prev.map((m, i) =>
        i === 0 ? { ...m, tokenId: tree.anchorKey.trim(), form: { ...m.form, parentHash: tree.parentArId.trim() } } : m
      ))
      // Ownership proof already demonstrated — auto-confirm custody
      setCustodyConfirmed(true)
    } catch (e: unknown) {
      setTree(t => ({ ...t, confirming: false, error: e instanceof Error ? e.message : 'Verification failed' }))
    }
  }

  const [manifests, setManifests] = useState<ManifestState[]>([
    emptyManifest('CODE'),
    emptyManifest('CODE'),
    emptyManifest('CODE'),
  ])

  useEffect(() => {
    const t = searchParams.get('tier') as TierValue | null
    if (t && TIERS.find(x => x.value === t)) setTier(t)
  }, [searchParams])

  // Generate a single shared token for all manifests — one anchor key per registration session
  // All artifacts in a Pair/Tree share the same key so the user only needs to save one
  useEffect(() => {
    const sharedToken = crypto.randomUUID()
    setManifests(prev => prev.map(m =>
      m.tokenId ? m : { ...m, tokenId: sharedToken }
    ))
  }, [])

  const selectedTierDef = TIERS.find(t => t.value === tier) ?? TIERS[0]
  const activeCount     = tierAnchorCount(tier)
  const tabLabels       = TAB_LABELS[tier] ?? ['Artifact 1']
  const parentHints     = PARENT_HINT[tier] ?? ['']
  const activeManifests = manifests.slice(0, activeCount)
  // tree.parentArId being set means user opened the extend-tree panel
  // tree.confirmed means they verified ownership — required before paying in child mode
  const isChildMode = !!tree.parentArId
  const isReady    = activeManifests.every(m => m.hash && m.form.title) &&
                     (!isChildMode || tree.confirmed) &&
                     custodyConfirmed
  const readyCount = activeManifests.filter(m => m.hash && m.form.title).length

  const updateManifest = (i: number) => (next: ManifestState) =>
    setManifests(prev => prev.map((m, j) => j === i ? next : m))

  const changeTier = (t: TierValue) => { setTier(t); setActiveTab(0); setCustodyConfirmed(false); setKeySent(false) }

  const handleNewKey = () => {
    const newToken = crypto.randomUUID()
    setManifests(prev => prev.map(m => ({ ...m, tokenId: newToken, hash: '' })))
    setKeySent(false)
    setCustodyConfirmed(false)
  }

  const buildPayload = (m: ManifestState) => ({
    manifestHash:      m.hash,
    registered_at:     m.registeredAt,
    anchor_key_email:  anchorKeyEmail || undefined,  // sent once, never stored
    artifactType:      m.form.artifactType,
    title:         m.form.title,
    author:        m.form.author,
    descriptor:    m.form.descriptor,
    parentHash:    m.form.parentHash,
    notes:         m.notes,
    tier,
    ...Object.fromEntries(
      (TYPE_FIELDS[m.form.artifactType] ?? []).map(f => [f.key, m.form[f.key] ?? ''])
    ),
  })

  const handleSubmit = async () => {
    if (!isReady) return
    setSubmitting(true); setError('')
    try {
      const isMulti = tier !== 'proof'
      const body = isMulti
        ? { manifests: activeManifests.map(buildPayload), tier }
        : { ...buildPayload(manifests[0]), tier }

      const res  = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Checkout failed')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const isMulti = tier !== 'proof'

  return (
    <>
      <Nav />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[960px]">

          <div className="mb-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">Register an artifact</p>
            <h1 className="text-[28px] font-semibold tracking-tight text-off-white">Register your anchor</h1>
          </div>

          {/* ── Tier selector — 3 cols ──────────────────────────────────────── */}
          <div className="mb-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Select a tier</p>
            <div className="grid grid-cols-3 gap-3">
              {TIERS.map(t => (
                <button key={t.value} onClick={() => changeTier(t.value as TierValue)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    tier === t.value ? 'border-gold bg-gold/10' : 'border-[#2E4270] hover:border-muted-slate'
                  }`}>
                  <div className="mb-3 flex items-start">
                    {TIER_ICONS[t.value]}
                  </div>
                  <div className={`mb-0.5 text-[15px] font-semibold ${tier === t.value ? 'text-gold' : 'text-off-white'}`}>
                    {t.label}
                  </div>
                  <div className="mb-2 text-[20px] font-bold text-off-white">{t.price}</div>
                  <div className="font-mono text-[10px] text-muted-slate">{t.desc}</div>
                  <div className="mt-2 text-[11px] leading-snug text-muted-slate/70">{t.detail}</div>
                </button>
              ))}
            </div>

            {/* Descriptor bar */}
            {isMulti && (
              <div className="mt-4 flex items-center gap-4 rounded border border-[#2E4270] bg-[#152038] px-4 py-3">
                <StructureDiagram tier={tier} />
                <div className="flex-1">
                  <p className="font-mono text-[11px] text-off-white">
                    {TIER_DESCRIPTION[tier]}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-muted-slate">
                    <span style={{ color: ROOT }}>●</span>
                    <span className="ml-1.5">root — share this AR-ID to resolve the full tree</span>
                    <span className="mx-3 opacity-30">·</span>
                    <span style={{ color: CHILD }}>●</span>
                    <span className="ml-1.5">child artifact</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-slate/60">
                    Parent links are wired automatically after payment. Fill all manifests upfront, then pay once.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Tab bar ───────────────────────────────────────────────────── */}
          {isMulti && (
            <div className="mb-6 flex gap-1 rounded-lg border border-[#2E4270] bg-[#152038] p-1">
              {tabLabels.map((label, i) => {
                const done = !!(manifests[i].hash && manifests[i].form.title)
                return (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded py-2 text-[13px] font-medium transition-all ${
                      activeTab === i ? 'bg-surface text-off-white' : 'text-muted-slate hover:text-off-white'
                    }`}>
                    {done && <span className="text-[11px] text-gold">✓</span>}
                    {i === 0 && <span style={{ color: ROOT }} className="text-[8px]">●</span>}
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Main layout ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-[1fr_280px] items-start gap-10">

            <div>
              <ManifestForm
                key={`${tier}-${activeTab}`}
                state={manifests[activeTab]}
                onChange={updateManifest(activeTab)}
                parentHint={parentHints[activeTab] ?? ''}
                isAutoParent={activeTab > 0}
                anchorKeyEmail={activeTab === 0 ? anchorKeyEmail : undefined}
                onEmailChange={activeTab === 0 ? setAnchorKeyEmail : undefined}
                tree={activeTab === 0 ? tree : undefined}
                onTree={activeTab === 0 ? setTree : undefined}
                onConfirmTree={activeTab === 0 ? confirmTree : undefined}
                custodyConfirmed={activeTab === 0 ? custodyConfirmed : undefined}
                onCustodyChange={activeTab === 0 ? setCustodyConfirmed : undefined}
                keySent={activeTab === 0 ? keySent : undefined}
                onKeySent={activeTab === 0 ? setKeySent : undefined}
                onNewKey={handleNewKey}
              />
            </div>

            <div className="sticky top-20 space-y-3">

              {isMulti ? (
                tabLabels.map((label, i) => (
                  <PreviewCard key={i} state={manifests[i]} label={label}
                    active={activeTab === i} onClick={() => setActiveTab(i)} />
                ))
              ) : (
                <div className="rounded-lg border border-[#2E4270] bg-surface p-5">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">Preview</div>
                  <div className="mb-1 font-mono text-[11px] text-muted-slate">AR-2026-·······</div>
                  <div className="mb-1 text-[15px] font-semibold text-off-white">
                    {manifests[0].form.title || <span className="text-muted-slate/40">Untitled artifact</span>}
                  </div>
                  <div className="mb-3 text-[13px] text-muted-slate">
                    {manifests[0].form.author || 'Anonymous'} · {getNetworkNameClient()}
                  </div>
                  {manifests[0].hash ? (
                    <div className="break-all font-mono text-[10px] leading-relaxed text-muted-slate">
                      {manifests[0].hash}
                    </div>
                  ) : (
                    <div className="font-mono text-[11px] text-muted-slate/40">Add a title to generate hash</div>
                  )}
                  {manifests[0].hash && manifests[0].form.title && (
                    <div className="mt-3 border-t border-[#2E4270] pt-3">
                      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Embed tag</div>
                      <div className="font-mono text-[11px] text-electric-blue">
                        {manifests[0].form.artifactType === 'CODE' ? 'SPDX-Anchor' : 'DAPX-Anchor'}: anchorregistry.ai/AR-2026-·······
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-lg border border-[#2E4270] bg-surface p-4">
                <div className="mb-3 space-y-2 font-mono text-[11px] text-muted-slate">
                  <div className="flex justify-between"><span>SHA-256 on {getNetworkNameClient()}</span><span className="text-gold">✓</span></div>
                  <div className="flex justify-between">
                    <span>Permanent AR-ID{activeCount > 1 ? ` × ${activeCount}` : ''}</span>
                    <span className="text-gold">✓</span>
                  </div>
                  {isMulti && (
                    <div className="flex justify-between">
                      <span>{tier === 'tree' ? 'Branching provenance tree' : 'Linear provenance chain'}</span>
                      <span className="text-gold">✓</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span>Verify URL forever</span><span className="text-gold">✓</span></div>
                  <div className="flex justify-between"><span>No renewal</span><span className="text-gold">✓</span></div>
                </div>

                {isMulti && !isReady && (
                  <div className="mb-3 rounded border border-[#2E4270] bg-[#152038] px-3 py-2">
                    <p className="font-mono text-[10px] text-muted-slate">{readyCount} / {activeCount} artifacts ready</p>
                  </div>
                )}

                {error && (
                  <div className="mb-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-400">
                    {error}
                  </div>
                )}

                <div className="mb-3 flex items-center gap-2 rounded border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2">
                  <span className="text-[13px]">⚠️</span>
                  <span className="font-mono text-[11px] text-[#F59E0B]">Testnet mode — no real payments processed</span>
                </div>

                <button onClick={handleSubmit} disabled={!isReady || submitting}
                  className={`w-full rounded py-3 text-[14px] font-semibold transition-all ${
                    isReady && !submitting
                      ? 'cursor-pointer bg-gold text-deep-navy hover:bg-[#FBBF24] active:scale-[0.98]'
                      : 'cursor-not-allowed bg-gold/30 text-deep-navy/50'
                  }`}>
                  {submitting ? 'Redirecting to Stripe…' : `Pay ${selectedTierDef.price} — Register (Testnet) →`}
                </button>
                <p className="mt-3 text-center font-mono text-[10px] text-muted-slate">
                  Powered by Stripe · Your file never leaves your browser · Manifest is public on-chain
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterPageInner />
    </Suspense>
  )
}
