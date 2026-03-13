'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const ARTIFACT_TYPES = [
  { value: 'CODE',     label: 'Code',     desc: 'Repos, packages, scripts' },
  { value: 'RESEARCH', label: 'Research', desc: 'Papers, preprints, theses' },
  { value: 'DATA',     label: 'Data',     desc: 'Datasets, benchmarks' },
  { value: 'MODEL',    label: 'Model',    desc: 'AI models, weights' },
  { value: 'AGENT',    label: 'Agent',    desc: 'AI agents, bots' },
  { value: 'MEDIA',    label: 'Media',    desc: 'Video, audio, images' },
  { value: 'TEXT',     label: 'Text',     desc: 'Blogs, books, essays' },
  { value: 'POST',     label: 'Post',     desc: 'Tweets, social content' },
  { value: 'LEGAL',    label: 'Legal',    desc: 'Contracts, filings' },
  { value: 'PROOF',    label: 'Proof',    desc: 'Cryptographic proofs' },
  { value: 'OTHER',    label: 'Other',    desc: 'Everything else' },
]

const LICENSES = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BUSL-1.1', 'CC-BY-4.0',
  'CC-BY-SA-4.0', 'CC0-1.0', 'Proprietary', 'Other',
]


const TIERS = [
  { value: 'proof',  label: 'Proof',  price: '$5',  anchors: 1, desc: '1 anchor'  },
  { value: 'pack',   label: 'Pack',   price: '$12', anchors: 3, desc: '3 anchors' },
  { value: 'bundle', label: 'Bundle', price: '$30', anchors: 10, desc: '10 anchors' },
]

interface FormState {
  artifactType: string
  title:        string
  author:       string
  license:      string
  url:          string
  descriptor:   string
  parentHash:   string
}

