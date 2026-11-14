import { motion } from 'motion/react'
import { softSpring } from '../motion/presets'

interface ProgressBarProps {
  value: number
  max: number
  label: string
}

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
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={softSpring}
      />
    </div>
  )
}
