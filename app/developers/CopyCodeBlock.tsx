'use client'

import { useState } from 'react'

/**
 * Code block with a copy-to-clipboard button in the header. Visually matches
 * the static `<CodeBlock>` used on /docs — dark-navy background, thin border,
 * label in a monospace muted header.
 */
export default function CopyCodeBlock({
  children,
  label,
}: {
  children: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* no-op — insecure context or clipboard API unavailable */
    }
  }

  return (
    <div className="rounded-md border border-[#2E4270] bg-[#0d1829]">
      <div className="flex items-center justify-between border-b border-[#2E4270] px-4 py-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-slate">
          {label ?? 'shell'}
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded border border-[#2E4270] px-2 py-1 font-mono text-[10px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white"
          aria-label="Copy to clipboard"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-relaxed text-electric-blue">
        {children}
      </pre>
    </div>
  )
}
