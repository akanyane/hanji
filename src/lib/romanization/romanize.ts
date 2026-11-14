// Revised Romanization of Korean (국어의 로마자 표기법, 2000).
//
// RR transcribes *pronunciation*, not spelling: 신라 is "Silla" and 종로 is
// "Jongno". So we first run the pronunciation engine, with the sound changes
// RR does not reflect turned off:
// - tensification is never written (압구정 → Apgujeong);
// - ㅢ is always "ui" (광희문 → Gwanghuimun);
// - in nouns, ㄱ/ㄷ/ㅂ + ㅎ keep the h (묵호 → Mukho). We can't detect nouns
//   from spelling, so this is an option (`keepHAfterObstruent`).
//
// Output is lowercase; capitalizing proper nouns is left to the caller.

import { pronounce } from '../pronunciation/pronounce'

const INITIAL_RR: Record<string, string> = {
  ㄱ: 'g',
  ㄲ: 'kk',
  ㄴ: 'n',
  ㄷ: 'd',
  ㄸ: 'tt',
  ㄹ: 'r',
  ㅁ: 'm',
  ㅂ: 'b',
  ㅃ: 'pp',
  ㅅ: 's',
  ㅆ: 'ss',
  ㅇ: '',
  ㅈ: 'j',
  ㅉ: 'jj',
  ㅊ: 'ch',
  ㅋ: 'k',
  ㅌ: 't',
  ㅍ: 'p',
  ㅎ: 'h',
}

const MEDIAL_RR: Record<string, string> = {
  ㅏ: 'a',
  ㅐ: 'ae',
  ㅑ: 'ya',
  ㅒ: 'yae',
  ㅓ: 'eo',
  ㅔ: 'e',
  ㅕ: 'yeo',
  ㅖ: 'ye',
  ㅗ: 'o',
  ㅘ: 'wa',
  ㅙ: 'wae',
  ㅚ: 'oe',
  ㅛ: 'yo',
  ㅜ: 'u',
  ㅝ: 'wo',
  ㅞ: 'we',
  ㅟ: 'wi',
  ㅠ: 'yu',
  ㅡ: 'eu',
  ㅢ: 'ui',
  ㅣ: 'i',
}

/** After the pronunciation engine only the 7 representative finals remain. */
const FINAL_RR: Record<string, string> = {
  ㄱ: 'k',
  ㄴ: 'n',
  ㄷ: 't',
  ㄹ: 'l',
  ㅁ: 'm',
  ㅂ: 'p',
  ㅇ: 'ng',
}

export interface RomanizeOptions {
  /** Keep the h after ㄱ/ㄷ/ㅂ, as RR requires for nouns (묵호 → mukho). */
  keepHAfterObstruent?: boolean
}

/** Converts Hangul text to Revised Romanization. Other characters pass through. */
export function romanize(
  text: string,
  { keepHAfterObstruent = false }: RomanizeOptions = {},
): string {
  const { segments } = pronounce(text, {
    tensification: false,
    uiVowel: false,
    jyeoVowel: false,
    aspirationAfterObstruent: !keepHAfterObstruent,
  })

  let result = ''
  let previousFinal = ''
  for (const segment of segments) {
    if (segment.type === 'text') {
      result += segment.text
      previousFinal = ''
      continue
    }
    // ㄹㄹ is written "ll", so an initial ㄹ after a final ㄹ is "l".
    const initial =
      segment.initial === 'ㄹ' && previousFinal === 'ㄹ'
        ? 'l'
        : INITIAL_RR[segment.initial]
    result +=
      initial + MEDIAL_RR[segment.medial] + (FINAL_RR[segment.final] ?? '')
    previousFinal = segment.final
  }
  return result
}
