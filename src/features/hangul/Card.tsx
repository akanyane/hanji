import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cardHover, cardTap } from '../../components/motion/presets'
import type { HangulEntry } from '../../content/hangul'

const ACCENT: Record<HangulEntry['category'], string> = {
  vowel: 'from-violet-500/15',
  consonant: 'from-sky-500/15',
  final: 'from-amber-500/15',
  syllable: 'from-emerald-500/15',
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
        className={`flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-slate-300 bg-gradient-to-br ${ACCENT[entry.category]} to-transparent bg-white p-2 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800`}
      >
        <span lang="ko" className="text-4xl font-semibold sm:text-5xl">
          {entry.hangul}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {romanization}
        </span>
      </motion.div>
    </Link>
  )
}
