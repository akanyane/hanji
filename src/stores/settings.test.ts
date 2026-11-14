import { describe, expect, it } from 'vitest'
import {
  loadSettings,
  SETTINGS_KEY,
  settingsActions,
  settingsStore,
} from './settings'

function storage(values: Record<string, string> = {}) {
  return {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => {
      values[key] = value
    },
  }
}

describe('loadSettings', () => {
  it('falls back to the system preference and normal speed', () => {
    expect(loadSettings(storage(), true)).toEqual({
      locale: 'en',
      theme: 'dark',
      speechRate: 1,
      newPerSession: 10,
      dailyGoal: 50,
    })
    expect(loadSettings(null, false).theme).toBe('light')
  })

  it('reads saved settings', () => {
    const s = storage({
      [SETTINGS_KEY]: JSON.stringify({ theme: 'dark', speechRate: 0.75 }),
    })
    expect(loadSettings(s, false)).toEqual({
      locale: 'en',
      theme: 'dark',
      speechRate: 0.75,
      newPerSession: 10,
      dailyGoal: 50,
    })
  })

  it('migrates the theme saved by the old app version', () => {
    const s = storage({ 'hangul:theme': JSON.stringify('dark') })
    expect(loadSettings(s, false).theme).toBe('dark')
  })

  it('ignores invalid or corrupted values', () => {
    const s = storage({
      [SETTINGS_KEY]: JSON.stringify({ theme: 'purple', speechRate: 'fast' }),
    })
    expect(loadSettings(s, false)).toEqual({
      locale: 'en',
      theme: 'light',
      speechRate: 1,
      newPerSession: 10,
      dailyGoal: 50,
    })
    expect(loadSettings(storage({ [SETTINGS_KEY]: '{oops' }), true).theme).toBe(
      'dark',
    )
  })

  it('keeps only the allowed daily goals', () => {
    const ok = storage({ [SETTINGS_KEY]: JSON.stringify({ dailyGoal: 100 }) })
    expect(loadSettings(ok, false).dailyGoal).toBe(100)
    const bad = storage({ [SETTINGS_KEY]: JSON.stringify({ dailyGoal: 37 }) })
    expect(loadSettings(bad, false).dailyGoal).toBe(50)
  })

  it('clamps the speech rate', () => {
    const s = storage({ [SETTINGS_KEY]: JSON.stringify({ speechRate: 9 }) })
    expect(loadSettings(s, false).speechRate).toBe(1.5)
  })
})

describe('locale', () => {
  it('detects the locale from the browser languages on first visit', () => {
    expect(loadSettings(storage(), false, ['pt-BR', 'en']).locale).toBe('pt-BR')
    expect(loadSettings(storage(), false, ['fr-FR']).locale).toBe('en')
  })

  it('prefers the saved locale over the browser languages', () => {
    const s = storage({ [SETTINGS_KEY]: JSON.stringify({ locale: 'en' }) })
    expect(loadSettings(s, false, ['pt-BR']).locale).toBe('en')
  })

  it('ignores an unsupported saved locale', () => {
    const s = storage({ [SETTINGS_KEY]: JSON.stringify({ locale: 'xx' }) })
    expect(loadSettings(s, false, ['pt-BR']).locale).toBe('pt-BR')
  })
})

describe('settingsActions', () => {
  it('toggles the theme and persists it to localStorage', () => {
    const before = settingsStore.state.theme
    settingsActions.toggleTheme()
    expect(settingsStore.state.theme).not.toBe(before)
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}').theme).toBe(
      settingsStore.state.theme,
    )
  })

  it('clamps the new-words-per-session setting', () => {
    settingsActions.setNewPerSession(500)
    expect(settingsStore.state.newPerSession).toBe(50)
    settingsActions.setNewPerSession(-3)
    expect(settingsStore.state.newPerSession).toBe(0)
  })

  it('clamps the speech rate when setting it', () => {
    settingsActions.setSpeechRate(0.1)
    expect(settingsStore.state.speechRate).toBe(0.5)
  })
})
