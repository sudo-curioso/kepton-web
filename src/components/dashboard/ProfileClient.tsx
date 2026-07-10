'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ShieldAlert, Trash2, User } from 'lucide-react'
import type { DashboardProfile } from '@/lib/types/dashboard'
import { createClient } from '@/lib/supabase/client'
import { SUPPORT_MAILTO } from '@/lib/constants'
import DashboardHeader from './DashboardHeader'
import YourPlanBadge from './YourPlanBadge'
import DeleteAccountDialog from './DeleteAccountDialog'

type ProfileClientProps = {
  profile: DashboardProfile
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDeleted = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DashboardHeader profile={profile} live={false} />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">Account</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Manage your Kepton account and data preferences.
          </p>
        </div>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-neutral-300">
              <User className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-medium text-white">{profile.name}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{profile.email}</span>
              </p>
              <div className="mt-4">
                <YourPlanBadge profile={profile} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white">Delete account</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Permanently remove your Kepton account, forest, tasks, and focus history. You will need
                to type your email to confirm. Active subscriptions must be cancelled in Google Play
                or the App Store separately.
              </p>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-200"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete Account
              </button>
              <p className="mt-3 text-xs text-neutral-500">
                Need help?{' '}
                <a href={SUPPORT_MAILTO} className="text-neutral-400 underline-offset-2 hover:text-white hover:underline">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <DeleteAccountDialog
        open={deleteOpen}
        email={profile.email}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
