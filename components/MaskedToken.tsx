'use client'

import { useState } from 'react'

/** Inline eye / eye-off toggle button for token visibility. */
export function TokenToggleButton({ visible, onToggle, className = '' }: {
  visible: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`shrink-0 rounded border border-[#2E4270] px-2 py-1 font-mono text-[10px] text-muted-slate transition-all hover:border-muted-slate hover:text-off-white ${className}`}
      aria-label={visible ? 'Hide token' : 'Show token'}
    >
      {visible ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  )
}

/** Hook to manage token visibility state. */
export function useTokenVisibility() {
  const [visible, setVisible] = useState(false)
  return { visible, toggle: () => setVisible(v => !v) }
}

/** Renders token text as masked or visible. */
export default function MaskedToken({ token, visible }: { token: string; visible: boolean }) {
  return <>{visible ? token : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}</>
}
