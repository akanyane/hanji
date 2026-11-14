import type { Localized } from '../../i18n/locales'
import type { FormId } from '../../lib/conjugation/conjugate'
import type { ParticleType } from '../../lib/particles/particles'
import type { TopikLevel } from '../vocabulary/types'

/**
 * What an exercise tests, so a test can verify the answer against the
 * conjugation/particle engines (a wrong answer key fails the build).
 */
export type ExerciseCheck =
  | { kind: 'particle'; noun: string; type: ParticleType }
  | { kind: 'form'; verb: string; form: FormId }
  /** 이에요 after a consonant, 예요 after a vowel. */
  | { kind: 'copula'; noun: string }

export interface GrammarExercise {
  /** Korean sentence with ___ for the gap, plus an optional hint like "(가다)". */
  prompt: string
  choices: string[]
  /** Index of the right choice. */
  answer: number
  translation: Localized
  check?: ExerciseCheck
}

export interface GrammarLesson {
  /** Stable id (English slug); progress references it. */
  id: string
  level: TopikLevel
  /** The pattern as Koreans write it, e.g. "은/는" or "-아요/어요". */
  pattern: string
  title: Localized
  summary: Localized
  /** Explanation paragraphs. */
  explanation: Localized[]
  /** How the pattern is formed: condition → form → example. */
  formation: Array<{ when: Localized; form: string; example: string }>
  /** Forms rendered live from the conjugation engine for these verbs. */
  conjugationTable?: { forms: FormId[]; verbs: string[] }
  examples: Array<{ ko: string; translation: Localized }>
  /**
   * Common mistakes, written for speakers of each language (Brazilians make
   * different mistakes than English speakers), not literal translations.
   */
  mistakes: Localized[]
  exercises: GrammarExercise[]
  needsReview?: boolean
}

export const L = (pt: string, en: string): Localized => ({ 'pt-BR': pt, en })

export const example = (ko: string, pt: string, en: string) => ({
  ko,
  translation: L(pt, en),
})
