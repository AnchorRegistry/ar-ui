import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import {
  IPProvenanceTree,
  AuditTrailTree,
  AIComplianceTree,
  ScientificReproducibilityTree,
  TransactionRecordsTree,
} from '@/components/docs/UseCaseTrees'

export const metadata: Metadata = {
  title: 'AnchorRegistry™ — Docs',
}

// ─── data ────────────────────────────────────────────────────────────────────

const ARTIFACT_TYPES = [
  { id: 0,  group: 'Content',      name: 'CODE',       status: 'active', desc: 'Repos, packages, commits, scripts.' },
  { id: 1,  group: 'Content',      name: 'RESEARCH',   status: 'active', desc: 'Papers, whitepapers, preprints, theses.' },
  { id: 2,  group: 'Content',      name: 'DATA',       status: 'active', desc: 'Datasets, benchmarks, databases.' },
  { id: 3,  group: 'Content',      name: 'MODEL',      status: 'active', desc: 'AI models, weights, checkpoints.' },
  { id: 4,  group: 'Content',      name: 'AGENT',      status: 'active', desc: 'AI agents, bots, assistants.' },
  { id: 5,  group: 'Content',      name: 'MEDIA',      status: 'active', desc: 'Video, audio, images, photography.' },
  { id: 6,  group: 'Content',      name: 'TEXT',       status: 'active', desc: 'Blogs, articles, books, essays.' },
  { id: 7,  group: 'Content',      name: 'POST',       status: 'active', desc: 'Tweets, social posts, Farcaster casts.' },
  { id: 8,  group: 'Content',      name: 'ONCHAIN',    status: 'active', desc: 'Addresses, transactions, NFTs, DAOs.' },
  { id: 9,  group: 'Content',      name: 'REPORT',     status: 'active', desc: 'Consulting, compliance, ESG, audit reports.' },
  { id: 10, group: 'Content',      name: 'NOTE',       status: 'active', desc: 'Memos, meeting notes, correspondence, field notes.' },
  { id: 11, group: 'Content',      name: 'WEBSITE',    status: 'active', desc: 'Web pages, apps, online platforms.' },
  { id: 12, group: 'Lifecycle',    name: 'EVENT',      status: 'active', desc: 'Human events and machine/agent processes.' },
  { id: 13, group: 'Transaction',  name: 'RECEIPT',    status: 'active', desc: 'Purchase, medical, financial, government receipts.' },
  { id: 14, group: 'Gated',        name: 'LEGAL',      status: 'v2',     desc: 'Contracts, patents, filings, disclosures.' },
  { id: 15, group: 'Gated',        name: 'ENTITY',     status: 'v2',     desc: 'Verified persons, companies, AI systems.' },
  { id: 16, group: 'Gated',        name: 'PROOF',      status: 'v4',     desc: 'ZK proofs, formal verifications, security audits.' },
  { id: 17, group: 'Self-service', name: 'SEAL',       status: 'active', desc: 'Tree sealed — authentic, complete, permanent.' },
  { id: 18, group: 'Self-service', name: 'RETRACTION', status: 'active', desc: 'Owner-initiated anchor retraction.' },
  { id: 19, group: 'Review',       name: 'REVIEW',     status: 'active', desc: 'Soft flag — anchor under review.' },
  { id: 20, group: 'Review',       name: 'VOID',       status: 'active', desc: 'Hard finding — subtree condemned.' },
  { id: 21, group: 'Review',       name: 'AFFIRMED',   status: 'active', desc: 'Exoneration — review resolved.' },
  { id: 22, group: 'Billing',      name: 'ACCOUNT',    status: 'active', desc: 'Billing account with anchor capacity.' },
  { id: 23, group: 'Catch-all',    name: 'OTHER',      status: 'active', desc: 'Anything that does not fit above.' },
]

