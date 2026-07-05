// lib/ai/pipeline.ts
// Server-side orchestrator — decides which prompts to call based on inputs
import { generateContent } from './gemini'
import {
  buildShortNotesPrompt,
  buildFlashcardPrompt,
  buildPYQAnalysisPrompt,
  buildCoveragePrompt,
} from './prompts'
import type { StudyResults, Module, Flashcard, PredictedQuestion, CoverageGap } from '@/types'

interface PipelineInput {
  notesText: string
  syllabusText?: string
  pyqText?: string
}

function safeParseJSON<T>(raw: string, fallback: T): T {
  try {
    // Strip markdown fences if the model adds them despite instructions
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    return JSON.parse(cleaned) as T
  } catch {
    console.error('[pipeline] JSON parse error:', raw.slice(0, 200))
    return fallback
  }
}

export async function runPipeline(input: PipelineInput): Promise<StudyResults> {
  const { notesText, syllabusText, pyqText } = input

  // Run short notes + flashcards in parallel (independent prompts)
  const [notesRaw, flashcardsRaw] = await Promise.all([
    generateContent(buildShortNotesPrompt(notesText, syllabusText)),
    generateContent(buildFlashcardPrompt(notesText, syllabusText)),
  ])

  const notesData = safeParseJSON<{ modules: Module[] }>(notesRaw, { modules: [] })
  const flashcardsData = safeParseJSON<{ flashcards: Flashcard[] }>(flashcardsRaw, {
    flashcards: [],
  })

  let predictedQuestions: PredictedQuestion[] | undefined
  let coverageGaps: CoverageGap[] | undefined
  let highYieldTopicIds: string[] = []

  // PYQ analysis (if PYQ uploaded)
  if (pyqText) {
    const pyqRaw = await generateContent(
      buildPYQAnalysisPrompt(notesText, pyqText, syllabusText)
    )
    const pyqData = safeParseJSON<{
      predictedQuestions: PredictedQuestion[]
      highYieldTopicIds: string[]
    }>(pyqRaw, { predictedQuestions: [], highYieldTopicIds: [] })

    predictedQuestions = pyqData.predictedQuestions
    highYieldTopicIds = pyqData.highYieldTopicIds ?? []
  }

  // Coverage analysis (only if syllabus uploaded)
  if (syllabusText) {
    const coverageRaw = await generateContent(buildCoveragePrompt(notesText, syllabusText))
    const coverageData = safeParseJSON<{ coverageGaps: CoverageGap[] }>(coverageRaw, {
      coverageGaps: [],
    })
    coverageGaps = coverageData.coverageGaps
  }

  // Apply high-yield flags from PYQ analysis back to modules and flashcards
  if (highYieldTopicIds.length > 0) {
    notesData.modules = notesData.modules.map((mod) => ({
      ...mod,
      topics: mod.topics.map((topic) => ({
        ...topic,
        isHighYield: highYieldTopicIds.includes(topic.id),
      })),
    }))

    flashcardsData.flashcards = flashcardsData.flashcards.map((card) => {
      const moduleTopics =
        notesData.modules
          .find((m) => m.id === card.moduleId)
          ?.topics.filter((t) => t.isHighYield) ?? []
      return {
        ...card,
        isHighYield:
          moduleTopics.length > 0 &&
          moduleTopics.some((t) => card.front.toLowerCase().includes(t.title.toLowerCase())),
      }
    })
  }

  return {
    modules: notesData.modules,
    flashcards: flashcardsData.flashcards,
    predictedQuestions,
    coverageGaps,
    hasSyllabus: !!syllabusText,
    hasPYQ: !!pyqText,
    processedAt: new Date().toISOString(),
  }
}
