import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Register — AnchorRegistry™',
  description: 'Register your digital artifact and receive permanent, on-chain proof of authorship.',
}

export default function Register() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[60vh] items-center justify-center px-8">
        <div className="text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
            Coming soon
          </p>
          <h1 className="mb-4 text-[32px] font-semibold tracking-tight">
            Register an artifact
          </h1>
          <p className="text-[15px] text-muted-slate">
            Registration UI is being built. Check back shortly.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
