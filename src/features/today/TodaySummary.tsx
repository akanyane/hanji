import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { GoalRing } from './GoalRing'
import { useToday } from './useToday'

/** Home page card: daily goal, tasks done and a button into today's session. */
export function TodaySummary() {
  const { t } = useTranslation()
  const view = useToday()
  if (!view) return null

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to="/today"
        className="group flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-ink-200 bg-white p-4 shadow-paper transition-shadow hover:shadow-lift dark:border-ink-800 dark:bg-ink-900"
      >
        <GoalRing xp={view.goal.xp} goal={view.goal.goal} size="sm" />
        <span className="flex flex-col">
          <span className="font-serif text-lg font-bold">
            {t('today.title')}
          </span>
          <span className="text-sm text-ink-600 dark:text-ink-300">
            {t('today.progress', { done: view.done, total: view.tasks.length })}
            {' · '}
            {t('today.goalOf', { xp: view.goal.xp, goal: view.goal.goal })}
          </span>
        </span>
        {view.streak.current > 0 && (
          <span className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-seal-600 tabular-nums dark:text-seal-400">
              {view.streak.current}
            </span>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              {t('progress.dashboard.streak')}
            </span>
          </span>
        )}
        <span className="ml-auto rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-ink-50 transition-all group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-[3px_3px_0_0_var(--color-seal-500)] dark:bg-ink-50 dark:text-ink-900">
          {t('today.continue')} →
        </span>
      </Link>
    </motion.div>
  )
}
