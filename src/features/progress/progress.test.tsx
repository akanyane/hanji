import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PLACEMENT_QUESTIONS } from '../../content/progress/placement'
import { MOCK_EXAMS } from '../../content/topik/mock'
import { createBackup, serializeBackup } from '../../db/backup'
import { db } from '../../db/db'
import { getMeta, META_KEYS, recordPractice } from '../../db/progress'
import { recordQuizAttempt } from '../../db/quizAttempts'
import { installStore } from '../../services/install'
import { settingsStore } from '../../stores/settings'
import { toastActions } from '../../stores/toasts'
import { renderApp } from '../../test/renderApp'
import { stubSpeechSynthesis } from '../../test/speech'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  localStorage.clear()
  toastActions.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('progress dashboard', () => {
  it('shows level, XP, streak and accuracy per skill', async () => {
    await recordQuizAttempt({
      quizId: 'grammar:copula',
      filter: 'all',
      score: 4,
      total: 5,
    })
    await recordPractice({
      skill: 'numbers',
      source: 'numbers:practice',
      correct: 1,
      total: 2,
    })
    renderApp('/progress')
    expect(
      await screen.findByRole('heading', { name: 'Seu progresso' }),
    ).toBeInTheDocument()
    // 10 + 2×4 (quiz) + 2 + 1 (practice) = 21 XP
    expect(
      await screen.findByText('21 / 50 XP para o nível 2'),
    ).toBeInTheDocument()
    expect(screen.getByText('Estudou hoje ✓')).toBeInTheDocument()
    expect(screen.getByText('80% · 5 respostas')).toBeInTheDocument()
    expect(screen.getByText('50% · 2 respostas')).toBeInTheDocument()
    expect(screen.getAllByText('Ainda não praticada').length).toBe(7)
    expect(
      screen.getByText('1 dia ativo nas últimas 12 semanas.'),
    ).toBeInTheDocument()
  })

  it('invites to the placement test on the home page when starting', async () => {
    renderApp('/')
    const cta = await screen.findByRole('link', { name: 'Começar o teste' })
    expect(cta).toHaveAttribute('href', '/progress/placement')
  })

  it('announces a newly unlocked achievement once', async () => {
    await recordQuizAttempt({
      quizId: 'hangul-basic',
      filter: 'all',
      score: 3,
      total: 10,
    })
    renderApp('/progress/achievements')
    expect(
      await screen.findByText('Conquista desbloqueada!'),
    ).toBeInTheDocument()
    await waitFor(async () =>
      expect(await getMeta(META_KEYS.seenAchievements)).toEqual(['firstSteps']),
    )
    const card = screen.getByRole('heading', { name: /Primeiros passos/ })
    expect(card).toHaveTextContent('Desbloqueada')
  })
})

