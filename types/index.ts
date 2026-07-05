// ─── Core domain types ────────────────────────────────────────────────────────

export type CoverageLevel = 'full' | 'partial' | 'none'
export type Part = 'A' | 'B'

export interface Topic {
  id: string
  title: string
  content: string // markdown-ish string with bold key terms
  keyTerms: string[]
  formulas: string[]
  isHighYield: boolean
}

export interface Module {
  id: string // e.g. "MOD.01"
  title: string
  topics: Topic[]
}

export interface Flashcard {
  id: string
  moduleId: string
  moduleTitle: string
  front: string
  back: string
  isHighYield: boolean
}

export interface PredictedQuestion {
  id: string
  moduleId: string
  moduleTitle: string
  part: Part
  question: string
  marks: number
  frequency: number      // how many uploaded papers this appeared in
  totalPapers: number    // total papers uploaded
  years: string[]        // e.g. ["2022", "2023"]
}

export interface CoverageGap {
  moduleId: string
  moduleTitle: string
  topic: string
  coverageLevel: CoverageLevel
  note?: string
}

export interface StudyResults {
  modules: Module[]
  flashcards: Flashcard[]
  predictedQuestions?: PredictedQuestion[]
  coverageGaps?: CoverageGap[]
  hasSyllabus: boolean
  hasPYQ: boolean
  processedAt: string
}

// ─── Upload state ──────────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  status: UploadStatus
  error?: string
}

// ─── Processing step ───────────────────────────────────────────────────────────

export interface ProcessingStep {
  id: string
  label: string
  done: boolean
}

// ─── API types ─────────────────────────────────────────────────────────────────

export interface ProcessRequest {
  notesText: string
  syllabusText?: string
  pyqText?: string
}

export interface ProcessResponse {
  success: boolean
  results?: StudyResults
  error?: string
}
