import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { InkMark } from '../../components/brand/InkMark'
import { Seal } from '../../components/brand/Seal'
import { Confetti } from '../../components/motion/Confetti'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { PageHeader } from '../../components/ui/PageHeader'
import { useLocale, useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import {
  DAILY_GOALS,
  type DailyGoal,
  settingsActions,
  useSettings,
} from '../../stores/settings'
import { GoalRing } from './GoalRing'
import type { DailyTask } from './plan'
import { type TodayView, useToday } from './useToday'

const GOAL_NAMES: Record<DailyGoal, 'light' | 'regular' | 'intense'> = {
  20: 'light',
  50: 'regular',
  100: 'intense',
}

const SEAL: Record<DailyTask['kind'], string> = {
  hangul: '한글',
  vocabulary: '단어',
  grammarReview: '복습',
  grammar: '문법',
  reading: '읽기',
  dialogue: '대화',
}

const linkClass =
  'shrink-0 self-start rounded-lg px-4 py-2 text-sm font-medium transition-all sm:self-center'
const startClass = `${linkClass} bg-ink-900 text-ink-50 hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--color-seal-500)] dark:bg-ink-50 dark:text-ink-900`
const againClass = `${linkClass} border border-ink-300 hover:border-ink-900 dark:border-ink-700 dark:hover:border-ink-200`

/** Title, detail and destination of each task. */
function useTaskView(task: DailyTask) {
  const { t } = useTranslation()
  const l = useLocalized()
  const cls = task.done ? againClass : startClass
  const label = task.done ? t('today.again') : t('today.start')
  switch (task.kind) {
    case 'hangul':
      return {
        title: t('today.tasks.hangul.title'),
        detail: t('today.tasks.hangul.detail'),
        link: (
          <Link to="/hangul/quiz" className={cls}>
            {label}
          </Link>
        ),
      }
    case 'vocabulary':
      return {
        title: t('today.tasks.vocabulary.title'),
        detail: task.done
          ? t('today.tasks.vocabulary.reviewed', { count: task.reviewedToday })
          : task.due > 0 && task.fresh > 0
            ? t('today.tasks.vocabulary.detail', {
                due: task.due,
                fresh: task.fresh,
              })
            : task.due > 0
              ? t('today.tasks.vocabulary.detailDue', { count: task.due })
              : t('today.tasks.vocabulary.detailNew', { count: task.fresh }),
        link: (
          <Link
            to="/vocabulary/study"
            search={{ deck: task.deck }}
            className={cls}
          >
            {label}
          </Link>
        ),
      }
    case 'grammarReview':
      return {
        title: t('today.tasks.grammarReview.title'),
        detail: task.done
          ? t('today.tasks.grammarReview.reviewed')
          : t('today.tasks.grammarReview.detail', { count: task.due }),
        link: (
          <Link to="/grammar/review" className={cls}>
            {label}
          </Link>
        ),
      }
    case 'grammar':
      return {
        title: t('today.tasks.grammar.title'),
        detail: `${task.lesson.pattern} · ${l(task.lesson.title)}`,
        link: (
          <Link
            to="/grammar/$lessonId"
            params={{ lessonId: task.lesson.id }}
            className={cls}
          >
            {label}
          </Link>
        ),
      }
    case 'reading':
      return {
        title: t('today.tasks.reading.title'),
        detail: l(task.text.title),
        link: (
          <Link
            to="/reading/$textId"
            params={{ textId: task.text.id }}
            className={cls}
          >
            {label}
          </Link>
        ),
      }
    case 'dialogue':
      return {
        title: t('today.tasks.dialogue.title'),
        detail: l(task.dialogue.title),
        link: (
          <Link
            to="/dialogues/$dialogueId"
            params={{ dialogueId: task.dialogue.id }}
            className={cls}
          >
            {label}
          </Link>
        ),
      }
  }
}

function TaskCard({ task, index }: { task: DailyTask; index: number }) {
  const { t } = useTranslation()
  const view = useTaskView(task)
  return (
    <motion.li
      variants={fadeUp}
      className={cn(
        'relative flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center',
        task.done
          ? 'border-dashed border-ink-300 dark:border-ink-700'
          : 'border-ink-200 bg-white shadow-paper dark:border-ink-800 dark:bg-ink-900',
      )}
    >
      <span className="flex items-center gap-3">
        <span className="w-5 font-serif text-sm text-ink-400 tabular-nums">
          {index + 1}
        </span>
        <Seal text={SEAL[task.kind]} size="md" muted={task.done} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="flex items-center gap-2 font-bold">
          {view.title}
          {task.done && (
            <>
              <InkMark kind="correct" className="h-5 w-5" />
              <span className="sr-only">{t('today.done')}</span>
            </>
          )}
        </h2>
        <p
          className={cn(
            'text-sm',
            task.done
              ? 'text-ink-500 dark:text-ink-400'
              : 'text-ink-600 dark:text-ink-300',
          )}
        >
          {view.detail}
        </p>
      </div>
      {view.link}
    </motion.li>
  )
}

function GoalPanel({ view }: { view: TodayView }) {
  const { t } = useTranslation()
  const dailyGoal = useSettings((s) => s.dailyGoal)
  const reached = view.goal.ratio >= 1
  return (
    <motion.section
      variants={fadeUp}
      className="relative flex flex-col items-center gap-5 rounded-xl panel-ink p-6 sm:flex-row"
    >
      {reached && <Confetti count={30} />}
      <GoalRing xp={view.goal.xp} goal={view.goal.goal} />
      <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
        <div>
          <p className="font-serif text-2xl font-bold">
            {reached ? t('today.goalReached') : t('today.goal')}
          </p>
          <p className="text-sm opacity-80">
            {view.streak.current > 0
              ? t('today.streak', { count: view.streak.current })
              : t('today.streakStart')}
          </p>
        </div>
        <fieldset className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <legend className="mb-1 w-full text-xs tracking-wide uppercase opacity-70">
            {t('today.goalLabel')}
          </legend>
          {/* Chips styled for the dark ink panel (in both themes). */}
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              aria-pressed={goal === dailyGoal}
              onClick={() => settingsActions.setDailyGoal(goal)}
              className={cn(
                'rounded-md border px-3 py-1 text-sm font-medium transition-colors',
                goal === dailyGoal
                  ? 'border-ink-50 bg-ink-50 text-ink-900'
                  : 'border-ink-50/30 text-ink-50/85 hover:border-ink-50',
              )}
            >
              {t(`today.goals.${GOAL_NAMES[goal]}`, { xp: goal })}
            </button>
          ))}
        </fieldset>
      </div>
    </motion.section>
  )
}

