import { ValidationError } from '@/lib/sanitize'

const MAX_SESSION_DURATION_S = 10_800 // 3 hours
const MAX_FUTURE_SKEW_MS = 60_000
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

/** Parse ISO / epoch timestamp — must not be in the future */
export function validatePlantedAt(value: unknown, field = 'planted_at'): Date {
  if (value === null || value === undefined) {
    throw new ValidationError(`${field} is required`)
  }

  const date = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`Invalid ${field}`)
  }

  const now = Date.now()
  if (date.getTime() > now + MAX_FUTURE_SKEW_MS) {
    throw new ValidationError(`${field} cannot be in the future`)
  }

  if (date.getTime() < now - MAX_AGE_MS) {
    throw new ValidationError(`${field} is older than 7 days`)
  }

  return date
}

/** session_duration / duration_s must be a positive integer within bounds */
export function validateSessionDuration(value: unknown, field = 'session_duration'): number {
  const raw = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(raw) || raw <= 0) {
    throw new ValidationError(`${field} must be greater than 0`)
  }
  const duration = Math.floor(raw)
  if (duration > MAX_SESSION_DURATION_S) {
    throw new ValidationError(`${field} exceeds maximum allowed duration`)
  }
  return duration
}

export type ValidatedFocusSessionPayload = {
  duration_s: number
  completed: boolean
  task_id: string | null
}

export type ValidatedTreePlantPayload = {
  tree_type: string
  timer_duration: number
  planted_at: string
  task_id: string | null
}

const TREE_TYPES = new Set(['sprout', 'baby', 'half', 'flowering', 'large', 'full'])

/**
 * OWASP A08 — validate offline sync event payloads before DB insert.
 * Rejects tampered session_duration <= 0 or future planted_at timestamps.
 */
export function validateSyncEventPayload(
  type: string,
  payload: Record<string, unknown> | undefined,
): ValidatedFocusSessionPayload | ValidatedTreePlantPayload | null {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Invalid event payload')
  }

  if (type === 'focus_session' || type === 'session') {
    const durationSource =
      payload.session_duration !== undefined ? payload.session_duration : payload.duration_s
    const duration_s = validateSessionDuration(durationSource)
    const completed = payload.completed !== false
    const task_id = typeof payload.task_id === 'string' ? payload.task_id : null

    return {
      duration_s,
      completed,
      task_id,
    }
  }

  if (type === 'tree_plant' || type === 'forest_tree') {
    const plantedSource =
      payload.planted_at !== undefined ? payload.planted_at : payload.grown_at
    const planted_at = validatePlantedAt(plantedSource, 'planted_at').toISOString()

    const tree_type = typeof payload.tree_type === 'string' ? payload.tree_type : ''
    if (!TREE_TYPES.has(tree_type)) {
      throw new ValidationError('Invalid tree_type')
    }

    const timer_duration = validateSessionDuration(
      payload.timer_duration !== undefined ? payload.timer_duration : payload.session_duration,
      'timer_duration',
    )

    const task_id = typeof payload.task_id === 'string' ? payload.task_id : null

    return {
      tree_type,
      timer_duration,
      planted_at,
      task_id,
    }
  }

  return null
}
