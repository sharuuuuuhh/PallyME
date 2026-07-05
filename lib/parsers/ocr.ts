// lib/parsers/ocr.ts
// OCR fallback for image files — runs server-side

export async function parseImage(buffer: Buffer, mimeType: string): Promise<string> {
  // Dynamically import Tesseract to avoid SSR issues
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')

  try {
    // Convert buffer to base64 data URL
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`

    const { data } = await worker.recognize(dataUrl)
    return data.text
  } finally {
    await worker.terminate()
  }
}
