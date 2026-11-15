import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// Not from ./sitemap: that module imports all the content.
import { SITE_URL } from './site'

/** Sections whose name has a `nav.<section>` label. */
const SECTIONS = new Set([
  'today',
  'hangul',
  'pronunciation',
  'vocabulary',
  'grammar',
  'numbers',
  'reading',
  'listening',
  'speaking',
  'writing',
  'dialogues',
  'culture',
  'tools',
  'progress',
])

/**
 * Keeps the tab title ("Gramática · Hanji") and the canonical URL in sync
 * with the route, so search results and bookmarks name the right page.
 */
export function useDocumentHead() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  useEffect(() => {
    const section = pathname.split('/')[1] ?? ''
    document.title = SECTIONS.has(section)
      ? `${t(`nav.${section}` as 'nav.home')} · Hanji`
      : t('common.appName')

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`
    // `t` changes with the language, so a language switch retitles too.
  }, [pathname, t])
}
