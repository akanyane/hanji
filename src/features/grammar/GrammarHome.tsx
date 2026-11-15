import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { GRAMMAR_LESSONS } from '../../content/grammar'
import { useGrammarCards, useQuizSummaries } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'

export const lessonQuizId = (lessonId: string) => `grammar:${lessonId}`

export function GrammarHome() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { data: summaries = {} } = useQuizSummaries('grammar:')
  const { data: grammarCards = [] } = useGrammarCards()
  const dueCount = grammarCards.filter(
    (c) => c.dueAt.getTime() <= Date.now(),
  ).length
  const levels = [
    ...new Set(GRAMMAR_LESSONS.map((lesson) => lesson.level)),
  ].sort()

  return (
    <div className="flex flex-col gap-8">
      {dueCount > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Link
            to="/grammar/review"
            className="group flex items-center gap-4 rounded-lg border border-seal-300 bg-seal-50 p-4 transition-shadow hover:shadow-lift dark:border-seal-800 dark:bg-seal-950/40"
          >
            <Seal text="복습" size="md" animate="stamp" delay={0.2} />
            <span className="flex-1 font-semibold">
              {t('grammar.review.banner', { count: dueCount })}
            </span>
            <span className="text-sm font-medium transition-transform group-hover:translate-x-1">
              {t('grammar.tabs.review')} →
            </span>
          </Link>
        </motion.div>
      )}
      {levels.map((level) => {
        const lessons = GRAMMAR_LESSONS.filter(
          (lesson) => lesson.level === level,
        )
        return (
          <section key={level} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">
              {t('vocabulary.deck.level', { level })}{' '}
              <span className="text-sm font-normal text-ink-500 dark:text-ink-400">
                · {t('grammar.home.lessonCount', { count: lessons.length })}
              </span>
            </h2>
            <motion.ol
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger(0, 0.04)}
              initial="hidden"
              animate="visible"
            >
              {lessons.map((lesson) => {
                const summary = summaries[lessonQuizId(lesson.id)]
                const total = lesson.exercises.length
                const done = summary && summary.attempts > 0
                const perfect = done && summary.bestScore === total
                return (
                  <motion.li key={lesson.id} variants={fadeUp}>
                    <Link
                      to="/grammar/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="block h-full rounded-lg"
                    >
                      <motion.div
                        whileHover={cardHover}
                        whileTap={cardTap}
                        className="group flex h-full flex-col gap-2 rounded-lg border border-ink-200 bg-white p-4 shadow-paper dark:border-ink-700 dark:bg-ink-900"
                      >
                        <span
                          lang="ko"
                          className="font-serif text-2xl font-bold transition-colors group-hover:text-seal-600 dark:group-hover:text-seal-400"
                        >
                          {lesson.pattern}
                        </span>
                        <span className="font-semibold">{l(lesson.title)}</span>
                        <span className="text-sm text-ink-600 dark:text-ink-300">
                          {l(lesson.summary)}
                        </span>
                        <span
                          className={`mt-auto self-start rounded-full px-2 py-0.5 text-xs font-medium ${
                            perfect
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                              : done
                                ? 'bg-pine-100 text-pine-800 dark:bg-pine-900/50 dark:text-pine-200'
                                : 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300'
                          }`}
                        >
                          {done
                            ? `${perfect ? '★ ' : ''}${t('grammar.home.bestScore', { score: summary.bestScore, total })}`
                            : t('grammar.home.notStarted')}
                        </span>
                      </motion.div>
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ol>
          </section>
        )
      })}
    </div>
  )
}
