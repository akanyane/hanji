import { createStore, useSelector } from '@tanstack/react-store'

// UI preferences for this device. They live in localStorage (not IndexedDB)
// because the theme must be read synchronously at startup, before React
// mounts, to avoid flashing the wrong theme.

export type Theme = 'light' | 'dark'

export interface Settings {
  theme: Theme
  /** Speech synthesis rate (1 = normal). */
  speechRate: number
}

export const SETTINGS_KEY = 'learn-korean:settings'
const LEGACY_THEME_KEY = 'hangul:theme'
export const SPEECH_RATE_MIN = 0.5
export const SPEECH_RATE_MAX = 1.5

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

const clampRate = (rate: number) =>
  Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, rate))

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

  return { theme, speechRate }
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

export const settingsStore = createStore<Settings>(
  loadSettings(getStorage(), prefersDark),
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
  setSpeechRate(rate: number) {
    settingsStore.setState((s) => ({ ...s, speechRate: clampRate(rate) }))
  },
}

export function useSettings<T>(selector: (settings: Settings) => T): T {
  return useSelector(settingsStore, selector)
}
