import { describe, expect, it } from 'vitest'
import {
  analyzeVerb,
  conjugate,
  type FormId,
  guessKind,
  type IrregularType,
} from './conjugate'

const form = (word: string, id: FormId) => conjugate(word)?.forms[id]

/** [dictionary form, form id, expected] — checked against standard Korean usage. */
const CASES: Array<[string, FormId, string]> = [
  // Regular, vowel stems (contraction)
  ['가다', 'present.polite', '가요'],
  ['가다', 'past.polite', '갔어요'],
  ['가다', 'present.formal', '갑니다'],
  ['가다', 'present.casual', '가'],
  ['가다', 'future.polite', '갈 거예요'],
  ['가다', 'connective.if', '가면'],
  ['가다', 'modifier.present', '가는'],
  ['가다', 'modifier.past', '간'],
  ['보다', 'present.polite', '봐요'],
  ['보다', 'past.polite', '봤어요'],
  ['오다', 'present.polite', '와요'],
  ['오다', 'present.formal', '옵니다'],
  ['주다', 'present.polite', '줘요'],
  ['배우다', 'past.polite', '배웠어요'],
  ['마시다', 'present.polite', '마셔요'],
  ['마시다', 'past.formal', '마셨습니다'],
  ['기다리다', 'present.polite', '기다려요'],
  ['되다', 'present.polite', '돼요'],
  ['되다', 'past.polite', '됐어요'],
  ['보내다', 'past.polite', '보냈어요'],
  ['쉬다', 'present.polite', '쉬어요'],
  ['서다', 'present.polite', '서요'],
  // Regular, consonant stems
  ['먹다', 'present.polite', '먹어요'],
  ['먹다', 'past.polite', '먹었어요'],
  ['먹다', 'present.formal', '먹습니다'],
  ['먹다', 'connective.if', '먹으면'],
  ['먹다', 'modifier.present', '먹는'],
  ['먹다', 'modifier.past', '먹은'],
  ['먹다', 'future.polite', '먹을 거예요'],
  ['읽다', 'present.polite', '읽어요'],
  ['읽다', 'honorific.present', '읽으세요'],
  ['앉다', 'present.polite', '앉아요'],
  ['받다', 'present.polite', '받아요'],
  ['입다', 'present.polite', '입어요'],
  ['입다', 'connective.if', '입으면'],
  ['웃다', 'present.polite', '웃어요'],
  ['놓다', 'present.polite', '놓아요'],
  ['좋다', 'present.polite', '좋아요'],
  ['좋다', 'modifier.present', '좋은'],
  ['작다', 'modifier.present', '작은'],
  // 하다
  ['하다', 'present.polite', '해요'],
  ['하다', 'past.polite', '했어요'],
  ['하다', 'present.formal', '합니다'],
  ['하다', 'future.polite', '할 거예요'],
  ['공부하다', 'present.polite', '공부해요'],
  ['공부하다', 'negShort.present', '공부 안 해요'],
  ['좋아하다', 'negShort.present', '안 좋아해요'],
  ['피곤하다', 'negShort.present', '안 피곤해요'],
  // ㅂ irregular
  ['덥다', 'present.polite', '더워요'],
  ['덥다', 'past.polite', '더웠어요'],
  ['덥다', 'present.formal', '덥습니다'],
  ['덥다', 'connective.if', '더우면'],
  ['덥다', 'modifier.present', '더운'],
  ['덥다', 'future.polite', '더울 거예요'],
  ['어렵다', 'present.polite', '어려워요'],
  ['돕다', 'present.polite', '도와요'],
  ['돕다', 'past.polite', '도왔어요'],
  ['돕다', 'modifier.present', '돕는'],
  ['돕다', 'modifier.past', '도운'],
  ['눕다', 'present.polite', '누워요'],
  // ㄷ irregular
  ['듣다', 'present.polite', '들어요'],
  ['듣다', 'past.polite', '들었어요'],
  ['듣다', 'present.formal', '듣습니다'],
  ['듣다', 'connective.if', '들으면'],
  ['듣다', 'honorific.present', '들으세요'],
  ['듣다', 'modifier.present', '듣는'],
  ['듣다', 'modifier.past', '들은'],
  ['듣다', 'future.polite', '들을 거예요'],
  ['걷다', 'present.polite', '걸어요'],
  ['닫다', 'present.polite', '닫아요'],
  // ㅅ irregular
  ['낫다', 'present.polite', '나아요'],
  ['낫다', 'past.polite', '나았어요'],
  ['낫다', 'present.formal', '낫습니다'],
  ['낫다', 'connective.if', '나으면'],
  ['짓다', 'present.polite', '지어요'],
  ['짓다', 'modifier.present', '짓는'],
  ['짓다', 'modifier.past', '지은'],
  ['씻다', 'present.polite', '씻어요'],
  // ㅎ irregular (adjectives)
  ['파랗다', 'present.polite', '파래요'],
  ['파랗다', 'past.polite', '파랬어요'],
  ['파랗다', 'present.formal', '파랗습니다'],
  ['파랗다', 'connective.if', '파라면'],
  ['파랗다', 'modifier.present', '파란'],
  ['파랗다', 'connective.and', '파랗고'],
  ['하얗다', 'present.polite', '하얘요'],
  ['그렇다', 'present.polite', '그래요'],
  ['어떻다', 'present.polite', '어때요'],
  ['어떻다', 'past.polite', '어땠어요'],
  // 르 irregular
  ['모르다', 'present.polite', '몰라요'],
  ['모르다', 'past.polite', '몰랐어요'],
  ['모르다', 'present.formal', '모릅니다'],
  ['모르다', 'connective.if', '모르면'],
  ['부르다', 'present.polite', '불러요'],
  ['빠르다', 'present.polite', '빨라요'],
  ['빠르다', 'modifier.present', '빠른'],
  ['다르다', 'present.polite', '달라요'],
  ['따르다', 'present.polite', '따라요'],
  // 러 irregular
  ['푸르다', 'present.polite', '푸르러요'],
  // ㄹ stems
  ['살다', 'present.polite', '살아요'],
  ['살다', 'present.formal', '삽니다'],
  ['살다', 'honorific.present', '사세요'],
  ['살다', 'connective.if', '살면'],
  ['살다', 'connective.because', '사니까'],
  ['살다', 'modifier.present', '사는'],
  ['살다', 'modifier.past', '산'],
  ['살다', 'future.polite', '살 거예요'],
  ['만들다', 'present.formal', '만듭니다'],
  ['만들다', 'honorific.present', '만드세요'],
  ['알다', 'modifier.present', '아는'],
  ['길다', 'present.formal', '깁니다'],
  ['길다', 'modifier.present', '긴'],
  // 으 irregular
  ['바쁘다', 'present.polite', '바빠요'],
  ['바쁘다', 'past.polite', '바빴어요'],
  ['바쁘다', 'connective.if', '바쁘면'],
  ['바쁘다', 'modifier.present', '바쁜'],
  ['쓰다', 'present.polite', '써요'],
  ['쓰다', 'past.polite', '썼어요'],
  ['쓰다', 'present.formal', '씁니다'],
  ['크다', 'present.polite', '커요'],
  ['예쁘다', 'present.polite', '예뻐요'],
  ['아프다', 'present.polite', '아파요'],
  // Honorifics
  ['가다', 'honorific.present', '가세요'],
  ['가다', 'honorific.formal', '가십니다'],
  ['가다', 'honorific.past', '가셨어요'],
  ['가다', 'honorific.future', '가실 거예요'],
  ['먹다', 'honorific.present', '드세요'],
  ['먹다', 'honorific.past', '드셨어요'],
  ['자다', 'honorific.present', '주무세요'],
  ['있다', 'honorific.present', '계세요'],
  // Negation
  ['가다', 'negShort.present', '안 가요'],
  ['가다', 'negShort.past', '안 갔어요'],
  ['가다', 'negLong.present', '가지 않아요'],
  ['가다', 'negLong.past', '가지 않았어요'],
  ['가다', 'negLong.formal', '가지 않습니다'],
  ['있다', 'negShort.present', '없어요'],
  ['알다', 'negShort.present', '몰라요'],
  // Progressive, desire, connectives
  ['가다', 'progressive.polite', '가고 있어요'],
  ['먹다', 'progressive.formal', '먹고 있습니다'],
  ['가다', 'want', '가고 싶어요'],
  ['가다', 'connective.so', '가서'],
  ['듣다', 'connective.so', '들어서'],
  ['먹다', 'connective.because', '먹으니까'],
  ['덥다', 'connective.because', '더우니까'],
  ['가다', 'connective.but', '가지만'],
  ['있다', 'modifier.present', '있는'],
  ['재미있다', 'modifier.present', '재미있는'],
  ['가다', 'past.casual', '갔어'],
  ['가다', 'future.casual', '갈 거야'],
  ['가다', 'future.formal', '갈 겁니다'],
  // TOPIK 2 expressions, across irregular classes
  ['가다', 'ability.can', '갈 수 있어요'],
  ['먹다', 'ability.can', '먹을 수 있어요'],
  ['듣다', 'ability.can', '들을 수 있어요'],
  ['돕다', 'ability.cannot', '도울 수 없어요'],
  ['만들다', 'ability.can', '만들 수 있어요'],
  ['짓다', 'ability.can', '지을 수 있어요'],
  ['가다', 'obligation', '가야 해요'],
  ['먹다', 'obligation', '먹어야 해요'],
  ['공부하다', 'obligation', '공부해야 해요'],
  ['모르다', 'obligation', '몰라야 해요'],
  ['먹다', 'permission', '먹어도 돼요'],
  ['쓰다', 'permission', '써도 돼요'],
  ['찍다', 'prohibition', '찍으면 안 돼요'],
  ['가다', 'prohibition', '가면 안 돼요'],
  ['살다', 'prohibition', '살면 안 돼요'],
  ['가다', 'background', '가는데'],
  ['살다', 'background', '사는데'],
  ['있다', 'background', '있는데'],
  ['맛있다', 'background', '맛있는데'],
  ['바쁘다', 'background', '바쁜데'],
  ['춥다', 'background', '추운데'],
  ['길다', 'background', '긴데'],
  ['하얗다', 'background', '하얀데'],
  ['가다', 'background.past', '갔는데'],
  ['춥다', 'background.past', '추웠는데'],
  ['아프다', 'reason.ttaemun', '아프기 때문에'],
  ['먹다', 'when', '먹을 때'],
  ['가다', 'when', '갈 때'],
  ['춥다', 'when', '추울 때'],
  ['살다', 'when', '살 때'],
  ['가다', 'intention', '가려고 해요'],
  ['먹다', 'intention', '먹으려고 해요'],
  ['만들다', 'intention', '만들려고 해요'],
  ['듣다', 'intention', '들으려고 해요'],
  ['가다', 'experience', '간 적이 있어요'],
  ['먹다', 'experience', '먹은 적이 있어요'],
  ['살다', 'experience', '산 적이 있어요'],
  ['듣다', 'experience', '들은 적이 있어요'],
  ['입다', 'try', '입어 봐요'],
  ['하다', 'try', '해 봐요'],
  ['가다', 'become', '가게 돼요'],
]

