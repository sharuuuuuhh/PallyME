// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const ACCEPTED_NOTE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/webp',
]

export const ACCEPTED_SYLLABUS_TYPES = ['application/pdf']

export const ACCEPTED_PYQ_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

export const MAX_FILE_SIZE_MB = 25
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export function validateFile(
  file: File,
  acceptedTypes: string[]
): { valid: boolean; error?: string } {
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Couldn't read that one. Try a clearer scan or PDF — blurry photos trip us up too.",
    }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large — we cap uploads at ${MAX_FILE_SIZE_MB}MB. Try compressing the PDF.`,
    }
  }
  return { valid: true }
}
