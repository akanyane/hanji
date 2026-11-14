import type { LinkProps } from '@tanstack/react-router'

export type ToolId = 'pronunciation' | 'romanization' | 'decomposer'

export interface ToolInfo {
  /** Also the i18n key under `tools`. */
  id: ToolId
  to: LinkProps['to']
  icon: string
}

export const TOOLS: ToolInfo[] = [
  { id: 'pronunciation', to: '/tools/pronunciation', icon: '🗣️' },
  { id: 'romanization', to: '/tools/romanization', icon: '🔤' },
  { id: 'decomposer', to: '/tools/decomposer', icon: '🧩' },
]
