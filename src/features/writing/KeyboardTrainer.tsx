import { AnimatePresence, motion } from 'motion/react'
import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HangulKeyboard } from '../../components/hangul/HangulKeyboard'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import { pop, shake, spring } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { VOCABULARY } from '../../content/vocabulary'
import { useRecordPractice } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import {
  EMPTY_IME_STATE,
  imeBackspace,
  imeInput,
  imeText,
  keysFor,
  keyToJamo,
  typedJamo,
} from '../../lib/ime/dubeolsik'
import { shuffle } from '../../lib/quiz/quiz'

const SESSION_SIZE = 10

function drawWords(): string[] {
  const short = VOCABULARY.filter(
    (w) => !w.word.includes(' ') && w.word.length <= 3,
  )
  return shuffle(short, Math.random)
    .slice(0, SESSION_SIZE)
    .map((w) => w.word)
}

/** Physical key → jamo, by key *position* (e.code), so any OS layout or IME works. */
function jamoFromEvent(e: KeyboardEvent): string | undefined {
  const match = /^Key([A-Z])$/.exec(e.code)
  if (!match) return undefined
  const letter = e.shiftKey ? match[1] : match[1].toLowerCase()
  return keyToJamo(letter)
}

export function KeyboardTrainer({ words: initialWords }: { words?: string[] }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const [words, setWords] = useState(() => initialWords ?? drawWords())
  const [wordIndex, setWordIndex] = useState(0)
  const [ime, setIme] = useState(EMPTY_IME_STATE)
  const [typed, setTyped] = useState<string[]>([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [missFlash, setMissFlash] = useState(0)
  const [showKeyboard, setShowKeyboard] = useState(true)

  const word = words[wordIndex]
  const target = useMemo(() => (word ? typedJamo(word) : []), [word])
  const expected = target[typed.length]
  const wordDone = word !== undefined && typed.length === target.length
  const finished = wordIndex >= words.length
  const accuracy =
    hits + misses === 0 ? 100 : Math.round((hits / (hits + misses)) * 100)
  const meaning = VOCABULARY.find((w) => w.word === word)
  const { mutate: record } = useRecordPractice()

  // A finished session counts each word, weighted by keystroke accuracy.
  // biome-ignore lint/correctness/useExhaustiveDependencies: once per session
  useEffect(() => {
    if (finished)
      record({
        skill: 'writing',
        source: 'writing:keyboard',
        correct: Math.round((accuracy / 100) * words.length),
        total: words.length,
      })
  }, [finished])

  const input = (jamo: string) => {
    if (wordDone || !expected) return
    if (jamo === expected) {
      setTyped((list) => [...list, jamo])
      setIme((state) => imeInput(state, jamo))
      setHits((h) => h + 1)
    } else {
      setMisses((m) => m + 1)
      setMissFlash((f) => f + 1)
    }
  }

  const backspace = () => {
    if (typed.length === 0) return
    setTyped((list) => list.slice(0, -1))
    setIme((state) => imeBackspace(state))
  }

  const nextWord = () => {
    setWordIndex((i) => i + 1)
    setTyped([])
    setIme(EMPTY_IME_STATE)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      backspace()
      return
    }
    if (wordDone && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      nextWord()
      return
    }
    const jamo = jamoFromEvent(e)
    if (jamo) {
      e.preventDefault()
      input(jamo)
    }
  }

  if (finished) {
    return (
      <motion.div
        variants={pop}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center gap-3 py-8 text-center"
        role="status"
      >
        {accuracy >= 90 && <Confetti />}
        <p className="text-5xl font-extrabold">
          <AnimatedNumber value={accuracy} />%
        </p>
        <p className="font-semibold">
          {t('writing.keyboard.finished', {
            count: words.length,
            value: accuracy,
          })}
        </p>
        <Button
          onClick={() => {
            setWords(drawWords())
            setWordIndex(0)
            setHits(0)
            setMisses(0)
          }}
        >
          {t('writing.keyboard.again')}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <p className="text-ink-600 dark:text-ink-300">
        {t('writing.keyboard.description')}
      </p>
      <div className="flex items-center justify-between text-sm text-ink-500 dark:text-ink-400">
        <span>
          {t('writing.keyboard.progress', {
            current: wordIndex + 1,
            total: words.length,
          })}
        </span>
        <span>{t('writing.keyboard.accuracy', { value: accuracy })}</span>
      </div>
      <ProgressBar
        value={wordIndex}
        max={words.length}
        label={t('writing.keyboard.progress', {
          current: wordIndex + 1,
          total: words.length,
        })}
      />
      <motion.div
        tabIndex={0}
        role="textbox"
        aria-label={`${t('writing.keyboard.type')} ${word}`}
        onKeyDown={onKeyDown}
        animate={missFlash ? shake : {}}
        key={`${wordIndex}-${missFlash}`}
        className="flex cursor-text flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-paper outline-none ring-pine-400 focus:ring-4 dark:bg-ink-900"
      >
        <span className="text-sm text-ink-500 dark:text-ink-400">
          {t('writing.keyboard.type')} {meaning && <>({l(meaning.meaning)})</>}
        </span>
        <span lang="ko" className="text-5xl font-bold tracking-wide">
          {word}
        </span>
        <span
          lang="ko"
          className={cn(
            'min-h-14 text-5xl font-bold',
            wordDone
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-pine-600 dark:text-pine-400',
          )}
        >
          {imeText(ime) || (
            <span className="text-base font-normal text-ink-400">
              {t('writing.keyboard.focusHint')}
            </span>
          )}
        </span>
        <AnimatePresence mode="wait">
          {wordDone ? (
            <motion.div
              key="done"
              variants={pop}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3"
            >
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                ✓ {t('writing.keyboard.done')}
              </span>
              <Button onClick={nextWord}>{t('common.next')} →</Button>
            </motion.div>
          ) : (
            expected && (
              <motion.span
                key={typed.length}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="text-sm text-ink-500 dark:text-ink-400"
              >
                {t('writing.keyboard.nextKey', {
                  key: `${expected} (${keysFor(expected).toUpperCase()}${keysFor(expected) !== keysFor(expected).toLowerCase() ? ' + Shift' : ''})`,
                })}
              </motion.span>
            )
          )}
        </AnimatePresence>
      </motion.div>

      <Button
        variant="ghost"
        className="self-center text-sm"
        onClick={() => setShowKeyboard((s) => !s)}
        aria-pressed={showKeyboard}
      >
        {showKeyboard
          ? t('writing.keyboard.hideKeyboard')
          : t('writing.keyboard.showKeyboard')}
      </Button>
      {showKeyboard && (
        <HangulKeyboard
          onJamo={input}
          onBackspace={backspace}
          highlight={expected ? keysFor(expected) : undefined}
        />
      )}
    </div>
  )
}
