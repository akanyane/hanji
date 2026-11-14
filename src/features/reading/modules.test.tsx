import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CULTURE_NOTES } from '../../content/culture/notes'
import { DIALOGUES } from '../../content/listening/dialogues'
import { READING_TEXTS } from '../../content/reading/texts'
import { TRANSLATIONS } from '../../content/writing/writing'
import { db } from '../../db/db'
import { getCard } from '../../db/srs'
import { renderApp } from '../../test/renderApp'
import { stubSpeechSynthesis } from '../../test/speech'
import { buildCompletion } from '../dialogues/completion'
import { countSentences } from '../writing/FreeWriting'
import { checkTranslation } from '../writing/TranslationPractice'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('navigation menus', () => {
  it('groups modules into Learn and Practice menus', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const nav = await screen.findByRole('navigation', {
      name: 'Navegação principal',
    })
    const practice = within(nav).getAllByRole('button', { name: /Praticar/ })[0]
    await user.click(practice)
    expect(practice).toHaveAttribute('aria-expanded', 'true')
    expect(
      within(nav).getByRole('link', { name: /Leitura/ }),
    ).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(practice).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('reading', () => {
  it('opens a text, explains a word and adds it to the reviews', async () => {
    const user = userEvent.setup()
    renderApp(`/reading/${READING_TEXTS[0].id}`)
    await user.click(await screen.findByRole('button', { name: '이름' }))

    const dialog = await screen.findByRole('dialog', { name: '이름' })
    expect(within(dialog).getByText('nome')).toBeInTheDocument()
    await user.click(
      within(dialog).getByRole('button', {
        name: /Adicionar às minhas revisões/,
      }),
    )
    expect(
      await within(dialog).findByText(/Adicionada às suas revisões/),
    ).toBeInTheDocument()
    expect(await getCard('name')).toBeDefined()
  })

  it('shows words from the text glossary without the review button', async () => {
    const user = userEvent.setup()
    renderApp(`/reading/${READING_TEXTS[0].id}`)
    await user.click(await screen.findByRole('button', { name: '그리고' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('e; e também')).toBeInTheDocument()
    expect(
      within(dialog).queryByRole('button', { name: /Adicionar/ }),
    ).not.toBeInTheDocument()
  })

  it('reads the whole text aloud', async () => {
    const spoken = stubSpeechSynthesis()
    const user = userEvent.setup()
    renderApp(`/reading/${READING_TEXTS[0].id}`)
    await user.click(
      await screen.findByRole('button', { name: /Ouvir o texto inteiro/ }),
    )
    await waitFor(() =>
      expect(spoken).toHaveLength(READING_TEXTS[0].paragraphs.length),
    )
    expect(spoken[0]).not.toContain('[')
  })
})

describe('dialogues module', () => {
  it('builds completion steps for the second speaker', () => {
    const dialogue = DIALOGUES[0]
    const steps = buildCompletion(dialogue)
    expect(steps).toHaveLength(
      dialogue.lines.filter((l) => l.speaker === 1).length,
    )
    for (const step of steps) {
      expect(step.choices).toContain(step.answer)
      expect(new Set(step.choices).size).toBe(step.choices.length)
    }
  })

  it('shows the completion exercise and related culture notes', async () => {
    const user = userEvent.setup()
    renderApp('/dialogues/restaurant')
    expect(
      await screen.findByRole('heading', { name: /Complete o diálogo/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Etiqueta à mesa/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '두 명이에요.' }))
    expect(
      await screen.findByRole('button', { name: /Continuar/ }),
    ).toBeInTheDocument()
  })
})

describe('numbers', () => {
  it('converts any number into both systems', async () => {
    renderApp('/numbers')
    const input = await screen.findByLabelText('Número')
    fireEvent.change(input, { target: { value: '21' } })
    expect(await screen.findByText('이십일')).toBeInTheDocument()
    expect(screen.getByText('스물하나')).toBeInTheDocument()
    expect(screen.getByText('스물한 개')).toBeInTheDocument()
  })

  it('runs endless practice with feedback', async () => {
    const user = userEvent.setup()
    renderApp('/numbers/practice')
    await screen.findByText(/Sequência: 0/)
    await user.keyboard('1')
    expect(
      await screen.findByText(/Correto!|A leitura certa é/),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Próximo/ }))
  })
})

describe('writing', () => {
  it('trains the 2-set keyboard from physical key positions', async () => {
    const user = userEvent.setup()
    renderApp('/writing')
    const surface = await screen.findByRole('textbox', { name: /Digite:/ })
    const word =
      surface
        .getAttribute('aria-label')
        ?.replace(/^.*?: ?/, '')
        .replace('Digite: ', '') ?? ''
    const { keysFor } = await import('../../lib/ime/dubeolsik')
    surface.focus()
    for (const key of keysFor(word)) {
      const upper = key !== key.toLowerCase()
      fireEvent.keyDown(surface, {
        code: `Key${key.toUpperCase()}`,
        key,
        shiftKey: upper,
      })
    }
    expect(await screen.findByText(/Pronto!/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Próximo/ }))
  })

  it('checks translations tolerantly', () => {
    const ex = TRANSLATIONS.find((t) => t.id === 'student')
    if (!ex) throw new Error('missing')
    expect(checkTranslation('저는학생이에요', ex).kind).toBe('correct')
    expect(checkTranslation('학생 입니다!', ex).kind).toBe('correct')
    expect(checkTranslation('저는 학생이예요', ex).kind).toBe('close')
    expect(checkTranslation('사과', ex).kind).toBe('wrong')
  })

  it('accepts a translation in the UI', async () => {
    const user = userEvent.setup()
    renderApp('/writing/translate')
    await user.type(
      await screen.findByLabelText('Sua tradução em coreano'),
      '저는 학생이에요{Enter}',
    )
    expect(await screen.findByText(/Correto!/)).toBeInTheDocument()
  })

  it('counts sentences and ticks the checklist as you write', async () => {
    expect(countSentences('안녕하세요. 저는 아나예요! 학생이에요')).toBe(3)
    expect(countSentences('hello. world')).toBe(0)
    const user = userEvent.setup()
    renderApp('/writing/produce')
    await user.type(
      await screen.findByLabelText('Seu texto'),
      '안녕하세요. 저는 아나예요. 학생이에요.',
    )
    expect(
      screen.getByText('3 frases · Salvo neste aparelho'),
    ).toBeInTheDocument()
    expect(
      localStorage.getItem('learn-korean:writing:introduce-yourself'),
    ).toContain('아나예요')
  })
})

describe('culture', () => {
  it('lists notes and links related lessons', async () => {
    const user = userEvent.setup()
    renderApp('/culture')
    await user.click(
      await screen.findByRole('link', { name: /Formal, educado e informal/ }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Frases úteis' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Presente educado/ }),
    ).toBeInTheDocument()
    expect(CULTURE_NOTES.length).toBeGreaterThanOrEqual(8)
  })
})
