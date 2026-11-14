import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cardHover, cardTap } from '../../components/motion/presets'
import type { HangulEntry } from '../../content/hangul'

// Category tick in the corner of each tile.
const ACCENT: Record<HangulEntry['category'], string> = {
  vowel: 'bg-seal-500',
  consonant: 'bg-pine-600',
  final: 'bg-amber-400',
  syllable: 'bg-ink-700 dark:bg-ink-300',
}

export function Card({ entry }: { entry: HangulEntry }) {
  const { t } = useTranslation()
  const romanization = entry.romanization || t('common.silent')

  return (
    <Link
      to="/hangul/$entryId"
      params={{ entryId: entry.id }}
      aria-label={`${entry.hangul}, ${t(`hangul.category.${entry.category}`)}, ${romanization}`}
      className="block rounded-xl"
    >
      <motion.div
        whileHover={cardHover}
        whileTap={cardTap}
        className="group relative flex aspect-square w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-ink-200 bg-white p-2 shadow-paper dark:border-ink-800 dark:bg-ink-900"
      >
        <span
          aria-hidden="true"
          className={`absolute top-2 left-2 h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-[2.5] ${ACCENT[entry.category]}`}
        />
        <span
          lang="ko"
          className="font-serif text-4xl font-bold transition-colors group-hover:text-seal-600 sm:text-5xl dark:group-hover:text-seal-400"
        >
          {entry.hangul}
        </span>
        <span className="text-sm text-ink-500 dark:text-ink-400">
          {romanization}
        </span>
      </motion.div>
    </Link>
  )
}
