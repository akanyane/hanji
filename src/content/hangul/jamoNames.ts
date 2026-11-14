import { compose, splitCompound } from '../../lib/hangul'

/** Traditional Korean names of the consonants. */
export const CONSONANT_NAMES: Record<string, string> = {
  ㄱ: '기역',
  ㄲ: '쌍기역',
  ㄴ: '니은',
  ㄷ: '디귿',
  ㄸ: '쌍디귿',
  ㄹ: '리을',
  ㅁ: '미음',
  ㅂ: '비읍',
  ㅃ: '쌍비읍',
  ㅅ: '시옷',
  ㅆ: '쌍시옷',
  ㅇ: '이응',
  ㅈ: '지읒',
  ㅉ: '쌍지읒',
  ㅊ: '치읓',
  ㅋ: '키읔',
  ㅌ: '티읕',
  ㅍ: '피읖',
  ㅎ: '히읗',
}

/**
 * Name of a jamo as Koreans say it. A vowel is named by its sound written
 * with the silent ㅇ (ㅏ → 아). Compound finals have no name of their own, so
 * they are described by their parts (ㄺ → 리을 + 기역).
 */
export function jamoName(jamo: string): string | undefined {
  if (CONSONANT_NAMES[jamo]) return CONSONANT_NAMES[jamo]
  const vowelName = compose('ㅇ', jamo)
  if (vowelName) return vowelName
  const parts = splitCompound(jamo)
  if (parts.length === 2 && parts.every((p) => CONSONANT_NAMES[p])) {
    return parts.map((p) => CONSONANT_NAMES[p]).join(' + ')
  }
  return undefined
}
