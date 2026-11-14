// Korean verb and adjective conjugation engine.
//
// Every ending attaches to the stem (dictionary form minus 다) in one of
// three ways, and each irregular class changes the stem differently for each:
//
// 1. Consonant endings (-고, -지만, -습니다, -는): attach as-is.
//    Only ㄹ stems change (ㄹ drops before ㄴ/ㅂ/ㅅ: 살다 → 사는).
// 2. 으 endings (-(으)면, -(으)세요, -(으)ㄹ 거예요, -(으)ㄴ): 으 is inserted
//    after a consonant: 먹으면 / 가면.
// 3. 아/어 endings (-아요/어요, -았/었-, -아서/어서): the vowel follows the
//    stem's last vowel (ㅏ/ㅑ/ㅗ → 아, otherwise 어) and contracts with
//    vowel stems: 가+아 → 가, 오+아 → 와, 마시+어 → 마셔.
//
// Irregulars, and what they do before vowel endings (2 and 3):
//   ㅂ  ㅂ → 우/오:          덥다 → 더워요, 더우면    (돕다/곱다 → 도와요)
//   ㄷ  ㄷ → ㄹ:             듣다 → 들어요, 들으면
//   ㅅ  ㅅ drops, no merge:  낫다 → 나아요, 나으면
//   ㅎ  ㅎ drops (adjectives): 파랗다 → 파래요, 파라면, 파란
//   르  르 → ㄹ라/ㄹ러:       모르다 → 몰라요 (only before 아/어)
//   러  adds 러:             푸르다 → 푸르러요
//   ㄹ  ㄹ drops before ㄴ/ㅂ/ㅅ, never takes 으: 살다 → 사세요, 살면, 산
//   으  ㅡ drops before 아/어: 바쁘다 → 바빠요, 쓰다 → 써요
//   하  하 + 아/어 → 해:       하다 → 해요, 했어요

import {
  compose,
  decompose,
  isConsonant,
  isSyllable,
  type Syllable,
} from '../hangul'

export type VerbKind = 'verb' | 'adjective'

export type IrregularType =
  | 'regular'
  | 'b'
  | 'd'
  | 's'
  | 'h'
  | 'reu'
  | 'reo'
  | 'l'
  | 'eu'
  | 'ha'

export interface VerbInfo {
  dictionary: string
  stem: string
  kind: VerbKind
  irregular: IrregularType
}

// --- Irregular lookup tables ---------------------------------------------------

/** ㅂ-final stems that are regular (most ㅂ stems are irregular). */
const B_REGULAR = new Set(['입', '잡', '좁', '씹', '접', '뽑', '업', '집'])
/** ㅂ irregulars that become 와 instead of 워. */
const B_WA = new Set(['돕', '곱'])
/** ㄷ irregulars (most ㄷ stems are regular: 받다, 닫다, 믿다). */
const D_IRREGULAR = new Set(['듣', '걷', '묻', '싣', '깨닫', '붇', '일컫'])
/** ㅅ irregulars (most ㅅ stems are regular: 웃다, 씻다, 벗다). */
const S_IRREGULAR = new Set(['낫', '짓', '붓', '긋', '잇', '젓'])
/** 르 stems that follow the 으 rule instead of 르 (따르다 → 따라요). */
const REU_AS_EU = new Set(['따르', '치르', '들르', '우러르'])
/** 러 irregulars (푸르다 → 푸르러요). */
const REO_IRREGULAR = new Set(['푸르'])
/** Stems whose irregularity depends on the meaning. The default is the more common one. */
const AMBIGUOUS = new Set(['걷', '묻', '이르', '누르'])

/**
 * Common adjectives, to tell adjectives from verbs when the caller doesn't
 * say. It matters for -는 vs -(으)ㄴ, the progressive, and ㅎ stems.
 */
