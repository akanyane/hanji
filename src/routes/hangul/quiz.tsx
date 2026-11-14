import { createFileRoute } from '@tanstack/react-router'
import type { HangulCategory } from '../../content/hangul'
import { quizSummaryQuery } from '../../db/queries'
import { QUIZ_IDS } from '../../db/quizAttempts'
import { parseCategory } from '../../features/hangul/filter'
import { QuizView } from '../../features/hangul/QuizView'

export const Route = createFileRoute('/hangul/quiz')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { category?: HangulCategory } => ({
    category: parseCategory(search.category),
  }),
  // Preload the summary from IndexedDB before showing the page.
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(quizSummaryQuery(QUIZ_IDS.hangulBasic)),
  component: QuizPage,
})

function QuizPage() {
  const { category = 'all' } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <QuizView
      category={category}
      onCategoryChange={(c) =>
        navigate({
          search: { category: c === 'all' ? undefined : c },
          replace: true,
        })
      }
    />
  )
}
