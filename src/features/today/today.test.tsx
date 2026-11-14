import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { GRAMMAR_LESSONS } from '../../content/grammar'
import { db } from '../../db/db'
import { META_KEYS, setMeta } from '../../db/progress'
import { recordQuizAttempt } from '../../db/quizAttempts'
import { settingsActions, settingsStore } from '../../stores/settings'
import { toastActions } from '../../stores/toasts'
import { renderApp } from '../../test/renderApp'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  localStorage.clear()
  toastActions.clear()
  settingsActions.setDailyGoal(50)
})

describe('today page', () => {
  it('starts a beginner with Hangul and first words', async () => {
    renderApp('/today')
    expect(
      await screen.findByRole('heading', { name: 'Aprender a ler Hangul' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Palavras' }),
    ).toBeInTheDocument()
    expect(screen.getByText('0 de 2 feitas')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '0 de 50 XP hoje' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Começar' })[0]).toHaveAttribute(
      'href',
      '/hangul/quiz',
    )
  })

  it('plans grammar from the placement level and ticks what was done today', async () => {
    await setMeta(META_KEYS.placement, {
      level: 1,
      correct: 8,
      total: 16,
      at: Date.now(),
    })
    const first = GRAMMAR_LESSONS[0]
    await recordQuizAttempt({
      quizId: `grammar:${first.id}`,
      filter: 'all',
      score: 3,
      total: 3,
    })
    renderApp('/today')
    const grammar = (
      await screen.findByRole('heading', { name: /Lição de gramática/ })
    ).closest('li')
    if (!grammar) throw new Error('no grammar task')
    expect(within(grammar).getByText('Feito')).toBeInTheDocument()
    expect(
      within(grammar).getByText(
        new RegExp(first.pattern.replace(/[()]/g, '\\$&')),
      ),
    ).toBeInTheDocument()
    expect(
      within(grammar).getByRole('link', { name: 'Fazer mais' }),
    ).toHaveAttribute('href', `/grammar/${first.id}`)
    // 10 + 2×3 XP from the quiz.
    expect(
      screen.getByRole('img', { name: '16 de 50 XP hoje' }),
    ).toBeInTheDocument()
  })

  it('changes the daily goal', async () => {
    const user = userEvent.setup()
    renderApp('/today')
    await user.click(await screen.findByRole('button', { name: /Intensa/ }))
    expect(settingsStore.state.dailyGoal).toBe(100)
    expect(
      await screen.findByRole('img', { name: '0 de 100 XP hoje' }),
    ).toBeInTheDocument()
  })

  it('links the home page to today once the learner has started', async () => {
    await recordQuizAttempt({
      quizId: 'hangul-basic',
      filter: 'all',
      score: 8,
      total: 10,
    })
    renderApp('/')
    const card = await screen.findByRole('link', {
      name: /Continuar a sessão de hoje/,
    })
    expect(card).toHaveAttribute('href', '/today')
  })
})
