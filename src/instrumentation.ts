export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateServerEnv } = await import('@/lib/security/env')
    validateServerEnv()

    if (process.env.VERCEL_ENV === 'production') {
      const { validateProductionEnv } = await import('@/lib/security/production')
      validateProductionEnv()
    }
  }
}
