import { motion } from 'motion/react'
import { cn } from '../../lib/cn'
import type { SimilarityResult } from '../../lib/similarity/jamoSimilarity'

/** The expected sentence, colored by how well each syllable was matched. */
export function SyllableDiff({
  result,
  className,
}: {
  result: SimilarityResult
  className?: string
}) {
  return (
    <p
      lang="ko"
      className={cn(
        'flex flex-wrap justify-center gap-x-0.5 gap-y-1 text-2xl',
        className,
      )}
    >
      {result.syllables.map((s, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: positional diff of a fixed sentence
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={cn(
            'rounded px-0.5',
            s.status === 'correct' && 'text-emerald-600 dark:text-emerald-400',
            s.status === 'partial' &&
              'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
            s.status === 'wrong' &&
              'bg-rose-100 text-rose-800 underline decoration-wavy dark:bg-rose-900/60 dark:text-rose-200',
            s.status === 'ignored' && 'text-slate-400',
          )}
        >
          {s.char === ' ' ? ' ' : s.char}
        </motion.span>
      ))}
    </p>
  )
}
