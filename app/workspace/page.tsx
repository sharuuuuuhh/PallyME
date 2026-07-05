'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UploadBox from '@/components/upload/UploadBox'
import ProcessingSteps from '@/components/shared/ProcessingSteps'
import { useStudyStore } from '@/lib/store/useStudyStore'
import { ACCEPTED_NOTE_TYPES, ACCEPTED_SYLLABUS_TYPES, ACCEPTED_PYQ_TYPES } from '@/lib/utils'
import type { UploadedFile } from '@/types'
import { ArrowLeft, Zap, AlertCircle } from 'lucide-react'

export default function WorkspacePage() {
  const router = useRouter()
  const {
    notes,
    syllabus,
    pyq,
    isProcessing,
    processingStep,
    error,
    addNotes,
    removeNote,
    setSyllabus,
    removePYQ,
    addPYQ,
    setIsProcessing,
    setProcessingStep,
    setError,
    setResults,
    reset,
  } = useStudyStore()

  const syllabusFiles = syllabus ? [syllabus] : []

  const handleSyllabusAdd = useCallback(
    (files: UploadedFile[]) => {
      if (files.length > 0) setSyllabus(files[0])
    },
    [setSyllabus]
  )

  const handleSyllabusRemove = useCallback(() => {
    setSyllabus(null)
  }, [setSyllabus])

  const validNotes = notes.filter((f) => !f.error)
  const canProcess = validNotes.length > 0 && !isProcessing

  const handleProcess = async () => {
    if (!canProcess) return
    setIsProcessing(true)
    setError(null)
    setProcessingStep(0)

    try {
      const formData = new FormData()

      // Attach notes
      setProcessingStep(0)
      for (const f of validNotes) {
        formData.append('notes[]', f.file, f.name)
      }

      // Attach syllabus
      setProcessingStep(1)
      if (syllabus && !syllabus.error) {
        formData.append('syllabus[]', syllabus.file, syllabus.name)
      }

      // Attach PYQ
      setProcessingStep(2)
      const validPYQ = pyq.filter((f) => !f.error)
      for (const f of validPYQ) {
        formData.append('pyq[]', f.file, f.name)
      }

      setProcessingStep(3)
      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      setProcessingStep(4)
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Processing failed. Please try again.')
      }

      setResults(data.results)
      router.push('/results')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
    } finally {
      setIsProcessing(false)
    }
  }

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
          href="/"
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
          Back
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
        <div style={{ width: 60 }} />
      </nav>

      <div
        className="blueprint-grid"
        style={{
          minHeight: 'calc(100vh - 60px)',
          padding: 'clamp(32px, 6vw, 80px) clamp(16px, 5vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 960, width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700,
                color: 'var(--paper-100)',
                marginBottom: 10,
              }}
            >
              What are we working with?
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--muted-300)',
                maxWidth: 520,
                margin: '0 auto',
              }}
            >
              Drop your notes below. Add a syllabus and past papers to unlock the full
              experience — module maps, coverage gaps, and predicted questions.
            </p>
          </div>

          {/* Processing overlay */}
          {isProcessing && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(10, 14, 26, 0.92)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 40,
                backdropFilter: 'blur(8px)',
              }}
              role="dialog"
              aria-modal
              aria-label="Processing your notes"
            >
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--paper-100)',
                  }}
                >
                  Pally<span style={{ color: 'var(--brass-400)' }}>ME</span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--muted-300)',
                    marginTop: 6,
                  }}
                >
                  This usually takes 30–90 seconds.
                </p>
              </div>
              <ProcessingSteps currentStep={processingStep} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                padding: '14px 18px',
                borderRadius: 10,
                border: '1px solid rgba(255, 107, 87, 0.3)',
                background: 'rgba(255, 107, 87, 0.08)',
                marginBottom: 24,
                alignItems: 'flex-start',
              }}
              role="alert"
            >
              <AlertCircle
                size={16}
                style={{ color: 'var(--coral-500)', flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--coral-500)',
                    margin: '0 0 4px',
                  }}
                >
                  Something went wrong
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--paper-200)',
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-400)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Upload grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <UploadBox
              id="notes"
              icon="📘"
              title="Notes"
              subtitle="PDFs, Word docs, slides, or photos of handwritten pages"
              acceptedTypes={ACCEPTED_NOTE_TYPES}
              multiple
              required
              files={notes}
              onAdd={addNotes}
              onRemove={removeNote}
            />
            <UploadBox
              id="syllabus"
              icon="📋"
              title="Syllabus"
              subtitle="The official KTU module-wise syllabus PDF"
              helperText="Upload this and we'll organize everything exactly the way your exam does."
              acceptedTypes={ACCEPTED_SYLLABUS_TYPES}
              multiple={false}
              files={syllabusFiles}
              onAdd={handleSyllabusAdd}
              onRemove={handleSyllabusRemove}
            />
            <UploadBox
              id="pyq"
              icon="📝"
              title="Previous Year Questions"
              subtitle="Past exam papers — the more years, the better"
              helperText="Feed us past papers and we'll tell you what's likely to repeat."
              acceptedTypes={ACCEPTED_PYQ_TYPES}
              multiple
              files={pyq}
              onAdd={addPYQ}
              onRemove={removePYQ}
            />
          </div>

          {/* Feature preview badges */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 32,
            }}
          >
            {[
              { label: 'Short Notes', always: true },
              { label: 'Flashcards', always: true },
              {
                label: 'Topic Coverage',
                active: !!syllabus && !syllabus.error,
                requires: 'Requires syllabus',
              },
              {
                label: '🔥 Predicted Questions',
                active: pyq.filter((f) => !f.error).length > 0,
                requires: 'Requires past papers',
              },
            ].map((feat) => (
              <span
                key={feat.label}
                title={feat.requires}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${
                    feat.always || feat.active
                      ? 'rgba(111, 227, 214, 0.3)'
                      : 'rgba(107, 122, 153, 0.2)'
                  }`,
                  color:
                    feat.always || feat.active ? 'var(--blueprint-300)' : 'var(--muted-400)',
                  background:
                    feat.always || feat.active
                      ? 'rgba(111, 227, 214, 0.06)'
                      : 'transparent',
                  transition: 'all 0.25s ease',
                }}
              >
                {feat.label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <button
              id="process-btn"
              onClick={handleProcess}
              disabled={!canProcess}
              className="btn-primary"
              style={{
                fontSize: '1rem',
                padding: '16px 40px',
                gap: 10,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Zap size={18} aria-hidden />
              Simplify My Notes
            </button>
            {validNotes.length === 0 && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: 'var(--muted-400)',
                  marginTop: 10,
                }}
              >
                Upload your notes first — that's the only thing we strictly need.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
