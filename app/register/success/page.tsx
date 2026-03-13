import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SuccessContent from './SuccessContent'

export default function RegisterSuccess() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[70vh] items-center justify-center px-8 py-16">
        <Suspense fallback={<SuccessSkeleton />}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function SuccessSkeleton() {
  return (
    <div className="w-full max-w-[480px] text-center">
      <div className="mb-4 text-[32px]">⚓</div>
      <p className="font-mono text-[12px] text-muted-slate">Confirming registration…</p>
    </div>
  )
}
