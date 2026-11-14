import { createFileRoute } from '@tanstack/react-router'
import { progressDataQuery } from '../../db/queries'
import { Achievements } from '../../features/progress/Achievements'

export const Route = createFileRoute('/progress/achievements')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(progressDataQuery),
  component: Achievements,
})
