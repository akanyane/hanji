import { createFileRoute } from '@tanstack/react-router'
import { Placement } from '../../features/progress/Placement'

export const Route = createFileRoute('/progress/placement')({
  component: () => <Placement />,
})
