import { createFileRoute } from '@tanstack/react-router'
import { CultureList } from '../../features/culture/Culture'

export const Route = createFileRoute('/culture/')({
  component: () => <CultureList />,
})
