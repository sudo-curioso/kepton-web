/** Offline sync — client_timestamp must be within 7 days and not in the future */
export function validateClientTimestamp(value: unknown): Date {
  if (value === null || value === undefined) {
    throw new Error('client_timestamp is required')
  }

  const date = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid client_timestamp')
  }

  const now = Date.now()
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000

  if (date.getTime() > now + 60_000) {
    throw new Error('client_timestamp cannot be in the future')
  }

  if (date.getTime() < now - maxAgeMs) {
    throw new Error('client_timestamp is older than 7 days')
  }

  return date
}