const VERTICALS = [
  {
    id:       'ip-provenance',
    number:   '01',
    title:    'IP Provenance',
    audience: 'Developers, researchers, creators, freelancers',
    problem:  'In a world where AI generates everything, proving you made something first is increasingly critical. AnchorRegistry gives every digital artifact a permanent, tamper-proof timestamp anchored to Ethereum.',
    types:    'CODE · RESEARCH · DATA · MODEL · AGENT · MEDIA · TEXT · POST',
    Tree:     IPProvenanceTree,
  },
  {
    id:       'audit-trail',
    number:   '02',
    title:    'Audit Trail',
    audience: 'Consultants, advisory firms, compliance teams, law firms',
    problem:  'Professional deliverables live in email threads and shared drives that can be altered or denied. AnchorRegistry makes the full engagement record — reports, notes, events — permanent and independently verifiable.',
    types:    'REPORT · NOTE · EVENT',
    Tree:     AuditTrailTree,
  },
  {
    id:       'ai-compliance',
    number:   '03',
    title:    'AI Compliance',
    audience: 'AI companies, enterprises deploying agents, regulators',
    problem:  'When an autonomous system takes an action there is currently no permanent, tamper-proof record of what version of what model was running at that moment. AnchorRegistry is the infrastructure layer for that proof.',
    types:    'MODEL · AGENT · DATA · EVENT (MACHINE · AGENT)',
    Tree:     AIComplianceTree,
  },
  {
    id:       'scientific-reproducibility',
    number:   '04',
    title:    'Scientific Reproducibility',
    audience: 'Researchers, clinical trial teams, academic institutions',
    problem:  'Pre-registration exists but relies on centralised platforms that can be compromised or defunded. Anchoring a study protocol before results are known creates cryptographic proof the hypothesis predated the data.',
    types:    'RESEARCH · DATA · CODE · EVENT',
    Tree:     ScientificReproducibilityTree,
  },
  {
    id:       'transaction-records',
    number:   '05',
    title:    'Transaction Records',
    audience: 'CFOs, accounting firms, procurement teams, insurance, government',
    problem:  'Business transaction records live in systems that can be altered, disputed, and lost. AnchorRegistry makes the financial audit trail permanent and verifiable by any auditor independently — no request to AR required.',
    types:    'RECEIPT · REPORT · NOTE · EVENT',
    Tree:     TransactionRecordsTree,
  },
]

