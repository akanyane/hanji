import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DIALOGUES } from '../../content/listening/dialogues'
import { RULE_ORDER } from '../../content/pronunciation/practice'
import { db } from '../../db/db'
import { getQuizSummary } from '../../db/quizAttempts'
import { renderApp } from '../../test/renderApp'
import { stubSpeechRecognition, stubSpeechSynthesis } from '../../test/speech'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('pronunciation module', () => {
  it('lists every sound rule', async () => {
    renderApp('/pronunciation')
    expect(await screen.findByText(/Assimilação nasal/)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(RULE_ORDER.length)
  })

  it('shows each example step by step and runs the rule quiz', async () => {
    const user = userEvent.setup()
    renderApp('/pronunciation/nasalization')
    expect(
      await screen.findByRole('heading', { name: 'Assimilação nasal' }),
    ).toBeInTheDocument()
    expect(screen.getByText('[궁물]')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Praticar esta regra' }),
    )
    for (let i = 0; i < 5; i++) {
      await screen.findByText(new RegExp(`Questão ${i + 1} de 5`))
      await user.keyboard('1')
      await user.click(await screen.findByRole('button', { name: /Continuar/ }))
    }
    expect(await screen.findByText(/Você acertou \d de 5!/)).toBeInTheDocument()
    await waitFor(async () =>
      expect(
        (await getQuizSummary('pronunciation:nasalization')).attempts,
      ).toBe(1),
    )
  })

  it('plays minimal pairs and checks the choice', async () => {
    const spoken = stubSpeechSynthesis()
    const user = userEvent.setup()
    renderApp('/pronunciation/minimal-pairs')
    await user.click(
      await screen.findByRole('button', { name: 'Tocar a palavra' }),
    )
    const target = spoken[spoken.length - 1]
    expect(['달', '딸', '탈']).toContain(target)
    await user.click(
      screen.getByRole('button', { name: new RegExp(`^${target}`) }),
    )
    expect(await screen.findByText(/Correto!/)).toBeInTheDocument()
  })
})

describe('dictation', () => {
  it('explains that audio is needed when speech synthesis is missing', async () => {
    renderApp('/listening')
    expect(
      await screen.findByText(/não conseguem tocar áudio/),
    ).toBeInTheDocument()
  })

  it('plays a sentence and accepts an exact transcription', async () => {
    const spoken = stubSpeechSynthesis()
    const user = userEvent.setup()
    renderApp('/listening')
    await waitFor(() => expect(spoken.length).toBeGreaterThan(0))

    await user.type(
      screen.getByLabelText('O que você ouviu?'),
      `${spoken[0]}{Enter}`,
    )
    expect(await screen.findByText(/Perfeito!/)).toBeInTheDocument()
    expect(screen.getByText(/Semelhança: 100%/)).toBeInTheDocument()
  })

  it('shows a syllable diff for a wrong transcription', async () => {
    stubSpeechSynthesis()
    const user = userEvent.setup()
    renderApp('/listening')
    await user.type(
      await screen.findByLabelText('O que você ouviu?'),
      '가나다{Enter}',
    )
    expect(await screen.findByText('A frase era:')).toBeInTheDocument()
  })
})

describe('dialogues', () => {
  it('plays every line in order and answers the questions', async () => {
    const spoken = stubSpeechSynthesis()
    const user = userEvent.setup()
    const dialogue = DIALOGUES[0]
    renderApp(`/listening/dialogues/${dialogue.id}`)

    await user.click(
      await screen.findByRole('button', { name: /Tocar o diálogo/ }),
    )
    await waitFor(() => expect(spoken).toEqual(dialogue.lines.map((l) => l.ko)))

    await user.click(
      screen.getByRole('button', { name: 'Mostrar transcrição' }),
    )
    expect(await screen.findByText(dialogue.lines[0].ko)).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Responder às perguntas' }),
    )
    for (let i = 0; i < dialogue.questions.length; i++) {
      await screen.findByText(
        new RegExp(`Questão ${i + 1} de ${dialogue.questions.length}`),
      )
      await user.keyboard('1')
      await user.click(await screen.findByRole('button', { name: /Continuar/ }))
    }
    // The first choice is the right answer in every question of this dialogue.
    expect(
      await screen.findByText(
        `Você acertou ${dialogue.questions.length} de ${dialogue.questions.length}!`,
      ),
    ).toBeInTheDocument()
  })
})

describe('speaking', () => {
  it('falls back to recording guidance without speech recognition', async () => {
    renderApp('/speaking')
    expect(
      await screen.findByText(/Seu navegador não reconhece fala/),
    ).toBeInTheDocument()
  })

  it('compares what was heard with the sentence, jamo by jamo', async () => {
    stubSpeechSynthesis()
    const heard = stubSpeechRecognition()
    const user = userEvent.setup()
    renderApp('/speaking')
    const sentence =
      (await screen.findAllByText(/[가-힣].*[.!?]$/))[0].textContent ?? ''
    heard.text = sentence

    await user.click(screen.getByRole('button', { name: 'Falar' }))
    expect(await screen.findByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Pronúncia excelente!')).toBeInTheDocument()
  })

  it('loops a sentence in shadowing mode and can hide the text', async () => {
    const spoken = stubSpeechSynthesis()
    const user = userEvent.setup()
    renderApp('/speaking/shadowing')
    await user.click(await screen.findByRole('button', { name: /^▶ Tocar/ }))
    await waitFor(() => expect(spoken.length).toBe(1))
    await user.click(screen.getByRole('button', { name: 'Esconder texto' }))
    expect(screen.getByText('♪ ♪ ♪')).toBeInTheDocument()
  })
})
