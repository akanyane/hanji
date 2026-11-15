import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuizSession, type SessionQuestion } from './QuizSession'

const question = (): SessionQuestion => ({
  id: 'q1',
  prompt: 'Pick one',
  answerId: 'a',
  choices: ['a', 'b', 'c', 'd'].map((id) => ({ id, label: `choice ${id}` })),
})

const labels = () =>
  within(
    screen.getByText('Pick one').closest('div')?.parentElement ?? document.body,
  )
    .getAllByRole('button')
    .map((b) => b.textContent?.replace(/^\d/, ''))
    .filter((t) => t?.startsWith('choice'))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('QuizSession', () => {
  it('shuffles choices, since content lists the right answer first', () => {
    // With rng() = 0 the Fisher–Yates shuffle never keeps the original order.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    render(<QuizSession questions={[question()]} onComplete={() => {}} />)
    expect(labels()).not.toEqual([
      'choice a',
      'choice b',
      'choice c',
      'choice d',
    ])
  })

  it('keeps the order when the questions are rebuilt (same ids)', () => {
    const { rerender } = render(
      <QuizSession questions={[question()]} onComplete={() => {}} />,
    )
    const first = labels()
    for (let i = 0; i < 5; i++)
      rerender(<QuizSession questions={[question()]} onComplete={() => {}} />)
    expect(labels()).toEqual(first)
  })

  it('can keep the given order', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    render(
      <QuizSession
        questions={[question()]}
        onComplete={() => {}}
        shuffleChoices={false}
      />,
    )
    expect(labels()).toEqual(['choice a', 'choice b', 'choice c', 'choice d'])
  })
})
