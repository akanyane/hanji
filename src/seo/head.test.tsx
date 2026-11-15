import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { renderApp } from '../test/renderApp'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('document head', () => {
  it('names the section in the tab title and sets the canonical URL', async () => {
    renderApp('/grammar/past-tense')
    await screen.findByRole('heading', { name: /Passado/ })
    await waitFor(() => expect(document.title).toBe('Gramática · Hanji'))
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://hanji.akanyane.dev/grammar/past-tense')
  })

  it('uses the app name on the home page', async () => {
    renderApp('/')
    await screen.findByRole('heading', { name: 'Aprenda coreano do zero' })
    await waitFor(() => expect(document.title).toBe('Hanji · Aprenda coreano'))
  })
})
