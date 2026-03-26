'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getNetworkNameClient } from '@/lib/network.client'

type Status = 'polling' | 'confirmed' | 'error'

export default function SuccessContent() {
  const searchParams             = useSearchParams()
  const sessionId                = searchParams.get('session_id')
  const [status, setStatus]      = useState<Status>('polling')
  const [arId, setArId]          = useState<string>('')
  const [attempts, setAttempts]  = useState(0)
  const MAX_ATTEMPTS             = 24  // 24 × 5s = 2 minutes

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    const poll = async () => {
      try {
        const res = await fetch(`/api/registration-status?session_id=${sessionId}`)
        const data = await res.json()

        if (data.status === 'confirmed' && data.ar_id) {
          setArId(data.ar_id)
          setStatus('confirmed')
          return
        }

        if (data.status === 'failed') {
          setStatus('error')
          return
        }

        // Still pending — keep polling
        setAttempts(a => {
          const next = a + 1
          if (next >= MAX_ATTEMPTS) {
            setStatus('error')
          }
          return next
        })
      } catch {
        setAttempts(a => a + 1)
      }
    }

    if (status === 'polling') {
      poll() // immediate first check
      const interval = setInterval(() => {
        if (status !== 'polling') { clearInterval(interval); return }
        poll()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [sessionId, status])

  if (status === 'polling') {
    return (
      <div className="w-full max-w-[480px] text-center">
        <div className="mb-5 text-[40px]">⚓</div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
          Anchoring on-chain
        </p>
        <h1 className="mb-4 text-[24px] font-semibold tracking-tight text-off-white">
          Writing to {getNetworkNameClient()}…
        </h1>
        <p className="text-[14px] text-muted-slate">
          Your artifact is being anchored. This usually takes 10–30 seconds.
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-muted-slate/40"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.3); }
          }
        `}</style>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="w-full max-w-[480px] text-center">
        <div className="mb-5 text-[40px]">⚓</div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
          Something went wrong
        </p>
        <h1 className="mb-4 text-[24px] font-semibold tracking-tight text-off-white">
          Registration delayed
        </h1>
        <p className="mb-6 text-[14px] text-muted-slate">
          Your payment was received but on-chain confirmation is taking longer than expected.
          Your artifact will be anchored — check back shortly or contact support.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded border border-[#2E4270] px-5 py-2.5 text-[14px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
        >
          Back to home
        </Link>
      </div>
    )
  }

  // Confirmed
  const verifyUrl = `https://anchorregistry.ai/${arId}`

  return (
    <div className="w-full max-w-[480px]">

      {/* Confirmed header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/15">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12L9 17L20 6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
          Anchored on-chain
        </p>
        <h1 className="text-[28px] font-semibold tracking-tight text-off-white">
          Your artifact is permanent.
        </h1>
      </div>

      {/* AR-ID card */}
      <div className="mb-4 rounded-lg border border-gold/30 bg-surface p-5">
        <div className="mb-1 font-mono text-[11px] text-muted-slate">Your AR-ID</div>
        <div className="mb-4 font-mono text-[22px] font-medium text-gold">{arId}</div>
        <div className="mb-4 font-mono text-[12px] text-electric-blue">{verifyUrl}</div>
        <button
          onClick={() => navigator.clipboard.writeText(verifyUrl)}
          className="w-full rounded border border-[#2E4270] py-2.5 text-[13px] font-medium text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
        >
          Copy verify URL
        </button>
      </div>

      {/* Embed tag */}
      <div className="mb-4 rounded-lg border border-[#2E4270] bg-surface p-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
          Embed in your artifact
        </div>
        <div className="font-mono text-[12px] text-electric-blue">
          SPDX-Anchor: {verifyUrl}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/verify/${arId}`}
          className="flex-1 rounded bg-electric-blue py-2.5 text-center text-[14px] font-medium text-off-white transition-colors hover:bg-blue-600"
        >
          View provenance record
        </Link>
        <Link
          href="/register"
          className="flex-1 rounded border border-[#2E4270] py-2.5 text-center text-[14px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
        >
          Register another
        </Link>
      </div>

    </div>
  )
}
