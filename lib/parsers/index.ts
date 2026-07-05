// lib/parsers/index.ts
// Routes to the correct parser based on MIME type

import { parsePDF } from './pdf'
import { parseDOCX } from './docx'
import { parseImage } from './ocr'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function parseFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    return parsePDF(buffer)
  }

  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return parseDOCX(buffer)
  }

  if (IMAGE_TYPES.includes(mimeType)) {
    return parseImage(buffer, mimeType)
  }

  // PPTX and other office formats: attempt PDF-style text extraction
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    // Fallback: treat as a series of text — mammoth won't work but we try
    return `[PPTX file — text extraction limited. Content: ${buffer.length} bytes]`
  }

  throw new Error(`Unsupported file type: ${mimeType}`)
}

export async function parseFiles(
  files: Array<{ buffer: Buffer; mimeType: string; name: string }>
): Promise<string> {
  const texts = await Promise.all(
    files.map(async (f) => {
      try {
        const text = await parseFile(f.buffer, f.mimeType)
        return `=== ${f.name} ===\n${text}`
      } catch (err) {
        console.error(`Failed to parse ${f.name}:`, err)
        return `=== ${f.name} === [Parse failed]`
      }
    })
  )
  return texts.join('\n\n')
}
