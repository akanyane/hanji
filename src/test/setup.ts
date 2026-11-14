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

// jsdom has no ResizeObserver (used by TanStack Virtual to measure lists).
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??=
  FakeResizeObserver as unknown as typeof ResizeObserver

// jsdom does no layout, so every element measures 0×0. TanStack Virtual reads
// clientWidth/clientHeight to decide how many rows fit; give it a viewport.
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  get: () => 800,
})
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get: () => 1024,
})
