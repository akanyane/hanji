import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { migrateLegacyProgress } from './db/migrateLegacy'
import './i18n/i18n'
import { createQueryClient } from './lib/queryClient'
import { setupPwa } from './pwa'
import { createAppRouter } from './router'
// Self-hosted fonts (unicode-range subsets: only the glyphs in use are downloaded).
// Latin (with accents) comes from IBM Plex Sans, Hangul from its KR sibling.
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-sans-kr/400.css'
import '@fontsource/ibm-plex-sans-kr/500.css'
import '@fontsource/ibm-plex-sans-kr/600.css'
import '@fontsource/ibm-plex-sans-kr/700.css'
import '@fontsource/gowun-batang/400.css'
import '@fontsource/gowun-batang/700.css'
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
    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>,
    )
  })
