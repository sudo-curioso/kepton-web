export class RateLimitError extends Error {
  constructor(
    message = 'Rate limit exceeded',
    public readonly retryAfterSec?: number,
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}
