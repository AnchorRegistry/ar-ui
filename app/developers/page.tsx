import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CopyCodeBlock from './CopyCodeBlock'

export const metadata: Metadata = {
  title:       'AnchorRegistry™ — Developers',
  description: 'Developer guide for AnchorRegistry — ACCOUNT purchase, artifact registration, SEAL, verify, MCP server. x402 payments on Base.',
}

// ─── nav data ────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'account',      label: 'ACCOUNT'        },
  { id: 'registration', label: 'Registration'   },
  { id: 'balance',      label: 'Balance & tree' },
  { id: 'seal',         label: 'SEAL'           },
  { id: 'verify',       label: 'Verify'         },
  { id: 'mcp',          label: 'MCP server'     },
  { id: 'python',       label: 'Python package' },
]

// ─── helpers (match docs page style) ─────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[24px] font-semibold tracking-tight text-off-white">
      {children}
    </h2>
  )
}

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[14px] leading-[1.7] text-muted-slate ${className}`}>
      {children}
    </p>
  )
}

function Divider() {
  return <div className="my-14 border-t border-[#2E4270]" />
}

function TierCard({ tier, price, capacity }: { tier: string; price: string; capacity: string }) {
  return (
    <div className="flex-1 rounded-md border border-[#2E4270] bg-surface px-4 py-4">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">{tier}</div>
      <div className="mb-1 text-[22px] font-semibold tracking-tight text-off-white">{price}</div>
      <div className="font-mono text-[11px] text-muted-slate">{capacity}</div>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function DevelopersPage() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-[960px] px-8 py-16">

        {/* page header */}
        <div className="mb-14 border-b border-[#2E4270] pb-10">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
            Developer guide
          </p>
          <h1 className="mb-4 text-[40px] font-semibold tracking-tight text-off-white">
            AnchorRegistry™ for developers
          </h1>
          <Prose className="max-w-[640px]">
            Everything you need to integrate permanent, on-chain artifact provenance into your
            workflows. One key per account, no per-anchor signing, machine-readable by default.
            All endpoints return JSON.
          </Prose>
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#2E4270] bg-surface px-4 py-2.5 font-mono text-[12px]">
            <span className="text-muted-slate">Base URL</span>
            <span className="text-muted-slate">·</span>
            <span className="text-electric-blue">https://api.anchorregistry.ai</span>
          </div>
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
              <div className="mt-6 flex flex-col gap-1 border-t border-[#2E4270] pt-4">
                <a
                  href="https://smithery.ai/servers/ic3moore/anchorregistry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-[13px] text-muted-slate transition-colors hover:bg-surface hover:text-off-white"
                >
                  Smithery <span className="text-muted-slate/60">↗</span>
                </a>
                <a
                  href="https://registry.modelcontextprotocol.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-[13px] text-muted-slate transition-colors hover:bg-surface hover:text-off-white"
                >
                  MCP Registry <span className="text-muted-slate/60">↗</span>
                </a>
                <a
                  href="https://github.com/AnchorRegistry/ar-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-[13px] text-muted-slate transition-colors hover:bg-surface hover:text-off-white"
                >
                  GitHub <span className="text-muted-slate/60">↗</span>
                </a>
                <a
                  href="https://github.com/modelcontextprotocol/inspector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-[13px] text-muted-slate transition-colors hover:bg-surface hover:text-off-white"
                >
                  MCP Inspector <span className="text-muted-slate/60">↗</span>
                </a>
              </div>
            </div>
          </aside>

          {/* main content */}
          <main className="min-w-0 flex-1">

            {/* ── §1 ACCOUNT ───────────────────────────────────────────────── */}
            <section id="account">
              <SectionLabel>§1 · ACCOUNT</SectionLabel>
              <SectionHeading>Purchase an ACCOUNT</SectionHeading>
              <Prose className="mb-6">
                An ACCOUNT is a one-time purchase that gives you an anchor key and a capacity quota.
                Register artifacts against the key as many times as your capacity allows — no
                per-transaction signing, no Stripe, no user accounts.
              </Prose>

              <div className="mb-6 flex gap-4">
                <TierCard tier="Starter" price="$50" capacity="50 anchors" />
                <TierCard tier="Builder" price="$100" capacity="200 anchors" />
              </div>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">
                Payment — x402 on Base
              </h3>
              <Prose className="mb-4">
                Payment uses the{' '}
                <a
                  href="https://x402.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  x402 protocol
                </a>{' '}
                — USDC on Base, settled via the Coinbase CDP facilitator. The server returns a 402 with
                payment requirements for both tiers; sign a USDC transfer authorization via EIP-712 and
                retry with an <span className="font-mono text-electric-blue">X-PAYMENT</span> header.
                The ACCOUNT is created, and your anchor key is returned{' '}
                <span className="text-gold">once</span> — save it.
              </Prose>

              <CopyCodeBlock label="Request — step 1 (expect 402)">
{`curl -X POST https://api.anchorregistry.ai/register/account \\
  -H "Content-Type: application/json" \\
  -d '{"capacity_tier": "starter"}'

