import 'fake-indexeddb/auto'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import '../i18n/i18n'
import { settingsActions } from '../stores/settings'

// Most UI tests assert Brazilian Portuguese text; tests for other languages
// switch the locale explicitly.
beforeEach(() => {
  settingsActions.setLocale('pt-BR')
})

// jsdom doesn't implement scrollTo (used by the router's scroll restoration).
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

// jsdom has no canvas: getContext returns null, so drawing UIs show their fallback.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never

// jsdom has no IntersectionObserver (used by `whileInView` animations).
class FakeIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver ??=
  FakeIntersectionObserver as unknown as typeof IntersectionObserver

afterEach(() => {
  cleanup()
})
