import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db/db'
import { listDecks } from '../../db/decks'
import { getAllCards, getReviewLogs, recordReview } from '../../db/srs'
import { settingsActions } from '../../stores/settings'
import { renderApp } from '../../test/renderApp'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  settingsActions.setNewPerSession(3)
})

describe('vocabulary dashboard', () => {
  it('shows the study stats and suggested decks', async () => {
    renderApp('/vocabulary')
    expect(await screen.findByText('Para revisar')).toBeInTheDocument()
    expect(
      screen.getByText('Tudo em dia! Nenhuma revisão pendente agora.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Estudar: Cumprimentos' }),
    ).toBeInTheDocument()
  })

  it('offers a review button once cards are due', async () => {
    await recordReview({
      itemId: 'water',
      grade: 'again',
      mode: 'flashcards',
      now: new Date('2020-01-01'),
    })
    renderApp('/vocabulary')
    expect(
      await screen.findByRole('button', { name: 'Revisar agora (1)' }),
    ).toBeInTheDocument()
  })
})

describe('flashcard session', () => {
  it('flips cards, grades them with FSRS and finishes the session', async () => {
    const user = userEvent.setup()
    renderApp('/vocabulary/study?deck=theme-greetings')

    for (let i = 0; i < 3; i++) {
      await user.click(
        await screen.findByRole('button', { name: 'Mostrar resposta' }),
      )
      // "Good" shows the interval it would schedule, e.g. "5 dias".
      const good = await screen.findByRole('button', { name: /Bom/ })
      await waitFor(() => expect(good).not.toHaveTextContent('…'))
      await user.click(good)
    }

    expect(await screen.findByText('Sessão concluída!')).toBeInTheDocument()
    expect(screen.getByText('Você revisou 3 cartões.')).toBeInTheDocument()
    expect(await getAllCards()).toHaveLength(3)
    expect(
      (await getReviewLogs(new Date(0))).every(
        (l) => l.grade === 'good' && l.mode === 'flashcards',
      ),
    ).toBe(true)
  })

  it('brings "again" cards back later in the same session', async () => {
    settingsActions.setNewPerSession(1)
    const user = userEvent.setup()
    renderApp('/vocabulary/study?deck=theme-greetings')

    await user.click(
      await screen.findByRole('button', { name: 'Mostrar resposta' }),
    )
    await user.click(await screen.findByRole('button', { name: /Errei/ }))
    expect(await screen.findByText('Falta 1 cartão')).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: 'Mostrar resposta' }),
    )
    await user.click(await screen.findByRole('button', { name: /Fácil/ }))
    expect(
      await screen.findByText('Você revisou 2 cartões.'),
    ).toBeInTheDocument()
  })

  it('says when a deck has nothing to study', async () => {
    settingsActions.setNewPerSession(0)
    renderApp('/vocabulary/study?deck=theme-greetings')
    expect(
      await screen.findByText(/Nada para estudar neste baralho/),
    ).toBeInTheDocument()
  })
})

describe('other study modes', () => {
  it('multiple choice grades "good" for the right meaning', async () => {
    settingsActions.setNewPerSession(1)
    const user = userEvent.setup()
    // The greetings deck starts with 안녕하세요.
    renderApp('/vocabulary/study?deck=theme-greetings&mode=choice')
    await user.click(await screen.findByRole('button', { name: /olá; oi/ }))
    expect(await screen.findByText(/Correto!/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Continuar/ }))
    await screen.findByText('Sessão concluída!')
    expect((await getReviewLogs(new Date(0)))[0]).toMatchObject({
      itemId: 'hello',
      grade: 'good',
      mode: 'choice',
    })
  })

  it('typing accepts the romanization and rejects wrong answers', async () => {
    settingsActions.setNewPerSession(2)
    const user = userEvent.setup()
    renderApp('/vocabulary/study?deck=theme-greetings&mode=typing')

    await user.type(
      await screen.findByLabelText('Sua resposta'),
      'annyeonghaseyo{Enter}',
    )
    expect(await screen.findByText(/Correto!/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Continuar/ }))

    // Wait for the previous card to finish its exit animation.
    await waitFor(() =>
      expect(screen.getAllByLabelText('Sua resposta')).toHaveLength(1),
    )
    await waitFor(() =>
      expect(screen.getByLabelText('Sua resposta')).toHaveValue(''),
    )
    await user.type(screen.getByLabelText('Sua resposta'), 'errado{Enter}')
    expect(await screen.findByText(/A resposta é/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Continuar/ }))

    const grades = (await getReviewLogs(new Date(0))).map((l) => l.grade)
    await waitFor(() => expect(grades).toContain('good'))
  })
})