describe('conjugate', () => {
  it.each(CASES)('%s → %s = %s', (word, id, expected) => {
    expect(form(word, id)).toBe(expected)
  })

  it('omits verb-only forms for adjectives', () => {
    const result = conjugate('덥다')
    expect(result?.forms['progressive.polite']).toBeUndefined()
    expect(result?.forms.want).toBeUndefined()
    expect(result?.forms['modifier.past']).toBeUndefined()
    expect(result?.notes).toContain('verbOnlyForms')
  })

  it('flags special honorifics, negative counterparts and ambiguous irregulars', () => {
    expect(conjugate('먹다')?.notes).toContain('specialHonorific')
    expect(conjugate('먹다')?.honorificVerb).toBe('드시다')
    expect(conjugate('있다')?.negativeVerb).toBe('없다')
    expect(conjugate('걷다')?.notes).toContain('ambiguousIrregular')
  })

  it('lets the caller override the irregular class (걷다 "to roll up" is regular)', () => {
    expect(
      conjugate('걷다', { irregular: 'regular' })?.forms['present.polite'],
    ).toBe('걷어요')
    expect(conjugate('걷다', { irregular: 'regular' })?.notes).not.toContain(
      'ambiguousIrregular',
    )
  })

  it('rejects input that is not a dictionary form', () => {
    expect(conjugate('먹어요')).toBeNull() // conjugated form, not …다
    expect(conjugate('가')).toBeNull()
    expect(conjugate('hello다')).toBeNull()
    expect(conjugate('')).toBeNull()
  })
})

describe('analyzeVerb', () => {
  it.each<[string, IrregularType]>([
    ['가다', 'regular'],
    ['하다', 'ha'],
    ['공부하다', 'ha'],
    ['덥다', 'b'],
    ['입다', 'regular'],
    ['듣다', 'd'],
    ['받다', 'regular'],
    ['낫다', 's'],
    ['웃다', 'regular'],
    ['파랗다', 'h'],
    ['좋다', 'regular'],
    ['놓다', 'regular'],
    ['모르다', 'reu'],
    ['따르다', 'eu'],
    ['푸르다', 'reo'],
    ['살다', 'l'],
    ['쓰다', 'eu'],
  ])('%s is %s', (word, irregular) => {
    expect(analyzeVerb(word)?.irregular).toBe(irregular)
  })

  it('guesses adjectives from a known list', () => {
    expect(guessKind('덥다')).toBe('adjective')
    expect(guessKind('먹다')).toBe('verb')
  })
})
