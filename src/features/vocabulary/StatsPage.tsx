import { motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { fadeUp, stagger } from '../../components/motion/presets'
import { useReviewLogs, useSrsCards } from '../../db/queries'
import { useLocale } from '../../i18n/useLocalized'
import {
  DAY_MS,
  dueForecast,
  retentionRate,
  reviewsPerDay,
} from '../../lib/srs/scheduler'

const CHART_DAYS = 14
/** Cards whose next interval is at least this long count as "well known". */
const MATURE_DAYS = 21

function BarChart({
  title,
  values,
  labels,
  color,
}: {
  title: string
  values: number[]
  labels: string[]
  color: string
}) {
  const max = Math.max(1, ...values)
  return (
    <figure className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-4 shadow-paper dark:bg-ink-900">
      <figcaption className="font-semibold">{title}</figcaption>
      <div className="flex h-40 items-end gap-1" aria-hidden="true">
        {values.map((v, i) => (
          <div
            key={labels[i]}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            {v > 0 && (
              <span className="text-[10px] text-ink-500 dark:text-ink-400">
                {v}
              </span>
            )}
            <motion.div
              className={`w-full rounded-t-md ${color}`}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 18,
                delay: i * 0.03,
              }}
              style={{ minHeight: v > 0 ? 4 : 0 }}
            />
          </div>
        ))}
      </div>
      <div
        className="flex gap-1 text-[10px] text-ink-500 dark:text-ink-400"
        aria-hidden="true"
      >
        {labels.map((label, i) => (
          <span key={label} className="flex-1 text-center">
            {i % 2 === 0 ? label : ''}
          </span>
        ))}
      </div>
      {/* Same data as a table for screen readers. */}
      <table className="sr-only">
        <tbody>
          {values.map((v, i) => (
            <tr key={labels[i]}>
              <th scope="row">{labels[i]}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

export function StatsPage() {
  const { t } = useTranslation()
  const locale = useLocale()
  const { data: cards = [] } = useSrsCards()
  const { data: logs = [] } = useReviewLogs(30)
  const now = useMemo(() => new Date(), [])

  const dayLabel = (offset: number) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
    }).format(new Date(now.getTime() + offset * DAY_MS))

  const past = reviewsPerDay(
    logs.map((l) => l.reviewedAt),
    now,
    CHART_DAYS,
  )
  const future = dueForecast(
    cards.map((c) => c.dueAt),
    now,
    CHART_DAYS,
  )
  const retention = retentionRate(logs)
  const mature = cards.filter((c) => c.card.scheduledDays >= MATURE_DAYS).length

  if (cards.length === 0) {
    return (
      <p className="py-12 text-center text-ink-500 dark:text-ink-400">
        {t('vocabulary.stats.noData')}
      </p>
    )
  }

  const tiles = [
    { label: t('vocabulary.stats.studied'), value: cards.length, suffix: '' },
    { label: t('vocabulary.stats.mature'), value: mature, suffix: '' },
    {
      label: t('vocabulary.stats.reviewsToday'),
      value: past[past.length - 1],
      suffix: '',
    },
  ]

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((tile) => (
          <motion.div
            key={tile.label}
            variants={fadeUp}
            className="rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-4 shadow-paper dark:bg-ink-900"
          >
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {tile.label}
            </p>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={tile.value} />
            </p>
          </motion.div>
        ))}
        <motion.div
          variants={fadeUp}
          className="rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-4 shadow-paper dark:bg-ink-900"
        >
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {t('vocabulary.stats.retention')}
          </p>
          <p className="text-3xl font-bold">
            {retention === null ? (
              <span className="text-base font-normal">
                {t('vocabulary.stats.retentionNone')}
              </span>
            ) : (
              <>
                <AnimatedNumber value={Math.round(retention * 100)} />%
              </>
            )}
          </p>
        </motion.div>
      </div>
      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
        <BarChart
          title={t('vocabulary.stats.reviewsChart')}
          values={past}
          labels={past.map((_, i) =>
            i === CHART_DAYS - 1
              ? t('vocabulary.stats.today')
              : dayLabel(i - (CHART_DAYS - 1)),
          )}
          color="panel-ink"
        />
        <BarChart
          title={t('vocabulary.stats.forecastChart')}
          values={future}
          labels={future.map((_, i) =>
            i === 0 ? t('vocabulary.stats.today') : dayLabel(i),
          )}
          color="panel-seal"
        />
      </motion.div>
    </motion.div>
  )
}
