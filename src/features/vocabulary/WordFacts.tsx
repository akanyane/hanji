import { useTranslation } from 'react-i18next'
import { AudioButton } from '../../components/ui/AudioButton'
import { PARTS_OF_SPEECH, type VocabWord } from '../../content/vocabulary'
import { useLocalized } from '../../i18n/useLocalized'
import { romanize } from '../../lib/romanization/romanize'

/** Meaning, romanization, hanja and example of a word (the "back" of a card). */
export function WordFacts({ word }: { word: VocabWord }) {
  const { t } = useTranslation()
  const l = useLocalized()

  return (
    <div className="flex flex-col gap-3 text-left">
      <div>
        <p className="text-2xl font-semibold">{l(word.meaning)}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {romanize(word.word)} · {l(PARTS_OF_SPEECH[word.pos])}
          {word.hanja && (
            <>
              {' '}
              · {t('vocabulary.session.hanja')}:{' '}
              <span lang="zh-Hant">{word.hanja}</span>
            </>
          )}
        </p>
      </div>
      <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-700/60">
        <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {t('vocabulary.session.example')}
        </p>
        <div className="flex items-start gap-2">
          <p lang="ko" className="flex-1 text-lg">
            {word.example.ko}
          </p>
          <AudioButton
            text={word.example.ko}
            className="h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
          />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {l(word.example.translation)}
        </p>
      </div>
    </div>
  )
}
