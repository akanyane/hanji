import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createQueryClient } from '../../lib/queryClient'
import { createAppRouter } from '../../router'

function renderAt(path: string) {
  const queryClient = createQueryClient()
  const router = createAppRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [path] }),
  )
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

describe('pronunciation tool', () => {
  it('shows the pronunciation and the rules for the word in the URL', async () => {
    renderAt('/tools/pronunciation?text=국물')
    expect(await screen.findByText('[궁물]')).toBeInTheDocument()
    expect(screen.getByText('gungmul')).toBeInTheDocument()
    expect(screen.getByText('국물 → 궁물')).toBeInTheDocument()
    expect(screen.getAllByText(/Assimilação nasal/).length).toBeGreaterThan(0)
  })

  it('updates instantly while typing and syncs the URL after a pause', async () => {
    const user = userEvent.setup()
    const router = renderAt('/tools/pronunciation')
    const input = await screen.findByLabelText('Palavra ou frase em hangul')

    await user.type(input, '같이')
    expect(screen.getByText('[가치]')).toBeInTheDocument()
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ text: '같이' }),
    )
  })

  it('fills the input when an example is picked', async () => {
    const user = userEvent.setup()
    renderAt('/tools/pronunciation')
    await user.click(await screen.findByRole('button', { name: '신라' }))
    expect(screen.getByLabelText('Palavra ou frase em hangul')).toHaveValue(
      '신라',
    )
    expect(screen.getByText('[실라]')).toBeInTheDocument()
  })

  it('says when nothing changes', async () => {
    renderAt('/tools/pronunciation?text=사람')
    expect(
      await screen.findByText(/se pronuncia exatamente como se escreve/),
    ).toBeInTheDocument()
  })
})

describe('romanization tool', () => {
  it('romanizes Hangul', async () => {
    renderAt('/tools/romanization?text=신라')
    const result = await screen.findByRole('region', { name: 'Resultado' })
    expect(within(result).getByText('silla')).toBeInTheDocument()
  })

  it('converts romanization back to Hangul', async () => {
    renderAt('/tools/romanization?direction=to-hangul&text=hangeul')
    const result = await screen.findByRole('region', { name: 'Resultado' })
    expect(within(result).getByText('한글')).toBeInTheDocument()
  })

  it('switches direction and clears the input', async () => {
    const user = userEvent.setup()
    const router = renderAt('/tools/romanization?text=한글')
    await user.click(
      await screen.findByRole('button', { name: 'Latino → Hangul' }),
    )
    expect(screen.getByLabelText('Texto romanizado')).toHaveValue('')
    expect(router.state.location.search).toEqual({ direction: 'to-hangul' })
  })
})

describe('decomposer tool', () => {
  it('breaks syllables into named jamo', async () => {
    renderAt('/tools/decomposer?text=닭')
    expect(await screen.findByText('U+B2ED')).toBeInTheDocument()
    expect(screen.getByText('디귿')).toBeInTheDocument()
    expect(screen.getByText('(ㄹ + ㄱ)')).toBeInTheDocument()
    expect(screen.getByText('리을 + 기역')).toBeInTheDocument()
  })
})

describe('tools navigation', () => {
  it('reaches the tools from the main navigation', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const nav = await screen.findByRole('navigation', {
      name: 'Navegação principal',
    })
    await user.click(within(nav).getByRole('link', { name: 'Ferramentas' }))
    expect(
      await screen.findByRole('heading', { name: 'Ferramentas' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: 'Como se pronuncia?' }).length,
    ).toBeGreaterThan(0)
  })
})
