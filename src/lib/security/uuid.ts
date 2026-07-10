/** UUID v4 — prevents IDOR via sequential or malformed IDs */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuidV4(value: string | null | undefined): value is string {
  return typeof value === 'string' && UUID_V4.test(value)
}

export function assertUuidV4(value: string | null | undefined, label = 'id'): string {
  if (!isUuidV4(value)) {
    throw new Error(`Invalid ${label}: expected UUID v4`)
  }
  return value
}
