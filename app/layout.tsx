import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PallyME — Your KTU Study Pal',
  description:
    'Upload your KTU class notes and get exam-ready short notes, flashcards, and predicted questions — powered by AI. Study smarter, not longer.',
  keywords: ['KTU', 'engineering', 'study', 'flashcards', 'exam prep', 'APJ Abdul Kalam'],
  authors: [{ name: 'PallyME' }],
  openGraph: {
    title: 'PallyME — Notes in. Exam-ready out.',
    description: 'Your KTU study pal, minus the all-nighters.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
