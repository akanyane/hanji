import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
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
        className="flex flex-col gap-4 rounded-lg border border-dashed border-ink-300 p-5 sm:flex-row sm:items-center dark:border-ink-700"
      >
        <Seal text="길" size="md" animate="stamp" delay={0.4} />
        <div className="flex-1">
          <p className="font-serif text-lg font-bold">
            {t('progress.placement.ctaTitle')}
          </p>
          <p className="text-ink-600 dark:text-ink-300">
            {t('progress.placement.ctaText')}
          </p>
        </div>
        <Link
          to="/progress/placement"
          className="self-start rounded-lg bg-ink-900 px-4 py-2 font-medium text-ink-50 transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--color-seal-500)] sm:self-center dark:bg-ink-50 dark:text-ink-900"
        >
          {t('progress.placement.start')}
        </Link>
      </motion.div>
    )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to="/progress"
        className="group flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border border-ink-200 bg-white p-4 shadow-paper transition-shadow hover:shadow-lift dark:border-ink-800 dark:bg-ink-900"
      >
        <span className="flex items-center gap-3">
          <Seal text={String(stats.level.level)} size="sm" />
          <span className="text-sm text-ink-500 dark:text-ink-400">
            {t('progress.dashboard.level')}
          </span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-serif text-2xl font-bold tabular-nums">
            <AnimatedNumber value={stats.xp} />
          </span>
          <span className="text-sm text-ink-500 dark:text-ink-400">XP</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-serif text-2xl font-bold tabular-nums text-seal-600 dark:text-seal-400">
            {stats.streak.current}
          </span>
          <span className="text-sm text-ink-500 dark:text-ink-400">
            {t('progress.dashboard.streak')}
          </span>
        </span>
        <span className="ml-auto text-sm font-medium text-ink-700 transition-transform group-hover:translate-x-1 dark:text-ink-200">
          {t('nav.progress')} →
        </span>
      </Link>
    </motion.div>
  )
}
