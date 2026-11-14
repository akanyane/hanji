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
}

// Platform module map. When a module ships, just fill in `to`.
export const PLATFORM_MODULES: PlatformModule[] = [
  { id: 'hangul', korean: '한글', to: '/hangul' },
  { id: 'pronunciation', korean: '발음', to: '/pronunciation' },
  { id: 'vocabulary', korean: '어휘', to: '/vocabulary' },
  { id: 'grammar', korean: '문법', to: '/grammar' },
  { id: 'listening', korean: '듣기', to: '/listening' },
  { id: 'speaking', korean: '말하기', to: '/speaking' },
  { id: 'reading', korean: '읽기', to: '/reading' },
  { id: 'writing', korean: '쓰기', to: '/writing' },
  { id: 'numbers', korean: '숫자', to: '/numbers' },
  { id: 'dialogues', korean: '대화', to: '/dialogues' },
  { id: 'culture', korean: '문화', to: '/culture' },
  { id: 'progress', korean: '진도', to: '/progress' },
  { id: 'tools', korean: '도구', to: '/tools' },
]
