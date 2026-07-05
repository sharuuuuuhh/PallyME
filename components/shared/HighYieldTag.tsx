'use client'

interface HighYieldTagProps {
  frequency?: number
  totalPapers?: number
  compact?: boolean
}

export default function HighYieldTag({ frequency, totalPapers, compact = false }: HighYieldTagProps) {
  const label =
    frequency && totalPapers
      ? `🔥 ${frequency} of ${totalPapers} papers`
      : '🔥 High-yield'

  const title =
    frequency && totalPapers
      ? `🔥 High-yield — showed up in ${frequency} of the last ${totalPapers} papers.`
      : '🔥 High-yield topic'

  return (
    <span className="high-yield-tag" title={title} aria-label={title}>
      {compact ? '🔥' : label}
    </span>
  )
}
