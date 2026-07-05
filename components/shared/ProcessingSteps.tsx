'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { id: 'read', label: 'Reading your notes…' },
  { id: 'syllabus', label: 'Matching it to your syllabus…' },
  { id: 'pyq', label: 'Hunting for repeat questions…' },
  { id: 'flash', label: 'Packaging your flashcards…' },
  { id: 'done', label: 'Almost there…' },
]

interface ProcessingStepsProps {
  currentStep: number
}

export default function ProcessingSteps({ currentStep }: ProcessingStepsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 380,
        margin: '0 auto',
      }}
      role="status"
      aria-live="polite"
      aria-label="Processing your notes"
    >
      {STEPS.map((step, i) => {
        const isDone = i < currentStep
        const isActive = i === currentStep
        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: isDone ? 0.5 : isActive ? 1 : 0.25,
              transition: 'opacity 0.4s ease',
            }}
          >
            {/* Step indicator */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `2px solid ${
                  isDone
                    ? 'var(--brass-400)'
                    : isActive
                    ? 'var(--blueprint-300)'
                    : 'var(--muted-400)'
                }`,
                background: isDone ? 'var(--brass-400)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.4s ease',
              }}
            >
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="var(--ink-950)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : isActive ? (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--blueprint-300)',
                    animation: 'pulse 1.4s ease-in-out infinite',
                  }}
                />
              ) : null}
            </div>

            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: isActive ? 'var(--paper-100)' : 'var(--muted-300)',
                transition: 'color 0.4s ease',
              }}
            >
              {step.label}
            </span>
          </div>
        )
      })}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}
