import { describe, expect, it } from 'vitest'
import { LOCALES } from '../../i18n/locales'
import { isSyllable } from '../../lib/hangul'
import { CULTURE_NOTES } from '../culture/notes'
import { GRAMMAR_LESSONS } from '../grammar'
import { DIALOGUES } from '../listening/dialogues'
import { getWord } from '../vocabulary'
import { TRANSLATIONS, WRITING_PROMPTS } from '../writing/writing'
import { parseReading, plainText, READING_TEXTS } from './texts'

const nonEmpty = (text: Record<string, string>, label: string) => {
  for (const locale of LOCALES)
    expect(
      text[locale as keyof typeof text]?.trim(),
      `${label} ${locale}`,
    ).toBeTruthy()
}

describe('reading markup', () => {
  it('parses glossary links', () => {
    expect(parseReading('제 [이름](name)은 민수예요.')).toEqual([
      { text: '제 ' },
      { text: '이름', key: 'name' },
      { text: '은 민수예요.' },
    ])
    expect(plainText('제 [이름](name)은')).toBe('제 이름은')
  })
})

describe('reading texts', () => {
  it('link every glossary word to the vocabulary bank or the text glossary', () => {
    for (const text of READING_TEXTS) {
      for (const paragraph of text.paragraphs) {
        for (const token of parseReading(paragraph.ko)) {
          if (!token.key) continue
          const known = getWord(token.key) ?? text.glossary[token.key]
          expect(
            known,
            `${text.id}: [${token.text}](${token.key})`,
          ).toBeDefined()
        }
      }
    }
  })

  it('have unique ids, translations and valid questions', () => {
    expect(new Set(READING_TEXTS.map((t) => t.id)).size).toBe(
      READING_TEXTS.length,
    )
    for (const text of READING_TEXTS) {
      nonEmpty(text.title, text.id)
      for (const p of text.paragraphs) nonEmpty(p.translation, text.id)
      for (const entry of Object.values(text.glossary))
        nonEmpty(entry.meaning, text.id)
      expect(text.questions.length, text.id).toBeGreaterThanOrEqual(2)
      for (const q of text.questions)
        expect(q.answer).toBeLessThan(q.choices.length)
    }
  })
})

describe('dialogues', () => {
  it('has the 10 dialogues of the dialogues module', () => {
    expect(DIALOGUES.length).toBeGreaterThanOrEqual(10)
  })
})

describe('writing content', () => {
  it('gives every translation exercise Korean answers', () => {
    for (const ex of TRANSLATIONS) {
      nonEmpty(ex.prompt, ex.id)
      expect(ex.answers.length, ex.id).toBeGreaterThanOrEqual(1)
      for (const answer of ex.answers)
        expect([...answer].some(isSyllable), `${ex.id}: ${answer}`).toBe(true)
    }
  })

  it('has model answers that pass their own checks', () => {
    for (const prompt of WRITING_PROMPTS) {
      const sentences = prompt.modelAnswer
        .split(/[.!?]/)
        .filter((s) => s.trim())
      expect(sentences.length, prompt.id).toBeGreaterThanOrEqual(
        prompt.minSentences,
      )
      for (const check of prompt.checks) {
        expect(
          check.anyOf.some((p) => prompt.modelAnswer.includes(p)),
          `${prompt.id}: ${check.label.en}`,
        ).toBe(true)
      }
    }
  })
})

describe('culture notes', () => {
  it('only reference lessons and dialogues that exist', () => {
    const lessons = new Set(GRAMMAR_LESSONS.map((l) => l.id))
    const dialogues = new Set(DIALOGUES.map((d) => d.id))
    for (const note of CULTURE_NOTES) {
      nonEmpty(note.title, note.id)
      for (const p of note.paragraphs) nonEmpty(p, note.id)
      for (const id of note.relatedLessons ?? [])
        expect(lessons.has(id), `${note.id} → ${id}`).toBe(true)
      for (const id of note.relatedDialogues ?? [])
        expect(dialogues.has(id), `${note.id} → ${id}`).toBe(true)
    }
  })
})
