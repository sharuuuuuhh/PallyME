'use client'

interface ModuleBadgeProps {
  id: string   // e.g. "MOD.01"
  className?: string
}

export default function ModuleBadge({ id, className = '' }: ModuleBadgeProps) {
  // Abbreviate: MOD.01 → 01
  const short = id.split('.').pop() ?? id

  return (
    <div className={`module-badge ${className}`} aria-label={`Module ${id}`}>
      {short}
    </div>
  )
}
