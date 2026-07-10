'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LayoutDashboard, LogOut, Radio, TreePine, User } from 'lucide-react'
import type { DashboardProfile } from '@/lib/types/dashboard'
import { createClient } from '@/lib/supabase/client'
import KeptonLogo from '@/components/KeptonLogo'
import YourPlanBadge from './YourPlanBadge'

type DashboardHeaderProps = {
  profile: DashboardProfile
  live: boolean
}

export default function DashboardHeader({ profile, live }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const onForest = pathname?.startsWith('/dashboard/forest')
  const onDashboard = pathname === '/dashboard'
  const onProfile = pathname?.startsWith('/dashboard/profile')

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // Continue client sign-out even if audit route fails
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <KeptonLogo
            size="md"
            href="/"
            wordmarkClassName="hidden text-sm font-semibold sm:inline"
          />
          <span className="hidden h-4 w-px bg-white/[0.08] sm:block" aria-hidden />
          <span className="hidden truncate text-sm text-neutral-400 md:inline">{profile.email}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:inline-flex ${
              live
                ? 'border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E]'
                : 'border-white/[0.08] bg-white/[0.03] text-neutral-500'
            }`}
          >
            <Radio className="h-3 w-3" aria-hidden />
            Live
          </span>

          <nav className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
            <Link
              href="/dashboard"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                onDashboard
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/dashboard/forest"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 ${
                onForest
                  ? 'bg-[#22C55E] text-black shadow-[0_4px_16px_rgba(34,197,94,0.35)]'
                  : 'text-neutral-300 hover:bg-[#22C55E]/15 hover:text-[#22C55E]'
              }`}
            >
              <TreePine className="h-3.5 w-3.5" aria-hidden />
              Forest
            </Link>
            <Link
              href="/dashboard/profile"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                onProfile
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </nav>

          <YourPlanBadge profile={profile} compact />

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
