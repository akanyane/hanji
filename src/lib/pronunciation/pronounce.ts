// Korean pronunciation engine based on the Standard Pronunciation rules
// (표준 발음법, National Institute of Korean Language).
//
// How it works:
// 1. The text is split into words (runs of Hangul syllables).
// 2. For every pair of adjacent syllables (left final + right initial) the
//    boundary rules are applied in a fixed order: liaison, ㅎ rules,
//    aspiration, final simplification/neutralization, then nasalization,
//    lateralization and tensification.
// 3. The last syllable of each word gets its final neutralized.
// 4. Vowel rules (ㅢ → ㅣ, 져/쳐 → 저/처) run last.
//
// Every change is recorded as a step (rule + before/after) so the UI can
// explain *why* the word sounds the way it does.
//
// Known limits (they depend on meaning/morphology, which spelling alone
// can't reveal): ㄴ insertion (꽃잎 [꼰닙]), tensification after the
// -(으)ㄹ ending or in Sino-Korean words (할 거야 [할 꺼야], 갈등 [갈뜽]),
// tensification after verb stems ending in plain ㄴ/ㅁ (신고 [신꼬] "wear"),
// and liaison across separate words (맛없다 [마덥따]).

import { COMPOUND_FINALS, compose, decompose, type Final } from '../hangul'

export type PronunciationRuleId =
  | 'liaison'
  | 'finalSimplification'
  | 'finalNeutralization'
  | 'nasalization'
  | 'lateralization'
  | 'tensification'
  | 'aspiration'
  | 'palatalization'
  | 'hDeletion'
  | 'uiVowel'
  | 'jyeoVowel'

export interface RuleStep {
  rule: PronunciationRuleId
  /** Index (in the input string) of the first syllable the step touches. */
  index: number
  before: string
  after: string
}

export interface PronunciationOptions {
  /** Apply tensification (경음화). Romanization turns it off. Default true. */
  tensification?: boolean
  /** Pronounce ㅢ after a consonant as ㅣ. Romanization turns it off. Default true. */
  uiVowel?: boolean
  /** Pronounce 져/쪄/쳐 as 저/쩌/처. Romanization turns it off. Default true. */
  jyeoVowel?: boolean
  /**
   * Merge ㄱ/ㄷ/ㅂ/ㅈ finals with a following ㅎ (축하 → 추카). Default true.
   * Romanization of nouns keeps the ㅎ (묵호 → Mukho), so it can turn this off.
   */
  aspirationAfterObstruent?: boolean
}

/** A syllable being transformed. Jamo are plain strings while we mutate them. */
interface Cell {
  initial: string
  medial: string
  final: string
  /** The syllable as written in the input. */
  original: string
  /** Position in the input string. */
  index: number
  /** Marks a ㄴ+ㄹ boundary that is pronounced [ㄴㄴ] by lexical exception. */
  lexicalNN?: boolean
}

export type PronouncedSegment =
  | {
      type: 'syllable'
      initial: string
      medial: string
      final: string
      original: string
    }
  | { type: 'text'; text: string }

export interface PronunciationResult {
  input: string
  /** The pronounced form written in Hangul, e.g. "궁물" for 국물. */
  pronunciation: string
  steps: RuleStep[]
  segments: PronouncedSegment[]
}

/** The 7 representative final sounds (받침의 대표음). */
const REPRESENTATIVE: Record<string, string> = {
  ㄱ: 'ㄱ',
  ㄲ: 'ㄱ',
  ㅋ: 'ㄱ',
  ㄴ: 'ㄴ',
  ㄷ: 'ㄷ',
  ㅅ: 'ㄷ',
  ㅆ: 'ㄷ',
  ㅈ: 'ㄷ',
  ㅊ: 'ㄷ',
  ㅌ: 'ㄷ',
  ㅎ: 'ㄷ',
  ㄹ: 'ㄹ',
  ㅁ: 'ㅁ',
  ㅂ: 'ㅂ',
  ㅍ: 'ㅂ',
  ㅇ: 'ㅇ',
}

/** Which consonant of a compound final is pronounced before a consonant or at the end. */
const COMPOUND_SURVIVOR: Record<string, string> = {
  ㄳ: 'ㄱ',
  ㄵ: 'ㄴ',
  ㄶ: 'ㄴ',
  ㄺ: 'ㄱ',
  ㄻ: 'ㅁ',
  ㄼ: 'ㄹ',
  ㄽ: 'ㄹ',
  ㄾ: 'ㄹ',
  ㄿ: 'ㅂ',
  ㅀ: 'ㄹ',
  ㅄ: 'ㅂ',
}

