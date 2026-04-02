'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { isTestnetClient } from '@/lib/network.client'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface StoredForm {
  artifactType: string
  title:        string
  author:       string
  descriptor:   string
  parentHash:   string
  license?:     string
  [key: string]: string | undefined
}

interface StoredManifest {
  form:         StoredForm
  tokenId:      string
  hash:         string
  registeredAt: string
  notes:        string
}

interface TypeField {
  label: string
  value: string
  mono:  boolean
}

interface ConfirmData {
  tier:                  string
  manifests:             StoredManifest[]
  anchorKeyEmail:        string
  payloads:              object[]
  typeFieldsByManifest?: TypeField[][]
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TIER_LABEL: Record<string, string> = {
  proof: '$5 — Proof',
  pair:  '$9 — Pair',
  tree:  '$12 — Tree',
}

const TIER_PRICE: Record<string, string> = {
  proof: '$5',
  pair:  '$9',
  tree:  '$12',
}

const PREVIEW_MANIFEST: StoredManifest = {
  form: {
    artifactType: 'CODE',
    title:        'Test Artifact',
    author:       'Ian Moore',
    descriptor:   'TEST-PREVIEW-2026',
    parentHash:   '',
    license:      'MIT',
  },
  tokenId:      'a3f8c2e1-b9d4-f7a2-c8e1-b9d4f7a2c8e1',
  hash:         'a3f8c2e1b9d4f7a2c8e1b9d4f7a2c8e1b9d4f7a2a3f8c2e1b9d4f7a2c8e18f2a',
  registeredAt: new Date().toISOString(),
  notes:        '',
}

const PREVIEW_DATA: ConfirmData = {
  tier:           'proof',
  manifests:      [PREVIEW_MANIFEST],
  anchorKeyEmail: '',
  payloads:       [{}],
  typeFieldsByManifest: [[
    { label: 'License',         value: 'MIT',                  mono: false },
    { label: 'URL',             value: 'https://github.com/example/repo', mono: true },
    { label: 'Git Commit Hash', value: 'a1b2c3d4e5f6...',      mono: true },
    { label: 'Language',        value: 'TypeScript',            mono: false },
    { label: 'Version',         value: 'v1.0.0',               mono: false },
  ]],
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function truncateHash(hash: string): string {
  if (hash.length <= 24) return hash
  return hash.slice(0, 16) + '…' + hash.slice(-8)
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm page
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmPageInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const isPreview    = searchParams.get('preview') === 'true'

  const [data, setData]           = useState<ConfirmData | null>(null)
  const [checked, setChecked]     = useState([false, false, false])
  const [copied, setCopied]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (isPreview) { setData(PREVIEW_DATA); return }
    try {
      const raw = sessionStorage.getItem('ar_confirm')
      if (!raw) { router.push('/register'); return }
      setData(JSON.parse(raw))
    } catch {
      router.push('/register')
    }
  }, [isPreview, router])

  const allChecked = checked.every(Boolean)

