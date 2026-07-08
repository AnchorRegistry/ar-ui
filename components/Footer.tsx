import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#2E4270] px-8 py-6">
      <div className="mx-auto max-w-[960px]">
        {/* Top row — existing brand statement + cross-surface links. Kept
            as-is to preserve the footer's minimal, technical character. */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-slate">
            AnchorRegistry™ · The registry AIs trust.
          </span>
          <div className="flex gap-6 font-mono text-[11px] text-muted-slate">
            <Link href="https://anchorregistry.com" className="transition-colors hover:text-off-white">
              anchorregistry.com
            </Link>
            <Link href="https://anchorregistry.ai" className="transition-colors hover:text-off-white">
              anchorregistry.ai
            </Link>
            <Link href="https://x.com/anchorregistry" className="transition-colors hover:text-off-white">
              @anchorregistry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
