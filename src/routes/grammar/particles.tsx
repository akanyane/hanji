import { createFileRoute } from '@tanstack/react-router'
import { ParticlePractice } from '../../features/grammar/ParticlePractice'

export const Route = createFileRoute('/grammar/particles')({
  component: () => <ParticlePractice />,
})
