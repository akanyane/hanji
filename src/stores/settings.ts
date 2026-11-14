import { createStore, useSelector } from '@tanstack/react-store'
import { detectLocale, isLocale, type Locale } from '../i18n/locales'

// UI preferences for this device. They live in localStorage (not IndexedDB)
// because the theme must be read synchronously at startup, before React
// mounts, to avoid flashing the wrong theme.

export type Theme = 'light' | 'dark'

export interface Settings {
  /** Interface and content language. */
  locale: Locale
  theme: Theme
  /** Speech synthesis rate (1 = normal). */
  speechRate: number
  /** How many never-seen vocabulary words a study session introduces. */
  newPerSession: number
}

export const SETTINGS_KEY = 'learn-korean:settings'
const LEGACY_THEME_KEY = 'hangul:theme'
export const SPEECH_RATE_MIN = 0.5
export const SPEECH_RATE_MAX = 1.5
export const NEW_PER_SESSION_MAX = 50
const DEFAULT_NEW_PER_SESSION = 10

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

const clampRate = (rate: number) =>
  Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, rate))

const clampNew = (n: number) =>
  Math.min(NEW_PER_SESSION_MAX, Math.max(0, Math.round(n)))

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark'

function readJson(storage: StorageLike | null, key: string): unknown {
  try {
    const raw = storage?.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Reads saved settings, validating each field and falling back to defaults. */
export function loadSettings(
  storage: StorageLike | null,
  prefersDark: boolean,
  languages: readonly string[] = [],
): Settings {
  const saved = readJson(storage, SETTINGS_KEY) as Partial<Settings> | null
  const legacyTheme = readJson(storage, LEGACY_THEME_KEY)

  const theme = isTheme(saved?.theme)
    ? saved.theme
    : isTheme(legacyTheme)
      ? legacyTheme
      : prefersDark
        ? 'dark'
        : 'light'

  const speechRate =
    typeof saved?.speechRate === 'number' && Number.isFinite(saved.speechRate)
      ? clampRate(saved.speechRate)
      : 1

  const locale = isLocale(saved?.locale)
    ? saved.locale
    : detectLocale(languages)

  const newPerSession =
    typeof saved?.newPerSession === 'number' &&
    Number.isFinite(saved.newPerSession)
      ? clampNew(saved.newPerSession)
      : DEFAULT_NEW_PER_SESSION

  return { locale, theme, speechRate, newPerSession }
}

function getStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    // Accessing localStorage can throw (private mode, blocked cookies).
    return null
  }
}

const prefersDark =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const browserLanguages =
  typeof navigator === 'undefined'
    ? []
    : navigator.languages?.length
      ? navigator.languages
      : [navigator.language]

export const settingsStore = createStore<Settings>(
  loadSettings(getStorage(), prefersDark, browserLanguages),
)

settingsStore.subscribe((settings) => {
  try {
    getStorage()?.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // No storage available: settings only last for this session.
  }
})

export const settingsActions = {
  toggleTheme() {
    settingsStore.setState((s) => ({
      ...s,
      theme: s.theme === 'dark' ? 'light' : 'dark',
    }))
  },
  setLocale(locale: Locale) {
    settingsStore.setState((s) => ({ ...s, locale }))
  },
  setNewPerSession(count: number) {
    settingsStore.setState((s) => ({ ...s, newPerSession: clampNew(count) }))
  },
  setSpeechRate(rate: number) {
    settingsStore.setState((s) => ({ ...s, speechRate: clampRate(rate) }))
  },
}

export function useSettings<T>(selector: (settings: Settings) => T): T {
  return useSelector(settingsStore, selector)
}
