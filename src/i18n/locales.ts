// Supported interface/content languages. To add one:
// 1. add its code here and a label below;
// 2. add src/i18n/messages/<code>.ts (TypeScript flags every missing key);
// 3. fill the new key in every `Localized<…>` value in src/content
//    (TypeScript flags those too).

export const LOCALES = ['pt-BR', 'en'] as const

export type Locale = (typeof LOCALES)[number]

/** Each language's name written in that language, for the language picker. */
export const LOCALE_LABELS: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
}

export const DEFAULT_LOCALE: Locale = 'en'

/** Text (or any value) available in every supported language. */
export type Localized<T = string> = Record<Locale, T>

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

/** Picks the best supported locale from the browser's preferred languages. */
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const lower = language.toLowerCase()
    const exact = LOCALES.find((l) => l.toLowerCase() === lower)
    if (exact) return exact
    const base = lower.split('-')[0]
    const sameBase = LOCALES.find((l) => l.toLowerCase().split('-')[0] === base)
    if (sameBase) return sameBase
  }
  return DEFAULT_LOCALE
}
