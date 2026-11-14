// English UI messages. This file defines the message keys: every other
// language must provide exactly the same keys (enforced by `Messages`).
// Plurals use i18next suffixes: key_one / key_other.

export const en = {
  common: {
    appName: 'Learn Korean',
    comingSoon: 'Coming soon',
    silent: '(silent)',
    none: 'none',
    examples: 'Examples',
    copy: 'Copy',
    copied: 'Copied!',
    result: 'Result',
    resultPlaceholder: 'The result shows up here.',
    previous: 'Previous',
    next: 'Next',
    continue: 'Continue',
  },
  nav: {
    main: 'Main navigation',
    home: 'Home',
    hangul: 'Hangul',
    tools: 'Tools',
    skipToContent: 'Skip to content',
    homeLabel: 'Learn Korean: home page',
    language: 'Language',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  errors: {
    notFound: 'Page not found.',
    backHome: 'Back to home',
    generic: 'Something went wrong.',
    tryAgain: 'Try again',
  },
  audio: {
    listen: 'Listen to {{text}}',
    unsupported: "Your browser doesn't support speech synthesis.",
    noKoreanVoice:
      'No Korean voice installed: your browser may use another voice.',
  },
  home: {
    title: 'Learn Korean from scratch',
    description:
      'A free platform, from Hangul to TOPIK II. It runs in your browser and keeps your progress only on your device.',
    modules: {
      hangul: {
        title: 'Hangul',
        description:
          'Consonants, vowels, final consonants and your first syllable blocks.',
      },
      pronunciation: {
        title: 'Pronunciation',
        description: 'Sound change rules and the "How is it pronounced?" tool.',
      },
      vocabulary: {
        title: 'Vocabulary',
        description: 'Words by TOPIK level and topic, with spaced repetition.',
      },
      grammar: {
        title: 'Grammar',
        description:
          'Particles, conjugation and connectives, with a conjugator.',
      },
      listening: {
        title: 'Listening',
        description:
          'Dictation and dialogue comprehension at adjustable speed.',
      },
      speaking: {
        title: 'Speaking',
        description: 'Repeat-after-me with speech recognition and shadowing.',
      },
      reading: {
        title: 'Reading',
        description: 'Graded texts with a clickable glossary.',
      },
      writing: {
        title: 'Writing and typing',
        description:
          '2-set (두벌식) keyboard, translation practice and guided writing.',
      },
      numbers: {
        title: 'Numbers and counters',
        description:
          'Sino-Korean and native numbers, time, dates, money and counters.',
      },
      dialogues: {
        title: 'Dialogues',
        description: 'Real situations: restaurant, subway, shopping, work.',
      },
      culture: {
        title: 'Culture',
        description: 'Formality, etiquette, common expressions and slang.',
      },
      progress: {
        title: 'Progress',
        description:
          'Streaks, XP, achievements, placement test and mock exams.',
      },
      tools: {
        title: 'Tools',
        description:
          'How is it pronounced?, romanization converter and syllable decomposer.',
      },
    },
  },
  hangul: {
    title: 'Hangul',
    description: 'The Korean alphabet: tap a card to learn the letter.',
    sections: 'Hangul sections',
    tabs: {
      browse: 'Browse',
      builder: 'Syllable builder',
      quiz: 'Quiz',
    },
    category: {
      all: 'All',
      vowel: 'Vowel',
      consonant: 'Consonant',
      final: 'Final (batchim)',
      syllable: 'Syllable',
    },
    categoryLegend: 'Category',
    search: 'Search',
    searchPlaceholder: 'Search by Hangul or romanization...',
    results_one: '{{count}} result',
    results_other: '{{count}} results',
    noResults: 'No characters match your search.',
    detail: {
      back: 'All characters',
      strokeOrder: 'Stroke order',
      strokes_one: '{{count}} stroke',
      strokes_other: '{{count}} strokes',
      replay: 'Replay animation',
      origin: 'Where the shape comes from',
      howToSay: 'How to pronounce it',
      example: 'Example',
      notes: 'Notes',
      practice: 'Practice writing',
      composedOf: 'Made of',
      openInBuilder: 'Open in the syllable builder',
      finalSound: 'Sounds like {{sound}} at the end of a syllable.',
      strokeDiagram: 'Stroke order of {{char}}',
    },
    builder: {
      description:
        'Pick an initial consonant, a vowel and, if you like, a final consonant to build a syllable block.',
      initial: 'Initial consonant',
      medial: 'Vowel',
      final: 'Final consonant (optional)',
      noFinal: 'None',
      random: 'Random syllable',
      pronunciation: 'Pronunciation',
      romanization: 'Romanization',
      layout: {
        vertical:
          'Vertical vowel: the consonant goes on the left and the vowel on the right.',
        horizontal:
          'Horizontal vowel: the consonant goes on top and the vowel below.',
        mixed:
          'Compound vowel: it wraps around the consonant, below and to the right.',
        final: 'The final consonant (batchim) always goes at the bottom.',
      },
    },
    writing: {
      canvasLabel: 'Drawing area to practice {{char}}',
      clear: 'Clear',
      check: 'Check',
      showGuide: 'Show guide',
      hideGuide: 'Hide guide',
      empty: 'Draw the letter first.',
      great: 'Great! Very close to the model.',
      close: 'Almost there! Compare with the model and try again.',
      retry: 'Try again, following the guide strokes.',
      strokeCount: 'You used {{drawn}} strokes; this letter has {{expected}}.',
      unsupported: "Your browser can't draw here.",
    },
    quiz: {
      modes: 'Quiz mode',
      recognize: {
        title: 'Recognize letters',
        description: 'See the character and pick its romanization.',
      },
      listen: {
        title: 'Listen and choose',
        description: 'Hear the sound and pick the character.',
      },
      read: {
        title: 'Read words',
        description: 'Read real words and pick their romanization.',
      },
      listenUnsupported:
        "Your browser doesn't support speech synthesis, so this mode isn't available.",
      summary: 'Best score: {{best}} · Attempts: {{attempts}}',
      start: 'Start quiz',
      playAgain: 'Play again',
      notEnough: 'There are not enough characters in this category for a quiz.',
      progress: 'Quiz progress',
      question: 'Question {{current}} of {{total}} · Correct: {{score}}',
      instructions: 'Choose the correct answer. Use keys 1 to {{count}}.',
      playSound: 'Play the sound again',
      correct: 'Correct!',
      incorrect: 'Not quite. The answer was {{answer}}.',
      meaning: 'Meaning: {{meaning}}',
      finished: 'You got {{score}} out of {{total}}!',
      perfect: 'Perfect score!',
      good: 'Nice work! Keep practicing.',
      keepGoing: 'Keep going: practice makes perfect.',
      continueHint: 'Press Enter to continue',
    },
  },
  tools: {
    title: 'Tools',
    description:
      'Utilities to look things up any time. Everything runs in your browser.',
    nav: 'Tools',
    pronunciation: {
      title: 'How is it pronounced?',
      description:
        'Type a word and see its real pronunciation, with every sound change explained.',
      inputLabel: 'Word or sentence in Hangul',
      placeholder: 'E.g. 국물',
      empty: 'Type something in Hangul to see how it is pronounced.',
      result: 'Pronunciation',
      noChanges: 'No sound changes: this is pronounced exactly as written.',
      steps: 'Step by step',
      rulesUsed: 'Rules used',
      example: 'E.g.',
      limitationsTitle: "What the tool can't detect",
      limitationsIntro:
        'The rules are applied automatically from the spelling. Some cases depend on the meaning of the word and are not detected:',
    },
    romanization: {
      title: 'Romanization',
      description:
        'Convert between Hangul and the official Revised Romanization, both ways.',
      direction: 'Conversion direction',
      toLatin: 'Hangul → Latin',
      toHangul: 'Latin → Hangul',
      hangulLabel: 'Text in Hangul',
      latinLabel: 'Romanized text',
      hangulPlaceholder: 'E.g. 안녕하세요',
      latinPlaceholder: 'E.g. annyeonghaseyo',
      keepH:
        'It is a noun: keep the h after ㄱ, ㄷ, ㅂ, as the official rule requires (묵호 → Mukho, not Muko).',
      approximate:
        'This conversion is approximate: romanization represents pronunciation, so "silla" becomes 실라 (not 신라). Use a hyphen to split ambiguous syllables: "jung-ang" → 중앙.',
      unrecognized: 'Not recognized as romanization: {{words}}',
    },
    decomposer: {
      title: 'Syllable decomposer',
      description:
        'See the initial consonant, vowel and final consonant of every syllable.',
      inputLabel: 'Text in Hangul',
      placeholder: 'E.g. 한국어',
      hint: 'Shows the initial consonant, the vowel and the final consonant of each syllable.',
      initial: 'Initial',
      medial: 'Vowel',
      final: 'Final',
      consonant: 'Consonant',
      notHangul: 'Not Hangul.',
      truncated: 'Showing the first {{shown}} of {{total}} characters.',
    },
  },
}

type DeepStrings<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]>
}

/** Shape every language's messages must match. */
export type Messages = DeepStrings<typeof en>
