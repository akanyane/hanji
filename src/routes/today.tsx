import { createFileRoute } from '@tanstack/react-router'
import { progressDataQuery } from '../db/queries'
import { TodayPage } from '../features/today/TodayPage'

export const Route = createFileRoute('/today')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(progressDataQuery),
  component: TodayPage,
})
