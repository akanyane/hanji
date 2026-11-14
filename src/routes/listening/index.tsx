import { createFileRoute } from '@tanstack/react-router'
import { Dictation } from '../../features/listening/Dictation'

export const Route = createFileRoute('/listening/')({
  component: () => <Dictation />,
})
