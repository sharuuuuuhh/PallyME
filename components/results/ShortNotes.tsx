'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ModuleBadge from '@/components/shared/ModuleBadge'
import HighYieldTag from '@/components/shared/HighYieldTag'
import type { Module, Topic } from '@/types'

// Render bold markdown (**text**) as <strong>
function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: 'var(--brass-300)', fontWeight: 600 }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

// Formula callout block
function FormulaBlock({ formula }: { formula: string }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        background: 'rgba(217, 164, 65, 0.08)',
        border: '1px solid rgba(217, 164, 65, 0.2)',
        borderRadius: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        color: 'var(--brass-300)',
        margin: '4px 0',
      }}
    >
      {formula.replace('[FORMULA:', '').replace(']', '').trim()}
    </div>
  )
}

function TopicSection({ topic }: { topic: Topic }) {
  return (
    <div
      style={{
        padding: '16px 0',
        borderBottom: '1px solid rgba(111, 227, 214, 0.07)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--paper-100)',
            margin: 0,
            flex: 1,
          }}
        >
          {topic.title}
        </h4>
        {topic.isHighYield && <HighYieldTag compact />}
      </div>

      {/* Content — render line by line */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--paper-200)',
          lineHeight: 1.7,
        }}
      >
        {topic.content.split('\n').map((line, i) => {
          const trimmed = line.trim()
          if (!trimmed) return null
          if (trimmed.startsWith('[FORMULA:')) {
            return <div key={i}><FormulaBlock formula={trimmed} /></div>
          }
          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•')
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 4,
                paddingLeft: isBullet ? 0 : 0,
              }}
            >
              {isBullet && (
                <span
                  style={{ color: 'var(--blueprint-300)', flexShrink: 0, marginTop: 1 }}
                >
                  ·
                </span>
              )}
              <span>
                <RichText text={isBullet ? trimmed.replace(/^[-•]\s*/, '') : trimmed} />
              </span>
            </div>
          )
        })}
      </div>

      {/* Key terms */}
      {topic.keyTerms.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {topic.keyTerms.map((term) => (
            <span
              key={term}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                padding: '3px 8px',
                background: 'rgba(111, 227, 214, 0.08)',
                border: '1px solid rgba(111, 227, 214, 0.15)',
                borderRadius: 4,
                color: 'var(--blueprint-300)',
              }}
            >
              {term}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ModuleSection({ module }: { module: Module }) {
  const [isOpen, setIsOpen] = useState(true)
  const highYieldCount = module.topics.filter((t) => t.isHighYield).length

  return (
    <div
      style={{
        marginBottom: 16,
        borderRadius: 14,
        border: '1px solid rgba(111, 227, 214, 0.1)',
        background: 'rgba(19, 26, 43, 0.5)',
        overflow: 'hidden',
      }}
    >
      {/* Module header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        {/* Badge + leader line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ModuleBadge id={module.id} />
          <div
            style={{
              width: 20,
              height: 1,
              background: 'rgba(217, 164, 65, 0.3)',
            }}
            aria-hidden
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--paper-100)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {module.title}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--muted-400)',
              }}
            >
              {module.topics.length} topics
            </span>
            {highYieldCount > 0 && (
              <HighYieldTag compact />
            )}
          </div>
        </div>

        <div style={{ color: 'var(--muted-400)', flexShrink: 0 }}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Topics */}
      {isOpen && (
        <div style={{ padding: '0 20px 16px' }}>
          {module.topics.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ShortNotes({ modules }: { modules: Module[] }) {
  if (!modules.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-400)' }}>
        No modules generated.
      </div>
    )
  }

  return (
    <div>
      {modules.map((mod) => (
        <ModuleSection key={mod.id} module={mod} />
      ))}
    </div>
  )
}
