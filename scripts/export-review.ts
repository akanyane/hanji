// Exports every piece of Korean learning content to one CSV, so a native
// speaker can review it in a spreadsheet (Excel, Google Sheets, LibreOffice).
//
//   bun run export:review            → review/korean-content.csv
//
// Columns: module, id, kind, level, korean, pt-BR, en, needs_review,
// plus empty "ok?" and "reviewer_notes" columns for the reviewer.

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CULTURE_NOTES } from '../src/content/culture/notes'
import { GRAMMAR_LESSONS } from '../src/content/grammar'
import { DIALOGUES } from '../src/content/listening/dialogues'
import { PLACEMENT_QUESTIONS } from '../src/content/progress/placement'
import { MINIMAL_PAIRS } from '../src/content/pronunciation/practice'
import { plainText, READING_TEXTS } from '../src/content/reading/texts'
import { MOCK_EXAMS } from '../src/content/topik/mock'
import { VOCABULARY } from '../src/content/vocabulary'
import { TRANSLATIONS, WRITING_PROMPTS } from '../src/content/writing/writing'
import type { Localized } from '../src/i18n/locales'

interface Row {
  module: string
  id: string
  kind: string
  level?: number | string
  korean: string
  pt?: string
  en?: string
  needsReview?: boolean
}

const rows: Row[] = []
const add = (row: Row) => rows.push(row)
const tr = (value?: Localized) => ({ pt: value?.['pt-BR'], en: value?.en })

for (const w of VOCABULARY) {
  add({
    module: 'vocabulary',
    id: w.id,
    kind: 'word',
    level: w.level,
    korean: w.hanja ? `${w.word} (${w.hanja})` : w.word,
    ...tr(w.meaning),
  })
  add({
    module: 'vocabulary',
    id: w.id,
    kind: 'example',
    level: w.level,
    korean: w.example.ko,
    ...tr(w.example.translation),
  })
}

for (const lesson of GRAMMAR_LESSONS) {
  const base = {
    module: 'grammar',
    id: lesson.id,
    level: lesson.level,
    needsReview: lesson.needsReview,
  }
  add({ ...base, kind: 'pattern', korean: lesson.pattern, ...tr(lesson.title) })
  for (const e of lesson.examples)
    add({ ...base, kind: 'example', korean: e.ko, ...tr(e.translation) })
  for (const ex of lesson.exercises)
    add({
      ...base,
      kind: 'exercise (answer filled in)',
      korean: ex.prompt.replace('___', `[${ex.choices[ex.answer]}]`),
      ...tr(ex.translation),
    })
}

for (const text of READING_TEXTS)
  text.paragraphs.forEach((p, i) => {
    add({
      module: 'reading',
      id: `${text.id}#${i + 1}`,
      kind: 'paragraph',
      level: text.level,
      korean: plainText(p.ko),
      ...tr(p.translation),
    })
  })

for (const d of DIALOGUES)
  d.lines.forEach((line, i) => {
    add({
      module: 'dialogues',
      id: `${d.id}#${i + 1}`,
      kind: `line (${d.speakers[line.speaker].en})`,
      level: d.level,
      korean: line.ko,
      ...tr(line.translation),
    })
  })

for (const exam of MOCK_EXAMS)
  for (const q of exam.questions)
    add({
      module: `exam ${exam.id}`,
      id: q.id,
      kind: `${q.section}: ${q.instruction.ko}`,
      level: exam.kind,
      korean: [
        q.audio?.map((a) => a.text).join(' / ') ?? q.passage ?? '',
        `→ ${q.choices[0]}`,
        `(wrong: ${q.choices.slice(1).join(' | ')})`,
      ].join('\n'),
      ...tr(q.translation),
    })

for (const q of PLACEMENT_QUESTIONS) {
  const answer = q.choices[q.answer]
  add({
    module: 'placement',
    id: q.id,
    kind: 'question',
    level: q.level,
    korean: [q.ko ?? '', `→ ${typeof answer === 'string' ? answer : answer.en}`]
      .filter(Boolean)
      .join('\n'),
    ...tr(q.instruction),
  })
}

for (const t of TRANSLATIONS)
  add({
    module: 'writing',
    id: t.id,
    kind: 'accepted translations',
    korean: t.answers.join(' | '),
    ...tr(t.prompt),
  })
for (const prompt of WRITING_PROMPTS)
  add({
    module: 'writing',
    id: prompt.id,
    kind: 'model answer',
    korean: prompt.modelAnswer,
    ...tr(prompt.modelTranslation),
  })

for (const note of CULTURE_NOTES)
  for (const phrase of note.phrases)
    add({
      module: 'culture',
      id: note.id,
      kind: 'phrase',
      korean: phrase.ko,
      ...tr(phrase.translation),
    })

for (const group of MINIMAL_PAIRS)
  for (const w of group.words)
    add({
      module: 'pronunciation',
      id: group.id,
      kind: `minimal pair ${group.contrast}`,
      korean: w.word,
      ...tr(w.meaning),
    })

const HEADER = [
  'module',
  'id',
  'kind',
  'level',
  'korean',
  'pt-BR',
  'en',
  'needs_review',
  'ok?',
  'reviewer_notes',
]

const cell = (value: unknown) => {
  const text = value === undefined || value === null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const csv = [
  HEADER.join(','),
  ...rows.map((r) =>
    [
      r.module,
      r.id,
      r.kind,
      r.level,
      r.korean,
      r.pt,
      r.en,
      r.needsReview ? 'yes' : '',
      '',
      '',
    ]
      .map(cell)
      .join(','),
  ),
].join('\r\n')

const outDir = join(import.meta.dir, '..', 'review')
mkdirSync(outDir, { recursive: true })
const file = join(outDir, 'korean-content.csv')
// The BOM makes Excel open the file as UTF-8 (Hangul would break otherwise).
writeFileSync(file, `﻿${csv}\r\n`)
console.log(`${rows.length} rows → ${file}`)
