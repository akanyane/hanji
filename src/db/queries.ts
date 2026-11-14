import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getQuizSummary,
  type NewQuizAttempt,
  recordQuizAttempt,
} from './quizAttempts'

// Bridge between the repositories (IndexedDB) and React, via TanStack Query.
// Keys are centralized here so cache invalidation stays consistent.

export const queryKeys = {
  quizSummary: (quizId: string) =>
    ['quiz-attempts', 'summary', quizId] as const,
}

export const quizSummaryQuery = (quizId: string) =>
  queryOptions({
    queryKey: queryKeys.quizSummary(quizId),
    queryFn: () => getQuizSummary(quizId),
  })

export function useQuizSummary(quizId: string) {
  return useQuery(quizSummaryQuery(quizId))
}

export function useRecordQuizAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewQuizAttempt) => recordQuizAttempt(input),
    onSuccess: (_attempt, input) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.quizSummary(input.quizId),
      }),
  })
}
