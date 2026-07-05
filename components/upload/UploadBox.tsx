'use client'

import { useCallback } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import DropZone from './DropZone'
import FileChip from './FileChip'
import { validateFile, generateId } from '@/lib/utils'
import type { UploadedFile } from '@/types'

interface UploadBoxProps {
  id: string
  icon: string
  title: string
  subtitle: string
  helperText?: string
  acceptedTypes: string[]
  multiple?: boolean
  required?: boolean
  files: UploadedFile[]
  onAdd: (files: UploadedFile[]) => void
  onRemove: (id: string) => void
}

export default function UploadBox({
  id,
  icon,
  title,
  subtitle,
  helperText,
  acceptedTypes,
  multiple = false,
  required = false,
  files,
  onAdd,
  onRemove,
}: UploadBoxProps) {
  const hasFiles = files.length > 0
  const hasError = files.some((f) => f.error)

  const handleFiles = useCallback(
    (raw: File[]) => {
      const newFiles: UploadedFile[] = raw.map((file) => {
        const validation = validateFile(file, acceptedTypes)
        return {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          status: validation.valid ? 'done' : 'error',
          error: validation.error,
        }
      })
      onAdd(newFiles)
    },
    [acceptedTypes, onAdd]
  )

  const borderColor = hasError
    ? 'rgba(255, 107, 87, 0.5)'
    : hasFiles
    ? 'rgba(111, 227, 214, 0.4)'
    : 'rgba(111, 227, 214, 0.12)'

  const bgColor = hasFiles
    ? 'rgba(111, 227, 214, 0.04)'
    : 'rgba(19, 26, 43, 0.5)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        borderRadius: 16,
        border: `1.5px solid ${borderColor}`,
        background: bgColor,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, background 0.25s ease',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: '1.3rem' }} aria-hidden>{icon}</span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--paper-100)',
              margin: 0,
            }}
          >
            {title}
          </h3>
          {required && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--brass-400)',
                background: 'rgba(217, 164, 65, 0.12)',
                border: '1px solid rgba(217, 164, 65, 0.25)',
                borderRadius: 4,
                padding: '2px 6px',
                letterSpacing: '0.05em',
              }}
            >
              REQUIRED
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--muted-300)',
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Drop Zone */}
      <DropZone
        accept={acceptedTypes}
        multiple={multiple}
        onFiles={handleFiles}
      >
        {({ isDragging }) => (
          <div
            style={{
              margin: 16,
              padding: '24px 20px',
              borderRadius: 10,
              border: `1.5px dashed ${
                isDragging ? 'var(--blueprint-300)' : 'rgba(111, 227, 214, 0.2)'
              }`,
              background: isDragging
                ? 'rgba(111, 227, 214, 0.06)'
                : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              userSelect: 'none',
            }}
            aria-label={`Upload ${title}`}
          >
            <Upload
              size={22}
              style={{
                color: isDragging ? 'var(--blueprint-300)' : 'var(--muted-400)',
                transition: 'color 0.2s ease',
              }}
              aria-hidden
            />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: isDragging ? 'var(--blueprint-300)' : 'var(--muted-300)',
                textAlign: 'center',
                margin: 0,
                transition: 'color 0.2s ease',
              }}
            >
              {isDragging
                ? 'Drop it like it\'s hot'
                : 'Drop your notes here — PDFs, Word docs, slides, or photos of handwritten pages all work.'}
            </p>
            {!isDragging && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--blueprint-300)',
                  opacity: 0.7,
                }}
              >
                or click to browse
              </span>
            )}
          </div>
        )}
      </DropZone>

      {/* Helper text */}
      {helperText && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--muted-400)',
            padding: '0 20px 8px',
            margin: 0,
          }}
        >
          {helperText}
        </p>
      )}

      {/* File list */}
      {hasFiles && (
        <div
          style={{
            padding: '0 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              height: 1,
              background: 'rgba(111, 227, 214, 0.08)',
              marginBottom: 8,
            }}
          />
          {files.map((f) => (
            <div key={f.id}>
              {f.error ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '8px 10px',
                    background: 'rgba(255, 107, 87, 0.08)',
                    border: '1px solid rgba(255, 107, 87, 0.2)',
                    borderRadius: 8,
                  }}
                >
                  <AlertCircle
                    size={14}
                    style={{ color: 'var(--coral-500)', flexShrink: 0, marginTop: 1 }}
                    aria-hidden
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--paper-200)',
                        margin: 0,
                      }}
                    >
                      {f.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.72rem',
                        color: 'var(--coral-500)',
                        margin: '2px 0 0',
                      }}
                    >
                      {f.error}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(f.id)}
                    aria-label={`Remove ${f.name}`}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted-400)',
                      padding: 2,
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <FileChip file={f} onRemove={onRemove} />
              )}
            </div>
          ))}

          {hasFiles && !hasError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
              }}
            >
              <CheckCircle size={13} style={{ color: 'var(--blueprint-300)' }} aria-hidden />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--blueprint-300)',
                }}
              >
                {files.filter((f) => !f.error).length} file
                {files.filter((f) => !f.error).length !== 1 ? 's' : ''} ready
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