const ADJECTIVES = new Set([
  '좋다',
  '나쁘다',
  '크다',
  '작다',
  '많다',
  '적다',
  '길다',
  '짧다',
  '높다',
  '낮다',
  '넓다',
  '좁다',
  '덥다',
  '춥다',
  '맵다',
  '쉽다',
  '어렵다',
  '가깝다',
  '멀다',
  '무겁다',
  '가볍다',
  '귀엽다',
  '아름답다',
  '반갑다',
  '고맙다',
  '즐겁다',
  '곱다',
  '빨갛다',
  '파랗다',
  '노랗다',
  '하얗다',
  '까맣다',
  '그렇다',
  '이렇다',
  '저렇다',
  '어떻다',
  '예쁘다',
  '바쁘다',
  '아프다',
  '기쁘다',
  '슬프다',
  '배고프다',
  '빠르다',
  '느리다',
  '다르다',
  '같다',
  '싸다',
  '비싸다',
  '맛있다',
  '맛없다',
  '재미있다',
  '재미없다',
  '있다',
  '없다',
  '행복하다',
  '피곤하다',
  '깨끗하다',
  '따뜻하다',
  '시원하다',
  '조용하다',
  '편하다',
  '똑똑하다',
  '친절하다',
  '중요하다',
  '필요하다',
  '괜찮다',
  '젊다',
  '늙다',
  '맑다',
  '푸르다',
  '이르다',
])

/** Verbs with a dedicated honorific form instead of -(으)시-. */
const SPECIAL_HONORIFIC: Record<string, string> = {
  먹다: '드시다',
  마시다: '드시다',
  자다: '주무시다',
  있다: '계시다',
  죽다: '돌아가시다',
}

/** Words whose negative is a different word (있다 → 없다), not 안 + word. */
const NEGATIVE_COUNTERPART: Record<string, string> = {
  있다: '없다',
  알다: '모르다',
  맛있다: '맛없다',
  재미있다: '재미없다',
}

// --- Syllable helpers ------------------------------------------------------------

const lastChar = (s: string) => s[s.length - 1]
const withoutLast = (s: string) => s.slice(0, -1)

function lastSyllable(s: string): Syllable {
  const syllable = decompose(lastChar(s))
  if (!syllable) throw new Error(`Not a Hangul syllable: ${s}`)
  return syllable
}

/** Replaces the final consonant of the last syllable. */
function setFinal(s: string, final: string): string {
  const { initial, medial } = lastSyllable(s)
  return withoutLast(s) + (compose(initial, medial, final) ?? '')
}

/** Removes the final consonant of the last syllable. */
const dropFinal = (s: string) => setFinal(s, '')

/** Joins a vowel-final base and an ending; a leading jamo (ㄴ, ㄹ, ㅂ) becomes the final. */
function joinVowel(base: string, ending: string): string {
  const first = ending[0]
  if (first && !isSyllable(first) && isConsonant(first))
    return setFinal(base, first) + ending.slice(1)
  return base + ending
}

/** Initial consonant of an ending (its first jamo). */
function endingInitial(ending: string): string {
  const first = ending[0]
  return decompose(first)?.initial ?? first
}

/** Vowel harmony: 아 after ㅏ/ㅑ/ㅗ, 어 otherwise. */
const harmony = (s: Syllable) =>
  ['ㅏ', 'ㅑ', 'ㅗ'].includes(s.medial) ? 'ㅏ' : 'ㅓ'

// --- Analysis --------------------------------------------------------------------

export function guessKind(dictionary: string): VerbKind {
  return ADJECTIVES.has(dictionary) ? 'adjective' : 'verb'
}

