/** Local calendar day of a timestamp, as `YYYY-MM-DD`. */
export function dayKey(time: number | Date): string {
  const d = new Date(time)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

/** The day key `offset` calendar days away (DST-safe: uses local dates, not 24h steps). */
export function shiftDay(key: string, offset: number): string {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + offset))
}

/** Day keys from `days - 1` days ago up to `today`, oldest first. */
export function lastDays(today: string, days: number): string[] {
  return Array.from({ length: days }, (_, i) => shiftDay(today, i - days + 1))
}
