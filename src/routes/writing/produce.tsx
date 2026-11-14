import { createFileRoute } from '@tanstack/react-router'
import { FreeWriting } from '../../features/writing/FreeWriting'

export const Route = createFileRoute('/writing/produce')({
  component: () => <FreeWriting />,
})