describe('placement test', () => {
  it('recommends a starting point and saves the result', async () => {
    const user = userEvent.setup()
    renderApp('/progress/placement')
    await user.click(
      await screen.findByRole('button', { name: 'Começar o teste' }),
    )
    for (const q of PLACEMENT_QUESTIONS) {
      const answer = q.choices[q.answer]
      // Level 0–2 right, level 3 wrong → level 3 ("Iniciante avançado").
      const pick =
        q.level === 3
          ? (q.choices.find((_, i) => i !== q.answer) as typeof answer)
          : answer
      const pickLabel = typeof pick === 'string' ? pick : pick['pt-BR']
      // Wait for the new question: the previous one may still be leaving
      // (exit animation) and can share a choice, e.g. 에.
      const name = new RegExp(`^\\d${escapeRegExp(pickLabel)}$`)
      const button = await waitFor(() => {
        const found = screen.getByRole('button', { name })
        expect(found).toBeEnabled()
        return found
      })
      await user.click(button)
      await user.click(screen.getByRole('button', { name: /Continuar/ }))
    }
    expect(
      await screen.findByRole('heading', { name: 'Iniciante avançado' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Ir para Leitura/ }),
    ).toHaveAttribute('href', '/reading')
    await waitFor(async () =>
      expect(await getMeta(META_KEYS.placement)).toMatchObject({
        level: 3,
        correct: 12,
        total: 16,
      }),
    )
  })
})

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('TOPIK mock exam', () => {
  it('limits audio plays, lets you answer and scores the exam', async () => {
    const spoken = stubSpeechSynthesis()
    const user = userEvent.setup()
    const exam = MOCK_EXAMS[0]
    renderApp(`/progress/exam/${exam.id}`)
    await user.click(
      await screen.findByRole('button', { name: 'Começar o simulado' }),
    )
    expect(screen.getByRole('timer')).toHaveTextContent('30:00')

    const play = screen.getByRole('button', { name: 'Tocar o áudio' })
    await user.click(play)
    await waitFor(() => expect(spoken).toEqual(['우산이 있어요?']))
    await waitFor(() => expect(play).toBeEnabled())
    await user.click(play)
    await waitFor(() =>
      expect(
        screen.getByText('Nenhuma reprodução restante'),
      ).toBeInTheDocument(),
    )
    expect(play).toBeDisabled()

    for (const [i, q] of exam.questions.entries()) {
      // The last question is answered wrong.
      const choice =
        i === exam.questions.length - 1 ? q.choices[1] : q.choices[0]
      // The previous question may still be animating out with the same choice.
      const button = await waitFor(() => {
        const found = screen
          .getAllByRole('button', { name: choice })
          .find((b) =>
            b.closest('section')?.textContent?.startsWith(`${i + 1}. `),
          )
        if (!found) throw new Error(`question ${i + 1} not shown yet`)
        return found
      })
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'true')
      if (i < exam.questions.length - 1)
        await user.click(screen.getByRole('button', { name: /Próximo/ }))
    }
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(
      await screen.findByText('Áudio 10/10 · Leitura 9/10'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Revise suas respostas' }),
    ).toBeInTheDocument()
    await waitFor(async () => {
      const [attempt] = await db.quizAttempts.toArray()
      expect(attempt).toMatchObject({
        quizId: 'topik:mock-1',
        score: 95,
        total: 100,
      })
      expect(await db.practiceEvents.count()).toBe(2)
    })
  })

  it('asks before submitting with unanswered questions', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    renderApp(`/progress/exam/${MOCK_EXAMS[0].id}`)
    await user.click(
      await screen.findByRole('button', { name: 'Começar o simulado' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Ir para a questão 20' }),
    )
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(confirm).toHaveBeenCalledWith(
      '20 questões estão sem resposta. Enviar mesmo assim?',
    )
    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('lists exams from the progress tabs', async () => {
    const user = userEvent.setup()
    renderApp('/progress')
    const tabs = await screen.findByRole('navigation', {
      name: 'Seções do progresso',
    })
    await user.click(within(tabs).getByRole('link', { name: 'Simulado TOPIK' }))
    expect(
      await screen.findByRole('link', { name: /Simulado TOPIK I nº 1/ }),
    ).toBeInTheDocument()
  })
})

describe('data page', () => {
  it('imports a backup after confirmation', async () => {
    await recordQuizAttempt({
      quizId: 'reading:x',
      filter: 'all',
      score: 2,
      total: 3,
    })
    const text = serializeBackup(
      await createBackup({ ...settingsStore.state, speechRate: 0.75 }),
    )
    await db.quizAttempts.clear()

    const user = userEvent.setup()
    renderApp('/progress/data')
    const input = await screen.findByLabelText('Arquivo de backup')
    const file = new File([text], 'backup.json', { type: 'application/json' })
    fireEvent.change(input, { target: { files: [file] } })

    expect(
      await screen.findByText('Substituir seu progresso atual?'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/1 exercícios, 0 palavras e 0 revisões/),
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'Substituir e restaurar' }),
    )
    expect(await screen.findByText(/Progresso restaurado!/)).toBeInTheDocument()
    expect(await db.quizAttempts.count()).toBe(1)
    expect(settingsStore.state.speechRate).toBe(0.75)
  })

  it('explains why a file is rejected', async () => {
    renderApp('/progress/data')
    const input = await screen.findByLabelText('Arquivo de backup')
    fireEvent.change(input, {
      target: { files: [new File(['{"app":"x"}'], 'x.json')] },
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Este arquivo não é um backup do Aprenda Coreano.',
    )
  })

  it('offers the native install prompt when available', async () => {
    installStore.setState(() => ({ canInstall: true, installed: false }))
    renderApp('/progress/data')
    expect(
      await screen.findByRole('button', { name: /Instalar/ }),
    ).toBeInTheDocument()
    installStore.setState(() => ({ canInstall: false, installed: false }))
  })
})
