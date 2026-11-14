import { describe, expect, it } from 'vitest'
import { type PronunciationRuleId, pronounce } from './pronounce'

// Expected pronunciations follow 표준 발음법 and the standard dictionary
// (표준국어대사전). Vowel length marks are omitted.
const CASES: Array<[word: string, pronunciation: string]> = [
  // Liaison (연음)
  ['한국어', '한구거'],
  ['있어요', '이써요'],
  ['밖에', '바께'],
  ['닭이', '달기'],
  ['앉아', '안자'],
  ['젊어', '절머'],
  ['읊어', '을퍼'],
  ['없어', '업써'],
  ['값이', '갑씨'],
  ['몫이', '목씨'],
  // ㅎ deletion
  ['좋아', '조아'],
  ['많아', '마나'],
  ['싫어', '시러'],
  // Final neutralization and simplification (7 representative sounds)
  ['꽃', '꼳'],
  ['닭', '닥'],
  ['흙', '흑'],
  ['값', '갑'],
  ['넋', '넉'],
  ['삶', '삼'],
  ['여덟', '여덜'],
  // Nasalization (비음화)
  ['국물', '궁물'],
  ['있는', '인는'],
  ['입니다', '임니다'],
  ['감사합니다', '감사함니다'],
  ['꽃나무', '꼰나무'],
  ['앞마당', '암마당'],
  ['백마', '뱅마'],
  ['읽는', '잉는'],
  ['없는', '엄는'],
  ['밟는', '밤는'],
  ['놓는', '논는'],
  ['종로', '종노'],
  ['침략', '침냑'],
  ['국립', '궁닙'],
  ['협력', '혐녁'],
  ['왕십리', '왕심니'],
  // Lateralization (유음화)
  ['신라', '실라'],
  ['설날', '설랄'],
  ['물난리', '물랄리'],
  ['대관령', '대괄령'],
  ['뚫는', '뚤른'],
  ['않네', '안네'],
  // Lexical exceptions: ㄴ+ㄹ → [ㄴㄴ]
  ['생산량', '생산냥'],
  ['의견란', '의견난'],
  // Tensification (경음화)
  ['학교', '학꾜'],
  ['먹고', '먹꼬'],
  ['숙제', '숙쩨'],
  ['옆집', '엽찝'],
  ['꽃병', '꼳뼝'],
  ['앉다', '안따'],
  ['젊다', '점따'],
  ['넓다', '널따'],
  ['핥다', '할따'],
  ['읊다', '읍따'],
  ['밟다', '밥따'],
  ['읽고', '일꼬'],
  ['맑게', '말께'],
  ['닭고기', '닥꼬기'],
  // Aspiration (격음화)
  ['좋다', '조타'],
  ['많고', '만코'],
  ['싫다', '실타'],
  ['낳지', '나치'],
  ['축하', '추카'],
  ['입학', '이팍'],
  ['잡혀', '자펴'],
  ['백화점', '배콰점'],
  ['따뜻하다', '따뜨타다'],
  ['밝히다', '발키다'],
  ['넓죽하다', '넙쭈카다'],
  // Palatalization (구개음화)
  ['같이', '가치'],
  ['굳이', '구지'],
  ['해돋이', '해도지'],
  ['밭이', '바치'],
  ['끝이', '끄치'],
  ['굳히다', '구치다'],
  ['맞히다', '마치다'],
  // Vowel rules
  ['희망', '히망'],
  ['무늬', '무니'],
  ['의사', '의사'],
  ['가져', '가저'],
  // No change
  ['안녕하세요', '안녕하세요'],
  ['사람', '사람'],
]

describe('pronounce', () => {
  it.each(CASES)('%s → [%s]', (word, expected) => {
    expect(pronounce(word).pronunciation).toBe(expected)
  })

  it('handles each word of a sentence separately and keeps other characters', () => {
    expect(pronounce('국물이 좋아요!').pronunciation).toBe('궁무리 조아요!')
  })

  it('leaves non-Hangul text untouched', () => {
    expect(pronounce('abc 123').pronunciation).toBe('abc 123')
    expect(pronounce('').pronunciation).toBe('')
  })

  it('records every rule step with before/after forms', () => {
    const { steps } = pronounce('읽는')
    expect(steps).toEqual([
      { rule: 'finalSimplification', index: 0, before: '읽는', after: '익는' },
      { rule: 'nasalization', index: 0, before: '익는', after: '잉는' },
    ])
  })

  it('reports the position of each step in the input', () => {
    const { steps } = pronounce('좋은 학교')
    const tense = steps.find((s) => s.rule === 'tensification')
    expect(tense).toMatchObject({ index: 3, before: '학교', after: '학꾜' })
  })

  it.each<[string, PronunciationRuleId]>([
    ['국어', 'liaison'],
    ['국물', 'nasalization'],
    ['신라', 'lateralization'],
    ['학교', 'tensification'],
    ['축하', 'aspiration'],
    ['같이', 'palatalization'],
    ['좋아', 'hDeletion'],
    ['꽃', 'finalNeutralization'],
    ['닭', 'finalSimplification'],
    ['희망', 'uiVowel'],
    ['가져', 'jyeoVowel'],
  ])('identifies the rule used in %s as %s', (word, rule) => {
    expect(pronounce(word).steps.map((s) => s.rule)).toContain(rule)
  })

  it('can turn off tensification, the ㅢ rule and obstruent aspiration', () => {
    const options = {
      tensification: false,
      uiVowel: false,
      jyeoVowel: false,
      aspirationAfterObstruent: false,
    }
    expect(pronounce('학교', options).pronunciation).toBe('학교')
    expect(pronounce('희망', options).pronunciation).toBe('희망')
    expect(pronounce('묵호', options).pronunciation).toBe('묵호')
    // ㅎ + ㄱ still aspirates: the noun exception only covers ㄱ/ㄷ/ㅂ + ㅎ.
    expect(pronounce('좋고', options).pronunciation).toBe('조코')
  })
})
