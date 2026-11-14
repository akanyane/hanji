import type { LinkProps } from '@tanstack/react-router'

export type ToolId = 'pronunciation' | 'romanization' | 'decomposer'

export interface ToolInfo {
  /** Also the i18n key under `tools`. */
  id: ToolId
  to: LinkProps['to']
  icon: string
}

export const TOOLS: ToolInfo[] = [
  { id: 'pronunciation', to: '/tools/pronunciation', icon: '발음' },
  { id: 'romanization', to: '/tools/romanization', icon: '로마자' },
  { id: 'decomposer', to: '/tools/decomposer', icon: '분해' },
]
