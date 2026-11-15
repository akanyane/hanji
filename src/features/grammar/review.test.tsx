import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { getLesson } from '../../content/grammar'
import { db } from '../../db/db'
import { getCard, recordLessonResult } from '../../db/srs'
import { toastActions } from '../../stores/toasts'
import { renderApp } from '../../test/renderApp'

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  localStorage.clear()
  toastActions.clear()
})

/** Enrolls a lesson long ago, so its card is due now. */
async function dueLesson(id: string) {
  await recordLessonResult(id, 3, 3, new Date(Date.now() - 90 * 86_400_000))
}

describe('grammar reviews', () => {
  it('enrolls a lesson in the reviews when its exercises are passed', async () => {
    const lesson = getLesson('topic-eun-neun')
    if (!lesson) throw new Error('missing lesson')
    const user = userEvent.setup()
    renderApp(`/grammar/${lesson.id}`)
    await user.click(
      await screen.findByRole('button', { name: 'Fazer exercícios' }),
    )
    for (const [i, ex] of lesson.exercises.entries()) {
      await screen.findByText(
        new RegExp(`Questão ${i + 1} de ${lesson.exercises.length}`),
      )
      // Choices are shuffled; the previous question may still be leaving.
      const name = new RegExp(`^\\d${escapeRegExp(ex.choices[ex.answer])}$`)
      const button = await waitFor(() => {
        const found = screen.getByRole('button', { name })
        expect(found).toBeEnabled()
        return found
      })
      await user.click(button)
      await user.click(await screen.findByRole('button', { name: /Continuar/ }))
    }
    await waitFor(async () =>
      expect(await getCard(lesson.id, 'grammar')).toBeDefined(),
    )
  })

  it('runs a review session for due lessons and reschedules them', async () => {
    await dueLesson('past-tense')
    const before = await getCard('past-tense', 'grammar')
    const user = userEvent.setup()
    renderApp('/grammar/review')
    expect(await screen.findByText('1 lição para revisar')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'Revisar (2 exercícios)' }),
    )
    for (let i = 0; i < 2; i++) {
      await screen.findByText(new RegExp(`Questão ${i + 1} de 2`))
      await user.keyboard('1')
      await user.click(await screen.findByRole('button', { name: /Continuar/ }))
    }
    expect(await screen.findByText('Revisão feita!')).toBeInTheDocument()
    const after = await getCard('past-tense', 'grammar')
    expect(after?.dueAt.getTime()).toBeGreaterThan(Date.now())
    expect(after?.updatedAt).toBeGreaterThan(before?.updatedAt ?? 0)
  })

  it('says when there is nothing to review', async () => {
    renderApp('/grammar/review')
    expect(
      await screen.findByText('Nada para revisar agora.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Passe nos exercícios de uma lição/),
    ).toBeInTheDocument()
  })

  it('announces due reviews on the lessons page and on Today', async () => {
    await dueLesson('past-tense')
    renderApp('/grammar')
    expect(
      await screen.findByRole('link', {
        name: /1 lição está na hora de revisar/,
      }),
    ).toHaveAttribute('href', '/grammar/review')
  })

  it('lists the grammar review on the Today page', async () => {
    await dueLesson('past-tense')
    renderApp('/today')
    expect(
      await screen.findByRole('heading', { name: 'Revisão de gramática' }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 lição está na hora')).toBeInTheDocument()
  })
})
