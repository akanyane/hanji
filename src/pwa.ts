import { registerSW } from 'virtual:pwa-register'
import { listenForInstallPrompt } from './services/install'
import { toastActions } from './stores/toasts'

// Service worker registration (production builds). Kept out of the React
// tree so tests never import the virtual module.
export function setupPwa() {
  listenForInstallPrompt()
  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      // "prompt" strategy: never reload in the middle of a study session
      // without asking.
      toastActions.push({
        id: 'pwa-update',
        icon: '새',
        title: (t) => t('pwa.updateTitle'),
        description: (t) => t('pwa.updateDescription'),
        action: {
          label: (t) => t('pwa.reload'),
          run: () => void updateServiceWorker(true),
        },
        durationMs: 0,
      })
    },
    onOfflineReady() {
      toastActions.push({
        id: 'pwa-offline',
        icon: '저장',
        title: (t) => t('pwa.offlineTitle'),
        description: (t) => t('pwa.offlineDescription'),
      })
    },
  })
}
