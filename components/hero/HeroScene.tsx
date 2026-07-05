'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'

// ── Lined paper canvas texture ───────────────────────────────────────────────
function createPaperTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 640
  const ctx = canvas.getContext('2d')!

  // Paper background — warm cream with slight variation
  const hue = 35 + (index % 3) * 5
  ctx.fillStyle = `hsl(${hue}, 18%, 91%)`
  ctx.fillRect(0, 0, 512, 640)

  // Ruled lines
  ctx.strokeStyle = 'rgba(100, 140, 220, 0.18)'
  ctx.lineWidth = 1
  for (let y = 60; y < 640; y += 28) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
  }

  // Red margin line
  ctx.strokeStyle = 'rgba(255, 100, 80, 0.25)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(72, 0)
  ctx.lineTo(72, 640)
  ctx.stroke()

  // Simulate handwritten scribbles — short random strokes
  ctx.strokeStyle = 'rgba(20, 30, 70, 0.15)'
  ctx.lineWidth = 2
  const rng = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280
  for (let i = 0; i < 40; i++) {
    const x = rng(index * 100 + i) * 380 + 80
    const y = rng(index * 100 + i + 50) * 500 + 70
    const w = rng(index * 100 + i + 100) * 160 + 40
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y + (rng(index * 100 + i + 150) - 0.5) * 8)
    ctx.stroke()
  }

  return new THREE.CanvasTexture(canvas)
}

// ── Initial scattered positions ──────────────────────────────────────────────
function getInitialTransform(index: number) {
  const spread = 3.5
  return {
    position: new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.6,
      index * 0.1 - 1
    ),
    rotation: new THREE.Euler(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 0.8
    ),
  }
}

// ── Final stacked positions ──────────────────────────────────────────────────
function getFinalTransform(index: number, total: number) {
  const spread = 0.015
  return {
    position: new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      -(total / 2) * 0.04 + index * 0.04,
      index * 0.003
    ),
    rotation: new THREE.Euler(0, 0, (Math.random() - 0.5) * 0.04),
  }
}

// ── Single animated paper sheet ──────────────────────────────────────────────
function PaperSheet({
  index,
  total,
  progress,
  cursorOffset,
}: {
  index: number
  total: number
  progress: number
  cursorOffset: THREE.Vector2
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useMemo(() => createPaperTexture(index), [index])

  const initial = useMemo(() => getInitialTransform(index), [index])
  const final = useMemo(() => getFinalTransform(index, total), [index, total])

  useFrame(() => {
    if (!meshRef.current) return
    const t = Math.min(progress, 1)
    const ease = 1 - Math.pow(1 - t, 3)

    meshRef.current.position.lerpVectors(initial.position, final.position, ease)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      initial.rotation.x,
      final.rotation.x + cursorOffset.y * 0.15,
      ease
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      initial.rotation.y,
      final.rotation.y + cursorOffset.x * 0.15,
      ease
    )
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      initial.rotation.z,
      final.rotation.z,
      ease
    )
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.6, 2.0]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.85}
        metalness={0.0}
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
      />
    </mesh>
  )
}

// ── Scene controller ─────────────────────────────────────────────────────────
function Scene({ cursorOffset }: { cursorOffset: THREE.Vector2 }) {
  const progressRef = useRef(0)
  const clockRef = useRef(new THREE.Clock())
  const SHEET_COUNT = 9
  const DELAY = 1.5 // seconds before animation starts
  const DURATION = 4.5

  useFrame(() => {
    const elapsed = clockRef.current.getElapsedTime()
    const t = Math.max(0, elapsed - DELAY) / DURATION
    progressRef.current = Math.min(t, 1)
  })

  const [progress, setProgress] = useRef<number>(0) as unknown as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ]

  useFrame(() => {
    const elapsed = clockRef.current.getElapsedTime()
    const t = Math.max(0, elapsed - DELAY) / DURATION
    progressRef.current = Math.min(t, 1)
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#FFF5E0" />
      <directionalLight position={[-3, -2, 3]} intensity={0.4} color="#6FE3D6" />
      {Array.from({ length: SHEET_COUNT }, (_, i) => (
        <AnimatedSheet
          key={i}
          index={i}
          total={SHEET_COUNT}
          cursorOffset={cursorOffset}
          progressRef={progressRef}
          delay={DELAY}
          duration={DURATION}
        />
      ))}
    </>
  )
}

