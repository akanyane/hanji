import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
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
      <p className="text-ink-600 dark:text-ink-300">
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
              'flex items-center gap-4 rounded-lg border p-4',
              unlocked
                ? 'border-ink-200 bg-white shadow-paper dark:border-ink-800 dark:bg-ink-900'
                : 'border-dashed border-ink-300 dark:border-ink-700',
            )}
          >
            <Seal
              text={achievement.icon}
              size="lg"
              muted={!unlocked}
              animate={unlocked ? 'stamp' : 'none'}
              delay={0.2}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="font-bold">
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
              <p className="text-sm text-ink-600 dark:text-ink-300">
                {t(
                  `progress.achievements.items.${achievement.id}.description` as never,
                )}
              </p>
              {unlocked ? (
                <span className="text-xs font-semibold text-seal-700 dark:text-seal-300">
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
