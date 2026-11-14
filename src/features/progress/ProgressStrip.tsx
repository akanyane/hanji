import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { useProgress } from './useProgress'

/** Home page summary: level, XP, streak, and the placement test invitation. */
export function ProgressStrip() {
  const { t } = useTranslation()
  const view = useProgress()
  if (!view) return null
  const { stats } = view

  if (view.placement === null && stats.xp === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-lg font-bold">
            🧭 {t('progress.placement.ctaTitle')}
          </p>
          <p className="text-white/90">{t('progress.placement.ctaText')}</p>
        </div>
        <Link
          to="/progress/placement"
          className="self-start rounded-full bg-white px-4 py-2 font-semibold text-orange-700 shadow hover:bg-orange-50 sm:self-center"
        >
          {t('progress.placement.start')}
        </Link>
      </motion.div>
    )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to="/progress"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800 dark:ring-slate-700"
      >
        <span className="font-semibold">
          {t('progress.dashboard.level')}{' '}
          <AnimatedNumber value={stats.level.level} />
        </span>
        <span className="tabular-nums">
          ⭐ <AnimatedNumber value={stats.xp} /> XP
        </span>
        <span>
          🔥 {stats.streak.current} · {t('progress.dashboard.streak')}
        </span>
        <span className="ml-auto text-sm font-medium text-sky-700 dark:text-sky-300">
          {t('nav.progress')} →
        </span>
      </Link>
    </motion.div>
  )
}