const FAQ = [
  {
    q: 'Is there an AnchorRegistry token?',
    a: 'No. There is no token, no coin, no airdrop, and no plans for any. AnchorRegistry is infrastructure — the blockchain is the ledger, not the product. The fee you pay is for permanent on-chain registration, not for a speculative asset. This is a notary service, not a protocol.',
  },
  {
    q: 'Is this an NFT?',
    a: 'No. There is no token, no secondary market, and no speculation. AnchorRegistry is a notary service — you are registering proof that an artifact existed in a specific form at a specific moment. The record lives on Ethereum. Nothing is minted.',
  },
  {
    q: 'How is the manifest hash generated?',
    a: 'There is no file upload. The manifest hash is SHA-256 of your artifact metadata — type, title, author, descriptor, type-specific fields, and your Anchor Key — computed entirely in your browser. The hash is a cryptographic fingerprint of what you declared, bound to your private key. Nothing leaves your browser except the hash itself.',
  },
  {
    q: 'What does AnchorRegistry store in its database?',
    a: 'Supabase stores the metadata needed to serve your verify page quickly: AR-ID, artifact type, title, author, descriptor, manifest hash, parent hash, tree ID, type-specific fields, block timestamp, and transaction hash. It also stores your Stripe payment reference (session ID) and, if you provided one, your email address for token recovery. Supabase is a fast-query cache — it is entirely rebuildable from Ethereum events if lost. AnchorRegistry does not store your Anchor Key under any circumstances. It is never sent to our servers.',
  },
  {
    q: 'What is the Anchor Key and why does it matter?',
    a: 'The Anchor Key is a 32-byte random private credential you generate and hold. Your tree ID — keccak256(K ‖ rootArId) — is derived from it and written to every node in your tree. This means only the holder of K can produce a matching commitment on any future anchor in this tree. AnchorRegistry never has access to your Anchor Key and cannot read which trees you own. Not your keys, not your trees.',
  },
  {
    q: 'What if I lose my Anchor Key?',
    a: 'Your anchored records are permanent and unaffected — they cannot be deleted. You would lose the ability to prove tree ownership and add new nodes to that tree. Save your Anchor Key. It cannot be recovered. A token recovery flow (V1.5) will allow you to recover your AR-ID ownership token via Stripe email verification.',
  },
  {
    q: 'I lost my AR-ID. Can I recover it?',
    a: 'Yes, and it costs nothing. The manifest hash is fully deterministic — it is SHA-256 of your manifest fields and your Anchor Key. If you have your Anchor Key and remember what you registered, recompute the hash in your browser and look it up via GET /verify/hash/{manifest_hash}. Your AR-ID resolves instantly from the hash. The Anchor Key is the master recovery credential — the AR-ID is just a pointer to the record it unlocks.',
  },
  {
    q: 'Can I retract a registration?',
    a: 'Yes. Retraction is a self-service operation ($2) that attaches a RETRACTION anchor to the original record. All blockchain records are permanent and cannot be deleted — that is by design. What retraction does is signal intent: the resolution layer reads the latest state of your provenance tree and renders it accordingly, so a retracted anchor is surfaced as retracted and a replacement AR-ID, if provided, is followed automatically. The tree always reflects your most current preference. The on-chain record of everything that happened remains intact and auditable.',
  },
  {
    q: 'What does it mean to seal a tree?',
    a: 'Sealing marks a provenance tree as authentic and complete — no new anchors may be appended. Only the tree root can be sealed, and only by someone holding the original Anchor Key. The contract enforces several conditions at registerSeal(): the anchor must be a tree root, it must not already be sealed, it must not be voided or under review, and a non-zero token commitment is required. Sealing is permanent and cannot be reversed — not by the tree owner and not by AnchorRegistry. AR governance (VOID, REVIEW, AFFIRMED) can still target anchors inside sealed trees, so sealing is not a shield against fraud findings.',
  },
  {
    q: 'Is there a paper?',
    a: 'Yes. "Trustless Provenance Trees: A Game-Theoretic Framework for Operator-Gated Blockchain Registries" (I. Moore, 2026) — https://arxiv.org/abs/2604.03434. The paper defines the construction formally: tree ID derivation, the keccak256(K ‖ arId) commitment scheme, Theorem 3 (governance separation via hardcoded zero commitments on REVIEW/VOID/AFFIRMED), and the trust model. It is the source of record for the formal guarantees users and agents rely on — everything on this page is downstream of what the paper proves.',
  },
  {
    q: 'Is this legal proof in court?',
    a: 'AnchorRegistry provides a timestamped, cryptographic, independently verifiable record of what existed and when. It is strong prior art evidence and has been compared to a notary stamp with a blockchain witness. We are not lawyers and this is not legal advice. Consult counsel for your specific jurisdiction.',
  },
  {
    q: 'What chain is this on?',
    a: 'Base — Ethereum L2 by Coinbase. Fast, cheap, and settled to Ethereum mainnet. The contract is deployed once and cannot be modified. The contract address alone is sufficient to reconstruct the entire registry.',
  },
  {
    q: "What's the difference between anchorregistry.com and anchorregistry.ai?",
    a: 'anchorregistry.com is the full human-facing product — registration, verify pages, docs. anchorregistry.ai is the machine-readable endpoint optimised for AI agents and pipelines. Embed anchorregistry.ai/AR-ID in any artifact and any AI or human can resolve it in one request.',
  },
  {
    q: 'What happens if AnchorRegistry shuts down?',
    a: 'Nothing happens to your records. They are on Ethereum permanently. The contract address is the registry — anyone can query it directly via Etherscan or any Ethereum RPC endpoint. The open-source anchorregistry Python package includes a recovery command that reconstructs the full registry from on-chain events alone, with no dependency on our infrastructure.',
  },
  {
    q: 'Will my record exist in 50 years?',
    a: 'As long as Ethereum exists, yes. Base settles to Ethereum mainnet. There are no renewals, no subscriptions, and no expiry. One payment. Permanent record.',
  },
  {
    q: 'How do AI agents use this?',
    a: 'AI agents query api.anchorregistry.ai/verify/{ar_id} to resolve any AR-ID to a full provenance record. The SPDX-Anchor and DAPX-Anchor tags embedded in artifacts are the resolution triggers. When an agent encounters one of these tags it can resolve the full provenance tree, verify the manifest hash against the artifact it holds, and determine trust level.',
  },
  {
    q: 'How does AnchorRegistry handle fraudulent trees?',
    a: 'Every flag is reviewed by a human and triggers a REVIEW anchor — a soft on-chain flag that marks the anchor as contested and opens a 14-day response window for both parties. If fraud is confirmed, a VOID anchor is attached to the parent of the fraud origin and cascades down the subtree, disabling resolution while leaving the original records permanently visible on-chain. If the finding is overturned on appeal, an AFFIRMED anchor reinstates the tree — a tree that has been challenged, investigated, and vindicated carries the strongest possible trust signal.',
  },
  {
    q: 'Can the same artifact be registered twice?',
    a: 'No. The contract enforces uniqueness on manifestHash. AlreadyRegistered() reverts any duplicate. First registration wins — permanently, on-chain.',
  },
]

