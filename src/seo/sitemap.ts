import { CULTURE_NOTES } from '../content/culture/notes'
import { GRAMMAR_LESSONS } from '../content/grammar'
import { hangulData } from '../content/hangul'
import { DIALOGUES } from '../content/listening/dialogues'
import { RULE_ORDER } from '../content/pronunciation/practice'
import { READING_TEXTS } from '../content/reading/texts'
import { MOCK_EXAMS } from '../content/topik/mock'
import { VOCABULARY } from '../content/vocabulary'

import { SITE_URL } from './site'

export { SITE_URL }

/**
 * Public pages worth indexing: module pages and every piece of content.
 * Personal pages (study sessions, decks, data, achievements) are left out.
 */
export function sitemapPaths(): string[] {
  const modules = [
    '/',
    '/today',
    '/hangul',
    '/hangul/builder',
    '/hangul/quiz',
    '/pronunciation',
    '/pronunciation/minimal-pairs',
    '/vocabulary',
    '/vocabulary/dictionary',
    '/grammar',
    '/grammar/conjugator',
    '/grammar/particles',
    '/listening',
    '/listening/dialogues',
    '/speaking',
    '/speaking/shadowing',
    '/reading',
    '/dialogues',
    '/numbers',
    '/numbers/practice',
    '/writing',
    '/writing/translate',
    '/writing/produce',
    '/culture',
    '/tools',
    '/tools/pronunciation',
    '/tools/romanization',
    '/tools/decomposer',
    '/progress/placement',
    '/progress/exam',
  ]
  return [
    ...modules,
    ...hangulData.map((e) => `/hangul/${e.id}`),
    ...RULE_ORDER.map((id) => `/pronunciation/${id}`),
    ...GRAMMAR_LESSONS.map((l) => `/grammar/${l.id}`),
    ...READING_TEXTS.map((t) => `/reading/${t.id}`),
    ...DIALOGUES.map((d) => `/dialogues/${d.id}`),
    ...CULTURE_NOTES.map((n) => `/culture/${n.id}`),
    ...MOCK_EXAMS.map((e) => `/progress/exam/${e.id}`),
    ...VOCABULARY.map((w) => `/vocabulary/word/${w.id}`),
  ]
}

export function sitemapXml(paths = sitemapPaths()): string {
  const urls = paths
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}
