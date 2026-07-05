# PallyME

> *"Notes in. Exam-ready out."* — Your KTU study pal, minus the all-nighters.

PallyME is a premium AI study companion for KTU engineering students. Upload your class notes and get exam-ready short notes, 3D flashcards, and predicted questions — organized by module, powered by Gemini AI.

## Getting Started

### 1. Add your Gemini API key

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your key:
```
GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

### 2. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- 📘 **Notes → Short Notes** — Concise, bulleted, organized by KTU module
- 🃏 **3D Flashcards** — Real perspective flip, grouped by topic  
- 🔮 **Predicted Questions** — PYQ pattern analysis by Part A/B and module
- 📊 **Topic Coverage** — Gaps identified against your syllabus
- 🔥 **High-yield tags** — Cross-tagged across all outputs when past papers are uploaded

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + custom CSS design tokens
- **3D**: React Three Fiber + @react-three/drei
- **AI**: Google Gemini 1.5 Flash via `@google/generative-ai`
- **Parsers**: pdfjs-dist, mammoth (DOCX), tesseract.js (OCR)
- **State**: Zustand

## Architecture

All AI calls are routed through `/api/process` (server-side only). The `GEMINI_API_KEY` is **never** sent to the client.

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add `GEMINI_API_KEY` in Vercel environment variables
4. Deploy ✓

Note: Set the Vercel function timeout to 120s for the `/api/process` route (the default 10s is too short for file parsing + multiple AI calls).
