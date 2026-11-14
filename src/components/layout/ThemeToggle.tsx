import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { settingsActions, useSettings } from '../../stores/settings'

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useSettings((s) => s.theme)
  const dark = theme === 'dark'

  return (
    <motion.button
      type="button"
      onClick={settingsActions.toggleTheme}
      aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
      whileTap={{ scale: 0.85 }}
      className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.svg
          key={theme}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute inset-0 m-auto h-5 w-5"
          aria-hidden="true"
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {dark ? (
            <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.657-6.657a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM8.464 15.536a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0Zm9.193 2.121a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM7.05 6.464a1 1 0 0 1-1.414 0l-.707-.707A1 1 0 1 1 6.343 4.34l.707.707a1 1 0 0 1 0 1.414ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
          ) : (
            <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.273c-4.508 0-8.16-3.652-8.16-8.16 0-1.98.704-3.797 1.877-5.213a10.01 10.01 0 1 0 8.36 13.1Z" />
          )}
        </motion.svg>
      </AnimatePresence>
    </motion.button>
  )
}
