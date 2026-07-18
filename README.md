# Hangul

A small study app for the Korean Hangul alphabet, built with React, TypeScript, and Tailwind CSS.

## Features

- **Browse** — search and filter through vowels, consonants, final (batchim) sounds, and example syllable blocks. Click a card to reveal its romanization and notes.
- **Quiz** — multiple-choice practice with a per-category focus, keyboard shortcuts (press `1`–`4` to answer), and a best score persisted locally.
- **Light/dark theme**, following your system preference by default and toggleable, with the choice remembered across visits.

## Getting started

```sh
yarn install
yarn dev
```

## Scripts

| Command            | Description                          |
| ------------------- | ------------------------------------ |
| `yarn dev`           | Start the Vite dev server            |
| `yarn build`         | Type-check and build for production  |
| `yarn preview`       | Preview the production build         |
| `yarn test`          | Run the test suite once              |
| `yarn test:watch`    | Run tests in watch mode              |
| `yarn lint`          | Check formatting and lint rules      |
| `yarn lint:fix`      | Apply safe lint/format fixes         |

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) with the SWC React plugin
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- [Biome](https://biomejs.dev/) for linting and formatting

## Releases

Versioning and changelogs are automated with [release-please](https://github.com/googleapis/release-please), driven by [Conventional Commits](https://www.conventionalcommits.org/) on `main`.
