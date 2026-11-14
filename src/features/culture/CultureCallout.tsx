import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
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
      className="flex flex-col gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900 dark:bg-rose-950/30"
    >
      <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
        🏮 {t('dialogues.cultureNote')}
      </p>
      {notes.map((note) => (
        <Link
          key={note.id}
          to="/culture/$noteId"
          params={{ noteId: note.id }}
          className="group flex flex-col"
        >
          <span className="font-semibold group-hover:underline">
            {note.icon} {l(note.title)}
          </span>
          <span className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
            {l(note.paragraphs[0])}
          </span>
        </Link>
      ))}
    </motion.aside>
  )
}
