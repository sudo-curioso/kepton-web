'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { sanitizeEmail } from '@/lib/sanitize'

type DeleteAccountDialogProps = {
  open: boolean
  email: string
  onClose: () => void
  onDeleted: () => void
}

export default function DeleteAccountDialog({
  open,
  email,
  onClose,
  onDeleted,
}: DeleteAccountDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizedEmail = sanitizeEmail(email)
  const normalizedConfirmation = sanitizeEmail(confirmation)
  const emailMatches =
    normalizedConfirmation.length > 0 && normalizedConfirmation === normalizedEmail

  useEffect(() => {
    if (!open) {
      setConfirmation('')
      setError('')
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, loading, onClose])

  const handleDelete = async () => {
    if (!emailMatches || loading) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedConfirmation }),
      })

      const data = (await res.json().catch(() => ({}))) as { error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Could not delete account. Please try again or contact support.')
        setLoading(false)
        return
      }

      onDeleted()
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-account-title"
          aria-describedby="delete-account-desc"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={() => {
              if (!loading) onClose()
            }}
          />

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            className="relative w-full max-w-md rounded-2xl border border-red-500/20 bg-[#111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </div>

            <h2 id="delete-account-title" className="text-lg font-semibold text-white">
              Permanently delete account?
            </h2>
            <p id="delete-account-desc" className="mt-2 text-sm leading-relaxed text-neutral-400">
              This will permanently delete your account and all data. This cannot be undone.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Under our Privacy Policy, personal data is removed when you delete your account. Limited
              records may be retained only where required by law.
            </p>

            <div className="mt-5">
              <label htmlFor="delete-email-confirm" className="mb-1.5 block text-xs font-medium text-neutral-400">
                Type your email to confirm
              </label>
              <input
                id="delete-email-confirm"
                type="email"
                value={confirmation}
                onChange={e => setConfirmation(e.target.value)}
                placeholder={email}
                autoComplete="off"
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-red-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-red-500/15 disabled:opacity-60"
              />
            </div>

            {error ? (
              <p className="mt-3 text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-white/[0.1] px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!emailMatches || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Permanently Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
