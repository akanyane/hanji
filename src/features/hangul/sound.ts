import type { HangulEntry } from '../../content/hangul'
import { compose } from '../../lib/hangul'

/**
 * What to feed the speech synthesizer for an entry. A lone jamo is read by
 * its *name* (ㄱ → "기역"), so we speak a syllable that shows its sound:
 * consonant + ㅏ (가), silent ㅇ + vowel (아), ㅏ + final (악).
 */
export function entrySound(entry: HangulEntry): string {
  switch (entry.category) {
    case 'consonant':
      return compose(entry.hangul, 'ㅏ') ?? entry.hangul
    case 'vowel':
      return compose('ㅇ', entry.hangul) ?? entry.hangul
    case 'final':
      return compose('ㅇ', 'ㅏ', entry.hangul) ?? entry.hangul
    case 'syllable':
      return entry.hangul
  }
}

/**
 * Groups letters that sound the same in modern Seoul Korean, so the
 * "listen and choose" quiz never asks the learner to tell them apart:
 * ㅐ = ㅔ, ㅒ = ㅖ, and ㅙ = ㅚ = ㅞ.
 */
const SAME_SOUND: Record<string, string> = {
  ae: 'e',
  yae: 'ye',
  wae: 'we',
  oe: 'we',
}

export function soundKey(entry: HangulEntry): string {
  return `${entry.category}:${SAME_SOUND[entry.romanization] ?? entry.romanization}:${entry.category === 'consonant' ? entry.hangul : ''}`
}
