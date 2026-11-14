import { createFileRoute } from '@tanstack/react-router'
import { MinimalPairs } from '../../features/pronunciation/MinimalPairs'

export const Route = createFileRoute('/pronunciation/minimal-pairs')({
  component: MinimalPairs,
})
