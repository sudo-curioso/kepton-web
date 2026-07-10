/**
 * OWASP A03 — Injection prevention utilities.
 * Supabase client uses parameterized queries only; never concatenate user input into SQL.
 */

/** SQL / script injection patterns blocked in planner context notes */
const INJECTION_PATTERNS: RegExp[] = [
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE|SCRIPT|TRUNCATE)\b/gi,
  /(--|\/\*|\*\/|;)/,
  /<script\b/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /\bOR\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+/gi,
]

export const TASK_BUCKETS = ['today', 'week', 'later', 'trash'] as const
export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const
export const USER_PLANS = ['free', 'pro'] as const

export type TaskBucket = (typeof TASK_BUCKETS)[number]
export type TaskStatus = (typeof TASK_STATUSES)[number]

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/** Base text sanitizer — strip HTML, control chars, collapse whitespace */
export function sanitizeText(input: string, maxLen = 200): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

/** Task titles: strip HTML, max 200 chars, trim */
export function sanitizeTaskTitle(input: string): string {
  return sanitizeText(input, 200)
}

/** User display name: letters, spaces, hyphens, apostrophes — max 50 */
export function sanitizeUserName(input: string): string {
  const stripped = sanitizeText(input, 50)
  return stripped
    .replace(/[^a-zA-Z\s\-']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50)
}

/** Planner context notes — blocks common injection patterns, max 300 chars */
export function sanitizeContextNote(input: string): string {
  let text = sanitizeText(input, 300)
  for (const pattern of INJECTION_PATTERNS) {
    text = text.replace(pattern, '')
  }
  return text.replace(/\s+/g, ' ').trim().slice(0, 300)
}

/** Alias used by planner flows */
export function sanitizeInput(input: string, maxLen = 300): string {
  return sanitizeContextNote(input).slice(0, maxLen)
}

/** Validate enum values before processing — returns null if invalid */
export function assertEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | null {
  if (typeof value !== 'string') return null
  return (allowed as readonly string[]).includes(value) ? (value as T) : null
}

export function requireEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string,
): T {
  const parsed = assertEnum(value, allowed)
  if (!parsed) {
    throw new ValidationError(`Invalid ${label}`)
  }
  return parsed
}

function sanitizeTaskSteps(value: unknown): { text: string; done: boolean }[] | undefined {
  if (!Array.isArray(value)) return undefined

  return value.slice(0, 20).map(step => {
    if (!step || typeof step !== 'object') {
      throw new ValidationError('Invalid task steps')
    }
    const record = step as Record<string, unknown>
    if (typeof record.done !== 'boolean') {
      throw new ValidationError('Invalid task step')
    }
    const text = typeof record.text === 'string' ? sanitizeText(record.text, 500) : ''
    return { text, done: record.done }
  })
}

function sanitizePriority(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined
  return Math.min(10, Math.max(0, Math.floor(value)))
}

export type TaskPatchPayload = {
  title?: string
  bucket?: TaskBucket
  status?: TaskStatus
  priority?: number
  steps?: { text: string; done: boolean }[]
}

/**
 * Server-side task PATCH body — whitelist fields, sanitize text, validate enums.
 * Identity fields (id, user_id) must never come from the request body.
 */
export function parseTaskPatchBody(body: Record<string, unknown>): TaskPatchPayload {
  const patch: TaskPatchPayload = {}

  if ('title' in body) {
    if (typeof body.title !== 'string') throw new ValidationError('Invalid title')
    patch.title = sanitizeTaskTitle(body.title)
  }

  if ('bucket' in body && body.bucket !== undefined) {
    patch.bucket = requireEnum(body.bucket, TASK_BUCKETS, 'bucket')
  }

  if ('status' in body && body.status !== undefined) {
    patch.status = requireEnum(body.status, TASK_STATUSES, 'status')
  }

  if ('priority' in body && body.priority !== undefined) {
    const priority = sanitizePriority(body.priority)
    if (priority === undefined) throw new ValidationError('Invalid priority')
    patch.priority = priority
  }

  if ('steps' in body && body.steps !== undefined) {
    patch.steps = sanitizeTaskSteps(body.steps)
  }

  return patch
}

/** Sanitize email for auth — trim + lowercase; Supabase validates format */
export function sanitizeEmail(input: string): string {
  return sanitizeText(input, 254).toLowerCase()
}