describe('deck editor', () => {
  it('validates and creates a custom deck', async () => {
    const user = userEvent.setup()
    const router = renderApp('/vocabulary/decks/new')

    const name = await screen.findByLabelText('Nome do baralho')
    await user.type(name, 'x')
    await user.clear(name)
    expect(
      await screen.findByText('Dê um nome ao baralho.'),
    ).toBeInTheDocument()

    await user.type(name, 'Viagem')
    await user.type(screen.getByLabelText('Buscar palavras'), 'ônibus')
    await user.click(await screen.findByRole('checkbox'))
    expect(screen.getByText('1 palavra selecionada')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Salvar baralho' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/vocabulary/decks'),
    )
    expect(await listDecks()).toMatchObject([
      { name: 'Viagem', itemIds: ['bus'] },
    ])
    expect(
      await screen.findByRole('link', { name: 'Estudar: Viagem' }),
    ).toBeInTheDocument()
  })

  it('deletes a deck after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { createDeck } = await import('../../db/decks')
    const deck = await createDeck({ name: 'Temp', itemIds: ['bus'] })
    const user = userEvent.setup()
    renderApp(`/vocabulary/decks/${deck.id}`)
    await user.click(
      await screen.findByRole('button', { name: 'Excluir baralho' }),
    )
    await waitFor(async () => expect(await listDecks()).toEqual([]))
  })
})

describe('dictionary', () => {
  it('searches by meaning, filters by theme and opens a word', async () => {
    const user = userEvent.setup()
    const router = renderApp('/vocabulary/dictionary')

    await user.type(
      await screen.findByLabelText('Buscar no dicionário'),
      'água',
    )
    expect(await screen.findByText('1 palavra')).toBeInTheDocument()
    await user.click(screen.getByRole('cell', { name: '물' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/vocabulary/word/water'),
    )
    expect(await screen.findByText('물 좀 주세요.')).toBeInTheDocument()
    expect(screen.getByText('Ainda não estudada.')).toBeInTheDocument()
  })

  it('reads filters from the URL and sorts columns', async () => {
    const user = userEvent.setup()
    renderApp('/vocabulary/dictionary?theme=transport')
    const table = await screen.findByRole('table')
    expect(within(table).getAllByRole('row').length).toBeGreaterThan(5)
    await user.click(
      screen.getByRole('button', { name: 'Ordenar por Palavra' }),
    )
    expect(
      screen.getByRole('columnheader', { name: /Palavra/ }),
    ).toHaveAttribute('aria-sort', 'ascending')
  })
})

describe('statistics', () => {
  it('shows an empty state, then numbers after studying', async () => {
    renderApp('/vocabulary/stats')
    expect(
      await screen.findByText(/Estude algumas palavras/),
    ).toBeInTheDocument()
  })

  it('summarizes studied words and charts', async () => {
    await recordReview({ itemId: 'water', grade: 'good', mode: 'flashcards' })
    renderApp('/vocabulary/stats')
    expect(await screen.findByText('Palavras estudadas')).toBeInTheDocument()
    expect(screen.getByText('Revisões nos últimos 14 dias')).toBeInTheDocument()
    expect(screen.getByText('Próximas revisões (14 dias)')).toBeInTheDocument()
  })
})
