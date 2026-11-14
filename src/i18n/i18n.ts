import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { settingsStore } from '../stores/settings'
import { DEFAULT_LOCALE } from './locales'
import { en } from './messages/en'
import { ptBR } from './messages/pt-BR'

export const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
} as const

// Messages are bundled (they're small), so init is synchronous and the
// first render already has the right language.
i18next.use(initReactI18next).init({
  resources,
  lng: settingsStore.state.locale,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false }, // React already escapes output
  initAsync: false,
})

function applyLocale(locale: string) {
  if (i18next.language !== locale) i18next.changeLanguage(locale)
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
    document.title = i18next.t('common.appName')
  }
}

applyLocale(settingsStore.state.locale)
settingsStore.subscribe((settings) => applyLocale(settings.locale))

export default i18next
