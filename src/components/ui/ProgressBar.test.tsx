import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('exposes accessible progress values', () => {
    render(<ProgressBar value={3} max={10} label="Progresso do quiz" />)
    const bar = screen.getByRole('progressbar', { name: 'Progresso do quiz' })
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemax', '10')
  })

  it('clamps out-of-range values', () => {
    render(<ProgressBar value={15} max={10} label="p" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '10',
    )
  })
})
