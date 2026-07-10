/** OWASP A07 — enumeration-safe auth responses (same for known / unknown emails) */

export const SIGNUP_RESPONSE_MESSAGE =
  "If this email is new, you'll receive a confirmation link. Please check your inbox."

export const FORGOT_PASSWORD_RESPONSE_MESSAGE =
  "If an account exists for this email, you'll receive reset instructions shortly."

export const LOGIN_INVALID_MESSAGE = 'Invalid email or password.'

export const LOGIN_LOCKOUT_MESSAGE = 'Too many failed attempts. Please try again in 15 minutes.'
