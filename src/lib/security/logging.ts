/** OWASP A05/A09 — safe error logging (no tokens/PII) */
export function logApiError(context: string, err: unknown): void {
  const message = err instanceof Error ? err.message : 'Unknown error'
  console.error(
    JSON.stringify({
      level: 'error',
      category: 'security',
      event: 'api.error',
      timestamp: new Date().toISOString(),
      context,
      message,
    }),
  )
}

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
  maskEmail,
} from './audit-log'
export type { AuditEvent, AuditLevel } from './audit-log'