async function sha256File(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Register() {
  const [file, setFile]             = useState<File | null>(null)
  const [hash, setHash]             = useState<string>('')
  const [hashing, setHashing]       = useState(false)
  const [dragging, setDragging]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string>('')
  const [tier, setTier]             = useState<string>('proof')
  const fileInputRef                = useRef<HTMLInputElement>(null)
  const searchParams                = useSearchParams()

  const [form, setForm] = useState<FormState>({
    artifactType: 'CODE',
    title:        '',
    author:       '',
    license:      'MIT',
    url:          '',
    descriptor:   '',
    parentHash:   '',
  })

  useEffect(() => {
    const t = searchParams.get('tier')
    if (t && TIERS.find(x => x.value === t)) setTier(t)
  }, [searchParams])

  const selectedTier = TIERS.find(t => t.value === tier) ?? TIERS[0]

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setHash('')
    setHashing(true)
    try {
      const h = await sha256File(f)
      setHash(h)
    } catch {
      setError('Failed to hash file. Please try again.')
    } finally {
      setHashing(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const isReady = !!(file && hash && form.title && form.author)

  const handleSubmit = async () => {
    if (!isReady) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manifestHash:  hash,
          artifactType:  form.artifactType,
          title:         form.title,
          author:        form.author,
          license:       form.license,
          url:           form.url,
          descriptor:    form.descriptor,
          parentHash:    form.parentHash,
          fileName:      file!.name,
          fileSize:      file!.size,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Checkout failed')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const selectedType = ARTIFACT_TYPES.find(t => t.value === form.artifactType)

  return (
    <>
      <Nav />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[960px]">

          <div className="mb-10">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Register an artifact
            </p>
            <h1 className="text-[28px] font-semibold tracking-tight text-off-white">
              Anchor your work on-chain
            </h1>
          </div>

          <div className="grid grid-cols-[1fr_340px] items-start gap-10">

            {/* ── Left: form ─────────────────────────────────────── */}
            <div className="space-y-8">

              {/* Step 1 — Drop file */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gold">01</span>
                  <span className="text-[14px] font-medium text-off-white">Drop your file</span>
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  className={`
                    cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-all
                    ${dragging
                      ? 'border-electric-blue bg-electric-blue/5'
                      : file
                      ? 'border-gold/40 bg-gold/5'
                      : 'border-[#2E4270] hover:border-muted-slate hover:bg-white/[0.02]'
                    }
                  `}
                >
                  <input ref={fileInputRef} type="file" className="hidden" onChange={onFileInput} />
                  {file ? (
                    <div>
                      <div className="mb-1 text-[15px] font-medium text-off-white">{file.name}</div>
                      <div className="mb-3 font-mono text-[12px] text-muted-slate">{formatBytes(file.size)}</div>
                      {hashing ? (
                        <div className="font-mono text-[12px] text-muted-slate">Computing SHA-256…</div>
                      ) : (
                        <div className="break-all font-mono text-[11px] leading-relaxed text-muted-slate">
                          sha256:{hash}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 text-[32px]">⚓</div>
                      <div className="mb-1 text-[14px] font-medium text-off-white">Drop any file here</div>
                      <div className="text-[13px] text-muted-slate">
                        Code, paper, dataset, model, image — anything.<br />
                        Hashed in your browser. Never uploaded.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2 — Artifact type */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gold">02</span>
                  <span className="text-[14px] font-medium text-off-white">Artifact type</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ARTIFACT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setForm(prev => ({ ...prev, artifactType: t.value }))}
                      className={`
                        rounded border px-3 py-2.5 text-left transition-all
                        ${form.artifactType === t.value
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-[#2E4270] text-muted-slate hover:border-muted-slate hover:text-off-white'
                        }
                      `}
                    >
                      <div className="text-[13px] font-medium">{t.label}</div>
                      <div className="text-[11px] opacity-70">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 — Manifest */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gold">03</span>
                  <span className="text-[14px] font-medium text-off-white">Fill the manifest</span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                        Title <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UniswapPy v1.0"
                        value={form.title}
                        onChange={set('title')}
                        className="w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                        Author <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ian Moore"
                        value={form.author}
                        onChange={set('author')}
                        className="w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                        License
                      </label>
                      <select
                        value={form.license}
                        onChange={set('license')}
                        className="w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white outline-none transition-colors focus:border-electric-blue"
                      >
                        {LICENSES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                        URL <span className="text-muted-slate/50">(optional)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={form.url}
                        onChange={set('url')}
                        className="w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                        Descriptor <span className="text-muted-slate/50">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ICMOORE-2026-UNISWAPPY"
                        value={form.descriptor}
                        onChange={set('descriptor')}
                        className="w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">
                        Parent AR-ID <span className="text-muted-slate/50">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="AR-2026-K7X9M2P"
                        value={form.parentHash}
                        onChange={set('parentHash')}
                        className="w-full rounded border border-[#2E4270] bg-surface px-3 py-2.5 font-mono text-[14px] text-off-white placeholder-muted-slate/50 outline-none transition-colors focus:border-electric-blue"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Right: preview + pay ────────────────────────────── */}
            <div className="sticky top-20 space-y-4">

              <div className="rounded-lg border border-[#2E4270] bg-surface p-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">Preview</div>
                <div className="mb-1 font-mono text-[11px] text-muted-slate">AR-2026-·······</div>
                <div className="mb-1 text-[15px] font-semibold text-off-white">
                  {form.title || <span className="text-muted-slate/50">Untitled artifact</span>}
                </div>
                <div className="mb-4 text-[13px] text-muted-slate">
                  {form.author || '—'} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Base mainnet
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#2E4270] px-2.5 py-0.5 font-mono text-[10px] text-muted-slate">
                    {selectedType?.label ?? 'CODE'}
                  </span>
                  <span className="rounded-full border border-[#2E4270] px-2.5 py-0.5 font-mono text-[10px] text-muted-slate">
                    {form.license}
                  </span>
                </div>
                {hash ? (
                  <div>
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">SHA-256</div>
                    <div className="break-all font-mono text-[10px] leading-relaxed text-muted-slate">{hash}</div>
                  </div>
                ) : (
                  <div className="font-mono text-[11px] text-muted-slate/40">Drop a file to generate hash</div>
                )}
                {form.parentHash && (
                  <div className="mt-3 border-t border-[#2E4270] pt-3">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Parent</div>
                    <div className="font-mono text-[11px] text-muted-slate">{form.parentHash}</div>
                  </div>
                )}
              </div>

              {hash && form.title && (
                <div className="rounded-lg border border-[#2E4270] bg-surface p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Your embed tag</div>
                  <div className="font-mono text-[11px] text-electric-blue">
                    {form.artifactType === 'CODE' ? 'SPDX-Anchor' : 'DAPX-Anchor'}: anchorregistry.ai/AR-2026-·······
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-[#2E4270] bg-surface p-5">

                {/* Tier selector */}
                <div className="mb-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Tier</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIERS.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setTier(t.value)}
                        className={`rounded border px-2 py-2 text-center transition-all ${
                          tier === t.value
                            ? 'border-electric-blue bg-electric-blue/10 text-off-white'
                            : 'border-[#2E4270] text-muted-slate hover:border-muted-slate'
                        }`}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.06em]">{t.label}</div>
                        <div className="text-[15px] font-semibold">{t.price}</div>
                        <div className="font-mono text-[9px] text-muted-slate">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 space-y-2 border-t border-[#2E4270] pt-4 font-mono text-[11px] text-muted-slate">
                  <div className="flex justify-between"><span>SHA-256 on Base mainnet</span><span className="text-gold">✓</span></div>
                  <div className="flex justify-between"><span>Permanent AR-ID{selectedTier.anchors > 1 ? ` × ${selectedTier.anchors}` : ''}</span><span className="text-gold">✓</span></div>
                  <div className="flex justify-between"><span>Verify URL forever</span><span className="text-gold">✓</span></div>
                  <div className="flex justify-between"><span>No renewal</span><span className="text-gold">✓</span></div>
                </div>
                {error && (
                  <div className="mb-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-400">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!isReady || submitting}
                  className={`
                    w-full rounded py-3 text-[14px] font-semibold transition-all
                    ${isReady && !submitting
                      ? 'cursor-pointer bg-gold text-deep-navy hover:bg-[#FBBF24] active:scale-[0.98]'
                      : 'cursor-not-allowed bg-gold/30 text-deep-navy/50'
                    }
                  `}
                >
                  {submitting ? 'Redirecting to Stripe…' : `Pay ${selectedTier.price} — Register →`}
                </button>
                <p className="mt-3 text-center font-mono text-[10px] text-muted-slate">
                  Powered by Stripe · Your file never leaves your browser
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
