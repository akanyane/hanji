import { Link } from '@tanstack/react-router'
import type { TFunction } from 'i18next'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { fadeUp, stagger } from '../../components/motion/presets'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { Skill } from '../../db/types'
import { useLocale } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { type ProgressStats, SKILLS } from '../../lib/progress/progress'
import { type ProgressView, useProgress } from './useProgress'

const SKILL_ROUTES = {
  hangul: '/hangul',
  vocabulary: '/vocabulary',
  grammar: '/grammar',
  pronunciation: '/pronunciation',
  listening: '/listening',
  speaking: '/speaking',
  reading: '/reading',
  writing: '/writing',
  numbers: '/numbers/practice',
} as const satisfies Record<Skill, string>

export function formatDuration(ms: number, t: TFunction): string {
  const minutes = Math.floor(ms / 60_000)
  if (minutes < 60) return t('progress.dashboard.minutes', { count: minutes })
  return t('progress.dashboard.hoursMinutes', {
    hours: Math.floor(minutes / 60),
    minutes: String(minutes % 60).padStart(2, '0'),
  })
}

function StatTile({
  icon,
  label,
  value,
  detail,
}: {
  icon: string
  label: string
  value: number | string
  detail?: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800"
    >
      <span className="text-sm text-slate-500 dark:text-slate-400">
        <span aria-hidden="true">{icon}</span> {label}
      </span>
      <span className="text-3xl font-extrabold tabular-nums">
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </span>
      {detail && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {detail}
        </span>
      )}
    </motion.div>
  )
}

/** Sequential single-hue scale (light → dark) for the activity heatmap. */
function heatClass(xp: number, max: number): string {
  if (xp === 0) return 'bg-slate-200 dark:bg-slate-700'
  const ratio = xp / max
  if (ratio > 0.75) return 'bg-sky-700 dark:bg-sky-300'
  if (ratio > 0.5) return 'bg-sky-500 dark:bg-sky-400'
  if (ratio > 0.25) return 'bg-sky-400 dark:bg-sky-600'
  return 'bg-sky-200 dark:bg-sky-800'
}