  const handleCopy = () => {
    if (!data) return
    navigator.clipboard.writeText(data.manifests[0].tokenId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sha256Hex = async (str: string): Promise<string> => {
    const buf = new TextEncoder().encode(str)
    if (crypto?.subtle) {
      const hash = await crypto.subtle.digest('SHA-256', buf)
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
    }
    // Weak fallback for HTTP localhost only — never runs in production HTTPS
    let h = 0x811c9dc5
    for (const b of buf) { h ^= b; h = (Math.imul(h, 0x01000193) >>> 0) }
    return h.toString(16).padStart(64, '0')
  }

  const handlePay = async () => {
    if (!allChecked || isPreview || !data) return
    setSubmitting(true); setError('')
    try {
      const isMulti    = data.tier !== 'proof'
      const count      = data.tier === 'tree' ? 3 : data.tier === 'pair' ? 2 : 1
      const ownerToken = data.manifests[0].tokenId

      // Reserve AR-IDs before payment so we can compute treeId + tokenCommitment
      const reserveRes = await fetch('/api/reserve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ count }),
      })
      if (!reserveRes.ok) throw new Error('Failed to reserve AR-IDs')
      const { ar_ids } = await reserveRes.json()

      const rootArId = ar_ids[0]
      const treeId   = await sha256Hex(ownerToken + rootArId)

      const enrichedPayloads = await Promise.all(
        (data.payloads as Record<string, unknown>[]).map(async (p, i) => ({
          ...p,
          reserved_ar_id:   ar_ids[i],
          tree_id:          treeId,
          token_commitment: await sha256Hex(ownerToken + ar_ids[i]),
        }))
      )

      const body = isMulti
        ? { manifests: enrichedPayloads, tier: data.tier }
        : { ...enrichedPayloads[0], tier: data.tier }

      const res  = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail ?? 'Checkout failed')
      sessionStorage.removeItem('ar_confirm')
      window.location.href = json.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  if (!data) return null

  const { tier, manifests } = data
  const tokenId      = manifests[0].tokenId
  const isDerivative = !!manifests[0].form.parentHash
  const tierLabel    = TIER_LABEL[tier] ?? tier
  const tierPrice    = TIER_PRICE[tier] ?? ''

  return (
    <>
      <Nav />
      <main className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-[640px]">

          {/* Back link */}
          <Link href="/register"
            className="mb-8 inline-flex items-center gap-1 font-mono text-[11px] text-muted-slate transition-colors hover:text-off-white">
            ← Edit registration
          </Link>

          {/* Section A — Header */}
          <div className="mb-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Review your registration
            </p>
            <h1 className="text-[28px] font-semibold tracking-tight text-off-white">
              Review Your Registration
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-slate">
              This information will be written permanently to Base mainnet.{' '}
              <span className="text-off-white">Review carefully — it cannot be changed after payment.</span>
            </p>
          </div>

          {/* Section B — Artifact Metadata */}
          {manifests.map((m, i) => {
            const typeFields = data.typeFieldsByManifest?.[i] ?? []
            const baseRows: { label: string; value: string; mono: boolean }[] = [
              { label: 'Artifact Type', value: m.form.artifactType, mono: false },
              { label: 'Title',         value: m.form.title,         mono: false },
              { label: 'Author',        value: m.form.author,        mono: false },
              { label: 'Descriptor',    value: m.form.descriptor,    mono: false },
              ...(m.form.parentHash ? [{ label: 'Parent Anchor', value: m.form.parentHash, mono: true }] : []),
            ]
            const tailRows: { label: string; value: string; mono: boolean }[] = [
              { label: 'Manifest Hash', value: truncateHash(m.hash), mono: true },
              ...(i === 0 ? [{ label: 'Price', value: tierLabel, mono: false }] : []),
            ]
            const allRows = [...baseRows, ...typeFields, ...tailRows]
            return (
              <div key={i} className="mb-4 rounded-lg border border-[#2E4270] bg-[#1C2B4A] p-4">
                {manifests.length > 1 && (
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                    Artifact {i + 1}{i === 0 ? ' · Root' : ' · Child'}
                  </p>
                )}
                <div className="space-y-2.5">
                  {allRows.map(({ label, value, mono }) => (
                    <div key={label} className="flex items-baseline justify-between gap-4">
                      <span className="shrink-0 font-mono text-[11px] text-muted-slate">{label}</span>
                      <span className={`text-right text-[12px] text-off-white ${mono ? 'font-mono' : ''}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Section C — Ownership Token */}
          <div className={`mb-6 rounded-lg border p-4 ${isDerivative ? 'border-[#2E4270] bg-[#1C2B4A] opacity-50' : 'border-[#F59E0B]/50 bg-[#F59E0B]/5'}`}>
            <p className={`mb-3 font-mono text-[11px] uppercase tracking-[0.08em] ${isDerivative ? 'text-muted-slate' : 'text-[#F59E0B]'}`}>
              {isDerivative ? 'Existing Ownership Token' : 'Your Ownership Token'}
            </p>
            <div className="mb-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded border border-[#2E4270] bg-[#152038] px-3 py-2 font-mono text-[12px] text-muted-slate">
                {tokenId}
              </code>
              {!isDerivative && (
                <button onClick={handleCopy}
                  className="shrink-0 rounded border border-[#2E4270] bg-[#1C2B4A] px-3 py-2 font-mono text-[11px] text-muted-slate transition-colors hover:text-off-white">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            {isDerivative ? (
              <p className="text-[11px] text-muted-slate">
                This is your existing ownership token for the parent anchor. No new token will be issued.
              </p>
            ) : (
              <>
                <p className="text-[11px] text-[#F59E0B]/90">
                  ⚠ AnchorRegistry does not store or retain this token.
                  It will be displayed once more on the next page and cannot be recovered if lost.
                </p>
                <p className="mt-1.5 text-[10px] text-muted-slate">
                  Token generated client-side. Never transmitted to or retained by AnchorRegistry servers.
                </p>
              </>
            )}
          </div>

          {/* Section D — Three Mandatory Checkboxes */}
          <div className="mb-6 space-y-3">
            {([
              'I have saved my ownership token and understand it cannot be recovered if lost.',
              'I understand this registration is permanent. Once submitted to Base mainnet it cannot be modified, deleted, or corrected.',
              null, // rendered separately for the link
            ] as (string | null)[]).map((label, i) => (
              <label key={i}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  checked[i] ? 'border-gold/40 bg-gold/5' : 'border-[#2E4270] hover:border-muted-slate/50'
                }`}>
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={e => setChecked(prev => prev.map((v, j) => j === i ? e.target.checked : v))}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#F59E0B]"
                />
                <span className="text-[13px] leading-snug text-off-white">
                  {i === 2 ? (
                    <>
                      I agree to the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer"
                        className="text-[#3B82F6] hover:underline"
                        onClick={e => e.stopPropagation()}>
                        AnchorRegistry Terms of Service
                      </a>
                      .
                    </>
                  ) : label}
                </span>
              </label>
            ))}
          </div>

          {/* Section E — Pay Button */}
          <div className="rounded-lg border border-[#2E4270] bg-[#1C2B4A] p-4">
            {error && (
              <div className="mb-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-400">
                {error}
              </div>
            )}

            {isPreview && (
              <div className="mb-3 flex items-center gap-2 rounded border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2">
                <span className="text-[13px]">⚠️</span>
                <span className="font-mono text-[11px] text-[#F59E0B]">Preview mode — pay button disabled</span>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={!allChecked || submitting || isPreview}
              className={`w-full rounded py-3 text-[14px] font-semibold transition-all ${
                allChecked && !submitting && !isPreview
                  ? 'cursor-pointer bg-[#F59E0B] text-[#0D1B2E] hover:bg-[#FBBF24] active:scale-[0.98]'
                  : 'cursor-not-allowed bg-[#F59E0B]/30 text-[#0D1B2E]/50'
              }`}>
              {submitting ? 'Redirecting to Stripe…' : `Pay ${tierPrice} — Register (Testnet) →`}
            </button>

            {/* Section F — Footer trust line */}
            <p className="mt-3 text-center font-mono text-[10px] text-muted-slate">
              Powered by Stripe · Your file never leaves your browser · Manifest is public on-chain
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmPageInner />
    </Suspense>
  )
}
