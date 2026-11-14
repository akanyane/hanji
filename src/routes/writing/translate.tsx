import { createFileRoute } from '@tanstack/react-router'
import { TranslationPractice } from '../../features/writing/TranslationPractice'

export const Route = createFileRoute('/writing/translate')({
  component: () => <TranslationPractice />,
})
