import { enforceRateLimit, type RateLimitBucket } from './rate-limit'
import { RateLimitError } from './rate-limit-errors'
import { logRateLimitViolation } from './audit-log'

export type RateLimitAuditContext = {
  endpoint: string
  user_id?: string
  ip?: string
}

/** Enforce rate limit and emit A09 audit log on violation */
export async function enforceRateLimitAudited(
  bucket: RateLimitBucket,
  key: string,
  audit: RateLimitAuditContext,
): Promise<void> {
  try {
    await enforceRateLimit(bucket, key)
  } catch (err) {
    if (err instanceof RateLimitError) {
      logRateLimitViolation({
        endpoint: audit.endpoint,
        bucket,
        user_id: audit.user_id,
        ip: audit.ip,
      })
    }
    throw err
  }
}
