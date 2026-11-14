// Deterministic pseudo-random generator (LCG) so tests don't depend on Math.random.
export function seededRng(seed: number) {
  let value = seed
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648
    return value / 2147483648
  }
}