/** Nouns ending in ㄺ keep [ㄱ] even before ㄱ (닭고기 [닥꼬기]); verb stems switch to [ㄹ] (읽고 [일꼬]). */
const NOUNS_ENDING_IN_RG = new Set(['닭', '흙', '칡', '삵'])

/** Verb stems with these compound finals tense a following ㄱ/ㄷ/ㅅ/ㅈ (앉다 [안따], 넓게 [널께]). */
const STEM_TENSING_FINALS = new Set(['ㄵ', 'ㄻ', 'ㄼ', 'ㄾ'])

/** ㅎ-type finals and what remains of them once the ㅎ is gone. */
const H_FINALS: Record<string, string> = { ㅎ: '', ㄶ: 'ㄴ', ㅀ: 'ㄹ' }

const NASAL: Record<string, string> = { ㄱ: 'ㅇ', ㄷ: 'ㄴ', ㅂ: 'ㅁ' }
const TENSE: Record<string, string> = {
  ㄱ: 'ㄲ',
  ㄷ: 'ㄸ',
  ㅂ: 'ㅃ',
  ㅅ: 'ㅆ',
  ㅈ: 'ㅉ',
}
const ASPIRATED: Record<string, string> = {
  ㄱ: 'ㅋ',
  ㄲ: 'ㅋ',
  ㅋ: 'ㅋ',
  ㄷ: 'ㅌ',
  ㅅ: 'ㅌ',
  ㅆ: 'ㅌ',
  ㅌ: 'ㅌ',
  ㅈ: 'ㅊ',
  ㅊ: 'ㅊ',
  ㅂ: 'ㅍ',
  ㅍ: 'ㅍ',
}
const OBSTRUENT_FINALS = new Set(['ㄱ', 'ㄷ', 'ㅂ'])

/**
 * Words where ㄴ+ㄹ is pronounced [ㄴㄴ] instead of [ㄹㄹ]
 * (표준 발음법 제20항, 붙임). Only entries whose other syllables need no
 * extra lexical rule are listed.
 */
const LEXICAL_NN_WORDS = [
  '의견란',
  '임진란',
  '생산량',
  '동원령',
  '상견례',
  '횡단로',
  '이원론',
  '입원료',
  '구근류',
  // Place name used as an official RR example (Sinmunno): 신문 + 로 (路).
  '신문로',
]

function render(cell: Cell): string {
  return compose(cell.initial, cell.medial, cell.final) ?? cell.original
}

class Engine {
  steps: RuleStep[] = []

  constructor(private readonly options: Required<PronunciationOptions>) {}

  /** Runs `mutate` and records a step if the syllables changed. */
  private record(rule: PronunciationRuleId, cells: Cell[], mutate: () => void) {
    const before = cells.map(render).join('')
    mutate()
    const after = cells.map(render).join('')
    if (before !== after) {
      this.steps.push({ rule, index: cells[0].index, before, after })
    }
  }

  private survivor(left: Cell, right: Cell | null): string {
    if (left.final === 'ㄺ') {
      return right?.initial === 'ㄱ' && !NOUNS_ENDING_IN_RG.has(left.original)
        ? 'ㄹ'
        : 'ㄱ'
    }
    if (left.final === 'ㄼ') {
      // 밟- always keeps [ㅂ]; 넓- only in 넓죽하다/넓둥글다 (제10항 다만).
      if (left.original === '밟') return 'ㅂ'
      if (
        left.original === '넓' &&
        (right?.original === '죽' || right?.original === '둥')
      ) {
        return 'ㅂ'
      }
    }
    return COMPOUND_SURVIVOR[left.final]
  }

  /** Reduces a final to one of the 7 representative sounds. */
  neutralize(left: Cell, right: Cell | null) {
    const cells = right ? [left, right] : [left]
    if (COMPOUND_FINALS[left.final as Final]) {
      this.record('finalSimplification', cells, () => {
        left.final = this.survivor(left, right)
      })
    }
    const representative = REPRESENTATIVE[left.final]
    if (representative && representative !== left.final) {
      this.record('finalNeutralization', cells, () => {
        left.final = representative
      })
    }
  }

