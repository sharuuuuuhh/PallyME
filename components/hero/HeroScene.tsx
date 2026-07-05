'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Lined paper canvas texture ───────────────────────────────────────────────
function createPaperTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 640
  const ctx = canvas.getContext('2d')!

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

  // Red margin
  ctx.strokeStyle = 'rgba(255, 100, 80, 0.25)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(72, 0)
  ctx.lineTo(72, 640)
  ctx.stroke()

  // Simulated scribbles
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

// ── Single animated paper sheet ──────────────────────────────────────────────
const DELAY = 1.5    // seconds before reassembly starts
const DURATION = 4.5 // seconds for animation

function AnimatedSheet({
  index,
  total,
  cursorOffset,
}: {
  index: number
  total: number
  cursorOffset: React.MutableRefObject<THREE.Vector2>
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useMemo(() => createPaperTexture(index), [index])
  const startTimeRef = useRef<number | null>(null)

  const initial = useMemo(() => ({
    position: new THREE.Vector3(
      Math.sin(index * 137.5) * 3.5,
      Math.cos(index * 97.3) * 2.0,
      index * 0.12 - 1
    ),
    rotation: new THREE.Euler(
      Math.sin(index * 0.9) * 0.5,
      Math.cos(index * 1.3) * 0.6,
      Math.sin(index * 1.7) * 0.8
    ),
  }), [index])

  const final = useMemo(() => ({
    position: new THREE.Vector3(
      Math.sin(index * 0.3) * 0.02,
      -(total / 2) * 0.04 + index * 0.04,
      index * 0.003
    ),
    rotation: new THREE.Euler(0, 0, Math.sin(index * 2.1) * 0.03),
  }), [index, total])

  // Use R3F's built-in clock (no THREE.Clock deprecation)
  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const elapsed = clock.elapsedTime
    const rawT = Math.max(0, elapsed - DELAY) / DURATION
    const t = Math.min(rawT, 1)
    const ease = 1 - Math.pow(1 - t, 3)

    const cursor = cursorOffset.current

    meshRef.current.position.lerpVectors(initial.position, final.position, ease)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      initial.rotation.x,
      final.rotation.x + cursor.y * 0.12,
      ease
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      initial.rotation.y,
      final.rotation.y + cursor.x * 0.18,
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

// ── Scene ─────────────────────────────────────────────────────────────────────
const SHEET_COUNT = 9

function Scene({ cursorOffset }: { cursorOffset: React.MutableRefObject<THREE.Vector2> }) {
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
          cursorOffset={cursorOffset}
        />
      ))}
    </>
  )
}

// ── Exported canvas ──────────────────────────────────────────────────────────
export default function HeroScene() {
  const cursorOffset = useRef(new THREE.Vector2(0, 0))
  const targetCursor = useRef(new THREE.Vector2(0, 0))

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetCursor.current.set(
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2
      )
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Smooth cursor lerp (outside R3F loop)
  useEffect(() => {
    let frameId: number
    const tick = () => {
      cursorOffset.current.lerp(targetCursor.current, 0.06)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <Scene cursorOffset={cursorOffset} />
      </Canvas>
    </div>
  )
}
