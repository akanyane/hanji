import { createFileRoute } from '@tanstack/react-router'
import { RulesIndex } from '../../features/pronunciation/RulesIndex'

export const Route = createFileRoute('/pronunciation/')({
  component: RulesIndex,
})
