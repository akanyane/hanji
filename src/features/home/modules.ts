import type { LinkProps } from '@tanstack/react-router'

export type ModuleId =
  | 'hangul'
  | 'pronunciation'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'numbers'
  | 'dialogues'
  | 'culture'
  | 'progress'
  | 'tools'

export interface PlatformModule {
  /** Also the i18n key under `home.modules`. */
  id: ModuleId
  korean: string
  /** Module route; absent while the module is not available yet. */
  to?: LinkProps['to']
  group: ModuleGroup
}

export type ModuleGroup = 'learn' | 'practice' | 'more'
export const MODULE_GROUPS: ModuleGroup[] = ['learn', 'practice', 'more']

// Platform module map. When a module ships, just fill in `to`.
export const PLATFORM_MODULES: PlatformModule[] = [
  { id: 'hangul', korean: '한글', to: '/hangul', group: 'learn' },
  { id: 'pronunciation', korean: '발음', to: '/pronunciation', group: 'learn' },
  { id: 'vocabulary', korean: '어휘', to: '/vocabulary', group: 'learn' },
  { id: 'grammar', korean: '문법', to: '/grammar', group: 'learn' },
  { id: 'listening', korean: '듣기', to: '/listening', group: 'practice' },
  { id: 'speaking', korean: '말하기', to: '/speaking', group: 'practice' },
  { id: 'reading', korean: '읽기', to: '/reading', group: 'practice' },
  { id: 'writing', korean: '쓰기', to: '/writing', group: 'practice' },
  { id: 'numbers', korean: '숫자', to: '/numbers', group: 'learn' },
  { id: 'dialogues', korean: '대화', to: '/dialogues', group: 'practice' },
  { id: 'culture', korean: '문화', to: '/culture', group: 'more' },
  { id: 'progress', korean: '진도', to: '/progress', group: 'more' },
  { id: 'tools', korean: '도구', to: '/tools', group: 'more' },
]
