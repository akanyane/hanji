import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
import { fadeUp } from '../../components/motion/presets'
import type { CultureNote } from '../../content/culture/notes'
import { useLocalized } from '../../i18n/useLocalized'

/** Short teaser of related culture notes, shown on lessons and dialogues. */
export function CultureCallout({ notes }: { notes: CultureNote[] }) {
  const { t } = useTranslation()
  const l = useLocalized()
  if (notes.length === 0) return null
  return (
    <motion.aside
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-lg border-l-4 border-seal-500 panel-paper p-4"
    >
      <p className="font-serif text-sm font-bold text-seal-700 dark:text-seal-300">
        {t('dialogues.cultureNote')}
      </p>
      {notes.map((note) => (
        <Link
          key={note.id}
          to="/culture/$noteId"
          params={{ noteId: note.id }}
          className="group flex items-start gap-3"
        >
          <Seal text={note.icon} size="sm" />
          <span className="flex flex-col">
            <span className="font-semibold group-hover:underline">
              {l(note.title)}
            </span>
            <span className="line-clamp-2 text-sm text-ink-600 dark:text-ink-300">
              {l(note.paragraphs[0])}
            </span>
          </span>
        </Link>
      ))}
    </motion.aside>
  )
}
