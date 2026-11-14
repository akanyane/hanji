import { motion } from 'motion/react'
import { inkEase } from '../motion/presets'

interface ProgressBarProps {
  value: number
  max: number
  label: string
}

/** An ink line filling a faint ruled track, with a brush-tip highlight. */
export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1)
  const clamped = Math.min(Math.max(value, 0), safeMax)
  const percent = (clamped / safeMax) * 100

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      className="relative h-2 w-full overflow-hidden rounded-full bg-ink-200/80 dark:bg-ink-800"
    >
      <motion.div
        className="relative h-full rounded-full bg-pine-600 dark:bg-pine-400"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.7, ease: inkEase }}
      >
        <span className="absolute inset-y-0 right-0 w-3 rounded-full bg-seal-500" />
      </motion.div>
    </div>
  )
}
