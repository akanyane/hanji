import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    // Must come before the React plugin. Generates src/routeTree.gen.ts from
    // src/routes and splits every route into its own chunk.
    // Code splitting is off in tests: a lazily loaded route compiles in the
    // middle of a test and, with parallel workers, can outlast the
    // findBy* timeout. Loading everything up front keeps tests deterministic.
    tanstackRouter({ target: 'react', autoCodeSplitting: mode !== 'test' }),
    react(),
    tailwindcss(),
    // Installable, offline-first PWA. Registration happens in src/pwa.ts
    // ("prompt" strategy: the learner chooses when to reload for an update).
    VitePWA({
      disable: mode === 'test',
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon-180x180.png',
      ],
      manifest: {
        name: 'Hanji · Learn Korean',
        short_name: 'Hanji',
        description:
          'Free platform to learn Korean, from Hangul to TOPIK. Works offline.',
        lang: 'en',
        theme_color: '#1d1915',
        background_color: '#fbf8f1',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        categories: ['education'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Every route is code-split: precache all chunks so any page opens offline.
        // Fonts are split into hundreds of Korean subsets: cache the ones a
        // learner actually uses (runtime) instead of precaching all of them.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Integration tests drive whole study sessions through the real UI.
    testTimeout: 20_000,
    // Every integration test renders the whole app in jsdom, which is
    // CPU-heavy: one worker per core starves them on a busy machine (the
    // first test of each file then times out). Half the cores is plenty.
    maxWorkers: '50%',
  },
}))