const NAV_SECTIONS = [
  { id: 'getting-started', label: 'Getting started'  },
  { id: 'use-cases',       label: 'Use cases'        },
  { id: 'artifact-types', label: 'Artifact types'   },
  { id: 'provenance-tree',  label: 'The provenance tree' },
  { id: 'security',       label: 'Security & trust'  },
  { id: 'faq',            label: 'FAQ'               },
]

// ─── helpers ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-[26px] font-semibold tracking-tight text-off-white">
      {children}
    </h2>
  )
}

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[15px] leading-[1.7] text-muted-slate ${className}`}>
      {children}
    </p>
  )
}

function StatusPill({ status }: { status: string }) {
  if (status === 'active') return (
    <span className="inline-block rounded-full border border-electric-blue/25 bg-electric-blue/10 px-2 py-0.5 font-mono text-[10px] text-electric-blue">
      active
    </span>
  )
  return (
    <span className="inline-block rounded-full border border-[#2E4270] bg-surface px-2 py-0.5 font-mono text-[10px] text-muted-slate">
      {status}
    </span>
  )
}

function Divider() {
  return <div className="my-16 border-t border-[#2E4270]" />
}

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="rounded-md border border-[#2E4270] bg-[#0d1829]">
      {label && (
        <div className="border-b border-[#2E4270] px-4 py-2 font-mono text-[10px] text-muted-slate">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-relaxed text-electric-blue">
        {children}
      </pre>
    </div>
  )
}

/**
 * Render a prose string with bare http(s) URLs turned into clickable
 * anchor tags. Opens in a new tab with noopener/noreferrer. Preserves
 * whitespace-pre-line newline behavior via React text node splitting.
 */
function LinkifiedProse({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-blue hover:underline break-all"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Docs() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-[960px] px-8 py-16">

        {/* page header */}
        <div className="mb-14 border-b border-[#2E4270] pb-10">
          <SectionLabel>Documentation</SectionLabel>
          <h1 className="mb-4 text-[40px] font-semibold tracking-tight text-off-white">
            AnchorRegistry™ Docs
          </h1>
          <Prose className="max-w-[560px]">
            Everything you need to understand, use, and build on AnchorRegistry —
            the immutable provenance registry for the AI era.
          </Prose>
        </div>

        {/* layout: sidebar + content */}
        <div className="flex gap-16">

          {/* sidebar */}
          <aside className="hidden w-[180px] shrink-0 lg:block">
            <div className="sticky top-24">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">On this page</p>
              <nav className="flex flex-col gap-1">
                {NAV_SECTIONS.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    className="rounded px-2 py-1.5 text-[13px] text-muted-slate transition-colors hover:bg-surface hover:text-off-white">
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* main content */}
          <main className="min-w-0 flex-1">

            {/* ── 1. Getting Started ──────────────────────────────── */}
            <section id="getting-started">
              <SectionLabel>01</SectionLabel>
              <SectionHeading>Getting started</SectionHeading>
              <Prose className="mb-6">
                AnchorRegistry is a permanent, on-chain provenance registry. Fill in a manifest,
                pay once, receive an AR-ID, and take custody of your Anchor Key — a permanent,
                cryptographic record that proves this artifact existed in this exact form at this
                exact moment, written to Base (Ethereum L2). No expiry. No account. No trust required.
              </Prose>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">What is an AR-ID?</h3>
              <Prose className="mb-4">
                An AR-ID is a permanent, unique, human and machine-readable identifier for any
                registered artifact. Format: <span className="font-mono text-electric-blue">AR-&#123;YYYY&#125;-&#123;7-char hash&#125;</span>.
                Every AR-ID resolves to a full provenance record.
              </Prose>
              <CodeBlock label="Two resolution paths">
{`# Human
anchorregistry.com/verify/AR-2026-K7X9M2P

