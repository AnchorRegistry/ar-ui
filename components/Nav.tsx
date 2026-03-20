'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2E4270] bg-[#152038]">
      <div className="mx-auto flex h-[72px] max-w-[960px] items-center justify-between px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image src="/anchor.png" alt="AnchorRegistry anchor" width={36} height={36} />
          <span className="text-[30px] font-semibold tracking-tight">
            <span className="text-off-white">Anchor</span>
            <span className="text-electric-blue">Registry</span>
            <span className="text-muted-slate align-super text-[13px] font-normal">™</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          <li>
            <Link href="/#four-steps" className="text-[13px] text-muted-slate transition-colors hover:text-off-white">
              Anchoring
            </Link>
          </li>
          <li>
            <Link href="/tree" className="text-[13px] text-muted-slate transition-colors hover:text-off-white">
              How it works
            </Link>
          </li>
          <li>
            <Link href="/verify" className="text-[13px] text-muted-slate transition-colors hover:text-off-white">
              Verify
            </Link>
          </li>
          <li>
            <Link href="/#pricing" className="text-[13px] text-muted-slate transition-colors hover:text-off-white">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/docs" className="text-[13px] text-muted-slate transition-colors hover:text-off-white">
              Docs
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="rounded border border-[#2E4270] px-4 py-1.5 text-[13px] font-medium text-off-white transition-all hover:border-electric-blue hover:bg-electric-blue/10"
            >
              Register →
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block h-px w-5 bg-muted-slate" />
          <span className="block h-px w-5 bg-muted-slate" />
          <span className="block h-px w-5 bg-muted-slate" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[#2E4270] bg-[#152038] px-8 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {['/#four-steps', '/tree', '/verify', '/#pricing', '/docs'].map((href, i) => (
              <li key={i}>
                <Link href={href} className="text-[14px] text-muted-slate" onClick={() => setMenuOpen(false)}>
                  {['Anchoring', 'How it works', 'Verify', 'Pricing', 'Docs'][i]}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/register" className="text-[14px] font-medium text-electric-blue">
                Register →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
