import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db/db'
import { createQueryClient } from './lib/queryClient'
import { createAppRouter } from './router'

function renderApp(path = '/') {
  const queryClient = createQueryClient()
  const router = createAppRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [path] }),
  )
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

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
    await user.click(within(nav).getByRole('link', { name: 'Hangul' }))
    expect(
      await screen.findByRole('heading', { name: 'Hangul' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Vogal' }))
    expect(router.state.location.search).toEqual({ category: 'vowel' })
    expect(screen.getAllByRole('listitem')).toHaveLength(21)
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
