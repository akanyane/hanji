// Files prefixed with "-" are ignored by the router's route generation.

/** Max length kept from the URL, so a huge pasted link can't freeze the page. */
const MAX_TEXT_LENGTH = 500

/** Validates a free-text search param. */
export function parseTextParam(value: unknown): string | undefined {
  if (typeof value === 'number') return String(value)
  if (typeof value !== 'string' || value === '') return undefined
  return value.slice(0, MAX_TEXT_LENGTH)
}
