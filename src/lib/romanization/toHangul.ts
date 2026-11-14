// Best-effort conversion from Revised Romanization back to Hangul.
//
// The reverse direction is inherently ambiguous: RR writes pronunciation, so
// "silla" can only become 실라 (not 신라), and "jungang" could be 준강 or
// 중앙. We pick the most likely split (the longest possible onset for the
// next syllable) and let the user force a boundary with "-" or "'"
// (e.g. "jung-ang" → 중앙), exactly as RR itself does.

import { compose } from '../hangul'

const VOWELS: Record<string, string> = {
  a: 'ㅏ',
  ae: 'ㅐ',
  ya: 'ㅑ',
  yae: 'ㅒ',
  eo: 'ㅓ',
  e: 'ㅔ',
  yeo: 'ㅕ',
  ye: 'ㅖ',
  o: 'ㅗ',
  wa: 'ㅘ',
  wae: 'ㅙ',
  oe: 'ㅚ',
  yo: 'ㅛ',
  u: 'ㅜ',
  wo: 'ㅝ',
  we: 'ㅞ',
  wi: 'ㅟ',
  yu: 'ㅠ',
  eu: 'ㅡ',
  ui: 'ㅢ',
  i: 'ㅣ',
}
/** Longest first, so "yeo" wins over "ye" and "eo" over "e". */
const VOWEL_KEYS = Object.keys(VOWELS).sort((a, b) => b.length - a.length)

const ONSETS: Record<string, string> = {
  g: 'ㄱ',
  kk: 'ㄲ',
  n: 'ㄴ',
  d: 'ㄷ',
  tt: 'ㄸ',
  r: 'ㄹ',
  m: 'ㅁ',
  b: 'ㅂ',
  pp: 'ㅃ',
  s: 'ㅅ',
  ss: 'ㅆ',
  j: 'ㅈ',
  jj: 'ㅉ',
  ch: 'ㅊ',
  k: 'ㅋ',
  t: 'ㅌ',
  p: 'ㅍ',
  h: 'ㅎ',
}

const CODAS: Record<string, string> = {
  k: 'ㄱ',
  n: 'ㄴ',
  t: 'ㄷ',
  l: 'ㄹ',
  m: 'ㅁ',
  p: 'ㅂ',
  ng: 'ㅇ',
}

type Token = { vowel: string } | { consonants: string }

function tokenize(word: string): Token[] | null {
  const tokens: Token[] = []
  let i = 0
  while (i < word.length) {
    const vowel = VOWEL_KEYS.find((v) => word.startsWith(v, i))
    if (vowel) {
      tokens.push({ vowel })
      i += vowel.length
      continue
    }
    if (!/[bcdghjklmnprst]/.test(word[i])) return null
    const last = tokens[tokens.length - 1]
    if (last && 'consonants' in last) last.consonants += word[i]
    else tokens.push({ consonants: word[i] })
    i++
  }
  return tokens
}

/** Splits consonants between two vowels into coda + onset, preferring the longest onset. */
function splitCluster(cluster: string): [coda: string, onset: string] | null {
  for (
    let onsetLength = Math.min(cluster.length, 2);
    onsetLength >= 0;
    onsetLength--
  ) {
    const coda = cluster.slice(0, cluster.length - onsetLength)
    const onset = cluster.slice(cluster.length - onsetLength)
    const codaOk = coda === '' || coda in CODAS
    // "l" is only an onset in "ll" (ㄹㄹ), e.g. silla → 실라.
    const onsetOk =
      onset === '' || onset in ONSETS || (onset === 'l' && coda === 'l')
    if (codaOk && onsetOk) return [coda, onset]
  }
  return null
}

function onsetJamo(onset: string): string {
  if (onset === '') return 'ㅇ'
  return onset === 'l' ? 'ㄹ' : ONSETS[onset]
}

/** Converts one hyphen-free romanized chunk; null when it isn't valid RR. */
function convertChunk(chunk: string): string | null {
  const tokens = tokenize(chunk)
  if (!tokens?.some((t) => 'vowel' in t)) return null

  let i = 0
  let onset = ''
  const first = tokens[0]
  if ('consonants' in first) {
    // A word may start with "l" in loanwords; treat it as ㄹ.
    if (!(first.consonants in ONSETS) && first.consonants !== 'l') return null
    onset = first.consonants
    i = 1
  }

  let result = ''
  while (i < tokens.length) {
    const token = tokens[i]
    if (!('vowel' in token)) return null
    const next = tokens[i + 1]
    let coda = ''
    let nextOnset = ''
    if (next && 'consonants' in next) {
      if (i + 2 < tokens.length) {
        const split = splitCluster(next.consonants)
        if (!split) return null
        ;[coda, nextOnset] = split
      } else {
        if (!(next.consonants in CODAS)) return null
        coda = next.consonants
      }
      i += 2
    } else {
      i += 1
    }
    const syllable = compose(
      onsetJamo(onset),
      VOWELS[token.vowel],
      coda ? CODAS[coda] : '',
    )
    if (!syllable) return null
    result += syllable
    onset = nextOnset
  }
  return result
}

export interface ToHangulResult {
  hangul: string
  /** Words that could not be parsed as Revised Romanization (kept as typed). */
  unrecognized: string[]
}

/** Converts Revised Romanization to Hangul (spelled as pronounced). */
export function romanizationToHangul(text: string): ToHangulResult {
  const unrecognized: string[] = []
  const hangul = text.replace(/[a-z]+(?:[-'][a-z]+)*/gi, (word) => {
    const chunks = word.toLowerCase().split(/[-']/).map(convertChunk)
    if (chunks.some((c) => c === null)) {
      unrecognized.push(word)
      return word
    }
    return chunks.join('')
  })
  return { hangul, unrecognized }
}
