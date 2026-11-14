import { createFileRoute } from '@tanstack/react-router'
import { VocabularyHome } from '../../features/vocabulary/VocabularyHome'

export const Route = createFileRoute('/vocabulary/')({
  component: VocabularyHome,
})
