import type { ThemeId, TopikLevel, VocabWord } from './types'
import { actions } from './words/actions'
import { body, nature } from './words/bodyNature'
import { descriptions } from './words/descriptions'
import { food } from './words/food'
import { greetings } from './words/greetings'
import { home } from './words/home'
import { people } from './words/people'
import { places } from './words/places'
import { questions } from './words/questions'
import { schoolWork } from './words/schoolWork'
import { shopping } from './words/shopping'
import { time } from './words/time'
import { transport } from './words/transport'

export const VOCABULARY: VocabWord[] = [
  ...greetings,
  ...people,
  ...food,
  ...places,
  ...transport,
  ...time,
  ...home,
  ...schoolWork,
  ...body,
  ...nature,
  ...shopping,
  ...actions,
  ...descriptions,
  ...questions,
]

const BY_ID = new Map(VOCABULARY.map((w) => [w.id, w]))

export function getWord(id: string): VocabWord | undefined {
  return BY_ID.get(id)
}

export function wordsByTheme(theme: ThemeId): VocabWord[] {
  return VOCABULARY.filter((w) => w.themes.includes(theme))
}

export function wordsByLevel(level: TopikLevel): VocabWord[] {
  return VOCABULARY.filter((w) => w.level === level)
}

export * from './themes'
export * from './types'