function ActivityHeatmap({ daily }: { daily: ProgressStats['daily'] }) {
  const { t } = useTranslation()
  const locale = useLocale()
  const max = Math.max(1, ...daily.map((d) => d.xp))
  const activeDays = daily.filter((d) => d.xp > 0).length
  const format = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  })
  const label = (day: string) => {
    const [y, m, d] = day.split('-').map(Number)
    return format.format(new Date(y, m - 1, d))
  }
  // Columns are weeks; the first column starts on the oldest day shown.
  const weeks: (typeof daily)[] = []
  for (let i = 0; i < daily.length; i += 7) weeks.push(daily.slice(i, i + 7))

  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
    >
      <h2 className="text-lg font-semibold">
        {t('progress.dashboard.activity')}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t('progress.dashboard.activitySummary', { count: activeDays })}
      </p>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]" aria-hidden="true">
          {weeks.map((week, w) => (
            <div key={week[0].day} className="flex flex-col gap-[3px]">
              {week.map((d, i) => (
                <motion.div
                  key={d.day}
                  title={t('progress.dashboard.activityCell', {
                    day: label(d.day),
                    count: d.xp,
                  })}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (w * 7 + i) * 0.004 }}
                  className={cn(
                    'h-3.5 w-3.5 rounded-[4px] hover:ring-2 hover:ring-slate-400',
                    heatClass(d.xp, max),
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex items-center gap-1 self-end text-xs text-slate-500 dark:text-slate-400"
        aria-hidden="true"
      >
        {t('progress.dashboard.less')}
        {[0, 0.2, 0.4, 0.6, 1].map((r) => (
          <span key={r} className={cn('h-3 w-3 rounded', heatClass(r, 1))} />
        ))}
        {t('progress.dashboard.more')}
      </div>
      {/* Text alternative for screen readers: the active days. */}
      <ul className="sr-only">
        {daily
          .filter((d) => d.xp > 0)
          .map((d) => (
            <li key={d.day}>
              {t('progress.dashboard.activityCell', {
                day: label(d.day),
                count: d.xp,
              })}
            </li>
          ))}
      </ul>
    </motion.section>
  )
}

function SkillBars({ skills }: { skills: ProgressStats['skills'] }) {
  const { t } = useTranslation()
  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
    >
      <h2 className="text-lg font-semibold">
        {t('progress.dashboard.skills')}
      </h2>
      <ul className="flex flex-col gap-3">
        {SKILLS.map((skill, i) => {
          const s = skills[skill]
          const percent = s.accuracy === null ? 0 : Math.round(s.accuracy * 100)
          return (
            <li key={skill} className="grid gap-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <Link
                  to={SKILL_ROUTES[skill]}
                  className="font-medium hover:text-sky-700 hover:underline dark:hover:text-sky-300"
                >
                  {t(`nav.${skill}`)}
                </Link>
                <span className="text-slate-500 tabular-nums dark:text-slate-400">
                  {s.accuracy === null
                    ? t('progress.dashboard.notPracticed')
                    : t('progress.dashboard.skillAccuracy', {
                        value: percent,
                        count: s.total,
                      })}
                </span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
                // Decorative: the percentage is already written above.
                aria-hidden="true"
              >
                <motion.div
                  className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 80,
                    delay: i * 0.05,
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </motion.section>
  )
}

function NextAchievements({ view }: { view: ProgressView }) {
  const { t } = useTranslation()
  const next = view.achievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3)
  const unlocked = view.achievements.filter((a) => a.unlocked).length

  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {t('progress.dashboard.nextAchievements')}
        </h2>
        <Link
          to="/progress/achievements"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-300"
        >
          {t('progress.dashboard.unlockedCount', {
            count: unlocked,
            total: view.achievements.length,
          })}{' '}
          →
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {next.map(({ achievement, value, ratio }) => (
          <li key={achievement.id} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl grayscale dark:bg-slate-700"
            >
              {achievement.icon}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm font-medium">
                {t(
                  `progress.achievements.items.${achievement.id}.title` as never,
                )}
              </span>
              <ProgressBar
                value={Math.round(ratio * 100)}
                max={100}
                label={`${Math.min(value, achievement.goal)} / ${achievement.goal}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

export function Dashboard() {
  const { t } = useTranslation()
  const view = useProgress()
  if (!view) return <p role="status">{t('progress.loading')}</p>
  const { stats } = view

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={stagger(0, 0.06)}
      initial="hidden"
      animate="visible"
    >
      {view.placement === null && (
        <motion.div
          variants={fadeUp}
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
            className="self-start rounded-full bg-white px-4 py-2 font-semibold text-orange-700 shadow hover:bg-orange-50"
          >
            {t('progress.placement.start')}
          </Link>
        </motion.div>
      )}

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-xl sm:flex-row sm:items-center"
      >
        <motion.div
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-white/20 ring-4 ring-white/40"
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 12 }}
        >
          <span className="text-xs font-medium uppercase tracking-wide text-white/80">
            {t('progress.dashboard.level')}
          </span>
          <span className="text-4xl font-extrabold">
            <AnimatedNumber value={stats.level.level} />
          </span>
        </motion.div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-3xl font-extrabold">
            <AnimatedNumber value={stats.xp} /> XP
          </p>
          <div className="h-3 overflow-hidden rounded-full bg-white/25">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.level.current / stats.level.needed) * 100}%`,
              }}
              transition={{ type: 'spring', stiffness: 60 }}
            />
          </div>
          <p className="text-sm text-white/90">
            {t('progress.dashboard.xpToNext', {
              current: stats.level.current,
              needed: stats.level.needed,
              next: stats.level.level + 1,
            })}
          </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          icon="🔥"
          label={t('progress.dashboard.streak')}
          value={stats.streak.current}
          detail={
            stats.streak.activeToday
              ? t('progress.dashboard.streakToday')
              : stats.streak.current > 0
                ? t('progress.dashboard.streakPending')
                : t('progress.dashboard.streakBest', {
                    count: stats.streak.longest,
                  })
          }
        />
        <StatTile
          icon="⏱️"
          label={t('progress.dashboard.studyTime')}
          value={formatDuration(stats.studyMs, t)}
          detail={t('progress.dashboard.today', {
            value: formatDuration(stats.todayMs, t),
          })}
        />
        <StatTile
          icon="🌱"
          label={t('progress.dashboard.words')}
          value={stats.wordsLearned}
          detail={t('progress.dashboard.wordsSeen', { count: stats.wordsSeen })}
        />
        <StatTile
          icon="✅"
          label={t('progress.dashboard.activities')}
          value={stats.quizzes + stats.reviews}
          detail={t('progress.dashboard.activitiesDetail', {
            quizzes: stats.quizzes,
            reviews: stats.reviews,
          })}
        />
      </div>

      <ActivityHeatmap daily={stats.daily} />
      <div className="grid gap-5 md:grid-cols-2">
        <SkillBars skills={stats.skills} />
        <NextAchievements view={view} />
      </div>
    </motion.div>
  )
}
