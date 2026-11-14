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
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
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
        name: 'Learn Korean',
        short_name: 'Korean',
        description:
          'Free platform to learn Korean, from Hangul to TOPIK. Works offline.',
        lang: 'en',
        theme_color: '#0284c7',
        background_color: '#0f172a',
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
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
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
  },
}))