function AnimatedSheet({
  index,
  total,
  cursorOffset,
  progressRef,
  delay,
  duration,
}: {
  index: number
  total: number
  cursorOffset: THREE.Vector2
  progressRef: React.MutableRefObject<number>
  delay: number
  duration: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useMemo(() => createPaperTexture(index), [index])
  const clockRef = useRef(new THREE.Clock())

  const initial = useMemo(
    () => ({
      position: new THREE.Vector3(
        (Math.sin(index * 137.5) * 3.5),
        (Math.cos(index * 97.3) * 2.0),
        index * 0.12 - 1
      ),
      rotation: new THREE.Euler(
        Math.sin(index * 0.9) * 0.5,
        Math.cos(index * 1.3) * 0.6,
        Math.sin(index * 1.7) * 0.8
      ),
    }),
    [index]
  )

  const final = useMemo(
    () => ({
      position: new THREE.Vector3(
        Math.sin(index * 0.3) * 0.02,
        -(total / 2) * 0.04 + index * 0.04,
        index * 0.003
      ),
      rotation: new THREE.Euler(0, 0, Math.sin(index * 2.1) * 0.03),
    }),
    [index, total]
  )

  useFrame(() => {
    if (!meshRef.current) return
    const elapsed = clockRef.current.getElapsedTime()
    const rawT = Math.max(0, elapsed - delay) / duration
    const t = Math.min(rawT, 1)
    const ease = 1 - Math.pow(1 - t, 3)

    meshRef.current.position.lerpVectors(initial.position, final.position, ease)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      initial.rotation.x,
      final.rotation.x + cursorOffset.y * 0.12,
      ease
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      initial.rotation.y,
      final.rotation.y + cursorOffset.x * 0.18,
      ease
    )
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      initial.rotation.z,
      final.rotation.z,
      ease
    )
  })

  return (
    <mesh ref={meshRef} position={initial.position.toArray()}>
      <planeGeometry args={[1.6, 2.0]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.88}
        metalness={0.0}
        side={THREE.DoubleSide}
        transparent
        opacity={0.93}
      />
    </mesh>
  )
}

// ── Exported canvas wrapper ──────────────────────────────────────────────────
export default function HeroScene() {
  const cursorRef = useRef(new THREE.Vector2(0, 0))
  const targetCursorRef = useRef(new THREE.Vector2(0, 0))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      targetCursorRef.current.set(
        (e.clientX / innerWidth - 0.5) * 2,
        -(e.clientY / innerHeight - 0.5) * 2
      )
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Smooth cursor interpolation outside R3F
  useEffect(() => {
    let frameId: number
    const animate = () => {
      cursorRef.current.lerp(targetCursorRef.current, 0.06)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <SceneWithCursor cursorRef={cursorRef} />
      </Canvas>
    </div>
  )
}

function SceneWithCursor({ cursorRef }: { cursorRef: React.MutableRefObject<THREE.Vector2> }) {
  const SHEET_COUNT = 9
  const DELAY = 1.5
  const DURATION = 4.5

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#FFF5E0" castShadow />
      <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#9FEEE6" />
      {Array.from({ length: SHEET_COUNT }, (_, i) => (
        <AnimatedSheet
          key={i}
          index={i}
          total={SHEET_COUNT}
          cursorOffset={cursorRef.current}
          progressRef={{ current: 0 }}
          delay={DELAY}
          duration={DURATION}
        />
      ))}
    </>
  )
}
