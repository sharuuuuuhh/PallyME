'use client'

import { useState } from 'react'
import FlashCard from './FlashCard'
import type { Flashcard } from '@/types'

interface FlashcardDeckProps {
  flashcards: Flashcard[]
}

export default function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [filterModule, setFilterModule] = useState<string>('all')
  const [showHighYieldOnly, setShowHighYieldOnly] = useState(false)

  // Get unique modules
  const modules = Array.from(
    new Map(flashcards.map((f) => [f.moduleId, f.moduleTitle])).entries()
  )

  const filtered = flashcards.filter((f) => {
    if (filterModule !== 'all' && f.moduleId !== filterModule) return false
    if (showHighYieldOnly && !f.isHighYield) return false
    return true
  })

  if (!flashcards.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-400)' }}>
        No flashcards generated.
      </div>
    )
  }

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setFilterModule('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: filterModule === 'all' ? 'var(--brass-400)' : 'rgba(111,227,214,0.2)',
            background: filterModule === 'all' ? 'rgba(217,164,65,0.1)' : 'transparent',
            color: filterModule === 'all' ? 'var(--brass-400)' : 'var(--muted-300)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          All
        </button>
        {modules.map(([id, title]) => (
          <button
            key={id}
            onClick={() => setFilterModule(id)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: filterModule === id ? 'var(--brass-400)' : 'rgba(111,227,214,0.2)',
              background: filterModule === id ? 'rgba(217,164,65,0.1)' : 'transparent',
              color: filterModule === id ? 'var(--brass-400)' : 'var(--muted-300)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={title}
          >
            {id}
          </button>
        ))}
        <button
          onClick={() => setShowHighYieldOnly(!showHighYieldOnly)}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: showHighYieldOnly ? 'var(--coral-500)' : 'rgba(255,107,87,0.2)',
            background: showHighYieldOnly ? 'rgba(255,107,87,0.1)' : 'transparent',
            color: showHighYieldOnly ? 'var(--coral-400)' : 'var(--muted-300)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🔥 High-yield
        </button>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--muted-400)',
            marginLeft: 'auto',
          }}
        >
          {filtered.length} cards
        </span>
      </div>

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((card) => (
          <FlashCard key={card.id} card={card} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--muted-400)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
          }}
        >
          No cards match this filter.
        </div>
      )}
    </div>
  )
}