# Machine (AI agents, pipelines, APIs)
anchorregistry.ai/AR-2026-K7X9M2P`}
              </CodeBlock>

              <h3 className="mb-3 mt-8 text-[16px] font-medium text-off-white">How to register</h3>
              <div className="mb-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#2E4270] bg-[#2E4270] sm:grid-cols-4">
                {[
                  { n: '01', t: 'Choose type',   b: 'Pick from 24 artifact types across 8 groups.' },
                  { n: '02', t: 'Fill manifest', b: 'Title, author, descriptor, type-specific fields.' },
                  { n: '03', t: 'Anchor Key',    b: 'Your private key. Controls your provenance tree. Save it.' },
                  { n: '04', t: 'Pay & anchor',  b: '$5. Hash computed in browser. Nothing uploaded.' },
                ].map(s => (
                  <div key={s.n} className="bg-surface px-5 py-5">
                    <div className="mb-2 font-mono text-[11px] text-gold">{s.n}</div>
                    <div className="mb-1.5 text-[13px] font-medium text-off-white">{s.t}</div>
                    <p className="text-[12px] leading-[1.5] text-muted-slate">{s.b}</p>
                  </div>
                ))}
              </div>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">Embed tags</h3>
              <Prose className="mb-4">
                Once anchored, embed your AR-ID in the artifact itself. These tags are the
                distribution mechanism — every artifact becomes a permanent, distributed
                proof node that any human or AI can resolve.
              </Prose>
              <CodeBlock label="Two watermark standards">
{`# Software artifacts (code, packages, repos)
SPDX-Anchor: anchorregistry.ai/AR-2026-K7X9M2P

