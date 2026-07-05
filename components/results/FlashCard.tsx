'use client'

import { useState } from 'react'
import HighYieldTag from '@/components/shared/HighYieldTag'
import type { Flashcard } from '@/types'

function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: 'var(--brass-300)' }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function FlashCard({ card }: { card: Flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        aspectRatio: '1.6 / 1',
        cursor: 'pointer',
        minHeight: 180,
      }}
      onClick={() => setIsFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsFlipped((f) => !f)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Flashcard: ${card.front}. Press to reveal answer.`}
      aria-pressed={isFlipped}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── Front ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 14,
            border: '1.5px solid rgba(111, 227, 214, 0.15)',
            background: 'rgba(244, 241, 234, 0.94)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
            backgroundImage:
              'linear-gradient(rgba(100, 140, 220, 0.12) 1px, transparent 1px)',
            backgroundSize: '100% 28px',
            backgroundPosition: '0 28px',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          aria-hidden={isFlipped}
        >
          {/* Top meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'rgba(100, 140, 220, 0.6)',
                letterSpacing: '0.05em',
              }}
            >
              {card.moduleId}
            </span>
            {card.isHighYield && <HighYieldTag compact />}
          </div>

          {/* Question */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#1C2540',
              lineHeight: 1.45,
              textAlign: 'center',
              padding: '8px 0',
            }}
          >
            {card.front}
          </div>

          {/* Tap hint */}
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'rgba(100, 140, 220, 0.5)',
                letterSpacing: '0.06em',
              }}
            >
              tap to flip
            </span>
          </div>
        </div>

        {/* ── Back ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 14,
            border: '1.5px solid rgba(217, 164, 65, 0.3)',
            background: 'rgba(28, 37, 64, 0.95)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(217,164,65,0.1) inset',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          aria-hidden={!isFlipped}
        >
          {/* Top meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--brass-400)',
                opacity: 0.7,
                letterSpacing: '0.05em',
              }}
            >
              {card.moduleId} · ANSWER
            </span>
          </div>

          {/* Answer */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--paper-200)',
              lineHeight: 1.65,
              textAlign: 'center',
              padding: '8px 0',
            }}
          >
            <RichText text={card.back} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--muted-400)',
                letterSpacing: '0.06em',
              }}
            >
              tap to flip back
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
