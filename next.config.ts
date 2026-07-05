import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Moved from experimental in Next.js 16
  serverExternalPackages: ['tesseract.js', 'mammoth', 'pdfjs-dist'],

  // Empty turbopack config to silence the Turbopack+webpack warning
  turbopack: {},
}

export default nextConfig
