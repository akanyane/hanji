import type { LinkProps } from '@tanstack/react-router'

export interface ToolInfo {
  to: LinkProps['to']
  title: string
  description: string
}

export const TOOLS: ToolInfo[] = [
  {
    to: '/tools/pronunciation',
    title: 'Como se pronuncia?',
    description:
      'Digite uma palavra e veja a pronúncia real, com cada regra de mudança de som explicada.',
  },
  {
    to: '/tools/romanization',
    title: 'Romanização',
    description:
      'Converta entre hangul e a Romanização Revisada oficial, nos dois sentidos.',
  },
  {
    to: '/tools/decomposer',
    title: 'Decompositor de sílabas',
    description:
      'Veja a consoante inicial, a vogal e o batchim de cada sílaba de um texto.',
  },
]
