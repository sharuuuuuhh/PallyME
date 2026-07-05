'use client'

import { useRef, useState, useCallback, type ReactNode } from 'react'

interface DropZoneProps {
  accept: string[]
  multiple?: boolean
  onFiles: (files: File[]) => void
  children: (state: { isDragging: boolean }) => ReactNode
  disabled?: boolean
}

export default function DropZone({
  accept,
  multiple = false,
  onFiles,
  children,
  disabled = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return
      const files = Array.from(fileList)
      onFiles(multiple ? files : [files[0]])
    },
    [multiple, onFiles]
  )

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        tabIndex={-1}
        aria-hidden
      />
      {children({ isDragging })}
    </div>
  )
}
