import Link from 'next/link'
import { type AnchorRecord } from '@/lib/api'

interface TypeColor {
  bg: string; text: string; border: string
}

const TYPE_COLORS: Record<string, TypeColor> = {
  // CONTENT (0-8)
  CODE:     { bg: 'rgba(59,130,246,0.1)',  text: '#3B82F6', border: 'rgba(59,130,246,0.3)'  },
  RESEARCH: { bg: 'rgba(168,85,247,0.1)',  text: '#A855F7', border: 'rgba(168,85,247,0.3)'  },
  DATA:     { bg: 'rgba(20,184,166,0.1)',  text: '#14B8A6', border: 'rgba(20,184,166,0.3)'  },
  MODEL:    { bg: 'rgba(245,158,11,0.1)',  text: '#F59E0B', border: 'rgba(245,158,11,0.3)'  },
  AGENT:    { bg: 'rgba(239,68,68,0.1)',   text: '#EF4444', border: 'rgba(239,68,68,0.3)'   },
  MEDIA:    { bg: 'rgba(236,72,153,0.1)',  text: '#EC4899', border: 'rgba(236,72,153,0.3)'  },
  TEXT:     { bg: 'rgba(132,204,22,0.1)',  text: '#84CC16', border: 'rgba(132,204,22,0.3)'  },
  POST:     { bg: 'rgba(251,191,36,0.1)',  text: '#FBBF24', border: 'rgba(251,191,36,0.3)'  },
  ONCHAIN:  { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1', border: 'rgba(99,102,241,0.3)'  },
  // LIFECYCLE (9)
  EVENT:    { bg: 'rgba(234,179,8,0.1)',   text: '#EAB308', border: 'rgba(234,179,8,0.3)'   },
  // TRANSACTION (10)
  RECEIPT:  { bg: 'rgba(34,197,94,0.1)',   text: '#22C55E', border: 'rgba(34,197,94,0.3)'   },
  // GATED (11-13)
  LEGAL:    { bg: 'rgba(156,163,175,0.1)', text: '#9CA3AF', border: 'rgba(156,163,175,0.3)' },
  ENTITY:   { bg: 'rgba(251,146,60,0.1)',  text: '#FB923C', border: 'rgba(251,146,60,0.3)'  },
  PROOF:    { bg: 'rgba(52,211,153,0.1)',  text: '#34D399', border: 'rgba(52,211,153,0.3)'  },
  // CONTENT additions
  REPORT:   { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1', border: 'rgba(99,102,241,0.3)'  },
  NOTE:     { bg: 'rgba(156,163,175,0.1)', text: '#9CA3AF', border: 'rgba(156,163,175,0.3)' },
  // CATCH-ALL (20)
  OTHER:    { bg: 'rgba(123,147,196,0.1)', text: '#7B93C4', border: 'rgba(123,147,196,0.3)' },
}

interface Props {
  anchor: AnchorRecord
}

function TreeNode({
  arId,
  parentLabel,
  artifactType,
  layer,
  isCurrent,
  title,
}: {
  arId:         string
  parentLabel:  string
  artifactType: string
  layer:        number
  isCurrent:    boolean
  title?:       string
}) {
  const c = TYPE_COLORS[artifactType] ?? TYPE_COLORS.OTHER

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
      {title && (
        <div className="text-[10px] text-[#F0F4FF] opacity-70 mb-0.5 truncate">Title: {title}</div>
      )}
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
        {artifactType} &middot; Tree Layer {layer}
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

export default function ArtifactTree({ anchor }: Props) {
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
          title={anchor.title}
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
            title={anchor.parent_title}
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
        title={anchor.title}
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
                  title={typeof child === 'string' ? undefined : child.title}
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
