import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { DAY_MS } from '../lib/srs/scheduler'
import {
  createDeck,
  type DeckInput,
  deleteDeck,
  getDeck,
  listDecks,
  updateDeck,
} from './decks'
import {
  getMeta,
  loadProgressData,
  META_KEYS,
  type NewPracticeEvent,
  recordPractice,
  setMeta,
} from './progress'
import {
  getQuizSummaries,
  getQuizSummary,
  type NewQuizAttempt,
  recordQuizAttempt,
} from './quizAttempts'
import {
  addToSrs,
  getAllCards,
  getReviewLogs,
  type ReviewInput,
  recordLessonResult,
  recordReview,
} from './srs'

// Bridge between the repositories (IndexedDB) and React, via TanStack Query.
// Keys are centralized here so cache invalidation stays consistent.

export const queryKeys = {
  quizAttempts: ['quiz-attempts'] as const,
  quizSummary: (quizId: string) =>
    ['quiz-attempts', 'summary', quizId] as const,
  quizSummaries: (prefix: string) =>
    ['quiz-attempts', 'summaries', prefix] as const,
  srsCards: ['srs', 'cards'] as const,
  grammarCards: ['srs', 'grammar'] as const,
  reviewLogs: (days: number) => ['srs', 'logs', days] as const,
  srs: ['srs'] as const,
  decks: ['decks'] as const,
  deck: (id: string) => ['decks', id] as const,
  progress: ['progress'] as const,
  meta: (key: string) => ['meta', key] as const,
}

/** Everything that changes progress also refreshes the progress stats. */
const refreshProgress = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.progress })

// --- Quizzes ---------------------------------------------------------------

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
    // Invalidates single and grouped summaries alike.
    onSuccess: () => {
      refreshProgress(queryClient)
      return queryClient.invalidateQueries({ queryKey: queryKeys.quizAttempts })
    },
  })
}

export const quizSummariesQuery = (prefix: string) =>
  queryOptions({
    queryKey: queryKeys.quizSummaries(prefix),
    queryFn: () => getQuizSummaries(prefix),
  })

export function useQuizSummaries(prefix: string) {
  return useQuery(quizSummariesQuery(prefix))
}

// --- Spaced repetition -----------------------------------------------------

export const srsCardsQuery = queryOptions({
  queryKey: queryKeys.srsCards,
  queryFn: () => getAllCards('vocab'),
})

export function useSrsCards() {
  return useQuery(srsCardsQuery)
}

export const reviewLogsQuery = (days: number) =>
  queryOptions({
    queryKey: queryKeys.reviewLogs(days),
    queryFn: () => getReviewLogs(new Date(Date.now() - days * DAY_MS)),
  })

export function useReviewLogs(days: number) {
  return useQuery(reviewLogsQuery(days))
}

export function useRecordReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ReviewInput) => recordReview(input),
    onSuccess: () => {
      refreshProgress(queryClient)
      return queryClient.invalidateQueries({ queryKey: queryKeys.srs })
    },
  })
}

export function useAddToSrs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => addToSrs(itemId),
    onSuccess: () => {
      refreshProgress(queryClient)
      return queryClient.invalidateQueries({ queryKey: queryKeys.srs })
    },
  })
}

// --- Decks -----------------------------------------------------------------

export const decksQuery = queryOptions({
  queryKey: queryKeys.decks,
  queryFn: listDecks,
})

export function useDecks() {
  return useQuery(decksQuery)
}

export const deckQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.deck(id),
    queryFn: async () => (await getDeck(id)) ?? null,
  })

export function useSaveDeck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }: DeckInput & { id?: string }) =>
      id
        ? updateDeck(id, input).then(() => id)
        : createDeck(input).then((d) => d.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.decks }),
  })
}

export function useDeleteDeck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.decks }),
  })
}

// --- Progress --------------------------------------------------------------

export const progressDataQuery = queryOptions({
  queryKey: queryKeys.progress,
  queryFn: loadProgressData,
})

export function useProgressData() {
  return useQuery(progressDataQuery)
}

export function useRecordPractice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewPracticeEvent) => recordPractice(input),
    onSuccess: () => refreshProgress(queryClient),
  })
}

export const metaQuery = <T>(key: string) =>
  queryOptions({
    queryKey: queryKeys.meta(key),
    // Query data cannot be undefined.
    queryFn: async () => (await getMeta<T>(key)) ?? null,
  })

export function useMeta<T>(key: string) {
  return useQuery(metaQuery<T>(key))
}

export function useSetMeta(key: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: unknown) => setMeta(key, value),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.meta(key) }),
  })
}

export { META_KEYS }

// --- Grammar reviews ---------------------------------------------------------

export const grammarCardsQuery = queryOptions({
  queryKey: queryKeys.grammarCards,
  queryFn: () => getAllCards('grammar'),
})

export function useGrammarCards() {
  return useQuery(grammarCardsQuery)
}

export function useRecordLessonResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { lessonId: string; correct: number; total: number }) =>
      recordLessonResult(input.lessonId, input.correct, input.total),
    onSuccess: () => {
      refreshProgress(queryClient)
      return queryClient.invalidateQueries({ queryKey: queryKeys.srs })
    },
  })
}
