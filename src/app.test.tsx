import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db/db'
import { renderApp } from './test/renderApp'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('app navigation', () => {
  it('renders the home page with the module list', async () => {
    renderApp('/')
    expect(
      await screen.findByRole('heading', { name: 'Aprenda coreano do zero' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Em breve').length).toBeGreaterThan(0)
  })

  it('navigates from the home page to the Hangul browser and filters via the URL', async () => {
    const user = userEvent.setup()
    const router = renderApp('/')

    const nav = await screen.findByRole('navigation', {
      name: 'Navegação principal',
    })
    // Hangul lives in the "Aprender" (Learn) menu.
    await user.click(within(nav).getByRole('button', { name: /Aprender/ }))
    await user.click(await within(nav).findByRole('link', { name: /Hangul/ }))
    expect(
      await screen.findByRole('heading', { name: 'Hangul' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Vogal' }))
    expect(router.state.location.search).toEqual({ category: 'vowel' })
    // Cards that leave animate out first, so wait for the list to settle.
    await waitFor(() =>
      expect(screen.getAllByRole('listitem')).toHaveLength(21),
    )
  })

  it('reads the category filter from the URL', async () => {
    renderApp('/hangul?category=final')
    expect(
      await screen.findByRole('button', { name: 'Batchim (final)' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(7)
  })

  it('shows the quiz with the saved summary', async () => {
    renderApp('/hangul/quiz')
    expect(
      await screen.findByText('Melhor pontuação: 0 · Tentativas: 0'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar quiz' })).toBeEnabled()
  })

  it('shows a 404 page for unknown routes', async () => {
    renderApp('/nao-existe')
    expect(
      await screen.findByText('Página não encontrada.'),
    ).toBeInTheDocument()
  })
})
