import type { Localized } from '../../i18n/locales'

export type PartOfSpeech =
  | 'noun'
  | 'pronoun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'determiner'
  | 'counter'
  | 'expression'

export type ThemeId =
  | 'greetings'
  | 'people'
  | 'food'
  | 'places'
  | 'transport'
  | 'time'
  | 'home'
  | 'school'
  | 'work'
  | 'body'
  | 'nature'
  | 'shopping'
  | 'actions'
  | 'descriptions'
  | 'questions'

/** TOPIK level 1–6. */
export type TopikLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface VocabWord {
  /** Stable id (English slug). Never change it: SRS progress references it. */
  id: string
  /** Dictionary form (verbs and adjectives end in 다). */
  word: string
  pos: PartOfSpeech
  /**
   * Approximate TOPIK level, as a study guide. There is no public official
   * per-level word list, so this follows common beginner word lists.
   */
  level: TopikLevel
  themes: ThemeId[]
  meaning: Localized
  /** A natural example sentence (polite 해요체 unless noted) and its translations. */
  example: { ko: string; translation: Localized }
  /**
   * Hanja for Sino-Korean words, aligned character by character with `word`.
   * Native parts are kept in Hangul (선생님 → 先生님).
   */
  hanja?: string
  needsReview?: boolean
}

/** Compact constructor so word lists stay readable. */
export function word(
  id: string,
  hangul: string,
  pos: PartOfSpeech,
  level: TopikLevel,
  themes: ThemeId[],
  [pt, en]: [pt: string, en: string],
  [ko, examplePt, exampleEn]: [ko: string, pt: string, en: string],
  hanja?: string,
): VocabWord {
  return {
    id,
    word: hangul,
    pos,
    level,
    themes,
    meaning: { 'pt-BR': pt, en },
    example: { ko, translation: { 'pt-BR': examplePt, en: exampleEn } },
    ...(hanja ? { hanja } : {}),
  }
}
