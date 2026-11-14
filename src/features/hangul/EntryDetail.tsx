import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { HandwritingPad } from '../../components/hangul/HandwritingPad'
import { StrokeOrder } from '../../components/hangul/StrokeOrder'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { type HangulEntry, hangulData } from '../../content/hangul'
import { JAMO_DETAILS } from '../../content/hangul/jamoDetails'
import { STROKES } from '../../content/hangul/strokes'
import { useLocalized } from '../../i18n/useLocalized'
import { decompose, splitCompound } from '../../lib/hangul'
import { romanize } from '../../lib/romanization/romanize'
import { entrySound } from './sound'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-2 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900"
    >
      <h2 className="text-sm font-semibold tracking-wide text-ink-500 uppercase dark:text-ink-400">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

/** Finds the browse entry for a jamo, to link syllable parts to their pages. */
function entryForJamo(jamo: string, category: 'consonant' | 'vowel') {
  return hangulData.find((e) => e.category === category && e.hangul === jamo)
}

function JamoChip({
  jamo,
  category,
}: {
  jamo: string
  category: 'consonant' | 'vowel'
}) {
  const entry = entryForJamo(jamo, category)
  const className =
    'rounded-lg bg-ink-100 px-3 py-1 text-2xl font-semibold dark:bg-ink-700'
  return entry ? (
    <Link
      to="/hangul/$entryId"
      params={{ entryId: entry.id }}
      lang="ko"
      className={`${className} hover:bg-pine-100 dark:hover:bg-pine-900`}
    >
      {jamo}
    </Link>
  ) : (
    <span lang="ko" className={className}>
      {jamo}
    </span>
  )
}

export function EntryDetail({ entry }: { entry: HangulEntry }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const details = JAMO_DETAILS[entry.id]
  // Finals reuse the stroke order of the matching consonant.
  const hasStrokes =
    entry.category !== 'syllable' && Boolean(STROKES[entry.hangul])
  const siblings = hangulData.filter((e) => e.category === entry.category)
  const index = siblings.findIndex((e) => e.id === entry.id)
  const previous = siblings[index - 1]
  const next = siblings[index + 1]
  const syllable =
    entry.category === 'syllable' ? decompose(entry.hangul) : null

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/hangul"
        className="self-start text-sm font-medium text-pine-700 hover:underline dark:text-pine-400"
      >
        ← {t('hangul.detail.back')}
      </Link>

      <motion.div
        key={entry.id}
        className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
        variants={stagger(0, 0.08)}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.span
              variants={pop}
              lang="ko"
              className="font-serif text-8xl font-bold text-ink-900 sm:text-9xl dark:text-ink-50"
            >
              {entry.hangul}
            </motion.span>
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold">
                {entry.romanization || t('common.silent')}
              </span>
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {t(`hangul.category.${entry.category}`)}
              </span>
              <AudioButton text={entrySound(entry)} />
            </div>
          </div>
          {hasStrokes && (
            <div className="flex w-full flex-col items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-ink-500 uppercase dark:text-ink-400">
                {t('hangul.detail.strokeOrder')}
              </h2>
              <StrokeOrder jamo={entry.hangul} className="w-full" />
            </div>
          )}
        </motion.div>

        <div className="flex flex-col gap-4">
          {entry.category === 'final' && (
            <Section title={t('hangul.detail.notes')}>
              <p>
                {t('hangul.detail.finalSound', {
                  sound: `[${entry.romanization}]`,
                })}
              </p>
              {entry.notes && (
                <p className="text-ink-600 dark:text-ink-300">
                  {l(entry.notes)}
                </p>
              )}
            </Section>
          )}
          {details && (
            <>
              <Section title={t('hangul.detail.howToSay')}>
                <p>{l(details.tip)}</p>
              </Section>
              <Section title={t('hangul.detail.origin')}>
                <p className="text-ink-700 dark:text-ink-200">
                  {l(details.origin)}
                </p>
                {splitCompound(entry.hangul).length > 1 && (
                  <p lang="ko" className="text-lg">
                    {splitCompound(entry.hangul).join(' + ')}
                  </p>
                )}
              </Section>
              <Section title={t('hangul.detail.example')}>
                <div className="flex items-center gap-3">
                  <span lang="ko" className="text-3xl font-semibold">
                    {details.example.word}
                  </span>
                  <AudioButton text={details.example.word} />
                </div>
                <p className="text-ink-600 dark:text-ink-300">
                  {romanize(details.example.word)} ·{' '}
                  {l(details.example.meaning)}
                </p>
              </Section>
            </>
          )}
          {entry.category !== 'final' && entry.notes && (
            <Section title={t('hangul.detail.notes')}>
              <p>{l(entry.notes)}</p>
            </Section>
          )}
          {syllable && (
            <Section title={t('hangul.detail.composedOf')}>
              <div className="flex items-center gap-2">
                <JamoChip jamo={syllable.initial} category="consonant" />
                <span aria-hidden="true">+</span>
                <JamoChip jamo={syllable.medial} category="vowel" />
              </div>
              <Link
                to="/hangul/builder"
                search={{
                  initial: syllable.initial,
                  medial: syllable.medial,
                  final: syllable.final || 'none',
                }}
                className="self-start text-sm font-medium text-pine-700 hover:underline dark:text-pine-400"
              >
                {t('hangul.detail.openInBuilder')} →
              </Link>
            </Section>
          )}
        </div>
      </motion.div>

      {hasStrokes && (
        <motion.section
          className="flex flex-col items-center gap-3 rounded-lg border border-ink-200 bg-ink-100/60 p-4 dark:border-ink-700 dark:bg-ink-800/50"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <h2 className="text-lg font-semibold">
            {t('hangul.detail.practice')}
          </h2>
          <HandwritingPad key={entry.hangul} jamo={entry.hangul} />
        </motion.section>
      )}

      <nav
        className="flex justify-between gap-4"
        aria-label={t(`hangul.category.${entry.category}`)}
      >
        {previous ? (
          <Link
            to="/hangul/$entryId"
            params={{ entryId: previous.id }}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm hover:bg-ink-100 dark:border-ink-600 dark:hover:bg-ink-800"
          >
            ← {t('common.previous')} <span lang="ko">{previous.hangul}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to="/hangul/$entryId"
            params={{ entryId: next.id }}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm hover:bg-ink-100 dark:border-ink-600 dark:hover:bg-ink-800"
          >
            {t('common.next')} <span lang="ko">{next.hangul}</span> →
          </Link>
        )}
      </nav>
    </div>
  )
}
