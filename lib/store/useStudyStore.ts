// lib/store/useStudyStore.ts
import { create } from 'zustand'
import type { StudyResults, UploadedFile } from '@/types'

interface StudyStore {
  // Upload state
  notes: UploadedFile[]
  syllabus: UploadedFile | null
  pyq: UploadedFile[]

  // Processing
  isProcessing: boolean
  processingStep: number
  error: string | null

  // Results
  results: StudyResults | null

  // Actions
  setNotes: (files: UploadedFile[]) => void
  addNotes: (files: UploadedFile[]) => void
  removeNote: (id: string) => void
  setSyllabus: (file: UploadedFile | null) => void
  setPYQ: (files: UploadedFile[]) => void
  addPYQ: (files: UploadedFile[]) => void
  removePYQ: (id: string) => void
  setIsProcessing: (v: boolean) => void
  setProcessingStep: (step: number) => void
  setError: (err: string | null) => void
  setResults: (results: StudyResults) => void
  reset: () => void
}

const initialState = {
  notes: [],
  syllabus: null,
  pyq: [],
  isProcessing: false,
  processingStep: 0,
  error: null,
  results: null,
}

export const useStudyStore = create<StudyStore>((set) => ({
  ...initialState,

  setNotes: (files) => set({ notes: files }),
  addNotes: (files) => set((s) => ({ notes: [...s.notes, ...files] })),
  removeNote: (id) => set((s) => ({ notes: s.notes.filter((f) => f.id !== id) })),

  setSyllabus: (file) => set({ syllabus: file }),

  setPYQ: (files) => set({ pyq: files }),
  addPYQ: (files) => set((s) => ({ pyq: [...s.pyq, ...files] })),
  removePYQ: (id) => set((s) => ({ pyq: s.pyq.filter((f) => f.id !== id) })),

  setIsProcessing: (v) => set({ isProcessing: v }),
  setProcessingStep: (step) => set({ processingStep: step }),
  setError: (err) => set({ error: err }),
  setResults: (results) => set({ results }),
  reset: () => set(initialState),
}))
