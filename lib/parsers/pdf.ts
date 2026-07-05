// lib/parsers/pdf.ts
// Server-side PDF text extraction using pdfjs-dist

export async function parsePDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid issues with Next.js bundler
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as string)

  // Use the legacy build without worker for server-side
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
  const pdfDoc = await loadingTask.promise

  const texts: string[] = []

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: { str?: string }) => item.str ?? '')
      .join(' ')
    texts.push(pageText)
  }

  return texts.join('\n\n')
}
