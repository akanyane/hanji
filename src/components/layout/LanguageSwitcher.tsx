import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { isLocale, LOCALE_LABELS, LOCALES } from '../../i18n/locales'
import { settingsActions, useSettings } from '../../stores/settings'

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const locale = useSettings((s) => s.locale)
  const id = useId()

  return (
    <div className="flex items-center">
      <label htmlFor={id} className="sr-only">
        {t('nav.language')}
      </label>
      <select
        id={id}
        value={locale}
        onChange={(e) => {
          if (isLocale(e.target.value))
            settingsActions.setLocale(e.target.value)
        }}
        className="rounded-full border border-slate-300 bg-white py-1 pr-7 pl-3 text-sm dark:border-slate-600 dark:bg-slate-800"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={l}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  )
}
