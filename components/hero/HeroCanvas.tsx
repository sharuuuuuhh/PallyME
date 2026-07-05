'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <HeroFallback />,
})

function HeroFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Static stacked papers illustration */}
      <div style={{ position: 'relative', width: 200, height: 260 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 180,
              height: 240,
              background: `hsl(${35 + i * 4}, 18%, ${89 - i * 2}%)`,
              borderRadius: 8,
              border: '1px solid rgba(111,227,214,0.15)',
              top: i * 6,
              left: i * 6,
              transform: `rotate(${(i - 1.5) * 3}deg)`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            {/* Ruled lines */}
            {[0, 1, 2, 3, 4, 5, 6].map((l) => (
              <div
                key={l}
                style={{
                  position: 'absolute',
                  left: 24,
                  right: 12,
                  top: 40 + l * 26,
                  height: 1,
                  background: 'rgba(100,140,220,0.2)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

export default function HeroCanvas() {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  if (reducedMotion || isMobile) return <HeroFallback />

  return (
    <Suspense fallback={<HeroFallback />}>
      <HeroScene />
    </Suspense>
  )
}
