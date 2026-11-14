import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db/db'
import { getQuizSummary, QUIZ_IDS } from '../../db/quizAttempts'
import { settingsActions } from '../../stores/settings'
import { renderApp } from '../../test/renderApp'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('entry detail page', () => {
  it('opens from a browse card and shows the letter details', async () => {
    const user = userEvent.setup()
    const router = renderApp('/hangul?category=consonant')
    await user.click(
      await screen.findByRole('link', { name: /^ㄱ, Consoante/ }),
    )

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/hangul/cons-g'),
    )
    expect(
      await screen.findByRole('heading', { name: 'Ordem dos traços' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Ordem dos traços de ㄱ: 1 traço/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/raiz da língua/)).toBeInTheDocument()
    expect(screen.getByText('가방')).toBeInTheDocument()
    expect(screen.getByText('gabang · bolsa')).toBeInTheDocument()
  })

  it('links to the previous and next letters of the same category', async () => {
    renderApp('/hangul/cons-n')
    expect(
      await screen.findByRole('link', { name: /Anterior ㄱ/ }),
    ).toHaveAttribute('href', '/hangul/cons-g')
    expect(screen.getByRole('link', { name: /Próximo ㄷ/ })).toHaveAttribute(
      'href',
      '/hangul/cons-d',
    )
  })

  it('shows the parts of a syllable and links to the builder', async () => {
    renderApp('/hangul/syll-ga')
    expect(
      await screen.findByRole('heading', { name: 'Formada por' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Abrir no construtor/ }),
    ).toHaveAttribute('href', expect.stringContaining('/hangul/builder'))
  })

  it('shows the practice pad fallback when canvas is unavailable', async () => {
    renderApp('/hangul/vowel-a')
    expect(
      await screen.findByText('Seu navegador não consegue desenhar aqui.'),
    ).toBeInTheDocument()
  })

  it('returns 404 for unknown entries', async () => {
    renderApp('/hangul/nope')
    expect(
      await screen.findByText('Página não encontrada.'),
    ).toBeInTheDocument()
  })
})

describe('syllable builder', () => {
  it('composes the syllable from the URL', async () => {
    renderApp('/hangul/builder?initial=ㄱ&medial=ㅡ&final=ㄹ')
    expect(await screen.findByText('[글]')).toBeInTheDocument()
    expect(screen.getByText('geul')).toBeInTheDocument()
  })

  it('updates when a jamo is picked, including "no final"', async () => {
    const user = userEvent.setup()
    const router = renderApp('/hangul/builder?initial=ㅎ&medial=ㅏ&final=ㄴ')
    await screen.findByText('[한]')

    const finals = screen.getByRole('group', { name: 'Batchim (opcional)' })
    await user.click(within(finals).getByRole('button', { name: 'Nenhum' }))
    expect(await screen.findByText('[하]')).toBeInTheDocument()
    expect(router.state.location.search).toMatchObject({ final: 'none' })

    const vowels = screen.getByRole('group', { name: 'Vogal' })
    await user.click(within(vowels).getByRole('button', { name: 'ㅘ' }))
    expect(await screen.findByText('[화]')).toBeInTheDocument()
    expect(screen.getByText(/Vogal composta/)).toBeInTheDocument()
  })
})

describe('Hangul quiz', () => {
  it('plays a full "recognize" round and saves the attempt', async () => {
    const user = userEvent.setup()
    renderApp('/hangul/quiz?category=final')
    await user.click(
      await screen.findByRole('button', { name: 'Começar quiz' }),
    )

    // Answer all 7 final-consonant questions (picking choice 1 each time).
    for (let i = 0; i < 7; i++) {
      await screen.findByText(new RegExp(`Questão ${i + 1} de 7`))
      await user.keyboard('1')
      await user.click(await screen.findByRole('button', { name: /Continuar/ }))
    }

    expect(await screen.findByText(/Você acertou \d de 7!/)).toBeInTheDocument()
    await waitFor(async () =>
      expect((await getQuizSummary(QUIZ_IDS.hangulBasic)).attempts).toBe(1),
    )
  })

  it('shows feedback after answering', async () => {
    const user = userEvent.setup()
    renderApp('/hangul/quiz?mode=read')
    await user.click(
      await screen.findByRole('button', { name: 'Começar quiz' }),
    )
    await screen.findByText(/Questão 1 de 10/)
    await user.keyboard('2')
    expect(await screen.findByText(/Significado:/)).toBeInTheDocument()
    expect(screen.getByText(/Correto!|A resposta era/)).toBeInTheDocument()
  })

  it('switches modes through the URL', async () => {
    const user = userEvent.setup()
    const router = renderApp('/hangul/quiz')
    await user.click(
      await screen.findByRole('button', { name: /Ler palavras/ }),
    )
    expect(router.state.location.search).toEqual({ mode: 'read' })
    expect(
      screen.queryByRole('group', { name: 'Categoria' }),
    ).not.toBeInTheDocument()
  })

  it('disables "listen" mode without speech synthesis', async () => {
    renderApp('/hangul/quiz?mode=listen')
    expect(
      await screen.findByText(/este modo não está disponível/),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar quiz' })).toBeDisabled()
  })
})

describe('language', () => {
  it('switches the whole interface and content to English', async () => {
    const user = userEvent.setup()
    renderApp('/hangul/cons-g')
    await screen.findByRole('heading', { name: 'Ordem dos traços' })

    await user.selectOptions(screen.getByLabelText('Idioma'), 'en')

    expect(
      await screen.findByRole('heading', { name: 'Stroke order' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/back of the tongue/)).toBeInTheDocument()
    expect(screen.getByText('gabang · bag')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
  })

  it('renders English from the start when that is the saved locale', async () => {
    act(() => settingsActions.setLocale('en'))
    renderApp('/tools/pronunciation?text=신라')
    expect(await screen.findAllByText(/Lateral assimilation/)).not.toHaveLength(
      0,
    )
    expect(screen.getByLabelText('Word or sentence in Hangul')).toHaveValue(
      '신라',
    )
  })
})