function AllDone() {
  const { t } = useTranslation()
  return (
    <motion.div
      variants={pop}
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-seal-300 p-6 text-center dark:border-seal-800"
      role="status"
    >
      <Seal text="완료" size="xl" animate="stamp" delay={0.2} />
      <p className="font-serif text-xl font-bold">{t('today.allDone')}</p>
      <p className="text-ink-600 dark:text-ink-300">{t('today.allDoneText')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/progress/exam" className={againClass}>
          {t('today.more.exam')}
        </Link>
        <Link to="/vocabulary/dictionary" className={againClass}>
          {t('today.more.dictionary')}
        </Link>
      </div>
    </motion.div>
  )
}

export function TodayPage() {
  const { t } = useTranslation()
  const locale = useLocale()
  const view = useToday()
  const date = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  let body: ReactNode = <p role="status">{t('progress.loading')}</p>
  if (view)
    body = (
      <motion.div
        className="flex flex-col gap-5"
        variants={stagger(0, 0.08)}
        initial="hidden"
        animate="visible"
      >
        <GoalPanel view={view} />
        <motion.p variants={fadeUp} className="text-sm text-ink-500">
          {t('today.progress', { done: view.done, total: view.tasks.length })}
        </motion.p>
        <motion.ol className="flex flex-col gap-3" variants={stagger(0, 0.07)}>
          {view.tasks.map((task, i) => (
            <TaskCard key={task.kind} task={task} index={i} />
          ))}
        </motion.ol>
        {view.tasks.length > 0 && view.done === view.tasks.length && (
          <AllDone />
        )}
        {view.tasks.length === 0 && (
          <p className="text-ink-600 dark:text-ink-300">{t('today.empty')}</p>
        )}
      </motion.div>
    )

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader title={t('today.title')} description={date} korean="오늘" />
      {body}
    </div>
  )
}
