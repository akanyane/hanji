import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LOCALE_LABELS, LOCALES, type Locale } from '../../i18n/locales'
import { cn } from '../../lib/cn'
import { settingsActions, useSettings } from '../../stores/settings'

/** Short code shown on the button (the full name is in the menu). */
const SHORT: Record<Locale, string> = { 'pt-BR': 'PT', en: 'EN' }

/**
 * Language menu styled like the navigation menus (a native <select> can't
 * be themed). Radio menu items; Escape, outside click and choosing close it.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation()
  const locale = useSettings((s) => s.locale)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (l: Locale) => {
    settingsActions.setLocale(l)
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${SHORT[locale]} · ${t('nav.language')}: ${LOCALE_LABELS[locale]}`}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-ink-300 px-2.5 py-1 text-sm font-medium transition-colors hover:border-ink-900 dark:border-ink-700 dark:hover:border-ink-200"
      >
        <span
          lang="ko"
          aria-hidden="true"
          className="font-serif text-seal-600 dark:text-seal-400"
        >
          말
        </span>
        {SHORT[locale]}
        <motion.span
          aria-hidden="true"
          className="text-[0.6rem] text-ink-500"
          animate={{ rotate: open ? 180 : 0 }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="menu"
            aria-label={t('nav.language')}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hanji absolute top-full right-0 z-40 mt-3 flex min-w-44 flex-col gap-0.5 rounded-lg border border-ink-300 bg-ink-50 p-1.5 shadow-lift dark:border-ink-700 dark:bg-ink-900"
          >
            {LOCALES.map((l) => {
              const selected = l === locale
              return (
                <li key={l} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    lang={l}
                    onClick={() => choose(l)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-ink-900/5 dark:hover:bg-ink-50/10',
                      selected && 'text-seal-700 dark:text-seal-300',
                    )}
                  >
                    {LOCALE_LABELS[l]}
                    <span className="w-8 text-right text-xs text-ink-500">
                      {selected ? '●' : SHORT[l]}
                    </span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
