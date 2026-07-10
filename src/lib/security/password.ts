import { ValidationError } from '@/lib/sanitize'

export const PASSWORD_REQUIREMENTS =
  'Password must be at least 8 characters with one uppercase letter and one number.'

/** OWASP A07 — password policy: 8+ chars, 1 uppercase, 1 number */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: PASSWORD_REQUIREMENTS }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: PASSWORD_REQUIREMENTS }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: PASSWORD_REQUIREMENTS }
  }
  return { valid: true }
}

export function assertPassword(password: string): void {
  const result = validatePassword(password)
  if (!result.valid) {
    throw new ValidationError(result.error ?? PASSWORD_REQUIREMENTS)
  }
}
