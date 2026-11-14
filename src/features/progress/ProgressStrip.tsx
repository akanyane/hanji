import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
import { TodaySummary } from '../today/TodaySummary'
import { useProgress } from './useProgress'

/** Home page: the placement test invitation for newcomers, else today's session. */
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

  return <TodaySummary />
}
