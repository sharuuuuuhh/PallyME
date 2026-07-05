'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import ShortNotes from '@/components/results/ShortNotes'
import FlashcardDeck from '@/components/results/FlashcardDeck'
import PredictedQuestions from '@/components/results/PredictedQuestions'
import TopicCoverage from '@/components/results/TopicCoverage'
import { useStudyStore } from '@/lib/store/useStudyStore'

type TabId = 'notes' | 'flashcards' | 'predicted' | 'coverage'

interface Tab {
  id: TabId
  label: string
  emoji: string
}

export default function ResultsPage() {
  const router = useRouter()
  const { results, reset } = useStudyStore()
  const [activeTab, setActiveTab] = useState<TabId>('notes')

  // Guard: if no results in store, redirect back
  useEffect(() => {
    if (!results) router.replace('/workspace')
  }, [results, router])

  if (!results) return null

  const tabs: Tab[] = [
    { id: 'notes', label: 'Short Notes', emoji: '📖' },
    { id: 'flashcards', label: 'Flashcards', emoji: '🃏' },
    ...(results.hasPYQ
      ? [{ id: 'predicted' as TabId, label: 'Predicted Questions', emoji: '🔮' }]
      : []),
    ...(results.hasSyllabus
      ? [{ id: 'coverage' as TabId, label: 'Topic Coverage', emoji: '📊' }]
      : []),
  ]

  // Summary stats
  const highYieldCount = results.flashcards.filter((f) => f.isHighYield).length
  const topicCount = results.modules.reduce((s, m) => s + m.topics.length, 0)

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--ink-950)',
        paddingTop: 60,
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 14, 26, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(111, 227, 214, 0.07)',
        }}
      >
        <Link
          href="/workspace"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--muted-300)',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--paper-100)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-300)')
          }
        >
          <ArrowLeft size={16} />
          Back to workspace
        </Link>

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--paper-100)',
          }}
        >
          Pally<span style={{ color: 'var(--brass-400)' }}>ME</span>
        </div>

        <button
          onClick={() => {
            reset()
            router.push('/workspace')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: '1px solid rgba(111,227,214,0.2)',
            borderRadius: 8,
            color: 'var(--muted-300)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            padding: '6px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'rgba(111,227,214,0.4)'
            el.style.color = 'var(--paper-100)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'rgba(111,227,214,0.2)'
            el.style.color = 'var(--muted-300)'
          }}
        >
          <RotateCcw size={13} aria-hidden />
          New session
        </button>
      </nav>

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)',
        }}
      >
        {/* Results header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700,
              color: 'var(--paper-100)',
              marginBottom: 8,
            }}
          >
            Your study pack is ready 🎯
          </h1>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { val: results.modules.length, label: 'modules' },
              { val: topicCount, label: 'topics covered' },
              { val: results.flashcards.length, label: 'flashcards' },
              ...(highYieldCount > 0
                ? [{ val: `🔥 ${highYieldCount}`, label: 'high-yield' }]
                : []),
              ...(results.predictedQuestions
                ? [{ val: results.predictedQuestions.length, label: 'predicted questions' }]
                : []),
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--brass-400)',
                  }}
                >
                  {stat.val}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--muted-300)',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            marginBottom: 28,
            padding: 4,
            background: 'rgba(19, 26, 43, 0.8)',
            borderRadius: 12,
            border: '1px solid rgba(111, 227, 214, 0.08)',
            overflowX: 'auto',
          }}
          role="tablist"
          aria-label="Result sections"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  padding: '10px 16px',
                  borderRadius: 9,
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(217,164,65,0.15), rgba(111,227,214,0.08))'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 1px 0 rgba(217,164,65,0.2) inset'
                    : 'none',
                  color: isActive ? 'var(--paper-100)' : 'var(--muted-400)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--paper-200)'
                }}
                onBlur={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-400)'
                }}
              >
                <span aria-hidden>{tab.emoji}</span>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab panels */}
        <div>
          {activeTab === 'notes' && (
            <section
              id="panel-notes"
              role="tabpanel"
              aria-labelledby="tab-notes"
            >
              <ShortNotes modules={results.modules} />
            </section>
          )}
          {activeTab === 'flashcards' && (
            <section
              id="panel-flashcards"
              role="tabpanel"
              aria-labelledby="tab-flashcards"
            >
              <FlashcardDeck flashcards={results.flashcards} />
            </section>
          )}
          {activeTab === 'predicted' && results.predictedQuestions && (
            <section
              id="panel-predicted"
              role="tabpanel"
              aria-labelledby="tab-predicted"
            >
              <PredictedQuestions questions={results.predictedQuestions} />
            </section>
          )}
          {activeTab === 'coverage' && results.coverageGaps && (
            <section
              id="panel-coverage"
              role="tabpanel"
              aria-labelledby="tab-coverage"
            >
              <TopicCoverage gaps={results.coverageGaps} />
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
