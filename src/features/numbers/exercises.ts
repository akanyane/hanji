// Endless number exercises. Wrong choices are the typical learner mistakes:
// the other number system, the long native form before a counter, 육월/십월,
// 일만, or a nearby number.

import {
  COUNTERS,
  type Counter,
  countWith,
  monthName,
  nativeKorean,
  readAge,
  readDate,
  readMoney,
  readTime,
  sinoKorean,
} from '../../lib/numbers/numbers'
import { shuffle } from '../../lib/quiz/quiz'

export type NumberExerciseKind =
  | 'sino'
  | 'counter'
  | 'time'
  | 'date'
  | 'money'
  | 'age'
export const NUMBER_EXERCISE_KINDS: NumberExerciseKind[] = [
  'sino',
  'counter',
  'time',
  'date',
  'money',
  'age',
]

export interface NumberExercise {
  kind: NumberExerciseKind
  /** What the learner sees, written with digits (e.g. "3개", "3:30"). */
  prompt: string
  answer: string
  choices: string[]
}

type Rng = () => number
const int = (rng: Rng, min: number, max: number) =>
  min + Math.floor(rng() * (max - min + 1))
const pick = <T>(rng: Rng, items: readonly T[]) =>
  items[Math.floor(rng() * items.length)]

const NATIVE_COUNTERS = (Object.keys(COUNTERS) as Counter[]).filter(
  (c) => COUNTERS[c] === 'native' && c !== '시' && c !== '살' && c !== '시간',
)

/** Builds the choices: the answer plus distinct wrong ones (falls back to nearby values). */
function withChoices(
  rng: Rng,
  kind: NumberExerciseKind,
  prompt: string,
  answer: string,
  wrong: string[],
  nearby: () => string,
): NumberExercise {
  const set = new Set(wrong.filter((w) => w !== answer))
  for (let guard = 0; set.size < 3 && guard < 20; guard++) {
    const extra = nearby()
    if (extra !== answer) set.add(extra)
  }
  return {
    kind,
    prompt,
    answer,
    choices: shuffle([answer, ...shuffle([...set], rng).slice(0, 3)], rng),
  }
}

function sinoExercise(rng: Rng): NumberExercise {
  // Mix small and large numbers.
  const n = pick(rng, [
    int(rng, 0, 99),
    int(rng, 100, 9999),
    int(rng, 10000, 99999),
  ])
  const answer = sinoKorean(n)
  const wrong = [
    answer.startsWith('만') ? `일${answer}` : '',
    n >= 1 && n <= 99 ? nativeKorean(n) : '',
  ]
  return withChoices(
    rng,
    'sino',
    n.toLocaleString('en-US').replace(/,/g, '.'),
    answer,
    wrong.filter(Boolean),
    () => sinoKorean(Math.max(0, n + pick(rng, [-11, -10, -1, 1, 10, 100]))),
  )
}

function counterExercise(rng: Rng): NumberExercise {
  const n = int(rng, 1, 30)
  const counter = pick(rng, NATIVE_COUNTERS)
  const answer = countWith(n, counter)
  const wrong = [`${sinoKorean(n)} ${counter}`, `${nativeKorean(n)} ${counter}`]
  return withChoices(rng, 'counter', `${n}${counter}`, answer, wrong, () =>
    countWith(Math.max(1, n + pick(rng, [-1, 1, 2])), counter),
  )
}

function timeExercise(rng: Rng): NumberExercise {
  const hour = int(rng, 1, 12)
  const minute = pick(rng, [0, 5, 10, 15, 20, 30, 45, 50])
  const answer = readTime(hour, minute)
  const minutes = minute ? ` ${countWith(minute, '분')}` : ''
  const wrong = [
    `${sinoKorean(hour)} 시${minutes}`, // Sino-Korean hour
    `${nativeKorean(hour)} 시${minutes}`, // long native form
    minute ? `${countWith(hour, '시')} ${nativeKorean(minute)} 분` : '', // native minutes
  ]
  return withChoices(
    rng,
    'time',
    `${hour}:${String(minute).padStart(2, '0')}`,
    answer,
    wrong.filter(Boolean),
    () => readTime((hour % 12) + 1, minute),
  )
}

function dateExercise(rng: Rng): NumberExercise {
  const year = int(rng, 1990, 2030)
  const month = pick(rng, [6, 10, int(rng, 1, 12)])
  const day = int(rng, 1, 28)
  const answer = readDate(year, month, day)
  const literalMonth = month === 6 ? '육월' : month === 10 ? '십월' : ''
  const wrong = [
    literalMonth
      ? `${countWith(year, '년')} ${literalMonth} ${countWith(day, '일')}`
      : '',
    `${countWith(year, '년')} ${monthName(month)} ${nativeKorean(day)} 일`,
  ]
  return withChoices(
    rng,
    'date',
    `${day}/${month}/${year}`,
    answer,
    wrong.filter(Boolean),
    () => readDate(year, month, day === 28 ? 27 : day + 1),
  )
}

function moneyExercise(rng: Rng): NumberExercise {
  const won = pick(rng, [
    int(rng, 1, 99) * 100,
    int(rng, 10, 99) * 1000,
    int(rng, 1, 9) * 10000 + int(rng, 0, 9) * 1000,
  ])
  const answer = readMoney(won)
  const wrong = [
    answer.startsWith('만') ? `일${answer}` : '',
    readMoney(won * 10),
  ]
  return withChoices(
    rng,
    'money',
    `₩${won.toLocaleString('en-US')}`,
    answer,
    wrong.filter(Boolean),
    () =>
      readMoney(
        won +
          pick(
            rng,
            [-1000, 1000, 500, 10000].filter((d) => won + d > 0),
          ),
      ),
  )
}

function ageExercise(rng: Rng): NumberExercise {
  const age = int(rng, 1, 60)
  const answer = readAge(age)
  const wrong = [`${sinoKorean(age)} 살`, `${nativeKorean(age)} 살`]
  return withChoices(rng, 'age', `${age}살`, answer, wrong, () =>
    readAge(Math.max(1, age + pick(rng, [-1, 1, 10]))),
  )
}

const MAKERS: Record<NumberExerciseKind, (rng: Rng) => NumberExercise> = {
  sino: sinoExercise,
  counter: counterExercise,
  time: timeExercise,
  date: dateExercise,
  money: moneyExercise,
  age: ageExercise,
}

export function makeNumberExercise(
  kind?: NumberExerciseKind,
  rng: Rng = Math.random,
): NumberExercise {
  return MAKERS[kind ?? pick(rng, NUMBER_EXERCISE_KINDS)](rng)
}
