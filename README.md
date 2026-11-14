# Hanji (한지)

Named after _hanji_, the traditional Korean paper that calligraphy is written on. Hanji is a free platform to learn Korean, from Hangul up to TOPIK II. It runs entirely in the browser, needs no account, and keeps progress only on the user's device (IndexedDB).

**Use it at [hanji.akanyane.dev](https://hanji.akanyane.dev)**: free, no sign-up.

The interface **and** the learning content are multilingual: English and Brazilian Portuguese today, with more languages easy to add (see [Adding a language](#adding-a-language)). Code and documentation are in English.

Modules:

- **Hangul**: every consonant and vowel with audio, pronunciation tips and the origin of its shape; animated stroke order; handwriting practice with feedback; syllable builder; quizzes (recognize letters, listen and choose, read real words).
- **Vocabulary**: 243 words by approximate TOPIK level and topic, with examples, Hanja and audio; spaced repetition with [FSRS](https://github.com/open-spaced-repetition/ts-fsrs); four study modes (flashcards, multiple choice, typing, listen and write); custom decks; searchable dictionary; statistics and review forecast.
- **Grammar**: 22 lessons from 이다 and particles to connectives and reported speech, each with explanation, formation table, examples with audio, common mistakes written for speakers of each language, and exercises; a conjugator for any verb or adjective (tenses, formality levels, honorifics, negation, connectives and all irregular classes); endless particle practice.
- **Pronunciation**: lessons for all 11 sound-change rules with engine-verified examples, step-by-step transformations and quizzes whose wrong answers are the intermediate stages; minimal-pair ear training.
- **Listening**: dictation with a jamo-level diff, and dialogues read with a different voice pitch per speaker, with optional transcript, translation and comprehension questions; adjustable speech speed.
- **Speaking**: repeat-after-me with speech recognition and jamo-level scoring (with a recording fallback where recognition isn't available, e.g. Firefox), shadowing with loop and hidden text, and local voice recording.
- **Reading**: graded texts with a clickable glossary (any vocabulary word can be added to spaced repetition), read-aloud and comprehension questions.
- **Dialogues**: 10 everyday situations with a voice per character, translation, culture notes and a "complete the dialogue" exercise.
- **Numbers**: Sino-Korean and native systems, counters, time, dates, money and age, with a live converter and endless practice.
- **Writing**: a 2-set (두벌식) keyboard trainer (physical or on-screen), tolerant translation practice and guided free writing.
- **Culture**: notes on formality, forms of address, etiquette, expressions, slang and holidays, linked from related lessons and dialogues.
- **Progress**: XP, levels, day streak, study time, an activity heatmap, accuracy per skill and 22 achievements; a placement test that suggests where to start; an original TOPIK I-style mock exam (timed listening and reading, audio played at most twice, level estimate with the official ratios); export/import of all progress as a JSON backup.
- **Tools**: "how is it pronounced?" (applies the standard sound-change rules and explains each step), Hangul ↔ Revised Romanization converter, and syllable decomposer.

It is an installable PWA that works offline after the first visit (every page is precached): open [hanji.akanyane.dev](https://hanji.akanyane.dev) and use your browser's "Install" option, or "Add to Home Screen" on iPhone/iPad. Speech synthesis uses the voices installed on the device; speech recognition, where supported (Chrome), may need a connection.

## Getting started

Requires [Bun](https://bun.com/) 1.4+.

```sh
bun install
bun run dev
```

## Scripts

| Command                       | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `bun run dev`                 | Start the Vite dev server                       |
| `bun run build`               | Type-check and build for production             |
| `bun run preview`             | Preview the production build                    |
| `bun run test`                | Run the test suite once (Vitest)                |
| `bun run test:watch`          | Run tests in watch mode                         |
| `bun run typecheck`           | Type-check only                                 |
| `bun run lint`                | Check formatting and lint rules                 |
| `bun run lint:fix`            | Apply safe lint/format fixes                    |
| `bun run generate-pwa-assets` | Regenerate the app icons from `public/logo.svg` |

> Use `bun run test`, not `bun test`: the latter starts Bun's own test runner, while this project uses Vitest.

## Project structure

```
src/
  routes/      TanStack Router file-based routes (thin: they only wire URL → feature)
  features/    One folder per module (components and hooks)
  lib/         Pure, tested logic with no React:
                 hangul/         Unicode syllable composition/decomposition
                 pronunciation/  Standard pronunciation rules engine (표준 발음법)
                 romanization/   Revised Romanization, both directions
                 ime/            2-set (두벌식) keyboard composition automaton
                 similarity/     Jamo-level text comparison (for speaking practice)
                 conjugation/    Verb/adjective conjugation engine (all irregular classes)
                 numbers/        Sino-Korean and native numbers, counters, time, dates, money
                 particles/      Particle forms chosen by the final consonant
                 srs/            Spaced repetition on top of ts-fsrs (FSRS)
                 handwriting/    Handwriting similarity check
                 quiz/           Generic multiple-choice generator
                 progress/       XP, levels, streaks, per-skill accuracy and achievements
  content/     Typed learning content, kept separate from the code
  db/          Local database (Dexie/IndexedDB), repositories and TanStack Query hooks
  i18n/        Languages, UI message catalogs (one file per language)
  stores/      Global UI state (TanStack Store)
  services/    Browser APIs (speech synthesis, speech recognition, recording, install prompt)
  hooks/       Shared React hooks
  components/  Reusable components (layout and ui)
```

- `src/routeTree.gen.ts` is generated by the router plugin (on `dev` and `build`). It is committed so type-checking works before the first build; don't edit it by hand.
- Progress is computed from the raw records (quiz attempts, reviews, practice events, study time), never stored as totals, so a backup or a future sync can't make the numbers drift.
- Every database record has an `id` (UUID), `updatedAt` and `deletedAt`, so a backend sync can be added later without depending on one now.
- Mark uncertain Korean content with `needsReview: true` instead of guessing.
- Animations use [Motion](https://motion.dev/) and respect the OS "reduce motion" setting.

## Adding a language

1. Add the language code and its label in `src/i18n/locales.ts`.
2. Create `src/i18n/messages/<code>.ts` typed as `Messages`: TypeScript lists every missing UI string.
3. Fill the new language in every `Localized` value under `src/content`: TypeScript lists those too, and the content tests check nothing is empty.

Write pronunciation tips for speakers of that language (comparing with its own sounds) rather than translating another language's tips literally.

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [TanStack Router](https://tanstack.com/router), [Query](https://tanstack.com/query), [Store](https://tanstack.com/store), [Form](https://tanstack.com/form), [Table](https://tanstack.com/table), [Virtual](https://tanstack.com/virtual) and [Pacer](https://tanstack.com/pacer)
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) for spaced repetition
- [Dexie](https://dexie.org/) (IndexedDB)
- [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/)
- [Motion](https://motion.dev/) for animations
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) for the offline, installable app
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) + [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB)
- [Biome](https://biomejs.dev/) for linting and formatting

## Releases

Versioning and changelogs are automated with [release-please](https://github.com/googleapis/release-please), driven by [Conventional Commits](https://www.conventionalcommits.org/) on `main`.

## License

[MIT](LICENSE)
