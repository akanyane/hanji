import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import {
  PARTS_OF_SPEECH,
  THEMES,
  type VocabWord,
} from '../../content/vocabulary'
import { useSrsCards } from '../../db/queries'
import { useLocale, useLocalized } from '../../i18n/useLocalized'
import { romanize } from '../../lib/romanization/romanize'

export function WordDetail({ word }: { word: VocabWord }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const locale = useLocale()
  const { data: cards } = useSrsCards()
  const card = cards?.find((c) => c.itemId === word.id)
  const firstTheme = word.themes[0]

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Link
        to="/vocabulary/dictionary"
        className="self-start text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
      >
        ← {t('vocabulary.word.back')}
      </Link>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-5 rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 p-6 text-white shadow-lg"
      >
        <motion.span
          variants={pop}
          lang="ko"
          className="text-6xl font-bold sm:text-7xl"
        >
          {word.word}
        </motion.span>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold">{l(word.meaning)}</span>
          <span className="text-white/85">{romanize(word.word)}</span>
        </div>
        <AudioButton
          text={word.word}
          className="ml-auto h-14 w-14 bg-white/20 from-transparent to-transparent [&_svg]:h-7 [&_svg]:w-7"
        />
      </motion.div>

      <motion.dl variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-800">
          <dt className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {t('vocabulary.word.partOfSpeech')}
          </dt>
          <dd className="font-semibold">{l(PARTS_OF_SPEECH[word.pos])}</dd>
        </div>
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-800">
          <dt className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {t('vocabulary.word.level')}
          </dt>
          <dd className="font-semibold">
            {t('vocabulary.deck.level', { level: word.level })}
          </dd>
        </div>
        <div className="rounded-2xl bg-white p-4 dark:bg-slate-800">
          <dt className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {t('vocabulary.word.themes')}
          </dt>
          <dd className="font-semibold">
            {word.themes
              .map((th) => `${THEMES[th].icon} ${l(THEMES[th].label)}`)
              .join(' · ')}
          </dd>
        </div>
        {word.hanja && (
          <div className="rounded-2xl bg-white p-4 dark:bg-slate-800">
            <dt className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
              {t('vocabulary.word.hanja')}
            </dt>
            <dd lang="zh-Hant" className="text-2xl font-semibold">
              {word.hanja}
            </dd>
          </div>
        )}
      </motion.dl>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-2 rounded-2xl bg-white p-4 dark:bg-slate-800"
      >
        <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {t('vocabulary.word.example')}
        </h2>
        <div className="flex items-center gap-3">
          <p lang="ko" className="flex-1 text-xl">
            {word.example.ko}
          </p>
          <AudioButton text={word.example.ko} />
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          {l(word.example.translation)}
        </p>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
      >
        <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {t('vocabulary.word.srs')}
        </h2>
        {card ? (
          <ul className="flex flex-col gap-1">
            <li>
              {t('vocabulary.word.nextReview', {
                when: new Intl.DateTimeFormat(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(card.dueAt),
              })}
            </li>
            <li>{t('vocabulary.word.reps', { count: card.card.reps })}</li>
            <li>{t('vocabulary.word.lapses', { count: card.card.lapses })}</li>
          </ul>
        ) : (
          <p className="text-slate-600 dark:text-slate-300">
            {t('vocabulary.word.notStudied')}
          </p>
        )}
        {firstTheme && (
          <Link
            to="/vocabulary/study"
            search={{ deck: `theme-${firstTheme}` }}
            className="self-start text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            {t('vocabulary.word.studyTheme', {
              theme: l(THEMES[firstTheme].label),
            })}{' '}
            →
          </Link>
        )}
      </motion.section>
    </motion.div>
  )
}
