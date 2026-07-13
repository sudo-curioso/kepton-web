'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'
import KeptonLogo from '@/components/KeptonLogo'
import { DASHBOARD_PATH, SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/lib/constants'
import { sanitizeEmail, sanitizeUserName } from '@/lib/sanitize'
import { validatePassword, PASSWORD_REQUIREMENTS } from '@/lib/security/password'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type AuthMode = 'login' | 'signup'

type AuthPageProps = {
  initialMode?: AuthMode
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  icon: typeof Mail
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          aria-hidden
        />
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-[#22C55E]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#22C55E]/20"
        />
      </div>
    </div>
  )
}

export default function AuthPage({ initialMode = 'signup' }: AuthPageProps) {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setError('')
    setSuccess('')
    setForgotOpen(false)
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccess('')

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter the email address for your account.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitizeEmail(email) }),
      })
      const data = (await res.json()) as { message?: string }
      setSuccess(data.message ?? "If an account exists for this email, you'll receive reset instructions shortly.")
      setForgotOpen(false)
    } catch {
      setSuccess("If an account exists for this email, you'll receive reset instructions shortly.")
      setForgotOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (mode === 'signup') {
      const passwordCheck = validatePassword(password)
      if (!passwordCheck.valid) {
        setError(passwordCheck.error ?? PASSWORD_REQUIREMENTS)
        return
      }
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name.')
        return
      }
      if (!sanitizeUserName(name)) {
        setError('Please enter a valid name (letters, spaces, and hyphens only).')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    try {
      if (!isSupabaseConfigured()) {
        setError('Account system is not configured yet. Please try again later.')
        return
      }

      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: sanitizeEmail(email),
            password,
            name: sanitizeUserName(name),
          }),
        })

        const data = (await res.json()) as {
          error?: string
          message?: string
          sessionEstablished?: boolean
        }

        if (!res.ok && data.error) {
          setError(data.error)
          return
        }

        if (data.sessionEstablished) {
          router.push(DASHBOARD_PATH)
          router.refresh()
          return
        }

        setSuccess(data.message ?? "If this email is new, you'll receive a confirmation link. Please check your inbox.")
        switchMode('login')
        return
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sanitizeEmail(email),
          password,
        }),
      })

      const data = (await res.json()) as { error?: string; ok?: boolean }

      if (!res.ok) {
        setError(data.error ?? 'Invalid email or password.')
        return
      }

      router.push(DASHBOARD_PATH)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-emerald-600/8 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col justify-center pb-12"
        >
          <div className="mb-8 text-center">
            <KeptonLogo size="lg" href="/" wordmarkClassName="text-lg font-semibold tracking-tight" />
            <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              {mode === 'signup'
                ? 'Start your 14-day free trial and grow your forest.'
                : 'Sign in to open your live forest dashboard.'}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-black/20 p-1">
              {(['signup', 'login'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${
                    mode === tab
                      ? 'bg-[#22C55E] text-black shadow-[0_4px_20px_rgba(34,197,94,0.35)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab === 'signup' ? 'Sign up' : 'Sign in'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === 'signup' ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'signup' ? -12 : 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {mode === 'signup' && (
                    <Field
                      id="name"
                      label="Full name"
                      type="text"
                      value={name}
                      onChange={setName}
                      placeholder="Alex Morgan"
                      icon={User}
                      autoComplete="name"
                    />
                  )}

                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    icon={Mail}
                    autoComplete="email"
                  />

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-xs font-medium text-neutral-400"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                        aria-hidden
                      />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="8+ chars, 1 uppercase, 1 number"
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 pl-10 pr-11 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-[#22C55E]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#22C55E]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <Field
                      id="confirmPassword"
                      label="Confirm password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Repeat your password"
                      icon={Lock}
                      autoComplete="new-password"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {mode === 'login' && !forgotOpen && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOpen(true)
                      setError('')
                      setSuccess('')
                    }}
                    className="text-xs text-neutral-500 transition-colors hover:text-[#22C55E]"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === 'login' && forgotOpen && (
                <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                  <p className="text-xs text-neutral-400">
                    Enter your email and we&apos;ll send reset instructions if an account exists.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="mt-3 text-xs font-semibold text-[#22C55E] transition-colors hover:text-emerald-400 disabled:opacity-60"
                  >
                    Send reset link
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="ml-4 text-xs text-neutral-500 transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
                  role="status"
                >
                  {success}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] py-3.5 text-sm font-bold text-black shadow-[0_8px_30px_rgba(34,197,94,0.35)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : mode === 'signup' ? (
                  'Create account'
                ) : (
                  'Sign in'
                )}
              </button>

              <p className="text-center text-xs leading-relaxed text-neutral-600">
                By continuing, you agree to Kepton&apos;s{' '}
                <Link href="/terms" className="text-neutral-400 underline-offset-2 hover:text-[#22C55E] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-neutral-400 underline-offset-2 hover:text-[#22C55E] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-[#22C55E] transition-colors hover:text-emerald-400"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to Kepton?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-semibold text-[#22C55E] transition-colors hover:text-emerald-400"
                >
                  Create an account
                </button>
              </>
            )}
          </p>

          <p className="mt-4 text-center text-xs text-neutral-600">
            Need help?{' '}
            <a href={SUPPORT_MAILTO} className="text-neutral-400 transition-colors hover:text-[#22C55E]">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
