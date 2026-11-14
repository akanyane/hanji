import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { inkEase } from '../../components/motion/presets'
import { cn } from '../../lib/cn'

/**
 * Daily goal as a brush circle (ensō) that paints itself as XP comes in.
 * The faint full circle is the goal; the vermilion stroke is today's XP.
 */
export function GoalRing({
  xp,
  goal,
  size = 'lg',
  className,
}: {
  xp: number
  goal: number
  size?: 'sm' | 'lg'
  className?: string
}) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const ratio = Math.min(1, goal > 0 ? xp / goal : 0)
  const done = ratio >= 1

  return (
    <div
      role="img"
      aria-label={t('today.goalOf', { xp, goal })}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center',
        size === 'lg' ? 'h-36 w-36' : 'h-16 w-16',
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-current opacity-15"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--color-seal-500)"
          strokeWidth="9"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          // At zero XP the round cap would still draw a dot: hide it.
          animate={{
            pathLength: Math.max(ratio, 0.001),
            opacity: ratio > 0 ? 1 : 0,
          }}
          transition={{ duration: 1.2, ease: inkEase, delay: 0.2 }}
        />
      </svg>
      {size === 'lg' ? (
        <div className="relative flex flex-col items-center leading-none">
          <span className="font-serif text-4xl font-bold">
            <AnimatedNumber value={xp} />
          </span>
          <span className="mt-1 text-xs opacity-75">/ {goal} XP</span>
        </div>
      ) : (
        <span className="relative font-serif text-sm font-bold">
          {done ? '✓' : `${Math.round(ratio * 100)}%`}
        </span>
      )}
    </div>
  )
}