# Everything else (research, data, models, media)
DAPX-Anchor: anchorregistry.ai/AR-2026-K7X9M2P`}
              </CodeBlock>

              <h3 className="mb-3 mt-8 text-[16px] font-medium text-off-white">What is stored on-chain vs off-chain?</h3>
              <div className="overflow-hidden rounded-lg border border-[#2E4270]">
                <div className="grid grid-cols-2 divide-x divide-[#2E4270] border-b border-[#2E4270] bg-surface">
                  <div className="px-4 py-2.5 font-mono text-[11px] text-gold">On-chain (Ethereum · permanent)</div>
                  <div className="px-4 py-2.5 font-mono text-[11px] text-muted-slate">Off-chain (Supabase · rebuildable)</div>
                </div>
                {[
                  ['AR-ID, manifest hash, parent hash', 'Stripe payment linkage'],
                  ['Artifact type, descriptor',         'Verify page rendering cache'],
                  ['Title, author, tag fields',         'Email (optional, for token recovery)'],
                  ['Tree ID, registrant address',       ''],
                  ['Artifact metadata (type-specific)', ''],
                  ['Token commitment',                  ''],
                  ['Block timestamp',                   ''],
                ].map(([on, off], i) => (
                  <div key={i} className="grid grid-cols-2 divide-x divide-[#2E4270] border-b border-[#2E4270] last:border-b-0">
                    <div className="px-4 py-3 text-[13px] text-off-white">{on}</div>
                    <div className="px-4 py-3 text-[13px] text-muted-slate">{off}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-slate">
                If all off-chain infrastructure disappears, the complete registry is recoverable
                from Ethereum events alone using{' '}
                <span className="font-mono text-electric-blue">anchorregistry recover</span>.
                Ethereum is the ground truth.
              </p>
            </section>

            <Divider />

            {/* ── 2. Use Cases ────────────────────────────────────── */}
            <section id="use-cases">
              <SectionLabel>02</SectionLabel>
              <SectionHeading>Use cases</SectionHeading>
              <Prose className="mb-12">
                Every use case is the same fundamental problem: prove something existed, in this
                exact form, at this exact moment, and that it has not been altered since.
                Twenty-four artifact types. Five verticals. One registry.
              </Prose>

              <div className="space-y-20">
                {VERTICALS.map(({ id, number, title, audience, problem, types, Tree }) => (
                  <section key={id} id={id}>
                    <div className="mb-8">
                      <p className="mb-2 font-mono text-[11px] text-gold">{number}</p>
                      <h3 className="mb-2 text-[20px] font-semibold tracking-tight text-off-white">{title}</h3>
                      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate">{audience}</p>
                      <p className="mb-5 text-[14px] leading-[1.7] text-muted-slate">{problem}</p>
                      <div className="rounded border border-[#2E4270] bg-surface px-4 py-3">
                        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-slate">Artifact types</p>
                        <p className="font-mono text-[11px] text-electric-blue">{types}</p>
                      </div>
                    </div>
                    <Tree />
                  </section>
                ))}
              </div>
            </section>

            <Divider />

            {/* ── 3. Artifact Types ───────────────────────────────── */}
            <section id="artifact-types">
              <SectionLabel>03</SectionLabel>
              <SectionHeading>Artifact types</SectionHeading>
              <Prose className="mb-8">
                Twenty-four types across eight logical groups. All non-gated types are active
                at launch. Gated types (LEGAL, ENTITY, PROOF — IDs 14–16) require verification
                infrastructure and open progressively in V2–V4.
              </Prose>

              <div className="overflow-hidden rounded-lg border border-[#2E4270]">
                <div className="grid grid-cols-[36px_1fr_120px_80px] border-b border-[#2E4270] bg-surface px-4 py-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">#</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Type</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Group</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">Status</div>
                </div>
                {ARTIFACT_TYPES.map((t, i) => (
                  <div key={t.id}
                    className={`grid grid-cols-[36px_1fr_120px_80px] items-start px-4 py-3 ${
                      i < ARTIFACT_TYPES.length - 1 ? 'border-b border-[#2E4270]' : ''
                    } ${t.group === 'Gated' ? 'opacity-50' : ''}`}>
                    <div className="font-mono text-[11px] text-muted-slate pt-0.5">{t.id}</div>
                    <div>
                      <div className="mb-0.5 font-mono text-[12px] font-medium text-electric-blue">{t.name}</div>
                      <div className="text-[12px] text-muted-slate">{t.desc}</div>
                    </div>
                    <div className="font-mono text-[11px] text-muted-slate pt-0.5">{t.group}</div>
                    <div className="pt-0.5"><StatusPill status={t.status} /></div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-[#2E4270] bg-surface p-5">
                <div className="mb-2 font-mono text-[11px] text-gold">EVENT — dual executor</div>
                <Prose className="mb-3 text-[14px]">
                  EVENT is the only type with a required{' '}
                  <span className="font-mono text-electric-blue">executor</span> field,
                  making it dual-use: human lifecycle events and machine/agent processes share one type.
                </Prose>
                <CodeBlock>
{`executor: HUMAN   → conferences, launches, governance votes, milestones
executor: MACHINE → training runs, deployments, builds, inference jobs
executor: AGENT   → agent-initiated tasks, pipeline runs, evaluations`}
                </CodeBlock>
              </div>

              <div className="mt-4 rounded-lg border border-[#2E4270] bg-surface p-5">
                <div className="mb-2 font-mono text-[11px] text-gold">RECEIPT — six subtypes</div>
                <Prose className="text-[14px]">
                  RECEIPT handles all transaction categories via a{' '}
                  <span className="font-mono text-electric-blue">receiptType</span> field:{' '}
                  <span className="font-mono text-electric-blue">PURCHASE | MEDICAL | FINANCIAL | GOVERNMENT | EVENT | SERVICE</span>.
                  Amount is stored as a string to preserve decimal precision.
                </Prose>
              </div>
            </section>

            <Divider />

            {/* ── 4. The Provenance Tree ────────────────────────────── */}
            <section id="provenance-tree">
              <SectionLabel>04</SectionLabel>
              <SectionHeading>The provenance tree</SectionHeading>
              <Prose className="mb-6">
                Most registries are flat. AnchorRegistry is not. Every anchor can reference a
                parent via the{' '}
                <span className="font-mono text-electric-blue">parentHash</span> field,
                creating a directed acyclic graph — a traversable provenance tree. Any registered
                artifact is a node. The root AR-ID resolves the full tree.
              </Prose>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">The tree ID</h3>
              <Prose className="mb-4">
                Every node in a tree carries the same{' '}
                <span className="font-mono text-electric-blue">treeId</span> —
                a cryptographic commitment derived as:
              </Prose>
              <CodeBlock label="Tree ID derivation">
{`treeId = keccak256(K ‖ rootArId)

