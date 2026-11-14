// Korean numbers. Korean has two number systems:
//
// - Sino-Korean (일, 이, 삼…), from Chinese: used for dates, money, minutes,
//   phone numbers, floors and anything above 99.
// - Native Korean (하나, 둘, 셋…): used to count things with counters
//   (개, 명, 마리…), for hours and for age (살), from 1 to 99.
//
// Native numbers 1–4 and 20 shorten before a counter:
// 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네, 스물 → 스무 (한 개, 스무 살).

const SINO_DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
const SMALL_UNITS = ['', '십', '백', '천']
/** Korean groups digits by four: 만 = 10⁴, 억 = 10⁸, 조 = 10¹². */
const BIG_UNITS = ['', '만', '억', '조']

const NATIVE_ONES = [
  '',
  '하나',
  '둘',
  '셋',
  '넷',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
]
const NATIVE_ONES_COUNTER = [
  '',
  '한',
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
]
const NATIVE_TENS = [
  '',
  '열',
  '스물',
  '서른',
  '마흔',
  '쉰',
  '예순',
  '일흔',
  '여든',
  '아흔',
]

/** Reads a 4-digit group (0–9999). A leading 1 is silent before 십/백/천: 십, 백, 천. */
function readGroup(group: number): string {
  let text = ''
  const digits = String(group).padStart(4, '0')
  for (let i = 0; i < 4; i++) {
    const digit = Number(digits[i])
    const unit = 3 - i
    if (digit === 0) continue
    text +=
      (digit === 1 && unit > 0 ? '' : SINO_DIGITS[digit]) + SMALL_UNITS[unit]
  }
  return text
}

export interface SinoOptions {
  /** Put a space between 만/억/조 groups, as Korean spelling does (만 오천). */
  spaced?: boolean
}

/** Sino-Korean reading of a whole number from 0 up to 10¹⁶ − 1. */
export function sinoKorean(
  n: number,
  { spaced = false }: SinoOptions = {},
): string {
  if (!Number.isInteger(n) || n < 0 || n >= 1e16)
    throw new RangeError(`Unsupported number: ${n}`)
  if (n === 0) return SINO_DIGITS[0]
  const parts: string[] = []
  let rest = n
  for (let i = 0; rest > 0; i++) {
    const group = rest % 10000
    rest = Math.floor(rest / 10000)
    if (group === 0) continue
    // 만 alone is "만", not "일만"; but 억 and 조 keep the 일 (일억).
    const words = i === 1 && group === 1 ? '' : readGroup(group)
    parts.unshift(words + BIG_UNITS[i])
  }
  return parts.join(spaced ? ' ' : '')
}

export interface NativeOptions {
  /** Use the shortened form that goes before a counter (한, 두, 세, 네, 스무). */
  counter?: boolean
}

/** Native Korean reading of a number from 1 to 99. */
export function nativeKorean(
  n: number,
  { counter = false }: NativeOptions = {},
): string {
  if (!Number.isInteger(n) || n < 1 || n > 99)
    throw new RangeError(`Native numbers go from 1 to 99: ${n}`)
  const tens = Math.floor(n / 10)
  const ones = n % 10
  if (counter && n === 20) return '스무'
  return NATIVE_TENS[tens] + (counter ? NATIVE_ONES_COUNTER : NATIVE_ONES)[ones]
}

/** Which number system each counter takes. */
export const COUNTERS = {
  개: 'native', // things
  명: 'native', // people
  마리: 'native', // animals
  권: 'native', // books
  잔: 'native', // cups, glasses
  병: 'native', // bottles
  장: 'native', // flat things: paper, tickets
  대: 'native', // vehicles, machines
  번: 'native', // times (occurrences)
  살: 'native', // age
  시: 'native', // o'clock
  시간: 'native', // hours (duration)
  원: 'sino', // won
  분: 'sino', // minutes
  초: 'sino', // seconds
  년: 'sino', // years
  일: 'sino', // days (date)
  층: 'sino', // floors
  호선: 'sino', // subway lines
  인분: 'sino', // portions
} as const

export type Counter = keyof typeof COUNTERS

/** A number read with its counter, e.g. (3, 개) → "세 개", (3, 층) → "삼 층". */
export function countWith(n: number, counter: Counter): string {
  // Native numbers stop at 99; beyond that everyone switches to Sino-Korean.
  const native = COUNTERS[counter] === 'native' && n >= 1 && n <= 99
  return `${native ? nativeKorean(n, { counter: true }) : sinoKorean(n)} ${counter}`
}

/** Month names. 6 and 10 drop a final consonant: 유월 (not 육월), 시월 (not 십월). */
export function monthName(month: number): string {
  if (!Number.isInteger(month) || month < 1 || month > 12)
    throw new RangeError(`Invalid month: ${month}`)
  if (month === 6) return '유월'
  if (month === 10) return '시월'
  return `${sinoKorean(month)}월`
}

/** Clock time: native hours, Sino-Korean minutes. (3, 30) → "세 시 삼십 분". */
export function readTime(hour: number, minute = 0): string {
  if (hour < 1 || hour > 12)
    throw new RangeError(`Use 12-hour time (1–12): ${hour}`)
  if (minute < 0 || minute > 59)
    throw new RangeError(`Invalid minute: ${minute}`)
  return minute === 0
    ? countWith(hour, '시')
    : `${countWith(hour, '시')} ${countWith(minute, '분')}`
}

/** Full date, all Sino-Korean. (2026, 6, 15) → "이천이십육 년 유월 십오 일". */
export function readDate(year: number, month: number, day: number): string {
  if (day < 1 || day > 31) throw new RangeError(`Invalid day: ${day}`)
  return `${countWith(year, '년')} ${monthName(month)} ${countWith(day, '일')}`
}

/** Money in won, spaced by 만 as Korean writing does. 15000 → "만 오천 원". */
export function readMoney(won: number): string {
  return `${sinoKorean(won, { spaced: true })} 원`
}

/** Everyday age with 살 (native). 20 → "스무 살". */
export function readAge(age: number): string {
  return countWith(age, '살')
}
