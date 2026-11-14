import { createFileRoute } from '@tanstack/react-router'
import { NumbersLearn } from '../../features/numbers/Numbers'

export const Route = createFileRoute('/numbers/')({
  component: () => <NumbersLearn />,
})
