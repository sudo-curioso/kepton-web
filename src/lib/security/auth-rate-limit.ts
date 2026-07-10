import crypto from 'crypto'
import { checkRateLimit, getRateLimitRemaining, type RateLimitBucket } from './rate-limit'

const LOGIN_FAIL_BUCKET: RateLimitBucket = 'auth-login-fail'
const LOCKOUT_WINDOW_SEC = 15 * 60

/** Hash email for rate-limit keys — never store raw email in Redis */
export function hashEmailForRateLimit(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 32)
}

/** Pre-check lockout without consuming an attempt token */
export async function isLoginLocked(email: string): Promise<{ locked: boolean; retryAfterSec?: number }> {
  const key = hashEmailForRateLimit(email)
  const remaining = await getRateLimitRemaining(LOGIN_FAIL_BUCKET, key)
  if (remaining > 0) return { locked: false }
  return { locked: true, retryAfterSec: LOCKOUT_WINDOW_SEC }
}

/** Record a failed login attempt (consumes one lockout token). */
export async function recordLoginFailure(
  email: string,
): Promise<{ locked: boolean; retryAfterSec?: number }> {
  const key = hashEmailForRateLimit(email)
  const { success, retryAfterSec } = await checkRateLimit(LOGIN_FAIL_BUCKET, key)
  return { locked: !success, retryAfterSec: retryAfterSec ?? LOCKOUT_WINDOW_SEC }
}
