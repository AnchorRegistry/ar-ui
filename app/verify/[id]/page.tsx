import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { verifyById, type AnchorRecord } from '@/lib/api'
import { getNetworkName, getExplorerTxUrl, getExplorerAddressUrl, getSiteOrigin } from '@/lib/network'
import ArtifactTree from './ArtifactTree'
import ProvenanceActions from './ProvenanceActions'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const [data, network, origin] = await Promise.all([
      verifyById(id), getNetworkName(), getSiteOrigin(),
    ])
    if (!data.found || !data.anchor) {
      return { title: `${id} — AnchorRegistry™` }
    }
    const a = data.anchor
    return {
      title:       `${a.descriptor || a.ar_id} — AnchorRegistry™`,
      description: `On-chain provenance record for "${a.descriptor || a.ar_id}" by ${a.ar_id}. Registered on ${network}. Verifiable by any human or AI agent.`,
      openGraph: {
        title:       `${a.descriptor || a.ar_id} — AnchorRegistry™`,
        description: `Permanent provenance anchor · ${a.artifact_type} · ${network}`,
        url:         `${origin}/verify/${a.ar_id}`,
      },
    }
  } catch {
    return { title: `${id} — AnchorRegistry™` }
  }
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CODE:     { bg: 'rgba(59,130,246,0.1)',  text: '#3B82F6', border: 'rgba(59,130,246,0.3)'  },
  RESEARCH: { bg: 'rgba(168,85,247,0.1)',  text: '#A855F7', border: 'rgba(168,85,247,0.3)'  },
  DATA:     { bg: 'rgba(20,184,166,0.1)',  text: '#14B8A6', border: 'rgba(20,184,166,0.3)'  },
  MODEL:    { bg: 'rgba(245,158,11,0.1)',  text: '#F59E0B', border: 'rgba(245,158,11,0.3)'  },
  AGENT:    { bg: 'rgba(239,68,68,0.1)',   text: '#EF4444', border: 'rgba(239,68,68,0.3)'   },
  MEDIA:    { bg: 'rgba(236,72,153,0.1)',  text: '#EC4899', border: 'rgba(236,72,153,0.3)'  },
  TEXT:     { bg: 'rgba(132,204,22,0.1)',  text: '#84CC16', border: 'rgba(132,204,22,0.3)'  },
  POST:     { bg: 'rgba(251,191,36,0.1)',  text: '#FBBF24', border: 'rgba(251,191,36,0.3)'  },
  ONCHAIN:  { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1', border: 'rgba(99,102,241,0.3)'  },
  EVENT:    { bg: 'rgba(234,179,8,0.1)',   text: '#EAB308', border: 'rgba(234,179,8,0.3)'   },
  RECEIPT:  { bg: 'rgba(34,197,94,0.1)',   text: '#22C55E', border: 'rgba(34,197,94,0.3)'   },
  LEGAL:    { bg: 'rgba(156,163,175,0.1)', text: '#9CA3AF', border: 'rgba(156,163,175,0.3)' },
  ENTITY:   { bg: 'rgba(251,146,60,0.1)',  text: '#FB923C', border: 'rgba(251,146,60,0.3)'  },
  PROOF:    { bg: 'rgba(52,211,153,0.1)',  text: '#34D399', border: 'rgba(52,211,153,0.3)'  },
  REPORT:   { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1', border: 'rgba(99,102,241,0.3)'  },
  NOTE:     { bg: 'rgba(156,163,175,0.1)', text: '#9CA3AF', border: 'rgba(156,163,175,0.3)' },
  SEAL:     { bg: 'rgba(16,185,129,0.1)',  text: '#10B981', border: 'rgba(16,185,129,0.3)'  },
  OTHER:    { bg: 'rgba(123,147,196,0.1)', text: '#7B93C4', border: 'rgba(123,147,196,0.3)' },
}

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] ?? TYPE_COLORS.OTHER
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px]"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {type}
    </span>
  )
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
        {label}
      </div>
      <div className={`text-[13px] text-off-white break-all ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  )
}

export default async function VerifyId({ params }: Props) {
  const { id } = await params
  let data
  try {
    data = await verifyById(id)
  } catch {
    notFound()
  }

  if (!data.found || !data.anchor) {
    return (
      <>
        <Nav />
        <main className="flex min-h-[60vh] items-center justify-center px-8">
          <div className="text-center">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Not found
            </p>
            <h1 className="mb-3 font-mono text-[24px] font-medium text-off-white">
              {id}
            </h1>
            <p className="mb-6 text-[14px] text-muted-slate">
              No anchor registered with this AR-ID.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center rounded border border-[#2E4270] px-5 py-2.5 text-[14px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
            >
              Try another AR-ID
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const a: AnchorRecord = data.anchor
  const date = new Date(a.block_timestamp).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  // Contract Continuity — link to the contract this anchor lives on, falling
  // back to the tx's contract if a pre-Phase-6 row lacks registry_address.
  const registryAddress = a.registry_address ?? ''
  const [network, explorerUrl, contractUrl] = await Promise.all([
    getNetworkName(),
    getExplorerTxUrl(a.tx_hash),
    registryAddress ? getExplorerAddressUrl(registryAddress) : Promise.resolve(''),
  ])
  // Explicit /machine/{id} URL — always JSON, no content negotiation
  const machineUrl = a.machine_url.replace(`/${a.ar_id}`, `/machine/${a.ar_id}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    identifier: a.ar_id,
    name: a.descriptor || a.ar_id,
    url: a.verify_url,
    creator: { '@type': 'Person', identifier: a.registrant },
    dateCreated: a.block_timestamp,
    ...(a.license && { license: a.license }),
    ...(a.url && { sameAs: a.url }),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'manifestHash',    value: a.manifest_hash },
      { '@type': 'PropertyValue', name: 'txHash',          value: a.tx_hash },
      { '@type': 'PropertyValue', name: 'blockNumber',     value: a.block_number },
      { '@type': 'PropertyValue', name: 'artifactType',    value: a.artifact_type },
      { '@type': 'PropertyValue', name: 'network',         value: network },
      { '@type': 'PropertyValue', name: 'machineUrl',      value: machineUrl },
      ...(registryAddress
        ? [{ '@type': 'PropertyValue', name: 'registryAddress', value: registryAddress }]
        : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[960px]">

          {/* Page header */}
          <div className="mb-8">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Provenance record
            </p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-mono text-[22px] font-medium text-off-white">
                {a.ar_id}
              </h1>
              <div className="flex shrink-0 items-center gap-2">
                {a.is_retracted && (
                  <div className="flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 font-mono text-[11px] text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    Retracted
                  </div>
                )}
                {a.is_sealed && (
                  <div className="flex items-center gap-1.5 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-3 py-1 font-mono text-[11px] text-[#F59E0B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                    Sealed
                  </div>
                )}
                {data.verified_on_chain && (
                  <div className="flex items-center gap-1.5 rounded-full border border-electric-blue/25 bg-electric-blue/10 px-3 py-1 font-mono text-[11px] text-electric-blue">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
                    Verified on-chain
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_320px] items-start gap-8">

            {/* ── Left: anchor record ─────────────────────────────── */}
            <div className="space-y-6">

              {/* Main card */}
              <div className="rounded-lg border border-[#2E4270] bg-surface p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TypeBadge type={a.artifact_type} />
                  {a.license && (
                    <span className="rounded-full border border-[#2E4270] px-2.5 py-0.5 font-mono text-[11px] text-muted-slate">
                      {a.license}
                    </span>
                  )}
                </div>

                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mb-1 inline-block"
                  >
                    <h2 className="text-[22px] font-semibold text-off-white transition-opacity group-hover:opacity-70">
                      {a.descriptor || a.ar_id}
                      <span className="ml-2 font-mono text-[13px] font-normal text-muted-slate">↗</span>
                    </h2>
                  </a>
                ) : (
                  <h2 className="mb-1 text-[22px] font-semibold text-off-white">
                    {a.descriptor || a.ar_id}
                  </h2>
                )}
                <p className="mb-6 text-[14px] text-muted-slate">
                  {a.registrant} · {date} · {network} · block {a.block_number.toLocaleString()}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="AR-ID"         value={a.ar_id}                        mono />
                  <Field label="Artifact type" value={a.artifact_type}                     />
                  <Field label="Registrant"    value={a.registrant}                   mono />
                  <Field label="Block"         value={a.block_number.toLocaleString()}     />
                  <Field label="Registered"    value={date}                                />
                  {a.license && <Field label="License" value={a.license} />}
                </div>
              </div>

              {/* Embed tag */}
              <div className="rounded-lg border border-[#2E4270] bg-surface p-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                  Embed this anchor
                </div>
                <div className="mb-3 rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[12px] text-electric-blue">
                  {a.artifact_type === 'CODE' ? 'SPDX-Anchor' : 'DAPX-Anchor'}: {a.machine_url}
                </div>
                <p className="font-mono text-[11px] text-muted-slate">
                  Add this tag to your README, paper footer, or model card.
                  Any human or AI that encounters it can resolve this record.
                </p>
              </div>

              {/* Hash card */}
              <div className="rounded-lg border border-[#2E4270] bg-surface p-6">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
                  Cryptographic proof
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                      SHA-256 Manifest Hash
                    </div>
                    <div className="break-all rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[12px] leading-relaxed text-muted-slate">
                      {a.manifest_hash}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                      Transaction Hash
                    </div>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[12px] leading-relaxed text-electric-blue transition-opacity hover:opacity-80"
                    >
                      {a.tx_hash}
                    </a>
                  </div>
                  {registryAddress && (
                    <div>
                      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                        Registry Contract
                      </div>
                      <a
                        href={contractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-all rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[12px] leading-relaxed text-electric-blue transition-opacity hover:opacity-80"
                      >
                        {registryAddress}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner actions — SEAL / RETRACTION. Visibility is driven by
                  the anchor's current state; the component returns null when
                  neither action applies. */}
              <ProvenanceActions
                arId={a.ar_id}
                isTreeRoot={a.depth === 0 || !a.parent_hash}
                isSealed={a.is_sealed ?? false}
                isRetracted={a.is_retracted ?? false}
              />

            </div>

            {/* ── Right: lineage tree ─────────────────────────────── */}
            <div className="sticky top-20">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
                Provenance Tree Lineage
              </div>
              <ArtifactTree anchor={a} />

              {/* Machine URL */}
              <div className="mt-4 rounded-lg border border-[#2E4270] bg-surface p-4">
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
                  Machine-readable endpoint
                </div>
                <a
                  href={machineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-[11px] text-electric-blue transition-opacity hover:opacity-80"
                >
                  {machineUrl}
                </a>
                <p className="mt-3 font-mono text-[10px] text-muted-slate">
                  AI agents: this endpoint always returns JSON — full provenance
                  subtree, no headers needed. Or use content negotiation on the
                  smart URL by sending{' '}
                  <span className="text-off-white">Accept: application/json</span>.
                </p>
                <div className="mt-3 space-y-1.5 rounded border border-[#2E4270] bg-bg px-3 py-2.5 font-mono text-[10px] text-muted-slate">
                  <div className="text-[#4a6080]"># Always JSON — no setup required:</div>
                  <div className="break-all text-electric-blue/80">curl {machineUrl}</div>
                  <div className="mt-1 text-[#4a6080]"># Or use the smart URL with content negotiation:</div>
                  <div className="break-all text-electric-blue/80">
                    curl -H &quot;Accept: application/json&quot; {a.machine_url}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
