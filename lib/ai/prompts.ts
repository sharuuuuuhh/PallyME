// lib/ai/prompts.ts
// All prompt templates in one place so the provider is swappable

export function buildShortNotesPrompt(notesText: string, syllabusText?: string): string {
  const syllabusSection = syllabusText
    ? `
=== KTU SYLLABUS ===
${syllabusText}
===================
Use the syllabus above to organize the output. Map every piece of content from the notes to the correct module and topic. If a syllabus topic has little or no matching content in the notes, set coverageLevel to "none" or "partial" and include a note.
`
    : `
No syllabus was provided. Infer the module/topic structure from headings and content in the notes themselves.
`

  return `
You are PallyME, an expert KTU engineering study assistant. Your job is to transform raw student notes into clean, exam-ready short notes.

${syllabusSection}

=== STUDENT NOTES ===
${notesText}
====================

Return ONLY valid JSON matching this exact structure (no markdown fences):
{
  "modules": [
    {
      "id": "MOD.01",
      "title": "Module title",
      "topics": [
        {
          "id": "MOD.01.T1",
          "title": "Topic title",
          "content": "Concise bulleted content. Use **bold** for key terms. Call out formulas with [FORMULA: ...]. Give plain-language explanation next to any technical definition.",
          "keyTerms": ["term1", "term2"],
          "formulas": ["formula1"],
          "isHighYield": false
        }
      ]
    }
  ]
}

Rules:
- Be concise. Students are under exam pressure — dense but scannable.
- Bold all key terms using **markdown bold**.
- One module per major section, one topic per subtopic.
- isHighYield defaults to false (the PYQ pipeline sets it later).
- Maximum 5 modules.
`
}

export function buildFlashcardPrompt(notesText: string, syllabusText?: string): string {
  const context = syllabusText
    ? `Organize flashcards by module matching this KTU syllabus:\n${syllabusText}\n\n`
    : 'Organize flashcards by the topics present in the notes.\n\n'

  return `
You are PallyME, a KTU study assistant. Generate exam-ready flashcards from the student notes below.

${context}

=== STUDENT NOTES ===
${notesText}
====================

Return ONLY valid JSON with this structure:
{
  "flashcards": [
    {
      "id": "FC.001",
      "moduleId": "MOD.01",
      "moduleTitle": "Module title",
      "front": "Clear, specific question or concept prompt",
      "back": "Concise answer with key facts. Use **bold** for key terms. Include formula if relevant.",
      "isHighYield": false
    }
  ]
}

Rules:
- Generate 5–10 flashcards per module. Quality over quantity.
- Front should be a question or a concept fill-in, not just a title.
- Back should be concise — readable in 10 seconds.
- Prioritize definitions, formulas, procedures, comparisons.
- isHighYield defaults to false.
`
}

export function buildPYQAnalysisPrompt(
  notesText: string,
  pyqText: string,
  syllabusText?: string
): string {
  const syllabusCtx = syllabusText
    ? `KTU Syllabus (use this to tag questions to the correct module):\n${syllabusText}\n\n`
    : ''

  return `
You are PallyME, a KTU study assistant specializing in exam pattern analysis.

${syllabusCtx}

=== PREVIOUS YEAR QUESTIONS ===
${pyqText}
==============================

=== STUDENT NOTES (for cross-referencing) ===
${notesText}
=============================================

Analyze the previous year questions and return ONLY valid JSON:
{
  "predictedQuestions": [
    {
      "id": "PQ.001",
      "moduleId": "MOD.01",
      "moduleTitle": "Module title",
      "part": "A",
      "question": "The predicted question text",
      "marks": 3,
      "frequency": 3,
      "totalPapers": 5,
      "years": ["2022", "2023", "2024"]
    }
  ],
  "highYieldTopicIds": ["MOD.01.T1", "MOD.02.T2"]
}

Rules:
- Derive the real exam structure (Part A/B, marks) from what's actually in the uploaded papers — do not hardcode KTU scheme numbers.
- Group and cluster similar questions — extract the underlying topic/question pattern.
- frequency = number of uploaded papers this topic appeared in. totalPapers = total papers in the upload.
- Sort by frequency descending within each module.
- highYieldTopicIds: list topic IDs (from the short notes structure) where frequency/totalPapers >= 0.6.
- Always prefer extracting real question text over paraphrasing.
`
}

export function buildCoveragePrompt(notesText: string, syllabusText: string): string {
  return `
You are PallyME. Compare the student's notes against the KTU syllabus and identify coverage gaps.

=== KTU SYLLABUS ===
${syllabusText}
===================

=== STUDENT NOTES ===
${notesText}
====================

Return ONLY valid JSON:
{
  "coverageGaps": [
    {
      "moduleId": "MOD.01",
      "moduleTitle": "Module title",
      "topic": "Specific topic from syllabus",
      "coverageLevel": "none",
      "note": "Not found in your notes at all."
    }
  ]
}

coverageLevel must be one of: "full", "partial", "none".
Only include topics where coverageLevel is "partial" or "none" — don't list fully covered topics.
`
}
