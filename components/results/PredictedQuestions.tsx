'use client'

import HighYieldTag from '@/components/shared/HighYieldTag'
import ModuleBadge from '@/components/shared/ModuleBadge'
import type { PredictedQuestion } from '@/types'

function FrequencyBar({
  frequency,
  total,
}: {
  frequency: number
  total: number
}) {
  const pct = Math.round((frequency / total) * 100)
  const isHigh = pct >= 60

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: 'rgba(111,227,214,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: isHigh
              ? 'var(--coral-500)'
              : 'var(--blueprint-300)',
            borderRadius: 2,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: isHigh ? 'var(--coral-400)' : 'var(--muted-300)',
          minWidth: 48,
          textAlign: 'right',
        }}
      >
        {frequency}/{total} papers
      </span>
    </div>
  )
}

function QuestionCard({ q }: { q: PredictedQuestion }) {
  const isHigh = q.frequency / q.totalPapers >= 0.6

  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: 10,
        border: `1px solid ${
          isHigh ? 'rgba(255,107,87,0.2)' : 'rgba(111,227,214,0.1)'
        }`,
        background: isHigh
          ? 'rgba(255,107,87,0.04)'
          : 'rgba(19,26,43,0.4)',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(111,227,214,0.08)',
              border: '1px solid rgba(111,227,214,0.15)',
              color: 'var(--blueprint-300)',
            }}
          >
            PT.{q.part}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(217,164,65,0.08)',
              border: '1px solid rgba(217,164,65,0.15)',
              color: 'var(--brass-400)',
            }}
          >
            {q.marks} MARKS
          </span>
        </div>
        {isHigh && (
          <HighYieldTag frequency={q.frequency} totalPapers={q.totalPapers} />
        )}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--paper-100)',
          lineHeight: 1.55,
          margin: '0 0 10px',
        }}
      >
        {q.question}
      </p>

      <FrequencyBar frequency={q.frequency} total={q.totalPapers} />

      {q.years.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {q.years.map((y) => (
            <span
              key={y}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--muted-400)',
                background: 'rgba(107, 122, 153, 0.1)',
                border: '1px solid rgba(107,122,153,0.2)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {y}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PredictedQuestions({
  questions,
}: {
  questions: PredictedQuestion[]
}) {
  // Group by module
  const byModule = questions.reduce<Record<string, PredictedQuestion[]>>((acc, q) => {
    if (!acc[q.moduleId]) acc[q.moduleId] = []
    acc[q.moduleId].push(q)
    return acc
  }, {})

  return (
    <div>
      {/* Disclaimer */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 10,
          border: '1px solid rgba(217,164,65,0.2)',
          background: 'rgba(217,164,65,0.06)',
          marginBottom: 28,
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--paper-200)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--brass-300)' }}>Heads up:</strong> Based on
        patterns in the papers you uploaded — not leaked questions. Use this to
        prioritize, not to gamble your prep.
      </div>

      {/* Questions by module */}
      {Object.entries(byModule).map(([moduleId, qs]) => {
        const partA = qs.filter((q) => q.part === 'A').sort((a, b) => b.frequency - a.frequency)
        const partB = qs.filter((q) => q.part === 'B').sort((a, b) => b.frequency - a.frequency)
        const moduleTitle = qs[0]?.moduleTitle ?? moduleId

        return (
          <div key={moduleId} style={{ marginBottom: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <ModuleBadge id={moduleId} />
              <div
                style={{ width: 20, height: 1, background: 'rgba(217,164,65,0.3)' }}
                aria-hidden
              />
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--paper-100)',
                  margin: 0,
                }}
              >
                {moduleTitle}
              </h3>
            </div>

            {partA.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--blueprint-300)',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  Part A — Short Questions
                </h4>
                {partA.map((q) => (
                  <QuestionCard key={q.id} q={q} />
                ))}
              </div>
            )}

            {partB.length > 0 && (
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--brass-400)',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  Part B — Long Questions
                </h4>
                {partB.map((q) => (
                  <QuestionCard key={q.id} q={q} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
