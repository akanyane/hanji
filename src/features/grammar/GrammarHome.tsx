import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { GRAMMAR_LESSONS } from '../../content/grammar'
import { useQuizSummaries } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'

export const lessonQuizId = (lessonId: string) => `grammar:${lessonId}`

export function GrammarHome() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { data: summaries = {} } = useQuizSummaries('grammar:')
  const levels = [
    ...new Set(GRAMMAR_LESSONS.map((lesson) => lesson.level)),
  ].sort()

  return (
    <div className="flex flex-col gap-8">
      {levels.map((level) => {
        const lessons = GRAMMAR_LESSONS.filter(
          (lesson) => lesson.level === level,
        )
        return (
          <section key={level} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">
              {t('vocabulary.deck.level', { level })}{' '}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
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
                      className="block h-full rounded-2xl"
                    >
                      <motion.div
                        whileHover={cardHover}
                        whileTap={cardTap}
                        className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                      >
                        <span
                          lang="ko"
                          className="text-2xl font-bold text-sky-700 dark:text-sky-300"
                        >
                          {lesson.pattern}
                        </span>
                        <span className="font-semibold">{l(lesson.title)}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {l(lesson.summary)}
                        </span>
                        <span
                          className={`mt-auto self-start rounded-full px-2 py-0.5 text-xs font-medium ${
                            perfect
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                              : done
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
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
