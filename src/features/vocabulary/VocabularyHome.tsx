import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { fadeUp, stagger } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { useReviewLogs } from '../../db/queries'
import type { StudyMode } from '../../db/types'
import { daysBetween } from '../../lib/srs/scheduler'
import {
  NEW_PER_SESSION_MAX,
  settingsActions,
  useSettings,
} from '../../stores/settings'
import { DeckCard } from './DeckCard'
import { useDueDates } from './hooks'
import { builtInDecks, deckCounts } from './logic'
import { ModePicker } from './ModePicker'

const SUGGESTED = ['level-1', 'theme-greetings', 'theme-food', 'theme-people']

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-lg ${accent} p-4 shadow-paper`}
    >
      <p className="text-sm opacity-85">{label}</p>
      <p className="font-serif text-4xl font-bold">
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  )
}

export function VocabularyHome() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { dueDates } = useDueDates()
  const { data: logs } = useReviewLogs(1)
  const newPerSession = useSettings((s) => s.newPerSession)
  const [mode, setMode] = useState<StudyMode>('flashcards')

  const now = useMemo(() => new Date(), [])
  const all = builtInDecks()[0]
  const counts = deckCounts(all.itemIds, dueDates, now)
  const reviewedToday = (logs ?? []).filter(
    (l) => daysBetween(l.reviewedAt, now) === 0,
  ).length
  const suggested = builtInDecks().filter((d) => SUGGESTED.includes(d.id))
  const modeParam = mode === 'flashcards' ? undefined : mode

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        variants={stagger(0, 0.06)}
        initial="hidden"
        animate="visible"
      >
        <Stat
          label={t('vocabulary.dashboard.dueNow')}
          value={counts.due}
          accent="panel-seal"
        />
        <Stat
          label={t('vocabulary.dashboard.learning')}
          value={counts.total - counts.fresh}
          accent="panel-pine"
        />
        <Stat
          label={t('vocabulary.dashboard.reviewedToday')}
          value={reviewedToday}
          accent="panel-ink"
        />
        <Stat
          label={t('vocabulary.dashboard.newToday')}
          value={newPerSession}
          accent="panel-gold"
        />
      </motion.div>

      <ModePicker mode={mode} onChange={setMode} />

      <div className="flex flex-col items-center gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-6 text-center shadow-paper dark:bg-ink-900">
        {counts.due === 0 && (
          <p className="text-ink-600 dark:text-ink-300">
            {t('vocabulary.dashboard.allCaughtUp')}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {counts.due > 0 && (
            <Button
              className="px-8 py-3 text-lg"
              onClick={() =>
                navigate({
                  to: '/vocabulary/study',
                  search: { deck: 'all', mode: modeParam },
                })
              }
            >
              {t('vocabulary.dashboard.startReview')} ({counts.due})
            </Button>
          )}
          <Button
            variant={counts.due > 0 ? 'secondary' : 'primary'}
            className="px-6 py-3"
            onClick={() =>
              navigate({
                to: '/vocabulary/study',
                search: { deck: 'level-1', mode: modeParam },
              })
            }
          >
            {t('vocabulary.dashboard.learnNew')}
          </Button>
        </div>
        <label className="flex items-center gap-3 text-sm">
          {t('vocabulary.dashboard.newPerSession')}
          <input
            type="number"
            min={0}
            max={NEW_PER_SESSION_MAX}
            value={newPerSession}
            onChange={(e) =>
              settingsActions.setNewPerSession(Number(e.target.value))
            }
            className="w-20 rounded-lg border border-ink-300 bg-white px-3 py-1 dark:border-ink-600 dark:bg-ink-900"
          />
        </label>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {t('vocabulary.dashboard.yourDecks')}
          </h2>
          <Link
            to="/vocabulary/decks"
            className="text-sm text-pine-700 hover:underline dark:text-pine-400"
          >
            {t('vocabulary.dashboard.seeAllDecks')} →
          </Link>
        </div>
        <motion.ul
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          variants={stagger(0.1, 0.06)}
          initial="hidden"
          animate="visible"
        >
          {suggested.map((deck) => (
            <motion.li key={deck.id} variants={fadeUp}>
              <DeckCard
                deck={deck}
                counts={deckCounts(deck.itemIds, dueDates, now)}
                mode={mode}
              />
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </div>
  )
}
