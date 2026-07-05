// lib/ai/gemini.ts
// Server-side only — never import from client components
import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('[PallyME] GEMINI_API_KEY is not set. AI processing will fail.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.3,
    maxOutputTokens: 8192,
  },
})

export async function generateContent(prompt: string): Promise<string> {
  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}