function detectIrregular(stem: string, kind: VerbKind): IrregularType {
  const last = lastSyllable(stem)
  if (lastChar(stem) === '하') return 'ha'
  switch (last.final) {
    case 'ㄹ':
      return 'l'
    case 'ㅂ':
      return [...B_REGULAR].some((r) => stem.endsWith(r)) ? 'regular' : 'b'
    case 'ㄷ':
      return D_IRREGULAR.has(stem) || stem.endsWith('듣') ? 'd' : 'regular'
    case 'ㅅ':
      return S_IRREGULAR.has(stem) || stem.endsWith('짓') ? 's' : 'regular'
    case 'ㅎ':
      // ㅎ adjectives are irregular, except 좋다; ㅎ verbs (놓다, 넣다) are regular.
      return kind === 'adjective' && stem !== '좋' && !stem.endsWith('괜찮')
        ? 'h'
        : 'regular'
    case '':
      if (last.medial !== 'ㅡ') return 'regular'
      if (lastChar(stem) === '르' && stem.length > 1) {
        if (REO_IRREGULAR.has(stem)) return 'reo'
        return REU_AS_EU.has(stem) ? 'eu' : 'reu'
      }
      return 'eu'
    default:
      return 'regular'
  }
}

/** Reads a dictionary form (…다). Returns null when it isn't one. */
export function analyzeVerb(
  dictionary: string,
  options: { kind?: VerbKind; irregular?: IrregularType } = {},
): VerbInfo | null {
  const word = dictionary.trim()
  if (word.length < 2 || !word.endsWith('다') || ![...word].every(isSyllable))
    return null
  const stem = withoutLast(word)
  const kind = options.kind ?? guessKind(word)
  return {
    dictionary: word,
    stem,
    kind,
    irregular: options.irregular ?? detectIrregular(stem, kind),
  }
}

// --- The three attachment types ---------------------------------------------------

/** 1. Consonant-initial endings (-고, -지만, -네요, -는). */
function attachConsonant(info: VerbInfo, ending: string): string {
  if (
    info.irregular === 'l' &&
    ['ㄴ', 'ㅂ', 'ㅅ'].includes(endingInitial(ending))
  ) {
    return joinVowel(dropFinal(info.stem), ending)
  }
  return info.stem + ending
}

/** 2. 으-endings, given in their after-vowel form: '면', '세요', 'ㄹ 거예요', 'ㄴ'. */
function attachEu(info: VerbInfo, ending: string): string {
  const { stem, irregular } = info
  const last = lastSyllable(stem)
  const open = withoutLast(stem) + (compose(last.initial, last.medial) ?? '')
  switch (irregular) {
    case 'b':
      return joinVowel(`${open}우`, ending)
    case 'd':
      return joinVowel(`${setFinal(stem, 'ㄹ')}으`, ending)
    case 's':
      return joinVowel(`${open}으`, ending)
    case 'h':
      return joinVowel(open, ending)
    case 'l': {
      if (ending[0] === 'ㄹ') return stem + ending.slice(1) // 살 + ㄹ 거예요 → 살 거예요
      if (['ㄴ', 'ㅂ', 'ㅅ'].includes(endingInitial(ending)))
        return joinVowel(open, ending) // 사세요, 산
      return stem + ending // 살면
    }
    default:
      return last.final
        ? joinVowel(`${stem}으`, ending)
        : joinVowel(stem, ending)
  }
}

