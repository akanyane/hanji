import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { type ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  QuizSession,
  type SessionQuestion,
} from '../../components/exercise/QuizSession'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { notesForLesson } from '../../content/culture/notes'
import { GRAMMAR_LESSONS, type GrammarLesson } from '../../content/grammar'
import { useRecordQuizAttempt } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import { conjugate } from '../../lib/conjugation/conjugate'
import { CultureCallout } from '../culture/CultureCallout'
import { lessonQuizId } from './GrammarHome'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </motion.section>
  )
}

/** Renders a gap ("___") in an exercise prompt as a highlighted blank. */
function Gapped({ text }: { text: string }) {
  const [before, after] = text.split('___')
  return (
    <span lang="ko" className="text-2xl font-semibold sm:text-3xl">
      {before}
      <span className="mx-1 inline-block min-w-12 border-b-4 border-sky-500 align-baseline">
        &nbsp;
      </span>
      {after}
    </span>
  )
}

function ConjugationTable({ lesson }: { lesson: GrammarLesson }) {
  const { t } = useTranslation()
  const table = lesson.conjugationTable
  if (!table) return null
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-sm text-slate-500 dark:text-slate-400">
          <tr>
            <th scope="col" className="py-2 pr-4 font-medium">
              {t('grammar.lesson.verb')}
            </th>
            {table.forms.map((form) => (
              <th key={form} scope="col" className="py-2 pr-4 font-medium">
                {form.startsWith('present') ||
                form.startsWith('past') ||
                form.startsWith('future') ||
                form.startsWith('progressive')
                  ? t(
                      `grammar.conjugator.formality.${form.split('.')[1] as 'formal' | 'polite' | 'casual'}`,
                    )
                  : t(
                      `grammar.conjugator.forms.${form.replace('.', '_') as 'want'}`,
                    )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.verbs.map((verb) => {
            const result = conjugate(verb)
            return (
              <tr
                key={verb}
                className="border-t border-slate-100 dark:border-slate-700"
              >
                <th scope="row" className="py-2 pr-4 font-normal">
                  <Link
                    to="/grammar/conjugator"
                    search={{ verb }}
                    lang="ko"
                    className="text-sky-700 hover:underline dark:text-sky-300"
                  >
                    {verb}
                  </Link>
                </th>
                {table.forms.map((form) => (
                  <td
                    key={form}
                    lang="ko"
                    className="py-2 pr-4 text-lg font-semibold"
                  >
                    {result?.forms[form] ?? '—'}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Exercises({ lesson }: { lesson: GrammarLesson }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const { mutate: save } = useRecordQuizAttempt()
  const [round, setRound] = useState(0)
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle')
  const [score, setScore] = useState(0)
  const index = GRAMMAR_LESSONS.findIndex((x) => x.id === lesson.id)
  const next = GRAMMAR_LESSONS[index + 1]

  const questions = useMemo<SessionQuestion[]>(
    () =>
      lesson.exercises.map((ex, i) => ({
        id: `${lesson.id}-${i}`,
        answerId: String(ex.answer),
        choices: ex.choices.map((c, ci) => ({
          id: String(ci),
          label: c,
          lang: 'ko',
        })),
        prompt: (
          <>
            <Gapped text={ex.prompt} />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {l(ex.translation)}
            </span>
          </>
        ),
      })),
    [lesson, l],
  )

  if (state === 'running') {
    return (
      <QuizSession
        key={round}
        questions={questions}
        onComplete={(s) => {
          setScore(s)
          setState('done')
          save({
            quizId: lessonQuizId(lesson.id),
            filter: 'all',
            score: s,
            total: questions.length,
          })
        }}
      />
    )
  }

  if (state === 'done') {
    const total = questions.length
    return (
      <motion.div
        variants={pop}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center gap-3 py-4 text-center"
        role="status"
      >
        {score === total && <Confetti />}
        <p className="text-5xl font-extrabold">
          <AnimatedNumber value={score} />
          <span className="text-2xl text-slate-400">/{total}</span>
        </p>
        <p className="font-semibold">
          {t('grammar.lesson.score', { score, total })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setRound((r) => r + 1)
              setState('running')
            }}
          >
            {t('grammar.lesson.retry')}
          </Button>
          {next && (
            <Link
              to="/grammar/$lessonId"
              params={{ lessonId: next.id }}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2 font-medium text-white shadow-md"
            >
              {t('grammar.lesson.next')} →
            </Link>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex justify-center">
      <Button className="px-8 py-3 text-lg" onClick={() => setState('running')}>
        {t('grammar.lesson.startExercises')}
      </Button>
    </div>
  )
}

export function LessonPage({ lesson }: { lesson: GrammarLesson }) {
  const { t } = useTranslation()
  const l = useLocalized()

  return (
    <motion.div
      key={lesson.id}
      className="flex flex-col gap-5"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Link
        to="/grammar"
        className="self-start text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
      >
        ← {t('grammar.lesson.back')}
      </Link>

      <motion.header
        variants={fadeUp}
        className="rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 p-6 text-white shadow-lg"
      >
        <p className="text-sm text-white/80">
          {t('vocabulary.deck.level', { level: lesson.level })}
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">{l(lesson.title)}</h1>
        <p lang="ko" className="mt-1 text-3xl font-extrabold">
          {lesson.pattern}
        </p>
        <p className="mt-2 text-white/90">{l(lesson.summary)}</p>
      </motion.header>

      <Section title={t('grammar.lesson.explanation')}>
        {lesson.explanation.map((p) => (
          <p key={p.en} className="leading-relaxed">
            {l(p)}
          </p>
        ))}
      </Section>

      <Section title={t('grammar.lesson.formation')}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500 dark:text-slate-400">
              <tr>
                <th scope="col" className="py-2 pr-4 font-medium">
                  {t('grammar.lesson.when')}
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  {t('grammar.lesson.form')}
                </th>
                <th scope="col" className="py-2 font-medium">
                  {t('grammar.lesson.example')}
                </th>
              </tr>
            </thead>
            <tbody>
              {lesson.formation.map((row) => (
                <tr
                  key={row.form + row.example}
                  className="border-t border-slate-100 dark:border-slate-700"
                >
                  <td className="py-2 pr-4">{l(row.when)}</td>
                  <td
                    lang="ko"
                    className="py-2 pr-4 text-lg font-bold text-sky-700 dark:text-sky-300"
                  >
                    {row.form}
                  </td>
                  <td lang="ko" className="py-2 text-lg">
                    {row.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {lesson.conjugationTable && (
        <Section title={t('grammar.lesson.conjugation')}>
          <ConjugationTable lesson={lesson} />
        </Section>
      )}

      <Section title={t('grammar.lesson.examples')}>
        <ul className="flex flex-col gap-3">
          {lesson.examples.map((ex) => (
            <li key={ex.ko} className="flex items-start gap-3">
              <AudioButton
                text={ex.ko}
                className="h-9 w-9 [&_svg]:h-4 [&_svg]:w-4"
              />
              <div>
                <p lang="ko" className="text-lg">
                  {ex.ko}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {l(ex.translation)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('grammar.lesson.mistakes')}>
        <ul className="flex flex-col gap-2">
          {lesson.mistakes.map((m) => (
            <li
              key={m.en}
              className="flex gap-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40"
            >
              <span aria-hidden="true">⚠️</span>
              <span>{l(m)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CultureCallout notes={notesForLesson(lesson.id)} />

      <Section title={t('grammar.lesson.practice')}>
        <Exercises key={lesson.id} lesson={lesson} />
      </Section>
    </motion.div>
  )
}
