import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { RateLimitError } from './rate-limit-errors'

export type RateLimitBucket =
  | 'auth-ip'
  | 'auth-login-fail'
  | 'api-user'
  | 'account-delete'
  | 'tree-plant-user'
  | 'planner-user-daily'
  | 'planner-user-weekly'
  | 'sync-user'

type WindowConfig = {
  requests: number
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`
  prefix: string
}

const BUCKET_CONFIG: Record<RateLimitBucket, WindowConfig> = {
  'auth-ip': { requests: 10, window: '15 m', prefix: 'rl:auth:ip' },
  'auth-login-fail': { requests: 5, window: '15 m', prefix: 'rl:auth:login:fail' },
  'api-user': { requests: 120, window: '15 m', prefix: 'rl:api:user' },
  'account-delete': { requests: 3, window: '1 d', prefix: 'rl:account:delete' },
  'tree-plant-user': { requests: 20, window: '1 d', prefix: 'rl:tree:user' },
  'planner-user-daily': { requests: 50, window: '1 d', prefix: 'rl:planner:user:d' },
  'planner-user-weekly': { requests: 200, window: '7 d', prefix: 'rl:planner:user:w' },
  'sync-user': { requests: 100, window: '1 d', prefix: 'rl:sync:user' },
}

/** Server-side planner weekly cap — enforced in API, not on client */
export const PLANNER_WEEKLY_REQUEST_CAP = BUCKET_CONFIG['planner-user-weekly'].requests

function isUpstashConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/** In-memory sliding window — single-instance dev fallback only */
const memoryStore = new Map<string, number[]>()

async function memoryLimit(key: string, requests: number, windowMs: number): Promise<{ success: boolean; reset: number }> {
  const now = Date.now()
  const hits = (memoryStore.get(key) ?? []).filter(t => now - t < windowMs)

  if (hits.length >= requests) {
    const oldest = hits[0] ?? now
    return { success: false, reset: oldest + windowMs }
  }

  hits.push(now)
  memoryStore.set(key, hits)
  return { success: true, reset: now + windowMs }
}

function windowToMs(window: WindowConfig['window']): number {
  const [amount, unit] = window.split(' ') as [string, string]
  const n = Number(amount)
  switch (unit) {
    case 's':
      return n * 1000
    case 'm':
      return n * 60_000
    case 'h':
      return n * 3_600_000
    case 'd':
      return n * 86_400_000
    default:
      return 60_000
  }
}

const upstashLimiters = new Map<RateLimitBucket, Ratelimit>()

function getUpstashLimiter(bucket: RateLimitBucket): Ratelimit {
  const existing = upstashLimiters.get(bucket)
  if (existing) return existing

  const cfg = BUCKET_CONFIG[bucket]
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(cfg.requests, cfg.window),
    prefix: cfg.prefix,
    analytics: true,
  })

  upstashLimiters.set(bucket, limiter)
  return limiter
}

export async function checkRateLimit(
  bucket: RateLimitBucket,
  key: string,
): Promise<{ success: boolean; retryAfterSec?: number }> {
  const cfg = BUCKET_CONFIG[bucket]
  const scopedKey = `${cfg.prefix}:${key}`

  if (isUpstashConfigured()) {
    const limiter = getUpstashLimiter(bucket)
    const result = await limiter.limit(scopedKey)
    if (!result.success) {
      const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
      return { success: false, retryAfterSec }
    }
    return { success: true }
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(`[rate-limit] Upstash not configured — using in-memory fallback for ${bucket}`)
  }

  const windowMs = windowToMs(cfg.window)
  const result = await memoryLimit(scopedKey, cfg.requests, windowMs)
  if (!result.success) {
    return {
      success: false,
      retryAfterSec: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    }
  }

  return { success: true }
}

/** Peek remaining attempts without consuming a token (login lockout pre-check). */
export async function getRateLimitRemaining(bucket: RateLimitBucket, key: string): Promise<number> {
  const cfg = BUCKET_CONFIG[bucket]
  const scopedKey = `${cfg.prefix}:${key}`

  if (isUpstashConfigured()) {
    const limiter = getUpstashLimiter(bucket)
    const { remaining } = await limiter.getRemaining(scopedKey)
    return remaining
  }

  const windowMs = windowToMs(cfg.window)
  const now = Date.now()
  const hits = (memoryStore.get(scopedKey) ?? []).filter(t => now - t < windowMs)
  return Math.max(0, cfg.requests - hits.length)
}

/** Throws RateLimitError when limit exceeded */
export async function enforceRateLimit(bucket: RateLimitBucket, key: string): Promise<void> {
  const { success, retryAfterSec } = await checkRateLimit(bucket, key)
  if (!success) {
    throw new RateLimitError('Rate limit exceeded', retryAfterSec)
  }
}

export function rateLimitResponse(retryAfterSec?: number): Response {
  return Response.json(
    { error: 'Rate limit exceeded' },
    {
      status: 429,
      headers: retryAfterSec ? { 'Retry-After': String(retryAfterSec) } : undefined,
    },
  )
}
