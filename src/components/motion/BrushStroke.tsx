import { motion } from 'motion/react'
import { cn } from '../../lib/cn'

// Hand-drawn brush paths (viewBox 0 0 300 24). Several, so repeated headers
// don't all look identical.
const PATHS = [
  'M4 14 C 40 6, 80 18, 130 11 S 230 6, 296 12',
  'M3 12 C 50 18, 95 5, 150 12 S 240 17, 297 9',
  'M5 15 C 60 9, 110 13, 160 9 S 250 14, 295 10',
]

/**
 * A brush stroke that paints itself left to right (seal red by default).
 * Decorative only.
 */
export function BrushStroke({
  variant = 0,
  className,
  delay = 0.15,
}: {
  variant?: number
  className?: string
  delay?: number
}) {
  const d = PATHS[variant % PATHS.length]
  return (
    <svg
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('h-3 w-40 text-seal-500', className)}
    >
      {/* Dry-brush texture: a faint wider stroke under the main one. */}
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        opacity={0.25}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.75,
          delay: delay + 0.05,
          ease: [0.65, 0, 0.35, 1],
        }}
      />
    </svg>
  )
}
