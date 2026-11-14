import { createStore, useSelector } from '@tanstack/react-store'

// "Install app" support. Chromium browsers fire `beforeinstallprompt` when
// the PWA is installable; the event is kept so a button can show the
// native prompt later. Safari (iOS) has no prompt: the UI shows manual steps.

/** Not in TypeScript's DOM types yet. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallState {
  canInstall: boolean
  installed: boolean
}

let deferred: BeforeInstallPromptEvent | null = null

export const installStore = createStore<InstallState>({
  canInstall: false,
  installed:
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches,
})

export function listenForInstallPrompt(target: Window = window) {
  target.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault() // show our own button instead of the mini-infobar
    deferred = event as BeforeInstallPromptEvent
    installStore.setState((s) => ({ ...s, canInstall: true }))
  })
  target.addEventListener('appinstalled', () => {
    deferred = null
    installStore.setState(() => ({ canInstall: false, installed: true }))
  })
}

/** Shows the browser's install prompt. Resolves to true when accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false
  const event = deferred
  deferred = null // a prompt event can only be used once
  installStore.setState((s) => ({ ...s, canInstall: false }))
  await event.prompt()
  const { outcome } = await event.userChoice
  return outcome === 'accepted'
}

export function useInstallState(): InstallState {
  return useSelector(installStore, (s) => s)
}
