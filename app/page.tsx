import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AnchorRegistry™ — Prove you made it first.',
}

const STEPS = [
  {
    num:   '01',
    title: 'Drop your file',
    body:  'Any artifact — code, paper, dataset, model. Hashed client-side. Never uploaded.',
  },
  {
    num:   '02',
    title: 'Fill the manifest',
    body:  'Title, author, license, artifact type. The manifest becomes your fingerprint.',
  },
  {
    num:   '03',
    title: 'Pay $5',
    body:  'One payment via Stripe. No subscription. No renewal. Permanent record.',
  },
  {
    num:   '04',
    title: 'Get your AR-ID',
    body:  'Share anchorregistry.ai/AR-ID as proof. Verifiable by anyone, including AI agents.',
  },
]

const STATS = [
  { value: '$5',      label: 'Per Anchor'       },
  { value: 'Forever', label: 'Record Lifetime'  },
  { value: 'Base L2', label: 'Ethereum Mainnet' },
  { value: '11',      label: 'Artifact Types'   },
]

export default function Home() {
  return (
    <>
      <Nav />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="px-8 pb-[72px] pt-20">
          <div className="mx-auto max-w-[960px]">
            <p
              className="animate-fade-up mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-slate"
              style={{ animationDelay: '0.05s' }}
            >
              Immutable Provenance Infrastructure
            </p>
            <h1
              className="animate-fade-up mb-5 max-w-[580px] text-[52px] font-semibold leading-[1.08] tracking-tight text-off-white"
              style={{ animationDelay: '0.12s' }}
            >
              Prove you made it<br />
              <span className="text-gold">first.</span>
            </h1>
            <p
              className="animate-fade-up mb-9 max-w-[420px] text-[17px] font-light leading-[1.65] text-muted-slate"
              style={{ animationDelay: '0.2s' }}
            >
              Register any digital artifact — code, research, data, models — and
              receive permanent, on-chain proof of authorship. One payment. No
              expiry. Verifiable by any human or AI, forever.
            </p>
            <div
              className="animate-fade-up flex items-center gap-3"
              style={{ animationDelay: '0.28s' }}
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded bg-gold px-5 py-2.5 text-[14px] font-semibold text-deep-navy transition-all hover:bg-[#FBBF24] active:scale-[0.98]"
              >
                Register an artifact →
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center rounded border border-[#2E4270] px-5 py-2.5 text-[14px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
              >
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
                <div
                  key={i}
                  className={`py-7 ${i < 3 ? 'border-r border-[#2E4270]' : ''}`}
                >
                  <div className="mb-1 text-[24px] font-semibold tracking-tight">
                    {s.value}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="px-8 py-20">
          <div className="mx-auto max-w-[960px]">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              How it works
            </p>
            <h2 className="mb-8 text-[28px] font-semibold tracking-tight text-off-white">
              Four steps to permanent proof
            </h2>
            <div className="grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-[#2E4270] bg-[#2E4270]">
              {STEPS.map((s) => (
                <div key={s.num} className="bg-surface px-5 py-6">
                  <div className="mb-3.5 font-mono text-[11px] tracking-[0.05em] text-gold">
                    {s.num}
                  </div>
                  <div className="mb-2 text-[14px] font-medium text-off-white">
                    {s.title}
                  </div>
                  <p className="text-[13px] leading-[1.55] text-muted-slate">
                    {s.body}
                  </p>
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

              {/* Anchor card */}
              <div className="rounded-lg border border-[#2E4270] bg-surface p-6">
                <div className="mb-2 font-mono text-[11px] text-muted-slate">
                  AR-2026-K7X9M2P
                </div>
                <div className="mb-1.5 text-[18px] font-semibold">
                  AnchorRegistry Smart Contract v1
                </div>
                <div className="mb-4 text-[13px] text-muted-slate">
                  Ian Moore · March 12, 2026 · Base mainnet · block 22,041,887
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

              {/* Explainer */}
              <div className="pt-2">
                <p className="mb-5 text-[15px] leading-[1.65] text-muted-slate">
                  Every registered artifact gets a permanent verify URL. Embed it
                  anywhere — a README, paper footer, model card. Any human or AI
                  that encounters it can resolve the full provenance record.
                </p>
                <div className="mb-3 rounded-md border border-[#2E4270] bg-surface px-4 py-3.5">
                  <div className="mb-1 font-mono text-[12px] text-muted-slate"># README</div>
                  <div className="font-mono text-[12px] text-electric-blue">
                    SPDX-Anchor: anchorregistry.ai/AR-2026-K7X9M2P
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
                      anchorregistry.ai/AR-2026-K7X9M2P
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Quote strip ──────────────────────────────────────────── */}
        <div className="border-b border-t border-[#2E4270] py-12">
          <div className="mx-auto max-w-[960px] px-8 text-center">
            <p className="mx-auto max-w-[560px] text-[17px] leading-[1.6] text-muted-slate">
              The thing that inspired this product —<br />
              ChatGPT recommending SPDX identifiers — becomes a user of it.
            </p>
          </div>
        </div>

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <section id="pricing" className="px-8 py-20">
          <div className="mx-auto max-w-[960px]">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Pricing
            </p>
            <h2 className="mb-8 text-[28px] font-semibold tracking-tight text-off-white">
              Simple, permanent, no surprises
            </h2>
            <div className="grid max-w-[720px] grid-cols-3 gap-4">

              {/* Proof */}
              <div className="rounded-lg border border-electric-blue bg-surface p-6">
                <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
                  Proof
                </div>
                <div className="mb-2 text-[36px] font-semibold tracking-tight">$5</div>
                <p className="mb-5 min-h-[52px] text-[13px] leading-[1.55] text-muted-slate">
                  1 anchor. SHA-256 manifest hash on Base mainnet. AR-ID. Permanent verify URL.
                </p>
                <Link
                  href="/register?tier=proof"
                  className="block rounded border border-electric-blue bg-electric-blue px-0 py-2.5 text-center text-[13px] font-medium text-off-white transition-colors hover:bg-blue-600"
                >
                  Register now →
                </Link>
              </div>

              {/* Pack */}
              <div className="rounded-lg border border-electric-blue bg-surface p-6">
                <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
                  Pack
                </div>
                <div className="mb-2 text-[36px] font-semibold tracking-tight">$12</div>
                <p className="mb-5 min-h-[52px] text-[13px] leading-[1.55] text-muted-slate">
                  3 anchors. Same proof guarantee per anchor. 20% discount vs individual.
                </p>
                <Link
                  href="/register?tier=pack"
                  className="block rounded border border-electric-blue bg-electric-blue px-0 py-2.5 text-center text-[13px] font-medium text-off-white transition-colors hover:bg-blue-600"
                >
                  Register pack →
                </Link>
              </div>

              {/* Bundle */}
              <div className="rounded-lg border border-[#2E4270] bg-surface p-6">
                <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-slate">
                  Bundle
                </div>
                <div className="mb-2 text-[36px] font-semibold tracking-tight">$30</div>
                <p className="mb-5 min-h-[52px] text-[13px] leading-[1.55] text-muted-slate">
                  10 anchors as a single tree or corpus. 40% discount vs individual.
                </p>
                <Link
                  href="/register?tier=bundle"
                  className="block rounded border border-[#2E4270] px-0 py-2.5 text-center text-[13px] font-medium text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
                >
                  Register bundle →
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
