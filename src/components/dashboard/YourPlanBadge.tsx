import { Crown, Sprout } from 'lucide-react'
import type { DashboardProfile } from '@/lib/types/dashboard'

type YourPlanBadgeProps = {
  profile: DashboardProfile
  compact?: boolean
}

export function getPlanLabel(profile: DashboardProfile): string {
  if (profile.plan === 'pro') return 'Forest Pro'
  if (profile.hasProAccess && profile.daysLeft > 0) return 'Seedling · Free trial'
  return 'Seedling · Free'
}

export function getPlanDetail(profile: DashboardProfile): string {
  if (profile.plan === 'pro') return 'Active subscription'
  if (profile.hasProAccess && profile.daysLeft > 0) {
    return `${profile.daysLeft} day${profile.daysLeft === 1 ? '' : 's'} of Pro trial left`
  }
  return 'Upgrade for Forest Pro features'
}

export default function YourPlanBadge({ profile, compact = false }: YourPlanBadgeProps) {
  const isPro = profile.plan === 'pro'
  const onTrial = profile.plan !== 'pro' && profile.hasProAccess && profile.daysLeft > 0

  if (compact) {
    return (
      <div
        className={`hidden items-center gap-2 rounded-xl border px-3 py-2 lg:flex ${
          isPro
            ? 'border-[#22C55E]/30 bg-[#22C55E]/10'
            : 'border-white/[0.08] bg-white/[0.03]'
        }`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            isPro ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-white/[0.06] text-neutral-400'
          }`}
        >
          {isPro ? <Crown className="h-3.5 w-3.5" aria-hidden /> : <Sprout className="h-3.5 w-3.5" aria-hidden />}
        </span>
        <div className="text-left leading-tight">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">Your plan</p>
          <p className={`text-xs font-semibold ${isPro ? 'text-[#22C55E]' : 'text-white'}`}>
            {getPlanLabel(profile)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isPro
          ? 'border-[#22C55E]/25 bg-gradient-to-br from-[#22C55E]/[0.08] to-transparent'
          : onTrial
            ? 'border-amber-500/20 bg-amber-500/[0.04]'
            : 'border-white/[0.08] bg-white/[0.02]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            isPro
              ? 'border-[#22C55E]/30 bg-[#22C55E]/15 text-[#22C55E]'
              : 'border-white/[0.08] bg-white/[0.04] text-neutral-400'
          }`}
        >
          {isPro ? <Crown className="h-5 w-5" aria-hidden /> : <Sprout className="h-5 w-5" aria-hidden />}
        </span>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">Your plan</p>
          <p className={`mt-0.5 text-base font-semibold ${isPro ? 'text-[#22C55E]' : 'text-white'}`}>
            {isPro ? 'Forest Pro' : 'Seedling'}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{getPlanDetail(profile)}</p>
        </div>
      </div>
    </div>
  )
}
