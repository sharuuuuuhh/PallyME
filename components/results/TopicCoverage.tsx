'use client'

import ModuleBadge from '@/components/shared/ModuleBadge'
import type { CoverageGap } from '@/types'

const LEVEL_CONFIG = {
  full: { label: 'Covered', color: 'var(--blueprint-300)', bg: 'rgba(111,227,214,0.1)', pct: 100 },
  partial: { label: 'Partial', color: 'var(--brass-400)', bg: 'rgba(217,164,65,0.1)', pct: 50 },
  none: { label: 'Missing', color: 'var(--coral-500)', bg: 'rgba(255,107,87,0.1)', pct: 5 },
}

function CoverageRow({ gap }: { gap: CoverageGap }) {
  const cfg = LEVEL_CONFIG[gap.coverageLevel]

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        border: `1px solid ${cfg.color}30`,
        background: cfg.bg,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--paper-100)',
            margin: 0,
            flex: 1,
          }}
        >
          {gap.topic}
        </p>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: cfg.color,
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}30`,
            borderRadius: 4,
            padding: '2px 8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: gap.note ? 8 : 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${cfg.pct}%`,
            background: cfg.color,
            borderRadius: 2,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {gap.note && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--muted-300)',
            margin: 0,
          }}
        >
          {gap.note}
        </p>
      )}
    </div>
  )
}

export default function TopicCoverage({ gaps }: { gaps: CoverageGap[] }) {
  if (!gaps.length) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--blueprint-300)',
          fontFamily: 'var(--font-body)',
        }}
      >
        🎉 Looks like your notes cover the entire syllabus. Nicely done.
      </div>
    )
  }

  // Group by module
  const byModule = gaps.reduce<Record<string, CoverageGap[]>>((acc, g) => {
    if (!acc[g.moduleId]) acc[g.moduleId] = []
    acc[g.moduleId].push(g)
    return acc
  }, {})

  const noneCount = gaps.filter((g) => g.coverageLevel === 'none').length
  const partialCount = gaps.filter((g) => g.coverageLevel === 'partial').length

  return (
    <div>
      {/* Summary banner */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}
      >
        {noneCount > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,107,87,0.25)',
              background: 'rgba(255,107,87,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--coral-500)',
                  margin: 0,
                }}
              >
                {noneCount}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--muted-300)',
                  margin: 0,
                }}
              >
                topics not in your notes
              </p>
            </div>
          </div>
        )}
        {partialCount > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid rgba(217,164,65,0.25)',
              background: 'rgba(217,164,65,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>📝</span>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--brass-400)',
                  margin: 0,
                }}
              >
                {partialCount}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--muted-300)',
                  margin: 0,
                }}
              >
                topics partially covered
              </p>
            </div>
          </div>
        )}
      </div>

      {/* By module */}
      {Object.entries(byModule).map(([moduleId, moduleGaps]) => (
        <div key={moduleId} style={{ marginBottom: 28 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}
          >
            <ModuleBadge id={moduleId} />
            <div
              style={{ width: 20, height: 1, background: 'rgba(217,164,65,0.3)' }}
              aria-hidden
            />
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--paper-100)',
                margin: 0,
              }}
            >
              {moduleGaps[0].moduleTitle}
            </h3>
          </div>
          {moduleGaps.map((gap, i) => (
            <CoverageRow key={i} gap={gap} />
          ))}
        </div>
      ))}
    </div>
  )
}
