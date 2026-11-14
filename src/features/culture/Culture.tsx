import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { CULTURE_NOTES, type CultureNote } from '../../content/culture/notes'
import { getLesson } from '../../content/grammar'
import { getDialogue } from '../../content/listening/dialogues'
import { useLocalized } from '../../i18n/useLocalized'

export function CultureList() {
  const l = useLocalized()
  return (
    <motion.ul
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0, 0.05)}
      initial="hidden"
      animate="visible"
    >
      {CULTURE_NOTES.map((note) => (
        <motion.li key={note.id} variants={fadeUp}>
          <Link
            to="/culture/$noteId"
            params={{ noteId: note.id }}
            className="block h-full rounded-lg"
          >
            <motion.div
              whileHover={cardHover}
              whileTap={cardTap}
              className="flex h-full flex-col gap-2 rounded-lg border border-ink-200 bg-white p-4 shadow-paper dark:border-ink-700 dark:bg-ink-900"
            >
              <Seal text={note.icon} size="lg" />
              <span className="font-semibold">{l(note.title)}</span>
              <span className="line-clamp-3 text-sm text-ink-600 dark:text-ink-300">
                {l(note.paragraphs[0])}
              </span>
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function CultureNotePage({ note }: { note: CultureNote }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const lessons = (note.relatedLessons ?? [])
    .map(getLesson)
    .filter((x) => x !== undefined)
  const dialogues = (note.relatedDialogues ?? [])
    .map(getDialogue)
    .filter((x) => x !== undefined)

  return (
    <motion.article
      className="flex flex-col gap-5"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Link
        to="/culture"
        className="self-start text-sm font-medium text-pine-700 hover:underline dark:text-pine-400"
      >
        ← {t('culture.back')}
      </Link>
      <motion.header
        variants={fadeUp}
        className="flex items-center gap-5 rounded-xl panel-ink p-6 shadow-paper"
      >
        <Seal text={note.icon} size="xl" animate="stamp" delay={0.2} />
        <h2 className="text-2xl font-bold sm:text-3xl">{l(note.title)}</h2>
      </motion.header>
      <motion.div
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 leading-relaxed shadow-paper dark:bg-ink-900"
      >
        {note.paragraphs.map((p) => (
          <p key={p.en}>{l(p)}</p>
        ))}
      </motion.div>
      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 shadow-paper dark:bg-ink-900"
      >
        <h3 className="text-lg font-semibold">{t('culture.phrases')}</h3>
        <ul className="flex flex-col gap-3">
          {note.phrases.map((phrase) => (
            <li key={phrase.ko} className="flex items-start gap-3">
              <AudioButton
                text={phrase.ko}
                className="h-9 w-9 [&_svg]:h-4 [&_svg]:w-4"
              />
              <div>
                <p lang="ko" className="text-lg font-semibold">
                  {phrase.ko}
                </p>
                <p className="text-sm text-ink-600 dark:text-ink-300">
                  {l(phrase.translation)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </motion.section>
      {(lessons.length > 0 || dialogues.length > 0) && (
        <motion.section variants={fadeUp} className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{t('culture.related')}</h3>
          <div className="flex flex-wrap gap-2">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to="/grammar/$lessonId"
                params={{ lessonId: lesson.id }}
                className="rounded-full bg-pine-100 px-3 py-1 text-sm font-medium text-pine-800 hover:bg-pine-200 dark:bg-pine-900/50 dark:text-pine-200"
              >
                {l(lesson.title)}
              </Link>
            ))}
            {dialogues.map((d) => (
              <Link
                key={d.id}
                to="/dialogues/$dialogueId"
                params={{ dialogueId: d.id }}
                className="rounded-full bg-pine-100 px-3 py-1 text-sm font-medium text-pine-800 hover:bg-pine-200 dark:bg-pine-900/50 dark:text-pine-200"
              >
                {l(d.title)}
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.article>
  )
}
