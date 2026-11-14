import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/cn'

/**
 * Teacher's grading mark, painted in red ink: in Korea a circle (동그라미)
 * means right and a slash means wrong. Decorative; the text says it too.
 */
export function InkMark({
  kind,
  className,
}: {
  kind: 'correct' | 'wrong'
  className?: string
}) {
  const reduced = useReducedMotion()
  const draw = reduced
    ? {}
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
        transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] as const },
      }
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn(
        'inline-block h-6 w-6 shrink-0 align-middle',
        kind === 'correct' ? 'text-seal-500' : 'text-ink-500 dark:text-ink-400',
        className,
      )}
    >
      {kind === 'correct' ? (
        <motion.path
          d="M22 6.5 C 14 3, 4.5 8, 5 17 C 5.5 25.5, 16 29, 23 24.5 C 29 20.5, 28.5 11, 21 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          {...draw}
        />
      ) : (
        <motion.path
          d="M8 25 C 13 18, 19 12, 25 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          {...draw}
        />
      )}
    </svg>
  )
}

/** Speaker glyph shared by audio buttons. */
export function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('h-5 w-5', className)}
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7l-1.4-1.4a3 3 0 0 0 0-4.2l1.4-1.4Zm2.8-2.8a9 9 0 0 1 0 12.6l-1.4-1.4a7 7 0 0 0 0-9.8l1.4-1.4Z" />
    </svg>
  )
}

/** Microphone glyph. */
export function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('h-5 w-5', className)}
    >
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" />
    </svg>
  )
}
