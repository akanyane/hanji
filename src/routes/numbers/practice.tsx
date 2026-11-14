import { createFileRoute } from '@tanstack/react-router'
import { NumberPractice } from '../../features/numbers/Numbers'

export const Route = createFileRoute('/numbers/practice')({
  component: () => <NumberPractice />,
})
