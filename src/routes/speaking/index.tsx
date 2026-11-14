import { createFileRoute } from '@tanstack/react-router'
import { RepeatPractice } from '../../features/speaking/RepeatPractice'

export const Route = createFileRoute('/speaking/')({
  component: () => <RepeatPractice />,
})