  boundary(left: Cell, right: Cell) {
    const original = left.final
    if (!original) return
    const pair = [left, right]
    const { tensification, aspirationAfterObstruent } = this.options

    // 1. The next syllable starts with a vowel (silent ㅇ): liaison (연음).
    if (right.initial === 'ㅇ') {
      if (original === 'ㅇ') return
      if (original in H_FINALS) {
        // 좋아 [조아], 않아 [아나], 싫어 [시러]
        this.record('hDeletion', pair, () => {
          left.final = H_FINALS[original]
        })
        if (left.final) {
          this.record('liaison', pair, () => {
            right.initial = left.final
            left.final = ''
          })
        }
        return
      }
      // In a compound final only the second consonant moves (닭이 [달기]).
      const parts = COMPOUND_FINALS[original as Final]
      const moved = parts ? parts[1] : original
      this.record('liaison', pair, () => {
        left.final = parts ? parts[0] : ''
        right.initial = moved
      })
      // A moved ㅅ from a compound final is tensed (없어 [업써], 값이 [갑씨]).
      if (parts && moved === 'ㅅ' && tensification) {
        this.record('tensification', pair, () => {
          right.initial = 'ㅆ'
        })
      }
      // ㄷ/ㅌ + 이 → 지/치 (굳이 [구지], 같이 [가치]).
      if ((moved === 'ㄷ' || moved === 'ㅌ') && right.medial === 'ㅣ') {
        this.record('palatalization', pair, () => {
          right.initial = moved === 'ㄷ' ? 'ㅈ' : 'ㅊ'
        })
      }
      return
    }

    // 2. ㅎ-type final before a consonant.
    if (original in H_FINALS) {
      const remaining = H_FINALS[original]
      if (
        right.initial === 'ㄱ' ||
        right.initial === 'ㄷ' ||
        right.initial === 'ㅈ'
      ) {
        // 좋다 [조타], 많고 [만코]
        this.record('aspiration', pair, () => {
          left.final = remaining
          right.initial = ASPIRATED[right.initial]
        })
        return
      }
      if (right.initial === 'ㅅ') {
        // 좋소 [조쏘], 싫소 [실쏘]
        this.record(tensification ? 'tensification' : 'hDeletion', pair, () => {
          left.final = remaining
          if (tensification) right.initial = 'ㅆ'
        })
        return
      }
      if (right.initial === 'ㄴ') {
        if (original === 'ㅎ') {
          // 놓는 [논는]
          this.record('nasalization', pair, () => {
            left.final = 'ㄴ'
          })
        } else {
          // 않네 [안네], 뚫는 [뚤른]
          this.record('hDeletion', pair, () => {
            left.final = remaining
          })
          if (remaining === 'ㄹ') {
            this.record('lateralization', pair, () => {
              right.initial = 'ㄹ'
            })
          }
        }
        return
      }
      if (right.initial === 'ㅎ') {
        this.record('hDeletion', pair, () => {
          left.final = remaining
        })
        return
      }
      // Any other consonant: handled as a normal final below.
    }

    // 3. The next syllable starts with ㅎ: aspiration (격음화).
    if (right.initial === 'ㅎ') {
      if (!aspirationAfterObstruent) {
        this.neutralize(left, right)
        return
      }
      const parts = COMPOUND_FINALS[original as Final]
      let kept = ''
      let source = original
      if (parts && parts[1] !== 'ㅅ' && ASPIRATED[parts[1]]) {
        // 밝히다 [발키다], 넓히다 [널피다], 앉히다 [안치다]
        kept = parts[0]
        source = parts[1]
      } else if (parts) {
        source = COMPOUND_SURVIVOR[original]
      }
      if (ASPIRATED[source]) {
        // 축하 [추카], 입학 [이팍], 따뜻하다 [따뜨타다]
        this.record('aspiration', pair, () => {
          left.final = kept
          right.initial = ASPIRATED[source]
        })
        // ㄷ + 히 → 치 (굳히다 [구치다]).
        if ((source === 'ㄷ' || source === 'ㅌ') && right.medial === 'ㅣ') {
          this.record('palatalization', pair, () => {
            right.initial = 'ㅊ'
          })
        }
      } else if (parts) {
        this.neutralize(left, right)
      }
      return
    }

    // 4. Consonant meets consonant.
    this.neutralize(left, right)
    const final = left.final
    const stemTensing =
      STEM_TENSING_FINALS.has(original) || (original === 'ㄺ' && final === 'ㄹ')

    if (right.initial === 'ㄹ') {
      if (final === 'ㄴ') {
        if (left.lexicalNN) {
          // 생산량 [생산냥]
          this.record('nasalization', pair, () => {
            right.initial = 'ㄴ'
          })
        } else {
          // 신라 [실라]
          this.record('lateralization', pair, () => {
            left.final = 'ㄹ'
          })
        }
      } else if (final === 'ㅁ' || final === 'ㅇ') {
        // 침략 [침냑], 종로 [종노]
        this.record('nasalization', pair, () => {
          right.initial = 'ㄴ'
        })
      } else if (OBSTRUENT_FINALS.has(final)) {
        // 국립 [궁닙], 협력 [혐녁]
        this.record('nasalization', pair, () => {
          right.initial = 'ㄴ'
          left.final = NASAL[final]
        })
      }
      return
    }

    if (right.initial === 'ㄴ' || right.initial === 'ㅁ') {
      if (OBSTRUENT_FINALS.has(final)) {
        // 국물 [궁물], 있는 [인는], 입니다 [임니다]
        this.record('nasalization', pair, () => {
          left.final = NASAL[final]
        })
      } else if (final === 'ㄹ' && right.initial === 'ㄴ') {
        // 설날 [설랄]
        this.record('lateralization', pair, () => {
          right.initial = 'ㄹ'
        })
      }
      return
    }

    if (tensification && right.initial in TENSE) {
      // 학교 [학꾜], 앉다 [안따]
      if (
        OBSTRUENT_FINALS.has(final) ||
        (stemTensing && right.initial !== 'ㅂ')
      ) {
        this.record('tensification', pair, () => {
          right.initial = TENSE[right.initial]
        })
      }
    }
  }

