import { createFileRoute } from '@tanstack/react-router'
import { reviewLogsQuery } from '../../db/queries'
import { StatsPage } from '../../features/vocabulary/StatsPage'

export const Route = createFileRoute('/vocabulary/stats')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(reviewLogsQuery(30)),
  component: StatsPage,
})
