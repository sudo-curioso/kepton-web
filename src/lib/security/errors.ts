export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403 | 404,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export { ValidationError } from '@/lib/sanitize'