/** 3. The 아/어 form (해체 present), which all 아/어 endings build on. */
function aeoForm(info: VerbInfo): string {
  const { stem, irregular } = info
  const last = lastSyllable(stem)
  const head = withoutLast(stem)
  const vowel = (v: string) => compose('ㅇ', v) ?? ''
  switch (irregular) {
    case 'ha':
      return `${head}해`
    case 'reu': {
      // 모르 → 몰라: the previous syllable takes ㄹ; 르 becomes 라/러.
      const prev = lastSyllable(head)
      return `${setFinal(head, 'ㄹ')}${compose('ㄹ', harmony(prev))}`
    }
    case 'reo':
      return `${stem}러`
    case 'eu': {
      // ㅡ drops; the new vowel follows the syllable before (one syllable → 어).
      const v = head ? harmony(lastSyllable(head)) : 'ㅓ'
      return head + (compose(last.initial, v) ?? '')
    }
    case 'b':
      return `${head}${compose(last.initial, last.medial)}${B_WA.has(stem) ? '와' : '워'}`
    case 'd':
      return setFinal(stem, 'ㄹ') + vowel(harmony(last))
    case 's':
      return `${head}${compose(last.initial, last.medial)}${vowel(harmony(last))}`
    case 'h': {
      const merged: Record<string, string> = {
        ㅏ: 'ㅐ',
        ㅓ: 'ㅐ',
        ㅑ: 'ㅒ',
        ㅕ: 'ㅒ',
      }
      return head + (compose(last.initial, merged[last.medial] ?? 'ㅐ') ?? '')
    }
    default: {
      if (last.final) return stem + vowel(harmony(last))
      // Vowel stems contract with 아/어.
      const contracted: Record<string, string> = {
        ㅏ: 'ㅏ',
        ㅓ: 'ㅓ',
        ㅕ: 'ㅕ',
        ㅐ: 'ㅐ',
        ㅔ: 'ㅔ',
        ㅗ: 'ㅘ',
        ㅜ: 'ㅝ',
        ㅣ: 'ㅕ',
        ㅚ: 'ㅙ',
      }
      const v = contracted[last.medial]
      return v ? head + (compose(last.initial, v) ?? '') : `${stem}어`
    }
  }
}

function formalPresent(info: VerbInfo): string {
  const last = lastSyllable(info.stem)
  if (info.irregular === 'l') return joinVowel(dropFinal(info.stem), 'ㅂ니다') // 삽니다
  return last.final ? `${info.stem}습니다` : joinVowel(info.stem, 'ㅂ니다')
}

// --- Public API --------------------------------------------------------------------

export const FORM_IDS = [
  'present.formal',
  'present.polite',
  'present.casual',
  'past.formal',
  'past.polite',
  'past.casual',
  'future.formal',
  'future.polite',
  'future.casual',
  'progressive.formal',
  'progressive.polite',
  'progressive.casual',
  'negShort.present',
  'negShort.past',
  'negLong.present',
  'negLong.past',
  'negLong.formal',
  'honorific.present',
  'honorific.formal',
  'honorific.past',
  'honorific.future',
  'connective.and',
  'connective.but',
  'connective.so',
  'connective.if',
  'connective.because',
  'modifier.present',
  'modifier.past',
  'modifier.future',
  'want',
] as const

export type FormId = (typeof FORM_IDS)[number]

export type ConjugationNote =
  /** Adjectives have no progressive, -고 싶다 or past modifier. */
  | 'verbOnlyForms'
  /** The honorific is a different verb (먹다 → 드시다). */
  | 'specialHonorific'
  /** The negative is a different word (있다 → 없다). */
  | 'negativeCounterpart'
  /** The irregularity depends on the meaning (걷다 "walk" vs "roll up"). */
  | 'ambiguousIrregular'

export interface ConjugationResult {
  info: VerbInfo
  forms: Partial<Record<FormId, string>>
  notes: ConjugationNote[]
  /** Dictionary form used for the honorific (드시다 for 먹다). */
  honorificVerb: string
  /** Word used for the short negative when it isn't 안 + word (없다 for 있다). */
  negativeVerb?: string
}

/** True for "noun + 하다" verbs, which put 안 before 하다: 공부 안 해요. */
function isNounHada(info: VerbInfo): boolean {
  const { dictionary } = info
  if (
    info.kind !== 'verb' ||
    !dictionary.endsWith('하다') ||
    dictionary.length < 3
  )
    return false
  // 좋아하다, 싫어하다 are -아/어하다 verbs: 안 좋아해요.
  const before = dictionary[dictionary.length - 3]
  return !['아', '어', '여'].includes(before)
}

function pastBase(info: VerbInfo): string {
  return setFinal(aeoForm(info), 'ㅆ')
}

