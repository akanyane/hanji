import { createFileRoute } from '@tanstack/react-router'
import { GrammarHome } from '../../features/grammar/GrammarHome'

export const Route = createFileRoute('/grammar/')({
  component: GrammarHome,
})