# → 402 Payment Required
# Accepts header lists starter ($50) and builder ($100) options.`}
              </CopyCodeBlock>

              <div className="mt-4">
                <CopyCodeBlock label="Response after signed payment">
{`{
  "ar_id":        "AR-2026-XXXXXXX",
  "anchor_key":   "<32-byte hex>",      // shown ONCE — save this
  "capacity":     50,
  "tier":         "starter",
  "tx_hash":      "0x...",
  "block_number": 12345678,
  "rail":         "x402",
  "status":       "confirmed",
  "verify_url":   "https://anchorregistry.ai/AR-2026-XXXXXXX"
}`}
                </CopyCodeBlock>
              </div>
            </section>

            <Divider />

            {/* ── §2 Artifact Registration ─────────────────────────────────── */}
            <section id="registration">
              <SectionLabel>§2 · Registration</SectionLabel>
              <SectionHeading>Register an artifact</SectionHeading>
              <Prose className="mb-6">
                Use your anchor key as a bearer token. Each successful registration deducts one from
                your ACCOUNT balance — no per-call payment. The manifest hash should be a SHA-256 over
                the artifact content or canonical metadata.
              </Prose>

              <CopyCodeBlock label="POST /register/x402">
{`curl -X POST https://api.anchorregistry.ai/register/x402 \\
  -H "Authorization: Bearer <anchor_key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "manifest_hash": "<sha256 of artifact>",
    "artifact_type": "CODE",
    "title":         "My Project v1.0",
    "descriptor":    "MY-PROJECT-V1",
    "git_hash":      "abc123",
    "license":       "MIT",
    "language":      "Python",
    "version":       "1.0.0",
    "url":           "https://github.com/org/repo"
  }'`}
              </CopyCodeBlock>

              <div className="mt-4">
                <CopyCodeBlock label="Response">
{`{
  "ar_id":              "AR-2026-YYYYYYY",
  "tx_hash":            "0x...",
  "verify_url":         "https://anchorregistry.ai/AR-2026-YYYYYYY",
  "remaining_capacity": 24,
  "status":             "confirmed"
}`}
                </CopyCodeBlock>
              </div>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">Supported types</h3>
              <div className="rounded-md border border-[#2E4270] bg-surface p-4 font-mono text-[12px] leading-[1.9] text-electric-blue">
                CODE · RESEARCH · DATA · MODEL · AGENT · MEDIA · TEXT · POST · ONCHAIN · REPORT · NOTE · WEBSITE · EVENT · RECEIPT · OTHER
              </div>
              <p className="mt-3 font-mono text-[11px] text-muted-slate">
                Each type carries its own optional fields — pass any type-specific field on the request
                body and it will be persisted with the anchor.
              </p>
            </section>

            <Divider />

            {/* ── §3 Balance & Tree ────────────────────────────────────────── */}
            <section id="balance">
              <SectionLabel>§3 · Balance &amp; tree</SectionLabel>
              <SectionHeading>Check balance and top up</SectionHeading>
              <Prose className="mb-6">
                Every ACCOUNT is the root of a provenance tree. The balance derives from the capacity
                of the root plus any top-ups, minus artifacts already registered. Top-ups attach as
                child ACCOUNT anchors under the same root.
              </Prose>

              <CopyCodeBlock label="Check remaining capacity">
{`curl https://api.anchorregistry.ai/account/<anchor_key>/balance

# {
#   "root_ar_id":     "AR-2026-XXXXXXX",
#   "total_capacity": 50,
#   "used":           1,
#   "remaining":      49
# }`}
              </CopyCodeBlock>

              <div className="mt-4">
                <CopyCodeBlock label="View the full ACCOUNT tree">
{`curl https://api.anchorregistry.ai/account/<anchor_key>/tree`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Top up (starter $50 or builder $100)">
{`curl -X POST https://api.anchorregistry.ai/register/account/topup \\
  -H "Content-Type: application/json" \\
  -d '{"anchor_key": "<key>", "capacity_tier": "starter"}'

# → 402 (pay via x402, then capacity increases)`}
                </CopyCodeBlock>
              </div>
            </section>

            <Divider />

            {/* ── §4 SEAL ──────────────────────────────────────────────────── */}
            <section id="seal">
              <SectionLabel>§4 · SEAL</SectionLabel>
              <SectionHeading>Seal a provenance tree</SectionHeading>
              <Prose className="mb-6">
                Sealing a tree declares it authentic, complete, and permanent. No new children can be
                added under a sealed tree. Useful at release boundaries — lock a v1.0 tree before moving
                to v2.0. The SEAL action is on-chain and irreversible.
              </Prose>

              <CopyCodeBlock label="POST /registration/seal">
{`curl -X POST https://api.anchorregistry.ai/registration/seal \\
  -H "Content-Type: application/json" \\
  -d '{
    "ar_id":            "AR-2026-XXXXXXX",
    "reason":           "Release v1.0 finalized",
    "token_commitment": "0x<sha256(anchor_key + ar_id)>",
    "new_tree_root":    ""
  }'`}
              </CopyCodeBlock>

              <p className="mt-4 text-[13px] leading-[1.7] text-muted-slate">
                <span className="font-mono text-gold">token_commitment</span> is{' '}
                <span className="font-mono text-electric-blue">0x</span>-prefixed SHA-256 of your
                anchor key concatenated with the AR-ID being sealed. Only the tree root can be sealed.
                Optionally pass a continuation pointer in{' '}
                <span className="font-mono text-electric-blue">new_tree_root</span> to point readers at
                a successor tree.
              </p>
            </section>

            <Divider />

            {/* ── §5 Verify ────────────────────────────────────────────────── */}
            <section id="verify">
              <SectionLabel>§5 · Verify</SectionLabel>
              <SectionHeading>Resolve any AR-ID</SectionHeading>
              <Prose className="mb-6">
                Verification is free and public. Resolve any AR-ID or manifest hash to its full
                provenance record — no authentication needed. The machine endpoint always returns JSON;
                the smart URL content-negotiates on <span className="font-mono text-electric-blue">Accept</span>.
              </Prose>

              <CopyCodeBlock label="By AR-ID">
{`curl https://api.anchorregistry.ai/verify/AR-2026-XXXXXXX`}
              </CopyCodeBlock>

              <div className="mt-4">
                <CopyCodeBlock label="By manifest hash">
{`curl https://api.anchorregistry.ai/verify/hash/<sha256>`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Machine-readable (always JSON, no headers required)">
{`curl https://anchorregistry.ai/machine/AR-2026-XXXXXXX`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Content negotiation on the smart URL">
{`curl -H "Accept: application/json" \\
  https://anchorregistry.ai/AR-2026-XXXXXXX`}
                </CopyCodeBlock>
              </div>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">Embed tags</h3>
              <Prose className="mb-4">
                Drop an SPDX-Anchor tag into your README, paper, or model card — any human or AI
                encountering it can resolve the full provenance tree in one request.
              </Prose>
              <CopyCodeBlock>
{`SPDX-Anchor: https://anchorregistry.ai/AR-2026-XXXXXXX`}
              </CopyCodeBlock>
            </section>

            <Divider />

            {/* ── §6 MCP Server ────────────────────────────────────────────── */}
            <section id="mcp">
              <SectionLabel>§6 · MCP Server</SectionLabel>
              <SectionHeading>Native AI agent integration</SectionHeading>
              <Prose className="mb-6">
                AnchorRegistry ships a public, authless MCP server at{' '}
                <span className="font-mono text-electric-blue">mcp.anchorregistry.ai/mcp</span>.
                Any MCP-compatible AI client — Claude Desktop, Claude Code, Cursor, VS Code,
                Windsurf, or any custom agent — can install it and resolve AR-IDs, manifest
                hashes, and full provenance trees in a single tool call. The server is published
                in the Official MCP Registry as{' '}
                <span className="font-mono text-electric-blue">io.github.AnchorRegistry/ar-mcp</span>{' '}
                and listed on Smithery.
              </Prose>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">Tools (v0.1)</h3>
              <div className="mb-6 overflow-hidden rounded-md border border-[#2E4270]">
                {[
                  {
                    name: 'ar_verify_arid',
                    desc: 'Resolve an AR-ID to its full provenance record. Use when an SPDX-Anchor or DAPX-Anchor tag is encountered in a README, paper, model card, or website.',
                    input: 'ar_id (e.g. AR-2026-qnPOJ1z)',
                  },
                  {
                    name: 'ar_verify_by_hash',
                    desc: 'Resolve an artifact by SHA-256 manifest hash. Use when the artifact is in hand but no AR-ID is known.',
                    input: 'manifest_hash (64-char hex, no 0x prefix)',
                  },
                  {
                    name: 'ar_resolve_tree',
                    desc: 'Resolve the full provenance tree for any AR-ID — root anchor plus all descendants with relationships, types, manifest hashes, and timestamps.',
                    input: 'ar_id (any anchor in the tree)',
                  },
                ].map((tool, i, arr) => (
                  <div key={tool.name} className={`px-4 py-4 ${i < arr.length - 1 ? 'border-b border-[#2E4270]' : ''}`}>
                    <div className="mb-1.5 font-mono text-[13px] font-medium text-electric-blue">{tool.name}</div>
                    <p className="mb-2 text-[13px] leading-[1.6] text-muted-slate">{tool.desc}</p>
                    <p className="font-mono text-[11px] text-muted-slate">
                      <span className="text-gold">input:</span> {tool.input}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-[1.6] text-muted-slate">
                All three tools are read-only and authless — no API key, no anchor key, no rate
                limit beyond defaults. Free to use. Future versions will add registration,
                balance lookup, and seal tools once the MCP credential pattern stabilizes.
              </p>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">Install</h3>

              <CopyCodeBlock label="Claude Code">
{`claude mcp add --transport http anchorregistry https://mcp.anchorregistry.ai/mcp`}
              </CopyCodeBlock>

              <div className="mt-4">
                <CopyCodeBlock label="Claude Desktop, Cursor, VS Code, Windsurf">
{`{
  "mcpServers": {
    "anchorregistry": {
      "type": "http",
      "url":  "https://mcp.anchorregistry.ai/mcp"
    }
  }
}`}
                </CopyCodeBlock>
              </div>

              <p className="mt-4 text-[13px] leading-[1.7] text-muted-slate">
                For Claude Desktop and Cursor, add via Settings → Connectors / MCP → Add custom
                connector with URL{' '}
                <span className="font-mono text-electric-blue">https://mcp.anchorregistry.ai/mcp</span>.
                For testing without an installed client, use the{' '}
                <a
                  href="https://github.com/modelcontextprotocol/inspector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  MCP Inspector
                </a>{' '}
                — a browser-based tool that connects to any MCP server URL and exercises its
                tools interactively.
              </p>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">Try it</h3>
              <Prose className="mb-4">
                Once installed, ask any MCP-aware AI client a question that requires
                provenance lookup. The agent will discover and call the appropriate
                AnchorRegistry tool automatically.
              </Prose>
              <div className="rounded-md border border-[#2E4270] bg-surface px-4 py-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
                  Example prompt
                </div>
                <p className="text-[13px] leading-[1.7] text-muted-slate">
                  &ldquo;Look at{' '}
                  <span className="font-mono text-electric-blue break-all">
                    https://github.com/AnchorRegistry/ar-contracts-v1
                  </span>
                  {' '}— find any AR-ID in the README and resolve it.&rdquo;
                </p>
              </div>
              <p className="mt-4 text-[13px] leading-[1.7] text-muted-slate">
                The agent fetches the repo, finds the SPDX-Anchor tag, calls{' '}
                <span className="font-mono text-electric-blue">ar_verify_arid</span>, and
                returns the full provenance record — title, author, type, manifest hash,
                registrant address, transaction hash, block number, anchored timestamp,
                and seal status.
              </p>

              <h3 className="mb-3 mt-8 text-[15px] font-medium text-off-white">Transport</h3>
              <Prose>
                Streamable HTTP at{' '}
                <span className="font-mono text-electric-blue">/mcp</span>{' '}
                (canonical, recommended). Legacy SSE at{' '}
                <span className="font-mono text-electric-blue">/sse</span>{' '}
                for older clients. Both transports proxy to the same Cloudflare Worker
                deployment — a thin pass-through over the AnchorRegistry verify endpoints.
                Source under MIT at{' '}
                <a
                  href="https://github.com/AnchorRegistry/ar-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  github.com/AnchorRegistry/ar-mcp
                </a>.
              </Prose>
            </section>

            <Divider />

            {/* ── §7 Python Package ───────────────────────────────────────── */}
            <section id="python">
              <SectionLabel>§7 · Python Package</SectionLabel>
              <SectionHeading>Read the registry directly from Base</SectionHeading>
              <Prose className="mb-6">
                <span className="text-off-white">No API key. No account. No dependency on
                AnchorRegistry infrastructure.</span>{' '}
                Just an RPC endpoint and the contract address. The{' '}
                <span className="font-mono text-electric-blue">anchorregistry</span> Python
                package reads on-chain event logs directly — trustless by construction. If
                anchorregistry.com goes offline tomorrow, every anchor remains queryable
                with this package and any Ethereum RPC provider.
              </Prose>

              <CopyCodeBlock label="Install">
{`pip install anchorregistry`}
              </CopyCodeBlock>

              <div className="mt-4">
                <CopyCodeBlock label="Configure for Base mainnet (default)">
{`from anchorregistry import configure

configure(network="base")`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Look up an anchor by AR-ID">
{`from anchorregistry import get_by_arid

record = get_by_arid("AR-2026-x1llnO1")
print(record["artifact_type_name"])   # CODE
print(record["manifest_hash"])        # sha256 of the artifact
print(record["contract_address"])     # which deployment holds it`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Authenticate a full provenance tree">
{`from anchorregistry import authenticate_tree

result = authenticate_tree(
    ownership_token="0x1a2b3c...",
    root_ar_id="AR-2026-x1llnO1",
)
print(result["authenticated"])      # True
print(result["anchors_verified"])   # 3
print(result["anchors_failed"])     # 0`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Verify an anchor + check file integrity">
{`from anchorregistry import verify

result = verify("AR-2026-x1llnO1", file_path="./my_artifact.py")
print(result["verified"])     # True
print(result["hash_match"])   # True`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Generate the correct embed tag">
{`from anchorregistry import watermark

tag = watermark("AR-2026-x1llnO1")
# "SPDX-Anchor: anchorregistry.ai/AR-2026-x1llnO1"`}
                </CopyCodeBlock>
              </div>

              <div className="mt-4">
                <CopyCodeBlock label="Check if a tree is sealed">
{`from anchorregistry import is_sealed

status = is_sealed("AR-2026-x1llnO1")
print(status["sealed"])         # True
print(status["continuation"])   # AR-2026-YYYYYYY`}
                </CopyCodeBlock>
              </div>

              <p className="mt-6 text-[13px] leading-[1.7] text-muted-slate">
                Full documentation:{' '}
                <a
                  href="https://anchorregistry.readthedocs.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  anchorregistry.readthedocs.io
                </a>
              </p>
            </section>

            <div className="mt-16 rounded-lg border border-[#2E4270] bg-surface px-6 py-5">
              <div className="mb-1 text-[14px] font-medium text-off-white">Need more?</div>
              <p className="text-[13px] leading-[1.65] text-muted-slate">
                Full API surface is listed at{' '}
                <a
                  href="https://api.anchorregistry.ai/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  api.anchorregistry.ai/docs
                </a>
                . Source for the Python client lives at{' '}
                <a
                  href="https://github.com/anchorregistry/ar-python"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  github.com/anchorregistry/ar-python
                </a>
                . Questions: <a href="mailto:support@anchorregistry.com" className="text-electric-blue hover:underline">support@anchorregistry.com</a>.
              </p>
            </div>

          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
