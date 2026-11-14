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
      theme: 'dark',
      speechRate: 1,
    })
    expect(loadSettings(null, false).theme).toBe('light')
  })

  it('reads saved settings', () => {
    const s = storage({
      [SETTINGS_KEY]: JSON.stringify({ theme: 'dark', speechRate: 0.75 }),
    })
    expect(loadSettings(s, false)).toEqual({ theme: 'dark', speechRate: 0.75 })
  })

  it('migrates the theme saved by the old app version', () => {
    const s = storage({ 'hangul:theme': JSON.stringify('dark') })
    expect(loadSettings(s, false).theme).toBe('dark')
  })

  it('ignores invalid or corrupted values', () => {
    const s = storage({
      [SETTINGS_KEY]: JSON.stringify({ theme: 'purple', speechRate: 'fast' }),
    })
    expect(loadSettings(s, false)).toEqual({ theme: 'light', speechRate: 1 })
    expect(loadSettings(storage({ [SETTINGS_KEY]: '{oops' }), true).theme).toBe(
      'dark',
    )
  })

  it('clamps the speech rate', () => {
    const s = storage({ [SETTINGS_KEY]: JSON.stringify({ speechRate: 9 }) })
    expect(loadSettings(s, false).speechRate).toBe(1.5)
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

  it('clamps the speech rate when setting it', () => {
    settingsActions.setSpeechRate(0.1)
    expect(settingsStore.state.speechRate).toBe(0.5)
  })
})
