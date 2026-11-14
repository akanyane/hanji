import { createFileRoute } from '@tanstack/react-router'
import { progressDataQuery } from '../../db/queries'
import { Dashboard } from '../../features/progress/Dashboard'

export const Route = createFileRoute('/progress/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(progressDataQuery),
  component: Dashboard,
})
