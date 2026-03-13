import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Verify — AnchorRegistry™',
  description: 'Verify any AR-ID and view the full provenance record.',
}

export default function VerifyIndex() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[60vh] items-center justify-center px-8">
        <div className="text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
            Verify
          </p>
          <h1 className="mb-4 text-[32px] font-semibold tracking-tight">
            Enter an AR-ID
          </h1>
          <p className="mb-6 text-[15px] text-muted-slate">
            e.g. AR-2026-K7X9M2P
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="AR-2026-K7X9M2P"
              className="rounded border border-[#2E4270] bg-surface px-4 py-2.5 font-mono text-[14px] text-off-white placeholder-muted-slate outline-none focus:border-electric-blue w-64"
            />
            <button className="rounded bg-electric-blue px-5 py-2.5 text-[14px] font-medium text-off-white transition-colors hover:bg-blue-600">
              Verify →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