# K         — your Anchor Key (32 random bytes, generated in your browser, never sent to AnchorRegistry)
# rootArId  — the AR-ID of the root anchor in your tree
# ‖         — byte-level concatenation`}
              </CodeBlock>
              <div className="mt-5 mb-6 rounded-lg border border-gold/30 bg-gold/5 p-5">
                <p className="mb-1 font-mono text-[13px] font-medium text-gold">
                  Not your keys, not your trees.
                </p>
                <p className="text-[13px] leading-[1.65] text-muted-slate">
                  AnchorRegistry never stores, transmits, or has access to your Anchor Key.
                  It is generated in your browser and never leaves it. Because the{' '}
                  <span className="font-mono text-electric-blue">treeId</span> is derived
                  from your key, AR cannot compute it, cannot read which trees you own,
                  and cannot impersonate you. Self-custody is structural, not a policy.
                </p>
              </div>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">Tree recovery</h3>
              <Prose className="mb-4">
                Given any single AR-ID as an entry point, the full provenance tree is recoverable
                in O(n) time. Walk up via{' '}
                <span className="font-mono text-electric-blue">parentHash</span> to
                find the root, then BFS/DFS down using the reverse index. The
                <span className="font-mono text-electric-blue"> treeId</span> index makes
                the whole tree retrievable in one query.
              </Prose>
              <CodeBlock label="One-query tree retrieval">
{`SELECT * FROM anchors_all
WHERE tree_id = '<treeId>'
ORDER BY block_timestamp ASC`}
              </CodeBlock>

              <h3 className="mb-3 mt-8 text-[16px] font-medium text-off-white">Distinguishing governance from user-initiated anchors</h3>
              <Prose>
                REVIEW, VOID, and AFFIRMED anchors are registered by AnchorRegistry as
                governance actions. The smart contract hardcodes their token commitment
                to <span className="font-mono text-electric-blue">bytes32(0)</span> —
                a value that user-initiated content can never carry, since{' '}
                <span className="font-mono text-electric-blue">registerContent</span>{' '}
                reverts with <span className="font-mono text-electric-blue">MissingTokenCommitment</span>{' '}
                on a zero value. This makes the two classes of anchor cryptographically
                distinguishable forever: user-initiated anchors carry a non-zero{' '}
                <span className="font-mono text-electric-blue">keccak256(K ‖ arId)</span>{' '}
                commitment; governance anchors carry zero. Anyone can filter the
                Anchored event log for governance actions by scanning for zero
                commitments, making the dispute chain independently queryable and
                auditable. This separation is enforced immutably by the deployed
                bytecode — AnchorRegistry cannot impersonate a user-initiated
                registration because it cannot produce a valid non-zero commitment
                without the user&apos;s Anchor Key.
              </Prose>
            </section>

            <Divider />

            {/* ── 5. Security & Trust ─────────────────────────────── */}
            <section id="security">
              <SectionLabel>05</SectionLabel>
              <SectionHeading>Security &amp; trust</SectionHeading>
              <Prose className="mb-2">The governing principle:</Prose>
              <blockquote className="mb-8 border-l-2 border-gold pl-5">
                <p className="text-[17px] font-medium text-off-white">
                  Worst case is always time, never data loss.
                </p>
              </blockquote>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">Access control</h3>
              <Prose className="mb-4">
                Four role tiers govern the contract. No single key can act unilaterally
                against both owner and recovery address simultaneously.
              </Prose>
              <div className="mb-6 overflow-hidden rounded-lg border border-[#2E4270]">
                {[
                  { role: 'Owner',            desc: 'Governance only. Add/remove operators. Transfer ownership. Cancel recovery. Cannot register anchors.' },
                  { role: 'Operator',         desc: 'Registration only. Calls registerContent, registerTargeted, and registerSeal. Cannot call registerGated (LEGAL/ENTITY/PROOF) or any governance function.' },
                  { role: 'Recovery address', desc: 'Last resort. Initiate and execute ownership transfer after 7-day timelock. Can rotate itself.' },
                  { role: 'Gated operators',  desc: 'Legal, Entity, Proof — each can only call their single register function. No operators at deployment.' },
                ].map((r, i) => (
                  <div key={r.role} className={`flex items-start gap-4 px-4 py-3.5 ${i < 3 ? 'border-b border-[#2E4270]' : ''}`}>
                    <span className="mt-0.5 w-[140px] shrink-0 font-mono text-[12px] font-medium text-gold">{r.role}</span>
                    <span className="text-[13px] leading-[1.55] text-muted-slate">{r.desc}</span>
                  </div>
                ))}
              </div>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">7-day recovery timelock</h3>
              <Prose className="mb-6">
                The recovery mechanism is a 7-day timelocked ownership transfer initiated
                by the recovery address. The owner can cancel any in-flight recovery at any time.
                Every sensitive operation emits an on-chain event visible on Etherscan in real time.
                A 7-day lockout after cancellation prevents griefing.
              </Prose>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">Can a record be deleted?</h3>
              <Prose className="mb-6">
                No. The contract is append-only. Records are permanent and cannot be modified
                or deleted by anyone — including AnchorRegistry. Retraction attaches a new
                RETRACTION node; the original record remains on-chain permanently.
              </Prose>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">Can a record be faked?</h3>
              <Prose className="mb-4">
                The manifest hash is SHA-256 of your full manifest fields bound to your Anchor Key —
                anyone reconstructing it needs the same K, and K never leaves your browser.
                The contract additionally requires a non-zero token commitment
                (<span className="font-mono text-electric-blue">keccak256(K ‖ arId)</span>) on every user-initiated registration;
                governance anchors (REVIEW, VOID, AFFIRMED) hardcode this to zero, so
                AnchorRegistry cannot impersonate a user-initiated registration.
                The contract also enforces AR-ID uniqueness —{' '}
                <span className="font-mono text-electric-blue">AlreadyRegistered()</span> reverts
                any duplicate. First registration wins permanently.
              </Prose>

              <h3 className="mb-3 text-[16px] font-medium text-off-white">The dispute system</h3>
              <div className="mb-6 overflow-hidden rounded-lg border border-[#2E4270]">
                {[
                  { type: 'REVIEW',   color: '#F59E0B', desc: 'Soft flag. Anchor is under investigation. 14-day response window for both parties.' },
                  { type: 'VOID',     color: '#EF4444', desc: 'Hard finding. Attached to the parent of the fraud origin. Cascades down the subtree.' },
                  { type: 'AFFIRMED', color: '#3B82F6', desc: 'Exoneration. Resolves a REVIEW or VOID. Tree is cleared. treeId query returns clean.' },
                ].map((d, i) => (
                  <div key={d.type} className={`flex items-start gap-4 px-4 py-3.5 ${i < 2 ? 'border-b border-[#2E4270]' : ''}`}>
                    <span className="mt-0.5 w-[90px] shrink-0 font-mono text-[12px] font-medium" style={{ color: d.color }}>{d.type}</span>
                    <span className="text-[13px] leading-[1.55] text-muted-slate">{d.desc}</span>
                  </div>
                ))}
              </div>
              <Prose>
                Every enforcement decision is logged on-chain permanently and carries
                a zero token commitment, marking it as a governance action that no user
                could have produced. AnchorRegistry cannot act in secret. The full
                dispute chain is always public and queryable by anyone — filter the
                Anchored event log for zero commitments and you have the complete
                governance record.
              </Prose>
            </section>

            <Divider />

            {/* ── 6. FAQ ──────────────────────────────────────────── */}
            <section id="faq">
              <SectionLabel>06</SectionLabel>
              <SectionHeading>FAQ</SectionHeading>
              <div className="overflow-hidden rounded-lg border border-[#2E4270]">
                {FAQ.map((item, i) => (
                  <div key={i} className={`px-5 py-5 ${i < FAQ.length - 1 ? 'border-b border-[#2E4270]' : ''}`}>
                    <div className="mb-2 text-[14px] font-medium text-off-white">{item.q}</div>
                    <p className="text-[13px] leading-[1.65] text-muted-slate whitespace-pre-line">
                      <LinkifiedProse text={item.a} />
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-lg border border-[#2E4270] bg-surface px-6 py-5">
                <div className="mb-1 text-[14px] font-medium text-off-white">Still have questions?</div>
                <p className="text-[13px] text-muted-slate">
                  The contract source is fully open.{' '}
                  <a href="https://github.com/anchorregistry/ar-onchain" target="_blank" rel="noopener noreferrer"
                    className="text-electric-blue hover:underline">github.com/anchorregistry/ar-onchain</a>.
                  Or reach us at{' '}
                  <a href="mailto:support@anchorregistry.com" className="text-electric-blue hover:underline">
                    support@anchorregistry.com
                  </a>.
                </p>
              </div>
            </section>

          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
