'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function VerifyIndex() {
  const [arId, setArId] = useState('')
  const router = useRouter()

  const handleVerify = () => {
    const trimmed = arId.trim()
    if (trimmed) router.push(`/verify/${trimmed}`)
  }

  return (
    <>
      <Nav />
      <main className="flex min-h-[60vh] items-center justify-center px-8">
        <div className="text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
            Verify
          </p>
          <h1 className="mb-4 text-[32px] font-semibold tracking-tight text-off-white">
            Enter an AR-ID
          </h1>
          <p className="mb-6 text-[15px] text-muted-slate">
            e.g. AR-2026-K7X9M2P
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); handleVerify() }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={arId}
              onChange={(e) => setArId(e.target.value)}
              placeholder="AR-2026-K7X9M2P"
              className="rounded border border-[#2E4270] bg-surface px-4 py-2.5 font-mono text-[14px] text-off-white placeholder-muted-slate outline-none focus:border-electric-blue w-64"
            />
            <button
              type="submit"
              className="rounded bg-electric-blue px-5 py-2.5 text-[14px] font-medium text-off-white transition-colors hover:bg-blue-600"
            >
              Verify →
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
