export { getAuthenticatedUser, requireAuthenticatedUser } from './auth'
export { AuthError, ValidationError } from './errors'
export type { AuthenticatedUser } from './auth'
export {
  assertResourceOwnership,
  assertProAccess,
  getServerAccessContext,
} from './access-control'
export type { AccessContext, SubscriptionTier } from './access-control'
export { withAuth, forbidden, notFound, unauthorized } from './api'
export { sanitizeRedirectPath } from './redirect'
export { assertUuidV4, isUuidV4 } from './uuid'
export {
  assertHttpsUrl,
  applySecurityHeaders,
  enforceHttps,
  isProduction,
} from './transport'
export {
  auditPublicEnvVars,
  validateServerEnv,
  getPublicSupabaseConfig,
  CLIENT_SAFE_PUBLIC_KEYS,
} from './env'

export { getClientIp } from './client-ip'
export {
  checkRateLimit,
  enforceRateLimit,
  getRateLimitRemaining,
  rateLimitResponse,
  PLANNER_WEEKLY_REQUEST_CAP,
} from './rate-limit'
export type { RateLimitBucket } from './rate-limit'
export { RateLimitError } from './rate-limit-errors'
export { withAuthIpRateLimit, handleRateLimitError } from './rate-limit-middleware'
export { validateClientTimestamp } from './sync'
export {
  validatePlantedAt,
  validateSessionDuration,
  validateSyncEventPayload,
} from './integrity'
export type { ValidatedFocusSessionPayload, ValidatedTreePlantPayload } from './integrity'
export { verifyRevenueCatAuthorization } from './webhooks/revenuecat'
export { validatePassword, assertPassword, PASSWORD_REQUIREMENTS } from './password'
export {
  SIGNUP_RESPONSE_MESSAGE,
  FORGOT_PASSWORD_RESPONSE_MESSAGE,
  LOGIN_INVALID_MESSAGE,
  LOGIN_LOCKOUT_MESSAGE,
} from './auth-messages'
export { isLoginLocked, recordLoginFailure, hashEmailForRateLimit } from './auth-rate-limit'
export { logApiError, maskEmail } from './logging'
export {
  writeAuditLog,
  logSecurityAlert,
  logRateLimitViolation,
  logAuthSignup,
  logAuthLoginSuccess,
  logAuthLoginFailed,
  logAuthLoginLockout,
  logAuthLogout,
  logAuthPasswordReset,
  logSubscriptionEvent,
  mapRevenueCatAuditEvent,
} from './audit-log'
export type { AuditEvent, AuditLevel } from './audit-log'
export { trackFailedLoginAlert, trackTreePlantAlert } from './audit-alerts'
export { enforceRateLimitAudited } from './rate-limit-audit'
export type { RateLimitAuditContext } from './rate-limit-audit'
export { getAllowedOrigins, handleApiCors, withCorsHeaders } from './cors'
export { isBlockedDebugRoute, validateProductionEnv } from './production'
export { createServiceWriteClient } from './service-write'
export { verifyRevenueCatWebhook, resolvePlanFromEvent } from './webhooks/revenuecat'
export type { RevenueCatWebhookPayload, WebhookVerifyResult } from './webhooks/revenuecat'

export {
  sanitizeText,
  sanitizeTaskTitle,
  sanitizeUserName,
  sanitizeContextNote,
  sanitizeInput,
  sanitizeEmail,
  parseTaskPatchBody,
  assertEnum,
  requireEnum,
  TASK_BUCKETS,
  TASK_STATUSES,
} from '@/lib/sanitize'
export type { TaskBucket, TaskStatus, TaskPatchPayload } from '@/lib/sanitize'
