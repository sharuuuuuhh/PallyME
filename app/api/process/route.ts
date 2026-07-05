// app/api/process/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { parseFiles } from '@/lib/parsers'
import { runPipeline } from '@/lib/ai/pipeline'

export const maxDuration = 120 // Vercel: allow up to 2 min for AI processing

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // ── Collect files ──────────────────────────────────────────────────────────
    const noteFiles: Array<{ buffer: Buffer; mimeType: string; name: string }> = []
    const syllabusFiles: Array<{ buffer: Buffer; mimeType: string; name: string }> = []
    const pyqFiles: Array<{ buffer: Buffer; mimeType: string; name: string }> = []

    for (const [key, value] of formData.entries()) {
      if (!(value instanceof Blob)) continue
      const buffer = Buffer.from(await value.arrayBuffer())
      const mimeType = value.type
      const name = value instanceof File ? value.name : key

      if (key.startsWith('notes')) noteFiles.push({ buffer, mimeType, name })
      else if (key.startsWith('syllabus')) syllabusFiles.push({ buffer, mimeType, name })
      else if (key.startsWith('pyq')) pyqFiles.push({ buffer, mimeType, name })
    }

    if (noteFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No notes uploaded.' },
        { status: 400 }
      )
    }

    // ── Parse text ─────────────────────────────────────────────────────────────
    const [notesText, syllabusText, pyqText] = await Promise.all([
      parseFiles(noteFiles),
      syllabusFiles.length > 0 ? parseFiles(syllabusFiles) : Promise.resolve(undefined),
      pyqFiles.length > 0 ? parseFiles(pyqFiles) : Promise.resolve(undefined),
    ])

    // ── Run AI pipeline ────────────────────────────────────────────────────────
    const results = await runPipeline({ notesText, syllabusText, pyqText })

    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('[/api/process]', err)
    const message = err instanceof Error ? err.message : 'Something went wrong'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
