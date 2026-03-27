'use client'

import Link from 'next/link'
import { type AnchorRecord } from '@/lib/api'

interface TypeColor {
  bg: string; text: string; border: string
}

interface Props {
  anchor:      AnchorRecord
  typeColors:  Record<string, TypeColor>
}

function TreeNode({
  arId,
  parentLabel,
  artifactType,
  layer,
  isCurrent,
  typeColors,
}: {
  arId:         string
  parentLabel:  string
  artifactType: string
  layer:        number
  isCurrent:    boolean
  typeColors:   Record<string, TypeColor>
}) {
  const c = typeColors[artifactType] ?? typeColors.OTHER

  const inner = (
    <div
      className="rounded border px-3 py-2.5 transition-all"
      style={{
        background:  isCurrent ? c.bg     : 'transparent',
        borderColor: isCurrent ? c.border : '#2E4270',
        opacity:     1,
      }}
    >
      <div className="font-mono text-[10px] text-muted-slate mb-0.5">{parentLabel}</div>
      <div
        className="text-[12px] font-medium truncate"
        style={{ color: isCurrent ? c.text : '#F0F4FF' }}
      >
        {arId}
      </div>
      <div
        className="font-mono text-[10px] mt-0.5"
        style={{ color: c.text, opacity: 0.8 }}
      >
        {artifactType} &middot; Layer {layer}
      </div>
    </div>
  )

  if (isCurrent) return inner

  return (
    <Link href={`/verify/${arId}`} className="block hover:opacity-80 transition-opacity">
      {inner}
    </Link>
  )
}

function Connector() {
  return (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div className="h-3 w-px bg-[#2E4270]" />
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
          <path d="M4 5L0 0H8L4 5Z" fill="#2E4270" />
        </svg>
      </div>
    </div>
  )
}

export default function ArtifactTree({ anchor, typeColors }: Props) {
  const hasParent   = !!anchor.parent_hash
  const hasChildren = anchor.children && anchor.children.length > 0
  const currentDepth = anchor.depth ?? 0
  const parentDepth  = currentDepth > 0 ? currentDepth - 1 : 0

  if (!hasParent && !hasChildren) {
    return (
      <div className="rounded-lg border border-[#2E4270] bg-surface p-5">
        <TreeNode
          arId={anchor.ar_id}
          parentLabel="Base Node"
          artifactType={anchor.artifact_type}
          layer={currentDepth}
          isCurrent={true}
          typeColors={typeColors}
        />
        <p className="mt-4 font-mono text-[10px] text-muted-slate">
          Root artifact — no parent or derivatives registered yet.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-[#2E4270] bg-surface p-5">

      {/* Parent */}
      {hasParent && (
        <>
          <TreeNode
            arId={anchor.parent_hash!}
            parentLabel={parentDepth === 0 ? 'Base Node' : `Layer ${parentDepth}`}
            artifactType={anchor.parent_type ?? 'OTHER'}
            layer={parentDepth}
            isCurrent={false}
            typeColors={typeColors}
          />
          <Connector />
        </>
      )}

      {/* Current */}
      <TreeNode
        arId={anchor.ar_id}
        parentLabel={hasParent ? `Parent: ${anchor.parent_hash}` : 'Base Node'}
        artifactType={anchor.artifact_type}
        layer={currentDepth}
        isCurrent={true}
        typeColors={typeColors}
      />

      {/* Children */}
      {hasChildren && (
        <>
          <Connector />
          <div className="space-y-2">
            {anchor.children!.map((child) => {
              const childId    = typeof child === 'string' ? child : child.ar_id
              const childType  = typeof child === 'string' ? 'OTHER' : child.artifact_type
              const childDepth = typeof child === 'string' ? currentDepth + 1 : (child.depth ?? currentDepth + 1)
              return (
                <TreeNode
                  key={childId}
                  arId={childId}
                  parentLabel={`Parent: ${anchor.ar_id}`}
                  artifactType={childType}
                  layer={childDepth}
                  isCurrent={false}
                  typeColors={typeColors}
                />
              )
            })}
          </div>
          {anchor.children!.length > 0 && (
            <p className="mt-3 font-mono text-[10px] text-muted-slate">
              {anchor.children!.length} derivative{anchor.children!.length > 1 ? 's' : ''} registered
            </p>
          )}
        </>
      )}

    </div>
  )
}
