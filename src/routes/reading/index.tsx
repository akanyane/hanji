import { createFileRoute } from '@tanstack/react-router'
import { ReadingList } from '../../features/reading/Reading'

export const Route = createFileRoute('/reading/')({
  component: () => <ReadingList />,
})
