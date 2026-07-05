'use client'

import { X, FileText } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'
import type { UploadedFile } from '@/types'

interface FileChipProps {
  file: UploadedFile
  onRemove: (id: string) => void
}

export default function FileChip({ file, onRemove }: FileChipProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        background: 'rgba(111, 227, 214, 0.08)',
        border: '1px solid rgba(111, 227, 214, 0.18)',
        borderRadius: 8,
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
      <FileText
        size={14}
        style={{ color: 'var(--blueprint-300)', flexShrink: 0 }}
        aria-hidden
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--paper-200)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 180,
        }}
        title={file.name}
      >
        {file.name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--muted-400)',
          flexShrink: 0,
        }}
      >
        {formatFileSize(file.size)}
      </span>
      <button
        onClick={() => onRemove(file.id)}
        aria-label={`Remove ${file.name}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          background: 'transparent',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          color: 'var(--muted-400)',
          transition: 'color 0.15s ease',
          flexShrink: 0,
          padding: 0,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = 'var(--coral-500)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-400)')
        }
      >
        <X size={12} />
      </button>
    </div>
  )
}