/** Conjugates a verb or adjective in dictionary form. Null when the input isn't one. */
export function conjugate(
  dictionary: string,
  options: { kind?: VerbKind; irregular?: IrregularType } = {},
): ConjugationResult | null {
  const info = analyzeVerb(dictionary, options)
  if (!info) return null
  const { stem, kind } = info
  const isVerb = kind === 'verb'
  // 있다/없다 (and 재미있다, 맛없다…) behave like verbs for -는.
  const takesNeun = isVerb || /[있없]다$/.test(info.dictionary)
  const notes: ConjugationNote[] = []
  const aeo = aeoForm(info)
  const past = pastBase(info)

  const forms: Partial<Record<FormId, string>> = {
    'present.formal': formalPresent(info),
    'present.polite': `${aeo}요`,
    'present.casual': aeo,
    'past.formal': `${past}습니다`,
    'past.polite': `${past}어요`,
    'past.casual': `${past}어`,
    'future.formal': attachEu(info, 'ㄹ 겁니다'),
    'future.polite': attachEu(info, 'ㄹ 거예요'),
    'future.casual': attachEu(info, 'ㄹ 거야'),
    'negLong.present': `${stem}지 않아요`,
    'negLong.past': `${stem}지 않았어요`,
    'negLong.formal': `${stem}지 않습니다`,
    'connective.and': attachConsonant(info, '고'),
    'connective.but': attachConsonant(info, '지만'),
    'connective.so': `${aeo}서`,
    'connective.if': attachEu(info, '면'),
    'connective.because': attachEu(info, '니까'),
    'modifier.present': takesNeun
      ? attachConsonant(info, '는')
      : attachEu(info, 'ㄴ'),
    'modifier.future': attachEu(info, 'ㄹ'),
  }

  if (isVerb) {
    forms['progressive.formal'] = `${stem}고 있습니다`
    forms['progressive.polite'] = `${stem}고 있어요`
    forms['progressive.casual'] = `${stem}고 있어`
    forms['modifier.past'] = attachEu(info, 'ㄴ')
    forms.want = `${stem}고 싶어요`
  } else {
    notes.push('verbOnlyForms')
  }

  // Short negation: 안 + verb, "noun 안 하다", or a different word.
  const counterpart = NEGATIVE_COUNTERPART[info.dictionary]
  if (counterpart) {
    const neg = conjugate(counterpart, { kind })
    forms['negShort.present'] = neg?.forms['present.polite']
    forms['negShort.past'] = neg?.forms['past.polite']
    notes.push('negativeCounterpart')
  } else if (isNounHada(info)) {
    const noun = info.dictionary.slice(0, -2)
    forms['negShort.present'] = `${noun} 안 해요`
    forms['negShort.past'] = `${noun} 안 했어요`
  } else {
    forms['negShort.present'] = `안 ${forms['present.polite']}`
    forms['negShort.past'] = `안 ${forms['past.polite']}`
  }

  // Honorific -(으)시-, or a dedicated verb. The result is a regular 시 stem.
  const special = SPECIAL_HONORIFIC[info.dictionary]
  if (special) notes.push('specialHonorific')
  const honStem = special ? withoutLast(special) : attachEu(info, '시')
  const honInfo: VerbInfo = {
    dictionary: `${honStem}다`,
    stem: honStem,
    kind,
    irregular: 'regular',
  }
  forms['honorific.present'] = `${withoutLast(honStem)}세요`
  forms['honorific.formal'] = formalPresent(honInfo)
  forms['honorific.past'] = `${pastBase(honInfo)}어요`
  forms['honorific.future'] = attachEu(honInfo, 'ㄹ 거예요')

  if (!options.irregular && AMBIGUOUS.has(stem))
    notes.push('ambiguousIrregular')

  return {
    info,
    forms,
    notes,
    honorificVerb: special ?? `${honStem}다`,
    negativeVerb: counterpart,
  }
}
