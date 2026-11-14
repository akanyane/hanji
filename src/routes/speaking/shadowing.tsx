import { createFileRoute } from '@tanstack/react-router'
import { Shadowing } from '../../features/speaking/Shadowing'

export const Route = createFileRoute('/speaking/shadowing')({
  component: () => <Shadowing />,
})
