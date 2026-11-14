import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/cn'

interface SealProps {
  /** One to four characters (Hangul or Hanja), like a real 도장. */
  text: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** "stamp" plays the press-down animation once on mount. */
  animate?: 'stamp' | 'none'
  /** Grey "not yet earned" variant (outline only). */
  muted?: boolean
  delay?: number
  className?: string
}

const SIZES = {
  sm: 'h-8 w-8 text-sm rounded-[6px]',
  md: 'h-12 w-12 text-lg rounded-[8px]',
  lg: 'h-16 w-16 text-2xl rounded-[10px]',
  xl: 'h-24 w-24 text-4xl rounded-[14px]',
}

/**
 * A red seal (도장): vermilion square, carved inner border, characters in
 * serif. Stamping slams it down with a slight rotation and an ink halo.
 */
export function Seal({
  text,
  size = 'md',
  animate = 'none',
  muted = false,
  delay = 0,
  className,
}: SealProps) {
  const reduced = useReducedMotion()
  const chars = [...text]
  const grid = chars.length === 4
  const stamp = animate === 'stamp' && !reduced

  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center font-serif font-bold leading-none',
        SIZES[size],
        muted
          ? 'border-2 border-dashed border-ink-300 text-ink-400 dark:border-ink-600 dark:text-ink-500'
          : 'bg-seal-600 text-white shadow-[inset_0_0_0_2px_var(--color-seal-600),inset_0_0_0_4px_rgb(255_253_248/0.85)] dark:bg-seal-700',
        className,
      )}
      initial={stamp ? { scale: 2.2, rotate: -18, opacity: 0 } : false}
      animate={
        stamp
          ? { scale: 1, rotate: -4, opacity: 1 }
          : { rotate: muted ? 0 : -4 }
      }
      transition={
        stamp
          ? { type: 'spring', stiffness: 520, damping: 17, delay }
          : { duration: 0 }
      }
    >
      {stamp && (
        // Ink splash ring when the seal hits the paper.
        <motion.span
          className="absolute inset-0 rounded-[inherit] border-2 border-seal-500"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.55, delay: delay + 0.12, ease: 'easeOut' }}
        />
      )}
      <span
        lang="ko"
        className={cn(
          grid &&
            'grid grid-cols-2 gap-x-[0.05em] text-[0.62em] leading-[1.05]',
        )}
        style={grid ? { direction: 'rtl' } : undefined}
      >
        {grid ? (
          chars.map((c, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: characters can repeat
            <span key={i}>{c}</span>
          ))
        ) : chars.length === 2 ? (
          <span className="text-[0.72em]">{text}</span>
        ) : (
          text
        )}
      </span>
    </motion.span>
  )
}
