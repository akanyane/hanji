import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { createQueryClient } from '../lib/queryClient'
import { createAppRouter } from '../router'

/** Renders the whole app (router + query client) at `path`. */
export function renderApp(path = '/') {
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

/** Matches an element whose full text content equals `text`, even when split across children. */
export const fullText =
  (text: string, tag = 'SPAN') =>
  (_: string, element: Element | null) =>
    element?.tagName === tag && element.textContent === text
