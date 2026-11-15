import type { SessionQuestion } from '../../components/exercise/QuizSession'
import type { GrammarExercise } from '../../content/grammar'
import type { Localized } from '../../i18n/locales'

/** A Korean sentence with its ___ gap drawn as an underlined blank. */
export function Gapped({ text }: { text: string }) {
  const [before, after] = text.split('___')
  return (
    <span lang="ko" className="text-2xl font-semibold sm:text-3xl">
      {before}
      <span className="mx-1 inline-block min-w-12 border-b-4 border-pine-500 align-baseline">
        &nbsp;
      </span>
      {after}
    </span>
  )
}

/** A grammar exercise as a quiz question (choices are shuffled by QuizSession). */
export function exerciseQuestion(
  id: string,
  ex: GrammarExercise,
  l: (value: Localized) => string,
): SessionQuestion {
  return {
    id,
    answerId: String(ex.answer),
    choices: ex.choices.map((c, ci) => ({
      id: String(ci),
      label: c,
      lang: 'ko',
    })),
    prompt: (
      <>
        <Gapped text={ex.prompt} />
        <span className="text-sm text-ink-500 dark:text-ink-400">
          {l(ex.translation)}
        </span>
      </>
    ),
  }
}
