import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cardHover, fadeUp, stagger } from '../../components/motion/presets'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { cn } from '../../lib/cn'
import { useProgress } from './useProgress'

export function Achievements() {
  const { t } = useTranslation()
  const view = useProgress()
  if (!view) return <p role="status">{t('progress.loading')}</p>
  const unlocked = view.achievements.filter((a) => a.unlocked).length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-slate-600 dark:text-slate-300">
        {t('progress.dashboard.unlockedCount', {
          count: unlocked,
          total: view.achievements.length,
        })}
      </p>
      <motion.ul
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        variants={stagger(0, 0.04)}
        initial="hidden"
        animate="visible"
      >
        {view.achievements.map(({ achievement, value, unlocked, ratio }) => (
          <motion.li
            key={achievement.id}
            variants={fadeUp}
            whileHover={cardHover}
            className={cn(
              'flex items-center gap-3 rounded-2xl p-4 shadow-sm',
              unlocked
                ? 'bg-gradient-to-br from-amber-100 to-yellow-50 ring-2 ring-amber-300 dark:from-amber-900/50 dark:to-slate-800 dark:ring-amber-600'
                : 'bg-white dark:bg-slate-800',
            )}
          >
            <motion.span
              aria-hidden="true"
              className={cn(
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl',
                unlocked
                  ? 'bg-white shadow dark:bg-slate-700'
                  : 'bg-slate-100 opacity-60 grayscale dark:bg-slate-700',
              )}
              animate={unlocked ? { rotate: [0, -8, 8, 0] } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {achievement.icon}
            </motion.span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="font-semibold">
                {t(
                  `progress.achievements.items.${achievement.id}.title` as never,
                )}
                <span className="sr-only">
                  {' '}
                  —{' '}
                  {unlocked
                    ? t('progress.achievements.unlockedLabel')
                    : t('progress.achievements.lockedLabel')}
                </span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t(
                  `progress.achievements.items.${achievement.id}.description` as never,
                )}
              </p>
              {unlocked ? (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  ✓ {t('progress.achievements.unlockedLabel')}
                </span>
              ) : (
                <ProgressBar
                  value={Math.round(ratio * 100)}
                  max={100}
                  label={`${Math.min(value, achievement.goal)} / ${achievement.goal}`}
                />
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
