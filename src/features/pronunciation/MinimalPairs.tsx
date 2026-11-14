import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pop, shake, spring } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { SpeedControl } from '../../components/ui/SpeedControl'
import { MINIMAL_PAIRS } from '../../content/pronunciation/practice'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { speakKorean } from '../../services/speech'
import { useSettings } from '../../stores/settings'

const randomIndex = (n: number) => Math.floor(Math.random() * n)

export function MinimalPairs() {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const voice = useKoreanVoice()
  const [groupId, setGroupId] = useState(MINIMAL_PAIRS[0].id)
  const group = MINIMAL_PAIRS.find((g) => g.id === groupId) ?? MINIMAL_PAIRS[0]
  const [target, setTarget] = useState(() => randomIndex(group.words.length))
  const [picked, setPicked] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState({ right: 0, total: 0 })

  const play = useCallback(
    () => speakKorean(group.words[target].word, { rate }),
    [group, target, rate],
  )

  // Play the new word as soon as a round starts (after a user gesture).
  // biome-ignore lint/correctness/useExhaustiveDependencies: play once per round
  useEffect(() => {
    if (round > 0) play()
  }, [round])

  const choose = (index: number) => {
    if (picked !== null) return
    setPicked(index)
    setScore((s) => ({
      right: s.right + (index === target ? 1 : 0),
      total: s.total + 1,
    }))
  }

  const next = () => {
    setTarget(randomIndex(group.words.length))
    setPicked(null)
    setRound((r) => r + 1)
  }

  const switchGroup = (id: string) => {
    const g = MINIMAL_PAIRS.find((x) => x.id === id)
    if (!g) return
    setGroupId(id)
    setTarget(randomIndex(g.words.length))
    setPicked(null)
    setScore({ right: 0, total: 0 })
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-slate-600 dark:text-slate-300">
        {t('pronunciation.pairs.description')}
      </p>
      <fieldset className="flex flex-wrap gap-2">
        {MINIMAL_PAIRS.map((g) => (
          <Chip
            key={g.id}
            selected={g.id === groupId}
            onClick={() => switchGroup(g.id)}
          >
            <span lang="ko">{g.contrast}</span>
          </Chip>
        ))}
      </fieldset>
      <SpeedControl />

      {voice === 'unsupported' ? (
        <p className="rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {t('listening.unsupported')}
        </p>
      ) : (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {l(group.description)} · {score.right}/{score.total}
          </p>
          <motion.button
            type="button"
            onClick={play}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t('pronunciation.pairs.play')}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-4xl text-white shadow-xl"
          >
            🔊
          </motion.button>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${groupId}-${round}`}
              className={cn(
                'grid w-full gap-3',
                group.words.length === 3 ? 'grid-cols-3' : 'grid-cols-2',
              )}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
            >
              {group.words.map((w, i) => {
                const isTarget = i === target
                const isPicked = i === picked
                return (
                  <motion.button
                    key={w.word}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => choose(i)}
                    animate={
                      picked !== null && isPicked && !isTarget
                        ? shake
                        : picked !== null && isTarget
                          ? { scale: [1, 1.08, 1] }
                          : {}
                    }
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-2xl border-2 p-4 transition-colors',
                      picked !== null && isTarget
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                        : picked !== null && isPicked
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50'
                          : 'border-slate-200 bg-white hover:border-sky-400 dark:border-slate-700 dark:bg-slate-800',
                    )}
                  >
                    <span lang="ko" className="text-3xl font-bold">
                      {w.word}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {l(w.meaning)}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
          </AnimatePresence>
          <div aria-live="assertive" className="min-h-12">
            {picked !== null && (
              <motion.div
                variants={pop}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4"
              >
                <p className="font-semibold">
                  {picked === target
                    ? `🎉 ${t('pronunciation.pairs.correct')}`
                    : t('pronunciation.pairs.incorrect', {
                        word: group.words[target].word,
                      })}
                </p>
                <Button onClick={next}>
                  {t('pronunciation.pairs.next')} →
                </Button>
              </motion.div>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('pronunciation.pairs.ttsNote')}
          </p>
        </div>
      )}
    </div>
  )
}
