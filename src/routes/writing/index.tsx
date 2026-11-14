import { createFileRoute } from '@tanstack/react-router'
import { KeyboardTrainer } from '../../features/writing/KeyboardTrainer'

export const Route = createFileRoute('/writing/')({
  component: () => <KeyboardTrainer />,
})
