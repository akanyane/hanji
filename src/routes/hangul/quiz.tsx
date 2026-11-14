import { createFileRoute } from '@tanstack/react-router'
import type { HangulCategory } from '../../content/hangul'
import { quizSummaryQuery } from '../../db/queries'
import { QUIZ_IDS } from '../../db/quizAttempts'
import { parseCategory } from '../../features/hangul/filter'
import { HangulQuiz, type QuizMode } from '../../features/hangul/HangulQuiz'

interface QuizSearch {
  mode?: Exclude<QuizMode, 'recognize'>
  category?: HangulCategory
}

export const Route = createFileRoute('/hangul/quiz')({
  validateSearch: (search: Record<string, unknown>): QuizSearch => ({
    mode:
      search.mode === 'listen' || search.mode === 'read'
        ? search.mode
        : undefined,
    category: parseCategory(search.category),
  }),
  // Preload the default mode's summary from IndexedDB before showing the page.
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(quizSummaryQuery(QUIZ_IDS.hangulBasic)),
  component: QuizPage,
})

function QuizPage() {
  const { mode = 'recognize', category = 'all' } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <HangulQuiz
      mode={mode}
      category={category}
      onModeChange={(m) =>
        navigate({
          search: (s) => ({ ...s, mode: m === 'recognize' ? undefined : m }),
          replace: true,
        })
      }
      onCategoryChange={(c) =>
        navigate({
          search: (s) => ({ ...s, category: c === 'all' ? undefined : c }),
          replace: true,
        })
      }
    />
  )
}