  vowels(cell: Cell) {
    if (this.options.uiVowel && cell.medial === 'ㅢ' && cell.initial !== 'ㅇ') {
      // 희망 [히망], 무늬 [무니]
      this.record('uiVowel', [cell], () => {
        cell.medial = 'ㅣ'
      })
    }
    if (
      this.options.jyeoVowel &&
      cell.medial === 'ㅕ' &&
      (cell.initial === 'ㅈ' || cell.initial === 'ㅉ' || cell.initial === 'ㅊ')
    ) {
      // 가져 [가저], 다쳐 [다처]
      this.record('jyeoVowel', [cell], () => {
        cell.medial = 'ㅓ'
      })
    }
  }
}

/** Flags ㄴ+ㄹ boundaries inside words from the lexical exception list. */
function markLexicalExceptions(word: Cell[]) {
  const text = word.map((c) => c.original).join('')
  for (const exception of LEXICAL_NN_WORDS) {
    let start = text.indexOf(exception)
    while (start >= 0) {
      for (let i = start; i < start + exception.length - 1; i++) {
        if (word[i].final === 'ㄴ' && word[i + 1].initial === 'ㄹ') {
          word[i].lexicalNN = true
        }
      }
      start = text.indexOf(exception, start + 1)
    }
  }
}

/** Applies the standard pronunciation rules to Korean text. */
export function pronounce(
  input: string,
  options: PronunciationOptions = {},
): PronunciationResult {
  const engine = new Engine({
    tensification: true,
    uiVowel: true,
    jyeoVowel: true,
    aspirationAfterObstruent: true,
    ...options,
  })

  const chars = [...input]
  const items: Array<Cell | string> = []
  let index = 0
  for (const char of chars) {
    const syllable = decompose(char)
    items.push(syllable ? { ...syllable, original: char, index } : char)
    index += char.length
  }

  // Process each word (run of consecutive syllables) independently.
  let word: Cell[] = []
  const flush = () => {
    if (word.length === 0) return
    markLexicalExceptions(word)
    for (let i = 0; i < word.length - 1; i++)
      engine.boundary(word[i], word[i + 1])
    engine.neutralize(word[word.length - 1], null)
    for (const cell of word) engine.vowels(cell)
    word = []
  }
  for (const item of items) {
    if (typeof item === 'string') flush()
    else word.push(item)
  }
  flush()

  const segments: PronouncedSegment[] = items.map((item) =>
    typeof item === 'string'
      ? { type: 'text', text: item }
      : {
          type: 'syllable',
          initial: item.initial,
          medial: item.medial,
          final: item.final,
          original: item.original,
        },
  )

  return {
    input,
    pronunciation: items
      .map((item) => (typeof item === 'string' ? item : render(item)))
      .join(''),
    steps: engine.steps,
    segments,
  }
}
