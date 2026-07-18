import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HangulEntry } from '../../types/hangul'
import { Card } from './Card'

const entry: HangulEntry = {
  id: 'vowel-a',
  hangul: 'ㅏ',
  romanization: 'A',
  category: 'vowel',
}

describe('Card', () => {
  it('shows only the hangul character by default', () => {
    render(<Card entry={entry} />)

    expect(screen.getByText('ㅏ')).toBeInTheDocument()
    expect(screen.queryByText('A')).not.toBeInTheDocument()
  })

  it('reveals romanization and category on click', () => {
    render(<Card entry={entry} />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Vowel')).toBeInTheDocument()
  })

  it('toggles back to hidden on a second click', () => {
    render(<Card entry={entry} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(screen.queryByText('A')).not.toBeInTheDocument()
  })

  it('shows "(silent)" for entries with empty romanization', () => {
    render(<Card entry={{ ...entry, romanization: '' }} />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('(silent)')).toBeInTheDocument()
  })
})
