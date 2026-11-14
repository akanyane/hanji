import { useSettings } from '../stores/settings'
import type { Locale, Localized } from './locales'

export function useLocale(): Locale {
  return useSettings((s) => s.locale)
}

/** Returns a function that picks the current language from a `Localized` value. */
export function useLocalized() {
  const locale = useLocale()
  return <T>(value: Localized<T>): T => value[locale]
}
