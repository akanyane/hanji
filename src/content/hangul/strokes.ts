// Stroke order for every basic, double and compound jamo, as SVG path data
// on a 100×100 grid. Each array item is one stroke, in writing order, drawn
// in the direction the pen moves.
//
// General rules: top to bottom, left to right; horizontal before the
// vertical that crosses it; compound letters follow the order of their parts
// (ㄲ = ㄱ + ㄱ, ㅘ = ㅗ + ㅏ). Shapes follow the printed (sans-serif) form.
//
// ㅈ and ㅊ are drawn with a "7"-shaped first stroke, the most common way it
// is taught; some textbooks split that stroke in two.

/** Full circle starting at the top, drawn counterclockwise like a handwritten ㅇ. */
const circle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} A${r} ${r} 0 1 0 ${cx} ${cy + r} A${r} ${r} 0 1 0 ${cx} ${cy - r}`

export const STROKES: Record<string, string[]> = {
  // Basic consonants
  ㄱ: ['M22 25 H75 V85'],
  ㄴ: ['M25 18 V75 H80'],
  ㄷ: ['M25 25 H75', 'M25 25 V75 H78'],
  ㄹ: ['M25 18 H75 V48', 'M25 48 H75', 'M25 48 V82 H78'],
  ㅁ: ['M25 25 V78', 'M25 25 H75 V78', 'M25 78 H75'],
  ㅂ: ['M28 20 V80', 'M72 20 V80', 'M28 48 H72', 'M28 80 H72'],
  ㅅ: ['M50 18 L22 82', 'M47 45 L80 82'],
  ㅇ: [circle(50, 50, 28)],
  ㅈ: ['M22 22 H72 L25 82', 'M50 50 L80 82'],
  ㅊ: ['M50 10 V20', 'M22 30 H72 L25 85', 'M50 58 L80 85'],
  ㅋ: ['M22 25 H75 V85', 'M22 55 H75'],
  ㅌ: ['M25 22 H75', 'M25 50 H75', 'M25 22 V80 H78'],
  ㅍ: ['M20 25 H80', 'M38 25 V75', 'M62 25 V75', 'M18 75 H82'],
  ㅎ: ['M50 10 V20', 'M25 30 H75', circle(50, 62, 18)],
  // Double (tense) consonants
  ㄲ: ['M14 25 H44 V85', 'M56 25 H86 V85'],
  ㄸ: ['M14 25 H44', 'M14 25 V75 H46', 'M56 25 H86', 'M56 25 V75 H88'],
  ㅃ: [
    'M14 20 V80',
    'M42 20 V80',
    'M14 48 H42',
    'M14 80 H42',
    'M58 20 V80',
    'M86 20 V80',
    'M58 48 H86',
    'M58 80 H86',
  ],
  ㅆ: ['M32 18 L12 82', 'M30 46 L46 82', 'M68 18 L52 82', 'M66 46 L88 82'],
  ㅉ: [
    'M12 22 H44 L14 82',
    'M30 50 L46 82',
    'M54 22 H86 L56 82',
    'M72 50 L88 82',
  ],
  // Basic vowels
  ㅏ: ['M40 12 V88', 'M40 50 H70'],
  ㅑ: ['M40 12 V88', 'M40 38 H70', 'M40 62 H70'],
  ㅓ: ['M30 50 H60', 'M60 12 V88'],
  ㅕ: ['M30 38 H60', 'M30 62 H60', 'M60 12 V88'],
  ㅗ: ['M50 38 V65', 'M12 65 H88'],
  ㅛ: ['M38 38 V65', 'M62 38 V65', 'M12 65 H88'],
  ㅜ: ['M12 40 H88', 'M50 40 V78'],
  ㅠ: ['M12 40 H88', 'M38 40 V78', 'M62 40 V78'],
  ㅡ: ['M12 50 H88'],
  ㅣ: ['M50 12 V88'],
  // Vowels with an extra ㅣ
  ㅐ: ['M30 12 V88', 'M30 50 H52', 'M64 12 V88'],
  ㅒ: ['M30 12 V88', 'M30 38 H52', 'M30 62 H52', 'M64 12 V88'],
  ㅔ: ['M20 50 H44', 'M44 12 V88', 'M70 12 V88'],
  ㅖ: ['M18 38 H42', 'M18 62 H42', 'M42 12 V88', 'M70 12 V88'],
  // Compound vowels
  ㅘ: ['M34 48 V70', 'M10 70 H58', 'M70 10 V90', 'M70 48 H90'],
  ㅙ: ['M28 48 V70', 'M8 70 H50', 'M62 10 V90', 'M62 48 H76', 'M86 10 V90'],
  ㅚ: ['M34 48 V70', 'M10 70 H60', 'M76 10 V90'],
  ㅝ: ['M8 44 H52', 'M30 44 V82', 'M56 54 H72', 'M72 10 V90'],
  ㅞ: ['M6 44 H44', 'M25 44 V82', 'M48 54 H64', 'M64 10 V90', 'M86 10 V90'],
  ㅟ: ['M10 44 H60', 'M35 44 V82', 'M76 10 V90'],
  ㅢ: ['M10 60 H60', 'M76 10 V90'],
}

/** Start point of a stroke (from its leading "M x y"), used to place the stroke number. */
export function strokeStart(path: string): [number, number] {
  const match = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(path)
  return match ? [Number(match[1]), Number(match[2])] : [0, 0]
}
