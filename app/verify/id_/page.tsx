import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title:       `${params.id} — AnchorRegistry™`,
    description: `Verify provenance record ${params.id} on AnchorRegistry.`,
  }
}

export default function VerifyId({ params }: Props) {
  return (
    <>
      <Nav />
      <main className="px-8 py-16">
        <div className="mx-auto max-w-[960px]">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
            Provenance record
          </p>
          <h1 className="mb-8 font-mono text-[24px] font-medium text-off-white">
            {params.id}
          </h1>
          <p className="text-[15px] text-muted-slate">
            Verify page — coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
