'use client'

import { useState } from 'react'
import { TokenToggleButton } from '@/components/MaskedToken'

// ─── helpers ─────────────────────────────────────────────────────────────────

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input)
  const subtle =
    (typeof crypto !== 'undefined' && crypto.subtle) ||
    (globalThis as unknown as { crypto?: { subtle?: SubtleCrypto } })?.crypto?.subtle
  if (!subtle) {
    throw new Error('crypto.subtle unavailable — use HTTPS')
  }
  const out = await subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(out))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function tokenCommitment(anchorKey: string, arId: string): Promise<string> {
  return '0x' + (await sha256Hex(anchorKey.trim() + arId.trim()))
}

// ─── shared bits ─────────────────────────────────────────────────────────────

interface ActionCardProps {
  label:    string
  desc:     string
  children: React.ReactNode
}

function ActionCard({ label, desc, children }: ActionCardProps) {
  return (
    <div className="rounded-lg border border-[#2E4270] bg-surface p-5">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
        {label}
      </div>
      <p className="mb-4 text-[12px] leading-[1.6] text-muted-slate">{desc}</p>
      {children}
    </div>
  )
}

interface FieldProps {
  label:       string
  children:    React.ReactNode
  hint?:       string
}

function Field({ label, children, hint }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 font-mono text-[10px] text-muted-slate/80">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded border border-[#2E4270] bg-bg px-3 py-2 font-mono text-[12px] text-off-white placeholder:text-muted-slate/50 focus:border-electric-blue focus:outline-none'

const buttonClass =
  'rounded border border-[#2E4270] px-4 py-2 font-mono text-[11px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white disabled:cursor-not-allowed disabled:opacity-50'

const primaryButtonClass =
  'rounded border border-electric-blue/40 bg-electric-blue/10 px-4 py-2 font-mono text-[11px] text-electric-blue transition-all hover:bg-electric-blue/20 disabled:cursor-not-allowed disabled:opacity-50'

// ─── SEAL form ───────────────────────────────────────────────────────────────

function SealForm({ arId }: { arId: string }) {
  const [open,         setOpen]         = useState(false)
  const [confirmed,    setConfirmed]    = useState(false)
  const [token,        setToken]        = useState('')
  const [showToken,    setShowToken]    = useState(false)
  const [reason,       setReason]       = useState('')
  const [newTreeRoot,  setNewTreeRoot]  = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState('')
  const [result,       setResult]       = useState<{ tx_hash: string; sealed_at_block: number } | null>(null)

  const submit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const tc   = await tokenCommitment(token, arId)
      const res  = await fetch('/api/seal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ar_id:            arId,
          reason,
          new_tree_root:    newTreeRoot,
          token_commitment: tc,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || `Seal failed (${res.status})`)
      setResult({ tx_hash: data.tx_hash, sealed_at_block: data.sealed_at_block })
      // Trigger a soft reload so server-rendered sealed state refreshes.
      setTimeout(() => window.location.reload(), 1800)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Seal failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <ActionCard
        label="Sealed"
        desc="Tree has been sealed on-chain. Refreshing verify page…"
      >
        <div className="space-y-2 font-mono text-[11px]">
          <div className="text-muted-slate">
            block <span className="text-gold">{result.sealed_at_block}</span>
          </div>
          <div className="break-all text-electric-blue">{result.tx_hash}</div>
        </div>
      </ActionCard>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass}
      >
        Seal this tree →
      </button>
    )
  }

  return (
    <ActionCard
      label="Seal tree"
      desc="Declares this tree authentic, complete, and permanent. No new anchors can be registered under a sealed tree. Irreversible on-chain action."
    >
      {!confirmed ? (
        <div className="space-y-3">
          <p className="text-[12px] leading-[1.55] text-off-white">
            Sealing this tree is <span className="text-gold">permanent</span>.
            Once sealed, no new children can be added. Continue?
          </p>
          <div className="flex gap-2">
            <button type="button" className={buttonClass} onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button" className={primaryButtonClass} onClick={() => setConfirmed(true)}>
              Yes, continue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Field
            label="Anchor key (ownership token)"
            hint="Your private key. Used only to compute the token commitment locally in this browser. Never sent to the server."
          >
            <div className="flex items-start gap-2">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="paste your anchor key"
                className={inputClass}
                autoComplete="off"
                spellCheck={false}
              />
              <TokenToggleButton
                visible={showToken}
                onToggle={() => setShowToken((v) => !v)}
                className="mt-0.5"
              />
            </div>
          </Field>

          <Field label="Reason (optional)">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Release v1.0 finalized"
              className={inputClass}
              maxLength={200}
            />
          </Field>

          <Field
            label="Continuation pointer (optional)"
            hint="AR-ID of a successor tree root. Readers that land on this sealed tree can follow this pointer forward."
          >
            <input
              type="text"
              value={newTreeRoot}
              onChange={(e) => setNewTreeRoot(e.target.value)}
              placeholder="AR-2026-XXXXXXX"
              className={inputClass}
            />
          </Field>

          {error && (
            <div className="rounded border border-red-500/30 bg-red-500/5 px-3 py-2 font-mono text-[11px] text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={submit}
              disabled={submitting || !token.trim()}
            >
              {submitting ? 'Sealing…' : 'Confirm seal'}
            </button>
          </div>
        </div>
      )}
    </ActionCard>
  )
}

// ─── RETRACTION form ─────────────────────────────────────────────────────────

function RetractionForm({ arId }: { arId: string }) {
  const [open,       setOpen]       = useState(false)
  const [token,      setToken]      = useState('')
  const [showToken,  setShowToken]  = useState(false)
  const [reason,     setReason]     = useState('')
  const [replacedBy, setReplacedBy] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [result,     setResult]     = useState<{ ar_id: string; tx_hash: string } | null>(null)

  const submit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const tc  = await tokenCommitment(token, arId)
      const res = await fetch('/api/retraction', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_ar_id:     arId,
          reason,
          replaced_by:      replacedBy,
          token_commitment: tc,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || `Retraction failed (${res.status})`)
      setResult({ ar_id: data.ar_id, tx_hash: data.tx_hash })
      setTimeout(() => window.location.reload(), 1800)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Retraction failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <ActionCard
        label="Retracted"
        desc="A RETRACTION anchor has been registered on-chain. Refreshing verify page…"
      >
        <div className="space-y-2 font-mono text-[11px]">
          <div className="text-muted-slate">
            new anchor <span className="text-gold">{result.ar_id}</span>
          </div>
          <div className="break-all text-electric-blue">{result.tx_hash}</div>
        </div>
      </ActionCard>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass}
      >
        Retract this anchor →
      </button>
    )
  }

  return (
    <ActionCard
      label="Retract anchor"
      desc="Registers a RETRACTION anchor attached to this record. The original anchor remains visible on-chain but is marked retracted. Readers following the tree will see the replacement AR-ID if you provide one."
    >
      <div className="space-y-4">
        <Field
          label="Anchor key (ownership token)"
          hint="Your private key. Used only to compute the token commitment locally in this browser. Never sent to the server."
        >
          <div className="flex items-start gap-2">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="paste your anchor key"
              className={inputClass}
              autoComplete="off"
              spellCheck={false}
            />
            <TokenToggleButton
              visible={showToken}
              onToggle={() => setShowToken((v) => !v)}
              className="mt-0.5"
            />
          </div>
        </Field>

        <Field label="Reason (optional)">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Corrected in v1.1"
            className={inputClass}
            maxLength={200}
          />
        </Field>

        <Field
          label="Replaced by (optional)"
          hint="AR-ID of a corrected version, if one exists. Resolvers will follow this pointer forward."
        >
          <input
            type="text"
            value={replacedBy}
            onChange={(e) => setReplacedBy(e.target.value)}
            placeholder="AR-2026-XXXXXXX"
            className={inputClass}
          />
        </Field>

        {error && (
          <div className="rounded border border-red-500/30 bg-red-500/5 px-3 py-2 font-mono text-[11px] text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className={buttonClass}
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={primaryButtonClass}
            onClick={submit}
            disabled={submitting || !token.trim()}
          >
            {submitting ? 'Retracting…' : 'Confirm retraction'}
          </button>
        </div>
      </div>
    </ActionCard>
  )
}

// ─── entry point ─────────────────────────────────────────────────────────────

export default function ProvenanceActions({
  arId,
  isTreeRoot,
  isSealed,
  isRetracted,
}: {
  arId:        string
  isTreeRoot:  boolean
  isSealed:    boolean
  isRetracted: boolean
}) {
  const canSeal    = isTreeRoot && !isSealed && !isRetracted
  const canRetract = !isRetracted

  if (!canSeal && !canRetract) return null

  return (
    <div className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
        Owner actions
      </div>
      <div className="flex flex-wrap gap-3">
        {canSeal    && <SealForm       arId={arId} />}
        {canRetract && <RetractionForm arId={arId} />}
      </div>
    </div>
  )
}
