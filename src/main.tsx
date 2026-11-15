import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { migrateLegacyProgress } from './db/migrateLegacy'
import './i18n/i18n'
import { createQueryClient } from './lib/queryClient'
import { setupPwa } from './pwa'
import { createAppRouter } from './router'
import './index.css'

const queryClient = createQueryClient()
const router = createAppRouter(queryClient)

setupPwa()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

// The migration runs before the first render so legacy progress shows up
// immediately. If it fails (e.g. IndexedDB unavailable) the app still opens.
migrateLegacyProgress()
  .catch((error) => console.error('Failed to migrate legacy progress', error))
  .finally(() => {
    // Fonts load after the first paint (see src/fonts.ts).
    void import('./fonts')
    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>,
    )
  })
